---
layout: layout.njk
title: Plugins
eleventyNavigation:
  key: features-plugins
  title: 🔌 Plugins
  order: 11
---

Parcel works out of the box for many projects with zero configuration. But if you want more control, or need to extend or override Parcel’s defaults, you can do so by creating a `.parcelrc` file in your project.

Parcel is designed to be very modular. Parcel core itself is almost not specific to building JavaScript or web pages – all behavior is specified via plugins. There are specific plugin types for each phase of a build, so you can customize just about everything.

## `.parcelrc`

Parcel configuration is specified in a `.parcelrc` file. It is written in [JSON5](https://json5.org), which is similar to JSON but supports comments, unquoted keys, trailing commas, and other features.

### Extending configs

Parcel’s default config is specified in `@parcel/config-default`. Most of the time, you'll want to extend it in your own Parcel config. To do this, use the `extends` field in your `.parcelrc`.

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

You can also reference another config in your project using a relative path.

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

Many fields in `.parcelrc` like `transformers` or `packagers` use objects as maps of globs to plugin names. This lets you configure Parcel’s behavior by file extension, file path, or even a specific file name. Globs are matched relative to the directory containing the `.parcelrc`.

The order of fields in glob maps maps defines their priority when a file name is being tested against them. This lets you configure different behavior for certain files within your project, such as files in a specific directory.

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

This also applies to configs that have been extended. If a  `"..."` is used and there are no lower priority pipelines defined in the current config, Parcel falls back to pipelines defined in the extended configs.

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
import buffer from 'arraybuffer:./file.png';
```

{% endsamplefile %}
{% endsample %}

Named pipelines are supported for transformer and optimizer pipelines. For transformers, the pipeline is specified in the dependency that referenced the asset. For optimizers, it is inherited from the entry asset of the bundle.

## Plugins

Parcel supports many different kinds of plugins which perform a specific task as part of your build. Plugins are referenced in your `.parcelrc` using their NPM package names.

### Transformers

[Transformer](/plugin-system/transformer/) plugins transform a single asset to compile it, discover dependencies, or convert it to a different format. They are configured using a [glob map](#glob-maps) in `.parcelrc`. Multiple transformers may run in series over the same asset using [pipelines](#pipelines), and [named pipelines](#named-pipelines) are supported to allow compiling the same file in multiple different ways within the same project. The `"..."` syntax can be used to extend the default transformers for a file.

{% sample %}
{% samplefile ".parcelrc" %}

```json
{
  "extends": "@parcel/config-default",
  "transformers": {
    "*.svg": ["...", "@parcel/transformer-svg-react"]
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
    "*.{ts,tsx}": ["@parcel/transformer-typescript-tsc"]
  }
}
```

{% endsamplefile %}
{% endsample %}

{% warning %}

Once a transformer changes the asset type so that it no longer matches the current pipeline, the asset will be put into a different pipeline. If there is no matching pipeline for the new asset type, then transformation is finished. Transformers defined later in the current pipeline will not be run.

{% endwarning %}

### Resolvers

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

### Bundler (experimental)

A [Bundler](/plugin-system/bundler/) plugin is responsible for grouping assets together into bundles. The bundler can be configured by specifying a plugin name in `.parcelrc`.

{% sample %}
{% samplefile ".parcelrc" %}

```json
{
  "extends": "@parcel/config-default",
  "bundler": "@company/parcel-bundler"
}
```

{% endsamplefile %}
{% endsample %}

{% warning %}

**Note**: Bundler plugins are experimental, and subject to change, even between minor updates.

{% endwarning %}

### Runtimes (experimental)

[Runtime](/plugin-system/runtime/) plugins allow you to inject assets into bundles. They can be configured using an array of plugin names in `.parcelrc`. All runtime plugins in this list are run over each bundle. The `"..."` syntax can be used to extend the default runtimes.

{% sample %}
{% samplefile ".parcelrc" %}

```json
{
  "extends": "@parcel/config-default",
  "runtimes": ["@company/parcel-runtime", "..."]
}
```

{% endsamplefile %}
{% endsample %}

If `"..."` is omitted, the default runtimes will not be run. This will probably break things, as many Parcel features rely on the default runtimes.

{% warning %}

**Note**: Runtime plugins are experimental, and subject to change, even between minor updates.

{% endwarning %}

### Namers

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

### Packagers

[Packager](/plugin-system/packager/) plugins are responsible for combining all of the assets in a bundle together into an output file. They are configured using a [glob map](#glob-maps) in `.parcelrc`. Globs are matched against the output filename of a bundle. A single packager plugin may be configured to run per bundle.

{% sample %}
{% samplefile ".parcelrc" %}

```json
{
  "extends": "@parcel/config-default",
  "packagers": {
    "*.{jpg,png}": "@company/parcel-packager-image-sprite"
  }
}
```

{% endsamplefile %}
{% endsample %}

### Optimizers

[Optimizer](/plugin-system/optimizer/) plugins are similar to transformers but they accept a bundle instead of a single asset. They are configured using a [glob map](#glob-maps) in `.parcelrc`. Multiple optimizers may run in series over the same bundle using [pipelines](#pipelines), and [named pipelines](#named-pipelines) are supported to allow compiling the same bundle in multiple different ways within the same project. The `"..."` syntax can be used to extend the default optimizers for a bundle.

{% sample %}
{% samplefile ".parcelrc" %}

```json
{
  "extends": "@parcel/config-default",
  "optimizers": {
    "*.js": ["@parcel/optimizer-esbuild"]
  }
}
```

{% endsamplefile %}
{% endsample %}

### Compressors

[Compressor](/plugin-system/compressor/) plugins are used when writing a final bundle to disk and may compress or encode it in some way (e.g. Gzip). They are configured using a [glob map](#glob-maps) in `.parcelrc`. Multiple compressors may run over the same bundle using [pipelines](#pipelines). Each compressor plugin produces an additional file to be written in parallel, for example `bundle.js`, `bundle.js.gz` and `bundle.js.br`. The `"..."` syntax can be used to extend the default compressors for a bundle.

{% sample %}
{% samplefile ".parcelrc" %}

```json
{
  "extends": "@parcel/config-default",
  "compressors": {
    "*.{js,html,css}": [
      "...",
      "@parcel/compressor-gzip", 
      "@parcel/compressor-brotli"
    ]
  }
}
```

{% endsamplefile %}
{% endsample %}

### Reporters

[Reporter](/plugin-system/reporter/) plugins receive events from Parcel as they happen throughout the build process. For example, reporters may write status information to stdout, run a dev server, or generate a bundle analysis report at the end of a build. Reporters are configured using an array of package names in `.parcelrc`. All reporters in this list are run for each build event. The `"..."` syntax can be used to extend the default reporters.

{% sample %}
{% samplefile ".parcelrc" %}

```json
{
  "extends": "@parcel/config-default",
  "reporters": ["...", "@parcel/reporter-bundle-analyzer"]
}
```

{% endsamplefile %}
{% endsample %}

Reporters that you use infrequently may also be specified on the [CLI](/features/cli/) using the `--reporter` option, or via the [API](/features/parcel-api/) using the `additionalReporters` option. Reporters specified in `.parcelrc` always run.

### Local plugins

Parcel plugins are NPM packages. This means they have a `package.json` which declares the version of Parcel they are compatible with, along with any dependencies they may have. They must also follow a naming system to ensure clarity.

Usually, Parcel plugins are published to the NPM registry, or to an internal company registry (e.g. Artifactory). This encourages plugins to be shared with the community or across projects within your company to avoid duplication.

However, when developing a plugin, it can be useful to run it directly in your project without publishing it first. There are a few ways of doing this.

#### Yarn and NPM workspaces

One way is to use a monorepo setup via [Yarn Workspaces](https://classic.yarnpkg.com/en/docs/workspaces/) or [NPM Workspaces](https://docs.npmjs.com/cli/v7/using-npm/workspaces). This allows you to depend on other packages within your repo the same way you depend on published packages. To do this, set up a project structure like this:

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
    "parcel": "^2.0.0",
    "parcel-transformer-foo": "link:./parcel-transformer-foo"
  }
}
```

{% endsamplefile %}
{% endsample %}

Then, in your `.parcelrc` you can reference `parcel-transformer-foo` as you would a published package. Whenever you update the code for your plugin, Parcel will rebuild your project.

