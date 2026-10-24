---
layout: layout.njk
title: Targets
eleventyNavigation:
  key: features-targets
  title: 🎯 Targets
  order: 5
---

Parcel can compile your source code in multiple different ways simultaneously. These are called **targets**. For example, you could build a library for both Node.js and browsers, or as both an ES module and CommonJS.

## Entries

“Entries” are the files that Parcel starts at when building your source code. They can be specified on the CLI, or using the `source` field in package.json.

### `$ parcel <command> <entries>`

One or more entry files can be specified on the CLI to any Parcel command.

```shell
$ parcel serve src/a.html src/b.html
```

Entries may be specified as globs to match more than one file at a time. Be sure to wrap the glob in single quotes to ensure that the glob is not resolved by your shell and is passed to Parcel directly. This ensures that Parcel can automatically pick up newly created files matching the glob without needing to restart.

```shell
$ parcel serve './src/*.html'
```

Entries may also be directories, in which case a `package.json` file containing an `exports` or `source` field must be present. If no entries are specified, the current working directory is used. See below for details.

### `package.json#source`

The `source` field in package.json can specify an entry file or glob.

```json
{
  "source": "src/index.html"
}
```

<!-- TODO(v3): Only a string `source` is read (arrays are ignored, see resolve_package_entries in crates/core/src/entry.rs). When `source` is used without `main`/`module`/`browser`/`exports`, the target's dist dir is the package directory itself (bundles are written next to package.json, `--dist-dir` is ignored) and `browserslist`/`engines` are not applied. Looks like a gap; webapp.md no longer recommends this setup. -->

