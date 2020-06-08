---
layout: layout.njk
eleventyNavigation:
  key: Authoring Plugins
  order: 2
summary: "What to take in mind when authoring a plugin"
---

## Plugin APIs

There are several different types of plugins. They all look very similar, but
are kept separate so we can have strict contracts one what each one is allowed
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

They are made up of modules with well-known named exports of async functions
that:

- Accept a strictly validated JSON-serializable `opts` object.
- Return a strictly validated JSON-serializable `vals` object.

If something you need is not being passed through `opts`, please come talk to
the Parcel team about it. Avoid trying to get information yourself from other
sources, especially from the file system.

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
  "name": "parcel-transform-imagemin",
  "engines": {
    "parcel": "2.x"
  }
}
```

If you do not specify this field, Parcel will output a warning:

```
Warning: The plugin "parcel-transform-typescript" needs to specify a
`package.json#engines.parcel` field with the supported Parcel version range.
```

If you do specify the parcel engine field and the user is using an incompatible
version of Parcel, they will see an error:

```
Error: The plugin "parcel-transform-typescript" is not compatible with the
current version of Parcel. Requires "2.x" but the current version is "3.1.4"
```

Parcel uses `node-semver` to match version ranges.
