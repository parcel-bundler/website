---
layout: layout.njk
eleventyNavigation:
  key: plugin-system-optimizer
  title: Optimizer
  order: 9
---

Optimizer plugins are similar to transformers but they accept a bundle instead of a single asset. Optimizers are commonly used to implement minification, tree shaking/dead code elimination, and other size reduction techniques that need a full bundle to be effective. However, Optimizers can also be used for any type of bundle transformation, such as prepending license headers, converting inline bundles to base 64, etc.

## Example

The `optimize` method receives the contents of a bundle and its source map, and should return transformed versions of these. Multiple Optimizer plugins may run in series, and the result of each Optimizer is passed to the next. See [below](#source-maps) for more info about source maps.

```javascript
import {Optimizer} from '@parcel/plugin';

export default new Optimizer({
  async optimize({contents, map}) {
    let {code, sourceMap} = optimize(contents, map);
    return {
      contents: code,
      map: sourceMap
    };
  }
});
```

## Loading configuration

Loading configuration from the user’s project should be done in the `loadConfig` method of an Optimizer plugin. See [Loading configuration](/plugin-system/authoring-plugins/#loading-configuration) for details on how to do this.

{% warning %}

**Note**: It's important to use Parcel's config loading mechanism so that the cache can be properly invalidated. Avoid loading files directly from the file system.

{% endwarning %}

## Conditional optimization

`Optimizer` plugins are always run by Parcel, even in development or when the `--no-optimize` option is specified. This is because Optimizers can be used for any kind of bundle transformation, not just compression. If your Optimizer plugin is performing minification or should generally only run in production builds, you should check the `shouldOptimize` property of the bundle's environment and return the original contents if it is `false`.

```javascript/5-8
import {Optimizer} from '@parcel/plugin';

export default new Optimizer({
  async optimize({contents, map, bundle}) {
    // Don't minify if shouldOptimize is false.
    if (!bundle.env.shouldOptimize) {
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

The input content passed to an Optimizer may be a string, [Buffer](https://nodejs.org/api/buffer.html), or [ReadableStream](https://nodejs.org/api/stream.html#stream_readable_streams). Typically, source code will be a string and binary content will be a Buffer or stream, but you should not assume this. The `@parcel/utils` package contains some functions to help convert between them: `blobToString` and `blobToBuffer`. Optimizers may return any of these representations.

```javascript/5
import {Optimizer} from '@parcel/plugin';
import {blobToBuffer} from '@parcel/utils';

export default new Optimizer({
  async optimize({contents}) {
    let buffer = await blobToBuffer(contents);
    let optimized = optimize(buffer);
    return {contents: optimized};
  }
});
```

## Source maps

Source maps help developers when debugging compiled and bundled code in the browser by mapping locations in the compiled code back to the original source code. Optimizer plugins should transform the provided source map in addition to the contents of the bundle.

Parcel uses the `@parcel/source-map` library for source map manipulation. See [Source Maps](/plugin-system/source-maps/) for more details on how to use it. You may need to convert the source map you pass to and from other tools.

The `getSourceMapReference` function passed to Optimizer plugins can be used to insert a URL to the source map within the bundle contents. Parcel takes care of generating inline source maps when appropriate (e.g. following [`sourceMap`](/features/targets/#sourcemap) options in Target config).

```javascript
import {Optimizer} from '@parcel/plugin';
import SourceMap from '@parcel/source-map';

export default new Optimizer({
  async optimize({contents, map, getSourceMapReference}) {
    // Convert the input source map to JSON.
    let result = optimize(contents, map.toVLQ());

    // Convert returned JSON source map to a Parcel SourceMap.
    let sourceMap = new SourceMap(options.projectRoot);
    sourceMap.addVLQMap(result.map);

    // Add source map reference to compiled code
    let url = await getSourceMapReference(sourceMap);
    result.code += `\n//# sourceMappingURL=${url}\n`

    return {
      contents: result.code,
      sourceMap
    };
  }
});
```

## Relevant API

{% include "../../api/optimizer.html" %}
