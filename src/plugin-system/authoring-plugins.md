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
  Otherwise Parcel's incremental rebuilds will break and your users will be sad.

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

Methods may also return their result directly rather than a promise.

If something you need is not being passed through `opts`, please come talk to
the Parcel team about it. Avoid trying to get information yourself from other
sources, especially from the file system.

Plugins can also be written in Rust, Go, Swift, or any other language that can produce a shared library with a C ABI. See [Native plugins](/plugin-system/native-plugins/) for details.

## JavaScript runtime

JavaScript plugins do not run in Node.js. Parcel includes an embedded JavaScript engine ([QuickJS](https://bellard.org/quickjs/)), and runs plugins inside it on each of its worker threads. This means you don't need Node installed to use JavaScript plugins, but there are some differences to be aware of.

Parcel emulates the subset of Node's built-in modules that plugins and the compilers they wrap commonly need: `assert`, `buffer`, `console`, `constants`, `crypto`, `events`, `fs`, `fs/promises`, `module`, `os`, `path`, `process`, `punycode`, `querystring`, `stream`, `string_decoder`, `tty`, `url`, `util`, `vm`, and `zlib`. Each may also be imported with the `node:` prefix. Globals such as `process`, `Buffer`, `URL`, `URLSearchParams`, `TextEncoder`, `TextDecoder`, `atob`, `btoa`, `structuredClone`, and `crypto` are available as well.

Some things are not supported:

- The `fs` module is read-only: it supports reading files, `stat`, `readdir`, `realpath`, `readlink`, and `glob`, but not writing files.
- There is no network access, no child processes or worker threads, and no timers such as `setTimeout`.
- Native Node addons (`.node` files) cannot be loaded.

npm dependencies of your plugin are loaded from `node_modules` as usual, as long as they only use the supported APIs.

<!-- TODO(v3): the list of builtins/limitations was taken from crates/plugin-js/src/cjs.rs (BUILTIN_MODULES), fs.rs (FS_EXPORTS) and lib.rs (globals). Confirm which limitations are permanent vs. not implemented yet (e.g. timers, fs writes for reporters). -->

## Module formats

Parcel supports plugins written as either CommonJS or ES modules. The module format of a plugin is determined from either the file extension of the resolved module, or from its `package.json`. Use the `.mjs` extension for ES module plugins, and either `.cjs` or `.js` for CommonJS. If `"type": "module"` is declared in the plugin's `package.json`, the `.js` extension is treated as ESM instead of CommonJS. This behavior matches how Node.js loads modules.

Plugins can also be written in TypeScript. Files with a `.ts` or `.tsx` extension are loaded directly, with their types stripped, so a local plugin does not need to be compiled first. The `@parcel/plugin` package includes TypeScript types for all of the plugin APIs.

<!-- TODO(v3): published plugins in packages-v3 are compiled from src/*.ts to lib/*.js. Decide whether to recommend shipping compiled JS (faster startup, no transpile per thread) over shipping .ts. -->

## Configuration

Plugins can accept configuration from the user's project. This is specified in the `.parcelrc` file, by using an object with `plugin` and `config` properties in place of the plugin name:

{% sample %}
{% samplefile ".parcelrc" %}

```json
{
  "extends": "@parcel/config-default",
  "transformers": {
    "*.svg": [
      {
        "plugin": "parcel-transformer-foo",
        "config": {
          "bar": true
        }
      }
    ]
  }
}
```

{% endsamplefile %}
{% endsample %}

The config is passed to every plugin method as the `config` option. It is `undefined` if no config was provided.

```javascript
import { Transformer } from "@parcel/plugin";

export default new Transformer({
  async transform({ asset, config }) {
    if (config?.bar) {
      // ...
    }
  },
});
```

Because the same plugin may appear multiple times in a `.parcelrc` with different configuration, avoid storing config in module-level state.

### Invalidation

Some plugins wrap a compiler or tool which has its own config loading mechanism built in (e.g. Babel's `babel.config.json`), or read other files from the file system. Parcel automatically tracks all of the files that JavaScript plugins read with the `fs` module, along with the source files of the plugins themselves and all of their dependencies. When one of these files changes, Parcel rebuilds the whole project, since the plugin's results may depend on it.

When a transformer needs to resolve a dependency itself (e.g. to inline an imported file), use the `resolve` function passed to `transform`. This resolves a specifier using the resolvers configured in `.parcelrc`, exactly as a dependency of the asset would be, and only invalidates the asset being transformed when the result would change.

```javascript
import { Transformer } from "@parcel/plugin";
import fs from "fs";

export default new Transformer({
  async transform({ asset, resolve }) {
    let filePath = await resolve(asset.filePath, "./included.txt");
    let contents = fs.readFileSync(filePath, "utf8");
    // ...
  },
});
```

<!-- TODO(v3): v2's loadConfig/Config API (getConfig, invalidateOnFileChange, invalidateOnFileCreate, addDevDependency, invalidateOnStartup) has no v3 equivalent; plugin fs reads are tracked automatically and trigger a full rebuild (ParcelOptions::plugin_tracker, crates/core/src/lib.rs invalidate()). Confirm this is the intended long-term model. -->

## Naming

All plugins must follow a naming system:

<div style="font-size: 0.9em">

|              | Official package             | Community packages          | Private company/scoped team packages |
| ------------ | ---------------------------- | --------------------------- | ------------------------------------ |
| Configs      | `@parcel/config-{name}`      | `parcel-config-{name}`      | `@scope/parcel-config[-{name}]`      |
| Resolvers    | `@parcel/resolver-{name}`    | `parcel-resolver-{name}`    | `@scope/parcel-resolver[-{name}]`    |
| Transformers | `@parcel/transformer-{name}` | `parcel-transformer-{name}` | `@scope/parcel-transformer[-{name}]` |
| Namers       | `@parcel/namer-{name}`       | `parcel-namer-{name}`       | `@scope/parcel-namer[-{name}]`       |
| Optimizers   | `@parcel/optimizer-{name}`   | `parcel-optimizer-{name}`   | `@scope/parcel-optimizer[-{name}]`   |
| Reporters    | `@parcel/reporter-{name}`    | `parcel-reporter-{name}`    | `@scope/parcel-reporter[-{name}]`    |

</div>

The `{name}` must be descriptive and directly related to the purpose of the
package. Someone should be able to have an idea of what the package does simply
by reading the name in a `.parcelrc` or `package.json#devDependencies`.

```
parcel-transformer-posthtml
parcel-optimizer-svgo
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
    "parcel": "^3.0.0-0"
  }
}
```

<!-- TODO(v3): v3 does not read engines.parcel at all (no warning when missing, no error when incompatible; verified by loading a plugin with "engines": {"parcel": "2.x"}). The v2 warning/error text was removed. Decide whether v3 should validate it. Native plugins are instead checked via package.json "parcel.abi". -->
