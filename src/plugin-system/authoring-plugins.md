---
layout: layout.njk
eleventyNavigation:
  key: plugin-system-authoring-plugins
  title: Authoring Plugins
  order: 2
summary: "What to keep in mind when authoring a plugin"
---

## Plugin APIs

There are several different types of plugins. They all look very similar, but
are kept separate so we can have strict contracts on what each one is allowed
to do.

There are some rules that should be followed across every type of plugin:

- **Stateless** — Avoid any kind of state, it will likely be the source of bugs
  for your users. For example, the same transform may exist in multiple
  separate workers which are not allowed to communicate with one another, state
  will not work as expected.
- **Pure** — Given the same input, a plugin must produce the same output, and
  you must not have any observable side effects, or implicit dependencies.
  Otherwise Parcel's caching will break and your users will be sad. You should
  never have to tell users to delete their caches.

The plugin APIs all follow a common shape:

```js
import { NameOfPluginType } from "@parcel/plugin";

export default new NameOfPluginType({
  async methodName(opts: JSONObject): Promise<JSONObject> {
    return result;
  },
});
```

Each method of a plugin is an async function that:

- Accept a strictly validated `opts` object.
- Return a strictly validated `result` object.

If something you need is not being passed through `opts`, please come talk to
the Parcel team about it. Avoid trying to get information yourself from other
sources, especially from the file system.

## Loading configuration

Many plugins will need to load configuration of some kind from the user’s project. In some cases, the compiler or tool the plugin is wrapping will have a config loading mechanism built in. In other cases, you’ll need to create a config file format for your plugin.

{% warning %}

**Note**: it’s important to use Parcel’s config loading mechanism rather than reading from the file system directly. The results of all plugins are cached by Parcel, and if you don’t use Parcel’s config loading system it will not be aware of files you read yourself and will not be able to properly invalidate the cache.

{% endwarning %}

