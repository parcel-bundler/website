---
layout: layout.njk
eleventyNavigation:
  key: plugin-system-source-maps
  title: Source Maps
  order: 14
---

Parcel utilizes the package `@parcel/source-maps` for all it's source-maps, this ensures performance and reliability when manipulating sourcemaps across plugins and parts of Parcel's core. This library has been written from the ground up in C++ with manipulation and concatenation of these sourcemaps in mind and gave us a 20x performance improvement over our old hybrid solution consisting of Mozilla's Source-Map and some internal utilities used in Parcel 1. This improvement in performance is mainly due to the optimizations in the data structures and way we cache the sourcemaps.

Below is an example with all the ways you can add mappings to a SourceMap instance:

```js
import SourceMap from "@parcel/source-map";

let sourcemap = new SourceMap();

// Each function that adds mappings, has optional offset arguments
// these can be used to offset the generated mappings by a certain amount
let lineOffset = 0;
let columnOffset = 0;

// Add indexed mappings
// these are mappings that can sometimes be extracted from a library even before they get converted into VLQ Mappings
sourcemap.addIndexedMappings(
  [
    {
      generated: {
        // line index starts at 1
        line: 1,
        // column index starts at 0
        column: 4,
      },
      original: {
        // line index starts at 1
        line: 1,
        // column index starts at 0
        column: 4,
      },
      source: "index.js",
      // Name is optional
      name: "A",
    },
  ],
  lineOffset,
  columnOffset
);

// Add raw mappings, this is what would be outputted into a vlq encoded source-map
sourcemap.addRawMappings(
  {
    file: "min.js",
    names: ["bar", "baz", "n"],
    sources: ["one.js", "two.js"],
    sourceRoot: "/the/root",
    mappings:
      "CAAC,IAAI,IAAM,SAAUA,GAClB,OAAOC,IAAID;CCDb,IAAI,IAAM,SAAUE,GAClB,OAAOA",
  },
  lineOffset,
  columnOffset
);

// Sourcemaps can be saved as buffers (flatbuffers), this is what we use for caching in Parcel.
// You can instantiate a SourceMap with these buffer values using the `addBufferMappings` function
let originalMapBuffer = new Buffer();
sourcemap.addBufferMappings(originalMapBuffer, lineOffset, columnOffset);
```

## Transformations/Manipulations

If your plugin does any code manipulations it should ensure that it creates correct mappings to the original source-code to guarantee that we still end up creating an accurate source-map at the end of the bundling process. In this case you are expected to return a `SourceMap` instance at the end of a transform in a [Transformer](/plugin-system/transformer/) plugin. We also provide the source-map from the previous transform to ensure you map to the original source code and not the output of the previous transform.

The `asset` value that gets passed in the `parse`, `transform` and `generate` functions of a transformer plugin contains a function called `getMap()` and `getMapBuffer()`, these functions can be used to get a SourceMap instance (`getMap()`) and the cached SourceMap Buffer (`getMapBuffer()`).

You are free to manipulate the sourcemap at any of these steps in the transformer as long as you ensure the sourcemap that gets returned in `generate` maps to the original sourcefile correctly.

Below is an example of the recommended way on how to manipulate sourcemaps in a transformer plugin:

```js
import { Transform } from "@parcel/plugin";

export default new Transform({
  // ...

  async generate({ asset, ast, resolve, options }) {
    let compilationResult = dummyCompiler(await asset.getAST());

    let map = null;
    if (compilationResult.map) {
      // If the compilationResult returned a map we convert it to a Parcel SourceMap instance
      map = new SourceMap();

      // The dummy compiler returned a full, encoded sourcemap with vlq mappings
      // Some compilers might have the possibility of returning indexedMappings which might improve performance (like Babel does)
      // in general each compiler is able to return rawMappings, so it's always a safe bet to use this
      map.addRawMappings(compilationResult.map);

      // We get the original map buffer from the asset
      // to extend our mappings on top of it to ensure we are mapping to the original source
      // instead of the previous transformation
      let originalMapBuffer = await asset.getMapBuffer();
      if (originalMapBuffer) {
        // The `extends` function uses the provided map to remap the original source positions of the map it is called on
        // So in this case the original source positions of `map` get remapped to the positions in `originalMapBuffer`
        map.extends(originalMapBuffer);
      }
    }

    return {
      code: compilationResult.code,
      // Make sure to return the map
      // we need it for concatenating the sourcemaps together in the final bundle's sourcemap
      map,
    };
  },
});
```

## Diagnosing issues

If you encounter incorrect mappings and want to debug these mappings we have built tools that can help you diagnose these issues, this includes a specific reporter (`@parcel/reporter-sourcemap-visualiser`) to create a `sourcemap-info.json` file with all the necessary information to visualize all the mappings and source content.

For it to work you can add a custom `.parcelrc`:

```json
{
  "extends": "@parcel/config-default",
  "reporters": ["...", "@parcel/reporter-sourcemap-visualiser"]
}
```

After the reporter has created the `sourcemap-info.json` file you can upload it to the [sourcemap visualizer](https://sourcemap-visualiser.now.sh/)

## `@parcel/source-maps`: API

{% include "../../api/source-map.html" %}
