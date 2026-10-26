---
layout: layout.njk
title: Migration from Parcel 2
eleventyNavigation:
  key: migration-parcel-2
  title: 📦 Parcel 2
  order: 0
---

Parcel 3 is a ground up rewrite of Parcel in Rust. For the most part, it works quite similarly to Parcel 2, and most apps will only need a few small changes. However, some features have changed or been removed, and plugins written for Parcel 2 will need to be updated. This page covers the things you'll need to change when upgrading.

## Getting started

Let's walk through a couple basic steps to upgrade from Parcel 2 to Parcel 3.

### Package name

Update the `parcel` dependency in your `package.json` to the latest version.

{% migration %}
{% samplefile "package.json" %}

```json/2
{
  "devDependencies": {
    "parcel": "^2.0.0"
  }
}
```

{% endsamplefile %}
{% samplefile "package.json" %}

```json/2
{
  "devDependencies": {
    "parcel": "^3.0.0"
  }
}
```

{% endsamplefile %}
{% endmigration %}

You should also remove any `@parcel/*` plugin packages from Parcel 2 that are now built into Parcel, or that are no longer supported. See [Plugins](#plugins) below for details.

If you'd like to try Parcel 3 before switching over entirely, it is also published as `@parcel/parcel3`. This package installs a `parcel3` command instead of `parcel`, so it can be installed alongside Parcel 2 in the same project. Use `parcel3` in place of `parcel` when running the commands on this page, and pass a different `--dist-dir` so the two versions don't overwrite each other's output.

{% samplefile "package.json" %}

```json/3,7
{
  "scripts": {
    "build": "parcel build src/index.html",
    "build:v3": "parcel3 build src/index.html --dist-dir dist-v3"
  },
  "devDependencies": {
    "parcel": "^2.0.0",
    "@parcel/parcel3": "^3.0.0"
  }
}
```

{% endsamplefile %}

### Commands

In Parcel 2, running `parcel` with a list of entries and no command started the development server. Parcel 3 always requires a command, so you'll need to update your package scripts to use `parcel serve`.

{% migration %}
{% samplefile "package.json" %}

```json/3
{
  "source": "src/index.html",
  "scripts": {
    "start": "parcel",
    "build": "parcel build"
  }
}
```

{% endsamplefile %}
{% samplefile "package.json" %}

```json/3
{
  "source": "src/index.html",
  "scripts": {
    "start": "parcel serve",
    "build": "parcel build"
  }
}
```

{% endsamplefile %}
{% endmigration %}

Parcel 3 also adds a new [`parcel run`](/features/cli/#parcel-run-%3Centries%3E) command, which builds and runs a Node.js entry with hot module replacement. This replaces running `parcel watch` alongside a tool like `nodemon`.

### Cache

Parcel 3 is fast enough that it no longer writes a cache to disk. You can delete the `.parcel-cache` directory and remove it from your `.gitignore`.

{% migration %}
{% samplefile ".gitignore" %}

```text/1
dist
.parcel-cache
```

{% endsamplefile %}
{% samplefile ".gitignore" %}

```text/0
dist
```

{% endsamplefile %}
{% endmigration %}

### Installing dependencies

Parcel 2 automatically installed plugins and other dependencies it needed when they were missing from your project. Parcel 3 no longer does this, so you'll need to install them yourself. This includes:

- Plugins that are not part of the default config, such as `@parcel/transformer-sass`. See [Plugins](#plugins) below.
- `@swc/helpers`, which is required when your code is transpiled for older browsers.
- Polyfills for Node.js builtin modules used in browser code, such as `path-browserify`, `buffer`, and `process`. See [Node emulation](/features/node-emulation/) for the full list.

## Configuration

### Plugin configuration

In Parcel 2, many plugins were configured using a key in your `package.json` named after the plugin, or using a tool-specific config file. In Parcel 3, plugin options are specified in your `.parcelrc` instead, by replacing the plugin name with an object containing a `plugin` and a `config`. See [Plugin configuration](/features/plugins/#plugin-configuration) for details.

{% migration %}
{% samplefile "package.json" %}

```json/1-6
{
  "@parcel/bundler-default": {
    "minBundleSize": 30000,
    "manualSharedBundles": [
      {"name": "vendor", "assets": ["node_modules/**"]}
    ]
  }
}
```

{% endsamplefile %}
{% samplefile ".parcelrc" %}

```json/2-10
{
  "extends": "@parcel/config-default",
  "bundler": {
    "plugin": "@parcel/bundler-default",
    "config": {
      "minBundleSize": 30000,
      "manualSharedBundles": [
        {"assets": ["node_modules/**"]}
      ]
    }
  }
}
```

{% endsamplefile %}
{% endmigration %}

The following table lists where configuration that was previously read from `package.json` or other config files now lives.

| Parcel 2                                    | Parcel 3                                                                                                                                    |
| ------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| `package.json#@parcel/transformer-js`       | `@parcel/transformer-js` config in `.parcelrc` (`inlineEnvironment`, `inlineFS`). See [Node emulation](/features/node-emulation/).          |
| `package.json#@parcel/transformer-css`      | `@parcel/transformer-css` config in `.parcelrc` (`cssModules`, `pseudoClasses`). See [CSS](/languages/css/).                                |
| `package.json#@parcel/bundler-default`      | `@parcel/bundler-default` config in `.parcelrc`. See [Code splitting](/features/code-splitting/#configuration).                             |
| `package.json#@parcel/resolver-default`     | No longer needed. Package `exports` are always enabled.                                                                                     |
| `svgo.config.json`                          | `@parcel/transformer-svg` config in `.parcelrc` (`optimize`). See [SVG](/languages/svg/#minification).                                      |
| `.svgrrc`                                   | `@parcel/transformer-svg-jsx` config in `.parcelrc`. See [SVG](/languages/svg/).                                                            |
| `.lessrc`, `.sassrc`, `.stylusrc`, `.pugrc` | Plugin config in `.parcelrc`. See [Less](/languages/less/), [Sass](/languages/sass/), [Stylus](/languages/stylus/), [Pug](/languages/pug/). |
| `sharp.config.json`                         | No longer supported.                                                                                                                        |
| `.htmlnanorc`                               | `@parcel/transformer-html` config in `.parcelrc` (`optimize`). See [HTML](/languages/html/#minification).                                   |
| `.terserrc`                                 | No longer supported. JavaScript minifier options are not configurable.                                                                      |

The following package.json options have also changed:

- The `minBundles` and `http` options of `@parcel/bundler-default` have been removed. The default `minBundleSize` is now `30000`, and it only applies to JavaScript bundles. The new `firstPageLoadPriority`, `dependencyChangeRate`, and `compression` options let you tune how Parcel optimizes shared bundles. See [Code splitting](/features/code-splitting/#configuration) for details.
- `manualSharedBundles` no longer supports the `name`, `root`, and `split` options. <!-- TODO(v3): these options are silently ignored rather than rejected. Confirm this is intentional. -->

### Plugins

Some plugins that were included in Parcel 2's default config are not included in Parcel 3's default config. If you use any of these, you'll need to install the plugin and add it to your `.parcelrc`.

| File types           | Plugin                             |
| -------------------- | ---------------------------------- |
| Babel                | `@parcel/transformer-babel`        |
| PostCSS              | `@parcel/transformer-postcss`      |
| PostHTML             | `@parcel/transformer-posthtml`     |
| `*.sass`, `*.scss`   | `@parcel/transformer-sass`         |
| `*.less`             | `@parcel/transformer-less`         |
| `*.styl`, `*.stylus` | `@parcel/transformer-stylus`       |
| `*.sss`              | `@parcel/transformer-sugarss`      |
| `*.pug`              | `@parcel/transformer-pug`          |
| `*.coffee`           | `@parcel/transformer-coffeescript` |

For example, to use Sass:

```shell
yarn add @parcel/transformer-sass --dev
```

{% sample %}
{% samplefile ".parcelrc" %}

```json
{
  "extends": "@parcel/config-default",
  "transformers": {
    "*.{sass,scss}": ["@parcel/transformer-sass"]
  }
}
```

{% endsamplefile %}
{% endsample %}

In particular, Parcel no longer runs Babel or PostCSS automatically when it finds a config file in your project.

- If you rely on custom Babel or PostCSS plugins, add `@parcel/transformer-babel` or `@parcel/transformer-postcss` to your `.parcelrc` as described in the [JavaScript](/languages/javascript/#babel) and [CSS](/languages/css/#postcss) docs.
- Babel no longer adds any presets by default, so if you remove the standard presets from your config, you'll need to include the syntax plugins for JSX or TypeScript instead.
- Flow types are also no longer stripped by Parcel's builtin transpiler, so if you use Flow, use `@parcel/transformer-babel` with `@babel/preset-flow`.
- Tailwind CSS is now supported via the builtin `@parcel/transformer-tailwind` plugin rather than PostCSS. See [Tailwind CSS](/languages/css/#tailwind-css) for details.

Some plugins are now built into Parcel, and no longer need to be installed separately. These include:

- `@parcel/transformer-svg-jsx` (which replaces `@parcel/transformer-svg-react`)
- `@parcel/transformer-xml`
- `@parcel/transformer-toml`
- `@parcel/transformer-yaml`
- `@parcel/transformer-jsonld`
- `@parcel/transformer-webmanifest`
- `@parcel/transformer-tailwind`
- `@parcel/resolver-glob`

The following plugins are no longer needed, since their functionality is built into Parcel or has been replaced:

- `@parcel/optimizer-terser`, `@parcel/optimizer-esbuild`, `@parcel/optimizer-swc`, `@parcel/optimizer-cssnano`, `@parcel/optimizer-htmlnano`, `@parcel/optimizer-svgo`, and `@parcel/optimizer-image` – minification is built in.
- `@parcel/transformer-typescript-tsc` – use the builtin TypeScript support.
- `@parcel/transformer-react-refresh-wrap` – React Fast Refresh is built in.
- `@parcel/reporter-bundle-analyzer` and `@parcel/reporter-bundle-buddy` – use the [`--analyze`](/features/production/#bundle-analyzer) flag.
- `@parcel/transformer-inline-string` – use `@parcel/transformer-inline`.

## Targets

### Library targets

In Parcel 2, libraries were configured using the `main`, `module`, `browser`, and `types` fields in `package.json`, along with the `targets` field. Parcel 3 uses the `exports` field instead. Add a `source` condition to each export to reference the source file, and Parcel will build each of the other conditions. The output format is determined by the file extension, or the `"type"` field in your `package.json`. See [Library targets](/features/targets/#library-targets) for details.

{% migration %}
{% samplefile "package.json" %}

```json/2-4
{
  "name": "my-library",
  "source": "src/index.js",
  "main": "dist/main.js",
  "module": "dist/module.js"
}
```

{% endsamplefile %}
{% samplefile "package.json" %}

```json/2-6
{
  "name": "my-library",
  "exports": {
    "source": "./src/index.js",
    "import": "./dist/module.mjs",
    "require": "./dist/main.cjs"
  }
}
```

{% endsamplefile %}
{% endmigration %}

Parcel 3 also builds libraries differently than Parcel 2. Each module is written to a separate output file rather than concatenated into a single bundle, which allows consumers of your library to tree shake it more effectively. `dependencies` and `peerDependencies` are not bundled, but `devDependencies` are.

TypeScript declaration file (`.d.ts`) generation is not yet supported in Parcel 3. In the meantime, you can run `tsc --emitDeclarationOnly` alongside Parcel.

### Target options

The following target options have been removed:

- `scopeHoist` – scope hoisting has been removed. See [Scope hoisting](#scope-hoisting) below.
- `isLibrary` – library targets are now determined by the `exports` field.
- `sourceMap` – use the `--no-source-maps` CLI flag instead.
- `publicUrl` – use the `--public-url` CLI flag instead.
- `source` – pass entries to the CLI, or use the top-level `source` field in `package.json` instead.

Top-level `package.json` fields named after custom targets (e.g. `"modern": "dist/modern.js"`) are also no longer supported.

In development, Parcel now builds for your configured browserslist rather than for the latest browsers.

Differential bundling has been removed: Parcel no longer generates `<script nomodule>` fallbacks. When a `<script type="module">` is used and some of your browser targets don't support ES modules, Parcel compiles it to a classic `<script defer>` instead, which loads in both modern and older browsers. All modern browsers have supported ESM for many years, so this should be rare.

## Code changes

### Glob imports

Glob specifiers still require adding `@parcel/resolver-glob` to your `.parcelrc`, but the plugin is now built into Parcel. Globs now resolve to a default export, and the values are the default export of each file rather than a namespace object. To load each file lazily, use the `?async=true` query parameter instead of a dynamic `import()`. Glob imports of files in npm packages (e.g. `@company/pkg/i18n/*.js`) are not supported yet. See [Glob specifiers](/features/dependency-resolution/#glob-specifiers) for details.

{% migration %}
{% samplefile "app.js" %}

```js/0
import * as files from './files/*.js';
```

{% endsamplefile %}
{% samplefile "app.js" %}

```js/0
import files from './files/*.js';
```

{% endsamplefile %}
{% endmigration %}

### Worklets

The `worklet:` URL scheme has been replaced by [import attributes](/languages/javascript/#import-attributes). To import a URL to a web audio worklet, use the `url` type along with `env: 'worklet'`. See [Worklets](/languages/javascript/#worklets) for details.

{% migration %}
{% samplefile "app.js" %}

```js/0
import workletUrl from 'worklet:./worklet.js';
```

{% endsamplefile %}
{% samplefile "app.js" %}

```js/0
import workletUrl from './worklet.js' with {type: 'url', env: 'worklet'};
```

{% endsamplefile %}
{% endmigration %}

### Macros

Macros now run inside Parcel's embedded JavaScript runtime rather than in Node.js, so some Node APIs such as `fetch`, timers, and `child_process` are not available. See [Runtime environment](/features/macros/#runtime-environment) for details. In addition, the `this.invalidateOnFileChange` and related APIs have been removed. Parcel now tracks the files your macros read automatically.

### Scope hoisting

Parcel 3 no longer concatenates modules into a single scope ("scope hoisting"). Tree shaking is still supported, and unused exports are removed from your production builds. The `--no-scope-hoist` CLI flag has been removed. See [Tree shaking](/features/tree-shaking/) for details on how to make sure your code can be tree shaken.

## CLI

The following CLI options have been removed:

| Option                             | Replacement                                                 |
| ---------------------------------- | ----------------------------------------------------------- |
| `--no-cache`, `--cache-dir`        | Parcel no longer writes a cache to disk.                    |
| `--no-autoinstall`                 | Parcel no longer installs dependencies automatically.       |
| `--no-scope-hoist`                 | Scope hoisting has been removed.                            |
| `--reporter`                       | Add reporters to your `.parcelrc`.                          |
| `--target`                         | All targets are built.                                      |
| `--lazy`                           | Lazy mode has been removed.                                 |
| `--profile`, `--trace`             | Profiling has been removed.                                 |
| `--watch-dir`, `--watch-for-stdin` | None.                                                       |
| `--hmr-host`                       | Use `--host`.                                               |
| `--no-cors`                        | The dev server no longer adds CORS headers to served files. |
| `-V`, `--version`                  | None.                                                       |

In addition, `--hmr-port` is now only supported by `parcel run`, and `--config` must be a path to a file rather than a package name. See the [CLI](/features/cli/) docs for a full list of options, including new ones such as `--open`, `--analyze`, and `--detailed-report`.

<!-- TODO(v3): confirm the following are intentional: `parcel watch` no longer starts an HMR server; the dev server no longer sends CORS headers; there is no version flag. -->

## Development

- The API proxy (`.proxyrc` and `.proxyrc.js`) has been removed.
- Lazy mode has been removed.
- `--https` now uses a certificate signed by a local certificate authority, which Parcel can add to your system's trust store so that browsers trust it. See [HTTPS](/features/development/#https) for details. The dev server now serves both HTTP and HTTPS on the same port.

## Production

- Compressor plugins such as `@parcel/compressor-gzip` and `@parcel/compressor-brotli` are not yet supported in Parcel 3. Remove `compressors` from your `.parcelrc`, and configure your server or CDN to compress assets instead.
- Content hashes are now placed in output file names as `name-hash.ext` rather than `name.hash.ext`, and shared bundles are named by their hash. Server and library bundles do not include content hashes.
- Image resizing and format conversion now only happen in production builds or with `--optimize`. Reading HEIC and raw images, and AVIF input, is no longer supported.

## Removed features

The following features from Parcel 2 are not currently supported in Parcel 3. Some of these may be added again in the future, or moved to third party plugins.

- Elm, Vue, GLSL, and GraphQL support.
- Web extensions.
- The Parcel JavaScript API (`@parcel/core`). Parcel can currently only be run from the CLI.
- TypeScript type checking via `@parcel/validator-typescript`. Run `tsc --noEmit` separately instead.
- The `@parcel/service-worker` package. <!-- TODO(v3): confirm this is intentionally removed. -->

## Plugins

Parcel 3 supports plugins written in JavaScript or TypeScript, as well as [native plugins](/plugin-system/native-plugins/) written in Rust, Go, Swift, or C. If you have written a Parcel 2 plugin, you'll need to update it for Parcel 3's plugin API. The main differences are:

- **Plugin types** – Only transformer, resolver, namer, optimizer, and reporter plugins are supported. Packager and runtime plugins are no longer separate plugin types; packaging is now handled by Parcel itself. Custom bundler, validator, and compressor plugins are not yet supported.
- **Runtime** – JavaScript plugins run in an embedded JavaScript runtime rather than in Node.js. Most commonly used Node builtin modules are emulated, but some APIs such as timers, networking, and child processes are not available. See [JavaScript runtime](/plugin-system/authoring-plugins/#javascript-runtime) for details. TypeScript plugins can be loaded directly without compiling them first.
- **Configuration** – The `loadConfig` method and `Config` object have been removed. Plugins receive their configuration from the `.parcelrc` via the `config` option. Files read with the `fs` module are tracked automatically, and Parcel rebuilds when they change. See [Configuration](/plugin-system/authoring-plugins/#configuration).
- **Logging and diagnostics** – The `logger` option has been replaced by `console` methods, and `ThrowableDiagnostic` from `@parcel/diagnostic` has been replaced by the `Diagnostic` class exported by `@parcel/plugin`, which can be thrown or passed to `console` methods. See [Diagnostics](/plugin-system/logging/).
- **Source maps** – The `@parcel/source-map` library has been replaced by plain source map JSON objects. See [Source Maps](/plugin-system/source-maps/).
- **Transformers** – Asset methods like `getCode()` and `getMap()` are now synchronous, and source maps are set with `setCode(code, map)`. The `canReuseAST`, `parse`, `generate`, and `postProcess` methods have been removed, and transformers can no longer return multiple assets.
- **Resolvers** – `resolveFrom` is now a `file:` URL, and resolvers receive the named `pipeline` of the dependency.
- **Optimizers** – `contents` and `map` are now `Uint8Array` objects.
- **Reporters** – The `report` method has been replaced by separate `buildStart`, `buildSuccess`, `buildFailure`, and `log` methods.
- **Engines** – Update the `engines.parcel` field in your plugin's `package.json` to `^3.0.0-0`, so that prerelease versions of Parcel 3 match.

See the [Plugin System](/plugin-system/overview/) docs for full details.
