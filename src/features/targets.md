---
layout: layout.njk
title: Targets
eleventyNavigation:
  key: features-targets
  title: 🎯 Targets
  order: 5
---

Parcel can compile your source code in multiple different ways simultaneously. These are called **targets**. For example, you could have a “modern” target that targets newer browsers and a “legacy” target for older browsers.

## Entries

“Entries” are the files that Parcel starts at when building your source code. They can be specified on the CLI, or using the `source` field in package.json.

### `$ parcel <entries>`

One or more entry files can be specified on the CLI to any Parcel command.

```shell
$ parcel src/a.html src/b.html
```

Entries may be specified as globs to match more than one file at a time. Be sure to wrap the glob in single quotes to ensure that the glob is not resolved by your shell and is passed to Parcel directly. This ensures that Parcel can automatically pick up newly created files matching the glob without needing to restart.

```shell
$ parcel './src/*.html'
```

Entries may also be directories, in which case a `package.json` file containing a `source` field must be present. See below for details.

### `package.json#source`

The `source` field in package.json can specify one or more entry files.

```json
{
  "source": "src/index.html"
}
```

```json
{
  "source": ["src/a.html", "src/b.html"]
}
```

### `package.json#targets.*.source`

The `source` field within any target declared in package.json can specify one or more entry files that are specific to that target. For example, you could build your frontend and backend simultaneously, or your desktop and mobile apps. See below for details about configuring targets.

```json
{
  "targets": {
    "frontend": {
      "source": "app/index.html"
    },
    "backend": {
      "source": "api/index.js"
    }
  }
}
```

## Targets

Parcel follows the dependencies in each resolved entry to build your source code for one or more targets. Targets specify the output directory or file path, as well as information about how your code should be compiled.

By default, Parcel includes a single implicit target which outputs into the `dist` folder. This can be overridden using the `--dist-dir` CLI option.

```shell
$ parcel build src/index.html --dist-dir output
```

The output directory can also be specified in package.json using the `targets` field. This will override the `--dist-dir` CLI option.

```json
{
  "targets": {
    "default": {
      "distDir": "./output"
    }
  }
}
```

### Environments

In addition to the output location, targets specify information about the “environment” your code will run in. They tell Parcel what type of environment to build for (e.g. a browser or Node.js), as well as what versions of each engine you support. This influences how Parcel compiles your code, including what syntax to transpile.

#### `package.json#browserslist`

