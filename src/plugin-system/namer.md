---
layout: layout.njk
eleventyNavigation:
  key: plugin-system-namer
  title: Namer
  order: 6
---

Namer plugins determine the output filename for a bundle. Namers run in a pipeline until one of them returns a result. Returned file paths should be relative to the target's dist directory. See [Targets](/features/targets/) for details about this.

Namers can be written in JavaScript, or as [native plugins](/plugin-system/native-plugins/) in Rust, Go, or Swift. Choose a language above any example to switch the examples and API names throughout the page.

## Overriding names for specific bundles

A common use case for a Namer plugin is to override Parcel’s default naming scheme for specific bundles. A namer implements one method, {% api js="name", rust="name", go="Name", swift="name(_:in:options:)" %}, which receives the bundle along with the bundle graph. Namers may return nothing ({% api js="null", rust="None", go='""', swift="nil" %}) when they don't handle a bundle to allow the next namer in the pipeline to handle it instead. See [Namers](/features/plugins/#namers) in the Parcel configuration docs for details on how this works.

This example places all `png` and `jpg` files into an `images` folder with the same name as their original filename.

{% codetabs %}

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

```rust
use parcel_plugin::{Bundle, BundleGraph, Diagnostic, Options, Plugin, register_plugin};

struct MyNamer;

impl Plugin for MyNamer {
  fn new(_config: &[u8]) -> Result<Self, Diagnostic> {
    Ok(MyNamer)
  }

  fn name(
    &self,
    bundle_graph: &BundleGraph,
    bundle: &Bundle,
    _options: &Options,
  ) -> Result<Option<String>, Diagnostic> {
    let ty = bundle.asset_type();
    if ty == "png" || ty == "jpg" {
      if let Some(entry) = bundle.main_entry_asset().and_then(|a| bundle_graph.asset(a)) {
        let file_path = entry.file_path();
        let name = file_path.file_name().unwrap().to_string_lossy();
        return Ok(Some(format!("images/{name}")));
      }
    }

    // Allow the next namer to handle this bundle.
    Ok(None)
  }
}

register_plugin!(MyNamer);
```

```go
package main

import (
	"path/filepath"

	parcel "github.com/parcel-bundler/parcel/plugin-go/v3"
)

type MyNamer struct{}

func (n *MyNamer) Name(bundleGraph *parcel.BundleGraph, bundle *parcel.Bundle, _ *parcel.Options) (string, error) {
	if bundle.Type() == "png" || bundle.Type() == "jpg" {
		if entry, ok := bundle.MainEntryAsset(); ok {
			if asset, ok := bundleGraph.Asset(entry); ok {
				return "images/" + filepath.Base(asset.FilePath()), nil
			}
		}
	}

	// Allow the next namer to handle this bundle.
	return "", nil
}

func init() {
	parcel.RegisterPlugin(func(config []byte) (any, error) {
		return &MyNamer{}, nil
	})
}

func main() {}
```

```swift
import Foundation
import ParcelPlugin

struct MyNamer: Namer {
  init(config: NoConfig) {}

  func name(_ bundle: OutputBundle, in bundleGraph: BundleGraph, options: Options) async throws
    -> String?
  {
    if bundle.type == "png" || bundle.type == "jpg",
      let entry = bundle.mainEntryAsset,
      let asset = bundleGraph.asset(at: entry)
    {
      return "images/\(URL(fileURLWithPath: asset.filePath).lastPathComponent)"
    }

    // Allow the next namer to handle this bundle.
    return nil
  }
}

#parcelPlugin(MyNamer.self)
```

{% endcodetabs %}

See [Native plugins](/plugin-system/native-plugins/) for how to build native plugins and use them in a project. The rest of the examples on this page omit the setup code, and only show the `name` method.

{% error %}

**Note**: This example does not ensure that all filenames are unique. If two images had the same filename in different directories, the build would fail.

{% enderror %}

## Content hashing

