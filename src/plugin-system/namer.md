---
layout: layout.njk
eleventyNavigation:
  key: namer
  order: 4
summary: "A plugin type: Generates a name for a bundle"
---

Namers accept a bundle and output a filename for that bundle.

```js
import { Namer } from "@parcel/plugin";

export default new Namer({
  async name({ bundle, bundleGraph }) {
    // ...
    return name;
  },
});
```
