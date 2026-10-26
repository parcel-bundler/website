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

The `source` field in package.json can specify one or more entry files or globs.

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

The `source` field within `exports` can also be used to specify entries for library targets. See [Library targets](#library-targets) below for details.

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

## Multiple targets

You may have multiple targets in order to build your source code for multiple different environments simultaneously. For example, you could have “modern” and “legacy” targets for an app, or ES module and CommonJS targets for a library ([see below](#library-targets)).

Targets are configured using the `targets` field in package.json. Each target has a name, specified as a key under the `targets` field, and an associated configuration object. For example, the `engines` field within each target can be used to customize the environment it is compiled for.

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

When multiple targets are specified, the outputs will be written to `dist/${targetName}` by default (e.g. `dist/modern` and `dist/legacy` in the above example). This can be customized using the [`distDir`](#distdir) field in each target.

```json
{
  "targets": {
    "modern": {
      "engines": {
        "browsers": "Chrome 80"
      },
      "distDir": "./build/modern"
    },
    "legacy": {
      "engines": {
        "browsers": "> 0.5%, last 2 versions, not dead"
      },
      "distDir": "./build/legacy"
    }
  }
}
```

For [library targets](#library-targets), the keys in the `targets` field correspond to the conditions in the `exports` field, and each target can be configured independently.

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

Rather than combining all of your code into a single file, library targets output a separate file for each module, preserving the structure of your source code. This lets tools that consume your library tree shake unused modules.

Library targets do not bundle packages listed in `dependencies` or `peerDependencies`. Packages listed in `devDependencies` are bundled into your library. This can be overridden using the [`includeNodeModules`](#includenodemodules) option in the `targets` field.

In addition, library outputs are not minified by default, except for outputs nested in a `production` condition. This can be overridden using the [`optimize`](#optimize) option.

### Exports conditions

Each output file in `exports` becomes a separate target. The environment for each target is inferred from the [conditions](https://nodejs.org/api/packages.html#conditional-exports) it is nested in. For example, outputs within a `node` condition are compiled for Node.js, and outputs within a `browser` condition are compiled for browsers. The `worker`, `worklet`, `electron`, and `react-server` conditions are also supported. If no environment condition is present, outputs are compiled for Node.js if `engines.node` is specified in package.json, and for browsers otherwise. This can be overridden using the `context` option in the target config ([see below](#target-options)).

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

The `import` condition in `exports` does not change the output format. Just like in Node.js, it only means that the file is loaded via `import`, which can also import CommonJS. Use the `.mjs` extension or `"type": "module"` to output an ES module.

### Nested conditions

Conditions can also be nested. Each output is built for all of the conditions it is nested within. In the example below, `./dist/node.mjs` is compiled for Node.js and output as an ES module, and `./dist/browser.min.mjs` is compiled for browsers and minified because it is nested in the `production` condition.

The `source` field applies to all of the outputs nested alongside it. Place it at the top level of `exports` to share a single source file between all conditions, or within a condition to use a different source file for the outputs inside it. A nested `source` overrides one further out. Here, the `node` outputs are built from `src/index.js`, and the `browser` outputs are built from `src/browser.js`.

```json
{
  "exports": {
    "source": "./src/index.js",
    "node": {
      "import": "./dist/node.mjs",
      "require": "./dist/node.cjs"
    },
    "browser": {
      "source": "./src/browser.js",
      "production": "./dist/browser.min.mjs",
      "default": "./dist/browser.mjs"
    }
  }
}
```

Options in the `targets` field are merged the same way. The options for a condition apply to every output nested within it, and the options for a more deeply nested condition override those of the conditions around it. In this example, both browser outputs are compiled for the browsers listed in the `browser` condition, and only the `production` output bundles its dependencies.

```json
{
  "targets": {
    "browser": {
      "engines": {
        "browsers": "> 0.5%, last 2 versions, not dead"
      }
    },
    "production": {
      "includeNodeModules": true
    }
  }
}
```

### Sub-path exports

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

### Legacy modules

The `source` field may also be used together with the `main`, `module`, and `browser` fields at the top-level of your package.json. In this case, `source` must be a single file, and the `module` field always outputs an ES module.

```json
{
  "source": "./src/index.js",
  "main": "./dist/main.js",
  "module": "./dist/module.js"
}
```

### Ignoring targets

To make Parcel ignore one of the conditions in `exports`, e.g. one that points to files generated by another tool, specify `false` in the `targets` field.

```json
{
  "exports": {
    "source": "./src/index.js",
    "import": "./dist/index.mjs",
    "require": "./dist/index.cjs"
  },
  "targets": {
    "require": false
  }
}
```

The `types` condition and the top-level `types` field are always ignored, since they point to type declarations generated by another tool (e.g. `tsc`).

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

By default, JavaScript entries are compiled for a Node environment if `engines.node` is specified in package.json or in the target's [`engines`](#engines), or for Electron's main process if `engines.electron` is specified. Otherwise, they are compiled for a browser environment.

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

### `optimize`

Enables or disables optimization (e.g. minification). By default, optimization is enabled during production builds (`parcel build`), except for library targets, where only outputs nested in a `production` condition in `exports` are optimized. Set `optimize` to `false` to disable optimization for a target, or to `true` to enable it for a library target. The `optimize` option cannot enable optimization for a build that isn't otherwise optimized, e.g. in development or when using the `--no-optimize` CLI flag.

```json
{
  "exports": {
    "source": "./src/index.js",
    "import": "./dist/index.mjs",
    "require": "./dist/index.cjs"
  },
  "targets": {
    "import": {
      "optimize": true
    }
  }
}
```

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

### `distDir`

Sets the location where compiled bundles in this target will be written, relative to package.json. By default, this is `dist` if only a single target is given, or `dist/${targetName}` for multiple targets. When specified, `distDir` overrides the `--dist-dir` CLI option. See [Targets](#targets) and [Multiple targets](#multiple-targets) for more details.

For library targets, the output location is determined by the file paths in `exports` instead.
