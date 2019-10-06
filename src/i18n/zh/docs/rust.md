# Rust

_支持扩展类型: `rs`_

[Rust](https://www.rust-lang.org)是一个由 Mozilla 开发的系统级编程语言，在一些内存和安全线程方面拥有近原生的性能。Rust 最近支持了编译成 WebAssembly，而现在 Parcel 让它**超级简单**零配置地开始使用。

只需要像其他资源那样导入`.rs`文件，假设你已经安装了[Rustup](https://rustup.rs)，Parcel 会**自动安装**正确的工具链(toolchain)，目标文件(target)，和其他的编译时必备的依赖。在[Cargo](https://github.com/rust-lang/cargo)的帮助下，不但能直接拿到 Rust 源文件，而且可以自动追踪文件依赖，在保存的时候会重新构建。

如同`.wasm`文件，`.rs`文件可以被异步或同步导入。

```js
// 同步导入
import { add } from './add.rs'
console.log(add(2, 3))
// 异步导入
const { add } = await import('./add.rs')
console.log(add(2, 3))
```

在 Rust 侧，你只需要确保函数名不是 mangled 而且函数是 public 的即可。

```rs
#[no_mangle]
pub fn add(a: i32, b: i32) -> i32 {
  return a + b
}
```

你也可以通过导入`src/lib.rs`或`src/main.rs`来导入rust项目。此时，Parcel会调用`cargo`而不是`rustc`进行编译。

```js
import { sub } from './sub/src/lib.rs'
console.log(sub(2, 3))
```

在`./sub/Cargo.toml`中：
```toml
[package]
...

[lib]
crate-type = ["cdylib"]

[dependencies]
wasm-bindgen = "0.2"
```

在`./sub/src/lib.rs`中：
```rust
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn sub(a: i32, b: i32) -> i32 {
    a - b
}
```
