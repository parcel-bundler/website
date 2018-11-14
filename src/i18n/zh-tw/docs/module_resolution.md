# 📔 模組解析

Parcel 自 1.7.0 版開始內建支援多重模組解析策略，你不需面對無窮無盡的 `../../` 相對路徑。

名詞解釋：

- **專案根目錄**：指定給 Parcel 作為進入點的目錄，或是有多個進入點時的共享根目錄（通用父目錄）。
- **套件根目錄**：`node_modules` 中最接近模組根目錄的路徑。

## 絕對路徑

`/foo` 會將 `foo` 解析為相對於**專案根目錄**的路徑。

## ~ 波浪號路徑

`~/foo` 會將 `foo` 解析為最接近的**套件根目錄**，找不到時則為**專案根目錄**。

## 別名

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

## 其他情況

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

Flow 需要知道如何解析絕對及波浪號路徑，我們可以在 [module.name_mapper](https://flow.org/en/docs/config/options/#toc-module-name-mapper-regex-string) 中使用正規表示式來指定模組名稱配對及替換模式。

假設專案有下列結構：

```
.flowconfig
src/
  index.js
  components/
    apple.js
    banana.js
```

若要將下列程式正確的對應

```javascript
// index.js
import Apple from '/components/apple'
// 實際上我們希望 Flow 搜尋：
// import Apple from 'src/components/apple';
```

我們可以將下列設定加入 `.flowconfig` 來將絕對路徑 `/` 對應至 `src/`：

```
[options]
module.name_mapper='^\/\(.*\)$' -> '<專案根目錄>/src/\1'
```

註：若你希望使用本地模組別名，`module.name_mapper` 也可以指定多個進入點。

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