For browser targets, the `browserslist` field in package.json can be used to specify which browsers you support. You can query by usage statistics or by version ranges of specific browsers. See the [browserslist docs](https://github.com/browserslist/browserslist#full-list) for more information.

```json
{
  "browserslist": "> 0.5%, last 2 versions, not dead"
}
```

#### `package.json#engines`

For Node.js and other targets, the `engines` field in package.json can be used to specify which versions you support. Engines are specified using a semver range.

```json
{
  "engines": {
    "node": ">= 12"
  }
}
```

### Implicit environments

When one file depends on another, the environment is inherited from its parent. But how you depend on the asset can change some properties of the environment. For example, when depending on a service worker, the environment is automatically changed into a service worker context so that the code is compiled appropriately.

```javascript
navigator.serviceWorker.register(new URL('service-worker.js', import.meta.url));
```

### Differential bundling

“Differential bundling” is the idea of shipping multiple versions of your code for different targets, and allowing the browser to choose the most optimal one to download. When you use a `<script type="module">` element in an HTML file, and some of the browsers specified by the environment do not support ES modules natively, Parcel will automatically generate a `<script nomodule>` fallback as well.

```html
<script type="module" src="app.js"></script>
```

is compiled to:

```html
<script type="module" src="app.c9a6fe.js"></script>
<script nomodule src="app.f7d631.js"></script>
```

This allows modern browsers that support ES modules to download a much smaller bundle, while legacy browsers are still supported using a fallback. This can significantly reduce bundle sizes and improve load times by avoiding transpilation of modern JavaScript syntax like classes, arrow functions, async/await, and more.

This happens automatically based on your browser targets, as declared in the `"browserslist"` field in your package.json. If no `browserslist` is declared, or all browser targets support ES modules natively, then a `nomodule` fallback will not be generated.

## Multiple targets

You may have multiple targets in order to build your source code for multiple different environments simultaneously. For example, you could have “modern” and “legacy” targets for an app, or ES module and CommonJS targets for a library ([see below](#library-targets)).

Targets are configured using the `targets` field in package.json. Each target has a name, specified as a key under the `target` field, and an associated configuration object. For example, the `engines` field within each target can be used to customize the environment it is compiled for.

```json
{
  "targets": {
    "modern": {
      "engines": {
        "browsers": "Chrome 80"
      }
    },
    "legacy": {
      "engines": {
        "browsers": "> 0.5%, last 2 versions, not dead"
      }
    }
  }
}
```

When multiple targets are specified, the outputs will be written to `dist/${targetName}` by default (e.g. `dist/modern` and `dist/legacy` in the above example). This can be customized using the `distDir` field in each target. Alternatively, if the target has only a single entry, an exact file name can be specified for the output using a top-level package.json field corresponding to the target name.

```json
{
  "modern": "dist/modern.js",
  "legacy": "dist/legacy.js",
  "targets": {
    "modern": {
      "engines": {
        "browsers": "Chrome 80"
      }
    },
    "legacy": {
      "engines": {
        "browsers": "> 0.5%, last 2 versions, not dead"
      }
    }
  }
}
```

## Library targets

Parcel includes some builtin targets for building libraries. These include the `main`, `module`, `browser`, and `types` fields.

```json
{
  "name": "my-library",
  "version": "1.0.0",
  "source": "src/index.js",
  "main": "dist/main.js",
  "module": "dist/module.js",
  "types": "dist/types.d.ts"
}
```

Library targets do not bundle dependencies from `node_modules` by default. In addition, minification is disabled by default for libraries. These can be overridden using the appropriate option in the `targets` field (see below). Scope hoisting cannot be disabled for library targets.

Library targets automatically output either native ES modules or CommonJS depending on the target.

- **`main`** – by default, outputs CommonJS. If the `.mjs` extension is used, or the `"type": "module"` field is specified, then an ES module is output instead.
- **`module`** – outputs an ES module.
- **`browser`** – a browser-specific override of the `main` field. Outputs CommonJS.

`main` and `module` are compiled for a Node environment by default if there is also a `browser` target available, or if `engines.node` is specified and no browser targets are specified. Otherwise, they are compiled for a browser environment by default. This can be overridden using the `context` option in the target config (see below).

To make Parcel ignore one of these fields, specify `false` in the `targets` field.

```json
{
  "main": "unrelated.js",
  "targets": {
    "main": false
  }
}
```

See [Building a library with Parcel](/getting-started/library/) for an intro to building libraries with Parcel.

## Target options

### `context`

```javascript
'node' | 'browser' | 'web-worker' | 'service-worker' | 'worklet' | 'electron-main' | 'electron-renderer'
```

The `context` property defines what type of environment to build for. This tells Parcel what environment-specific APIs are available, e.g. the DOM, Node filesystem APIs, etc.

For builtin library targets (e.g. `main` and `module`), the `context` is automatically inferred. See [Library targets](#library-targets) above for more details.

### `engines`

Overrides the engines defined in the top-level `package.json#engines` and `browserslist` fields for this target. The `engines.browsers` field within a target can be used just like `browserslist`. See [Environments](#environments) and [Multiple targets](#multiple-targets) above for more information.

### `outputFormat`

```javascript
'global' | 'esmodule' | 'commonjs'
```

Defines what type of module to output.

- `global` – a classic script that could be loaded in a `<script>` tag in the browser. Not supported for library targets.
- `esmodule` – an ES module using `import` and `export` statements. Could be loaded in a `<script type="module">` tag in the browser, or loaded by Node.js or another bundler.
- `commonjs` – a CommonJS module using `require` and `module.exports`. Could be loaded by Node.js or another bundler.

For builtin library targets (e.g. `main` and `module`), the `outputFormat` is automatically inferred. The file extension defined in the target's top-level package.json field may also influence the output format. See [Library targets](#library-targets) above for more details.

### `scopeHoist`

Enables or disables scope hoisting. By default, scope hoisting is enabled for production builds. The `--no-scope-hoist` CLI flag can be used to disable scope hoisting when running `parcel build`. Scope hoisting may also be disabled by setting the `scopeHoist` option in the target config.

### `isLibrary`

When set to `true`, the target is treated as a library that would be published to npm and consumed by another tool rather than used directly in a browser or other target environment. When `true`, the `outputFormat` option must be either `esmodule` or `commonjs` and `scopeHoist` must not be set to `false`.

For builtin library targets (e.g. `main` and `module`), this is automatically set to `true`. See [Library targets](#library-targets) above for more details.

### `optimize`

Enables or disables optimization (e.g. minification). Exact behavior is determined by plugins. By default, optimization is enabled during production builds (`parcel build`), except for library targets. This can be overridden using the `--no-optimize` CLI flag or the `optimize` option in the target config.

### `includeNodeModules`

Determines whether to bundle `node_modules` or treat them as external. The default is `true` for browser targets, and `false` for library targets. Possible values are:

- **`false`** – does not include any files in `node_modules`.
- **an array** – a list of packages names to include. In the following example, *only* `react` is bundled. All other files in `node_modules` are excluded.

  ```json
  {
    "targets": {
      "main": {
        "includeNodeModules": ["react"]
      }
    }
  }
  ```

- **an object** – a mapping of package names to booleans. If a package is not listed, it is included. In the following example, all `node_modules` *except* react are bundled.

  ```json
  {
    "targets": {
      "main": {
        "includeNodeModules": {
          "react": false
        }
      }
    }
  }
  ```

### `sourceMap`

Enables or disables source maps, and sets source map options. By default, source maps are enabled. This can be overridden using the `--no-source-maps` CLI flag, or by setting the `sourceMap` option in the target config to `false`.

The `sourceMap` option also accepts an object with the following options.

- `inline` – Whether to inline the source map as a data URL into the bundle rather than link to it as a separate output file.
- `inlineSources` – Whether to inline the original source code into the source map rather than load them from the `sourceRoot`. This is set to `true` by default when building browser targets for production.
- `sourceRoot` – The URL at which to load the original source code. This is set automatically in development when using the builtin Parcel dev server. Otherwise, it defaults to a relative path to the bundle from the project root.

### `source`

Overrides the top-level `source` field in package.json for a target. This allows for each target to have different entries. See [package.json#targets.*.source](#package.json%23targets.*.source) for more details.

### `distDir`

Sets the location where compiled bundles in this target will be written. By default, this is `dist` if only a single target is given, or `dist/${targetName}` for multiple targets. See [Targets](#targets) for more details.

### `publicUrl`

Sets the base URL at which this bundle will be loaded at runtime. The bundle's relative path from the `distDir` will be automatically appended. `publicUrl` can be either a fully qualified URL (e.g. `https://some-cdn.com/` or an absolute path (e.g. `/public`) if bundles are loaded from the same domain as your website.

By default the `publicUrl` is `/`. This is a good default if your HTML files and other assets are deployed to the same location. If you deploy assets to a different location, you'll likely need to set `publicUrl`. The public URL can also be set using the `--public-url` CLI option.

In most cases, bundles are loaded using a relative path from the parent bundle to the child bundle. This allows the deployment to be moved to a new location without re-building (e.g. promoting a staging build to production). The `publicUrl` is used when relative paths are not possible (e.g. in HTML).

