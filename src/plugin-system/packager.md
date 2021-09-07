---
layout: layout.njk
eleventyNavigation:
  key: plugin-system-packager
  title: Packager
  order: 8
---

Packager plugins are responsible for combining all of the assets in a bundle together into an output file. They also handle resolving URL references, bundle inlining, and generating source maps.

## Example

This example shows a Packager that concatenates all of the assets in a bundle together. The `traverseAsset` method of a [`Bundle`](/plugin-system/bundler/#Bundle) object traverses all assets within the bundle in depth-first order. The `getCode` method is called on each [`Asset`](/plugin-system/transformer/#BaseAsset) to retrieve its contents.

```javascript
import {Packager} from '@parcel/plugin';

export default new Packager({
  async package({bundle}) {
    let promises = [];
    bundle.traverseAssets(asset => {
      promises.push(asset.getCode());
    });

    let contents = await Promise.all(promises);
    return {
      contents: contents.join('\n')
    };
  }
});
```

## Loading configuration

Loading configuration from the user’s project should be done in the `loadConfig` method of a Packager plugin. See [Loading configuration](/plugin-system/authoring-plugins/#loading-configuration) for details on how to do this.

{% warning %}

**Note**: It's important to use Parcel's config loading mechanism so that the cache can be properly invalidated. Avoid loading files directly from the file system.

{% endwarning %}

## Source maps

Source maps help developers when debugging compiled and bundled code in the browser by mapping locations in the compiled code back to the original source code. In addition to combining code into a final bundle, Packagers are responsible for combining source maps from each asset into a source map for the bundle.

Parcel uses the `@parcel/source-map` library for source map manipulation. See [Source Maps](/plugin-system/source-maps/) for more details on how to use it.

The `getSourceMapReference` function passed to Packager plugins can be used to insert a URL to the source map within the bundle contents. Parcel takes care of generating inline source maps when appropriate (e.g. following [`sourceMap`](/features/targets/#sourcemap) options in Target config).

```javascript
import {Packager} from '@parcel/plugin';
import SourceMap from '@parcel/source-map';
import {countLines} from '@parcel/utils';

export default new Packager({
  async package({bundle, options, getSourceMapReference}) {
    let promises = [];
    bundle.traverseAssets(asset => {
      promises.push(Promise.all([
        asset.getCode(),
        asset.getMap()
      ]);
    });

    let assets = await Promise.all(promises);
    let contents = '';
    let map = new SourceMap(options.projectRoot);
    let lineOffset = 0;

    for (let [code, map] of assets) {
      contents += code + '\n';
      map.addSourceMap(map, lineOffset);
      lineOffset += countLines(code) + 1;
    }

    contents += `\n//# sourceMappingURL=${await getSourceMapReference(map)}\n`;
    return {contents, map};
  }
});
```

## URL references

Transformer plugins may leave references to dependency IDs in the compiled code (see [URL dependencies](/plugin-system/transformer/#url-dependencies) in the Transformer docs). Packagers should replace these references with the URL of the generated bundle. This can be done using the `replaceURLReferences` function in `@parcel/utils`.

```javascript
import {Packager} from '@parcel/plugin';
import {replaceURLReferences} from '@parcel/utils';

export default new Packager({
  async package({bundle, bundleGraph}) {
    // ...

    ({contents, map} = replaceURLReferences({
      bundle,
      bundleGraph,
      contents,
      map
    }));

    return {contents, map};
  }
});
```

## Bundle inlining

Parcel supports inlining the contents of one bundle within another. For example, the compiled contents of a CSS bundle could be inlined as a string within a JavaScript bundle. See [Bundle inlining](/features/bundle-inlining/) for details.

Bundle inlining is implemented in Packager plugins. A `getInlineBundleContents` function is passed to Packagers, which can be called to retrieve the contents of an inline bundle.

Transformer plugins may leave references to dependency IDs in the compiled code (see [URL dependencies](/plugin-system/transformer/#url-dependencies) in the Transformer docs). If these end up referring to an inline bundle, they should be replaced with that bundle's contents. This can be done using the `replaceInlineReferences` function in `@parcel/utils`.

```javascript
import {Packager} from '@parcel/plugin';
import {replaceInlineReferences} from '@parcel/utils';

export default new Packager({
  async package({bundle, bundleGraph, getInlineBundleContents}) {
    // ...

    ({contents, map} = replaceInlineReferences({
      bundle,
      bundleGraph,
      contents,
      map,
      getInlineBundleContents,
      getInlineReplacement: (dependency, inlineType, contents) => ({
        from: dependency.id,
        to: contents
      })
    }));

    return {contents, map};
  }
});
```

## Relevant API

{% include "../../api/packager.html" %}
