---
layout: layout.njk
eleventyNavigation:
  key: Bundler
  order: 3
summary: "A plugin type: Turns an asset graph into a bundle graph"
---

Bundlers accept the entire asset graph and modify it to add bundle nodes that group the assets
into output bundles.

```js
import { Bundler } from "@parcel/plugin";

export default new Bundler({
  async bundle({ graph }) {
    // ...
  },

  async optimize({ graph }) {
    // ...
  },
});
```
