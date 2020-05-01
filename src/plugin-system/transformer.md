---
layout: layout.njk
eleventyNavigation:
  key: Transformer
  order: 1
summary: "A plugin type: Convert an asset (into another asset)"
---

Transformers _transform_ single assets as they are discovered and added to the
asset graph. They mostly call out to different compilers and preprocessors.

```js
import { Transform } from "@parcel/plugin";

export default new Transform({
  async canReuseAST({ ast, options, logger }) {
    return false;
  }

  async loadConfig({ config, options, logger }) {
    // ...
    return config;
  },

  async parse({ asset, config, logger, resolve, options }) {
    // ...
    return ast;
  },

  async transform({ asset, ast, config, logger, resolve, options }) {
    // ...
    return [asset];
  },

  async generate({ asset, ast, resolve, options }) {
    // ...
    return { code, map };
  },

  async postProcess({assets, config, options, resolve, logger}) {
    return assets;
  }
});
```