Including a hash of a bundle’s contents is an important optimization for production builds that enables browsers to cache loaded files indefinitely. When the contents of a bundle changes, so does its filename, which acts as a cache invalidation mechanism. See the [Content hashing](/features/production/#content-hashing) docs for details about this.

At the point bundles are being named, the final contents is not yet known, so Parcel provides a hash reference for each bundle, available as {% api js="bundle.hashReference", rust="bundle.hash_reference()", go="bundle.HashReference()", swift="bundle.hashReference" %}. This is an opaque placeholder value that will later on be replaced with the actual hash when writing the final bundles. Use this in returned bundle names to include a content hash. The hash reference must appear exactly once in the file name (not in a directory name) for it to be replaced. Bundles whose names don't include it are not content hashed.

Make sure to check whether the bundle needs a stable name, using {% api js="bundle.needsStableName", rust="BundleFlags::NEEDS_STABLE_NAME", go="parcel.BundleFlagNeedsStableName", swift=".needsStableName" %}, before including a hash. When it does, a dependency is expecting the filename of the bundle to remain consistent over time. For example, service workers require their URLs never to change, and users expect visible URLs like HTML pages to be human readable and remain consistent.

{% codetabs %}

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

```rust/9-11
impl Plugin for MyNamer {
  fn name(
    &self,
    _bundle_graph: &BundleGraph,
    bundle: &Bundle,
    _options: &Options,
  ) -> Result<Option<String>, Diagnostic> {
    let mut name = your_naming_function(bundle);
    if !bundle.has_flag(BundleFlags::NEEDS_STABLE_NAME) {
      name = format!("{name}.{}", bundle.hash_reference());
    }
    Ok(Some(format!("{name}.{}", bundle.asset_type())))
  }
}
```

```go/3-5
func (n *MyNamer) Name(_ *parcel.BundleGraph, bundle *parcel.Bundle, _ *parcel.Options) (string, error) {
	name := yourNamingFunction(bundle)
	if !bundle.HasFlag(parcel.BundleFlagNeedsStableName) {
		name += "." + bundle.HashReference()
	}
	return name + "." + bundle.Type(), nil
}
```

```swift/6-8
struct MyNamer: Namer {
  func name(_ bundle: OutputBundle, in bundleGraph: BundleGraph, options: Options) async throws
    -> String?
  {
    var name = yourNamingFunction(bundle)
    if !bundle.flags.contains(.needsStableName) {
      name += "." + bundle.hashReference
    }
    return name + "." + bundle.type
  }
}
```

{% endcodetabs %}

{% note %}

Hashes are also a good way to ensure that returned bundle names are unique, even when content hashing is disabled (e.g. in development, or with `--no-content-hash`). In this case, the hash reference is left in the name as is. It is a stable identifier for the bundle, which will not change when the bundle's contents change.

Content hashing is also not applied to inline bundles, or to bundles built for server environments (e.g. Node) or library targets, even if their names include the hash reference.

{% endnote %}

## Targets

Namer plugins should also respect the target associated with a bundle, available as {% api js="bundle.target", rust="bundle.target()", go="bundle.Target()", swift="bundle.target" %}. For example, the target's environment and output format may affect the file extension to use. [Targets](/features/targets/) also allow users to configure the output filenames of entry bundles in `package.json` (e.g. using [`exports`](/features/targets/#library-targets) for libraries). Parcel uses these filenames directly, and does not call Namer plugins for these bundles.

## Loading configuration

Configuration for a Namer plugin is specified in the user's `.parcelrc`. JavaScript plugins receive it as the `config` option of the `name` method, and native plugins receive it as JSON when they are created. See [Configuration](/plugin-system/authoring-plugins/#configuration) for details, and [Loading configuration](/plugin-system/transformer/#loading-configuration) in the Transformer docs for an example in each language.

## Relevant API

The API reference below covers JavaScript plugins. For native plugins, see the [Rust](https://github.com/parcel-bundler/parcel/tree/v3/crates/parcel-plugin), [Go](https://github.com/parcel-bundler/parcel/tree/v3/plugin-go), and [Swift](https://github.com/parcel-bundler/parcel/tree/v3/plugin-swift) SDKs.

<!-- TODO(v3): link to the generated docs for each SDK (docs.rs, pkg.go.dev, DocC) once they are published. -->

{% include "../../api/namer.html" %}
