---
layout: layout.njk
eleventyNavigation:
  key: languages-babel
  title: <img src="/assets/lang-icons/javascript.svg" alt=""/> JavaScript (Babel)
  order: 1
---

## Dependencies

To retrieve the final (and hashed) URL of assets (images, videos, ...), you can either use `new URL("file.mp4", import.meta.url)` (which is the recommended way as it also works in modern browsers without bundling and because it's also picked up by Webpack):

{% sample %}
{% samplefile %}

```js/1
var img = document.createElement("img");
img.src = new URL("file.mp4", import.meta.url);
document.body.appendChild(p);
```

{% endsamplefile %}
{% endsample %}

or using `import src from "url:./file.mp4";` (though `url:` is optional for the popular image formats).

Parcel also recognizes `require`, `require.resolve`, `import`, `import()`, `navigator.serviceWorker`, `new Worker` and `new SharedWorker`.

## Transpilation

If you specify a browserslist config, Parcel automatically transpiles your source code (so not files in `node_modules`) according to these targets.

## Babel

Babel only runs if you have custom Babel config or use Flow (TypeScript and React is supported via swc). Files in `node_modules` are not processed with Babel.

### Caching

To not opt out of caching, you should:

- avoid Javascript config files (`.babelrc.js` and `babel.config.js`). Use the JSON versions instead (`.babelrc` or `babel.config.json`).
- avoid relative/local Babel plugins (this includes using a Babel plugin from the same monorepo).

### Extending the default Babel config

Parcel doesn't modify your Babel config, so if you want to add a Babel plugin, you'll need to replicate the default configuration:

{% sample %}
{% samplefile ".babelrc" %}

```json
{
  "presets": ["@parcel/babel-preset-env"],
  "plugins": ["@parcel/babel-plugin-transform-runtime"]
}
```

{% endsamplefile %}
{% endsample %}

These two are wrappers of their Babel conterparts that enable Parcel to set the target browsers based on the Parcel configuration (e.g. target specific environment, dual module/nomodule transpilation, not transpiling ES modules with scope hoisting). You can still pass the same options to these presets/plugins as to `@babel/preset-env` and `@babel/plugin-transform-runtime`.

If you use React, TypeScript or Flow, you'll need to add `@babel/preset-react`, `@babel/plugin-transform-typescript`, and `@babel/plugin-transform-flow-strip-types` yourself, respectively.

Using `@babel/preset-env` directly usually causes problems with scope hoisting (broken builds or large bundles) because Babel will have transpiled away ES modules into CommonJS modules.

(This functionality is provided by `@parcel/transformer-babel` and `@parcel/transformer-js`)
