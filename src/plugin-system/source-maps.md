---
layout: layout.njk
eleventyNavigation:
  key: plugin-system-source-maps
  title: Source Maps
  order: 16
---

Parcel generates source maps for every bundle by default, mapping the final output back to your original source code. Source maps are processed in Rust within Parcel's core and built-in plugins, and plugins exchange them with Parcel as standard [source map](https://tc39.es/ecma426/) JSON (version 3). This means you can use the source maps produced by most compilers directly, without converting them first.

Source maps from each plugin are combined as an asset moves through its pipeline. Parcel's built-in transformers (e.g. for JavaScript and CSS) map their output through the source map set by earlier transformers, and Parcel concatenates the source maps of all assets when packaging bundles.

Plugins can be written in JavaScript, or as [native plugins](/plugin-system/native-plugins/) in Rust, Go, or Swift. JavaScript plugins exchange source maps as objects, and native plugins as JSON text. Choose a language above any example to switch the examples and API names throughout the page.

## Transformations/Manipulations

If your plugin does any code manipulations, you should ensure that it creates correct mappings to the original source code to guarantee that we still end up creating an accurate source map at the end of the bundling process. To do this, set a source map along with the asset's content in a [Transformer](/plugin-system/transformer/) plugin, using {% api js="asset.setCode(code, map)", rust="asset.set_content_with_map()", go="asset.SetContentWithMap()", swift="asset.setContent()" %}. Binary content can be set along with a source map as well, using {% api js="asset.setBuffer(buffer, map)", rust="asset.set_content_bytes_with_map()", go="asset.SetContentBytesWithMap()", swift="asset.setContent(_:sourceMap:)" %}.

We also provide the source map from the previous transform to ensure you map to the original source code and not just the output of the previous transform. {% api js="asset.getMap()", rust="asset.source_map()", go="asset.SourceMap()", swift="asset.sourceMap" %} returns the current source map of the asset exactly as it was set by an earlier transformer, or nothing if it doesn't have one.

The `sources` in a source map may be absolute paths, `file:` URLs, or paths relative to the asset's directory (taking the map's `sourceRoot` into account).

If your compiler supports the option to pass in an existing source map, this results in accurate source maps that point back to the original source code.

An example of how this would work:

<!-- TODO(v3): native plugins can't check whether source maps are enabled for the target. JS has `asset.target.sourceMap`, but the native Target has no equivalent (EnvironmentFlags only has IS_LIBRARY, SHOULD_OPTIMIZE, SHOULD_SCOPE_HOIST, MODULE_TYPE_EXTENSION in crates/parcel-plugin-abi/src/target.rs), so the native examples always generate a map. -->

{% codetabs %}

```javascript
import { Transformer } from "@parcel/plugin";

export default new Transformer({
  async transform({ asset }) {
    let compilationResult = someCompiler(asset.getCode(), {
      // Only generate a source map when source maps are enabled.
      sourceMaps: asset.target.sourceMap != null,
      // Pass the source map from previous transformations to the compiler.
      inputSourceMap: asset.getMap(),
    });

    // In this case the compiler is responsible for mapping to the original
    // positions provided in the input source map, so we can just pass
    // its source map to Parcel.
    asset.setCode(compilationResult.code, compilationResult.map);
  },
});
```

```rust
impl Plugin for MyTransformer {
  fn transform(&self, asset: &mut Asset, _options: &Options) -> Result<(), Diagnostic> {
    // Pass the source map from previous transformations to the compiler.
    let result = some_compiler(&asset.content()?, asset.source_map().as_deref());

    // In this case the compiler is responsible for mapping to the original
    // positions provided in the input source map, so we can just pass
    // its source map to Parcel.
    asset.set_content_with_map(result.code, result.map);
    Ok(())
  }
}
```

```go
func (t *MyTransformer) Transform(asset *parcel.Asset, _ *parcel.Options) error {
	content, err := asset.Content()
	if err != nil {
		return err
	}

	// Pass the source map from previous transformations to the compiler.
	result := someCompiler(content, asset.SourceMap())

	// In this case the compiler is responsible for mapping to the original
	// positions provided in the input source map, so we can just pass
	// its source map to Parcel.
	asset.SetContentWithMap(result.Code, result.Map)
	return nil
}
```

