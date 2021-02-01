---
layout: layout.njk
eleventyNavigation:
  key: plugin-system-optimizer
  title: Optimizer
  order: 9
summary: "A plugin type: Apply modifications to the finished bundle"
---

Optimizers are similar to transformers, but they accept a bundle instead of a single asset. At this stage, any ASTs have already been stringified.

```js
import { Optimizer } from "@parcel/plugin";

export default new Optimizer({
  async optimize({ bundle, contents, map }) {
    let result = minifyCode(contents, map);
    return { contents: result.contents, map: result.contents };
  },
});
```

## Relevant API

{% include "../../api/optimizer.html" %}
