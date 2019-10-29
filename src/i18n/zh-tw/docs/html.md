# HTML

_支援的副檔名：`htm` 及 `html`_

HTML 是常被提供給 Parcel 作為進入點的檔案，它也可以被 JavaScript 引用，像是提供至其他頁面的連結。

腳本檔、樣式檔、媒體檔及其它的 HTML 檔案將會用上述的方式進行提取及編譯。
HTML 中引入的連結將會被改寫使其可連結至輸出的檔案。

所有的檔名必須使用相對於目前 HTML 檔案的路徑。

```html
<html>
<body>
  <!-- 引用一張圖檔 -->
  <img src="./images/header.png">

  <a href="./other.html">連結至另外一頁</a>

  <!-- 匯入一個 JavaScript bundle -->
  <script src="./index.js"></script>
</body>
</html>
```

## 在 JacaScript 中匯入 HTML

在 JacaScript 中匯入 HTML 並不是單純匯入 HTML 字串而已，而是利用 [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) 動態地擷取 HTML 檔案。若需要支援 Internet Explorer 11 或是更舊的瀏覽器，則需要另外提供 `Promise` 和 `fetch` 的 polyfill。

## 匯入未編譯的資源

你可以在 HTML 中直接連結可被 Parcel 編譯的檔案（如：JavaScript、TypeScript 及 SCSS 等等），Parcel 將會自動處理這類檔案並更新連結以指向編譯後的資源。

```html
<html>
  <head>
    <!-- 引入一個 SCSS 檔案 -->
    <link rel="stylesheet" href="./my-styles/style.scss">
  </head>
</html>
```

# PostHTML

[PostHTML](https://github.com/posthtml/posthtml) 是款支援外掛擴充的 HTML 轉換工具。若要在 Parcel 中使用 PostHTML ，你可以建立下列其中一個設定檔：`.posthtmlrc` (JSON)、`.posthtmlrc.js` 或 `posthtml.config.js`。

首先在你的 app 中安裝外掛：

```bash
yarn add posthtml-img-autosize
```

接著建立 `.posthtmlrc`：

```json
{
  "plugins": {
    "posthtml-img-autosize": {
      "root": "./images"
    }
  }
}
```

使用外掛時需於 `plugins` 內新增一個屬性，外掛選項則為此屬性的值，並以物件形式設定。若外掛無需設定，將屬性值設定為 `true` 即可。

使用 posthtml-modules 匯入模組時，若路徑開頭為 /，則會被轉換為相對於 ./src 的路徑。

# htmlnano

當使用程式碼壓縮時，Parcel 會自動使用 [htmlnano](https://github.com/posthtml/htmlnano) 來處理所有的 HTML 資源。根據其文件，htmlnano 可以透過 `.htmlnanorc` (JSON) 或 `.htmlnanorc.js` 檔案來設定，如：

```json
{
    "removeComments": false
}
```
