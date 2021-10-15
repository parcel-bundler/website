---
layout: layout.njk
eleventyNavigation:
  key: plugin-system-namer
  title: Namer
  order: 6
---

Namer plugins determine the output filename for a bundle. Namers run in a pipeline until one of them returns a result. Returned file paths should be relative to the target `distDir`. See [Targets](/features/targets/) for details about this.

## Overriding names for specific bundles

A common use case for a Namer plugin is to override Parcel’s default naming scheme for specific bundles. Namers may return `null` when they don't handle a bundle to allow the next namer in the pipeline to handle it instead. See [Namers](/features/plugins/#namers) in the Parcel configuration docs for details on how this works.

This example places all `png` and `jpg` files into an `images` folder with the same name as their original filename.

```javascript
import {Namer} from '@parcel/plugin';
import path from 'path';

export default new Namer({
  name({bundle}) {
    if (bundle.type === 'png' || bundle.type === 'jpg') {
      let filePath = bundle.getMainEntry().filePath;
      return `images/${path.basename(filePath)}`;
    }

    // Allow the next namer to handle this bundle.
    return null;
  }
});
```

{% error %}

**Note**: This example does not ensure that all filenames are unique. If two images had the same filename in different directories, the build would fail.

{% enderror %}

## Content hashing

Including a hash of a bundle’s contents is an important optimization for production builds that enables browsers to cache loaded files indefinitely. When the contents of a bundle changes, so does its filename, which acts as a cache invalidation mechanism. See the [Content hashing](/features/production/#content-hashing) docs for details about this.

At the point bundles are being named, the final contents is not yet known, so Parcel provides a `hashReference` property on each [`Bundle`](/plugin-system/bundler/#Bundle) object. This is an opaque placeholder value that will later on be replaced with the actual hash when writing the final bundles. Use this in returned bundle names to include a content hash.

Make sure to check the `bundle.needsStableName` property before including a hash. When this is `true`, a dependency is expecting the filename of the bundle to remain consistent over time. For example, service workers require their URLs never to change, and users expect visible URLs like HTML pages to be human readable and remain consistent.

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

{% note %}

Hashes are also a good way to ensure that returned bundle names are unique, even when content hashing is disabled (e.g. in development, or with `--no-content-hash`). In this case, the `hashReference` is replaced with a hash of the original file path, which will not change over time.

{% endnote %}

## Targets

Namer plugins should also respect the [`Target`](/plugin-system/api/#Target) associated with a bundle. [Targets](/features/targets/) allow users to configure the output filenames of entry bundles in `package.json`. If a bundle is in an entry bundle group and contains the entry asset, Namer plugins should use `bundle.target.distEntry` as the output filename when available.

```javascript
import {Namer} from '@parcel/plugin';

export default new Namer({
  name({bundle, bundleGraph}) {
    let bundleGroup = bundleGraph
      .getBundleGroupsContainingBundle(bundle)[0];
    let isEntry = bundleGraph.isEntryBundleGroup(bundleGroup);
    let bundleGroupBundles = bundleGraph
      .getBundlesInBundleGroup(bundleGroup);
    let mainBundle = bundleGroupBundles.find(b =>
      b.getEntryAssets()
       .some(a => a.id === bundleGroup.entryAssetId),
  );

    if (
      isEntry && 
      bundle.id === mainBundle.id && 
      bundle.target?.distEntry
    ) {
      return bundle.target.distEntry;
    }

    // ...
  }
});
```

## Loading configuration

Loading configuration from the user’s project should be done in the `loadConfig` method of a Namer plugin. See [Loading configuration](/plugin-system/authoring-plugins/#loading-configuration) for details on how to do this.

{% warning %}

**Note**: It's important to use Parcel's config loading mechanism so that the cache can be properly invalidated. Avoid loading files directly from the file system.

{% endwarning %}

## Relevant API

{% include "../../api/namer.html" %}
