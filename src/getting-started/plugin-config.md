---
layout: layout.njk
eleventyNavigation:
  key: 🔌 Plugin Configuration
  order: 3
summary: How to use your own plugins and create named pipelines
---

{% note %}
Contrary to what this page's title might suggest, this is not about configuring individual plugins, but how to tell Parcel which plugin is responsible for (among others) which file type(s).
{% endnote %}

Parcel is designed to be very modular, `@parcel/core` itself is (almost) not specific to bundling Javascript or Webpages. To actually specify the behaviour, there are diffent plugins (see [Plugin System](</plugin-system/#list-of-plugin-types-with-a-brief-description-(in-a-somewhat-correct-order)>) for an overview).

### `.parcelrc`

Here is an excerpt from the default config that the `parcel` CLI uses. Generally, there are three categories of plugin types (with regards to the configuration):

- only one plugin for the whole build (Bundler)
- a list of plugins that run sequentially (Namer/Resolver/Reporter)
- the plugin(s) are specified per asset/bundle type (Transformer/Packager/Optimizer)
- runtimes are the exception here, because they are specified per [context](/getting-started/configuration#context) TODO LINK.

{% sample %}
{% samplefile ".parcelrc" %}

```json/3,14,17
{
  "bundler": "@parcel/bundler-default",
  "transformers": {
    "*.{js,jsx,ts,tsx}": [
      "@parcel/transformer-babel",
      "@parcel/transformer-js"
    ],
    "url:*": ["@parcel/transformer-raw"]
  },
  "namers": ["@parcel/namer-default"],
  "runtimes": {
    "browser": ["@parcel/runtime-js", "@parcel/runtime-browser-hmr"],
    "service-worker": ["@parcel/runtime-js"],
    "web-worker": ["@parcel/runtime-js"],
    "node": ["@parcel/runtime-js"]
  },
  "optimizers": {
    "*.js": ["@parcel/optimizer-terser"]
  },
  "packagers": {
    "*.html": "@parcel/packager-html",
    "*": "@parcel/packager-raw"
  },
  "resolvers": ["@parcel/resolver-default"],
  "reporters": ["@parcel/reporter-cli"]
}
```

{% endsamplefile %}
{% endsample %}

A filetype is specified by a glob which is matched against the _whole filepath_ (the _pipelines_ are matched in order of declaration), so you could use different plugins depending on the input/output filepath:

- The globs for Transformers are matched against the asset (input) path.
- The globs for Packagers and Optimizers are matched against the bundle (output) path.

### Extending configs

A common usecase is extensing the default config, for this reason the `extends` field can be a config packages or an array of config packages to extend.

{% sample %}
{% samplefile ".parcelrc" %}

```json
{
  "extends": "@parcel/config-default",
  "transforms": {
    "*.{ts,tsx}": ["@parcel/transformer-typescript-tsc"]
  }
}
```

{% endsamplefile %}
{% endsample %}

### Pipelines

The observant reader might have noticed that the last config example didn't include `@parcel/transformer-js`, which is required for `@parcel/runtime-js` and `@parcel/runtime-packager`.

This is solved with _pipelines_. A Typescript asset is first processed by the `ts` pipeline and once the `@parcel/transformer-typescript-ts` plugin sets the asset type (which is essentially equivalent to the file extension) to `js`, Parcel reevaluates how the asset should be further processed. In this case, it will be put into the `js` pipeline specified in `@parcel/config-default`. This way, `@parcel/transformer-js` will still be executed.

{% warning %}

Once a transformer sets the asset type to a type that is not covered by the current pipeline, the asset wil either be put into a different pipeline or transformation is finished. _Transformers that should still be run afterwards according the current pipeline will not be run._

{% endwarning %}

If a transformer doesn't change the asset type and you still want to continue processing this asset, add `"..."` to continue the transformation (in an extended config). This can be useful if you want to modify an asset without changing its type and let a already defined pipeline handle the translation/dependency registration.

{% sample  %}
{% samplefile ".parcelrc" %}

```json
{
  "extends": "@parcel/config-default",
  "transforms": {
    "*.js": ["parcel-transformer-add-comment", "..."]
  }
}
```

{% endsamplefile %}
{% endsample %}

### Named Pipelines

In addition to the asset type-based pipelines, there are _named pipelines_, which enable you to import a single asset type in different ways (e.g. formats).

Named pipelines are specified using a procotol-like syntax, e.g. `import myLogo from "url:./logo.png";`

Here is an example on how you achieve a url dependency that doesn't create a new bundle but is rather inlined as a data url.

{% sample undefined, "column" %}
{% samplefile ".parcelrc" %}

(_Note: this config is already contained in `@parcel/config-default`. This config is just for illustration._)

```json
{
  "extends": "@parcel/config-default",
  "transforms": {
    "data-url:*": ["@parcel/transformer-inline-string", "..."]
  },
  "optimizers": {
    "data-url:*": ["...", "@parcel/optimizer-data-url"]
  }
}
```

{% endsamplefile %}
{% samplefile "index.js" %}

```js
import x from "./other.js";

new Worker("data-url:./worker.js");

// ...
```

{% endsamplefile %}
{% endsample %}

As you can see, `...` is now used to make sure that `data-url:./worker.js` will still be processed with the `js` pipeline (the named pipeline specifier only applies for the first pipeline match).

{% note %}

If you're curious how this can be achieved wihtout a deeper integration with Parcel core:

`@parcel/transformer-inline-string` sets marks the asset to be an inlined asset. `@parcel/packager-js` then inlines this inline bundle (as a string `"${contents}"`). This inline bundle was previously processed by `@parcel/optimizer-data-url` which encodes the JS code into a data url.

{% endnote %}

#### Predefined (offical) named pipelines

- `url:` Needed when e.g. importing "normal" assets such as media files as a URL
- `bundle-text:` Can be used to e.g. import a CSS file into Javascript (needed for some component frameworks)
- `data-url:` See above, isn't replaced by an URL to a new bundle but instead an isolated data url.
