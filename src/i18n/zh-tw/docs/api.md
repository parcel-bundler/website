# 📚 API

## Bundler

除了使用 CLI 以外還能使用 API 來初始化打包工具以達成某些進階功能，如在每次編譯時執行一些自訂的流程。

下面將用一個監看 (watch) 的範例來解釋所有設定選項：

```Javascript
const Bundler = require('parcel-bundler');
const Path = require('path');

// 進入點路徑
const entryFiles = Path.join(__dirname, './index.html');
// 或者使用 glob 來指定多個檔案
// const entryFiles = './src/*.js';
// 也可使用陣列指定多個檔案
// const entryFiles = ['./src/index.html', './some/other/directory/scripts.js'];

// 打包工具選項
const options = {
  outDir: './dist', // 編譯後的檔案輸出路徑，預設為 dist
  outFile: 'index.html', // 輸出檔案名稱
  publicUrl: '/', // 靜態檔案的路徑，預設為 '/'
  watch: true, // 是否在檔案更動時自動重新編譯，預設於 process.env.NODE_ENV !== 'production' 時啟用
  cache: true, // 是否啟用快取，預設為 true
  cacheDir: '.cache', // 快取檔案目錄，預設為 .cache
  contentHash: false, // 避免檔名含有的內文雜湊值
  global: 'moduleName', // 使用此名稱匯出一個 UMD 模組，預設為停用
  minify: false, // 檔案壓縮，若 process.env.NODE_ENV 為 'production'，則會自動啟用
  scopeHoist: false, // 啟用實驗性質的 scope hoisting/tree shaking 功能，可減少 bundle 的大小
  target: 'browser', // browser/node/electron，預設為 browser
  bundleNodeModules: false, // 當 target 設定的環境為 node 及 electron 時，package.json 中的相依套件並不會被加入 bundle 中，若需包含相依套件請將本項設定為 true
  https: { // 定義一對金鑰及憑證。設定為 true 將自動產生，設定為 false 則改用 HTTP
    cert: './ssl/c.crt', // 自訂憑證路徑
    key: './ssl/k.key' // 自訂金鑰路徑
  },
  logLevel: 3,
  /*
    5 = 將所有訊息輸出至檔案
    4 = 附加時間戳記的詳盡訊息，並紀錄所有連至開發伺服器的請求
    3 = 紀錄所有訊息
    2 = 僅記錄錯誤及警告
    1 = 僅紀錄錯誤
    0 = 無紀錄
  */
  hmr: true, // 於監看模式時啟用或停用模組熱替換(HMR)
  hmrPort: 0, // 模組熱替換的 socket 連接埠，預設為一個可用的隨機連接埠（0 表示可用的隨機連接埠）
  sourceMaps: true, // 是否啟用 sourcemaps，預設為啟用（在最小化編譯中強制產生 sourcemap）
  hmrHostname: '', // 模組熱替換的域名，預設為 ''
  detailedReport: false, // 是否顯示更詳盡的報表。報表內容包括 bundle、資源、檔案大小及編譯時間等，預設為 false。報表僅在 watch 停用的情況下才會顯示
  autoInstall: true, // 是否於打包時自動安裝缺少的相依套件
};

(async function () {
  // 使用進入點路徑及選項初始化 bundler
  const bundler = new Bundler(entryFiles, options);

  // 執行 bundler 後將會回傳主 bundle
  // 使用監看模式時請使用下列的事件，此 Promise 僅會觸發一次，而非每次重新編譯時都會觸發。
  const bundle = await bundler.bundle();
})();
```

你可以透過 `bundler.serve()` 來啟動 Parcel 內建的開發伺服器。`bundler.serve()` 會呼叫 `bundler.bundle()` 並啟動一個簡易的 HTTP/HTTPS 伺服器，`serve()` 接受下列三個參數，這三個參數都非必要項，第一個為連接埠；第二為啟用 HTTPS 與否，可設定為一個如 `{cert, key}` 的物件，其設定值指向金鑰及憑證檔，也可設定為 `true` 以產生一個金鑰；第三個參數則為主機位址。

### 事件

下列是所有事件的列表

