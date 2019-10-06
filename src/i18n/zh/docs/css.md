# CSS

_支持扩展类型: `css`, `pcss`, `postcss`_

CSS 资源可以被 JavaScript 或者 HTML 文件导入：

```js
import './index.css'
```

```html
<link rel="stylesheet" type="text/css" href="index.css" />
```

CSS 资源不但可以通过`@import`语法包含其他依赖，也可以通过`url()`函数引入图片、字体等。其他通过 `@import` 导入的 CSS 文件被内联到同一个 CSS 包里，并将 `url()` 引用重写为其输出文件名。所有文件名都应该与当前 CSS 文件相关联。

```css
/* 导入其他 CSS 文件 */
@import './other.css';

.test {
  /* 引入一个图片文件 */
  background: url('./images/background.png');
}
```

除了原始的 CSS，其他预编译成 CSS 的语言如 LESS, SASS, 和 Stylus 都是以同样的方式支持。

### PostCSS

[PostCSS](http://postcss.org)是一个通过各类插件转换 CSS 的工具，如：[autoprefixer](https://github.com/postcss/autoprefixer), [Preset Env](https://github.com/csstools/postcss-preset-env), 和 [CSS Modules](https://github.com/css-modules/css-modules)。在 Parcel 中通过创建一个名字为`.postcssrc` (JSON), `.postcssrc.js`, 或 `postcss.config.js`的配置文件来配置 PostCSS。

在你的应用中安装下列插件：

```bash
yarn add postcss-modules autoprefixer
```

接着：创建一个文件`.postcssrc`

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

在`plugins`对象中 key 指定插件，values 以对象形式被用来定义该插件的配置选项。如果这个插件没有配置，value 设置为`true`

Autoprefixer, cssnext 和其他工具的可以在`.browserslistrc` 文件指定浏览器目标为：

```
> 1%
last 2 versions
```

在使用最外层的`modules`键值时，CSS Modules 启用方式稍有不同。这是因为 Parcel 需要对 CSS Modules 提供特殊的支持，因为它们导出了一个对象也要包含在 JavaScript 包中。注意你仍需安装`postcss-modules`。

### 使用现有的 CSS 库

要使 CSS Modules 与现有模块正常工作，它们需要在自己的模块的`.postcssrc`中指定这种支持。

### 设置 cssnano 压缩配置

Parcel 为了在生产环境构建压缩 css，向 postcss 中添加了[cssnano](http://cssnano.co)。这里可以通过创建`cssnano.config.js` 文件自定义配置。

```js
module.exports = {
  preset: [
    'default',
    {
      calc: false,
      discardComments: {
        removeAll: true
      }
    }
  ]
}
```
