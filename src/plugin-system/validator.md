---
layout: layout.njk
eleventyNavigation:
  key: plugin-system-validator
  title: Validator
  order: 12
summary: "A plugin type: Analyze assets and emit warnings and errors"
---

Validators receive an asset, and can throw errors if that asset is invalid
in some way, e.g. type errors or linting errors.

```js
import { Validator } from "@parcel/plugin";

export default new Validator({
  async validate({ asset }) {
    // ...
    throw error;
  },
});
```

Some validators (such as `@parcel/validator-typescript`) may wish to maintain a project-wide cache for efficiency. For these cases, it is appropriate to use a different interface where parcel hands _all_ changed files to the validator at the same time:

```js
import { Validator } from "@parcel/plugin";

export default new Validator({
  async validateAll({ assets }) {
    // ...
    throw error;
  },
});
```

If your plugin implements `validateAll`, Parcel will make sure to always invoke this method on the same thread (so that your cache state is accessible).

## Relevant API

{% include "../../api/validator.html" %}
