---
layout: layout.njk
eleventyNavigation:
  key: plugin-system-validator
  title: Validator
  order: 11
summary: "A plugin type: Analyze assets and emit warnings and errors"
---

A validator is a plugin type that is used to validate assets, it gets each asset as an input and based on that asset you can throw errors or log warnings with diagnostics to ensure the input is as it should be. This can be linting issues, typing issues or any other validation issue.

Validators run after a build has fully completed, this is to ensure we don't impact performance and focus on more important compilation errors first.

When Parcel is being ran in watch mode, so `parcel watch` or `parcel serve` we still serve/save updated bundles even when a validator throws an error. We log the error and nothing else really happens. However when running `parcel build` we do exit the process with a failure status code to ensure you don't deploy any code that does not meet the criteria set out by your validators. This ensures developers can stay productive and not have too worry about every small typing or linting issue while trying to solve a problem.

## How to write a stateless validator plugin

If a validator shouldn't store any state about the application you can utilise the standard validator plugin format, this gives you one asset at a time allowing us to spread the work across threads, which improves performance.

These validators receive an asset, and can throw errors or log a warning if that asset is invalid in some way, e.g. type errors or linting errors.

To do this properly you should be using diagnostics, these are described in the logger docs under [`diagnostics`](/plugin-system/logger/#diagnostics).

Below you can find a simple example on throwing an Error

```js
import { Validator } from "@parcel/plugin";

export default new Validator({
  async validate({ asset }) {
    // ...
    throw new ThrowableDiagnostic({
      diagnostic: {
        message: "Unexpected console statement",
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
              message: "This console statement is not allowed",
            },
          ],
        },
        hints: ["Remove the console.log(...)"],
      },
    });
  },
});
```

## How to write a stateful validator

Some validators (such as `@parcel/validator-typescript`) may wish to maintain a project-wide state/cache for efficiency. For these cases, it is appropriate to use a different interface where parcel hands _all_ changed files to the validator at the same time.

For this validator type Parcel also ensures to always invoke this validator on the same thread (so that your cache state is accessible).

This type of validator is way slower than the stateless validator type as it runs everything on a single thread, instead of multiple threads. Only use this if you really have no other choice, this is usually the case for validators that need to have access to the entire project, like Typing validators.

An example of such a validator can be found below.

```js
import { Validator } from "@parcel/plugin";

export default new Validator({
  async validateAll({ assets, logger }) {
    // ...
    logger.warn({
      message: "A validation warning",
      filePath: asset.filePath,
      language: asset.type,
    });
  },
});
```

## Relevant API

{% include "../../api/validator.html" %}
