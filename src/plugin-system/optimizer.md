---
layout: layout.njk
eleventyNavigation:
  key: plugin-system-optimizer
  title: Optimizer
  order: 9
---

Optimizer plugins are similar to transformers but they accept a bundle instead of a single asset. Optimizers are commonly used to implement minification, tree shaking/dead code elimination, and other size reduction techniques that need a full bundle to be effective. However, Optimizers can also be used for any type of bundle transformation, such as prepending license headers, converting inline bundles to base 64, etc.

## Example

The `optimize` method receives the contents of a bundle and its source map, and should return transformed versions of these. The contents are passed as a [Uint8Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array), and may be returned as a `Uint8Array` or a string. Multiple Optimizer plugins may run in series, and the result of each Optimizer is passed to the next. See [below](#source-maps) for more info about source maps.

```javascript
import { Optimizer } from "@parcel/plugin";

export default new Optimizer({
  async optimize({ contents, map }) {
    let { code, sourceMap } = optimize(contents, map);
    return {
      contents: code,
      map: sourceMap,
    };
  },
});
```

## Loading configuration

Configuration for an Optimizer plugin is specified in the user's `.parcelrc`, and passed to the `optimize` method as the `config` option. See [Configuration](/plugin-system/authoring-plugins/#configuration) for details.

## Conditional optimization

`Optimizer` plugins are always run by Parcel, even in development or when the `--no-optimize` option is specified. This is because Optimizers can be used for any kind of bundle transformation, not just compression. If your Optimizer plugin is performing minification or should generally only run in production builds, you should check the `shouldOptimize` property of the bundle's target and return the original contents if it is `false`.

```javascript/5-8
import {Optimizer} from '@parcel/plugin';

export default new Optimizer({
  async optimize({contents, map, bundle}) {
    // Don't minify if shouldOptimize is false.
    if (!bundle.target.shouldOptimize) {
      return {contents, map};
    }

    let {code, sourceMap} = minify(contents, map);
    return {
      contents: code,
      map: sourceMap
    };
  }
});
```

## Binary content

The contents passed to an Optimizer are always a `Uint8Array`, for both source code and binary content. Use [TextDecoder](https://developer.mozilla.org/en-US/docs/Web/API/TextDecoder) to convert source code to a string. The result can be returned as a string or `Uint8Array`.

```javascript/5,7
import {Optimizer} from '@parcel/plugin';

export default new Optimizer({
  async optimize({contents, map}) {
    let code = new TextDecoder().decode(contents);
    let optimized = optimize(code);
    return {contents: optimized, map};
  }
});
```

## Source maps

Source maps help developers when debugging compiled and bundled code in the browser by mapping locations in the compiled code back to the original source code. Optimizer plugins should transform the provided source map in addition to the contents of the bundle.

The `map` passed to an Optimizer is the bundle's source map as a JSON object in the standard [source map format](https://tc39.es/ecma426/), or `null` if the bundle doesn't have a source map. Optimizers should return the transformed source map as a JSON object, a JSON string, or a `Uint8Array` of UTF-8 encoded JSON. If an Optimizer doesn't return a `map`, the bundle's source map is removed. See [Source Maps](/plugin-system/source-maps/) for more details.

Parcel takes care of inserting a reference to the source map into the bundle contents after all Optimizers have run, so Optimizers should not add a `sourceMappingURL` comment themselves.

```javascript
import { Optimizer } from "@parcel/plugin";

export default new Optimizer({
  async optimize({ contents, map }) {
    let result = optimize(new TextDecoder().decode(contents), map);
    return {
      contents: result.code,
      map: result.map,
    };
  },
});
```

## Native optimizers

Optimizers can also be written as [native plugins](/plugin-system/native-plugins/). With the Rust SDK, implement the `optimize` method of the `Plugin` trait. This example appends a license comment to each bundle. Since the existing lines are unchanged, the source map can be passed through as is.

```rust
use parcel_plugin::{
  register_plugin, Bundle, BundleGraph, ContentBuffer, Diagnostic, OptimizeResult, Options, Plugin,
};

struct LicenseOptimizer;

impl Plugin for LicenseOptimizer {
  fn new(_config: &[u8]) -> Result<Self, Diagnostic> {
    Ok(LicenseOptimizer)
  }

  fn optimize(
    &self,
    _bundle_graph: &BundleGraph,
    _bundle: &Bundle,
    contents: &[u8],
    source_map: Option<&[u8]>,
    _options: &Options,
  ) -> Result<OptimizeResult, Diagnostic> {
    let mut output = contents.to_vec();
    output.extend_from_slice(b"\n/* Copyright (c) Example Corp */\n");
    Ok(OptimizeResult {
      contents: ContentBuffer::Bytes(output),
      source_map: source_map.map(<[u8]>::to_vec),
    })
  }
}

register_plugin!(LicenseOptimizer);
```

## Relevant API

{% include "../../api/optimizer.html" %}
