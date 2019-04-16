# JavaScript

_支援的副檔名：`js`、`jsx`、`es6`、`jsm` 及 `mjs`_

網頁打包工具中最傳統的檔案類型就是 JavaScript 了，Parcel 支援 CommonJS 及 ES6 的模組匯入語法，也支援非同步載入的動態的 `import()` 函式，詳情請見[程式碼分離](code_splitting.html)一章。另外動態載入也可從 URL 載入模組。

```javascript
// 使用 CommonJS 語法匯入模組
const dep = require('./path/to/dep')

// 使用 ES6 匯入語法匯入模組
import dep from './path/to/dep'

// 從 URL （如 CDN）動態載入模組
import('https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.11/lodash.min.js').then(() => {
  console.log(_.VERSION);
});
```

你也可以在 JavaScript 中匯入非 JavaScript 的檔案，像是 CSS、HTML 甚至是影像檔。當你匯入這些檔案時，Parcel 會將所有的相依檔案放在另外的 bundle，不像其他打包工具將檔案直接插入於行內。

當你使用 [CSS Modules](https://github.com/css-modules/css-modules) 時，匯出的類別將會置於 JavaScript bundle 內。

其餘的資源類型會在 JavaScript bundle 中匯出一個 URL ，好讓你可以在程式碼中引用這些輸出的檔案。

```javascript
// 匯入 CSS 檔案
import './test.css'

// 由 CSS 模組匯入 CSS 檔
import classNames from './test.css'

// 由 URL 匯入影像檔
import imageURL from './test.png'

// 匯入 HTML 檔案
import('./some.html')
// 或者：
import html from './some.html'
// 也可以這樣：
require('./some.html')
```

若你不想使用 URL 引入檔案，而是將檔案直接插入於行內的話，你可以透過 Node.js 的 `fs.readFileSync` API 來達成。
其中的 URL 必須是靜態可分析，意即 URL 不能包含除了 `__dirname` 及 `__filename` 以外的任何變數。

```javascript
import fs from 'fs'

// 將檔案內容讀取為文字
const string = fs.readFileSync(__dirname + '/test.txt', 'utf8')

// 將檔案內容讀取為 Buffer
const buffer = fs.readFileSync(__dirname + '/test.png')

// 將 Buffer 內容轉換為影像
;<img src={`data:image/png;base64,${buffer.toString('base64')}`} />
```

### 在 JSX 中使用影像檔

下列是在 JSX 中匯入影像檔的範例：

```js
// 匯入影像檔
import megaMan from "./images/mega-man.png";

// JSX
<img src={megaMan} title="Mega Man" alt="Mega Man" />

// JSX (使用自訂路徑)
<img src={`/dist${megaMan}`} title="Mega Man" alt="Mega Man" />
```

# Babel

[Babel](https://babeljs.io) 是款熱門且擁有龐大外掛生態系的 JavaScript 轉譯器。其使用方式跟直接執行或在其他打包工具中相同。

在你的 app 中安裝 preset 和外掛：

```shell
yarn add --dev babel-preset-react
```

接著建立 `.babelrc`：

```json
{
  "presets": ["@babel/preset-react"]
}
```

你也可以在 `package.json` 中指定 `babel` 設定

```json
"babel": {
  "presets": ["@babel/preset-react"]
}
```
注意：`package.json` 優先度大於 `.babelrc`。

## 預設的 Babel 轉換

Parcel 預設使用 `@babel/preset-env` 並轉譯你的程式碼（包含每個內部模組）以符合目標定義。

Parcel 會使用 [browserslist](https://github.com/browserslist/browserslist) 來處理 `browser` 環境。browserlist 的目標設定可在 `package.json`（`engines.browsers` 或 `browserslist`）中定義，或是使用設定檔 (`browserslist` 或 `.browserslistrc`) 來定義。

browserlist 預設的支援目標為 `> 0.25%`，也就是那些用戶多於 0.25% 的瀏覽器。

針對 `node` 環境，Parcel 則使用 `package.json` 中的 `engines.node` 設定值，此設定預設為 _node 8_。

# Flow

[flow](https://flow.org/) 是款 JavaScript 的靜態類型檢查工具。在 Parcel 中使用 Flow 相當容易，只要將 `// @flow` 置於你的 `js` 檔案的第一行即可。

Parcel 會自動安裝必要的 Babel 設定檔以將 Flow 類別從編譯後的輸出檔中剝離，因此你什麼都不需要擔心，除了兩件事：[編輯器整合](https://flow.org/en/docs/editors/)及利用 `.flowconfig` 來支援[絕對路徑的解析](module_resolution.html#flow-的絕對與波浪號路徑解析)。
