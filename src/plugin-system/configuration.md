---
layout: layout.njk
eleventyNavigation:
  key: Configuration
  order: 12
summary: "Not really a plugin type: A reuseable '.parcelrc' package"
---

This is simply a [`.parcelrc`](/configuration/plugin-configuration/) file wrapped into a published package, the `main` points to the config file.

```json
{
  "name": "parcel-config-foo",
  "main": "index.json",
  "version": "1.0.0",
  "engines": {
    "parcel": "2.x"
  }
}
```

One usecase for this is a system with multiple plugins.
