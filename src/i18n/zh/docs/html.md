# HTML

HTML 资源经常被用来当做入口文件提供给 Parcel，但也可以被 JavaScript 文件引用，如提供一个链接到其他页面。通过 URL 链接的脚本、样式、媒体资源和其他 HTML 文件都会被提取和编译。在 HTML 中的链接将被重写成正确的输出文件地址。所有的文件名路径都应该相对于当前的 HTML 文件。

```html
<html>
  <body>
    <!-- 引入一个文件 -->
    <img src="./images/header.png" />

    <a href="./other.html">Link to another page</a>

    <!-- 导入一个JavaScript包 -->
    <script src="./index.js"></script>
  </body>
</html>
```

## 导入未编译的资源

在 HTML 文件中添加的链接都将被 Parcel 编译（例如：JavaScript, TypeScript, SCSS 等）。Parcel 会自动处理这些资源并更新链接指向编译后的资源。

```html
<html>
  <head>
    <!-- 包含一个 SCSS 文件 -->
    <link rel="stylesheet" href="./my-styles/style.scss" />
  </head>
</html>
```

## PostHTML

[PostHTML](https://github.com/posthtml/posthtml)是一个通过各类插件转换 HTML 的工具。在 Parcel 中通过创建一个名字为`.posthtmlrc` (JSON), `.posthtmlrc.js`, 或 `posthtml.config.js`的配置文件来配置它。

安装插件：

```bash
yarn add posthtml-img-autosize
```

创建一个`.posthtmlrc`文件

```json
{
  "plugins": {
    "posthtml-img-autosize": {
      "root": "./images"
    },
    "posthtml-modules": {
      "root": "./src"
    }
  }
}
```

在`plugins`对象中 key 指定插件，values 以对象形式被用来定义该插件的配置选项。如果这个插件没有配置，value 设置为`true`

配置了`posthtml-modules`后，导入的模块以`/`路径开始将变成相对路径`./src`
