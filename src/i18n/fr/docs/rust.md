# Rust

_Extensions supportées : `rs`_

[Rust](https://www.rust-lang.org) est un langage de programmation système développé par Mozilla, qui offre des performances natives avec des caractéristiques de sécurité de la mémoire et des threads intéressantes. Rust a récemment ajouté la prise en charge de la compilation à WebAssembly, et maintenant Parcel **facilite grandement** le démarrage avec zéro configuration !

Maintenant, vous pouvez simplement importer des fichiers `.rs` comme n'importe quel autre type de fichier dans Parcel ! En supposant que [Rustup](https://rustup.rs) soit installé, Parcel **prend automatiquement soin d’installer** les bonnes chaînes d’outils, les cibles et les autres prérequis de construction. Il fonctionne avec les projets [Cargo](https://github.com/rust-lang/cargo), ainsi qu'avec les fichiers source Rust. Il piste automatiquement vos dépendances afin que les **fichiers soient surveillés** et que les reconstructions se produisent lorsque vous enregistrez et bien plus encore !

Comme avec les fichiers `.wasm`, les fichiers `.rs` peuvent être importés avec des importations synchrones ou asynchrone.

```js
// import synchrone
import { add } from './add.rs'
console.log(add(2, 3))
// import asynchrone
const { add } = await import('./add.rs')
console.log(add(2, 3))
```

Du côté de Rust, vous devez simplement vous assurer que les noms de fonctions ne sont pas déformés et sont publics.

```rs
#[no_mangle]
pub fn add(a: i32, b: i32) -> i32 {
  return a + b
}
```

Vous pouvez également importer un projet rust en important `src/lib.rs` ou `src/main.rs`, Parcel appellera `cargo` pour construire le projet.

```js
import { sub } from './sub/src/lib.rs'
console.log(sub(2, 3))
```

dans `./sub/Cargo.toml`:

```toml
[package]
...

[dependencies]

[lib]
crate-type = ["cdylib"]
```

dans `./sub/src/lib.rs`:

```rust
#[no_mangle]
pub fn sub(a: i32, b: i32) -> i32 {
    a - b
}
```

Consultez aussi [cet exemple complet.](https://github.com/parcel-bundler/examples/tree/master/rust-cargo)
