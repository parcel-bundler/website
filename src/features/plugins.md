---
layout: layout.njk
title: Plugins
eleventyNavigation:
  key: features-plugins
  title: 🔌 Plugins
  order: 12
---

Parcel works out of the box for many projects with zero configuration. But if you want more control, or need to extend or override Parcel’s defaults, you can do so by creating a `.parcelrc` file in your project.

Parcel is designed to be very modular. Parcel core itself is almost not specific to building JavaScript or web pages – all behavior is specified via plugins. There are specific plugin types for each phase of a build, so you can customize just about everything.

## `.parcelrc`

Parcel configuration is specified in a `.parcelrc` file, written in JSON. Parcel looks for it in your project root (the nearest directory containing a lockfile or a `.git` directory). You can also use the `--config` CLI option to specify a different config file. If there is no `.parcelrc`, the default config is used.

<!-- TODO(v3): v2 parsed .parcelrc as JSON5 (comments, trailing commas, unquoted keys). v3 uses strict serde_json (crates/core/src/config.rs ParcelConfig::from_json), so comments/trailing commas are a parse error. Confirm this is intentional. -->

### Extending configs

Parcel’s default config is built into Parcel, and can be referenced as `@parcel/config-default`. Most of the time, you'll want to extend it in your own Parcel config. To do this, use the `extends` field in your `.parcelrc`.

{% sample %}
{% samplefile ".parcelrc" %}

```json
{
  "extends": "@parcel/config-default"
}
```

{% endsamplefile %}
{% endsample %}

You may also extend multiple configs by passing an array. Configs are merged in the order they are specified.

{% sample %}
{% samplefile ".parcelrc" %}

```json
{
  "extends": ["@parcel/config-default", "@company/parcel-config"]
}
```

{% endsamplefile %}
{% endsample %}

Other configs are resolved like dependencies, relative to the config file that extends them. This means you can extend configs published as npm packages (see [Configuration](/plugin-system/configuration/)), or reference another config in your project using a relative path.

{% sample %}
{% samplefile ".parcelrc" %}

```json
{
  "extends": "../.parcelrc"
}
```

{% endsamplefile %}
{% endsample %}

Extended configs may also extend other configs, which forms a config chain.

### Glob maps

Many fields in `.parcelrc` like `transformers` or `optimizers` use objects as maps of globs to plugin names. This lets you configure Parcel’s behavior by file extension, file path, or even a specific file name. Globs are matched against the file name, and against the file path relative to the project root.

The order of fields in glob maps defines their priority when a file name is being tested against them. This lets you configure different behavior for certain files within your project, such as files in a specific directory.

{% sample %}
{% samplefile ".parcelrc" %}

```json
{
  "transformers": {
    "icons/*.svg": ["highest-priority"],
    "*.svg": ["lowest-priority"]
  }
}
```

{% endsamplefile %}
{% endsample %}

Here if we are trying to find a transform for the file `icons/home.svg`, we'll work our way down the globs until we find a match, which would be `icons/*.svg`. We never reach `*.svg`.

Once all of the globs in the current config are checked, Parcel falls back to the globs defined in any extended configs.

### Pipelines

Many fields in `.parcelrc` like `transformers`, `optimizers`, and `reporters` accept an array of plugins which run in series. These are called **pipelines**.

If you’d like to define a higher priority pipeline that extends a lower priority one rather than overriding it, you can use the special `"..."` syntax to do so. Add this within a pipeline to embed the next priority pipeline within it. You can insert it at the beginning, end, or even in the middle of a pipeline, which gives you full control over how pipelines are extended.

{% sample %}
{% samplefile ".parcelrc" %}

```json
{
  "transformers": {
    "icons/*.svg": ["@company/parcel-transformer-svg-icons", "..."],
    "*.svg": ["@parcel/transformer-svg"]
  }
}
```

{% endsamplefile %}
{% endsample %}

In the above example, when processing `icons/home.svg`, we first run `@company/parcel-transformer-svg-icons` and then `@parcel/transformer-svg`.

This also applies to configs that have been extended. If a `"..."` is used and there are no lower priority pipelines defined in the current config, Parcel falls back to pipelines defined in the extended configs.

Since `@parcel/transformer-svg` is included in the default config, the above example could be rewritten like this:

{% sample %}
{% samplefile ".parcelrc" %}

```json
{
  "extends": "@parcel/config-default",
  "transformers": {
    "icons/*.svg": ["@company/parcel-transformer-svg-icons", "..."]
  }
}
```

{% endsamplefile %}
{% endsample %}

### Named pipelines

In addition to glob-based pipelines, Parcel supports **named pipelines**, which enable you to import a the same file in multiple ways. Named pipelines are defined in `.parcelrc` just like normal pipelines, but include a URL scheme at the start of the glob.

