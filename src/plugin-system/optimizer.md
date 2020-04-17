---
layout: layout.njk
eleventyNavigation:
  key: Optimizer
  order: 7
summary: "A plugin type: Apply modifications to the finished bundle"
---

Optimizers are similar to transformers, but they accept a bundle instead
of a single asset.

```js
import { Optimizer } from "@parcel/plugin";

export default new Optimizer({
  async optimize({ bundle, contents, map }) {
    // ...
    return { contents, map };
  },
});
```
