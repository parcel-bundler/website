---
layout: layout.njk
eleventyNavigation:
  key: plugin-system-logger
  title: Logger
  order: 14
summary: The way to output messages to your users
---

## Introduction

Every time you want to log something in a plugin for Parcel, you have to go through the logger. Every function in a plugin has a logger instance as one of it's parameters. This instance has been instantiated with all the information core needs to identify your plugin as the originator.

The logger uses a format we called [Diagnostics](#diagnostics) which is a JavaScript object with a standardized set of properties, a [Reporter](/plugin-system/reporter/) uses this information to log your message to it's target format while having complete freedom as to how this data should be formatted and displayed.

The Logger class has a function for each type of log you can output, these functions are `verbose(diagnostic)`, `info(diagnostic)`, `log(diagnostic)`, `warn(diagnostic)` and `error(diagnostic)`. These log levels are used for defining the severity of your log message, this is useful for formatting and filtering. For example, the end user can use the flag [`--log-level`](/features/cli/#general-parameters) to define which messages it wants to see. Each of these functions also have a single parameter called diagnostic, this parameter can either be a single [diagnostic](#diagnostics) object or an array of [diagnostics](#diagnostics), depending on how many messages you want to log.

## Diagnostics

A diagnostic is a JavaScript object with a predefined set of properties that are required to create a useful log message, this can be anything from a verbose message to an error. This object includes a message, information about the file, a codeframe, error information and hints on how to potentially resolve the issue.

### The properties of a Diagnostic

#### General fields

- `message`(string): This is the message you want to log.
- `filePath`(string): Path to the file this diagnostic is about (optional)
- `language`(string): Language of the file this diagnostic is about (optional)
- `codeFrame`[(CodeFrame)](#codeframe): A codeframe that points to a certain location(s) in the file this diagnostic is about (optional)
- `hints`(Array\<string\>): A list of strings that suggest ways to resolve this issue. (optional)

#### Error related fields

These fields are intended for whenever you are describing an error.

- `stack`(string): A stacktrace of an error (optional)
- `name`(string): A name of an error (optional)

#### CodeFrame

The CodeFrame Object describes how to format a CodeFrame. A CodeFrame is a visualization of a piece of code, with a certain amount of code highlights that point to certain chunk(s) inside the code.

For the formatting of these objects we've built our own CodeFrame library which supports multiple highlights and code formatting. This library is published as `@parcel/codeframe`.

##### Properties of a CodeFrame Object

- `code`(string): The contents of the source file (not required if a filePath is provided to the diagnostic, you however have to be 100% sure the code that this codeframe applies to is still identical to the code at the filePath's location)
- `codeHighlights`: Array of CodeHighlight Object(s)
  - `start`({ line: number, column: number }): the location of the first character that should get highlighted for this highlight, both line and column start at **1**
  - `end`({ line: number, column: number }): the location of the last character that should get highlighted for this highlight, both line and column start at **1**
  - `message`(string): A message that should be displayed at this location in the code (optional)

### Formatting the messages

To format the messages in a diagnostic we use a very minimal version of markdown specifically built to be compatible with terminals and anything else, while also not being too cryptic when displayed without any formatting. For Parcel's cli-reporter we use our own `@parcel/markdown-ansi` library that converts these markdown strings to ansi.

The supported markdown features are `**bold**`, `*italic*`/`_italic_`, `__underlined__` and `~~strikethrough~~`.

## How to log a message

Once you're familiar with the Diagnostic format you can log anything you want, from verbose messages to errors with codeframes and hints so your users don't have to search the web for hours to find a solution.

An example for every method you can use:

```js
import { Transformer } from "@parcel/plugin";

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
      logger.error({
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
      });
    }

    // ...
  },
});
```

## Automatically collected logs and errors

Parcel core automatically collects any logs created by calling the global variable `console`, this means whenever you do a `console.log` we internally catch this and convert it to a Diagnostic object. This is not recommended as we do not have as much information as we do when calling the logger instance directly. We also do the same for errors, whenever you throw an error we convert it into a Diagnostic, append information about the plugin to it and send it to the logger.
