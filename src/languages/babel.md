---
layout: layout.njk
eleventyNavigation:
  key: languages-babel
  title: <img src="/assets/lang-icons/javascript.svg" alt=""/> JavaScript (Babel)
  order: 1
---

## Dependencies

TODO: require, import, require.resolve, import(), navigator.serviceWorker, new Worker, new SharedWorker, preloading

## Babel

Without a custom Babel config, Babel only runs if you have a browserslist config of some kind (in that case, `@babel/preset-env` is used) or use non-standard syntax (JSX, TypeScript, Flow).

Files in `node_modules` are not processed with Babel.

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

If you use React, TypeScript or Flow, you'll need to add `@babel/preset-react`, `@babel/plugin-transform-flow-strip-types` and `@babel/plugin-transform-typescript` yourself, respectively.

Using `@babel/preset-env` directly usually causes problems with scope hoisting (broken builds or large bundles) because Babel will have transpiled away ES modules into CommonJS modules.

(This functionality is provided by `@parcel/transformer-babel`)
