---
layout: layout.njk
title: Development
eleventyNavigation:
  key: features-development
  title: 🧑‍💻 Development
  order: 1
---

Parcel includes a development server out of the box supporting hot reloading, HTTPS, single page app routing, and more.

## Dev server

Parcel’s builtin dev server is automatically started when you run the `parcel serve` command. By default, it starts a server at [http://localhost:1234](http://localhost:1234). If port `1234` is already in use, then a fallback port will be used, unless you specified the port explicitly. After Parcel starts, the location where the dev server is listening will be printed to the terminal.

The dev server supports several options, which you can specify via CLI options:

- `-p`, `--port` – Overrides the default port. The `PORT` environment variable can also be used to set the port.
- `--host` – By default, the dev server accepts connections on all interfaces. You can override this to specify that only connections from certain hosts should be accepted.
- `--open` – Automatically opens the entry in your default browser after Parcel starts. You can also pass a browser name to open a different browser, e.g. `--open safari`, or `--open=<app>` for other apps.

Like many static hosts, the dev server serves HTML pages with or without the `.html` extension, and serves the `index.html` file when a directory is requested. When the browser navigates to a URL that doesn't match a file, the dev server responds with the nearest `404.html` page if there is one, and otherwise the nearest `index.html`. This means client side routes in single page apps work without any configuration. If you set the `--public-url` option to a path, the build is served under that path.

### Build errors

When a build fails, Parcel shows the errors in an overlay in the browser, and loading a page shows the errors instead. Once you fix the errors, the overlay disappears and the page is updated.

Clicking on a file location in the error overlay opens the file in your editor. Parcel detects which editor is running automatically. You can also set the `LAUNCH_EDITOR` environment variable to the editor to use, e.g. `LAUNCH_EDITOR=code`. Otherwise, the `VISUAL` or `EDITOR` environment variables are used.

## Hot reloading

As you make changes to your code, Parcel automatically rebuilds the changed files and updates your app in the browser. By default, Parcel fully reloads the page, but in some cases it may perform Hot Module Replacement (HMR). HMR improves the development experience by updating modules in the browser at runtime without needing a whole page refresh. This means that application state can be retained as you change small things in your code.

CSS changes are automatically applied via HMR with no page reload necessary. This is also true when using a framework with HMR support built in, like React (via Fast Refresh).

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

`module.hot.accept` can also accept updates to specific dependencies instead of the module itself. Pass a dependency specifier, or an array of specifiers, as the first argument. When one of these dependencies is updated, it is re-evaluated, but the accepting module is not. Instead, the callback is called with the ids of the updated dependencies, and you can use the new versions through your imports.

```javascript
import { render } from "./render";

render();

if (module.hot) {
  module.hot.accept("./render", function () {
    // ./render.js was just updated. `render` now refers to the new version.
    render();
  });
}
```

Hot reloading also works in Node.js when using the `parcel run` command, which applies updates inside the running process, and restarts it when an update is not accepted. See the [CLI](/features/cli/) docs for more details.

## Development target

In development, Parcel builds the same [targets](/features/targets/) as in production builds. This means that if you have a `browserslist` in your package.json, your source code is transpiled for those browsers in development too, so you can test in older browsers. Optimizations such as minification are disabled by default in development.

See the [Targets](/features/targets/) documentation for more information.

## HTTPS

Sometimes, you may need to use HTTPS during development. For example, you may need to use a certain hostname for authentication cookies, or debug mixed content issues. Parcel’s dev server supports HTTPS out of the box. You can either use an automatically generated certificate, or provide your own. When HTTPS is enabled, the dev server accepts both HTTPS and HTTP connections on the same port.

To use an automatically generated certificate, use the `--https` CLI flag.

```shell
parcel serve src/index.html --https
```

Parcel creates a local certificate authority the first time you use `--https`, and uses it to sign a certificate for whichever hostname you load the page from, including `localhost` and your local network IP address. Parcel offers to add this certificate authority to your system's trust stores so that browsers trust these certificates. You can also do this at any time using the `parcel trust` command, and remove it again using `parcel trust --remove`.

The certificate authority is shared by all of your projects, so you only need to trust it once. It is stored in a `parcel` folder in your user data directory (e.g. `~/Library/Application Support/parcel` on macOS, `%LOCALAPPDATA%\parcel` on Windows, and `~/.local/share/parcel` on Linux). You can change this location by setting the `PARCEL_CAROOT` environment variable.

To use a custom certificate, you’ll need to use the `--cert` and `--key` CLI options to specify the certificate file and private key respectively, in PEM format.

```shell
parcel serve src/index.html --cert certificate.cert --key private.key
```

## File watcher

To support an optimal development experience Parcel utilizes a very fast watcher written in C++ that integrates with low-level file watching functionality of each operating system. Using this watcher Parcel watches every file in your project root (including all `node_modules`). Based on events and metadata from these files, Parcel determines which files need to be rebuilt.

### Known issues with file watching

#### Safe Write

Some text editors and IDE's have a feature called "safe write" that prevents data loss by taking a copy of the file and renaming it when saved. However, this feature can prevent automatic detection of file updates.

To disable safe write, use the options provided below:

- Sublime Text 3: add `atomic_save: "false"` to your user preferences.
- IntelliJ: use search in the preferences to find "safe write" and disable it.
- Vim: add `:set backupcopy=yes` to your settings.
- WebStorm: uncheck `Use "safe write"` in Preferences > Appearance & Behavior > System Settings.
- vis: add `:set savemethod inplace` to your settings.

#### Linux: No space left on device

Depending on the size of your project, and your operating system's watcher limit, this error might pop up when you're running Parcel on Linux. To resolve this issue, change the `sysctl`configuration for `fs.inotify` to have a higher value for `max_user_watches`.

You can do this by adding or changing the following lines in `/etc/sysctl.conf`:

```
fs.inotify.max_queued_events = 16384
fs.inotify.max_user_instances = 128
fs.inotify.max_user_watches = 16384
```

If this error persists you can try increasing the values even more.

#### Using Dropbox, Google Drive or other cloud storage solutions

It is best practice to not place a Parcel project in a folder that is synced to the cloud using something like Dropbox or Google Drive. These solutions create a lot of file system events that can mess with our watcher and cause unnecessary rebuilds.
