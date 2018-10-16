# 🖥 CLI

## 指令

### 啟動伺服器

啟動一個開發伺服器，並在你更動檔案時自動重新編譯 app，其也支援[熱模組替換](hmr.html)以利快速開發。

```bash
parcel index.html
```

### 編譯

一次性編譯資源，啟用程式碼壓縮並設定環境變數 `NODE_ENV` 設定為 `production`。詳情請見 [正式環境](production.html)一章。

```bash
parcel build index.html
```

### 監看

`watch` 指令與 `serve` 類似，主要差異為此指令不會啟動開發伺服器。

```bash
parcel watch index.html
```

### 幫助

顯示所有 CLI 選項。

```bash
parcel help
```

### 版本

顯示 Parcel 版本。

```bash
parcel --version
```

## 選項

### 輸入路徑

預設值： "dist"

適用指令： `serve`、`watch` 及 `build`

```bash
parcel build entry.js --out-dir build/output
# 或
parcel build entry.js -d build/output
```

```base
root
- build
- - output
- - - entry.js
```

### 設定要啟動服務的 URL

預設值：同 [`--out-dir` 選項](#output-directory)

適用指令： `serve`、`watch` 及 `build`

```bash
parcel entry.js --public-url ./dist/
```

此選項將會輸出

```html
<link rel="stylesheet" type="text/css" href="/dist/entry.1a2b3c.css">
<!-- or -->
<script src="/dist/entry.e5f6g7.js"></script>
```

### 目標

預設值： browser

適用指令： `serve`、`watch` 及 `build`

```bash
parcel build entry.js --target node
```

其他目標值：`node`、`browser` 及 `electron`

### 快取路徑

預設值： ".cache"

適用指令： `serve`、`watch` 及 `build`

```bash
parcel build entry.js --cache-dir build/cache
```

### 連接埠

預設值：1234

適用指令： `serve`

```bash
parcel serve entry.js --port 1111
```

### 變更紀錄等級

預設值：3

適用指令： `serve`、`watch` 及 `build`

```bash
parcel entry.js --log-level 1
```

| 紀錄等級 | 效果             |
|---       |---               |
| 0        | 停用紀錄         |
| 1        | 僅記錄錯誤       |
| 2        | 紀錄錯誤及警告   |
| 3        | 紀錄所有訊息     |

### 熱模組替換(HMR) 主機名稱

預設值：目前視窗的 `location.hostname` 值

適用指令： `serve` 及 `watch`

```bash
parcel entry.js --hmr-hostname parceljs.org
```

### 熱模組替換(HMR) 連接埠

預設值：隨機的可用連接埠

適用指令： `serve` 及 `watch`

```bash
parcel entry.js --hmr-port 8080
```

### 輸出檔名

預設值：原檔名

適用指令： `serve`、`watch` 及 `build`

```bash
parcel build entry.js --out-file output.html
```

這會改變入口 bundle 的檔名

### 顯示細節報告

預設：精簡報告

適用指令： `build`

```bash
parcel build entry.js --detailed-report
```

### 啟用 HTTPS

預設：停用 HTTPS

適用指令： `serve` 及 `watch` (使用 HTTPS 監聽熱模組替換之連線)

```bash
parcel build entry.js --https
```

⚠️ 此選項將會產生一個自簽憑證，你可能需要設定你的瀏覽器，使其允許本機環境中的自簽憑證。

### 設定自有憑證

預設：停用 HTTPS

適用指令： `serve` 及 `watch`

```bash
parcel entry.js --cert certificate.cert --key private.key
```

### 在瀏覽器中開啟

預設：不開啟

適用指令： `serve`

```bash
parcel entry.js --open
```

### 停用 source-maps

預設：啟用 source-maps

適用指令： `serve`、`watch` 及 `build`

```bash
parcel build entry.js --no-source-maps
```

### 停用自動安裝

預設：啟用自動安裝

適用指令： `serve` 及 `watch`

```bash
parcel entry.js --no-autoinstall
```

### 停用熱模組替換

預設：啟用熱模組替換

適用指令： `serve` 及 `watch`

```bash
parcel entry.js --no-hmr
```

### 停用程式碼壓縮

預設：啟用壓縮

適用指令： `build`

```bash
parcel build entry.js --no-minify
```

### 停用檔案系統快取

預設：啟用快取

適用指令： `serve`、`watch` 及 `build`

```bash
parcel build entry.js --no-cache
```

### 將模組匯出為 UMD

預設：停用

適用指令： `serve`、`watch` 及 `build`

```bash
parcel serve entry.js --global myvariable
```

### 啟用實驗性的 scope hoisting/tree shaking 功能

預設：停用

適用指令： `build`

```bash
parcel build entry.js --experimental-scope-hoisting
```

詳情請參閱 Devon Govett 文章的中的 [Tree Shaking](https://medium.com/@devongovett/parcel-v1-9-0-tree-shaking-2x-faster-watcher-and-more-87f2e1a70f79#4ed3)  小節。