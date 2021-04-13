---
layout: layout.njk
eleventyNavigation:
  key: plugin-system-bundler
  title: Bundler
  order: 5
summary: "A plugin type: Turns an asset graph into a bundle graph"
---

{% warning %}
The Bundler API is experimental and therefore subject to change, even between minor updates.
{% endwarning %}

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

## Relevant API

{% include "../../api/bundler.html" %}
