---
layout: layout.njk
eleventyNavigation:
  key: plugin-system-source-maps
  title: Source Maps
  order: 16
---

Parcel utilizes the `@parcel/source-maps` package for processing source maps to ensure performance and reliability when manipulating source maps across plugins and Parcel's core. This library has been written from the ground up in Rust, and gave us a 20x performance improvement over the previous JavaScript-based implementation. This improvement in performance is mainly due to optimizations in the data structures and the way in which we cache source maps.

## How to use the library

To use `@parcel/source-maps`, create an instance of the exported `SourceMap` class, on which you can call various functions to add and edit source mappings. A `projectRoot` directory path should be passed as an argument. All paths within the source map are converted to be relative to this.

Below is an example covering all ways of adding mappings to a `SourceMap` instance:

```js
import SourceMap from '@parcel/source-map';

let sourcemap = new SourceMap(projectRoot);

// Each function that adds mappings has optional offset arguments.
// These can be used to offset the generated mappings by a certain amount.
let lineOffset = 0;
let columnOffset = 0;

// Add indexed mappings
// These are mappings that can sometimes be extracted from a library even before they get converted into VLQ Mappings
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

// Add vlq mappings. This is what would be outputted into a vlq encoded source map
sourcemap.addVLQMap(
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

// Source maps can be serialized to buffers, which is what we use for caching in Parcel.
// You can instantiate a SourceMap with these buffer values by passing it to the constructor
let map = new SourceMap(projectRoot, mapBuffer);

// You can also add a buffer to an existing source map using the addBuffer method.
sourcemap.addBuffer(originalMapBuffer, lineOffset);

// One SourceMap object may be added to another using the addSourceMap method.
sourcemap.addSourceMap(map, lineOffset);
```

## Transformations/Manipulations

If your plugin does any code manipulations, you should ensure that it creates correct mappings to the original source code to guarantee that we still end up creating an accurate source map at the end of the bundling process. You are expected to return a `SourceMap` instance at the end of a transform in a [Transformer](/plugin-system/transformer/) plugin.

We also provide the source map from the previous transform to ensure you map to the original source code and not just the output of the previous transform. If a compiler doesn't have a way to pass in an input source map, you can use the `extends` method of a `SourceMap` to map the original mappings to the compiled ones.

The `asset` value that gets passed in the `parse`, `transform` and `generate` functions of a transformer plugin contains a function called `getMap()` and `getMapBuffer()`. These functions can be used to get a SourceMap instance (`getMap()`) and the cached SourceMap Buffer (`getMapBuffer()`).

You are free to manipulate the source map at any of these steps in the transformer as long as you ensure the source map that gets returned in `generate` maps to the original sourcefile correctly.

Below is an example on how to manipulate sourcemaps in a transformer plugin:

```js
import {Transformer} from '@parcel/plugin';
import SourceMap from '@parcel/source-map';

export default new Transformer({
  // ...

  async generate({asset, ast, resolve, options}) {
    let compilationResult = someCompiler(await asset.getAST());

    let map = null;
    if (compilationResult.map) {
      // If the compilationResult returned a map we convert 
      // it to a Parcel SourceMap instance.
      map = new SourceMap(options.projectRoot);

      // The compiler returned a full, encoded sourcemap with vlq mappings.
      // Some compilers might have the possibility of returning 
      // indexedMappings which might improve performance (like Babel does).
      // In general, every  compiler is able to return rawMappings, so
      // it's always a safe bet to use this.
      map.addVLQMap(compilationResult.map);

      // We get the original source map from the asset to extend our mappings 
      // on top of it. This ensures we are mapping to the original source
      // instead of the previous transformation.
      let originalMap = await asset.getMap();
      if (originalMap) {
        // The `extends` function uses the provided map to remap the original 
        // source positions of the map it is called on. In this case, the 
        // original source positions of `map` get remapped to the positions 
        // in `originalMap`.
        map.extends(originalMap);
      }
    }

    return {
      code: compilationResult.code,
      map,
    };
  },
});
```

If your compiler supports the option to pass in an existing sourcemap, this may result in more accurate sourcemaps than using the method in the previous example.

An example of how this would work:

