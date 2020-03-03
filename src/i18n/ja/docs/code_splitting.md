# ✂️ Code Splitting（コード分割）

Parcel はゼロコンフィグのコード分割をサポートしています。これによりコードを別々のバンドルに分割し、必要に応じて読み込むことができます。つまり初期バンドルサイズが小さくなり、ロード時間が短縮されます。

コード分割は動的な `import()` 関数の[構文提案](https://github.com/tc39/proposal-dynamic-import)によって定められており、普通の `import` 宣言や `require` 関数ではありますが、 Promise を返します。つまり、このモジュールは非同期に読み込まれるということです。

## Using dynamic imports

次の例は要求に応じて別ページを動的インポートする方法を示しています。

```javascript
// pages/about.js
export function render() {
  // Render the page
}
```

```javascript
import('./pages/about').then(function(page) {
  // Render page
  page.render()
})
```

## Dynamic imports with async/await

`import()` が Promise を返すため、 async/await 構文を利用することもできます。幅広いブラウザがこの構文をサポートするまでは Babel でトランスパイルを行う必要があるでしょう。

```javascript
const page = await import('./pages/about')
// Render page
page.render()
```

動的インポートにより Parcel で遅延読み込みをすることができます。つまり `import()` をファイルの先頭で呼び出してもそれらが使われるまでは子要素は読み込まれません。次の例は、アプリケーションの別ページを動的に遅延読み込みする方法を示しています。

```javascript
// 動的インポートするページを設定します
// これらは呼び出されるまで読み込まれません
const pages = {
  about: import('./pages/about'),
  blog: import('./pages/blog')
}

async function renderPage(name) {
  // 要求されたページを遅延読み込みします
  const page = await pages[name]
  return page.render()
}
```

**注意:** もしも async/await が公式にサポートされていないブラウザで利用したい場合は `babel-polyfill` のライブラリ内にある `babel-runtime` + `babel-plugin-transform-runtime` をアプリケーションに含めるのを覚えておいて下さい。

```bash
yarn add babel-polyfill
```

```javascript
import 'babel-polyfill'
import './app'
```

詳細は [babel-polyfill](http://babeljs.io/docs/usage/polyfill) と [babel-runtime](http://babeljs.io/docs/plugins/transform-runtime) のドキュメントをお読み下さい。

## Bundle resolution

Parcel は自動的にバンドルを区切る位置を決定します。これには [bundle-url](https://github.com/parcel-bundler/parcel/blob/master/packages/core/parcel-bundler/src/builtins/bundle-url.js) モジュールと初期バンドルがどこのパスで読み込まれるのかを決定するスタックトレースを利用しています。

これにより、どこから読み込まれるべきかを設定する必要はなく、必ず同じ位置からそのバンドルが serve されていることを意味しています。

Parcel は現在次のプロトコルのバンドルを解決しています: `http`, `https`, `file`, `ftp`, `chrome-extension`, `moz-extension`
