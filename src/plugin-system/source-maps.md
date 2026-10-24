---
layout: layout.njk
eleventyNavigation:
  key: plugin-system-source-maps
  title: Source Maps
  order: 16
---

Parcel generates source maps for every bundle by default, mapping the final output back to your original source code. Source maps are processed in Rust within Parcel's core and built-in plugins, and plugins exchange them with Parcel as standard [source map](https://tc39.es/ecma426/) JSON objects (version 3). This means you can use the source maps produced by most compilers directly, without converting them first.

Source maps from each plugin are combined as an asset moves through its pipeline. Parcel's built-in transformers (e.g. for JavaScript and CSS) map their output through the source map set by earlier transformers, and Parcel concatenates the source maps of all assets when packaging bundles.

## Transformations/Manipulations

If your plugin does any code manipulations, you should ensure that it creates correct mappings to the original source code to guarantee that we still end up creating an accurate source map at the end of the bundling process. To do this, pass a source map as the second argument when setting the asset's content in a [Transformer](/plugin-system/transformer/) plugin, using `setCode(code, map)` or `setBuffer(buffer, map)`.

We also provide the source map from the previous transform to ensure you map to the original source code and not just the output of the previous transform. The `asset` value that gets passed to the `transform` function of a transformer plugin contains a function called `getMap()`, which returns the current source map of the asset as a JSON object, or `null` if it doesn't have one.

The `sources` in a source map may be absolute paths, `file:` URLs, or paths relative to the asset's directory (taking the map's `sourceRoot` into account).

If your compiler supports the option to pass in an existing source map, this results in accurate source maps that point back to the original source code.

An example of how this would work:

```js
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

If a compiler doesn't have a way to pass in an input source map and the asset already has one, you'll need to combine the two maps yourself before calling `setCode`, so that the result maps to the original source rather than to the output of the previous transform.

<!-- TODO(v3): v2's @parcel/source-map library (SourceMap class, addVLQMap, extends, etc.) is not part of v3, and setCode replaces the asset's map without composing it with getMap() (crates/plugin-js/src/plugin.rs set_code). Consider recommending a specific npm library for composing maps, or exposing a helper. -->

## Postprocessing source maps in optimizers

Using source maps in optimizers is similar to how you use it in transformers. You get one file as input and are expected to return that same file as output, but optimized.

The difference with optimizers is that the map is not provided as part of an asset but rather as a separate parameter/option, as you can see in the code snippet below. Both the contents and the map are passed as a `Uint8Array`, with the map containing UTF-8 encoded source map JSON (or `null` if there is no source map). If an optimizer returns no `map`, the bundle's source map is removed.

```js
import { Optimizer } from "@parcel/plugin";

export default new Optimizer({
  // The contents and map are passed separately
  async optimize({ bundle, contents, map }) {
    let inputMap = map ? JSON.parse(new TextDecoder().decode(map)) : null;
    let result = someMinifier(new TextDecoder().decode(contents), { inputMap });

    return {
      contents: new TextEncoder().encode(result.code),
      map: result.map
        ? new TextEncoder().encode(JSON.stringify(result.map))
        : null,
    };
  },
});
```

## Native plugins

[Native plugins](/plugin-system/native-plugins/) also exchange source maps as JSON. In the Rust SDK, transformers set a source map along with the asset's content using `set_content_with_map` or `set_content_bytes_with_map`, and optimizers receive the current source map as a `source_map` argument, and return a new one using `OptimizeResult::with_source_map`. The Go and Swift SDKs have equivalent APIs (`SetContentWithMap`, and `setContent(_:sourceMap:)`).

<!-- TODO(v3): native transformers can set a map but cannot read the asset's existing input map (no getter in crates/parcel-plugin, plugin.h, Go or Swift SDKs). -->
