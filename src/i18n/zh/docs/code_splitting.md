# ✂️ 代码拆分(Code Splitting)

Parcel 支持零配置代码拆分，并且开箱即用。这允许您将应用程序的代码拆分成单独的包，这些包可以按需加载，这意味着更小的初始包大小和更短的加载时间。随着用户在应用程序中浏览相应的模块需要加载，Parcel 会自动负责按需加载子捆绑包。

代码拆分时通过使用动态 `import()` 函数的[语法提案](https://github.com/tc39/proposal-dynamic-import)来控制的，该提案与普通 `import` 语句或 `require` 函数的类似，但返回一个 Promise 对象。这意味着模块是异步加载的。

以下示例展示了如何使用动态导入(dynamic import)来按需加载应用程序的子页面。

```javascript
// pages/about.js
export function render() {
  // 渲染页面
}
```
```javascript
import('./pages/about').then(function (page) {
  // 渲染页面
  page.render();
});
```

因为 `import()` 返回一个Promise，所以你也可以使用 async/await 语法。不过，在浏览器广泛支持它之前，你可能需要配置 Babel 来转换语法。

```javascript
const page = await import('./pages/about');
// 渲染页面
page.render();
```

动态导入也会在 Parcel 中延迟加载，因此你仍然需要将所有的 `import()` 调用放在文件的顶部，并且在使用子捆绑包之前，它们不会被加载。以下示例展示如何动态地延迟加载应用程序的子页面。

```javascript
// 设置页面名称到动态引入的映射中。
// 在使用前，这些页面都不会被加载。
const pages = {
  about: import('./pages/about'),
  blog: import('./pages/blog')
};

async function renderPage(page) {
  // 懒加载请求页面。
  const page = await pages[page];
  return page.render();
}
```

**注意：** 如果你仍然想在本地浏览器中使用不支持的语法 async/await ，切记需要在你的应用程序引入 `babel-polyfill` 或在你的库中引入 `babel-runtime` + `babel-plugin-transform-runtime` 。

```bash
yarn add babel-polyfill
```

```javascript
import "babel-polyfill";
import "./app";
```

请参阅 [babel-polyfill](http://babeljs.cn/docs/usage/polyfill) 和 [babel-runtime](http://babeljs.cn/docs/plugins/transform-runtime) 的文档。
