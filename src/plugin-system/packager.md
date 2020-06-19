---
layout: layout.njk
eleventyNavigation:
  key: plugin-system-packager
  title: Packager
  order: 8
summary: "A plugin type: Turn a group of assets into a bundle file"
---

Packagers determine how to merge different asset types into a single bundle.

```js
import { Packager } from "@parcel/plugin";

export default new Packager({
  async package({ bundle }) {
    // ...
    return { contents, map };
  },
});
```

## Relevant API

{% include "../../api/packager.html" %}
