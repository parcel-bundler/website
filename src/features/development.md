---
layout: layout.njk
title: Development
eleventyNavigation:
  key: features-development
  title: 🧑‍💻 Development
  order: 1
---

Parcel includes a development server out of the box supporting hot reloading, HTTPS, an API proxy, and more.

## Dev server

Parcel’s builtin dev server is automatically started when you run the default `parcel` command, which is a shortcut for `parcel serve`. By default, it starts a server at [http://localhost:1234](http://localhost:1234). If port `1234` is already in use, then a fallback port will be used. After Parcel starts, the location where the dev server is listening will be printed to the terminal.

The dev server supports several options, which you can specify via CLI options:

- `-p`, `--port` – Overrides the default port. The `PORT` environment variable can also be used to set the port.
- `--host` – By default, the dev server accepts connections on all interfaces. You can override this to specify that only connections from certain hosts should be accepted.
- `--open` – Automatically opens the entry in your default browser after Parcel starts. You can also pass a browser name to open a different browser, e.g. `--open safari`.

## Hot reloading

As you make changes to your code, Parcel automatically rebuilds the changed files and updates your app in the browser. By default, Parcel fully reloads the page, but in some cases it may perform Hot Module Replacement (HMR). HMR improves the development experience by updating modules in the browser at runtime without needing a whole page refresh. This means that application state can be retained as you change small things in your code.

CSS changes are automatically applied via HMR with no page reload necessary. This is also true when using a framework with HMR support built in, like React (via Fast Refresh), and Vue.

If you’re not using a framework, you can opt into HMR using the `module.hot` API. This will prevent the page from being reloaded, and instead apply the update in-place. `module.hot` is only available in development, so you'll need to check that it exists before using it.

```javascript
if (module.hot) {
  module.hot.accept();
}
```

HMR works by replacing the code for a module, and then re-evaluating it and along with all of its parents. If you need to customize this process, you can hook into it using the `module.hot.accept` and `module.hot.dispose` methods. These let you save and restore state inside the new version of the module.

`module.hot.dispose` accepts a callback which is called when that module is about to be replaced. Use it to save any state to restore in the new version of the module in the provided `data` object, or cleanup things like timers that will be re-created in the new version.

`module.hot.accept` accepts a callback function which is executed when that module or any of its dependencies are updated. You can use this to restore state from the old version of the module using the data stored in `module.hot.data`.

```javascript
if (module.hot) {
  module.hot.dispose(function (data) {
    // module is about to be replaced.
    // You can save data that should be accessible to the new asset in `data`
    data.updated = Date.now();
  });

  module.hot.accept(function (getParents) {
    // module or one of its dependencies was just updated.
    // data stored in `dispose` is available in `module.hot.data`
    let { updated } = module.hot.data;
  });
}
```

## Development target

When using the dev server, only a single target can be built at once. By default, Parcel uses a development target that supports modern browsers. This means that transpilation of modern JavaScript syntax for older browsers is disabled.

If you need to test in a older browser, you can provide the `--target` CLI option to choose which of your targets to build. For example, to build the "legacy" target defined in your package.json, use `--target legacy`. If you don't have any explicit targets defined, and only have a `browserslist` in your package.json, you can use the implicit default target with `--target default`. This will result in your source code being transpiled just as it would be in production.

See the [Targets](/features/targets/) documentation for more information.

## Lazy mode

In development, it can be frustrating to wait for your entire app to build before the dev server starts up. This is especially true when working on large apps with many pages. If you’re only working on one feature, you shouldn’t need to wait for all of the others to build unless you navigate to them.

You can use the `--lazy` CLI flag to tell Parcel to defer building files until they are requested in the browser, which can significantly reduce development build times. The server starts quickly, and when you navigate to a page for the first time, Parcel builds only the files necessary for that page. When you navigate to another page, that page will be built on demand. If you navigate back to a page that was previously built, it loads instantly.

```shell
parcel 'pages/*.html' --lazy
```

This also works with dynamic `import()`, not just separate entries. So if you have a page with a dynamically loaded feature, that feature will not be built until it is activated. When it is requested, Parcel eagerly builds all of the dependencies as well, without waiting for them to be requested.

## Caching

Parcel caches everything it builds to disk. If you restart the dev server, Parcel will only rebuild files that have changed since the last time it ran. Parcel automatically tracks all of the files, configuration, plugins, and dev dependencies that are involved in your build, and granularly invalidates the cache when something changes. For example, if you change a configuration file, all of the source files that rely on that configuration will be rebuilt.

By default, the cache is stored in the `.parcel-cache` folder inside your project. You should add this folder to your `.gitignore` (or equivalent) so that it is not committed in your repo. You can also override the location of the cache using the `--cache-dir` CLI option.

Caching can also be disabled using the `--no-cache` flag. Note that this only disables *reading* from the cache – a `.parcel-cache` folder will still be created.

## HTTPS

Sometimes, you may need to use HTTPS during development. For example, you may need to use a certain hostname for authentication cookies, or debug mixed content issues. Parcel’s dev server supports HTTPS out of the box. You can either use an automatically generated certificate, or provide your own.

To use an automatically generated self-signed certificate, use the `--https` CLI flag. The first time you load the page, you may need to manually trust this certificate in your browser.

```shell
parcel src/index.html --https
```

To use a custom certificate, you’ll need to use the `--cert` and `--key` CLI options to specify the certificate file and private key respectively.

```shell
parcel src/index.html --cert certificate.cert --key private.key
```

## API proxy

To better emulate the actual production environment when developing web apps, you can specify paths that should be proxied to another server (e.g. your real API server or a local testing server) in a `.proxyrc`, `.proxyrc.json` or `.proxyrc.js` file.

### `.proxyrc` / `.proxyrc.json`

In this JSON file, you specify an object where every key is a pattern against which the URL is matched and the value is a [`http-proxy-middleware` options](https://github.com/chimurai/http-proxy-middleware#options) object:

{% sample %}
{% samplefile ".proxyrc" %}

```js
{
  "/api": {
    "target": "http://localhost:8000/",
    "pathRewrite": {
      "^/api": ""
    }
  }
}

```

{% endsamplefile %}
{% endsample %}

This example would cause `http://localhost:1234/api/endpoint` to be proxied to `http://localhost:8000/endpoint`.

### `.proxyrc.js`

For more complex configurations, a `.proxyrc.js` file allows you to attach any [connect](https://github.com/senchalabs/connect)-compatible middleware. First, make sure you install `http-proxy-middleware` into your project. This example has the same behaviour as the `.proxyrc` version above.

{% sample %}
{% samplefile ".proxyrc.js" %}

```js
const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    createProxyMiddleware("/api", {
      target: "http://localhost:8000/",
      pathRewrite: {
        "^/api": "",
      },
    })
  );
};
```

{% endsamplefile %}
{% endsample %}

### File watcher

To support an optimal caching and development experience Parcel utilizes a very fast watcher written in C++ that integrates with low-level file watching functionality of each operating system. Using this watcher Parcel watches every file in your project root (including all `node_modules`). Based on events and metadata from these files, Parcel determines which files need to be rebuilt.

#### Known issues with file watching

##### Safe Write

Some text editors and IDE's have a feature called "safe write" that prevents data loss by taking a copy of the file and renaming it when saved. However, this feature can prevent automatic detection of file updates.

To disable safe write, use the options provided below:

- Sublime Text 3: add `atomic_save: "false"` to your user preferences.
- IntelliJ: use search in the preferences to find "safe write" and disable it.
- Vim: add `:set backupcopy=yes` to your settings.
- WebStorm: uncheck `Use "safe write"` in Preferences > Appearance & Behavior > System Settings.
- vis: add `:set savemethod inplace` to your settings.

##### Linux: No space left on device

Depending on the size of your project, and your operating system's watcher limit, this error might pop up when you're running Parcel on Linux. To resolve this issue, change the `sysctl`configuration for `fs.inotify` to have a higher value for `max_user_watches`.

You can do this by adding or changing the following lines in `/etc/sysctl.conf`:

```
fs.inotify.max_queued_events = 16384
fs.inotify.max_user_instances = 128
fs.inotify.max_user_watches = 16384
```

If this error persists you can try increasing the values even more.

##### Using Dropbox, Google Drive or other cloud storage solutions

It is best practice to not place a Parcel project in a folder that is synced to the cloud using something like Dropbox or Google Drive. These solutions create a lot of file system events that can mess with our watcher and cause unnecessary rebuilds.

## Auto install

When you use a language or plugin that isn’t included by default, Parcel will automatically install the necessary dependencies into your project for you. For example, if you include a `.sass` file, Parcel will install the `@parcel/transformer-sass` plugin. When this happens, you'll see a message in the terminal, and the new dependency will be added to the `devDependencies` in your package.json.

Parcel automatically detects which package manager you use in your project based on the lock file. For example, if `yarn.lock` is found, then Yarn will be used to install packages. If no lock file is found, then the package manager is chosen based on what is installed on your system. The following package managers are currently supported, listed in priority order:

- [Yarn](https://yarnpkg.com)
- [Pnpm](https://pnpm.io)
- [Npm](https://www.npmjs.com)

Auto install only occurs during development by default. During production builds, if a dependency is missing, the build will fail. You can also disable auto install during development using the `--no-autoinstall` CLI flag.
