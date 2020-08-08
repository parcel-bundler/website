---
layout: layout.njk
eleventyNavigation:
  key: plugin-system-source-maps
  title: Source Maps
  order: 14
---

Parcel utilizes the package `@parcel/source-maps` for processing all source maps to ensure performance and reliability when manipulating source maps across plugins and Parcel's core. This library has been written from the ground up in C++ with both source map manipulation and concatenation in mind and gave us a 20x performance improvement over our old solution using Mozilla's [`source-map`](https://github.com/mozilla/source-map) library and some internal utilities. This improvement in performance is mainly due to optimizations in the data structures and the way in which we cache source maps.

## How to use the library

To use the library, you start off by creating an instance of the exported `SourceMap` class, on which you can call various functions to add and edit source mappings.

Below is an example covering all ways of adding mappings to a `SourceMap` instance:

```js
import SourceMap from "@parcel/source-map";

let sourcemap = new SourceMap();

// Each function that adds mappings has optional offset arguments.
// These can be used to offset the generated mappings by a certain amount.
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

If your plugin does any code manipulations, you should ensure that it creates correct mappings to the original source code to guarantee that we still end up creating an accurate source map at the end of the bundling process. You are expected to return a `SourceMap` instance at the end of a transform in a [Transformer](/plugin-system/transformer/) plugin. We also provide the source map from the previous transform to ensure you map to the original source code and not just the output of the previous transform.

The `asset` value that gets passed in the `parse`, `transform` and `generate` functions of a transformer plugin contains a function called `getMap()` and `getMapBuffer()`, these functions can be used to get a SourceMap instance (`getMap()`) and the cached SourceMap Buffer (`getMapBuffer()`).

You are free to manipulate the sourcemap at any of these steps in the transformer as long as you ensure the sourcemap that gets returned in `generate` maps to the original sourcefile correctly.

Below is an example on how to manipulate sourcemaps in a transformer plugin:

```js
import { Transform } from "@parcel/plugin";
import SourceMap from "@parcel/source-map";

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

If your compiler supports the option to pass in an existing sourcemap, you can also use that as it could result in more accurate/better sourcemaps than using the method in the previous example.

An example of how this would work:

```js
import { Transform } from "@parcel/plugin";
import SourceMap from "@parcel/source-map";

export default new Transform({
  // ...

  async generate({ asset, ast, resolve, options }) {
    // Get the original map from the asset
    let originalMap = await asset.getMap();
    let compilationResult = dummyCompiler(await asset.getAST(), {
      // Pass the VLQ encoded version of the originalMap to the compiler
      originalMap: originalMap.toVLQ(),
    });

    // In this case the compiler is responsible for mapping to the original positions provided in the originalMap
    // so we can just convert it to a Parcel SourceMap and return it
    let map = new SourceMap();
    if (compilationResult.map) {
      map.addRawMappings(compilationResult.map);
    }

    return {
      code: compilationResult.code,
      map,
    };
  },
});
```

## Concatenating sourcemaps in Packagers

If you're writing a custom packager, it's your responsibility to concatenate the sourcemaps of all the assets while packaging the assets. This is done by creating a new sourcemap instance using `new SourceMap()` and adding new mappings to it using the `addBufferMappings(buffer, lineOffset, columnOffset)` function. The lineOffset should be equal to the line index at which the asset output starts.

Below is an example of how to do this:

```js
import { Packager } from "@parcel/plugin";
import SourceMap from "@parcel/source-map";

export default new Packager({
  async package({ bundle, options }) {
    // We instantiate the contents variable, which will content a string which represents the entire output bundle
    let contents = "";

    // We instantiate a new SourceMap to which we'll add all asset maps
    let map = new SourceMap();

    // This is a queue that reads in all file content and maps and saves them for use in the actual packaging
    let queue = new PromiseQueue({ maxConcurrent: 32 });
    bundle.traverse((node) => {
      if (node.type === "asset") {
        queue.add(async () => {
          let [code, mapBuffer] = await Promise.all([
            node.value.getCode(),
            bundle.target.sourceMap && node.value.getMapBuffer(),
          ]);
          return { code, mapBuffer };
        });
      }
    });

    let i = 0;
    // Process the entire queue...
    let results = await queue.run();

    // We traverse the bundle and add the contents of each asset to contents and the mapBuffer's to the map
    bundle.traverse((node) => {
      if (node.type === "asset") {
        // Get the data from the queue results
        let { code, mapBuffer } = results[i];

        // Add the output to the contents
        let output = code || "";
        contents += output;

        // If Parcel requires sourcemaps we add the mapBuffer to the map
        if (options.sourceMaps) {
          if (mapBuffer) {
            // we add the mapBuffer to the map with the lineOffset
            // The lineOffset is equal to the line the content of the asset starts at
            // which is the same as the contents length before this asset was added
            map.addBufferMappings(mapBuffer, lineOffset);
          }

          // We add the amount of lines of the current asset to the lineOffset
          // this way we know the length of `contents` without having to recalculate it each time
          lineOffset += countLines(output) + 1;
        }

        i++;
      }
    });

    // Return the contents and map so Parcel Core can save these to disk or get post-processed by optimizers
    return { contents, map };
  },
});
```

## Postprocessing source maps in optimizers

Using sourcemaps in optimizers is identical to how you use it in Transformers as you get one file as input and are expected to return that same file as output but optimized.

The only difference with optimizers is that the map is not provided as part of an asset but rather as a separate parameter/option as you can see in the code snippet below. As always the map is an instance of the Parcel SourceMap class.

```js
// The contents and map are passed separately
async optimize({ bundle, contents, map }) {
  return { contents, map }
}
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
