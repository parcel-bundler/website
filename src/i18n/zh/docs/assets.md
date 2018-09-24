# 📦 资源(Assets)

Parcel 是基于资源的，资源可以代表任意文件，并且 Parcel 对 JavaScript，CSS，HTML 文件有更多的支持。 Parcel 会自动地分析这些文件和包中引用的依赖。相同类型的资源会被组合到同一捆绑包中。如果导入其他类型的资源（例如：你在 JS 文件中导入 CSS 文件），Parcel会启动子捆绑包，并在父捆绑包中保留对它的引用。这一点将在以下部分进行说明。

## JavaScript

JavaScript 是最传统的 Web 打包文件类型。 Parcel 同时支持 CommonJS 和 ES6 两种模块语法来导入文件。它也支持动态的 `import()` 函数语法异步加载模块，这一点会在[代码拆分](code_splitting.html)部分有讨论。

```javascript
// 使用 CommonJS 语法导入模块
const dep = require('./path/to/dep');

// 使用 ES6 语法导入模块
import dep from './path/to/dep';
```

你也能在 JavaScript 文件中导入非 JavaScript 资源，例如：CSS 文件及图片文件。导入这类文件时，Parcel不会像其他打包工具一样内联该文件，而是将所有的依赖放置在另外一个捆绑包里（例如：一个 CSS 文件）。当使用 [CSS Modules](https://github.com/css-modules/css-modules) 时，这个导出类会被放置在 JavaScript 包里。其他的资源文件将以 URL 的形式导出到 JavaScript 包中的 output 中，以便于能在你的代码中引用。

```javascript
// 引入 CSS 文件
import './test.css';

// 引入包含 CSS 模块的 CSS 文件
import classNames from './test.css';

// 以 URL 的形式引入图片
import imageURL from './test.png';
```

如果你想通过内联文件到 JavaScript 包取代 URL 引入文件的方式，你可以使用 Node.js 的 `fs.readFileSync` API。URL 必须是静态可分析的，意味着它不能有任何变量（除了`__dirname` 和 `__filename`）。

```javascript
import fs from 'fs';

// 以字符串的形式读取内容
const string = fs.readFileSync(__dirname + '/test.txt', 'utf8');

// 以 Buffer 的形式读取内容
const buffer = fs.readFileSync(__dirname + '/test.png');
```

## CSS

JavaScript 文件或 HTML 文件都能导入 CSS 资源，并且能通过 `@import` 语法引用依赖，还能通过 `url()` 函数引入图片，字体等。其他通过 `@import` 导入的 CSS 文件被内联到同一个CSS包里，并将 `url()` 引用重写为其输出文件名。所有文件名都应该与当前 CSS 文件相关联。

```css
/* 引入其他 CSS 文件 */
@import './other.css';

.test {
  /* 引用图像文件 */
  background: url('./images/background.png');
}
```

除了普通的 CSS，其他的 LESS，SASS，以及 Stylus 等CSS预处理器语言也是支持的，并且执行方法是与之相同的。

## SCSS
编译 SCSS 需要 `sass` 模块. 通过 npm 安装它:
```bash
npm install sass
```
一旦安装了 `sass`，你就可以在 JavaScript 文件中引入 SCSS 文件。
```javascript
import './custom.scss'
```
SCSS 文件中的依赖可以使用 `@import` 语句。

## HTML

HTML 资源是提供给 Parcel 常用入口文件，但也可以被 JavaScript 文件引用，例如：提供链接给其他页面。如上所述，提取并编译脚本、样式、媒体以及其他的 HTML 文件的 URL 。引用会在 HTML 中被重写，以便链接到正确的输出文件。全部的文件名都应该和当前的 HTML 文件相关联。

```html
<html>
<body>
  <!-- 引入图像文件 -->
  <img src="./images/header.png">

  <a href="./other.html">链接到其他页面</a>

  <!-- 引入 JavaScript 捆绑包 -->
  <script src="./index.js"></script>
</body>
</html>
```
