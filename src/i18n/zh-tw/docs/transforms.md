# 🐠 轉換

市面上許多打包工具在轉換資源前都需要安裝並設定外掛，Parcel 則是原生支援了眾多轉換及轉譯器。你可以使用 [Babel](https://babeljs.io) 轉換 JavaScript；使用 [PostCSS](http://postcss.org) 轉換 CSS 及使用 [PostHTML](https://github.com/posthtml/posthtml) 來轉換 HTML。

Parcel 會自動搜尋模組內的設定檔，如 `.babelrc` 和 `.postcssrc`，並自動執行這些轉換，甚至還能轉換 `node_modules` 中的三方套件：若套件中有設定檔的話，Parcel 將會針對此套件進行轉換。

由於 Parcel 每次僅會打包需要被轉換的套件，因此可大幅提升打包速度，這也意味著你不需要親自包含或排除那些需要被轉換的檔案，你也不需要了解三方的程式碼是如何被編譯的。

## Babel

[Babel](https://babeljs.io) 是款熱門且擁有龐大外掛生態系的 JavaScript 轉譯器。其使用方式跟直接執行或在其他打包工具中相同。

在你的 app 中安裝 preset 和外掛：

```bash
yarn add babel-preset-react
```

接著建立 `.babelrc`：

```json
{
  "presets": [
    "react"
  ]
}
```

### 預設的 Babel 轉換

Parcel 預設使用 `babel-preset-env` 轉譯程式碼，這意味著 Parcel 將轉譯所有內部 (本地的 require) 及外部 (node_modules) 的模組。

Parcel 會使用 [browserslist](https://github.com/browserslist/browserslist) 來處理 `browser` 環境。browserlist 的目標設定可在 `package.json`（`engines.browsers` 或 `browserslist`）中定義，或是使用設定檔 (`browserslist` 或 `.browserslistrc`) 來定義。

browserlist 預設的支援目標為 `> 0.25%`，也就是那些用戶多於 0.25% 的瀏覽器。

針對 `node` 環境，Parcel 則使用 `package.json` 中的 `engines.node` 設定值，此設定預設為 *node 8*。

## PostCSS

[PostCSS](http://postcss.org) 是款可以轉換 CSS 的外掛，它有如 [autoprefixer](https://github.com/postcss/autoprefixer)、[cssnext](http://cssnext.io/) 和 [CSS Modules](https://github.com/css-modules/css-modules) 等等的外掛。

若要在 Parcel 中使用 PostCSS，你需要建立下列其中一個設定檔：`.postcssrc` (JSON)、`.postcssrc.js` 或 `postcss.config.js`。

在你的 app 中安裝外掛：

```bash
yarn add postcss-modules autoprefixer
```

接著建立 `.postcssrc`：

```json
{
  "modules": true,
  "plugins": {
    "autoprefixer": {
      "grid": true
    }
  }
}
```

使用外掛時需於 `plugins` 內新增一個屬性，外掛選項則為此屬性的值，並以物件形式設定。若外掛無需設定，將屬性值設定為 `true` 即可。

針對 Autoprefixer、cssnext 及其他工具的支援瀏覽器可在 `.browserslistrc` 中設定：

```
> 1%
last 2 versions
```

在指定最外層的 `modules` 時，CSS 模組啟用方式稍有不同。因 CSS 模組會匯出一個需要被引入在 JavaScript bundle 中的物件，Parcel 需要對此特別處理。
需要注意的是，你仍須在專案中安裝 `postcss-modules`。

### 使用現有的 CSS 函式庫

為使現有的 CSS 模組可以正常運作，需要特別在它們的 `.postcssrc` 指定支援程度。

### 設定 cssnano CSS 壓縮

Parcel 會將 [cssnano](http://cssnano.co) 加入至 PostCSS 以便在正式編譯中對 CSS 進行壓縮。若需設定 cssnano 可以建立 `cssnano.config.js` 檔案：

```js
module.exports = {
  preset: ['default', {
    calc: false,
    discardComments: {
      removeAll: true,
    }
  }]
};
```

## PostHTML

[PostHTML](https://github.com/posthtml/posthtml) 是款支援外掛擴充的 HTML 轉換工具。若要在 Parcel 中使用 PostHTML ，你可以建立下列其中一個設定檔：`.posthtmlrc` (JSON)、`posthtmlrc.js` 或 `posthtml.config.js`。

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

## TypeScript

[TypeScript](https://www.typescriptlang.org/) 是個強型別語法的 JavaScript 超集合，其可支援 ES2015+ 的功能並可編譯成一般的 JavaScript。

Parcel 已內建 TypeScript 的轉換，完全無需設定。

```html
<!-- index.html -->
<html>
<body>
  <script src="./index.ts"></script>
</body>
</html>
```

```typescript
// index.ts
import message from "./message";
console.log(message);
```

```typescript
// message.ts
export default "Hello, world";
```

## ReasonML/BuckleScript

[ReasonML](https://reasonml.github.io/) 透過 [BuckleScript](https://bucklescript.github.io) 將 Ocaml 編譯成 JavaScript。

安裝相依套件及建立 `bsconfig.json` 後即可開始使用 ReasonML：

```bash
$ yarn add bs-platform --dev
```

```json
// bsconfig.json
// from https://github.com/BuckleScript/bucklescript/blob/master/jscomp/bsb/templates/basic-reason/bsconfig.json

{
  "name": "whatever",
  "sources": {
    "dir": "src",
    "subdirs": true
  },
  "package-specs": {
    "module": "commonjs",
    "in-source": true
  },
  "suffix": ".bs.js",
  "bs-dependencies": [
  ],
  "warnings": {
    "error": "+101"
  },
  "namespace": true,
  "refmt": 3
}
```

```html
<!-- index.html -->
<!doctype html>
<html>
<body>
  <script src="./src/index.re"></script>
</body>
</html>
```

```reason
/* src/index.re */
print_endline("Hello World");
```

### ReasonReact

[ReasonReact](https://reasonml.github.io/reason-react/) 讓你可在 ReasonML 中使用 React：

```bash
$ yarn add react react-dom reason-react
```

```diff
// bsconfig.json

{
  "name": "whatever",
+ "reason": {
+   "react-jsx": 2
+ },
  "sources": {
    "dir": "src",
    "subdirs": true
  },
  "package-specs": {
    "module": "commonjs",
    "in-source": true
  },
  "suffix": ".bs.js",
  "bs-dependencies": [
+   "reason-react"
  ],
  "warnings": {
    "error": "+101"
  },
  "namespace": true,
  "refmt": 3
}
```

```diff
<!-- index.html -->
<html>
<body>
+  <div id="app"></div>
  <script src="./src/index.re"></script>
</body>
</html>
```

```reason
/* src/Greeting.re */

let component = ReasonReact.statelessComponent("Greeting");

let make = (~name, _children) => {
  ...component,
  render: _self => <div> (ReasonReact.string("Hello! " ++ name)) </div>,
};
```

```reason
/* src/index.re */

ReactDOMRe.renderToElementWithId(<Greeting name="Parcel" />, "app");
```
