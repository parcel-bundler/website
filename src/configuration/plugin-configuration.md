---
layout: layout.njk
eleventyNavigation:
  key: configuration-plugin-configuration
  title: 🔌 Plugin Configuration
  order: 2
summary: How to use plugins and create named pipelines
---

{% note %}
Contrary to what this page's title might suggest, this is not about configuring individual plugins, but how to tell Parcel which plugin is responsible for (among others) which file type(s).
{% endnote %}

Parcel is designed to be very modular, `@parcel/core` itself is (almost) not specific to bundling Javascript or Webpages. To actually specify the behaviour, there are different plugins (see [Plugin System](/plugin-system/overview)).

Here is an excerpt from the default config that the `parcel` CLI uses. Generally, there are three categories of plugin types (with regards to the configuration):

- only one plugin for the whole build (bundler)
- a list of plugins that run sequentially (namers/resolvers/reporters)
- the plugin(s) are specified per asset/bundle type (transformers/packagers/optimizers)
- runtimes are the exception here, because they are specified per [context](/getting-started/configuration/#targets-2).

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

- The globs for transformers are matched against the asset (input) path.
- The globs for packagers and optimizers are matched against the bundle (output) path.

### Extending configs

A common usecase is extending the default config, for this reason the `extends` field can be a config package or an array of config packages to extend.

{% sample %}
{% samplefile ".parcelrc" %}

```json/1
{
  "extends": "@parcel/config-default",
  "transformers": {
    "*.{ts,tsx}": ["@parcel/transformer-typescript-tsc"]
  }
}
```

{% endsamplefile %}
{% endsample %}

To add additional plugins without overwriting the default ones, add `"..."` to use the plugins provided by the config specified in the `extends` field. For example to add another reporter:

{% sample %}
{% samplefile ".parcelrc" %}

```json/1
{
  "extends": "@parcel/config-default",
  "reporters": ["...", "parcel-reporter-custom"]
}
```

{% endsamplefile %}
{% endsample %}


### Pipelines

The observant reader might have noticed that the last config example didn't include `@parcel/transformer-js`, which is required for `@parcel/runtime-js` and `@parcel/runtime-packager`.

This is solved with _pipelines_. A Typescript asset is first processed by the `ts` pipeline and once the `@parcel/transformer-typescript-tsc` plugin sets the asset type (which is essentially equivalent to the file extension) to `js`, Parcel reevaluates how the asset should be further processed. In this case, it will be put into the `js` pipeline specified in `@parcel/config-default`. This way, `@parcel/transformer-js` will still be executed.

{% warning %}

Once a transformer sets the asset type to a type that is not covered by the current pipeline, the asset wil either be put into a different pipeline or transformation is finished. _Transformers that should still be run afterwards according the current pipeline will not be run._

{% endwarning %}

If a transformer doesn't change the asset type and you still want to continue processing this asset, add `"..."` to continue the transformation (in an extended config). This can be useful if you want to modify an asset without changing its type and let an already-defined pipeline handle the translation/dependency registration.

{% sample  %}
{% samplefile ".parcelrc" %}

```json/3
{
  "extends": "@parcel/config-default",
  "transformers": {
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

```json/3,6
{
  "extends": "@parcel/config-default",
  "transformers": {
    "data-url:*": ["@parcel/transformer-inline-string", "..."]
  },
  "optimizers": {
    "data-url:*": ["...", "@parcel/optimizer-data-url"]
  }
}
```

{% endsamplefile %}
{% samplefile "index.js" %}

```js/2
import x from "./other.js";

new Worker("data-url:./worker.js");

// ...
```

{% endsamplefile %}
{% endsample %}

As you can see, `...` is now used to make sure that `data-url:./worker.js` will still be processed with the `js` pipeline (the named pipeline specifier only applies for the first pipeline match).

{% note %}

If you're curious how this can be achieved without a deeper integration with Parcel core:

`@parcel/transformer-inline-string` marks the asset as an inlined asset. `@parcel/packager-js` then inlines this inline bundle (as a string `"${contents}"`). This inline bundle was previously processed by `@parcel/optimizer-data-url`, which encoded the JavaScript code into a data url.

{% endnote %}

Named pipelines are currently implemented for transformers and optimizers (the named pipeline is inheirited from the entry asset).

#### Predefined (offical) named pipelines

- `data-url:` See above for an example. It isn't replaced with a URL to a new bundle but instead with an isolated data url.
- `url:` Needed when e.g. importing "normal" assets such as media files as a URL

{% sample %}
{% samplefile "index.js" %}

```js/0
import logo from "url:./logo.svg";

document.body.innerHTML = `<img src="${logo}">`;
```

{% endsamplefile %}
{% endsample %}

{% note %}

You might ask why we chose to use this explicit syntax. The reason is that this way, adding a new asset type to Parcel isn't a breaking change anymore (this happened in the past when `import foo from "./other.html"` didn't return the URL anymore, but rather the HTML contents).

It's also possible to modify the parcel config to opt into the old behaviour: see [Migration](/getting-started/migration/#importing-non-code-assets-from-javascript).

{% endnote %}

- `bundle-text:` Can be used to e.g. import a CSS (or LESS!) file's contents into Javascript (needed for some "frameworks")

{% sample %}
{% samplefile "style.less" %}

```less
@myColor: #143352;

span {
  color: @myColor;
}
```

{% endsamplefile %}
{% samplefile "index.js" %}

```js/0,9
import style from "bundle-text:./logo.less";

class MyTest extends HTMLElement {
  constructor() {
    super();

    let shadow = this.attachShadow({ mode: "open" });

    let styleSheet = document.createElement("style");
    styleSheet.textContent = style;
    shadow.appendChild(styleSheet);

    let info = document.createElement("span");
    info.textContent = this.getAttribute("label");
    shadow.appendChild(info);
  }
}

customElements.define("my-test", MyTest);
```

{% endsamplefile %}
{% endsample %}
