# ✨ 正式環境

當你準備好釋出你的程式時，可以使用 Parcel 的 production 模式來打包。

```bash
parcel build entry.js
```

## 最佳化

production 模式中會停用監看模式及模組熱替換，同時也會使用壓縮器減少所有輸出 bundle 的檔案大小，在此模式中只會進行一次編譯。Parcel 分別使用 [terser](https://github.com/fabiosantoscode/terser)、 [cssnano](http://cssnano.co) 及 [htmlnano](https://github.com/posthtml/htmlnano) 來壓縮 JavaScript、CSS 及 HTML。

使用 production 模式時環境變數 `NODE_ENV` 會被設定為 `production`。某些大型函式庫如 React，在此環境變數設定下，會停用開發時使用的除錯功能，因此輸出的檔案會更小，編譯速度也隨之提高。

若想使用一些開發模式中的除錯功能，請先確保 terser 中的 [dead_code 選項](https://github.com/terser-js/terser#compress-options)是啟用的（預設即為啟用），並將開發時的除錯程式碼放進如下的檢查式中：

```js
if (process.env.NODE_ENV === 'development') { // 或 `process.env.NODE_ENV !== 'production'`
  // 僅在開發環境中執行，並會在正式編譯中被移除
}
```

## 檔案命名策略

為讓你的 CDN 能因效能最佳化而設定更激進的快取規則，大多數 bundle 的檔名都會含有雜湊值（這主要透過 bundle 是否該有個好讀或好記的檔名來決定，通常在 SEO 中才會用到）。

Parcel 用下表列出的方式命名 bundle（進入點永遠不會經過雜湊）

|                Bundle 類型 | 類型                   | 內容經過雜湊 |
| -------------------------: | ---------------------- | :----------: |
|                   任何類型 | 進入點                 |      ❌      |
|                 JavaScript | `<script>`             |      ✅      |
|                 JavaScript | 動態 import            |      ❌      |
|                 JavaScript | Service worker         |      ❌      |
|                       HTML | iframe                 |      ❌      |
|                       HTML | 連結錨點 (anchor link) |      ❌      |
| 原始檔 (影像及文字檔…等等) | Import/Require/...     |      ✅      |

檔案的雜湊則遵循下列命名規則：

`<目錄名稱>-<雜湊值>.<副檔名>`

## 跨平台時的地雷

在最佳化 production 環境的編譯效能時，Parcel 會使用 [physical-cpu-count](https://www.npmjs.com/package/physical-cpu-count) 來偵測主機 CPU 的可用核心數，並依結果分配任務至各核心。

需特別注意的是，此套件假設你的系統中已經有 [`lscpu`](http://manpages.courier-mta.org/htmlman1/lscpu.1.html) 這支程式。

## 使用 CI 時

若你想在你的 CI（持續整合，Continuous Integration）系統中使用 Parcel 的話，則需要將 Parcel 安裝為本地套件。

詳細步驟說明請參考[此文件](getting_started.html#將-parcel-加入至你的專案)。
