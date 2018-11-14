# 🐠 转换(Transforms)

许多打包工具需要你安装和配置插件来转换资源，Parcel 支持许多开箱即用的转换器和内置的编译器。您可以使用 [Babel](https://babeljs.cn) 转换 JavaScript ，使用 [PostCSS](http://postcss.org) 转换 CSS ，使用 [PostHTML](https://github.com/posthtml/posthtml) 转换 HTML。Parcel 在模块中找到配置文件 (例如 .babelrc ，.postcssrc) 时会自动运行并进行转换。

这甚至可以在第三方 `node_modules` 中运行：如果配置文件作为程序包的一部分发布，则仅为该模块自动启用转换。由于只需要处理需要转换的模块，因此可以快速打包。这也意味着你不需要手动配置转换，使其包含和排除某些文件，也不需要知道如何构建第三方代码，以便在你的应用程序中使用它。

## Babel

[Babel](https://babeljs.cn) 是一个流行的 JavaScript 转换器，拥有大型的插件生态系统。Babel 与 Parcel 一起使用的方式与单独使用或与其他打包工具一起使用的方式相同。

在你的应用程序中安装 presets 和 plugins :

```bash
yarn add @babel/preset-env
```

接着，创建一个 `.babelrc`:

```json
{
  "presets": ["@babel/preset-env"]
}
```

## PostCSS

[PostCSS](http://postcss.org) 是一个使用插件转换 CSS 的工具，例如 [autoprefixer](https://github.com/postcss/autoprefixer)，[cssnext](http://cssnext.io/) 以及 [CSS Modules](https://github.com/css-modules/css-modules) 。你可以使用这些名称之一创建配置，从而达到使用 Parcel 配置 PostCSS 的目的： `.postcssrc` (JSON)，`.postcssrc.js`，或 `postcss.config.js`。

在你应用程序中安装 plugins ：

```bash
yarn add postcss-modules autoprefixer
```

接着，创建一个 `.postcssrc` 文件：

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

Plugins 在 `plugins` 对象中被指定为 key，并使用对象的值定义选项。如果插件没有选项，只需将其设置为 `true` 即可。

可以在 `.browserslistrc` 中指定 autoprefixer、cssnext 和目标浏览器的其他工具:

```
> 1%
last 2 versions
```

使用顶级 `modules` 键时，CSS 模块启用方式稍有不同。这是因为 Parcel 需要对 CSS 模块提供特殊支持，因为它们也导出一个包含在 JavaScript 包中的对象。请注意，你仍然需要在你的项目中安装 `postcss-modules` 。

### 使用现有 CSS 库

为了使 CSS 模块能够与现有模块一起正常工作，则需在自己的 `.postcssrc` 中指定这种支持。

### 设置 cssnano 的压缩配置

Parcel 在生产环境构建时，会使用 [cssnano](http://cssnano.co) 来压缩 css 文件。可以创建一个 `cssnano.config.js` 文件来进行详细的压缩配置：

```js
module.exports = {
  calc: false,
  discardComments: {
    removeAll: true
  }
}
```

## PostHTML

[PostHTML](https://github.com/posthtml/posthtml) 是一个通过插件转换 HTML 的工具。你可以使用这些名称之一创建配置，从而达到使用 Parcel 配置 PostHTML 的目的： `.posthtmlrc` (JSON) ，`.posthtmlrc.js` ，或者 `posthtml.config.js`。

在你的应用程序中安装 plugin ：

```bash
yarn add posthtml-img-autosize
```

接着，创建一个 `.posthtmlrc` ：

```json
{
  "plugins": {
    "posthtml-img-autosize": {
      "root": "./images"
    }
  }
}
```

Plugins 在 `plugins` 对象中指定为 key，并且选项使用对象值定义。如果插件没有选项，只需将其设置为 `true` 即可。

## TypeScript

[TypeScript](https://www.typescriptlang.org/) 是 JavaScript 类型的超集，它可以编译成普通的 JavaScript，同时也支持现代 ES2015+ 的特性。转换 TypeScript 无需任何额外配置，开箱即用。

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
import message from './message'
console.log(message)
```

```typescript
// message.ts
export default 'Hello, world'
```

## ReasonML/BuckleScript

[ReasonML](https://reasonml.github.io/) 利用 [BuckleScript](https://bucklescript.github.io) 把 OCaml 编译为可执行的 JavaScript. 只需要安装依赖以及创建 `bsconfig.json`：

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
  "bs-dependencies": [],
  "warnings": {
    "error": "+101"
  },
  "namespace": true,
  "refmt": 3
}
```

```html
<!-- index.html -->
<html>
<body>
  <script src="./src/index.re"></script>
</body>
</html>
```

```reason
// src/index.re
print_endline("Hello World");
```

### ReasonReact

[ReasonReact](https://reasonml.github.io/reason-react/) 可以让你在 ReasonML 中使用 React:

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