```swift
struct MyTransformer: Transformer {
  func transform(_ asset: Asset, options: Options) async throws {
    // Pass the source map from previous transformations to the compiler.
    let result = someCompiler(try asset.content(), asset.sourceMap)

    // In this case the compiler is responsible for mapping to the original
    // positions provided in the input source map, so we can just pass
    // its source map to Parcel.
    asset.setContent(result.code, sourceMap: result.map)
  }
}
```

{% endcodetabs %}

In JavaScript, a source map is only generated when source maps are enabled for the asset's target. Native plugins can't check this yet.

Setting new content does not combine its source map with the existing one. If a compiler doesn't have a way to pass in an input source map and the asset already has one, you'll need to combine the two maps yourself before setting the new content, so that the result maps to the original source rather than to the output of the previous transform.

<!-- TODO(v3): v2's @parcel/source-map library (SourceMap class, addVLQMap, extends, etc.) is not part of v3, and setCode replaces the asset's map without composing it with getMap() (crates/plugin-js/src/plugin.rs set_code). Consider recommending a specific npm library for composing maps, or exposing a helper. -->

## Postprocessing source maps in optimizers

Using source maps in optimizers is similar to how you use it in transformers. You get one file as input and are expected to return that same file as output, but optimized.

The difference with optimizers is that the map is not provided as part of an asset but rather as a separate argument, as you can see in the code snippet below. The contents are passed as bytes, and the map as source map JSON, or nothing if there is no source map. An optimizer returns the new contents as a string or bytes, along with the new source map. If an optimizer doesn't return a source map, the bundle's source map is removed. In JavaScript, the contents are a `Uint8Array`, and the map may be returned as a JSON object, a JSON string, or a `Uint8Array`. See [Optimizer](/plugin-system/optimizer/#source-maps) for more details.

{% codetabs %}

```javascript
import { Optimizer } from "@parcel/plugin";

export default new Optimizer({
  // The contents and map are passed separately
  async optimize({ bundle, contents, map }) {
    let result = someMinifier(new TextDecoder().decode(contents), {
      inputMap: map,
    });

    return {
      contents: result.code,
      map: result.map ?? null,
    };
  },
});
```

```rust
impl Plugin for MyOptimizer {
  // The contents and map are passed separately
  fn optimize(
    &self,
    _bundle_graph: &BundleGraph,
    _bundle: &Bundle,
    contents: &[u8],
    source_map: Option<&[u8]>,
    _options: &Options,
  ) -> Result<OptimizeResult, Diagnostic> {
    let code = std::str::from_utf8(contents).map_err(|e| Diagnostic::new(e.to_string()))?;
    let result = some_minifier(code, source_map);

    Ok(OptimizeResult::new(ContentBuffer::String(result.code)).with_source_map(result.map))
  }
}
```

```go
// The contents and map are passed separately
func (o *MyOptimizer) Optimize(_ *parcel.BundleGraph, _ *parcel.Bundle, contents []byte, sourceMap string, _ *parcel.Options) (parcel.OptimizeResult, error) {
	result := someMinifier(string(contents), sourceMap)

	return parcel.OptimizeResult{
		Contents:  parcel.StringContent(result.Code),
		SourceMap: result.Map,
	}, nil
}
```

```swift
struct MyOptimizer: Optimizer {
  // The contents and map are passed separately
  func optimize(
    _ bundle: OutputBundle, in bundleGraph: BundleGraph, contents: [UInt8], sourceMap: [UInt8]?,
    options: Options
  ) async throws -> OptimizeResult {
    let result = someMinifier(String(decoding: contents, as: UTF8.self), sourceMap)

    return OptimizeResult(contents: .string(result.code), sourceMap: result.map)
  }
}
```

{% endcodetabs %}

Plugins that implement the [C ABI](/plugin-system/native-plugins/#c-abi) directly read an asset's source map with `parcel_asset_get_map`, and set it along with the content using `parcel_asset_set_content`.
