---
layout: layout.njk
eleventyNavigation:
  title: ❓ package.json
  order: 1
summary: The targets object in package.json
---

### Fields

These are the fields that Parcel uses for its configuration:

#### `main` / `module` / `browser`

These are common fields used by other tools as well,

{% sample %}
{% samplefile "package.json" %}

```json
{
  "main": "dist/main/index.js",
  "module": "dist/module/index.js",
  "browser": "dist/browser/index.js"
}
```

{% endsamplefile %}
{% endsample %}

They default to library mode (meaning they don't bundle dependencies): (see also [`targets`](#targets))

- `main` (and `module`) are the standard entry points to your library, `module` defaults to ESM module output.
- `browser` is intended for a browser-specific build (e.g. without some native features).

If one these fields is specified, Parcel will create a target for that field (no property in [`targets`](#targets) is needed)

To make Parcel ignore one of these fields, specify `false` in `target.(main|browser|module)`:

{% sample %}
{% samplefile "package.json" %}

```json
{
  "main": "unrelated.js",
  "targets": {
    "main": false
  }
}
```

{% endsamplefile %}
{% endsample %}

If the `browser` field is an [object](/features/module-resolution/#package.json-browser-field), `package.json#browser[pkgName]` can be used instead of `package.json#browser`.

#### custom targets

To create your own target (without any of the semantics of the [common target](#main-%2F-module-%2F-browser) described previously), add a top-level field with your target's name and output path. You also need to add it to [`targets`](#targets) to make Parcel recognize that field.

{% sample %}
{% samplefile "package.json" %}

```json
{
  "app": "www/index.js",
  "targets": {
    "app": {}
  }
}
```

{% endsamplefile %}
{% endsample %}

#### `source`

Specify the entry points for your source code which gets mapped to your targets, can be a string or an array.

{% sample %}
{% samplefile "package.json" %}

```json
{
  "source": "src/index.js"
}
```

{% endsamplefile %}

{% samplefile "package.json" %}

```json
{
  "source": ["src/index.js", "src/index.html"]
}
```

{% endsamplefile %}
{% endsample %}

See [Specifying Entrypoints](#specifying-entrypoints).

#### `targets`

Targets are configured via the `package.json#targets` field.

```json
{
  "app": "dist/browser/index.js",
  "appModern": "dist/browserModern/index.js",
  "targets": {
    "app": {
      "engines": {
        "browsers": "> 0.25%"
      }
    },
    "appModern": {
      "engines": {
        "browsers": "Chrome 70"
      }
    }
  }
}
```

Each target has a name which corresponds to a top-level `package.json` field
such as `package.json#main` or `package.json#app` which specify the primary
entry point for that target.

Each of those targets contains the target's environment configuration (all of these properties are optional):

<div style="font-size: 0.9em">

| Option               | Possible values                                     | Description                                                                                                                                                                 |
| -------------------- | --------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `context`            | [see below](#context)                               | In which runtime the bundles should run.                                                                                                                                    |
| `distDir`            | `string`                                            | Specify output folder (as opposed to output file)                                                                                                                           |
| `engines`            | [`package.json#engines`](#engines-%2F-browserslist) | Higher priority than `package.json#engines`                                                                                                                                 |
| `includeNodeModules` | [see below](#includenodemodules)                    | Whether to bundle all/none/some `node_module` dependencies                                                                                                                  |
| `isLibrary`          | `boolean`                                           | Library as in "npm library"                                                                                                                                                 |
| `minify`             | `boolean`                                           | Whether to enable minification (exact behaviour is determined by plugins). <br> Set by [`--no-minify`](/features/cli/#parameters-specific-to-build)                         |
| `outputFormat`       | `'global' | 'esmodule' | 'commonjs'`                | Which type of imports/exports should be emitted                                                                                                                             |
| `publicUrl`          | `string`                                            | The public url of the bundle at runtime                                                                                                                                     |
| `scopeHoist`         | `boolean`                                           | Whether to enable scope hoisting <br> Needs to be `true` for ESM and CommonJS `outputFormat`. <br> Set by [`--no-scope-hoist`](/features/cli/#parameters-specific-to-build) |
| `sourceMap`          | [see below](#sourcemap)                             | Enable/disable sourcemap and set options. <br> Overwritten by [`--no-source-maps`](/features/cli/#general-parameters)                                                       |

</div>

However, a lot of the normal configuration for building a library is already provided by default for you:

```cs
targets = {
  main: {
    engines: {
      node: value("package.json#engines.node"),
      browsers: unless exists("package.json#browser") then value("package.json#browserlist")
    },
    isLibrary: true
  },
  module: {
    engines: {
      node: value("package.json#engines.node"),
      browsers: unless exists("package.json#browser") then value("package.json#browserlist")
    },
    isLibrary: true
  },
  browser: {
      engines: {
      browsers: value("package.json#browserslist")
    },
    isLibrary: true
  },
  ...value("package.json#targets"),
}
```

##### `context`

Possible values are `'node' | 'browser' | 'web-worker' | 'service-worker' | 'electron-main' | 'electron-renderer'`.

These values can be used by plugins (e.g. a service worker url should not contain a hash, a webworker can use `importScripts`).

For the [common targets](#main-%2F-module-%2F-browser), these are inferred from the target:

- The `main` target has the context `node` if there is `browser` target or `engines.node != null && engines.browsers == null`, and `browser` otherwise.
- The `module` target has the context `node` if there is `browser` target and `browser` otherwise.
- The `browser` target has context `browser`.

##### `includeNodeModules`

This fields defaults to `false` when `isLibrary` is true. Possible values are:

- `false`: to include none `node_modules` package
- an `array`: a list of packages names or wildcards to _include_
- an `object`: `includeNodeModules[pkgName] ?? true` determines if it is included. (e.g. `{ "lodash": false }`)

##### `sourceMap`

Can be a boolean (to simply enable / disable source maps) or an option (which is somewhat equivlant to `true`):

| Option        | Default value                       | Description                                                                                                     |
| ------------- | ----------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| inline        | `false`                             | Include the sourcemap as a data-url in the bundle (in the `sourceMappingURL`)                                   |
| inlineSources | `false`                             | Should the sourcemap contain the sources contents (otherwise, they will be loaded from `${sourceRoot}/$(name)`) |
| sourceRoot    | `path.relative(bundle, pojectRoot)` | Essentially the public url for the sources                                                                      |

The [--no-source-maps](/features/cli/#general-parameters) CLI parameter sets the default value to `false` (as opposed to `true`).

#### `engines` / `browserslist`

These top-level fields set the default value for `target.*.engines.browsers` and `target.*.engines`, respectively.

Specifies the [environment](#environments).
{% sample %}
{% samplefile "package.json" %}

```json
{
  "browserslist": ["> 0.2%", "not dead"]
}
```

{% endsamplefile %}
{% samplefile "package.json" %}

```json
{
  "engines": {
    "node": ">=4.x",
    "electron": ">=2.x",
    "browsers": "> 0.25%"
  }
}
```

{% endsamplefile %}
{% endsample %}

#### `alias`

See [Module Resolution](/features/module-resolution/#aliases)

### Which `package.json` is used when specifying multiple entries (packages)

All paths are relative to `/some/dir/my-monorepo`.

| cwd                  |  entries                      |  used `pkg.json#*` (fields described below)  |
| -------------------- | ----------------------------- | -------------------------------------------- |
| `..`                 | `packages/*/src/**/*.js`      | `package.json`                               |
| `.`                  | `packages/*/src/**/*.js`      | `package.json`                               |
| `packages/`          | `packages/*/src/**/*.js`      | `package.json`                               |
| `packages/pkg-a`     | `packages/pkg-a/src/index.js` | `packages/pkg-a/package.json`                |
| `packages/pkg-a/src` | `packages/pkg-a/src/index.js` | `packages/pkg-a/package.json`                |
