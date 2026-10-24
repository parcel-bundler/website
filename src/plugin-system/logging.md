---
layout: layout.njk
eleventyNavigation:
  key: plugin-system-logger
  title: Diagnostics and Logging
  order: 15
---

Parcel includes support for rich diagnostics that are used to describe errors and warnings in a format-agnostic way. It also includes a built in logging system that allows Reporter plugins to handle all logs and errors and present them to the user.

## Diagnostics

A `Diagnostic` is a JavaScript object with a set of properties that are required to create a useful log message. This can be anything from a verbose message to a warning or error. Diagnostics can include a message, information about the file being processed, a code frame, hints on how to potentially resolve the issue, and a link to documentation to learn more.

```typescript
type Diagnostic = {
  message: string;
  origin: string | null;
  codeFrames: Array<{
    code: string | null;
    url: string | null;
    language: string | null;
    codeHighlights: Array<{
      start: { line: number; column: number };
      end: { line: number; column: number };
      message: string | null;
    }>;
  }>;
  hints: Array<string>;
  severity: "error" | "warning" | "sourceError" | "info";
  documentationURL: string | null;
};
```

Line and column numbers are 1-based. The `url` of a code frame is a `file:` URL for files on disk. [Reporter](/plugin-system/reporter/) plugins receive diagnostics in this format, and have complete freedom over how they are formatted and displayed.

### Throwing errors

When an error is thrown (or a promise is rejected) within a JavaScript plugin, the build fails, and Parcel converts the error into a diagnostic. The error's `message` becomes the message of the diagnostic.

```js
throw new Error("An error occurred");
```

### Code frames

A diagnostic can have a code frame attached, which gives context about where in a file an error occurred. If the error thrown by your plugin has `filename` (or `fileName`), `line`, and `column` properties, Parcel uses them to display a code frame pointing at that location. Otherwise, the location is taken from the top frame of the error's stack. Line and column numbers are 1-based. Many compilers already attach these properties to the errors they throw, so they can often be rethrown as is.

```js
let error = new Error("Expected a string but got a number");
error.fileName = asset.filePath;
error.line = 1;
error.column = 5;
throw error;
```

Parcel reads the source code for the code frame from the file system.

<!-- TODO(v3): JS plugins can only provide message + filename/line/column (crates/plugin-js/src/lib.rs error_to_diagnostic). v2's ThrowableDiagnostic (@parcel/diagnostic), multiple diagnostics, multiple code highlights, highlight messages, code in code frames, hints, documentationURL and the `md` Markdown helpers have no JS equivalent, and the CLI reporter does not render Markdown in messages. Also, the diagnostic origin is not set for JS or native plugin errors – the CLI prints "unknown: <message>" instead of the plugin name. -->

### Hints

Diagnostics can also include hints about how to fix a problem, and a link to documentation for users to learn more. These are provided via the `hints` and `documentationURL` properties. Diagnostics returned by [native plugins](/plugin-system/native-plugins/#diagnostics) can include a code frame and a hint.

## Logger

JavaScript plugins log messages using the standard `console` methods. Parcel collects these messages and sends them to [Reporter](/plugin-system/reporter/) plugins, which decide how to display them. When `console` methods are called with anything other than a single string, each argument is formatted using `util.inspect`.

These log levels specify the severity of log messages, which is useful for formatting and filtering. For example, the [`--log-level`](/features/cli/#parameters) CLI option can be used to choose which messages you want to see.

{% note %}

**Note**: When watching or using the dev server, Parcel only re-runs plugins for the assets affected by a change. This means any logs or warnings that a plugin emits will only be shown when the plugin actually runs, and not on every rebuild.

{% endnote %}

### Log levels

| Level   | When to use                                                                                                                              | function(s)                                    |
| ------- | ---------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------- |
| verbose | Use this when you want to log anything that can be used for debugging issues, while not being particularly interesting for normal usage. | `console.debug(...)`                           |
| info    | Use this to log any information that is not related to a problem.                                                                        | `console.info(...)` or `console.log(...)`      |
| warning | Use this to log anything related to a problem that is not critical.                                                                      | `console.warn(...)`                            |
| error   | Use this to log any critical issues. You may want to throw an error instead to cause the build to fail.                                  | `console.error(...)` or `throw new Error(...)` |

### How to log a message

This example shows how to log a warning from a transformer.

```js
import { Transformer } from "@parcel/plugin";

export default new Transformer({
  async transform({ asset }) {
    // ...

    console.warn(
      `${asset.filePath} uses a deprecated feature. Please use this other feature instead.`
    );
  },
});
```

[Native plugins](/plugin-system/native-plugins/#logging) can log both plain messages and diagnostics, e.g. to emit a warning with a code frame without failing the build.

<!-- TODO(v3): JS plugins cannot log structured diagnostics (code frames, hints) as warnings – console messages are plain strings (crates/plugin-js/src/console.rs). v2's `logger` param (logger.verbose/info/log/warn/error with diagnostics) does not exist. -->
