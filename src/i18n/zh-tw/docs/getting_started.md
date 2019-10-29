# 🚀 開始使用

Parcel 是款網頁打包工具，憑藉其開發者體驗脫穎而出。它利用多核心處理來達成極速編譯，且完全無須設定。

首先使用 Yarn 或 npm 安裝 Parcel：

Yarn:

```bash
yarn global add parcel-bundler
```

npm:

```bash
npm install -g parcel-bundler
```

在你的專案中建立 package.json 檔案：

```bash
yarn init -y
```

或

```bash
npm init -y
```

Parcel 可將任何類型的檔案視為進入點，但 HTML 或 JavaScript 會是較好的選擇。

如果你在 HTML 中使用相對路徑引入主要的 JavaScript 檔案，Parcel 將會在輸出的檔案中自動替換這些路徑。

下一步，建立 index.html 及 index.js。

```html
<html>
<body>
  <script src="./index.js"></script>
</body>
</html>
```

注意：Parcel 會將 JavaScript 轉換為 ES5，因此在你的 HTML 沒有必要使用 `<script type="module">`，使用 `<script>` 即可。

```javascript
console.log('hello world')
```

Parcel 內建了開發專用的伺服器，在你更動檔案的同時會自動重新編譯你的 app，並啟用[模組熱替換](hmr.html)以提高開發效率，你只需要指定進入點：

```bash
parcel index.html
```

接著在瀏覽器中打開 http://localhost:1234/。

若模組熱替換無法正常運作，你可能需要[設定你的編輯器](hmr.html#safe-write)。你也可以使用 `-p <port number>` 選項來覆寫預設連接埠。

開發專用的伺服器建議只在沒有自有伺服器及純前端 app 的情況下才使用。若你已有伺服器，可使用 Parcel 的 `watch` 模式，此模式仍有自動重新編譯及模組熱替換的功能，但不會啟動網頁伺服器。

```bash
parcel watch index.html
```

你也可以利用 [createapp.dev](https://createapp.dev/parcel) 來建立 Parcel 專案，網頁會在你選擇功能（React、Vue、Typescript 和 CSS 等等）的同時產生專案。透過這個工具你可以學習如何建立新專案，也可以將建立好的專案下載為 ZIP 檔。

### 多個進入點

若你有多個進入點，假設分別是 `index.html` 及 `about.html`，你有兩種方式可以啟動打包工具：

指定檔案名稱：

```bash
parcel index.html about.html
```

或使用 token 並建立一個 glob：

```bash
parcel *.html
```

_注意：_ 若你有類似這樣的檔案架構：

```
- folder-1
-- index.html
- folder-2
-- index.html
```

在這種情況下是無法連線到 http://localhost:1234/folder-1/ 的，你需要明確的指定至檔案才行，如：http://localhost:1234/folder-1/index.html。

### 編譯正式環境版本

當你準備好部署至正式環境時，`build` 模式會關閉檔案監視且僅會編譯一次，詳情請見[正式環境](production.html) 一章。

## 將 Parcel 加入至你的專案

在某些情境下你可能無法使用全域的 Parcel，例如你在他人的機器上編譯時或者你想使用 CI 來自動化你的編譯，這時你就可以將 Parcel 安裝為本地的套件。

使用 yarn 安裝：

```bash
yarn add parcel-bundler --dev
```

使用 NPM 安裝：

```bash
npm install parcel-bundler --save-dev
```

接著將下列腳本加入你的 `package.json` 中：

```json
{
  "scripts": {
    "dev": "parcel <你的進入點>",
    "build": "parcel build <你的進入點>"
  }
}
```

最後，你就可以使用下列指令執行：

```bash
# 執行開發模式
yarn dev
# 或
npm run dev

# 執行正式模式
yarn build
# 或
npm run build
```
