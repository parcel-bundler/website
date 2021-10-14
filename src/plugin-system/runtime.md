---
layout: layout.njk
eleventyNavigation:
  key: plugin-system-runtime
  title: Runtime
  order: 7
summary: "A plugin type: Programmatically insert assets out of thin air into bundles"
---

{% warning %}
The Runtime API is experimental and therefore subject to change, even between minor updates.
{% endwarning %}

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
