---
layout: layout.njk
eleventyNavigation:
  key: plugin-system-runtime
  title: Runtime
  order: 7
summary: "A plugin type: Programatically insert assets out of thin air into bundles"
---

Runtimes accept a bundle and return assets to be inserted into that bundle.

```js
import { Runtime } from "@parcel/runtime";

export default new Runtime({
  async apply({ bundle, bundleGraph }) {
    // ...
    return assets;
  },
});
```

## Relevant API

{% include "../../api/runtime.html" %}
