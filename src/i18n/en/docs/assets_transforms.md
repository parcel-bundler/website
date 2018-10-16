# 📦 Assets & Transforms

## 📦 Assets

Parcel is based around assets. An asset can represent any file, but Parcel has special support for certain types of assets like JavaScript, CSS, and HTML files. Parcel automatically analyzes the dependencies referenced in these files and includes them in the output bundle. Assets of similar types are grouped together into the same output bundle. If you import an asset of a different type (for example, if you imported a CSS file from JS), it starts a child bundle and leaves a reference to it in the parent. This will be illustrated in the following sections.

### JavaScript

The most traditional file type for web bundlers is JavaScript. Parcel supports both CommonJS and ES6 module syntax for importing files. It also supports dynamic `import()` function syntax to load modules asynchronously, which is discussed in the [Code Splitting](code_splitting.html) section.

```javascript
// Import a module using CommonJS syntax
const dep = require('./path/to/dep');

// Import a module using ES6 import syntax
import dep from './path/to/dep';
```

You can also import non-JavaScript assets from a JavaScript file, e.g. CSS, HTML or even an image file. When you import one of these files, it is not inlined as in some other bundlers. Instead, it is placed in a separate bundle (e.g. a CSS file) along with all of its dependencies. When using [CSS Modules](https://github.com/css-modules/css-modules), the exported classes are placed in the JavaScript bundle. Other asset types export a URL to the output file in the JavaScript bundle so you can reference them in your code.

```javascript
// Import a CSS file
import './test.css';

// Import a CSS file with CSS modules
import classNames from './test.css';

// Import the URL to an image file
import imageURL from './test.png';

// Import an HTML file
import('./some.html')
// or:
import html from './some.html'
// or:
require('./some.html')
```

If you want to inline a file into the JavaScript bundle instead of reference it by URL, you can use the Node.js `fs.readFileSync` API to do that. The URL must be statically analyzable, meaning it cannot have any variables in it (other than `__dirname` and `__filename`).

```javascript
import fs from 'fs';

// Read contents as a string
const string = fs.readFileSync(__dirname + '/test.txt', 'utf8');

// Read contents as a Buffer
const buffer = fs.readFileSync(__dirname + '/test.png');

// Convert Buffer contents to an image
<img  src={`data:image/png;base64,${buffer.toString('base64')}`}/>
```

### CSS

CSS assets can be imported from a JavaScript or HTML file, and can contain dependencies referenced by `@import` syntax as well as references to images, fonts, etc. via the `url()` function. Other CSS files that are `@import`ed are inlined into the same CSS bundle, and `url()` references are rewritten to their output filenames. All filenames should be relative to the current CSS file.

```css
/* Import another CSS file */
@import './other.css';

.test {
  /* Reference an image file */
  background: url('./images/background.png');
}
```

In addition to plain CSS, other compile-to-CSS languages like LESS, SASS, and Stylus are also supported, and work the same way.

### SCSS
SCSS compilation needs `sass` (JS version of `dart-sass`) module. To install it with npm:
```bash
npm install sass
```
Once you have `sass` installed you can import SCSS files from JavaScript files.
```javascript
import './custom.scss'
```
Dependencies in the SCSS files can be used with the `@import` statements.

### HTML

HTML assets are often the entry file that you provide to Parcel, but can also be referenced by JavaScript files, e.g. to provide links to other pages. URLs to scripts, styles, media, and other HTML files are extracted and compiled as described above. The references are rewritten in the HTML so that they link to the correct output files. All filenames should be relative to the current HTML file.

```html
<html>
<body>
  <!-- reference an image file -->
  <img src="./images/header.png">

  <a href="./other.html">Link to another page</a>

  <!-- import a JavaScript bundle -->
  <script src="./index.js"></script>
</body>
</html>
```

## 🐠 Transforms

While many bundlers require you to install and configure plugins to transform assets, Parcel has support for many common transforms and transpilers built in out of the box. You can transform JavaScript using [Babel](https://babeljs.io), CSS using [PostCSS](http://postcss.org), and HTML using [PostHTML](https://github.com/posthtml/posthtml). Parcel automatically runs these transforms when it finds a configuration file (e.g. `.babelrc`, `.postcssrc`) in a module.

This even works in third-party `node_modules`: if a configuration file is published as part of the package, the transform is automatically turned on for that module only. This keeps bundling fast since only modules that need to be transformed are processed. It also means that you don't need to manually configure the transforms to include and exclude certain files, or know how third party code is built in order to use it in your application.

### Babel

[Babel](https://babeljs.io) is a popular transpiler for JavaScript, with a large plugin ecosystem. Using Babel with Parcel works the same way as using it standalone or with other bundlers.

Install presets and plugins in your app:

```bash
yarn add @babel/preset-react
```

Then, create a `.babelrc`:

```json
{
  "presets": [
    "@babel/preset-react"
  ]
}
```

#### Default babel transforms

Parcel transpiles your code with `@babel/preset-env` by default, this is to transpile every module both internal (local requires) and external (node_modules) to match the defined target.

For the `browser` target it utilises [browserslist](https://github.com/browserslist/browserslist), the target browserlist can be defined in `package.json` (`engines.browsers` or `browserslist`) or using a configuration file (`browserslist` or `.browserslistrc`).

The browserlist target defaults to: `> 0.25%` (Meaning, support every browser that has 0.25% or more of the total amount of active web users)

For the `node` target, Parcel uses the `engines.node` defined in `package.json`, this default to *node 8*.

### PostCSS

[PostCSS](http://postcss.org) is a tool for transforming CSS with plugins, like [autoprefixer](https://github.com/postcss/autoprefixer), [cssnext](http://cssnext.io/), and [CSS Modules](https://github.com/css-modules/css-modules). You can configure PostCSS with Parcel by creating a configuration file using one of these names: `.postcssrc` (JSON), `.postcssrc.js`, or `postcss.config.js`.

Install plugins in your app:

```bash
yarn add postcss-modules autoprefixer
```

Then, create a `.postcssrc`:

```json
{
  "modules": true,
  "plugins": {
    "autoprefixer": {
      "grid": true
    }
  }
}
```

Plugins are specified in the `plugins` object as keys, and options are defined using object values. If there are no options for a plugin, just set it to `true` instead.

Target browsers for Autoprefixer, cssnext and other tools can be specified in `.browserslistrc` file:

```
> 1%
last 2 versions
```

CSS Modules are enabled slightly differently using the a top-level `modules` key. This is because Parcel needs to have special support for CSS Modules since they export an object to be included in the JavaScript bundle as well. Note that you still need to install `postcss-modules` in your project.

#### Usage with existing CSS libraries

For CSS Modules to work properly with existing modules they need to specify this support in their own `.postcssrc`.

#### Set cssnano minify config

Parcel adds [cssnano](http://cssnano.co) to postcss in order to minify css in production build, where custom configuration can be set by creating `cssnano.config.js` file:

```js
module.exports = {
  preset: ['default', {
    calc: false,
    discardComments: {
      removeAll: true,
    }
  }]
};
```

### PostHTML

[PostHTML](https://github.com/posthtml/posthtml) is a tool for transforming HTML with plugins. You can configure PostHTML with Parcel by creating a configuration file using one of these names: `.posthtmlrc` (JSON), `posthtmlrc.js`, or `posthtml.config.js`.

Install plugins in your app:

```bash
yarn add posthtml-img-autosize
```

Then, create a `.posthtmlrc`:

```json
{
  "plugins": {
    "posthtml-img-autosize": {
      "root": "./images"
    }
  }
}
```

Plugins are specified in the `plugins` object as keys, and options are defined using object values. If there are no options for a plugin, just set it to `true` instead.

### TypeScript

[TypeScript](https://www.typescriptlang.org/) is a typed superset of JavaScript that compiles down to plain JavaScript, which also supports modern ES2015+ features. Transforming TypeScript works out of the box without any additional configuration.

```html
<!-- index.html -->
<html>
<body>
  <script src="./index.ts"></script>
</body>
</html>
```

```typescript
// index.ts
import message from "./message";
console.log(message);
```

```typescript
// message.ts
export default "Hello, world";
```
### ReasonML/BuckleScript

[ReasonML](https://reasonml.github.io/) compiles OCaml to JavaScript with the help of [BuckleScript](https://bucklescript.github.io). You can use ReasonML by installing dependencies and creating `bsconfig.json`:

```bash
$ yarn add bs-platform --dev
```

```json
// bsconfig.json
// from https://github.com/BuckleScript/bucklescript/blob/master/jscomp/bsb/templates/basic-reason/bsconfig.json

{
  "name": "whatever",
  "sources": {
    "dir": "src",
    "subdirs": true
  },
  "package-specs": {
    "module": "commonjs",
    "in-source": true
  },
  "suffix": ".bs.js",
  "bs-dependencies": [
  ],
  "warnings": {
    "error": "+101"
  },
  "namespace": true,
  "refmt": 3
}
```

```html
<!-- index.html -->
<!doctype html>
<html>
<body>
  <script src="./src/index.re"></script>
</body>
</html>
```

```reason
/* src/index.re */
print_endline("Hello World");
```

#### ReasonReact

[ReasonReact](https://reasonml.github.io/reason-react/) is React binding for ReasonML. You can use it with Parcel too:

```bash
$ yarn add react react-dom reason-react
```

```diff
// bsconfig.json

{
  "name": "whatever",
+ "reason": {
+   "react-jsx": 2
+ },
  "sources": {
    "dir": "src",
    "subdirs": true
  },
  "package-specs": {
    "module": "commonjs",
    "in-source": true
  },
  "suffix": ".bs.js",
  "bs-dependencies": [
+   "reason-react"
  ],
  "warnings": {
    "error": "+101"
  },
  "namespace": true,
  "refmt": 3
}
```

```diff
<!-- index.html -->
<html>
<body>
+  <div id="app"></div>
  <script src="./src/index.re"></script>
</body>
</html>
```

```reason
/* src/Greeting.re */

let component = ReasonReact.statelessComponent("Greeting");

let make = (~name, _children) => {
  ...component,
  render: _self => <div> (ReasonReact.string("Hello! " ++ name)) </div>,
};
```

```reason
/* src/index.re */

ReactDOMRe.renderToElementWithId(<Greeting name="Parcel" />, "app");
```

### WebAssembly

[WebAssembly](https://webassembly.org) is an emerging technology, but one that will have a huge impact on the web in the near future. Now supported by all major web browsers, as well as Node, WebAssembly will enable a diversity of languages on the web, and not just those that can transpile to JavaScript.

Low-level languages like C and Rust can compile to WebAssembly, which is a binary format for smaller file sizes and faster runtime. Near native-level performance can be had with WebAssembly compiled code, often much faster than equivalent JavaScript. It is likely that we will see JavaScript libraries starting to take advantage of WebAssembly for performance-critical sections of code in the near future.

Parcel makes it **extremely easy** to get started with WebAssembly. Assuming you already have a `.wasm` file (see the next section for an even easier way!), you can just import as usual. Both synchronous and asynchronous imports are supported.

```js
// synchronous import
import {add} from './add.wasm';
console.log(add(2, 3));
// asynchronous import
const {add} = await import('./add.wasm');
console.log(add(2, 3));
```

When synchronously importing a `.wasm` file, Parcel automatically generates extra code to preload the file prior to executing your JavaScript bundle. This means that the binary WebAssembly file is not inlined into your JavaScript as a string, but actually served as a separate binary file as you’d expect. In this way, your code still works synchronously, but Parcel takes care of loading dependencies for you up front.

This is all enabled by Parcel’s internal support for [bundle loaders](https://github.com/parcel-bundler/parcel/pull/565), which are runtime modules which know how to asynchronously load a particular file format. In prior versions, there were hard-coded bundle loaders for JavaScript and CSS, which enabled dynamic import support. In Parcel v1.5.0, this is **completely pluggable** — you can define your own bundle loaders in plugins! This will enable lots of cool functionality in the future for custom binary formats like Glimmer’s binary templates, etc. Super excited to see what this enables!

### Rust Support

[Rust](https://www.rust-lang.org/en-US/) is a systems programming language developed by Mozilla, which offers native performance with some interesting memory and thread safety characteristics. Rust recently added support for compiling to WebAssembly, and now Parcel makes it **super easy** to get started with zero configuration!

You can now simply import `.rs` files just like any other file type in Parcel! Assuming you have [Rustup](https://rustup.rs) installed, Parcel **automatically takes care installing** the right toolchains, targets, and other build pre-requisites. It works with [Cargo](https://github.com/rust-lang/cargo) projects, as well as straight-up Rust source files, automatically tracks your dependencies so **files are watched** and rebuilds happen when you save, and more!

Just like with `.wasm` files, `.rs` files can be imported with either synchronous or asynchonous imports.

```js
// synchronous import
import {add} from './add.rs';
console.log(add(2, 3));
// asynchronous import
const {add} = await import('./add.rs');
console.log(add(2, 3));
```

On the Rust side, you just need to make sure that function names aren’t mangled and are public.

```rs
#[no_mangle]
pub fn add(a: i32, b: i32) -> i32 {
  return a + b
}
```