# 🐠 轉換

市面上許多打包工具在轉換資源前都需要安裝並設定外掛，Parcel 則是原生支援了眾多轉換及轉譯器。你可以使用 [Babel](https://babeljs.io) 轉換 JavaScript；使用 [PostCSS](http://postcss.org) 轉換 CSS 及使用 [PostHTML](https://github.com/posthtml/posthtml) 來轉換 HTML。

Parcel 會自動搜尋模組內的設定檔，如 `.babelrc` 和 `.postcssrc`，並自動執行這些轉換，甚至還能轉換 `node_modules` 中的三方套件：若套件中有設定檔的話，Parcel 將會針對此套件進行轉換。除了 `.babelrc` 中指定的轉換以外，Parcel 還會用 Babel 來將那些新的 JavaScript 語法轉換為瀏覽器可支援的型態，詳情請見[預設的 Babel 轉換](javascript.html#預設的-babel-轉換)一節。

## 三方模組

`.babelrc` 這類的設定檔並不會套用至 `node_modules` 內的三方模組，除非模組目錄使用軟連結（在 monorepo 中常見的做法）且其 `package.json` 設定了 `source` 欄位，只有在這種情況下才會套用模組目錄內的設定檔。下列是所有支援的 `source` 類型值：

* 將所有檔案視為原始碼，不更動解析

```json
{
  "main": "foo.js",
  "source": true
}
```

* 使用原始碼編譯時，使用 bar.js 作為進入點

```json
{
  "main": "foo.js",
  "source": "bar.js"
}
```

* 使用原始碼編譯時，設定檔案別名

```json
{
  "main": "foo.js",
  "source": {
    "./foo.js": "./bar.js",
    "./baz.js": "./yay.js"
  }
}
```

* 使用原始碼編譯時，使用 glob 設定別名

```json
{
  "main": "foo.js",
  "source": {
    "./lib/**": "./src/$1"
  }
}
```

此範例的用法可讓你以 src 取代整個 lib 目錄，當匯入 my-module/lib/test.js 時，將會解析為 my-module/src/test.js。

針對那些根目錄有眾多檔案的套件，如 lodash，則你可以使用 `"**": "./src/$1"` 這種形式來取代（如：將lodash/cloneDeep 取代為 lodash/src/cloneDeep）。
