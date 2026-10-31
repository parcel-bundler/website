---
layout: layout.njk
eleventyNavigation:
  key: plugin-system-optimizer
  title: Optimizer
  order: 9
---

Optimizer plugins are similar to transformers but they accept a bundle instead of a single asset. Optimizers are commonly used to implement minification, tree shaking/dead code elimination, and other size reduction techniques that need a full bundle to be effective. However, Optimizers can also be used for any type of bundle transformation, such as prepending license headers, converting inline bundles to base 64, etc.

## Example

An optimizer implements one method: {% api js="optimize", rust="optimize", go="Optimize", swift="optimize(_:in:contents:sourceMap:options:)" %}. It receives the contents of a bundle and its source map, along with the bundle and the bundle graph, and returns transformed versions of the contents and source map. The contents are passed as bytes, and may be returned as bytes or a string. Multiple Optimizer plugins may run in series, and the result of each Optimizer is passed to the next. See [below](#source-maps) for more info about source maps.

{% codetabs %}

```javascript
import { Optimizer } from "@parcel/plugin";

export default new Optimizer({
  async optimize({ contents, map }) {
    let { code, sourceMap } = minify(contents, map);
    return {
      contents: code,
      map: sourceMap,
    };
  },
});
```

```rust
use parcel_plugin::{
  Bundle, BundleGraph, ContentBuffer, Diagnostic, OptimizeResult, Options, Plugin, register_plugin,
};

struct MyOptimizer;

impl Plugin for MyOptimizer {
  fn new(_config: &[u8]) -> Result<Self, Diagnostic> {
    Ok(MyOptimizer)
  }

  fn optimize(
    &self,
    _bundle_graph: &BundleGraph,
    _bundle: &Bundle,
    contents: &[u8],
    source_map: Option<&[u8]>,
    _options: &Options,
  ) -> Result<OptimizeResult, Diagnostic> {
    let (code, map) = minify(contents, source_map);
    Ok(OptimizeResult::new(ContentBuffer::Bytes(code)).with_source_map(map))
  }
}

register_plugin!(MyOptimizer);
```

```go
package main

import parcel "github.com/parcel-bundler/parcel/plugin-go/v3"

type MyOptimizer struct{}

func (o *MyOptimizer) Optimize(_ *parcel.BundleGraph, _ *parcel.Bundle, contents []byte, sourceMap string, _ *parcel.Options) (parcel.OptimizeResult, error) {
	code, m := minify(contents, sourceMap)
	return parcel.OptimizeResult{
		Contents:  parcel.BytesContent(code),
		SourceMap: m,
	}, nil
}

func init() {
	parcel.RegisterPlugin(func(config []byte) (any, error) {
		return &MyOptimizer{}, nil
	})
}

func main() {}
```

```swift
import ParcelPlugin

struct MyOptimizer: Optimizer {
  init(config: NoConfig) {}

  func optimize(
    _ bundle: OutputBundle, in bundleGraph: BundleGraph, contents: [UInt8], sourceMap: [UInt8]?,
    options: Options
  ) async throws -> OptimizeResult {
    let (code, map) = minify(contents, sourceMap)
    return OptimizeResult(contents: .bytes(code), sourceMap: map)
  }
}

#parcelPlugin(MyOptimizer.self)
```

{% endcodetabs %}

See [Native plugins](/plugin-system/native-plugins/) for how to build native plugins and use them in a project. The rest of the examples on this page omit the setup code, and only show the `optimize` method.

## Loading configuration

Configuration for an Optimizer plugin is specified in the user's `.parcelrc`. JavaScript plugins receive it as the `config` option of the `optimize` method, and native plugins receive it as JSON when they are created. See [Configuration](/plugin-system/authoring-plugins/#configuration) for details.

## Conditional optimization

Optimizer plugins are always run by Parcel, even in development or when the `--no-optimize` option is specified. This is because Optimizers can be used for any kind of bundle transformation, not just compression. If your Optimizer plugin is performing minification or should generally only run in production builds, you should check whether optimization is enabled for the bundle's target using {% api js="bundle.target.shouldOptimize", rust="EnvironmentFlags::SHOULD_OPTIMIZE", go="parcel.EnvFlagShouldOptimize", swift=".shouldOptimize" %}, and return the original contents if it isn't.

{% codetabs %}

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

```rust/10-15
impl Plugin for MyOptimizer {
  fn optimize(
    &self,
    _bundle_graph: &BundleGraph,
    bundle: &Bundle,
    contents: &[u8],
    source_map: Option<&[u8]>,
    _options: &Options,
  ) -> Result<OptimizeResult, Diagnostic> {
    // Don't minify if the target shouldn't be optimized.
    if !bundle.target().env_flags().contains(EnvironmentFlags::SHOULD_OPTIMIZE) {
      let mut result = OptimizeResult::new(ContentBuffer::Bytes(contents.to_vec()));
      result.source_map = source_map.map(<[u8]>::to_vec);
      return Ok(result);
    }

    let (code, map) = minify(contents, source_map);
    Ok(OptimizeResult::new(ContentBuffer::Bytes(code)).with_source_map(map))
  }
}
```

```go/2-5
func (o *MyOptimizer) Optimize(_ *parcel.BundleGraph, bundle *parcel.Bundle, contents []byte, sourceMap string, _ *parcel.Options) (parcel.OptimizeResult, error) {
	// Don't minify if the target shouldn't be optimized.
	if bundle.Target().EnvFlags()&parcel.EnvFlagShouldOptimize == 0 {
		return parcel.OptimizeResult{Contents: parcel.BytesContent(contents), SourceMap: sourceMap}, nil
	}

	code, m := minify(contents, sourceMap)
	return parcel.OptimizeResult{Contents: parcel.BytesContent(code), SourceMap: m}, nil
}
```

```swift/6-9
struct MyOptimizer: Optimizer {
  func optimize(
    _ bundle: OutputBundle, in bundleGraph: BundleGraph, contents: [UInt8], sourceMap: [UInt8]?,
    options: Options
  ) async throws -> OptimizeResult {
    // Don't minify if the target shouldn't be optimized.
    if !bundle.target.environmentFlags.contains(.shouldOptimize) {
      return OptimizeResult(contents: .bytes(contents), sourceMap: sourceMap)
    }

    let (code, map) = minify(contents, sourceMap)
    return OptimizeResult(contents: .bytes(code), sourceMap: map)
  }
}
```

{% endcodetabs %}

## Binary content

The contents passed to an Optimizer are always bytes, for both source code and binary content. Decode them as UTF-8 to work with source code as a string. In JavaScript, the contents are a [Uint8Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array), which can be decoded using [TextDecoder](https://developer.mozilla.org/en-US/docs/Web/API/TextDecoder). The result can be returned as either a string or bytes.

{% codetabs %}

```javascript/5,7
import {Optimizer} from '@parcel/plugin';

export default new Optimizer({
  async optimize({contents, map}) {
    let code = new TextDecoder().decode(contents);
    let optimized = minify(code);
    return {contents: optimized, map};
  }
});
```

```rust/10,12-14
impl Plugin for MyOptimizer {
  fn optimize(
    &self,
    _bundle_graph: &BundleGraph,
    _bundle: &Bundle,
    contents: &[u8],
    source_map: Option<&[u8]>,
    _options: &Options,
  ) -> Result<OptimizeResult, Diagnostic> {
    let code = std::str::from_utf8(contents).map_err(|e| Diagnostic::new(e.to_string()))?;
    let optimized = minify(code);
    let mut result = OptimizeResult::new(ContentBuffer::String(optimized));
    result.source_map = source_map.map(<[u8]>::to_vec);
    Ok(result)
  }
}
```

```go/2,4
func (o *MyOptimizer) Optimize(_ *parcel.BundleGraph, _ *parcel.Bundle, contents []byte, sourceMap string, _ *parcel.Options) (parcel.OptimizeResult, error) {
	code := string(contents)
	optimized := minify(code)
	return parcel.OptimizeResult{Contents: parcel.StringContent(optimized), SourceMap: sourceMap}, nil
}
```

```swift/6,8
struct MyOptimizer: Optimizer {
  func optimize(
    _ bundle: OutputBundle, in bundleGraph: BundleGraph, contents: [UInt8], sourceMap: [UInt8]?,
    options: Options
  ) async throws -> OptimizeResult {
    let code = String(decoding: contents, as: UTF8.self)
    let optimized = minify(code)
    return OptimizeResult(contents: .string(optimized), sourceMap: sourceMap)
  }
}
```

{% endcodetabs %}

## Source maps

Source maps help developers when debugging compiled and bundled code in the browser by mapping locations in the compiled code back to the original source code. Optimizer plugins should transform the provided source map in addition to the contents of the bundle.

The optimizer receives the bundle's source map as JSON in the standard [source map format](https://tc39.es/ecma426/), or nothing if the bundle doesn't have a source map. JavaScript plugins receive it as an object, and native plugins as JSON text. Optimizers should return the transformed source map along with the contents. In JavaScript, it may be returned as a JSON object, a JSON string, or a `Uint8Array` of UTF-8 encoded JSON. If an Optimizer doesn't return a source map, the bundle's source map is removed. See [Source Maps](/plugin-system/source-maps/) for more details.

If an optimizer doesn't change the existing lines of the bundle, e.g. because it only appends a license comment to the end, it can return the source map it received unchanged.

Parcel takes care of inserting a reference to the source map into the bundle contents after all Optimizers have run, so Optimizers should not add a `sourceMappingURL` comment themselves.

{% codetabs %}

```javascript
import { Optimizer } from "@parcel/plugin";

export default new Optimizer({
  async optimize({ contents, map }) {
    let result = minify(new TextDecoder().decode(contents), map);
    return {
      contents: result.code,
      map: result.map,
    };
  },
});
```

```rust
impl Plugin for MyOptimizer {
  fn optimize(
    &self,
    _bundle_graph: &BundleGraph,
    _bundle: &Bundle,
    contents: &[u8],
    source_map: Option<&[u8]>,
    _options: &Options,
  ) -> Result<OptimizeResult, Diagnostic> {
    let code = std::str::from_utf8(contents).map_err(|e| Diagnostic::new(e.to_string()))?;
    let result = minify(code, source_map);
    Ok(OptimizeResult::new(ContentBuffer::String(result.code)).with_source_map(result.map))
  }
}
```

```go
func (o *MyOptimizer) Optimize(_ *parcel.BundleGraph, _ *parcel.Bundle, contents []byte, sourceMap string, _ *parcel.Options) (parcel.OptimizeResult, error) {
	result := minify(string(contents), sourceMap)
	return parcel.OptimizeResult{
		Contents:  parcel.StringContent(result.Code),
		SourceMap: result.Map,
	}, nil
}
```

```swift
struct MyOptimizer: Optimizer {
  func optimize(
    _ bundle: OutputBundle, in bundleGraph: BundleGraph, contents: [UInt8], sourceMap: [UInt8]?,
    options: Options
  ) async throws -> OptimizeResult {
    let result = minify(String(decoding: contents, as: UTF8.self), sourceMap)
    return OptimizeResult(contents: .string(result.code), sourceMap: result.map)
  }
}
```

{% endcodetabs %}

## Relevant API

The API reference below covers JavaScript plugins. For native plugins, see the [Rust](https://github.com/parcel-bundler/parcel/tree/v3/crates/parcel-plugin), [Go](https://github.com/parcel-bundler/parcel/tree/v3/plugin-go), and [Swift](https://github.com/parcel-bundler/parcel/tree/v3/plugin-swift) SDKs.

<!-- TODO(v3): link to the generated docs for each SDK (docs.rs, pkg.go.dev, DocC) once they are published. -->

{% include "../../api/optimizer.html" %}
