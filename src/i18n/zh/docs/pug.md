# Pug

_支持扩展类型: `jade`, `pug`_

使用 Pug 很容易，这里提供几个简单的例子作为一点参考。

## 例 1 - Just index.pug

假设如下文件结构：

```bash
.
├── package.json
└── src
    └── index.pug
```

使用 Parcel 命令运行起来：`parcel src/index.pug`

## 例 2 - index.pug, index.js and style.css

假设如下文件结构：

```bash
.
├── package.json
└── src
    ├── index.js
    ├── index.pug
    └── style.css
```

在 index.pug 内，像往常一样写入样式和 js。

```pug
// index.pug

doctype html
html(lang="")
  head
    // ...
    link(rel="stylesheet", href="index.css")
  body
    h1 Hello

    script(src="index.js")
```

以同样的方式使用 Stylus, Sass or LESS，把样式导入到 js 文件内。

## 例 3 - Pug with locals

假设如下文件结构：

```bash
.
├── package.json
└── src
    ├── index.pug
    └── pug.config.js
```

我们需要从`pug.config.js` 文件导出 `locals`对象，`pug.config.js`文件必须放在 `index.pug`或者`package.json`文件所在目录。

```js
// pug.config.js

module.exports = {
  locals: {
    hello: 'world'
  }
}
```

```pug
// index.pug

doctype html
html(lang="")
  head
    // ...
  body
    h1 #{hello}
```

接着，使用命令运行起来：`parcel src/index.pug`

### 更新 locals 对象需要重新执行 parcel

如果更新了`locals`对象，请关闭 parcel 进程并重新执行 `parcel src/index.pug`。

### 注意无声的错误

当使用 locals 设置时，在 Pug 中使用一个不存在的插值（interpolation）将不会收到任何错误告警。

假设，我们写了`h1 #{thing}`并且在 locals 对象中不存在`thing` 属性，Parcel 不会暂停并报告任何错误。你只是在浏览器看到空的结果。因此，确保有一个正确的配置，否则插值（interpolation）不运行也不知道什么问题。

### 三种类型的配置文件

可以使用`.pugrc` 或 `.pugrc.js`来代替`pug.config.js`。但只有这三个文件可以设置 locals。

### 不能在 `pug.config.js` 文件中使用 import 语句

若要在`pug.config.js`中导入其他文件，请使用 require 语句。

```js
// pug.config.js

const data = require('./data.js')

module.exports = {
  locals: {
    d: data
  }
}
```

## 添加脚本到 package.json

```json
"scripts": {
    "dev": "parcel src/index.pug",
    "devopen": "parcel src/index.pug --open 'google chrome'",
    "build": "parcel build src/index.pug"
  },
```

使用`npm run devopen`自动打开浏览器，执行`npm run build`生产环境打包。
