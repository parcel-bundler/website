# 📦 資源

Parcel 以資源(Asset)為基礎，任何類型的檔案都能是資源，而 Parcel 對某些類型的檔案有著特殊的支援，像是 JavaScript、CSS 及 HTML 檔案等，Parcel 會自動分析這些檔案的相依檔案，並於輸出的 bundle 中引入它們。

Parcel 會將相似類型的資源將輸出至同一 bundle 中，但若你匯入不同類型的資源，舉例來說，在 JS 中匯入 CSS 檔案，Parcel 則會建立一個子 bundle，並於父 bundle 中留下參考點，相關細節將於下面小節說明。

## JavaScript

網頁打包工具中最傳統的檔案類型就是 JavaScript 了，Parcel 支援 CommonJS 及 ES6 的模組匯入語法，也支援非同步載入的動態的 `import()` 函式，詳情請見 [程式碼分離](code_splitting.html) 一章。

```javascript
// 使用 CommonJS 語法匯入模組
const dep = require('./path/to/dep');

// 使用 ES6 匯入語法匯入模組
import dep from './path/to/dep';
```

你也可以在 JavaScript 中匯入非 JavaScript 的檔案，像是 CSS 甚至是影像檔。當你匯入這些檔案時，Parcel 會將所有的相依檔案放在另外的 bundle，不像其他打包工具將檔案直接插入於行內。

當你使用 [CSS Modules](https://github.com/css-modules/css-modules) 時，匯出的類別將會置於 JavaScript bundle 內。

其餘的資源類型會在 JavaScript bundle 中匯出一個 URL ，好讓你可以在程式碼中引用這些輸出的檔案。

```javascript
// 匯入 CSS 檔案
import './test.css';

// 由 CSS 模組匯入 CSS 檔
import classNames from './test.css';

// 由 URL 匯入影像檔
import imageURL from './test.png';
```

若你不想使用 URL 引入檔案，而是將檔案直接插入於行內的話，你可以透過 Node.js 的 `fs.readFileSync` API 來達成。
其中的 URL 必須是靜態可分析，意即 URL 不能包含除了 `__dirname` 及 `__filename` 以外的任何變數。

```javascript
import fs from 'fs';

// 將檔案內容讀取為文字
const string = fs.readFileSync(__dirname + '/test.txt', 'utf8');

// 將檔案內容讀取為 Buffer
const buffer = fs.readFileSync(__dirname + '/test.png');

// 將 Buffer 內容轉換為影像
<img  src={`data:image/png;base64,${buffer.toString('base64')}`}/>
```

## CSS

CSS 資源可於 JavaScript 或 HTML 檔案中被匯入，並能透過 `@import` 語法引用相依檔案，或用 `url()` 匯入影像、字型檔等等的檔案。
其他透過 `@import` 引用的 CSS 檔案將會被插入在同一個 CSS bundle 裡，而使用 `url()` 引入的檔案則會被改寫為其檔案輸出路徑。

所有檔名都必須使用相對於目前 CSS 檔案的路徑。

```css
/* 匯入另一個 CSS 檔 */
@import './other.css';

.test {
  /* 引用一張圖檔 */
  background: url('./images/background.png');
}
```

除了純 CSS 以外，Parcel 也支援其他編譯至 CSS 的語言如 LESS、SASS 及 Stylus 等。它們的執行方式與純 CSS 相同。

## SCSS
編譯 SCSS 需要先使用 npm 安裝 `sass` 模組 (JS 版本的 `dart-sass`)：
```bash
npm install sass
```
安裝 `sass` 後，你可以從 JavaScript 檔案中匯入 SCSS 檔案。
```javascript
import './custom.scss'
```
SCSS 中的相依檔案可透過 `@import` 語法使用。

## HTML

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

## 預設支援的資源類型

| 資源類型                       | 副檔名                           |
| ------------------------------ | -------------------------------- |
| JavaScript                     | `js`, `jsx`, `es6`, `jsm`, `mjs` |
| ReasonML                       | `ml`,`re`                        |
| TypeScript                     | `ts`, `tsx`                      |
| CoffeeScript                   | `coffee`                         |
| Vue                            | `vue`                            |
| JSON                           | `json`, `json5`                  |
| YAML                           | `yaml`, `yml`                    |
| TOML                           | `toml`                           |
| GraphQL                        | `gql`, `graphql`                 |
| CSS                            | `css`, `pcss`, `postcss`         |
| Stylus                         | `stylus`                         |
| LESS                           | `less`                           |
| SASS                           | `sass`, `scss`                   |
| HTML                           | `htm`, `html`                    |
| Rust                           | `rs`                             |
| WebManifest                    | `webmanifest`                    |
| OpenGL Shading Language (GLSL) | `glsl`, `vert`, `frag`           |
| Pug                            | `jade`, `pug`                    |

<sub>\* 本表可能沒有即時更新，最新的支援類型請見：[parcel/src/Parser.js](https://github.com/parcel-bundler/parcel/blob/28df546a2249b6aac1e529dd629f506ba6b0a4bb/src/Parser.js#L10)。
實際的 parser 清單請見：[parcel/src/assets/](https://github.com/parcel-bundler/parcel/tree/master/src/assets).</sub>

你可以在下列這些地方搜尋那些沒有預設支援的資源類型：

- [Yarn](https://yarnpkg.com/en/packages?q=parcel-plugin-&p=1)
- [npm](https://www.npmjs.com/search?q=parcel-plugin-)
- [awesome-parcel](https://github.com/parcel-bundler/awesome-parcel#plugins)

或者 [建立你自己的外掛](https://parceljs.org/plugins.html)。
