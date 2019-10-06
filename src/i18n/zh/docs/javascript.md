# JavaScript

_支持扩展类型: `js`, `jsx`, `es6`, `jsm`, `mjs`_

Web 端打包最常见的文件类型是 JavaScript。Parcel 支持以 CommonJS 和 ES6 模块语法导入文件。同时也支持动态`import()`函数语法异步加载模块，这将在[代码拆分](code_splitting.html)部分讨论。动态导入也能通过 URL 链接导入模块。

```javascript
// 使用 CommonJS 语法导入模块
const dep = require('./path/to/dep')

// 使用 ES6语法导入模块
import dep from './path/to/dep'

// 使用动态导入一个来自CDN的URL地址
import('https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.11/lodash.min.js').then(() => {
  console.log(_.VERSION)
})
```

你也能在 JavaScript 文件里导入非 JavaScript 资源，例如：CSS, HTML，甚至是图片文件。当你导入上述这些文件时，所有的依赖将被单独放在一个捆绑包中（列如：一个 CSS 文件），而不会像其他打包工具那样内联该文件。当使用[CSS Modules](https://github.com/css-modules/css-modules)，导出的类会放在 JavaScript 捆绑包中。其他的资源类型将以 URL 的形式导出输出文件到 JavaScript 包中，以便于能在你的代码中引用。

```javascript
// 导入一个css文件
import './test.css'

// 导入包含 CSS 模块的 CSS 文件
import classNames from './test.css'

// 以 URL 的形式引入图片
import imageURL from './test.png'

// 导入一个html文件
import('./some.html')
// 或:
import html from './some.html'
// 或:
require('./some.html')
```

如果你想内联文件到 JavaScript 包中，而不是通过 URL 地址引用，你可以使用 Node.js `fs.readFileSync` API。URL 地址必须是静态可分析的，意味着它不能有任何变量（除了`__dirname` 和 `__filename`）

```javascript
import fs from 'fs'

// 以字符串的形式读取内容
const string = fs.readFileSync(__dirname + '/test.txt', 'utf8')

// 以 Buffer 的形式读取内容
const buffer = fs.readFileSync(__dirname + '/test.png')

// 转换Buffer格式到图片
;<img src={`data:image/png;base64,${buffer.toString('base64')}`} />
```

### JSX 中使用图片

下面是如何导入图片文件在 JSX 中的一些例子。

```js
// 导入图片文件
import megaMan from "./images/mega-man.png";

// JSX
<img src={megaMan} title="Mega Man" alt="Mega Man" />

// JSX (自定义路径)
<img src={`/dist${megaMan}`} title="Mega Man" alt="Mega Man" />
```

### Babel

[Babel](https://babeljs.io)是一个非常受欢迎的 JavaScript 转换器，拥有一个庞大的插件生态系统。在 Parcel 中使用 Babel 方式和其他的打包工具相同。

在你的项目安装预先设置和一些插件：

```shell
yarn add --dev @babel/preset-react
```

接着，创建一个文件`.babelrc`：

```json
{
  "presets": ["@babel/preset-react"]
}
```

你也可以把`babel`配置在`package.json`中：

```json
"babel": {
  "presets": ["@babel/preset-react"]
}
```

注意：`package.json`要比`.babelrc`权重高。

## 默认 Babel 转换

Parcel 默认使用`@babel/preset-env`转换你的代码（包含每个内部模块）以符合定义的目标。对于`browser`目标环境的则使用[browserslist](https://github.com/browserslist/browserslist)，browserslist 可以定义在`package.json` (`engines.browsers` or `browserslist`)或者使用配置文件(`browserslist` or `.browserslistrc`)。（译者注：一般定义到 package.json 的 browserslist 字段）。

browserslist 默认是：`> 0.25%`（支持全球大于 0.25%占比的浏览器版本）

对于目标是`node`环境的，Parcel 使用`engines.node` 在 `package.json`中定义的值，默认是：_node 8_

## Flow

[Flow](https://flow.org/) 是一个受欢迎的对 JavaScript 静态类型检查工具（译者注：Flow 已死，现在是 TypeScript 的天下）。Flow 配合 Parcel 使用就像在你的`js`文件第一行放置`// @flow`一样简单。

Parcel 将自动安装所需的 Babel 配置，从已编译的输出中剥离 Flow 类型，所以你没什么担心的除了[编辑器集成](https://flow.org/en/docs/editors/)或者[flow 中的绝对路径解析模块](module_resolution.html#Flow-中的绝对路径和波浪号路径解析)。
