---
layout: layout.njk
eleventyNavigation:
  key: plugin-system-validator
  title: Validator
  order: 12
summary: "A plugin type: Analyze assets and emit warnings and errors"
---

{% warning %}
The Validator API is experimental and therefore subject to change, even between minor updates.
{% endwarning %}

A validator is a plugin type that is used to validate assets, it is called on each asset and can throw errors or log warnings with diagnostics to validate the input. These can be linting issues, typing issues or similar.

Validators run after a build has fully completed, this is to ensure we don't impact performance and focus on more important compilation errors first.

When Parcel runs in watch mode (`parcel watch` or `parcel serve`), we still serve/save updated bundles even if a validator throws an error (in this case the error is merely logged).

But when running `parcel build`, Parcel exits with a failure status code to ensure you don't deploy any code that does not meet the criteria set by your validators. This ensures developers can stay productive and don't have to worry about every small typing or linting issue while trying to solve a problem.

## Stateless validator plugins

If a validator doesn't store any state about the application you can use the standard validator plugin interface, this gives you one asset at a time allowing Parcel to spread the work across threads, improving performance.

These validators receive an asset, and can throw errors or log a warning if that asset is invalid in some way, e.g. type errors or linting errors.

We recommend using [diagnostics](/plugin-system/logging/#diagnostics) to signal errors or warnings.

Here is a simple example of emitting an error:

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

## Stateful validator plugins

Some validators (such as `@parcel/validator-typescript`) may wish to maintain a project-wide state/cache for efficiency. For these cases, it is appropriate to use a different interface where parcel passses _all_ changed files to the validator at the same time.

For this validator type, Parcel also ensures to always invoke this validator on the same thread (so that your cache state is accessible). This means that you can define a top-level variable and it will always remain available (and that it retains its value across multiple invocations of `validateAll`).

This type of validator is typically slower than the stateless validator type as it runs everything on a single thread, instead of multiple threads. Only use this if you have no other choice, as is usually the case for validators that need to have access to the entire project, like typing validators.

An example of such a validator can be found below.

```js
import { Validator } from "@parcel/plugin";

// You keep the state in a top-level variable
let state = {};

export default new Validator({
  async validateAll({ assets, logger }) {
    // ...
    for (let asset of assets) {
      // ...validation logic

      if (hasWarning) {
        logger.warn({
          message: "A validation warning",
          filePath: asset.filePath,
          language: asset.type,
        });
      }
    }
  },
});
```

## Relevant API

{% include "../../api/validator.html" %}
