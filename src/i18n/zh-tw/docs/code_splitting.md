# ✂️ 程式碼分離

Parcel 預設支援免設定的程式碼分離 (Code Splitting)，可將你的程式分割為多個 bundle 並按需載入，這意味著初始化的 bundle 更小，且載入速度更快。

當使用者瀏覽你的網頁時，Parcel 將會依照需求自動載入子 bundle。

程式碼分離由[動態的 `import()` 語法](https://github.com/tc39/proposal-dynamic-import)控制，它就像一般的 `import` 語法或 `require` 函式一樣，差別在於其回傳一個 Promise，這意味著模組可被動態地載入。

## 使用動態載入

下列的範例展示了如何在你的程式中動態載入子頁面。

```javascript
// pages/about.js
export function render() {
  // 渲染頁面
}
```

```javascript
import('./pages/about').then(function(page) {
  // 渲染頁面
  page.render()
})
```

## 使用 async/await 動態載入

因 `import()` 回傳 Promise，你也可以使用 async/await 語法，但在瀏覽器普遍支援以前，你可能需要設定 Babel 來轉譯語法。

```javascript
const page = await import('./pages/about')
// 渲染頁面
page.render()
```

在 Parcel 中，動態的 import 會被延遲載入 (Lazy Load)，所以你還是能將所有的 `import()` 放在檔案頂部，只有用到子 bundle 時才會載入。

下列的範例展示了如何在程式中動態地延遲子頁面的載入。

```javascript
// 設定頁面名稱與動態 import 之間的對應關係
// 只有在它們被用到時才會被載入
const pages = {
  about: import('./pages/about'),
  blog: import('./pages/blog')
}

async function renderPage(name) {
  // 延遲載入請求的頁面
  const page = await pages[name]
  return page.render()
}
```

**請注意：**如你你想在尚未支援的瀏覽器中使用 async/await 語法，記得在你的 app 使用 `babel-polyfill`，或在你的函式庫引入 `babel-runtime` 及 `babel-plugin-transform-runtime`。

```bash
yarn add babel-polyfill
```

```javascript
import 'babel-polyfill'
import './app'
```

請參閱 [babel-polyfill](http://babeljs.io/docs/usage/polyfill) 及 [babel-runtime](http://babeljs.io/docs/plugins/transform-runtime) 的文件。

## Bundle 解析

Parcel 會利用 [bundle-url](https://github.com/parcel-bundler/parcel/blob/master/packages/core/parcel-bundler/src/builtins/bundle-url.js) 模組來自動偵測 bundle 的位置，並使用堆疊追蹤（Stack Trace）來決定初始化 bundle 的載入路徑。這表示你不需要親自設定 bundle 要從何載入，但你必須將所有 bundle 放置於同一位置。

Parcel 目前可解析的協定有：`http`、`https`、`file`、`ftp`、`chrome-extension` 及 `moz-extension`。