For example, by default, importing an image normally returns a URL to an external file, but you could use the `data-url:` named pipeline defined in the default Parcel config to inline it as a data URL instead. See [Bundle inlining](/features/bundle-inlining/) for details.

{% sample %}
{% samplefile "src/example.css" %}

```css
.logo {
  background: url(data-url:./logo.png);
}
```

{% endsamplefile %}
{% endsample %}

You can also define your own named pipelines. For example, you could define an `arraybuffer:` named pipeline that allows you to import a file as an [ArrayBuffer](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer). The `*` glob matches any file in this example, but you could also use a more-specific glob. The `"..."` syntax is used to allow Parcel to process the file as it normally would before running the `parcel-transformer-arraybuffer` plugin to convert it to an ArrayBuffer.

{% sample %}
{% samplefile ".parcelrc" %}

```json
{
  "extends": "@parcel/config-default",
  "transformers": {
    "arraybuffer:*": ["...", "parcel-transformer-arraybuffer"]
  }
}
```

{% endsamplefile %}
{% samplefile "src/example.js" %}

```javascript
import buffer from "arraybuffer:./file.png";
```

{% endsamplefile %}
{% endsample %}

Named pipelines are supported for transformer and optimizer pipelines. For transformers, the pipeline is specified in the dependency that referenced the asset. For optimizers, it is inherited from the entry asset of the bundle.

The `js:` named pipeline is special: it is used automatically when a file is imported as a JavaScript module, and there is a matching `js:` pipeline for it. The default config uses this to convert JSON, TOML, and YAML files to JavaScript only when they are imported from JavaScript. When imported in other ways, such as with a `type` import attribute or via a `url:` dependency, the original file is used instead.

{% sample %}
{% samplefile ".parcelrc" %}

```json
{
  "extends": "@parcel/config-default",
  "transformers": {
    "js:*.csv": ["parcel-transformer-csv-to-js"]
  }
}
```

{% endsamplefile %}
{% endsample %}

### Plugin configuration

Some plugins accept configuration options. To pass options to a plugin, use an object with `plugin` and `config` properties in place of the plugin name. This works anywhere a plugin name is accepted in `.parcelrc`.

{% sample %}
{% samplefile ".parcelrc" %}

```json
{
  "extends": "@parcel/config-default",
  "transformers": {
    "*.svg": [
      {
        "plugin": "@parcel/transformer-svg",
        "config": {
          "removeComments": false
        }
      }
    ]
  }
}
```

{% endsamplefile %}
{% endsample %}

To configure a plugin that is included in the default config, define a pipeline for the same files that includes the plugin along with its config, as in the above example. Don't add `"..."` in this case, otherwise the default pipeline will also run the plugin with its default options.

The available options are documented for each plugin. For example, see [JavaScript](/languages/javascript/), [CSS](/languages/css/), [SVG](/languages/svg/), and [Code splitting](/features/code-splitting/) for options supported by the built-in transformers and bundler.

## Plugins

Parcel supports many different kinds of plugins which perform a specific task as part of your build. Plugins are referenced in your `.parcelrc` using their NPM package names. Plugins may be written in JavaScript, or as native plugins written in languages like Rust, Go, or Swift. Both kinds of plugins are installed and referenced in the same way. See [Authoring plugins](/plugin-system/authoring-plugins/) for details.

### Transformers

<a href="/plugin-browser/?type=%22transformer%22&page=0&filter=%22%22&includeOfficial=false" class="npm text-sm text-gray-800 bg-red-50 hover:bg-red-100 transition group rounded px-2 py-1"><img src="/assets/npm.svg" class="h-3 inline pr-2 cursor-pointer">Find Transformer plugins</a>

