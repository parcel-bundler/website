# Rust

_支援的副檔名：`rs`_

[Rust](https://www.rust-lang.org) 是款由 Mozilla 開發的系統程式語言，其特點有記憶體及執行緒安全性等。Rust 近來支援了 WebAssembly 的編譯，而 Parcel 讓它簡單到**完全無須設定**即可使用！

只要將 `.rs` 用與其他檔案一樣的方式匯入 Parcel 就可以了！Parcel 假設你已經安裝了 [Rustup](https://rustup.rs)，並會**自動安裝**正確的工具鏈 (toolchain)、目標檔 (target) 及其他編譯時的必要檔案。其用法就如真的 Rust 檔案一樣，在 [Cargo](https://github.com/rust-lang/cargo) 的幫忙之下，Parcel 可以自動追蹤相依套件並進行監看，在你存檔時也會自動重新編譯。

就如同 `.wasm` 檔案一般，`.rs` 檔案可用同步或非同步的方式匯入。

```js
// 同步地匯入
import { add } from './add.rs'
console.log(add(2, 3))
// 非同步地匯入
const { add } = await import('./add.rs')
console.log(add(2, 3))
```

而在 Rust 中，你只需要確保函式為公開函式 (public function) 且無名稱修飾 (name mangling)。

```rs
#[no_mangle]
pub fn add(a: i32, b: i32) -> i32 {
  return a + b
}
```

你也可以透過匯入 `src/lib.rs` 或 `src/main.rs` 來匯入 rust 專案，Parcel 會呼叫 `cargo` 來編譯專案。

```js
import { sub } from './sub/src/lib.rs'
console.log(sub(2, 3))
```

在 `./sub/Cargo.toml` 中：

```toml
[package]
...

[dependencies]

[lib]
crate-type = ["cdylib"]
```

在 `./sub/src/lib.rs` 中：

```rust
#[no_mangle]
pub fn sub(a: i32, b: i32) -> i32 {
    a - b
}
```

詳見[此完整範例](https://github.com/parcel-bundler/examples/tree/master/rust-cargo)。
