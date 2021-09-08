---
layout: layout.njk
eleventyNavigation:
  key: plugin-system-logger
  title: Diagnostics and Logging
  order: 15
---

Parcel includes support for rich diagnostics that are used to describe errors and warnings in a format-agnostic way. It also includes a built in logging system that allows Reporter plugins to handle all logs and errors and present them to the user.

## Diagnostics

A [`Diagnostic`](/plugin-system/logging/#Diagnostic) is a JavaScript object with a set of properties that are required to create a useful log message. This can be anything from a verbose message to a warning or error. Diagnostics can include a message, information about the file being processed, a code frame, error information, hints on how to potentially resolve the issue, and a link to documentation to learn more.

The `ThrowableDiagnostic` class in the `@parcel/diagnostic` package extends the JavaScript `Error` object with support for diagnostics. When throwing an error within your plugin, use a `ThrowableDiagnostic` object to attach a diagnostic with context about the error. Parcel will automatically attach your plugin name as the origin of the diagnostic.

```js
import ThrowableDiagnostic from '@parcel/diagnostic';

throw new ThrowableDiagnostic({
  diagnostic: {
    message: 'An error occurred'
  }
});
```

You can also throw multiple diagnostics at once by passing an array to the `diagnostic` option of a `ThrowableDiagnostic`.

### Formatting messages

To format the messages in a diagnostic, a very minimal version of Markdown is supported. This format has been specifically built to be compatible with terminals and other render targets such as browsers and editors, while also not being too cryptic when displayed without any formatting. `@parcel/reporter-cli` uses the `@parcel/markdown-ansi` library to convert these Markdown strings to ANSI escape sequences for rendering in a terminal.

The supported Markdown features are `**bold**`, `*italic*`/`_italic_`, `__underline__` and `~~strikethrough~~`.

The `@parcel/diagnostic` package includes some utilities for working with Markdown messages. The `md` tagged template literal handles escaping any interpolated expressions within Markdown strings. This ensures that any special Markdown characters within expressions do not affect the formatting.

```js
import {md} from '@parcel/diagnostic';

throw new ThrowableDiagnostic({
  diagnostic: {
    message: md`**Error**: Could not parse ${filePath}`
  }
});
```

There are also utilities for formatting interpolated expressions, including `md.bold`, `md.italic`, `md.underline`, and `md.strikethrough`.

```js
import {md} from '@parcel/diagnostic';

throw new ThrowableDiagnostic({
  diagnostic: {
    message: md`**Error**: Could not parse ${md.underline(filePath)}`
  }
});
```

### Code frames

A [`Diagnostic`](/plugin-system/logging/#Diagnostic) can have one or more code frames attached. A code frame includes a file path along with one or more code highlights, which give context about where in a file an error occurred. Code highlights are defined by the line and column position within the file, and may also have a message to be displayed at that position.

Code frames should also include the source code for the file the error occurred in. If omitted, Parcel will read the file from the file system. However, in many cases the input source code may have come from another plugin that ran before, so the code will have been modified in some way. Including the code in the code frame avoids this issue.

```js
throw new ThrowableDiagnostic({
  diagnostic: {
    message: md`Could not parse ${asset.filePath}`,
    codeFrames: [{
      filePath: asset.filePath,
      code: await asset.getCode(),
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
          message: 'Expected a string but got a number'
        }
      ]
    }]
  }
});
```

### Hints

Diagnostics can also include hints about how to fix a problem, and a link to documentation for users to learn more. These are provided via the `hints` and `documentationURL` properties.

```js
throw new ThrowableDiagnostic({
  diagnostic: {
    message: 'Could not find a config file',
    hints: ['Create a tool.config.json file in the project root.'],
    documentationURL: 'http://example.com/'
  }
});
```

## Logger

Parcel's logger can be used to log messages in plugins. Every function of a plugin is passed a [`Logger`](#PluginLogger) instance as a parameter. This instance has all the information Parcel needs to identify your plugin as the origin of the message.

The logger accepts [diagnostics](#diagnostics), which are JavaScript objects with a standardized set of properties that describe the log message, its origin, and context such as a code frame. [Reporter](/plugin-system/reporter/) plugins use this information to log your message while having complete freedom over how this data is formatted and displayed.

A [`Logger`](#PluginLogger) has a function for each log level, including `verbose`, `info`, `log`, `warn` and `error`. These log levels specify the severity of log messages, which is useful for formatting and filtering. For example, the [`--log-level`](/features/cli/#parameters) CLI option can be used to choose which messages you want to see. Each logging function also has a single parameter, which can either be a single [`Diagnostic`](#Diagnostic) object or an array of diagnostics, depending on how many messages you want to log.

{% note %}

**Note**: The results of Parcel plugins are cached. This means any logs or warnings that a plugin emits will only be shown during a rebuild, and not when cached.

{% endnote %}

### Log levels

| Level   | When to use                                                                                                                             | function(s)                                             |
| ------- | --------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------- |
| verbose | Use this when you want to log anything that can be used for debugging issues, while not being particularly interesting for normal usage. | `logger.verbose(...)`                                   |
| info    | Use this to log any information that is not related to a problem.                                                                        | `logger.info(...)` or `logger.log(...)`                 |
| warning | Use this to log anything related to a problem that is not critical.                                                                      | `logger.warning(...)`                                   |
| error   | Use this to log any critical issues. You may want to throw a [`ThrowableDiagnostic`](#ThrowableDiagnostic) instead to cause the build to fail.                                          | `logger.error(...)` or `throw ThrowableDiagnostic(...)` |

### How to log a message

Once you're familiar with the [`Diagnostic`](#Diagnostic) format, you can log anything you want, from verbose messages to errors with code frames and hints. This example shows how to log a warning, complete with a code frame, hints, and a documentation URL.

```js
import {Transformer} from '@parcel/plugin';

export default new Transformer({
  async transform({asset, logger}) {
    // ...

    logger.warn({
      message: 'This feature is deprecated.',
      codeFrames: [{
        filePath: asset.filePath,
        code: await asset.getCode(),
        codeHighlights: [{
          start: {
            line: 1,
            column: 5
          },
          end: {
            line: 1,
            column: 10
          }
        }]
      }],
      hints: ['Please use this other feature instead.'],
      documentationURL: 'http://example.com/'
    });
  },
});
```

## Automatically collected logs and errors

Parcel automatically collects any logs created with `console.log` and other `console` methods. Whenever `console.log` is called, Parcel catches this, converts it to a [`Diagnostic`](#Diagnostic) object, and sends it to [Reporter](/plugin-system/reporter/) plugins just like it does with messages sent to the `logger`. However, this is not recommended since Parcel does not have as much information as when calling the `logger` directly.

Parcel also handles any errors that are thrown within plugins. These are converted into a [`Diagnostic`](#Diagnostic), and information about about the plugin is added to it. Errors that are thrown are sent to [Reporter](/plugin-system/reporter/) plugins, and the build is halted.

### API

{% include "../../api/logger.html" %}
{% include "../../api/diagnostic.html" %}
