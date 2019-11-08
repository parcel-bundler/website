# Rust

_지원하는 확장자: `rs`_

[Rust](https://www.rust-lang.org)는 Mozilla에서 개발 한 시스템 프로그래밍 언어로, 메모리 및 스레드 안정화 특성을 가진 네이티브 성능을 제공합니다. Rust는 최근 WebAssembly에 대한 컴파일 지원을 추가했으며, Parcel을 사용하면 Rust 구성을 **전혀 하지 않아도** 됩니다!.

Parcel은 다른 파일 형식과 마찬가지로 `.rs` 파일을 임포트 할 수 있습니다. [Rustup](https://rustup.rs)이 설치되어 있으면, Parcel은 올바른 툴체인, 대상 및 기타 빌드 조건을 **자동으로 설치** 합니다. 이는 Rust 소스파일처럼 [Cargo](https://github.com/rust-lang/cargo) 프로젝트와 함께 작동하며, 자동으로 디펜던시를 추적하여 **파일을 감지** 하여 사용자가 재빌드 실행시 작동합니다.

`.wasm` 파일과 마찬가지로 `.rs` 파일은 동기 또는 비동기 형태로 가져올 수 있습니다.

```js
// synchronous import
import { add } from './add.rs'
console.log(add(2, 3))
// asynchronous import
const { add } = await import('./add.rs')
console.log(add(2, 3))
```

Rust에서는 함수 이름이 압축되어 있지 않고 공개되어 있는지 확인하면 됩니다.

```rs
#[no_mangle]
pub fn add(a: i32, b: i32) -> i32 {
  return a + b
}
```

`src/lib.rs` 또는 `src/main.rs`를 이용해서 Rust 프로젝트를 임포트 할 수 있습니다. Parcel은 `cargo`를 호출하여 프로젝트를 빌드합니다.

```js
import { sub } from './sub/src/lib.rs'
console.log(sub(2, 3))
```

`./sub/Cargo.toml`에서:

```toml
[package]
...

[dependencies]

[lib]
crate-type = ["cdylib"]
```

`./sub/src/lib.rs` 에서:

```rust
#[no_mangle]
pub fn sub(a: i32, b: i32) -> i32 {
    a - b
}
```

[완성된 예시](https://github.com/parcel-bundler/examples/tree/master/rust-cargo)에서 확인하실 수 있습니다.
