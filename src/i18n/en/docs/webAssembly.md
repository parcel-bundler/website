# WebAssembly

_Supported extensions: `wasm`_

[WebAssembly](https://webassembly.org) is an emerging technology, but one that will have a huge impact on the web in the near future. Now supported by all major web browsers, as well as Node, WebAssembly will enable a diversity of languages on the web, and not just those that can transpile to JavaScript.

Low-level languages like C and Rust can compile to WebAssembly, which is a binary format for smaller file sizes and faster runtime. Near native-level performance can be had with WebAssembly compiled code, often much faster than equivalent JavaScript. It is likely that we will see JavaScript libraries starting to take advantage of WebAssembly for performance-critical sections of code in the near future.

Parcel makes it **extremely easy** to get started with WebAssembly. Assuming you already have a `.wasm` file (see the next section for an even easier way!), you can just import as usual. Both synchronous and asynchronous imports are supported.

```js
// synchronous import
import { add } from './add.wasm'
console.log(add(2, 3))
// asynchronous import
const { add } = await import('./add.wasm')
console.log(add(2, 3))
```

When synchronously importing a `.wasm` file, Parcel automatically generates extra code to preload the file prior to executing your JavaScript bundle. This means that the binary WebAssembly file is not inlined into your JavaScript as a string, but actually served as a separate binary file as you’d expect. In this way, your code still works synchronously, but Parcel takes care of loading dependencies for you up front.

This is all enabled by Parcel’s internal support for [bundle loaders](https://github.com/parcel-bundler/parcel/pull/565), which are runtime modules which know how to asynchronously load a particular file format. In prior versions, there were hard-coded bundle loaders for JavaScript and CSS, which enabled dynamic import support. In Parcel v1.5.0, this is **completely pluggable** — you can define your own bundle loaders in plugins! This will enable lots of cool functionality in the future for custom binary formats like Glimmer’s binary templates, etc. Super excited to see what this enables!
