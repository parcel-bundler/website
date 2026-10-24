---
layout: layout.njk
title: Migration from Parcel 1
eleventyNavigation:
  key: migration-parcel-1
  title: 📦 Parcel 1
  order: 2
---

<!-- TODO(v3): does this page still make sense for v3? Parcel 1 users are now two major versions behind, and the v2 → v3 migration guide covers most of the same ground. I updated it to describe migrating from Parcel 1 straight to v3 (and used "Parcel 3" in the prose, pending the naming decision). Keep it, fold it into the v2 → v3 guide, or delete it? -->

For the most part, Parcel 3 works quite similarly to Parcel 1, but there are a few things you’ll need to change when upgrading.

## Getting started

Let's walk through a couple basic steps to upgrade from Parcel 1 to Parcel 3.

### Package name

The first thing to note when upgrading from Parcel 1 to Parcel 3 is that the npm package name has changed from `parcel-bundler` to `parcel`. You'll need to update the dependencies in your `package.json` accordingly.

{% migration %}
{% samplefile "package.json" %}

```json/2
{
  "devDependencies": {
    "parcel-bundler": "^1.12.5"
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

You can also do this by using your package manager, e.g. `npm` or `yarn`.

```shell
yarn remove parcel-bundler
yarn add parcel --dev
```

### Cache

Parcel 1 stored its cache in a `.cache` directory. Parcel 3 does not write a cache to disk, so you can delete this directory, and remove it from your `.gitignore` or similar.

## Code Changes

### `<script type="module">`

In Parcel 1, JavaScript files referenced from a `<script>` tag in an HTML file were treated as modules, supporting both ES module and CommonJS syntax for importing and exporting values. However, this did not match how browsers actually work, where "classic scripts" do not support imports and exports and top-level variables are treated as globals.

Parcel 3 matches browser behavior: classic `<script>` tags do not support imports or exports. Use a `<script type="module">` element to reference a module.

{% migration %}
{% samplefile "index.html" %}

```html/3
<!doctype html>
<html>
  <head>
    <script src="app.js"></script>
  </head>
</html>
```

{% endsamplefile %}

{% samplefile "index.html" %}

```html/3
<!doctype html>
<html>
  <head>
    <script type="module" src="app.js"></script>
  </head>
</html>
```

{% endsamplefile %}
{% endmigration %}

{% error %}

**Note**: Adding the `type="module"` attribute also affects the loading behavior of scripts. Classic scripts are "render blocking", meaning the rest of the HTML document is not parsed until script execution is complete. Module scripts are not render blocking, and execution is deferred until the HTML is fully parsed. Parcel inserts the `defer` attribute automatically to match this behavior in older browsers. This means features like `document.write` do not work in module scripts. If you are relying on these features, either migrate to modern APIs or continue using a classic script for that part of your app. See the docs on [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules#other_differences_between_modules_and_standard_scripts) to learn more about the differences between modules and classic scripts.
{% enderror %}

See [Classic scripts](/languages/javascript/#classic-scripts) for more details about classic scripts vs module scripts.

### Importing non-code assets from JavaScript

In Parcel 1, importing any non-JavaScript file such as an image or video resulted in a URL. In Parcel 3, this still works for known file types such as images, but other file types without default support will require code changes.

The preferred approach for referencing URLs in JavaScript is to use the [URL constructor](/languages/javascript/#url-dependencies). However, you may also choose to prefix the dependency specifier in an `import` statement with `url:`.

{% migration %}
{% samplefile "index.js" %}

```js/0
import downloadUrl from "./download.zip";

document.body.innerHTML = `<a href="${downloadUrl}">Download</a>`;
```

{% endsamplefile %}
{% samplefile %}

```js/0
const downloadUrl = new URL('download.zip', import.meta.url);