- Parcel 會在編譯完成時觸發 `bundled` 事件，並傳入 [bundle](#bundle) 實體至回呼函式。

```Javascript
const bundler = new Bundler(...);
bundler.on('bundled', (bundle) => {
  // bundler 包含所有資源及 bundle，詳見開發文件
});
// 開始編譯
bundler.bundle();
```

- 每次編譯完成後（包括重新編譯）`buildEnd` 事件會被觸發，此事件即便編譯發生錯誤仍會被觸發。

```Javascript
const bundler = new Bundler(...);
bundler.on('buildEnd', () => {
  // 做點什麼...
});
// 開始編譯
bundler.bundle();
```

- `buildStart` 事件會於首次編譯開始時被觸發，並傳入一個 `entryFiles` 陣列至回呼函式。

```Javascript
const bundler = new Bundler(...);
bundler.on('buildStart', entryPoints => {
  // 做點什麼...
});
// 開始編譯
bundler.bundle();
```

- 當編譯出錯時會觸發 `buildError` 事件，並會將 `Error` 物件傳入回呼函式

```Javascript
const bundler = new Bundler(...);
bundler.on('buildError', error => {
  // 做點什麼...
});
// 開始編譯
bundler.bundle();
```

### Bundle

Parcel 使用 `Bundle` 將所有資源打包在一起，其也包含了子系及旁系 bundle 以便編譯出 bundle 樹。

#### 屬性

- `type`：其包含的資源類型，如 js、css 或 map …等等
- `name`：bundle 名稱。由 `entryAsset` 的 `Asset.generateBundleName()` 產生
- `parentBundle`：父 bundle。若是入口 bundle 的話則為 null
- `entryAsset`：bundle 的進入點，用來產生名稱及搜集資源
- `assets`：bundle 中所有資源的集合 (`Set`)
- `childBundles`：所有子 bundle 的集合 (`Set`)
- `siblingBundles`：所有旁系 bundle 的集合 (`Set`)
- `siblingBundlesMap`：所有旁系 bundle 的對應關係 (`Map<String(Type: js, css, map, ...), Bundle>`)
- `offsets`：bundle 中所有資源位置的對應關係 (`Map<Asset, number(line number inside the bundle)>`)，用來產生準確的 source map。

#### 樹 (Tree)

`Bundle` 包含了 `parentBundle`、`childBundles` 及 `siblingBundles` 等屬性，並一起建立一個快速迭代的 bundle 樹。

下列的基本範例展示了一個資源樹及其產生的 bundle 樹：

##### 資源樹 (Asset tree)：

`index.html` 引入 `index.js` 及 `index.css`.

`index.js` 引入 `test.js` 及 `test.txt`

```Text
index.html
├── index.js
│   ├── test.js
│   └── test.txt
└── index.css
```

##### Bundle 樹 (Bundle Tree)：

`index.html` 被作為主 bundle 的進入資源，主 bundle 建立了兩個子 bundle，一個用於 `index.js`，另一個則用於 `index.css`，因其類型與 `html` 不同。

`index.js` 引入兩個檔案，`test.js` 及 `test.txt`。

`test.js` 被加入 `index.js` bundle 的資源中，因其與 `index.js` 類型相同。

`test.txt` 建立一個新 bundle 並被加入到 `index.js` bundle 之中，因其資源類型與 `index.js` 不同。

`index.css` 沒有引入資源，因此只包含其自身的入口資源。

`index.css` 及 `index.js` bundles 為旁系 bundle (siblingBundles)，因為它們共用一個父 bundle。

```Text
index.html
├── index.js ········ (包括 index.js 及 test.js)
│   └── test.txt ···· (包括 test.txt)
└── index.css ······· (包括 index.css)
```

### 中介軟體 (Middleware)

中介軟體可用來介入 HTTP 伺服器，如 `express` 和 node 的 `http`。

下列範例展示了如何在 express 中使用 Parcel 中介軟體

```Javascript
const Bundler = require('parcel-bundler');
const app = require('express')();

const file = 'index.html'; // 傳入進入點的絕對路徑
const options = {}; // 詳細介紹請見 API 文件中的選項說明區塊

// 使用檔案及選項來初始化 bundler
const bundler = new Bundler(file, options);

// 讓 express 使用 bundler 的中介軟體，如此一來 Parcel 將會處理 express 伺服器上的所有請求
app.use(bundler.middleware());

// 監聽連接埠 8080
app.listen(8080);
```
