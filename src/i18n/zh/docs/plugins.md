# 🔌 插件

Parcel 采用与许多其它工具稍微不同的策略，许多常见的格式都被开箱即用地包含进来，而不需要安装或者配置额外的插件。然而，有些情况你可能会想在非标准的情况下扩展 Parcel 的能力，而那些时候，插件是被支持的。安装的插件会基于 `package.json` 的依赖会被自动检测并加载。

当你添加一种全新的文件格式到 Parcel，你应该先考虑它会有多通用，还有它的实现会有多标准化。如果它足够通用及标准，该格式很可能应该被添加到 Parcel 的核心，而不是作为一种用户需要安装的插件。如果你有其它的疑惑，可以到[GitHub](https://github.com/parcel-bundler/parcel/issues)一起讨论。


## 插件 API

Parcel 插件很简单。它们只是简单地将几个模块输出成一个函数，它会被 Parcel 在初始化的时候自动调用。函数接收 `Bundler` 对象作为输入，也可以做一些配置，比如注册资源类型和注册 packager。


```javascript
module.exports = function (bundler) {
  bundler.addAssetType('ext', require.resolve('./MyAsset'));
  bundler.addPackager('foo', require.resolve('./MyPackager'));
};
```

请发布这个包到 npm，并使用 `parcel-plugin-` 前缀，那它就会像后文提到的那样被自动检测和加载。

## 使用插件

在 Parcel 中使用插件是前所未有的简单。你所做的，只是将它们安装好并保存到 `package.json` 中。插件需要以 `parcel-plugin-` 作为前缀被命名。例如 `parcel-plugin-foo`。任何在 `package.json` 中被列出的带有此前缀的依赖，都会在初始化的时候被自动加载。