[Transformer](/plugin-system/transformer/) plugins transform a single asset to compile it, discover dependencies, or convert it to a different format. They are configured using a [glob map](#glob-maps) in `.parcelrc`. Multiple transformers may run in series over the same asset using [pipelines](#pipelines), and [named pipelines](#named-pipelines) are supported to allow compiling the same file in multiple different ways within the same project. The `"..."` syntax can be used to extend the default transformers for a file.

{% sample %}
{% samplefile ".parcelrc" %}

```json
{
  "extends": "@parcel/config-default",
  "transformers": {
    "*.svg": ["...", "@parcel/transformer-svg-jsx"]
  }
}
```

{% endsamplefile %}
{% endsample %}

When compiling an asset, its file type may change. For example, when compiling TypeScript, the asset’s type changes from `ts` or `tsx` to `js`. When this happens, Parcel re-evaluates how the asset should be further processed, and runs it through the matching pipeline for `.js` files.

{% sample %}
{% samplefile ".parcelrc" %}

```json
{
  "extends": "@parcel/config-default",
  "transformers": {
    "*.{ts,tsx}": ["@company/parcel-transformer-typescript"]
  }
}
```

{% endsamplefile %}
{% endsample %}

{% warning %}

Once a transformer changes the asset type so that it no longer matches the current pipeline, the asset will be put into a different pipeline. If there is no matching pipeline for the new asset type, then transformation is finished. Transformers defined later in the current pipeline will not be run.

{% endwarning %}

### Resolvers

<a href="/plugin-browser/?type=%22resolver%22&page=0&filter=%22%22&includeOfficial=false" class="npm text-sm text-gray-800 bg-red-50 hover:bg-red-100 transition group rounded px-2 py-1"><img src="/assets/npm.svg" class="h-3 inline pr-2 cursor-pointer">Find Resolver plugins</a>

[Resolver](/plugin-system/resolver/) plugins are responsible for turning a dependency specifier into a full file path that will be processed by transformers. See [Dependency resolution](/features/dependency-resolution/) for details on how this works. Resolvers are configured using an array of plugin names in `.parcelrc`. Resolution proceeds through the list of plugins until one of them returns a result.

The `"..."` syntax can be used to extend the default resolvers. This allows you to override the resolution for certain dependencies, but fall back to the default for others. Generally, you'll want to add your custom resolvers before running the default ones.

{% sample %}
{% samplefile ".parcelrc" %}

```json
{
  "extends": "@parcel/config-default",
  "resolvers": ["@company/parcel-resolver", "..."]
}
```

{% endsamplefile %}
{% endsample %}

If `"..."` is omitted, your resolver must be able to handle all dependencies or resolution will fail.

### Bundler

The bundler is responsible for grouping assets together into bundles. Parcel includes two bundlers: `@parcel/bundler-default`, which is used by default, and `@parcel/bundler-library`, which is designed for building libraries (see [Building a library with Parcel](/getting-started/library/)). The bundler can be configured by specifying a plugin name in `.parcelrc`.

{% sample %}
{% samplefile ".parcelrc" %}

```json
{
  "extends": "@parcel/config-default",
  "bundler": "@parcel/bundler-library"
}
```

{% endsamplefile %}
{% endsample %}

See [Code splitting](/features/code-splitting/) for the options supported by `@parcel/bundler-default`.

### Namers

<a href="/plugin-browser/?type=%22namer%22&page=0&filter=%22%22&includeOfficial=false" class="npm text-sm text-gray-800 bg-red-50 hover:bg-red-100 transition group rounded px-2 py-1"><img src="/assets/npm.svg" class="h-3 inline pr-2 cursor-pointer">Find Namer plugins</a>

[Namer](/plugin-system/namer/) plugins determine the output filename for a bundle. They are configured using an array of plugin names in `.parcelrc`. Naming proceeds through the list of namers until one of them returns a result.

The `"..."` syntax can be used to extend the default namers. This allows you to override naming of certain bundles, but fall back to the default for others. Generally, you'll want to add your custom namers before running the default ones.

{% sample %}
{% samplefile ".parcelrc" %}

```json
{
  "extends": "@parcel/config-default",
  "namers": ["@company/parcel-namer", "..."]
}
```

{% endsamplefile %}
{% endsample %}

If `"..."` is omitted, your namer must be able to handle naming all bundles or the build will fail.

### Optimizers

<a href="/plugin-browser/?type=%22optimizer%22&page=0&filter=%22%22&includeOfficial=false" class="npm text-sm text-gray-800 bg-red-50 hover:bg-red-100 transition group rounded px-2 py-1"><img src="/assets/npm.svg" class="h-3 inline pr-2 cursor-pointer">Find Optimizer plugins</a>

[Optimizer](/plugin-system/optimizer/) plugins are similar to transformers but they accept a bundle instead of a single asset. They are configured using a [glob map](#glob-maps) in `.parcelrc`. Multiple optimizers may run in series over the same bundle using [pipelines](#pipelines), and [named pipelines](#named-pipelines) are supported to allow compiling the same bundle in multiple different ways within the same project. The `"..."` syntax can be used to extend the default optimizers for a bundle.

{% sample %}
{% samplefile ".parcelrc" %}

```json
{
  "extends": "@parcel/config-default",
  "optimizers": {
    "*.js": ["@company/parcel-optimizer"]
  }
}
```

{% endsamplefile %}
{% endsample %}

### Reporters

<a href="/plugin-browser/?type=%22reporter%22&page=0&filter=%22%22&includeOfficial=false" class="npm text-sm text-gray-800 bg-red-50 hover:bg-red-100 transition group rounded px-2 py-1"><img src="/assets/npm.svg" class="h-3 inline pr-2 cursor-pointer">Find Reporter plugins</a>

[Reporter](/plugin-system/reporter/) plugins receive events from Parcel as they happen throughout the build process. For example, reporters may write status information to stdout, or generate a bundle analysis report at the end of a build. Reporters are configured using an array of package names in `.parcelrc`. All reporters in this list are run for each build event. The `"..."` syntax can be used to extend the default reporters.

{% sample %}
{% samplefile ".parcelrc" %}

```json
{
  "extends": "@parcel/config-default",
  "reporters": ["...", "@company/parcel-reporter"]
}
```

{% endsamplefile %}
{% endsample %}

### Local plugins

Most parcel plugins are NPM packages. This means they have a `package.json` which declares any dependencies they may have.

Usually, Parcel plugins are published to the NPM registry, or to an internal company registry (e.g. Artifactory). This encourages plugins to be shared with the community or across projects within your company to avoid duplication.

However, when developing a plugin, it can be useful to run it directly in your project without publishing it first. There are a few ways of doing this.

#### Relative file paths

Plugins may be referenced as relative paths from the `.parcelrc` config file they are used in. These may be CommonJS or ESM modules, as determined using the `.mjs` or `.cjs` extension, or the `"type": "module"` field in the nearest package.json (the same way Node loads modules). TypeScript files are also supported. A relative path may also point to a native plugin's shared library (a `.so`, `.dylib`, or `.dll` file).

{% sample %}
{% samplefile ".parcelrc" %}

```json
{
  "extends": "@parcel/config-default",
  "transformers": {
    "*.js": ["./my-local-plugin.mjs", "..."]
  }
}
```

{% endsamplefile %}
{% endsample %}

#### Yarn and NPM workspaces

Another way to use local plugins is to use a monorepo setup via [Yarn Workspaces](https://classic.yarnpkg.com/en/docs/workspaces/) or [NPM Workspaces](https://docs.npmjs.com/cli/v7/using-npm/workspaces). This allows you to depend on other packages within your repo the same way you depend on published packages. To do this, set up a project structure like this:

```
project
├── .parcelrc
├── package.json
└── packages
    ├── app
    │   └── package.json
    └── parcel-transformer-foo
        ├── package.json
        └── src
            └── FooTransformer.js
```

In your root `package.json`, use the `workspaces` field to reference your packages.

{% sample %}
{% samplefile "package.json" %}

```json
{
  "name": "my-project",
  "private": true,
  "workspaces": ["packages/*"]
}
```

{% endsamplefile %}
{% endsample %}

Then, in your `.parcelrc` you can reference `parcel-transformer-foo` as you would a published package. Whenever you update the code for your plugin, Parcel will rebuild your project.

You can also choose to keep your app in the root (e.g. in a `src` folder) rather than inside `packages/app`.

#### The `link:` protocol

Yarn supports defining dependencies using the `link:` protocol to reference local directories as packages. For example, you could set up a project structure like this:

```
project
├── .parcelrc
├── package.json
├── src
│   └── index.html
└── parcel-transformer-foo
    ├── package.json
    └── src
        └── FooTransformer.js
```

In your root package.json, you can define a dependency on the `parcel-transformer-foo` package using the `link:` protocol.

{% sample %}
{% samplefile "package.json" %}

```json
{
  "name": "my-project",
  "dependencies": {
    "parcel": "^3.0.0",
    "parcel-transformer-foo": "link:./parcel-transformer-foo"
  }
}
```

{% endsamplefile %}
{% endsample %}

Then, in your `.parcelrc` you can reference `parcel-transformer-foo` as you would a published package. Whenever you update the code for your plugin, Parcel will rebuild your project.

#### Native plugins

Native plugin packages normally load a prebuilt shared library from a separate package for each platform. While developing a native plugin, you can point the `parcel.devLibrary` field in its `package.json` at your local build instead. Parcel loads this file in place of the published library, so your `.parcelrc` can reference the plugin by its package name, e.g. using workspaces or the `link:` protocol as described above. If the extension is omitted, the shared library extension for the current platform is added automatically.

{% sample %}
{% samplefile "parcel-transformer-foo/package.json" %}

```json
{
  "name": "parcel-transformer-foo",
  "parcel": {
    "abi": 1,
    "artifacts": {
      "aarch64-apple-darwin": "parcel-transformer-foo-darwin-arm64"
    },
    "devLibrary": "./target/debug/libparcel_transformer_foo"
  }
}
```

{% endsamplefile %}
{% endsample %}

The `devLibrary` field must not be included in published packages. Parcel’s native plugin publishing workflow removes it automatically. See [Authoring plugins](/plugin-system/authoring-plugins/) for details on building and publishing native plugins.