The `source` field within `exports` can also be used to specify entries for library targets. See [Library targets](#library-targets) below for details.

## Targets

Parcel follows the dependencies in each resolved entry to build your source code for one or more targets. Targets specify the output directory or file path, as well as information about how your code should be compiled.

By default, Parcel includes a single implicit target which outputs into the `dist` folder. This can be overridden using the `--dist-dir` CLI option.

```shell
$ parcel build src/index.html --dist-dir output
```

The `--public-url` CLI option sets the base URL at which bundles will be loaded at runtime. The bundle's relative path from the dist directory will be automatically appended. The public URL can be either a fully qualified URL (e.g. `https://some-cdn.com/`), an absolute path (e.g. `/public`) if bundles are loaded from the same domain as your website, or a relative path (e.g. `./`).

```shell
$ parcel build src/index.html --public-url https://some-cdn.com/
```

By default the public URL is `/`. This is a good default if your HTML files and other assets are deployed to the same location. If you deploy assets to a different location, you'll likely need to set `--public-url`.

In most cases, bundles are loaded using a relative path from the parent bundle to the child bundle. This allows the deployment to be moved to a new location without re-building (e.g. promoting a staging build to production). The public URL is used when relative paths are not possible (e.g. in HTML).

The `parcel targets` command prints the entries and targets that Parcel resolves from the CLI and your package.json, which can be useful to check how your project is configured.

```shell
$ parcel targets
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
navigator.serviceWorker.register(new URL("service-worker.js", import.meta.url));
```

<!-- TODO(v3): Removed the "Differential bundling" section. v3 never generates a `<script nomodule>` fallback: in crates/html/src/dependencies.rs a `<script type="module">` keeps ESM output only if `target.should_scope_hoist()` (SHOULD_SCOPE_HOIST is never set anywhere) or all browsers support ESM, so the nomodule branch is dead code. When browserslist includes non-ESM browsers the script is instead rewritten to a classic `<script defer>` (verified with the release binary and `safari 9`). Restore the section if differential bundling is meant to work. Inbound links to #differential-bundling exist in other pages. -->

## Multiple targets

You may have multiple targets in order to build your source code for multiple different environments simultaneously. For example, you could have ES module and CommonJS targets for a library ([see below](#library-targets)).

Targets are configured using the `targets` field in package.json. Each target has a name, specified as a key under the `targets` field, and an associated configuration object. For example, the `context` field within a target can be used to customize the environment it is compiled for.

```json
{
  "targets": {
    "default": {
      "context": "react-server"
    }
  }
}
```

For [library targets](#library-targets), the keys in the `targets` field correspond to the conditions in the `exports` field, and each target can be configured independently.

<!-- TODO(v3): For CLI/file entries every key in `targets` creates a target, but only `context`, `outputFormat` and `includeNodeModules` are read; per-target `engines`, `distDir` and `source` are ignored (see "TODO: support target.distDir?" / "TODO: support --target CLI option" in crates/core/src/entry.rs), so multiple app targets (e.g. modern/legacy) all write to the same dist dir or get deduplicated. Top-level package.json fields named after a target (e.g. `"modern": "dist/modern.js"`) are not supported. Removed the modern/legacy examples; restore if multiple app targets are meant to work. -->

## Library targets

Libraries are built using the `exports` field in package.json. Add a `source` field within `exports` pointing at your library's source code, and Parcel will build it for each of the output files listed in `exports`.

```json
{
  "name": "my-library",
  "version": "1.0.0",
  "type": "module",
  "exports": {
    "source": "./src/index.js",
    "import": "./dist/index.js",
    "require": "./dist/index.cjs"
  }
}
```

Each output file in `exports` becomes a separate target. The environment for each target is inferred from the [conditions](https://nodejs.org/api/packages.html#conditional-exports) it is nested in. For example, outputs within a `node` condition are compiled for Node.js, and outputs within a `browser` condition are compiled for browsers. The `worker`, `worklet`, `electron`, and `react-server` conditions are also supported. If no environment condition is present, outputs are compiled for Node.js if `engines.node` is specified in package.json, and for browsers otherwise. This can be overridden using the `context` option in the target config (see below).

```json
{
  "exports": {
    "source": "./src/index.js",
    "node": "./dist/node.cjs",
    "browser": "./dist/browser.mjs"
  }
}
```

Library targets automatically output either native ES modules or CommonJS depending on the file extension of each output file.

- **`.mjs`** – outputs an ES module.
- **`.cjs`** – outputs CommonJS.
- **`.js`** – outputs CommonJS by default. If the `"type": "module"` field is specified in package.json, then an ES module is output instead.

<!-- TODO(v3): The `import`/`module` conditions inside `exports` do not imply ES module output; e.g. `"import": "./dist/index.js"` without `"type": "module"` produces CommonJS (ExportsContext::to_env in crates/core/src/entry.rs, verified with the release binary). Only the legacy top-level `module` field forces ESM. Possibly a bug. -->

Packages with multiple entry points can specify a `source` for each subpath export. Subpath patterns containing `*` are also supported, in which case a target is created for each matching source file.

```json
{
  "exports": {
    ".": {
      "source": "./src/index.js",
      "default": "./dist/index.mjs"
    },
    "./utils/*": {
      "source": "./src/utils/*.js",
      "default": "./dist/utils/*.mjs"
    }
  }
}
```

The `source` field may also be used together with the `main`, `module`, and `browser` fields in package.json. In this case, the `module` field always outputs an ES module.

Rather than combining all of your code into a single file, library targets output a separate file for each module, preserving the structure of your source code. This lets tools that consume your library tree shake unused modules. Library targets do not bundle packages listed in `dependencies` or `peerDependencies`. Packages listed in `devDependencies` are bundled into your library. This can be overridden using the [`includeNodeModules`](#includenodemodules) option in the `targets` field. In addition, minification is disabled for libraries.

<!-- TODO(v3): Minification for library targets is only enabled when the exports path is nested under a `production` condition AND optimization is on (`// ??` comment in ExportsContext::to_env, crates/core/src/entry.rs); in a quick test with the release binary even that output was not minified. There is no per-target `optimize` option. -->

To make Parcel ignore one of the conditions in `exports`, e.g. one that points to files generated by another tool, specify `false` in the `targets` field.

```json
{
  "exports": {
    "source": "./src/index.ts",
    "types": "./dist/index.d.ts",
    "default": "./dist/index.js"
  },
  "targets": {
    "types": false
  }
}
```

<!-- TODO(v3): Without `"targets": {"types": false}`, a `types` condition (or top-level `types` field) is built like any other target, so compiled JavaScript is written to the `.d.ts` file (verified with the release binary). Should probably be skipped until .d.ts generation exists. -->

See [Building a library with Parcel](/getting-started/library/) for an intro to building libraries with Parcel.

## Target options

### `context`

```javascript
"node" |
  "browser" |
  "web-worker" |
  "service-worker" |
  "worklet" |
  "electron-main" |
  "electron-renderer" |
  "react-client" |
  "react-server";
```

The `context` property defines what type of environment to build for. This tells Parcel what environment-specific APIs are available, e.g. the DOM, Node filesystem APIs, etc. The `react-server` and `react-client` contexts are used to build apps with [React Server Components](/recipes/rsc/).

By default, JavaScript entries are compiled for a Node environment if `engines.node` is specified in package.json, or for Electron's main process if `engines.electron` is specified. Otherwise, they are compiled for a browser environment.

For library targets, the `context` is automatically inferred from the conditions in `exports`. See [Library targets](#library-targets) above for more details.

### `engines`

Overrides the engines defined in the top-level `package.json#engines` and `browserslist` fields for this target. The `engines.browsers` field within a target can be used just like `browserslist`. See [Environments](#environments) above for more information.

```json
{
  "exports": {
    "source": "./src/index.js",
    "node": "./dist/node.cjs",
    "default": "./dist/index.mjs"
  },
  "targets": {
    "node": {
      "engines": {
        "node": ">= 18"
      }
    }
  }
}
```

<!-- TODO(v3): Per-target `engines` is only read for library targets (exports/main/module/browser). For CLI entries, package_engines() is passed the top-level `engines` only (crates/core/src/entry.rs), so `targets.<name>.engines` is ignored. -->

### `outputFormat`

```javascript
"global" | "esmodule" | "commonjs";
```

Defines what type of module to output.

- `global` – a classic script that could be loaded in a `<script>` tag in the browser. Not supported for library targets.
- `esmodule` – an ES module using `import` and `export` statements. Could be loaded in a `<script type="module">` tag in the browser, or loaded by Node.js or another bundler.
- `commonjs` – a CommonJS module using `require` and `module.exports`. Could be loaded by Node.js or another bundler.

By default, entries with the `.mjs` extension output an ES module, and entries with the `.cjs` extension output CommonJS. JavaScript entries compiled for Node output CommonJS, or an ES module if the `"type": "module"` field is specified in package.json.

For library targets, the `outputFormat` is automatically inferred from the file extension of each output file in `exports`. See [Library targets](#library-targets) above for more details.

### `includeNodeModules`

Determines whether to bundle `node_modules` or treat them as external. The default is `true`, except for library targets, where only packages listed in `devDependencies` are bundled. Possible values are:

- **`false`** – does not include any files in `node_modules`.
- **an array** – a list of packages names to include. In the following example, _only_ `react` is bundled. All other files in `node_modules` are excluded.

  ```json
  {
    "targets": {
      "default": {
        "includeNodeModules": ["react"]
      }
    }
  }
  ```

- **an object** – a mapping of package names to booleans. If a package is not listed, it is included. In the following example, all `node_modules` _except_ react are bundled.

  ```json
  {
    "targets": {
      "default": {
        "includeNodeModules": {
          "react": false
        }
      }
    }
  }
  ```
