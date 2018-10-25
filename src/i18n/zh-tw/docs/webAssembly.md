# WebAssembly

_支援的副檔名：`wasm`_

[WebAssembly](https://webassembly.org) 是個新興的技術，其對網頁的發展具有相當的影響力，目前各大瀏覽器都已對其提供支援。如同 Node.js 一樣，WebAssembly 將可增加網頁語言的多樣性，且不只限於能轉譯為 JavaScript 的語言。

C 及 Rust 等等的低階語言都能被編譯為 WebAssembly，而其作為二進制檔案格式，可減少檔案大小並提升執行速度。編譯後的 WebAssembly 程式可擁有接近原生等級的效能，與 JavaScript 相比之下通常效能較佳。不久將來我們可能就會開始看到 JavaScript 的函式庫使用 WebAssembly 來改寫效能吃重的部分。

在 Parcel 中使用 WebAssembly 再簡單不過了。若你已經有 `.wasm` 檔案，依照平常的使用方式匯入即可，或者可參考下節中更加簡便的方式。Parcel 支援同步及非同步這兩種載入方式。

```js
// 同步地匯入
import { add } from './add.wasm'
console.log(add(2, 3))
// 非同步地匯入
const { add } = await import('./add.wasm')
console.log(add(2, 3))
```

當同步地載入 `.wasm` 檔案時，Parcel 會自動產生額外的程式碼以便在執行 JavaScript bundle 之前先行載入檔案，這意味著你的二進制檔不會被當成字串而插入在 JavaScript 中，而是以獨立檔案的形式載入。如此一來你的程式仍可以同步的方式運作，Parcel 則會在前頭替你處理相依套件的載入。

這些是所有被 Parcel 內部支援啟用的 [bundle 載入器](https://github.com/parcel-bundler/parcel/pull/565)，這些執行期模組 (runtime module) 知道如何非同步的載入特定檔案格式。在先前的版本中，這些 JavaScript 及 CSS 的 bundle 載入器都是寫死的，而在 Parcel 1.5.0 版中實現了全面的可插拔 (pluggable)，因此現在可以在外掛中定義你自己的 bundle 載入器了，料將為未來的自訂二進制格式帶來許多有趣的功能，如 Glimmer 的二進制樣板等，多麽令人期待！
