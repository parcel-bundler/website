# Pug

_支援的副檔名：`jade` 及 `pug`_

Pug 的設定相當容易，你可以使用任一種的檔案結構。下列提供數個範例供參考。

## 範例 1：僅 index.pug

假設我們有下列的檔案結構：

```bash
.
├── package.json
└── src
    └── index.pug
```

我們可以這樣執行 Parcel：`parcel src/index.pug`。

## 範例 2：index.pug、index.js 及 style.css

假設我們有下列的檔案結構：

```bash
.
├── package.json
└── src
    ├── index.js
    ├── index.pug
    └── style.css
```

然後像平常一樣在 index.pug 中寫些樣式及 JS：

```pug
// index.pug

doctype html
html(lang="")
  head
    // ...
    link(rel="stylesheet", href="index.css")
  body
    h1 Hello

    script(src="index.js")
```

Stylus、Sass 或 LESS 也是使用一樣的方法。如果你喜歡的話，你也可以把樣式檔匯入你的 JS 裡。

接著使用一樣的指令執行 Parcel：`parcel src/index.pug`。

## 範例 3：Pug 與 locals

假設我們有下列檔案結構：

```bash
.
├── package.json
└── src
    ├── index.pug
    └── pug.config.js
```

現在我們需要從 `pug.config.js` 匯出一個 `locals` 物件。

`pug.config.js` 必須與 `index.pug` 或是 `package.json` 位於同一目錄。

```js
// pug.config.js

module.exports = {
  locals: {
    hello: "world"
  }
};
```

```pug
// index.pug

doctype html
html(lang="")
  head
    // ...
  body
    h1 #{hello}

    script(src="index.js")
```

接著以同樣的指令執行 Parcel：`parcel src/index.pug`。

### 更新 locals 物件後需重新執行 Parcel

我們無法即時看到 `locals` 物件的更動，修改此物件後請手動重新執行 `parcel src/index.pug`。

### 注意無聲的錯誤

如果你依照上面的設定，並在 Pug 中使用不存在的插值（interpolation）將不會有任何錯誤訊息。

假設我們寫了 `h1 #{thing}`，但 `thing` 並不存在於 locals，這時 Parcel 不會當掉也不會有錯誤訊息，只會在瀏覽器中顯示一片空白。

因此請確保所有東西都是正確的，否則插值無法運作時你將無從得知。

### 設定檔僅可使用三種檔名

你可以使用 `.pugrc` 或 `.pugrc.js` 來替代 `pug.config.js`，只有這三個檔名可用來設定 locals。

### pug.config.js 中無法使用 import 語法

若你想匯入其他檔案至 `pug.config.js` 中，你必須使用 require 語法。

下列範例可以正常執行：

```js
// pug.config.js

const data = require("./data.js");

module.exports = {
  locals: {
    d: data
  }
};

```

這樣則**無法**運作：

```js
import data from "./data.js";

module.exports = {
  locals: {
    d: data
  }
};
```

## 將腳本加入 package.json

```json
"scripts": {
    "dev": "parcel src/index.pug",
    "devopen": "parcel src/index.pug --open 'google chrome'",
    "build": "parcel build src/index.pug"
  },
```

使用 `npm run devopen` 可以在瀏覽器中開啟專案，執行 `npm run build` 則可產生正式環境的編譯。
