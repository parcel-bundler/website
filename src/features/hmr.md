---
layout: layout.njk
eleventyNavigation:
  key: features-hmr
  title: 🔥 Hot Module Replacement
  order: 4
summary: Refreshing your JS app without a full page reload
---

Hot Module Replacement (HMR) improves the development experience by automatically updating modules in the browser at runtime without needing a whole page refresh. This means that application state can be retained as you change small things. Parcel's HMR implementation supports both JavaScript and CSS assets.

By default, Parcel fully refreshes the page when files change. In case you're not using a framework that configures HMR already, you can manually opt into HMR (so reexecuting your JavaScript) by adding the following in your app. This will only apply in development; HMR is automatically disabled when bundling in production mode.

{% sample %}
{% samplefile "index.js" %}

```js
if (module.hot) {
  module.hot.accept();
}
```

{% endsamplefile %}
{% endsample %}

As you save files, Parcel rebuilds what changed and sends an update to any running clients containing the new code. The new code then replaces the old version, and is re-evaluated along with all parents. You can hook into this process using the `module.hot` API, which can notify your code when a module is about to be disposed, or when a new version comes in. For React, this happens automatically (see [React](</recipes/react/#hmr-(fast-refresh)>))

There are two methods to know about: `module.hot.accept` and `module.hot.dispose`. You call `module.hot.accept` with a callback function which is executed when that module or any of its dependencies are updated. `module.hot.dispose` accepts a callback which is called when that module is about to be replaced.

{% sample %}
{% samplefile "index.js" %}

```js
if (module.hot) {
  module.hot.dispose(function (data) {
    // module is about to be replaced.be
    // You can save data that should be accessible to the new asset in `data`
    data.updated = Date.now();
  });

  module.hot.accept(function (getParents) {
    let { updated } = module.hot.data;
    // module or one of its dependencies was just updated
  });
}
```

{% endsamplefile %}
{% endsample %}

## Safe Write

Some text editors and IDE's have a feature called `safe write` that basically prevents data loss, by taking a copy of the file and renaming it when saved.

When using Hot Module Reload (HMR) this feature blocks the automatic detection of file updates, to disable `safe write` use the options provided below:

- Sublime Text 3: add `atomic_save: "false"` to your user preferences.
- IntelliJ: use search in the preferences to find "safe write" and disable it.
- Vim: add `:set backupcopy=yes` to your settings.
- WebStorm: uncheck `Use "safe write"` in Preferences > Appearance & Behavior > System Settings.
- vis: add `:set savemethod inplace` to your settings.

(This functionality is provided by `@parcel/runtime-browser-hmr`.)
