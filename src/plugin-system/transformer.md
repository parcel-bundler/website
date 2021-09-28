---
layout: layout.njk
eleventyNavigation:
  key: plugin-system-transformer
  title: Transformer
  order: 3
---

Transformer plugins transform a single asset to compile it, discover dependencies, or convert it to a different format. Many transformers are wrappers around other tools such as compilers and preprocessors, and are responsible for integrating them with Parcel.

## Transforming assets

There is one required function that must be passed to the [`Transformer`](#Transformer) constructor: `transform`. This function receives a [`MutableAsset`](#MutableAsset) object, which represents a file. The source code or content of the asset can be retrieved, along with any associated source map ([see below](#source-maps)). The transformer can then transform this content in some way, and set the compiled result back on the asset.

```javascript
import {Transformer} from '@parcel/plugin';

export default new Transformer({
  async transform({asset}) {
    // Retrieve the asset's source code and source map.
    let source = await asset.getCode();
    let sourceMap = await asset.getMap();

    // Run it through some compiler, and set the results 
    // on the asset.
    let {code, map} = compile(source, sourceMap);
    asset.setCode(code);
    asset.setMap(map);

    // Return the asset
    return [asset];
  }
});
```

## Loading configuration

Loading configuration from the user’s project should be done in the `loadConfig` method of a Transformer plugin. See [Loading configuration](/plugin-system/authoring-plugins#loading-configuration) for details on how to do this.

{% warning %}

**Note**: It's important to use Parcel's config loading mechanism so that the cache can be properly invalidated. Avoid loading files directly from the file system.

{% endwarning %}

## Changing the asset type

Transformers may transform an asset from one format to another, for example from TypeScript to JavaScript. To do this, set the asset's `type` property to the new file type (e.g. `js`). The asset will then be processed by the pipeline matching the new type. See [Transformers](/features/plugins/#transformers) in the Parcel configuration docs for details.

```javascript/7
import {Transformer} from '@parcel/plugin';

export default new Transformer({
  async transform({asset}) {
    let code = await asset.getCode();

    let result = compile(code);
    asset.type = 'js';
    asset.setCode(result);

    return [asset];
  }
});
```

## The environment

Assets are associated with an [`Environment`](/plugin-system/api/#Environment), which describes the how the asset should be compiled. The same asset may be processed multiple times with different environments, for example, when building for modern and legacy targets. If possible, Transformer plugins should take the environment into account when compiling code to ensure that the result works in and is optimized for the target. See [Targets](/features/targets/) for details.

```javascript/6-8
import {Transformer} from '@parcel/plugin';

export default new Transformer({
  async transform({asset}) {
    let code = await asset.getCode();

    let result = asset.env.isBrowser()
      ? compileForBrowser(code, asset.engines.browser)
      : compileForNode(code, asset.engines.node);

    asset.setCode(result);
    return [asset];
  }
});
```

See the [`Environment`](/plugin-system/api/#Environment) API docs for details on the available properties.

## Adding dependencies

In addition to transforming the contents of an asset, Transformer plugins are also responsible for discovering dependencies in the code so that they may also be processed by Parcel. Some transformers don’t need to worry about this, because another transformer will run afterward and do it (e.g. the default JavaScript transformer). If you’re adding support for a new language that doesn’t compile to one of the existing languages supported by Parcel, or otherwise introduces dependencies outside the compiled code, you’ll need to add them to the asset.

Dependencies can be added to an asset using the `addDependency` method, passing a [`DependencyOptions`](#DependencyOptions) object. There are two required parameters: `specifier`, which is a string describing the location of the dependency, and `specifierType`, which describes how the specifier should be interpreted. See [Dependency resolution](/features/dependency-resolution/) for details.

```javascript/8-11
import {Transformer} from '@parcel/plugin';

export default new Transformer({
  async transform({asset}) {
    let code = await asset.getCode();
    let deps = code.matchAll(/import "(.*?)"/g);
    
    for (let dep of deps) {
      asset.addDependency({
        specifier: dep,
        specifierType: 'esm'
      });
    }

    return [asset];
  }
});
```

### Influencing bundling

The way a dependency is specified can influence how it is bundled. By default, dependencies are bundled together into the same output file. The `priority` property of a dependency can specify that it should be loaded lazily or in parallel with the asset that depends on it. For example, dynamic `import()` in JavaScript loads dependencies with the `lazy` priority. See [Code splitting](/features/code-splitting/).

The `bundleBehavior` property further controls how a dependency is bundled. For example, dependencies may be separated into a new bundle but inlined into the parent by setting `bundleBehavior` to `inline`. See [Bundle inlining](/features/bundle-inlining/).

See [`DependencyOptions`](#DependencyOptions) for more details on each of the available options.

### URL dependencies

In some languages, dependencies reference other files by URL. In the compiled code, these URL references will need to be updated to point to the final bundle names. However, when an asset is being transformed, bundle names will not yet be known.

`addDependency` returns a unique dependency ID. This can be placed in the transformed asset content as a placeholder for the final bundle URL, and it will be replaced later by a Packager once the URL is known.

As a shortcut, the `addURLDependency` method creates a dependency with `specifierType` set to `url`, and `priority` set to `lazy` (to create a separate bundle).

```javascript/9-10
import {Transformer} from '@parcel/plugin';

export default new Transformer({
  async transform({asset}) {
    let code = await asset.getCode();
    let result = code.replace(/import "(.*?)"/g, (m, dep) => {
      // Replace the original specifier with a dependency id 
      // as a placeholder. This will be replaced later with 
      // the final bundle URL.
      let depId = asset.addURLDependency(dep);
      return `import "${depId}"`;
    });

    asset.setCode(result);
    return [asset];
  }
});
```

## Reusing ASTs

If multiple Transformer plugins run in series over an asset, it would be wasteful to parse, transform, and code generate for each one if they could reuse the same parsed AST. Parcel facilitates AST sharing by splitting the `transform` function into several parts:

- `canReuseAST` – If an AST is available from a previous Transformer plugin, it will be passed to this method on the next Transformer if available. It should inspect the `type` and `version` of the AST to determine if it can reuse it. If it returns `true`, then the `parse` method is not called and the AST is reused. If it returns `false`, then the previous Transformer's `generate` function is called, and the next Transformer's `parse` function is called with the results.
- `parse` – If an AST is not available, or `canReuseAST` returned false, then the Transformer's `parse` function is called. It should return an [`AST`](/plugin-system/api/#AST) object describing the type, version, and contents of the AST.
- `generate` – If the next Transformer cannot reuse the AST, or this is the last Transformer in a pipeline, `generate` will be called with the AST object. A result object containing generated content and a source map should be returned.

```javascript
import {Transformer} from '@parcel/plugin';
import semver from 'semver';

export default new Transformer({
  async canReuseAST({ast}) {
    return ast.type === 'my-compiler' 
      && semver.satisfies(ast.version, '^1.0.0');
  },
  async parse({asset}) {
    return {
      type: 'my-compiler',
      version: '1.0.0',
      program: parse(await asset.getCode())
    };
  },
  async transform({asset}) {
    let ast = await asset.getAST();

    let compiledAST = compile(ast.program);
    asset.setAST({
      type: 'my-compiler',
      version: '1.0.0',
      program: compiledAST
    });

    return [asset];
  },
  async generate({ast}) {
    let {content, map} = generate(ast.program);
    return {
      content,
      map
    };
  }
});
```

## Source maps


Source maps help developers when debugging compiled and bundled code in the browser by mapping locations in the compiled code back to the original source code. Transformer plugins should add a source map to assets when transforming their content if possible. Since assets may be processed by multiple Transformers, you should also transform the existing source map included with the asset in addition to its content.

Parcel uses the `@parcel/source-map` library for source map manipulation. See [Source Maps](/plugin-system/source-maps/) for more details on how to use it. You may need to convert the source map you pass to and from other tools.

```javascript
import {Transformer} from '@parcel/plugin';
import SourceMap from '@parcel/source-map';

export default new Transformer({
  async transform({asset, options}) {
    let source = await asset.getCode();
    let sourceMap = await asset.getMap();

    // Convert the input source map to JSON.
    let result = compile(source, sourceMap.toVLQ());
    asset.setCode(result.code);

    // Convert returned JSON source map to a Parcel SourceMap.
    let map = new SourceMap(options.projectRoot);
    map.addVLQMap(result.map);
    asset.setMap(map);

    return [asset];
  }
});
```

## Binary data

In addition to textual source code, Transformers can handle binary content. This can be done either by using a [Buffer](https://nodejs.org/api/buffer.html), or using [streams](https://nodejs.org/api/stream.html).

```javascript/4,7
import {Transformer} from '@parcel/plugin';

export default new Transformer({
  async transform({asset}) {
    let buffer = await asset.getBuffer();

    let result = transform(buffer);
    asset.setBuffer(result);

    return [asset];
  }
});
```

## Query parameters

An asset may be referenced by a dependency with [query parameters](/features/dependency-resolution/#query-parameters). These specify options for the transformer to use when compiling or transforming the asset. For example, the Parcel [image transformer](/recipes/image/) uses query parameters to allow users to specify the width, height, and format to convert images to. The same asset may be compiled multiple times with different query parameters.

```javascript/8-9
import {Transformer} from '@parcel/plugin';

export default new Transformer({
  async transform({asset}) {
    let buffer = await asset.getBuffer();

    let result = resize(
      buffer,
      asset.query.width,
      asset.query.height
    );

    asset.setBuffer(result);
    return [asset];
  }
});
```

## Returning multiple assets

All of the examples so far have shown how to transform a single asset. However, sometimes a file may contain multiple different assets. For example, in HTML there are inline `<script>` and `<style>` elements that should be processed through their own separate Parcel pipelines. For this, Parcel allows returning multiple assets from a transformer.

To create new assets, return an array of [`TransformerResult`](#TransformerResult) objects. These must have a `type` and `content`, but may also have dependencies of their own, as well as many of the same options that `Asset` objects have.

Usually, the original asset should be returned in addition to any child assets it may have. The parent can create dependencies on the children by assigning them a `uniqueKey` property and referencing that as the `specifier` of a dependency. This allows creating "virtual" assets that don't really exist on the file system, but may be referenced like they are.

```javascript
import {Transformer} from '@parcel/plugin';

export default new Transformer({
  async transform({asset}) {
    let code = await asset.getCode();

    // Extract inline assets to return in addition to this asset.
    let assets = [asset];

    let uniqueKey = `${asset.id}-style`;
    assets.push({
      type: 'css',
      content: '...',
      uniqueKey,
      bundleBehavior: 'inline'
    });

    // Add a dependency, using the uniqueKey as a specifier.
    asset.addDependency({
      specifier: uniqueKey,
      specifierType: 'esm'
    });

    return assets;
  }
});
```

## Relevant API

{% include "../../api/transformer.html" %}