```js
import {Transformer} from '@parcel/plugin';
import SourceMap from '@parcel/source-map';

export default new Transformer({
  // ...

  async generate({asset, ast, resolve, options}) {
    // Get the original map from the asset.
    let originalMap = await asset.getMap();
    let compilationResult = someCompiler(await asset.getAST(), {
      // Pass the VLQ encoded version of the originalMap to the compiler.
      originalMap: originalMap.toVLQ(),
    });

    // In this case the compiler is responsible for mapping to the original 
    // positions provided in the originalMap, so we can just convert it to 
    // a Parcel SourceMap and return it.
    let map = new SourceMap(options.projectRoot);
    if (compilationResult.map) {
      map.addVLQMap(compilationResult.map);
    }

    return {
      code: compilationResult.code,
      map,
    };
  },
});
```

## Concatenating sourcemaps in Packagers

If you're writing a custom packager, it's your responsibility to concatenate the source maps of all the assets while packaging. This is done by creating a new `SourceMap` instance and adding new mappings to it using the `addSourceMap(map, lineOffset)` function. `lineOffset` should be equal to the line index at which the asset output starts.

Below is an example of how to do this:

```js
import {Packager} from '@parcel/plugin';
import SourceMap from '@parcel/source-map';

export default new Packager({
  async package({bundle, options}) {
    // Read content and source maps for each asset in the bundle.
    let promises = [];
    bundle.traverseAssets(asset => {
      promises.push(Promise.all([
        asset.getCode(),
        asset.getMap()
      ]);
    });

    let results = await Promise.all(promises);

    // Instantiate a string to hold the bundle contents, and
    // a SourceMap to hold the combined bundle source map.
    let contents = '';
    let map = new SourceMap(options.projectRoot);
    let lineOffset = 0;

    // Add the contents of each asset.
    for (let [code, map] of assets) {
      contents += code + '\n';

      // Add the source map if the asset has one, and offset
      // it by the number of lines in the bundle so far.
      if (map) {
        map.addSourceMap(map, lineOffset);
      }

      // Add the number of lines in this asset.
      lineOffset += countLines(code) + 1;
    }

    // Return the contents and map.
    return {contents, map};
  },
});
```

### Concatenating ASTs

If you're concatenating ASTs instead of source contents you already have the source mappings embedded into the AST, which you can use to generate the final source map. However, you must ensure that those mappings stay intact while editing the AST nodes. Sometimes this can be quite challenging if you're doing a lot of modifications.

An example of how this works:

```js
import {Packager} from '@parcel/plugin';
import SourceMap from '@parcel/source-map';

export default new Packager({
  async package({bundle, options}) {
    // Do the AST concatenation and return the compiled result
    let compilationResult = concatAndCompile(bundle);

    // Create the final packaged sourcemap
    let map = new SourceMap(options.projectRoot);
    if (compilationResult.map) {
      map.addVLQMap(compilationResult.map);
    }

    // Return the compiled code and map
    return {
      code: compilationResult.code,
      map,
    };
  },
});
```

## Postprocessing source maps in optimizers

Using source maps in optimizers is identical to how you use it in transformers. You get one file as input and are expected to return that same file as output, but optimized.

The only difference with optimizers is that the map is not provided as part of an asset but rather as a separate parameter/option, as you can see in the code snippet below. As always, the map is an instance of the `SourceMap` class.

```js
import {Optimizer} from '@parcel/plugin';

export default new Optimizer({
  // The contents and map are passed separately
  async optimize({bundle, contents, map}) {
    return {contents, map};
  }
});
```

## Diagnosing issues

If you encounter incorrect mappings and want to debug these, we have built tools that can help you diagnose these issues. By running the `@parcel/reporter-sourcemap-visualiser` reporter, Parcel creates a `sourcemap-info.json` file with all the necessary information to visualize all the mappings and source content.

To enable it, use the `--reporter` option, or add it to your `.parcelrc`.

```bash
parcel build src/index.js --reporter @parcel/reporter-sourcemap-visualizer
```

After the reporter has created the `sourcemap-info.json` file, you can upload it to the [sourcemap visualizer](https://sourcemap-visualiser.now.sh/).

## API

{% include "../../api/source-map.html" %}
