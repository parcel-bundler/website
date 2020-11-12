---
layout: layout.njk
eleventyNavigation:
  key: plugin-system-namer
  title: Namer
  order: 6
summary: "A plugin type: Generates an output-filepath for a bundle"
---

Namers accept a bundle and output a filepath for that bundle (the resulting path should be relative to `rootDir`).

```js
import { Namer } from "@parcel/plugin";

export default new Namer({
  async name({ bundle, bundleGraph, logger, options }) {
    if (bundle.filePath != null) {
      // a target specified a output path
      return bundle.filePath;
    }

    let name = yourNamingFunction(bundle);
    if (!bundle.isEntry) {
      name += "." + bundle.hashReference;
    }
    return name + "." + bundle.type;
  },
});
```

{% error %}
You have to ensure that the bundle filepaths are unique.
{% enderror %}

Namers have complete freedom over the filepaths, but they should still follow these rules:

- Return `bundle.filePath` if it's set, to make sure that the output file set in `package.json#targets` is respected.
- If `bundle.isEntry` is true, don't include [the hash in the filename](#Including-a-hash).

## Overriding names for specific bundles

The [`.parcelrc`](/configuration/plugin-configuration/) file allows multiple namers to be specified. If some namer plugin returns `null`, the next namer in the list is queried (and so on).

This makes it easy to override the filename for a specific bundle without having the copy the existing (general) namer.

## Including a hash

If you want to include a hash in the filename that is based on the final bundle contents, insert `bundle.hashReference`. This is an opaque value that will later on be replaced with the actual hash (since at this stage, there is no bundle content to generate the hash of).

{% warning %}
At least in the default namer, hashes also ensure that bundlenames/paths are unique (especially for shared bundles).
{% endwarning %}

## Relevant API

{% include "../../api/namer.html" %}
