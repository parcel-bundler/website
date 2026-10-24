---
layout: layout.njk
eleventyNavigation:
  key: plugin-system-namer
  title: Namer
  order: 6
---

Namer plugins determine the output filename for a bundle. Namers run in a pipeline until one of them returns a result. Returned file paths should be relative to the target `distDir`. See [Targets](/features/targets/) for details about this.

## Overriding names for specific bundles

A common use case for a Namer plugin is to override Parcel’s default naming scheme for specific bundles. Namers may return `null` when they don't handle a bundle to allow the next namer in the pipeline to handle it instead. See [Namers](/features/plugins/#namers) in the Parcel configuration docs for details on how this works.

This example places all `png` and `jpg` files into an `images` folder with the same name as their original filename.

```javascript
import { Namer } from "@parcel/plugin";
import path from "path";

export default new Namer({
  name({ bundle }) {
    if (bundle.type === "png" || bundle.type === "jpg") {
      let filePath = bundle.getMainEntry().filePath;
      return `images/${path.basename(filePath)}`;
    }

    // Allow the next namer to handle this bundle.
    return null;
  },
});
```

{% error %}

**Note**: This example does not ensure that all filenames are unique. If two images had the same filename in different directories, the build would fail.

{% enderror %}

## Content hashing

Including a hash of a bundle’s contents is an important optimization for production builds that enables browsers to cache loaded files indefinitely. When the contents of a bundle changes, so does its filename, which acts as a cache invalidation mechanism. See the [Content hashing](/features/production/#content-hashing) docs for details about this.

At the point bundles are being named, the final contents is not yet known, so Parcel provides a `hashReference` property on each [`Bundle`](/plugin-system/api/#Bundle) object. This is an opaque placeholder value that will later on be replaced with the actual hash when writing the final bundles. Use this in returned bundle names to include a content hash. The `hashReference` must appear exactly once in the file name (not in a directory name) for it to be replaced. Bundles whose names don't include it are not content hashed.

Make sure to check the `bundle.needsStableName` property before including a hash. When this is `true`, a dependency is expecting the filename of the bundle to remain consistent over time. For example, service workers require their URLs never to change, and users expect visible URLs like HTML pages to be human readable and remain consistent.

```javascript/5-7
import {Namer} from '@parcel/plugin';

export default new Namer({
  name({bundle}) {
    let name = yourNamingFunction(bundle);
    if (!bundle.needsStableName) {
      name += "." + bundle.hashReference;
    }
    return name + "." + bundle.type;
  }
});
```

{% note %}

Hashes are also a good way to ensure that returned bundle names are unique, even when content hashing is disabled (e.g. in development, or with `--no-content-hash`). In this case, the `hashReference` is left in the name as is. It is a stable identifier for the bundle, which will not change when the bundle's contents change.

Content hashing is also not applied to inline bundles, or to bundles built for server environments (e.g. Node) or library targets, even if their names include the `hashReference`.

{% endnote %}

## Targets

Namer plugins should also respect the [`Target`](/plugin-system/api/#Target) associated with a bundle. For example, the target's `environment` and `outputFormat` may affect the file extension to use. [Targets](/features/targets/) also allow users to configure the output filenames of entry bundles in `package.json` (e.g. using [`exports`](/features/targets/#library-targets) for libraries). Parcel uses these filenames directly, and does not call Namer plugins for these bundles.

## Loading configuration

Configuration for a Namer plugin is specified in the user's `.parcelrc`, and passed to the `name` method as the `config` option. See [Configuration](/plugin-system/authoring-plugins/#configuration) for details.

## Native namers

Namers can also be written as [native plugins](/plugin-system/native-plugins/). With the Rust SDK, implement the `name` method of the `Plugin` trait, and return `None` to let the next namer in the pipeline handle the bundle.

```rust
use parcel_plugin::{register_plugin, Bundle, BundleGraph, Diagnostic, Options, Plugin};
use std::path::Path;

struct ImageNamer;

impl Plugin for ImageNamer {
  fn new(_config: &[u8]) -> Result<Self, Diagnostic> {
    Ok(ImageNamer)
  }

  fn name(
    &self,
    bundle_graph: &BundleGraph,
    bundle: &Bundle,
    _options: &Options,
  ) -> Result<Option<String>, Diagnostic> {
    let ty = bundle.asset_type();
    if ty != "png" && ty != "jpg" {
      return Ok(None);
    }

    let Some(asset) = bundle.main_entry_asset().and_then(|a| bundle_graph.asset(a)) else {
      return Ok(None);
    };
    let file_path = asset.file_path();
    let name = Path::new(&file_path).file_name().unwrap().to_string_lossy();
    Ok(Some(format!("images/{}", name)))
  }
}

register_plugin!(ImageNamer);
```

## Relevant API

{% include "../../api/namer.html" %}
