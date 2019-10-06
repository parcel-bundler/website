# 🔥 热模块重载(HMR)

热模块重载 (HMR) 在运行时自动更新浏览器中的模块优化开发体验，无需刷新整个页面。这意味着在您代码小幅更改时可以保留应用程序的状态。Parcel 的 HMR 实现支持开箱即用的 JavaScript 和 CSS 资源。HMR 构建在生产模式下时自动禁用。

保存文件时，Parcel 将重新编译所更改的内容，并将包含新代码的更新发送到任何正在运行的客户端。新的代码会替换旧版本的代码并执行，其所有父模块代码也会重新执行。你可以使用 `module.hot` API 对此过程进行 hook ，编写这段代码会在你处理模块时或有新版本进入时通知您。类似项目 [react-hot-loader](https://github.com/gaearon/react-hot-loader) 可以帮助你完成该过程，并通过 Parcel 实现开箱即用。

有两种已知方法： `module.hot.accept` 和 `module.hot.dispose` 。你可以调用 `module.hot.accept` 并赋予一个回调函数，该函数会在模块或其他依赖项被更新时执行。当该模块即将被替换时，`module.hot.dispose` 回调函数会被调用。

```javascript
if (module.hot) {
  module.hot.dispose(function() {
    // 模块即将被替换时
  })

  module.hot.accept(function() {
    // 模块或其依赖项之一刚刚更新时
  })
}
```

## 自动安装依赖项

每当 Parcel 遇到符合 node_module 模式且无法找到它的依赖项时，Parcel 会尝试使用 yarn 或 npm 安装此依赖项这取决于是否找到 yarn.lock 文件。这可以避免开发人员不得不退出 parcel 或打开多个终端窗口来安装依赖。

这只会在 _development_ 模式下触发（使用 [`serve`](cli.md#serve) 或 [`watch`](cli.md#watch)），然而在生产模式是禁止的（使用[`build`](cli.md#build)）这样避免在部署的时候产生意想不到的副作用。

你可以禁止使用这个特性 [`--no-autoinstall`](cli.md#disable-autoinstall)。

## 安全写入(Safe Write)

一些文本编辑器和 IDE 均有`安全写入`的功能，这基本上可以防止数据丢失，通过获取文本的副本并在保存时对其进行重命名操作。

当使用热模块重载 (HMR) 时，此功能会阻止文件更新的自动检测，要禁用`安全写入`，请使用下列提供的选项:

- `Sublime Text 3` 将 atomic_save: "false" 添加到你用户设置中。
- `IntelliJ` 在设置中使用搜索来查找 "safe write" 并将其禁用。
- `Vim` 添加 :set backupcopy=yes 到你的设置中.
- `WebStorm` 在 Preferences > Appearance & Behavior > System Settings 中取消选中 "safe write" 选项。
