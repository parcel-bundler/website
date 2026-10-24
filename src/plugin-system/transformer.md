---
layout: layout.njk
eleventyNavigation:
  key: plugin-system-transformer
  title: Transformer
  order: 4
---

Transformer plugins transform a single asset to compile it, discover dependencies, or convert it to a different format. Many transformers are wrappers around other tools such as compilers and preprocessors, and are responsible for integrating them with Parcel.

## Transforming assets

There is one required function that must be passed to the [`Transformer`](#Transformer) constructor: `transform`. This function receives a [`MutableAsset`](#MutableAsset) object, which represents a file. The source code or content of the asset can be retrieved, along with any associated source map ([see below](#source-maps)). The transformer can then transform this content in some way, and set the compiled result back on the asset.

```javascript
import { Transformer } from "@parcel/plugin";

export default new Transformer({
  async transform({ asset }) {
    // Retrieve the asset's source code and source map.
    let source = asset.getCode();
    let sourceMap = asset.getMap();

    // Run it through some compiler, and set the results
    // on the asset.
    let { code, map } = compile(source, sourceMap);
    asset.setCode(code, map);
  },
});
```

## Loading configuration

Configuration for a Transformer plugin is specified in the user's `.parcelrc`, and passed to the `transform` method as the `config` option. See [Configuration](/plugin-system/authoring-plugins/#configuration) for details.

{% note %}

**Note**: Files that a Transformer reads with the `fs` module (e.g. a config file loaded by the compiler it wraps) are tracked automatically, so Parcel rebuilds when they change. Use the `resolve` function passed to `transform` to resolve other files the same way Parcel resolves dependencies. See [Invalidation](/plugin-system/authoring-plugins/#invalidation) for details.

{% endnote %}

## Changing the asset type

Transformers may transform an asset from one format to another, for example from TypeScript to JavaScript. To do this, set the asset's `type` property to the new file type (e.g. `js`). The asset will then be processed by the pipeline matching the new type. See [Transformers](/features/plugins/#transformers) in the Parcel configuration docs for details.

```javascript/8
import {Transformer} from '@parcel/plugin';

export default new Transformer({
  async transform({asset}) {
    let code = asset.getCode();

    let result = compile(code);
    asset.type = 'js';
    asset.setCode(result);
  }
});
```

## The environment

Assets are associated with a [`Target`](/plugin-system/api/#Target), which describes the environment the asset should be compiled for. The same asset may be processed multiple times with different targets, for example, when building for both browsers and Node. If possible, Transformer plugins should take the target into account when compiling code to ensure that the result works in and is optimized for the target. See [Targets](/features/targets/) for details.

```javascript/6-8
import {Transformer} from '@parcel/plugin';

export default new Transformer({
  async transform({asset}) {
    let code = asset.getCode();

    let result = asset.target.isBrowser()
      ? compileForBrowser(code, asset.target.engines.browsers)
      : compileForNode(code, asset.target.engines.node);

    asset.setCode(result);
  }
});
```

See the [`Target`](/plugin-system/api/#Target) API docs for details on the available properties.

## Adding dependencies

In addition to transforming the contents of an asset, Transformer plugins are also responsible for discovering dependencies in the code so that they may also be processed by Parcel. Some transformers don’t need to worry about this, because another transformer will run afterward and do it (e.g. the default JavaScript transformer). If you’re adding support for a new language that doesn’t compile to one of the existing languages supported by Parcel, or otherwise introduces dependencies outside the compiled code, you’ll need to add them to the asset.

Dependencies can be added to an asset using the `addDependency` method, passing a [`DependencyOptions`](#DependencyOptions) object. The only required parameter is `specifier`, which is a string describing the location of the dependency. The `specifierType` describes how the specifier should be interpreted, and defaults to `esm`. See [Dependency resolution](/features/dependency-resolution/) for details.

```javascript/8-11
import {Transformer} from '@parcel/plugin';

export default new Transformer({
  async transform({asset}) {
    let code = asset.getCode();
    let deps = code.matchAll(/import "(.*?)"/g);

    for (let [, specifier] of deps) {
      asset.addDependency({
        specifier,
        specifierType: 'esm'
      });
    }
  }
});
```

### Influencing bundling

The way a dependency is specified can influence how it is bundled. By default, dependencies are bundled together into the same output file. The `priority` property of a dependency can specify that it should be loaded lazily or in parallel with the asset that depends on it. For example, dynamic `import()` in JavaScript loads dependencies with the `lazy` priority. See [Code splitting](/features/code-splitting/).

The `bundleBehavior` property further controls how a dependency is bundled. For example, dependencies may be separated into a new bundle but inlined into the parent by setting `bundleBehavior` to `inline`. See [Bundle inlining](/features/bundle-inlining/).

See [`DependencyOptions`](#DependencyOptions) for more details on each of the available options.

### URL dependencies

In some languages, dependencies reference other files by URL. In the compiled code, these URL references will need to be updated to point to the final bundle names. However, when an asset is being transformed, bundle names will not yet be known.

`addDependency` returns a unique placeholder string for the dependency. This can be placed in the transformed asset content as a placeholder for the final bundle URL, and it will be replaced later during packaging once the URL is known.

As a shortcut, the `addURLDependency` method creates a dependency with `specifierType` and `importType` set to `url`, and `priority` set to `lazy` (to create a separate bundle).

<!-- TODO(v3): placeholders are not replaced when the asset is later processed by another transformer that re-parses the code. E.g. a transformer that sets `asset.type = 'js'` and emits `import "<placeholder>"` fails with "Failed to resolve '<placeholder>'": the JS transformer collects the placeholder as a new dependency rather than matching it to the one added with addURLDependency. Tested with target/release/parcel. Only content packaged without re-parsing (or native custom content) can use placeholders today. -->

```javascript/10-11
import {Transformer} from '@parcel/plugin';

export default new Transformer({
  async transform({asset}) {
    let code = asset.getCode();
    let result = code.replace(/import "(.*?)"/g, (m, dep) => {
      // Replace the original specifier with a placeholder.
      // This will be replaced later with the final
      // bundle URL.
      let placeholder = asset.addURLDependency(dep);
      return `import "${placeholder}"`;
    });

    asset.setCode(result);
  }
});
```

## Source maps

Source maps help developers when debugging compiled and bundled code in the browser by mapping locations in the compiled code back to the original source code. Transformer plugins should add a source map to assets when transforming their content if possible. Since assets may be processed by multiple Transformers, you should also transform the existing source map included with the asset in addition to its content.

Source maps are passed to and from plugins as plain JSON objects in the standard [source map format](https://tc39.es/ecma426/) (version 3), so they can usually be passed to and from other tools directly. The `getMap` method returns the asset's current source map, or `null` if it doesn't have one. The `setCode` and `setBuffer` methods accept a source map as their second argument. See [Source Maps](/plugin-system/source-maps/) for more details.

```javascript
import { Transformer } from "@parcel/plugin";

export default new Transformer({
  async transform({ asset }) {
    let source = asset.getCode();
    let sourceMap = asset.getMap();

    // Pass the input source map to the compiler, and set
    // the returned source map on the asset.
    let result = compile(source, sourceMap);
    asset.setCode(result.code, result.map);
  },
});
```

## Binary data

In addition to textual source code, Transformers can handle binary content. The `getBuffer` method returns the contents of the asset as a [Uint8Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array), and `setBuffer` accepts a `Uint8Array` (or a [Buffer](https://nodejs.org/api/buffer.html)).

```javascript/4,7
import {Transformer} from '@parcel/plugin';

export default new Transformer({
  async transform({asset}) {
    let buffer = asset.getBuffer();

    let result = transform(buffer);
    asset.setBuffer(result);
  }
});
```

## Query parameters

An asset may be referenced by a dependency with [query parameters](/features/dependency-resolution/#query-parameters). These specify options for the transformer to use when compiling or transforming the asset. For example, the Parcel [image transformer](/recipes/image/) uses query parameters to allow users to specify the width, height, and format to convert images to. The same asset may be compiled multiple times with different query parameters. The query is included in the asset's `url` property.

```javascript/5,11-12
import {Transformer} from '@parcel/plugin';

export default new Transformer({
  async transform({asset}) {
    let query = new URL(asset.url).searchParams;
    let buffer = asset.getBuffer();

    let result = resize(
      buffer,
      query.get('width'),
      query.get('height')
    );

    asset.setBuffer(result);
  }
});
```

<!-- TODO(v3): v2's "Returning multiple assets" section was removed. JS `transform` returns void (crates/plugin-js/src/plugin.rs ignores the return value) and the native SDK has no way to create additional assets either, yet MutableAsset still documents `uniqueKey` "when a transformer returns multiple assets" (packages-v3/plugin/src/types.ts). Confirm whether this is planned. -->

## Native transformers

Transformers can also be written as [native plugins](/plugin-system/native-plugins/). With the Rust SDK, implement the `transform` method of the `Plugin` trait. This example converts a text file into a JavaScript module, using a `prefix` option from the plugin's `.parcelrc` config.

```rust
use parcel_plugin::{register_plugin, Asset, Diagnostic, Options, Plugin};

struct TxtTransformer {
  prefix: String,
}

impl Plugin for TxtTransformer {
  fn new(config: &[u8]) -> Result<Self, Diagnostic> {
    // `config` is the plugin's config from .parcelrc as JSON,
    // or empty if none was provided.
    let prefix = if config.is_empty() {
      String::new()
    } else {
      let config: serde_json::Value = serde_json::from_slice(config)
        .map_err(|e| Diagnostic::new(e.to_string()))?;
      config["prefix"].as_str().unwrap_or_default().to_owned()
    };
    Ok(TxtTransformer { prefix })
  }

  fn transform(&self, asset: &mut Asset, _options: &Options) -> Result<(), Diagnostic> {
    let text = format!("{}{}", self.prefix, asset.content());
    asset.set_content(format!("export default {:?};\n", text));
    asset.set_type("js");
    Ok(())
  }
}

register_plugin!(TxtTransformer);
```

Native transformers can also attach custom content to an asset, which controls how it is packaged into a bundle. See [Native plugins](/plugin-system/native-plugins/) for details.

## Relevant API

{% include "../../api/transformer.html" %}
