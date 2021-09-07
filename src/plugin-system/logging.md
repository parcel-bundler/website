---
layout: layout.njk
eleventyNavigation:
  key: plugin-system-logger
  title: Logging
  order: 15
summary: The way to output messages to your users
---

## Logger

Every time you want to log something in a plugin, you have to go through the logger. Every function of a plugin is passed a logger instance as a parameter. This instance has already all the information Parcel needs to identify your plugin as the origin of the message.

The logger uses a format we called [diagnostics](#diagnostics) which is a JavaScript object with a standardized set of properties, a [Reporter](/plugin-system/reporter/) uses this information to log your message to its target format while having complete freedom as to how this data should be formatted and displayed.

There is a function for each type of log you can output, these functions are `verbose(diagnostic)`, `info(diagnostic)`, `log(diagnostic)`, `warn(diagnostic)` and `error(diagnostic)`. These log levels are used for defining the severity of your log message, this is useful for formatting and filtering. For example, the end user can use the flag [`--log-level`](/features/cli/#general-parameters) to define which messages it wants to see. Each of these functions also have a single parameter called diagnostic, this parameter can either be a single [diagnostic](#diagnostics) object or an array of diagnostics, depending on how many messages you want to log.

### Log levels

| Level   | When to use                                                                                                                             | function(s)                                             |
| ------- | --------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------- |
| verbose | Use this when you want to log anything that can be used for debugging issues, while not being particularly interesting for normal usage | `logger.verbose(...)`                                   |
| info    | Use this to log any information that is not related to a problem                                                                        | `logger.info(...)` or `logger.log(...)`                 |
| warning | Use this to log anything related to a problem that is not critical                                                                      | `logger.warning(...)`                                   |
| error   | Use this to log any critical issues, you probably want to throw a ThrowableDiagnostic instead                                           | `logger.error(...)` or `throw ThrowableDiagnostic(...)` |

### Logger API

{% include "../../api/logger.html" %}

## Automatically collected logs and errors

Parcel core automatically collects any logs created by calling the global variable `console`, this means whenever you do a `console.log` we internally catch this and convert it to a Diagnostic object. This is not recommended as we do not have as much information as we do when calling the logger instance directly. We also do the same for errors, whenever you throw an error we convert it into a Diagnostic, append information about the plugin to it and send it to the logger.

## Diagnostics

A [`Diagnostic`](/plugin-system/logging/#Diagnostic) is a JavaScript object with a set of properties that are required to create a useful log message, this can be anything from a verbose message to an error. This object can includes a message, information about the file, a codeframe, error information and hints on how to potentially resolve the issue.

### Formatting the messages

To format the messages in a diagnostic, we use a very minimal version of markdown specifically built to be compatible with terminals and anything else, while also not being too cryptic when displayed without any formatting. For our `@parcel/reporter-cli` we use our own `@parcel/markdown-ansi` library that converts these markdown strings to ANSI escape sequences.

The supported markdown features are `**bold**`, `*italic*`/`_italic_`, `__underlined__` and `~~strikethrough~~`.

## How to log a message

Once you're familiar with the Diagnostic format, you can log anything you want, from verbose messages to errors with codeframes and hints so your users don't have to search the web for hours to find a solution.

For errors you can also throw an error that has been augmented with diagnostic information, this is very useful for failing a build while also providing a useful error message, with a codeframe and suggestions. This is also the recommended way of throwing errors in Parcel.

An example for every method you can use:

```js
import { Transformer } from "@parcel/plugin";
import ThrowableDiagnostic from "@parcel/diagnostic";

export default new Transformer({
  // ...

  async transform({ asset, ast, config, logger, resolve, options }) {
    logger.verbose({
      message: "Started transforming a dummy asset",
      filePath: asset.filePath,
      language: asset.type,
    });

    logger.info([
      {
        message: "This is an example message",
        filePath: asset.filePath,
        language: asset.type,
      },
      {
        message: "This is another example message",
        filePath: asset.filePath,
        language: asset.type,
      },
    ]);

    logger.warn({
      message: "This is an example message",
      filePath: asset.filePath,
      language: asset.type,
    });

    try {
      loadDummyCompiler();
    } catch (err) {
      throw new ThrowableDiagnostic({
        diagnostic: {
          message: err.message,
          filePath: asset.filePath,
          language: asset.type,
          stack: err.stack,
          name: err.name,
          codeFrame: {
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
                message: "This is an example message inside a **codeframe**",
              },
            ],
          },
          hints: [
            "Install __@dummy/compiler__ using *npm install @dummy/compiler*",
          ],
        },
      });
    }

    // ...
  },
});
```

### API

{% include "../../api/diagnostic.html" %}
