# WebAssembly

_支持扩展类型: `wasm`_

[WebAssembly](https://webassembly.org) 是一个新兴的技术，但在不久的将来，它会对 web 产生巨大的影响。现在的主流浏览器都支持，Nodejs 也是。WebAssembly 将启用多种语言，而不仅仅是那些可以编译成 JavaScript 的语言。

系统底层的语言比如：C 和 Rust 都可以编译成二进制格式的 WebAssembly，这样减少文件大小并且加快了运行时。编译后的 WebAssembly 代码具有原生级别的性能，一般来说比同等的 JavaScript 更快。在不久的将来，我们很可能会看到 JavaScript 库开始利用 WebAssembly 来实现代码中关键的性能部分。

在 Parcel 中**非常容易**使用 WebAssembly。假设你有一个`.wasm`文件，直接像往常一样导入它。同步和异步导入都是支持的。

```js
// 同步导入
import { add } from './add.wasm'
console.log(add(2, 3))
// 异步导入
const { add } = await import('./add.wasm')
console.log(add(2, 3))
```

当同步导入一个`.wasm`文件时，Parcel 自动生成额外的代码以便在执行 JavaScript 包之前载入文件。这意味着二进制的 WebAssembly 不会以字符串的方式内联到你的 JavaScript 中，实际上正如你所期望的那样作为单独的二进制文件载入。如此一来，你的代码依然是同步的工作方式，Parcel 会在所有代码工作之前处理这些需要加载的依赖项。

这些是所有被 Parcel 支持的[bundle 加载器](https://github.com/parcel-bundler/parcel/pull/565)，这些模块的运行时是了解如何异步加载特定的文件格式。在以往的版本，支持动态导入的 JavaScript 及 CSS 的包加载器都是写死的。在 Parcel v1.5.0 版本，这些都是**完全插件化**了，你可以在插件中定义你自己的包加载器！在不久的将来这将开启大量有趣的功能，比如自定义的 Glimmer 的二进制模板等。非常期待！
