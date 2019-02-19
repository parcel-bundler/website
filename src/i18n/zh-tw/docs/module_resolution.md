# 📔 模組解析

Parcel 的解析器實作了一個 [node_modules 解析](https://nodejs.org/api/modules.html#modules_all_together)的改良版演算法。

## 模組解析

除了標準演算法以外，所有 [Parcel 支援的資源類型](/assets.html)也都會被解析。

模組解析可以相對於：

- **進入點根目錄**：指定給 Parcel 作為進入點的目錄，有多個進入點時則為共享根目錄（共同父目錄）。
- **套件根目錄**：`node_modules` 中最接近模組根目錄的路徑。

### 絕對路徑

`/foo` 會將 `foo` 解析為相對於**進入點根目錄**的路徑。

### ~ 波浪號路徑

`~/foo` 會將 `foo` 解析為最接近的**套件根目錄**，找不到時則為**進入點根目錄**。

### Glob 檔案路徑

Glob 可以一次引入多個或全部檔案（`assets/*.png`），也可引入多個目錄中的檔案（`/assets/**/*`）。

下面範例打包了一個目錄中的所有 png 檔案並回傳正式的 URL。

```js
import foo from "/assets/*.png";
// {
//   'file-1': '/file-1.8e73c985.png',
//   'file-2': '/file-1.8e73c985.png'
// }
```

### package.json 中的 browser 設定

如果一個套件含有 [package.browser 欄位](https://docs.npmjs.com/files/package.json#browser)，則 Parcel 會以此設定取代 `package.main`。

### 別名

Parcel 支援以 `package.json` 中的 `alias` 欄位作為別名。

下列範例展示了如何將 `react` 對應至 `preact`，以及一些不存在於 `node_modules` 中的本地自訂模組。

```json
// package.json
{
  "name": "some-package",
  "devDependencies": {
    "parcel-bundler": "^1.7.0"
  },
  "alias": {
    "react": "preact-compat",
    "react-dom": "preact-compat",
    "local-module": "./custom/modules"
  }
}
```

因 Parcel 或其他三方工具及擴充套件都可能使用到別名，請避免在別名中使用任何特殊字元，如：

- `~` 被 Parcel 用來解析 [波浪號路徑](#~-波浪號路徑)
- `@` 被 npm 用來解析 npm 組織

我們建議你明確的定義你的別名，定義別名時**請指定副檔名**，否則將會由 Parcel 自行猜測。範例請見 [JavaScript 中命名過的 Export](#javascript-中命名過的-export) 一節。

## 常見問題

### JavaScript 中命名過的 Export

別名的對應可以套用在許多資源類型上，但不適用於 JavaScript 中命名過的 Export (named export)。若你想要使用的話可試著這麼做：

```json
// package.json
{
  "name": "some-package",
  "alias": {
    "ipcRenderer": "./electron-ipc.js" // 指定副檔名
  }
}
```

並在擁有別名的檔案中重新匯出一次：

```js
// electron-ipc.js
module.exports = require('electron').ipcRenderer
```

### Flow 的絕對與波浪號路徑解析

當使用絕對路徑或波浪號路徑解析時，你必須設定 Flow 的 [module.name_mapper](https://flow.org/en/docs/config/options/#toc-module-name-mapper-regex-string) 功能。

假設專案有下列結構：

```
package.json
.flowconfig
src/
  index.html
  index.js
  components/
    apple.js
    banana.js
```

指定 `src/index.html` 為進入點後，因其根目錄為 `/src`，若要將下列程式正確的對應，我們需要 Flow 將 `/conponents/apple` 替換為 `src/components/apple`。

```javascript
// index.js
import Apple from '/components/apple'
```

將下列設定加入 `.flowconfig` 來完成路徑轉換：

```
[options]
module.name_mapper='^\/\(.*\)$' -> '<PROJECT_ROOT>/src/\1'
```

其中的 `<PROJECT_ROOT>` 為 Flow 的特殊記號，用來取得目前 `.flowconfig` 的路徑。

註：`module.name_mapper` 可以指定多個進入點。除了[別名](#別名)外也可使用[絕對路徑](#絕對路徑)及[波浪號路徑](#~-波浪號路徑)解析。

### TypeScript 的 ~ 解析

TypeScript 需要了解你是如何使用 `~` 的模組解析及別名對應的。

詳情請參閱 [TypeScript 的 Module Resolution 文件](https://www.typescriptlang.org/docs/handbook/module-resolution.html)。

```json
// tsconfig.json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "~*": ["./src/*"]
    }
  }
}
```

### Monorepo 解析

目前 monorepo 的建議用法如下：

建議：

- 使用相對路徑
- 若需使用根目錄時，使用 `/`

不建議：

- **避免**在 monorepo 中使用 `~`

若你是 monorepo 使用者且有意分享你的建議的話，請開啟一個 issue 並附上範例 repo 以便討論。
