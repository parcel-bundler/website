# Rust

_Extensões suportadas: `rs`_

[Rust](https://www.rust-lang.org) é uma linguagem de programação de sistemas desenvolvida pela Mozilla, que oferece desempenho nativo com algumas características interessantes de memória e segurança de thread. Rust recentemente adicionado suporte para a compilação para WebAssembly, e agora o Parcel torna **super fácil** para começar com zero de configuração!

Agora você pode simplesmente importar arquivos `.rs` como qualquer outro tipo de arquivo no Parcel! Supondo que você tenha o [Rustup](https://rustup.rs) instalado, o Parcel **automaticamente cuida da instalação** das _toolchains_ corretas, alvos e outros pré-requisitos de compilação. Ele funciona com projetos [Cargo](https://github.com/rust-lang/cargo), bem como arquivos _straight-up_ do Rust, automaticamente rastreando suas dependências então **arquivos são assistidos** e reconstruídos sempre que você salvar, e muito mais!

Assim como com arquivos `.wasm`, arquivos `.rs` podem ser importados com as importações síncronas ou assíncronas.

```js
// importação síncrona
import { add } from './add.rs'
console.log(add(2, 3))
// importação assíncrona
const { add } = await import('./add.rs')
console.log(add(2, 3))
```

No lado do Rust, você só precisa ter certeza de que os nomes de função não estão desconfiguradas e que são públicas.

```rs
#[no_mangle]
pub fn add(a: i32, b: i32) -> i32 {
  return a + b
}
```
