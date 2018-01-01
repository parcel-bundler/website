# 🔥 热模块替换(HMR)

热模块替换 (HMR) 在运行时自动更新浏览器中的模块优化开发体验，无需刷新整个页面。这意味着在您代码小幅更改时可以保留应用程序的状态。Parcel 的 HMR 实现支持开箱即用的 JavaScript 和 CSS 资源。HMR 构建在生产模式下时自动禁用。

保存文件时，Parcel 将重新编译所更改的内容，并将包含新代码的更新发送到任何正在运行的客户端。新的代码会替换旧版本的代码，并与所有 parents 重新评估(译者注：此句翻译上有些奇怪，大家有更好的翻译欢迎 PR )。你可以使用 `module.hot` API 对此过程进行 hook ，编写这段代码会在你处理模块时或有新版本进入时通知您。类似项目 [react-hot-loader](https://github.com/gaearon/react-hot-loader) 可以帮助你完成该过程，并通过 Parcel 实现开箱即用。

有两种已知方法： `module.hot.accept` 和 `module.hot.dispose` 。你可以调用 `module.hot.accept` 并赋予一个回调函数，该函数会在模块或其他依赖项被更新时执行。当该模块即将被替换时，`module.hot.dispose` 回调函数会被调用。

```javascript
if (module.hot) {
  module.hot.dispose(function () {
    // 模块即将被替换时
  });

  module.hot.accept(function () {
    // 模块或其依赖项之一刚刚更新时
  });
}
```
