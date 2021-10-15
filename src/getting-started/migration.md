---
layout: layout.njk
title: Migration
eleventyNavigation:
  key: getting-started-migration
  title: 🚚 Migration
  order: 5
---

For the most part, Parcel 2 works quite similarly to Parcel 1, but there are a few things you’ll need to change when upgrading.

## Getting started

Let's walk through a couple basic steps to upgrade from Parcel 1 to Parcel 2.

### Package name

The first thing to note when upgrading from Parcel 1 to Parcel 2 is that the npm package name has changed from `parcel-bundler` to `parcel`. You'll need to update the dependencies in your `package.json` accordingly.

{% migration %}
{% samplefile "package.json" %}

```json/2
{
  "dependencies": {
    "parcel-bundler": "^1.12.5"
  }
}
```

{% endsamplefile %}
{% samplefile "package.json" %}

```json/2
{
  "dependencies": {
    "parcel": "^2.0.0"
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

### Cache location

The default location of the Parcel cache has also changed from `.cache` to `.parcel-cache`. You'll need to modify your `.gitignore` or similar to account for this:

{% migration %}
{% samplefile ".gitignore" %}

```text/0
.cache
```

{% endsamplefile %}
{% samplefile ".gitignore" %}

```text/0
.parcel-cache
```

{% endsamplefile %}
{% endmigration %}

## Code Changes

### `<script type="module">`

In Parcel 1, JavaScript files referenced from a `<script>` tag in an HTML file were treated as modules, supporting both ES module and CommonJS syntax for importing and exporting values. However, this did not match how browsers actually work, where "classic scripts" do not support imports and exports and top-level variables are treated as globals.

Parcel 2 matches browser behavior: classic `<script>` tags do not support imports or exports. Use a `<script type="module">` element to reference a module. This will also automatically generate a `nomodule` version as well for older browsers, depending on your `browserslist`. See [Differential bundling](/features/targets/#differential-bundling) for details.

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

**Note**: Adding the `type="module"` attribute also affects the loading behavior of scripts. Classic scripts are "render blocking", meaning the rest of the HTML document is not parsed until script execution is complete. Module scripts are not render blocking, and execution is deferred until the HTML is fully parsed. Parcel inserts the `defer` attribute automatially to match this behavior in older browsers and in development mode. This means features like `document.write` do not work in module scripts. If you are relying on these features, either migrate to modern APIs or continue using a classic script for that part of your app. See the docs on [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules#other_differences_between_modules_and_standard_scripts) to learn more about the differences between modules and classic scripts.
{% enderror %}

See [Classic scripts](/languages/javascript/#classic-scripts) for more details about classic scripts vs module scripts.

### Importing non-code assets from JavaScript

In Parcel 1, importing any non-JavaScript file such as an image or video resulted in a URL. In Parcel 2, this still works for known file types such as images, but other file types without default support will require code changes.

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

Alternatively, you can use a custom `.parcelrc` to opt into the old behavior. Use the `@parcel/transformer-raw` plugin with a glob for the extensions you need.

{% sample %}
{% samplefile %}

```shell
yarn add @parcel/config-default @parcel/transformer-raw --dev
```

{% endsamplefile %}
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

Parcel 1 automatically transpiled your JavaScript to support a default set of browsers. Parcel 2 no longer does any transpilation by default. This means if you use modern JavaScript syntax in your source code, that's what Parcel will output. To enable transpilation, set the `browserslist` field in your package.json to define your supported browser targets.

{% sample %}
{% samplefile "package.json" %}

```js/2
{
  "name": "my-project",
  "browserslist": "> 0.5%, last 2 versions, not dead",
  "scripts": {
    "start": "parcel index.html",
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

Like Parcel 1, Parcel 2 automatically detects `.babelrc` and other Babel config files. However, if you're only using `@babel/preset-env`, `@babel/preset-typescript`, and `@babel/preset-react`, Babel may no longer be necessary. Parcel supports all of these features automatically without a Babel config, and Parcel's default transpiler is much faster than Babel.

If you only use the above presets, you can delete your Babel config entirely. This will use Parcel's default transpiler instead, which should improve your build performance significantly. Make sure to configure `browserslist` in your `package.json` to match the targets previously used by `@babel/preset-env`.

If you do have custom presets or plugins in your Babel config, you can keep those but remove the presets listed above. This should also improve performance (albeit a bit less). See [Babel](/languages/javascript/#babel) in the JavaScript docs for more details.

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

Parcel 1 transpiled TypeScript using `tsc` (the official TypeScript compiler). Parcel 2 now uses [SWC](https://swc.rs) instead, which improves transpilation performance significantly.

However, the default transpiler has limited support for `tsconfig.json`. If you use custom compiler options beyond the JSX-related options and `experimentalDecorators`, you can replace Parcel's default TypeScript transformer with TSC using `@parcel/transformer-typescript-tsc`. To do this, install the default config and the TSC plugin and create a `.parcelrc` file in the root of your project.

{% sample %}
{% samplefile %}

```shell
yarn add @parcel/config-default @parcel/transformer-typescript-tsc --dev
```

{% endsamplefile %}
{% samplefile ".parcelrc" %}

```json/3
{
  "extends": "@parcel/config-default",
  "transformers": {
    "*.{ts,tsx}": ["@parcel/transformer-typescript-tsc"]
  }
}
```

{% endsamplefile %}
{% endsample %}

See the [TypeScript docs](/languages/typescript) for more information on using TypeScript with Parcel.

### Flow

Just like Parcel 1, Parcel 2 supports Flow automatically when `flow-bin` is installed. This is currently implemented using `@babel/preset-flow`. If you have a Babel config with only that preset, it can be removed as described [above](#babel).

Unlike Parcel 1, your Babel config overrides the default in Parcel 2 rather than being merged into it. If you have custom Babel plugins other than Flow, you'll need to add `@babel/preset-flow` as well.

### Importing GraphQL

When import GraphQL files (`.gql`), imports are still resolved/inlined (using `graphql-import-macro`), but you now get the processed GraphQL query as a string instead of an Apollo AST.

{% migration %}
{% samplefile "DataComponent.js" %}

```js
import fetchDataQuery from "./fetchData.gql"; // fetchDataQuery is the parsed AST

const DataComponent = () => {
  const { data } = useQuery(test, {
    fetchPolicy: "cache-and-network",
  });

  // ...
};
```

{% endsamplefile %}
{% samplefile "DataComponent.js" %}

```js/0,4
import gql from "graphql-tag";
import fetchDataQuery from "./fetchData.gql"; // fetchDataQuery is a string

// Convert to the Apollo Specific Query AST
const parsedFetchDataQuery = gql(fetchDataQuery);

const DataComponent = () => {
  const { data } = useQuery(parsedFetchDataQuery, {
    fetchPolicy: "cache-and-network",
  });

  // ...
};
```

{% endsamplefile %}
{% endmigration %}

{% note %}

With Parcel 2's new plugin architecture, creating a plugin that parses the string into an AST at build time (as Parcel 1 did) is very easy. See the [Transformer](/plugin-system/transformer/) docs for details.

{% endnote %}

### `package.json#main`

Many `package.json` files (e.g. the one generated by `npm init`) contain a `main` field, which is ignored by most tools (for non-library projects). However, when a `main` field is seen, Parcel infers that your project is a library and uses it as the output path. For most web apps, this line should be removed.

{% migration %}
{% samplefile "package.json" %}

```json/1
{
  "main": "index.js",
  "scripts": {
    "start": "parcel index.html",
    "build": "parcel build index.html"
  }
}
```

{% endsamplefile %}
{% samplefile "package.json" %}

```json
{
  "scripts": {
    "start": "parcel index.html",
    "build": "parcel build index.html"
  }
}
```

{% endsamplefile %}
{% endmigration %}

If you do need to keep the `main` field, and want Parcel to ignore it, you can add `"targets": { "main": false }` to your `package.json`. See [Library targets](/features/targets/#library-targets) for details.

## CLI

### `--target`

In Parcel 1, the `--target` CLI option controlled which environment your code was compiled for. In Parcel 2, this is configured in `package.json` instead. For example, setting the `engines` field to include a `node` or `electron` key will change the target accordingly.

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

You can also build for multiple targets simultaneously in Parcel 2. See [Targets](/features/targets/) for details.

### `--experimental-scope-hoisting`

Parcel 2 has scope hoisting enabled by default. To disable it, add `--no-scope-hoist`.

{% migration %}
{% samplefile %}

```bash
parcel build index.js --experimental-scope-hoisting
parcel build index.js
```

{% endsamplefile %}
{% samplefile %}

```bash
parcel build index.js
parcel build index.js --no-scope-hoist
```

{% endsamplefile %}
{% endmigration %}

### `--bundle-node-modules`

To bundle packages from `node_modules` when targetting Node.js, you now should specify that in the target configuration:

{% migration %}
{% samplefile %}

```bash
parcel build index.js --target node --bundle-node-modules
```

{% endsamplefile %}
{% samplefile "package.json" %}

```json5/3,7
{
  "targets": {
    "default": {
      "includeNodeModules": true
    }
  },
  "engines": {
    "node": "10"
  }
}
```

{% endsamplefile %}
{% endmigration %}

{% note %}

This option is more versatile than the CLI parameter. For example, you can also selectively include packages. see [includeNodeModules](/features/targets/#includenodemodules) in the Targets docs for details.

{% endnote %}

### `--out-dir`

The `--out-dir` CLI option was renamed to `--dist-dir` to match the `distDir` option in `package.json`. See [Targets](/features/targets/#targets) for details.

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

The `--out-file` CLI option was removed, and the path should instead be specified in `package.json`. See [Multiple targets](/features/targets/#multiple-targets) and [Library targets](/features/targets/#library-targets) for details.

{% migration %}
{% samplefile %}

```bash
parcel build index.js --out-file lib.js
```

{% endsamplefile %}
{% samplefile "package.json" %}

```json5/3
{
  "name": "my-library",
  "version": "1.0.0",
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

## API

Using Parcel 2 programmatically is possible through the `@parcel/core` package, rather than `parcel-bundler`. The API has changed significantly. See [Parcel API](/features/parcel-api/) for details.

### Hooking into Bundle Events

Parcel 1 let you hook in and listen to events like `buildEnd` or `buildError` using the API. The API has changed but you can still listen for events like so:

{% migration %}
{% samplefile "index.js" %}

```js/0
import Bundler from "parcel-bundler"

const bundler = new Bundler({ /* ... */ })
bundler.bundle()

bundler.on("buildEnd", () => { /* ... */ })
bundler.on("buildError", (error) => { /* ... */ })
```

{% endsamplefile %}
{% samplefile %}

```js/0
import Parcel from "@parcel/core"

const bundler = new Parcel({ /* ... */ })

bundler.watch((err, buildEvent) => {
  if (buildEvent.type === "buildSuccess") { /* ... */ }
  if (buildEvent.type === "buildFailure") { /* ... */ }
})
```

{% endsamplefile %}
{% endmigration %}

## Plugins

The plugin system has been completely changed in Parcel 2. Parcel 1 plugins are not compatible with Parcel 2. See [Plugin System](/plugin-system/overview/) for details about the Parcel 2 plugin APIs.

### Using plugins

In Parcel 1, installing plugins into your project and listing them in `package.json` dependencies enabled them automatically. In Parcel 2, plugins are configured in `.parcelrc`. See [Parcel configuration](/features/plugins/) for details.
