# 🔌 Plugins

Parcel takes a slightly different approach from many other tools in that many common formats are included out of the box without the need to install and configure additional plugins. However, there are cases where you might want to extend Parcel in a nonstandard way, and for those times, plugins are supported. Installed plugins are automatically detected and loaded based on `package.json` dependencies.

When adding support for a new file format to Parcel, you should first consider how widespread it is, and how standardized the implementation is. If it is sufficiently widespread and standard, the format should probably be added to Parcel core rather than as a plugin that users need to install. If you have any doubts, [GitHub](https://github.com/parcel-bundler/parcel/issues) is the right place to discuss.

## Plugin API

Parcel plugins are very simple. They are simply modules that export a single function, which is called by Parcel automatically during initialization. The function receives as input the `Bundler` object, and can do configuration such as registering asset types and packagers.

```javascript
module.exports = function (bundler) {
  bundler.addAssetType('ext', require.resolve('./MyAsset'));
  bundler.addPackager('foo', require.resolve('./MyPackager'));
};
```

Publish this package on npm using the `parcel-plugin-` prefix, and it will be automatically detected and loaded as described below.

## Using Plugins

Using plugins in Parcel could not be any simpler. All you need to do is install them and save in your `package.json`. Plugins should be named with the prefix `parcel-plugin-`, e.g. `parcel-plugin-foo`. Any dependencies listed in `package.json` with this prefix will be automatically loaded during initialization.
