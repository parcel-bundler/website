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

The [`Diagnostic`](/plugin-system/api/#Diagnostic) class exported by `@parcel/plugin` extends the JavaScript `Error` object with support for diagnostics. When throwing an error within your plugin, use a `Diagnostic` object to attach a diagnostic with context about the error. It accepts the properties described above, all of which are optional except for `message` (see [`DiagnosticOptions`](/plugin-system/api/#DiagnosticOptions)). Parcel will automatically attach your plugin name, as written in `.parcelrc`, as the origin of the diagnostic.

```js
import { Diagnostic } from "@parcel/plugin";

throw new Diagnostic({
  message: "An error occurred",
});
```

You can also throw multiple diagnostics at once by passing an array to the `Diagnostic` constructor.

### Code frames

A diagnostic can have one or more code frames attached, which give context about where in a file an error occurred. A code frame includes an absolute file path along with one or more code highlights. Code highlights are defined by the line and column position within the file, and may also have a message to be displayed at that position. The `end` position is inclusive, and defaults to the `start` position if omitted.

Code frames should also include the source code for the file the error occurred in. If omitted, Parcel will read the file from the file system. However, in many cases the input source code may have come from another plugin that ran before, so the code will have been modified in some way. Including the code in the code frame avoids this issue.

```js
throw new Diagnostic({
  message: `Could not parse ${asset.filePath}`,
  codeFrames: [
    {
      filePath: asset.filePath,
      code: asset.getCode(),
      codeHighlights: [
        {
          start: {
            line: 1,
            column: 5,
          },
          end: {
            line: 2,
            column: 3,
          },
          message: "Expected a string but got a number",
        },
      ],
    },
  ],
});
```

When a regular `Error` is thrown, Parcel can also display a code frame. If the error thrown by your plugin has `filename` (or `fileName`), `line`, and `column` properties, Parcel uses them to display a code frame pointing at that location. Otherwise, the location is taken from the top frame of the error's stack. Line and column numbers are 1-based. Many compilers already attach these properties to the errors they throw, so they can often be rethrown as is.

```js
let error = new Error("Expected a string but got a number");
error.fileName = asset.filePath;
error.line = 1;
error.column = 5;
throw error;
```

In this case, Parcel reads the source code for the code frame from the file system.

### Hints

Diagnostics can also include hints about how to fix a problem, and a link to documentation for users to learn more. These are provided via the `hints` and `documentationURL` properties. Diagnostics returned by [native plugins](/plugin-system/native-plugins/#diagnostics) can include a code frame and a hint.

```js
throw new Diagnostic({
  message: "Could not find a config file",
  hints: ["Create a tool.config.json file in the project root."],
  documentationURL: "http://example.com/",
});
```

## Logger

JavaScript plugins log messages using the standard `console` methods. Parcel collects these messages and sends them to [Reporter](/plugin-system/reporter/) plugins, which decide how to display them. When `console` methods are called with anything other than a single string or [diagnostics](#diagnostics), each argument is formatted using `util.inspect`.

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

To log a message with a code frame, hints, or a documentation URL, pass a [`Diagnostic`](/plugin-system/api/#Diagnostic) to a `console` method. Each diagnostic is logged at the level of the method, unless it sets a `severity`. This example shows how to log a warning, complete with a code frame, hints, and a documentation URL, without failing the build.

```js
import { Transformer, Diagnostic } from "@parcel/plugin";

export default new Transformer({
  async transform({ asset }) {
    // ...

    console.warn(
      new Diagnostic({
        message: "This feature is deprecated.",
        codeFrames: [
          {
            filePath: asset.filePath,
            code: asset.getCode(),
            codeHighlights: [
              {
                start: {
                  line: 1,
                  column: 5,
                },
                end: {
                  line: 1,
                  column: 10,
                },
              },
            ],
          },
        ],
        hints: ["Please use this other feature instead."],
        documentationURL: "http://example.com/",
      })
    );
  },
});
```
