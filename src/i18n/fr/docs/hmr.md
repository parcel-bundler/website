# 🔥 Hot Module Replacement

Hot Module Replacement (HMR) improves the development experience by automatically updating modules in the browser at runtime without needing a whole page refresh. This means that application state can be retained as you change small things. Parcel's HMR implementation supports both JavaScript and CSS assets out of the box. HMR is automatically disabled when bundling in production mode.

As you save files, Parcel rebuilds what changed and sends an update to any running clients containing the new code. The new code then replaces the old version, and is re-evaluated along with all parents. You can hook into this process using the `module.hot` API, which can notify your code when a module is about to be disposed, or when a new version comes in. Projects like [react-hot-loader](https://github.com/gaearon/react-hot-loader) can help with this process, and work out of the box with Parcel.

There are two methods to know about: `module.hot.accept` and `module.hot.dispose`. You call `module.hot.accept` with a callback function which is executed when that module or any of its dependencies are updated. `module.hot.dispose` accepts a callback which is called when that module is about to be replaced.

```javascript
if (module.hot) {
  module.hot.dispose(function () {
    // module is about to be replaced
  });

  module.hot.accept(function () {
    // module or one of its dependencies was just updated
  });
}
```

## Safe Write
Some text editors and IDE's have a feature called `safe write` this basically prevents data loss, by taking a copy of the file and renaming it when saved.

When using Hot Module Reload (HMR) this feature blocks the automatic detection of file updates, to disable `safe write` use the options provided below:

* `Sublime Text 3` add atomic_save: "false" to your user preferences.
* `IntelliJ` use search in the preferences to find "safe write" and disable it.
* `Vim` add :set backupcopy=yes to your settings.
* `WebStorm` uncheck Use "safe write" in Preferences > Appearance & Behavior > System Settings.