document.body.innerHTML = `<a href="${downloadUrl}">Download</a>`;
```

{% endsamplefile %}
{% endmigration %}

Alternatively, you can use a custom `.parcelrc` to opt into the old behavior. Use the `@parcel/transformer-raw` plugin, which is included with Parcel, with a glob for the extensions you need.

{% sample %}
{% samplefile ".parcelrc" %}

```json/3
{
  "extends": "@parcel/config-default",
  "transformers": {
    "*.{zip,tgz}": ["@parcel/transformer-raw"]
  }
}
```

{% endsamplefile %}
{% endsample %}

### Transpilation

Parcel 1 automatically transpiled your JavaScript to support a default set of browsers. Parcel 3 does not do any transpilation by default. This means if you use modern JavaScript syntax in your source code, that's what Parcel will output. To enable transpilation, set the `browserslist` field in your package.json to define your supported browser targets.

{% sample %}
{% samplefile "package.json" %}

```js/2
{
  "name": "my-project",
  "browserslist": "> 0.5%, last 2 versions, not dead",
  "scripts": {
    "start": "parcel serve index.html",
    "build": "parcel build index.html"
  },
  "devDependencies": {
    "parcel": "latest"
  }
}
```

{% endsamplefile %}
{% endsample %}

### Babel

Unlike Parcel 1, Parcel 3 does not use Babel automatically. Babel is supported via the `@parcel/transformer-babel` plugin, which you'll need to install and add to your `.parcelrc`. It detects `.babelrc` and other Babel config files. However, if you're only using `@babel/preset-env`, `@babel/preset-typescript`, and `@babel/preset-react`, Babel may no longer be necessary. Parcel supports all of these features automatically without a Babel config, and Parcel's default transpiler is much faster than Babel.

If you only use the above presets, you can delete your Babel config entirely. This will use Parcel's default transpiler instead, which should improve your build performance significantly. Make sure to configure `browserslist` in your `package.json` to match the targets previously used by `@babel/preset-env`.

If you do have custom presets or plugins in your Babel config, you can keep those but remove the presets listed above. This should also improve performance (albeit a bit less). Since Babel runs before Parcel's default transpiler, you may need to add syntax plugins such as `@babel/plugin-syntax-jsx` so that Babel can parse your code. See [Babel](/languages/javascript/#babel) in the JavaScript docs for more details.

In this example, `.babelrc` contains only `@babel/preset-env` and `@babel/preset-react`, so it can be deleted, and replaced with a `browserslist` key in `package.json`.

{% migration %}
{% samplefile ".babelrc" %}

```json/0-7
{
  "presets": [
    ["@babel/preset-env", {
      "targets": "> 0.25%, not dead"
    }],
    "@babel/preset-react"
  ]
}
```

{% endsamplefile %}
{% samplefile "package.json" %}

```json/1
{
  "browserslist": "> 0.25%, not dead"
}
```

{% endsamplefile %}
{% endmigration %}

### Typescript

Parcel 1 transpiled TypeScript using `tsc` (the official TypeScript compiler). Parcel 3 now uses [SWC](https://swc.rs) instead, which improves transpilation performance significantly.

However, the default transpiler has limited support for `tsconfig.json`. Only the JSX-related options, `experimentalDecorators`, and `useDefineForClassFields` affect compilation.

<!-- TODO(v3): removed the instructions for replacing the TypeScript transformer with @parcel/transformer-typescript-tsc. There's no tsc transformer in packages-v3, and the v2 plugin isn't compatible with the v3 plugin API. -->

See the [TypeScript docs](/languages/typescript) for more information on using TypeScript with Parcel.

### Flow

Parcel 1 supported Flow automatically when `flow-bin` was installed. Parcel 3 does not strip Flow types by default. To use Flow, install `@parcel/transformer-babel` and add it to your `.parcelrc` as described [above](#babel), and keep `@babel/preset-flow` in your Babel config. See [Flow](/languages/javascript/#flow) in the JavaScript docs for more details.

<!-- TODO(v3): v2 stripped Flow types automatically (via @babel/preset-flow) when flow-bin was installed; v3's transformer-js fails to parse Flow annotations. Confirm this is intentional. -->

## CLI

### Commands

In Parcel 1, running `parcel` with an entry and no command started the development server. In Parcel 3, use the `serve` command to start the development server. See [CLI](/features/cli/) for details about all of the available commands.

{% migration %}
{% samplefile %}

```bash
parcel index.html
```

{% endsamplefile %}
{% samplefile %}

```bash
parcel serve index.html
```

{% endsamplefile %}
{% endmigration %}

### `--target`

In Parcel 1, the `--target` CLI option controlled which environment your code was compiled for. In Parcel 3, this is configured in `package.json` instead. For example, setting the `engines` field to include a `node` or `electron` key will change the target accordingly.

{% migration %}
{% samplefile %}

```bash
parcel build index.js --target node
```

{% endsamplefile %}
{% samplefile "package.json" %}

```json5/2
{
  "engines": {
    "node": "10"
  }
}
```

{% endsamplefile %}
{% endmigration %}

You can also build for multiple targets simultaneously in Parcel 3. See [Targets](/features/targets/) for details.

### `--experimental-scope-hoisting`

This option has been removed. Parcel 3 automatically performs [tree shaking](/features/production/#tree-shaking) in production builds.

{% migration %}
{% samplefile %}

```bash
parcel build index.js --experimental-scope-hoisting
```

{% endsamplefile %}
{% samplefile %}

```bash
parcel build index.js
```

{% endsamplefile %}
{% endmigration %}

### `--bundle-node-modules`

Parcel 3 bundles packages from `node_modules` by default, including when targetting Node.js, so this option is no longer needed.

{% migration %}
{% samplefile %}

```bash
parcel build index.js --target node --bundle-node-modules
```

{% endsamplefile %}
{% samplefile "package.json" %}

```json5/2
{
  "engines": {
    "node": "10"
  }
}
```

{% endsamplefile %}
{% endmigration %}

{% note %}

To exclude some or all packages from the bundle, use the `includeNodeModules` option in the target configuration. See [includeNodeModules](/features/targets/#includenodemodules) in the Targets docs for details.

{% endnote %}

<!-- TODO(v3): v3 bundles node_modules for Node app targets by default (IncludeNodeModules::default() is Bool(true) in crates/core/src/target.rs, verified with a build); v2 defaulted to false for Node. Confirm this is intentional. -->

### `--out-dir`

The `--out-dir` CLI option was renamed to `--dist-dir`.

{% migration %}
{% samplefile %}

```bash
parcel build index.html --out-dir www
```

{% endsamplefile %}
{% samplefile %}

```bash
parcel build index.html --dist-dir www
```

{% endsamplefile %}
{% endmigration %}

### `--out-file`

The `--out-file` CLI option was removed. For libraries, the output path should instead be specified in `package.json`, along with a `source` field pointing at the entry, and Parcel should be run without an entry. See [Library targets](/features/targets/#library-targets) for details.

{% migration %}
{% samplefile %}

```bash
parcel build index.js --out-file lib.js
```

{% endsamplefile %}
{% samplefile "package.json" %}

```json5/3-4
{
  "name": "my-library",
  "version": "1.0.0",
  "source": "index.js",
  "main": "lib.js"
}
```

{% endsamplefile %}
{% endmigration %}

### `--log-level`

The log levels now have names instead of numbers (`none`, `error`, `warn`, `info`, `verbose`).

{% migration %}
{% samplefile %}

```bash
parcel build index.js --log-level 1
```

{% endsamplefile %}
{% samplefile %}

```bash
parcel build index.js --log-level error
```

{% endsamplefile %}
{% endmigration %}

### `--global`

This option has been removed without a replacement (for now).

{% migration %}
{% samplefile %}

```bash
parcel build index.js --global mylib
```

{% endsamplefile %}
{% samplefile %}
{% endsamplefile %}
{% endmigration %}

### `--no-minify`

This option has been renamed to `--no-optimize`.

{% migration %}
{% samplefile %}

```bash
parcel build index.js --no-minify
```

{% endsamplefile %}
{% samplefile %}

```bash
parcel build index.js --no-optimize
```

{% endsamplefile %}
{% endmigration %}

## Plugins

The plugin system has been completely changed since Parcel 1. Parcel 1 plugins are not compatible with Parcel 3. See [Plugin System](/plugin-system/overview/) for details about the Parcel 3 plugin APIs.

### Using plugins

In Parcel 1, installing plugins into your project and listing them in `package.json` dependencies enabled them automatically. In Parcel 3, plugins are configured in `.parcelrc`. See [Parcel configuration](/features/plugins/) for details.
