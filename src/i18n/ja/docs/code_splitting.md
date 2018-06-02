# ✂️ コード分割

Parcelは箱から出してすぐに使える設定不要のコード分割をサポートしています。これによってあなたのアプリケーションコードをいくつかのバンドルに分けて、必要なときに読み込ませることができます。初回読み込みのバンドルサイズを小さくして、高速な読み込みができるようになります。ユーザーがアプリケーション内を移動してモジュールが必要になると、Parcelは必要に応じて子バンドルを自動的にロードします。

コード分割は動的な`import()`関数の [Syntax proposal](https://github.com/tc39/proposal-dynamic-import)を使うことでコントロールできます。通常の`import`構文や`require`関数と同じように動作しますが、Promiseを返します。これは、モジュールが非同期で読み込まれることを意味します。

次の例は、動的インポートを使用して、必要に応じてアプリケーションのサブページを読み込む方法を示しています。

```javascript
// pages/about.js
export function render() {
  // ページをレンダリングする
}
```
```javascript
import('./pages/about').then(function (page) {
  // ページをレンダリングする
  page.render();
});
```

`import()`がPromiseを返すので、async/await構文を使うこともできます。ブラウザでより広くサポートされるまでは、おそらくBabelで変換するように設定する必要があります。

```javascript
const page = await import('./pages/about');
// Render page
page.render();
```

動的インポートはParcelに遅延させて読み込まれるため、あなたの`import（`呼び出しはファイルの先頭に置くことができ、子バンドルは使用されるまで読み込まれません。次の例は、アプリケーションのサブページを遅延読み込みする方法を示しています。

```javascript
// 動的なインポートにページ名のマップを設定します。
// 実際に使われるまでは読み込まれることはありません。
const pages = {
  about: import('./pages/about'),
  blog: import('./pages/blog')
};

async function renderPage(name) {
  // 必要なページを遅延させて読み込む
  const page = await pages[name];
  return page.render();
}
```

**注意：** ネイティブにサポートしていないブラウザでasync/awaitを使用する場合は、アプリケーションに `babel-polyfill`（またはライブラリに` babel-runtime` + `babel-plugin-transform-runtime`）を含めてください。

```bash
yarn add babel-polyfill
```

```javascript
import "babel-polyfill";
import "./app";
```

[babel-polyfill](http://babeljs.io/docs/usage/polyfill) と [babel-runtime](http://babeljs.io/docs/plugins/transform-runtime)のドキュメントを参照してください。