Config loading is done in the `loadConfig` method, which is supported by most plugin types. It receives a [`Config`](/plugin-system/transformer/#Config) object, which includes utility methods for loading config files, as well as methods for telling Parcel about files and dependencies the config file relies on that should invalidate the result. The result returned from the `loadConfig` function is passed into the other plugin functions.

```javascript
import {Transformer} from '@parcel/plugin';

export default new Transformer({
  async loadConfig({config}) {
    let {contents, filePath} = await config.getConfig([
      'tool.config.json'
    ]);

    return contents;
  },
  async transform({asset, config}) {
    // ...
    return [asset];
  }
});
```

The above example uses the `getConfig` method of the `Config` object to load a config file. This searches up the directory tree from the asset's file path for config files matching the file names given. It can load files using JSON5 (default), JavaScript, or TOML, and the file path is automatically added as an invalidation to the config.

### Adding invalidations

If you’re using a config loading mechanism that’s built into a compiler or tool you’re wrapping, you’ll need to tell Parcel about any files that were loaded in the process by calling `invalidateOnFileChange`. This way, Parcel can invalidate files that are compiled using this config whenever it changes. A list of loaded files is often returned along with the loaded config by various tools.

If no config is loaded, or a new config file closer to the asset would change result, you should use the `invalidateOnFileCreate` method to watch for the config file to be created. This way, when Parcel detects a new config file, the plugin will be re-run and the new config will be loaded.

```javascript
import {Transformer} from '@parcel/plugin';

export default new Transformer({
  async loadConfig({config}) {
    let {result, files} = await loadToolConfigSomehow(config.searchPath);

    if (result) {
      // Invalidate whenever one of the loaded files changes.
      for (let file of files) {
        config.invalidateOnFileChange(file);
      }
    } else {
      // Invalidate when a new config is created.
      config.invalidateOnFileCreate({
        fileName: 'tool.config.json',
        aboveFilePath: config.searchPath
      });
    }

    return result;
  }
});
```

### Dev dependencies

Parcel automatically tracks the source files of Parcel plugins themselves and all of their dependencies for changes. If the code for a plugin changes, the cache must be invalidated and any assets that were produced by the plugin must be rebuilt.

Some plugins may load other dependencies dynamically. For example, a transformer might have plugins of its own that are configured in the user’s project (e.g. Babel). These cannot be automatically tracked, and must be added as dev dependencies to the Config object. This is done using the `addDevDependency` method.

```javascript
import {Transformer} from '@parcel/plugin';

export default new Transformer({
  async loadConfig({config}) {
    let {result, filePath} = await loadToolConfigSomehow(config.searchPath);

    for (let plugin of result.plugins) {
      config.addDevDependency({
        specifier: plugin,
        resolveFrom: filePath
      });
    }

    return result;
  }
});
```

### JavaScript configs

Some tools use config files written in JavaScript, rather than a static config language like JSON, YAML, or TOML. Unfortunately, these programatic config files can cause issues for caching in Parcel because they may return non-deterministic results.

A convention for dealing with this in Parcel is to always invalidate the config when the Parcel process restarts. This way, JavaScript configs aren’t invalidated on every build (which would be too slow), but in the case where the config is non-deterministic, restarting Parcel ensures it is up to date.

This can be done by using the `invalidateOnStartup` method of the `Config` object.

```javascript
import {Transformer} from '@parcel/plugin';

export default new Transformer({
  async loadConfig({config}) {
    let {contents, filePath} = await config.getConfig([
      'tool.config.json',
      'tool.config.js'
    ]);

    if (filePath.endsWith('.js')) {
      config.invalidateOnStartup();
    }

    return contents;
  }
});
```

See the [`Config`](/plugin-system/transformer/#Config) object API docs for more details on all of the available methods and properties.

## Naming

All plugins must follow a naming system:

<div style="font-size: 0.9em">

|              | Official package             | Community packages          | Private company/scoped team packages |
| ------------ | ---------------------------- | --------------------------- | ------------------------------------ |
| Configs      | `@parcel/config-{name}`      | `parcel-config-{name}`      | `@scope/parcel-config[-{name}]`      |
| Resolvers    | `@parcel/resolver-{name}`    | `parcel-resolver-{name}`    | `@scope/parcel-resolver[-{name}]`    |
| Transformers | `@parcel/transformer-{name}` | `parcel-transformer-{name}` | `@scope/parcel-transformer[-{name}]` |
| Bundlers     | `@parcel/bundler-{name}`     | `parcel-bundler-{name}`     | `@scope/parcel-bundler[-{name}]`     |
| Namers       | `@parcel/namer-{name}`       | `parcel-namer-{name}`       | `@scope/parcel-namer[-{name}]`       |
| Runtimes     | `@parcel/runtime-{name}`     | `parcel-runtime-{name}`     | `@scope/parcel-runtime[-{name}]`     |
| Packagers    | `@parcel/packager-{name}`    | `parcel-packager-{name}`    | `@scope/parcel-packager[-{name}]`    |
| Optimizers   | `@parcel/optimizer-{name}`   | `parcel-optimizer-{name}`   | `@scope/parcel-optimizer[-{name}]`   |
| Reporters    | `@parcel/reporter-{name}`    | `parcel-reporter-{name}`    | `@scope/parcel-reporter[-{name}]`    |
| Validators   | `@parcel/validator-{name}`   | `parcel-validator-{name}`   | `@scope/parcel-validator[-{name}]`   |

</div>

The `{name}` must be descriptive and directly related to the purpose of the
package. Someone should be able to have an idea of what the package does simply
by reading the name in a `.parcelrc` or `package.json#devDependencies`.

```
parcel-transformer-posthtml
parcel-packager-wasm
parcel-reporter-graph-visualizer
```

If your plugin adds support for a specific tool, please use the name of the
tool.

```
parcel-transformer-es6 (bad)
parcel-transformer-babel (good)
```

If your plugin is a reimplementation of something that exists, try naming it
something that explains why it is a separate:

```
parcel-transformer-better-typescript (bad)
parcel-transformer-typescript-server (good)
```

We ask that community members work together and when forks happen to try and
resolve them. If someone made a better version of your plugin, please consider
giving the better package name over, have them make a major version bump, and
redirect people to the new tool.

See [Local plugins](/features/plugins/#local-plugins) for recommendations on using
plugins in your project without publishing them.

## Versioning

You must follow semantic versioning (to the best of your ability). No, it's not
the perfect system, but it's the best one we have and people do depend on it.

If plugin authors intentionally don't follow semantic versioning, Parcel may
start warning users that they should be locking down the version number for
your plugin.

## Engines

You must specify a `package.json#engines.parcel` field with the version range
of Parcel that your plugin supports:

```json
{
  "name": "parcel-transformer-imagemin",
  "engines": {
    "parcel": "2.x"
  }
}
```

If you do not specify this field, Parcel will output a warning:

```
Warning: The plugin "parcel-transformer-typescript" needs to specify a
`package.json#engines.parcel` field with the supported Parcel version range.
```

If you do specify the parcel engine field and the user is using an incompatible
version of Parcel, they will see an error:

```
Error: The plugin "parcel-transformer-typescript" is not compatible with the
current version of Parcel. Requires "2.x" but the current version is "3.1.4"
```

Parcel uses `node-semver` to match version ranges.
