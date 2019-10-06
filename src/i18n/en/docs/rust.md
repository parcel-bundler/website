# Rust

_Supported extensions: `rs`_

[Rust](https://www.rust-lang.org) is a systems programming language developed by Mozilla, which offers native performance with some interesting memory and thread safety characteristics. Rust recently added support for compiling to WebAssembly, and now Parcel makes it **super easy** to get started with zero configuration!

You can now simply import `.rs` files just like any other file type in Parcel! Assuming you have [Rustup](https://rustup.rs) installed, Parcel **automatically takes care of installing** the right toolchains, targets, and other build pre-requisites. It works with [Cargo](https://github.com/rust-lang/cargo) projects, as well as straight-up Rust source files, automatically tracks your dependencies so **files are watched** and rebuilds happen when you save, and more!

Just like with `.wasm` files, `.rs` files can be imported with either synchronous or asynchonous imports.

```js
// synchronous import
import { add } from './add.rs'
console.log(add(2, 3))
// asynchronous import
const { add } = await import('./add.rs')
console.log(add(2, 3))
```

On the Rust side, you just need to make sure that function names aren’t mangled and are public.

```rs
#[no_mangle]
pub fn add(a: i32, b: i32) -> i32 {
  return a + b
}
```

You can also import rust project by importing `src/lib.rs` or `src/main.rs`, Parcel will call `cargo` to build the project.

```js
import { sub } from './sub/src/lib.rs'
console.log(sub(2, 3))
```

in `./sub/Cargo.toml`:

```toml
[package]
...

[dependencies]

[lib]
crate-type = ["cdylib"]
```

in `./sub/src/lib.rs`:

```rust
#[no_mangle]
pub fn sub(a: i32, b: i32) -> i32 {
    a - b
}
```

See also [this complete example.](https://github.com/parcel-bundler/examples/tree/master/rust-cargo)
