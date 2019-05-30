# SCSS

_支持扩展类型: `sass`, `scss`_

SCSS 编译需要`sass`(`dart-sass`的 JS 版本)模块。通过 npm 安装：

```bash
npm install -D sass
```

在 JavaScript 文件导入 SCSS 文件：

```javascript
import './custom.scss'
```

SCSS 文件中的依赖关系可以使用`@import`语句。

在运行 Parcel 之前，你没有安装`sass`模块，Parcel 将自动为你安装。同样的，也可以通过创建配置文件如：.sassrc 配置 sass 编译。

举个例子，可以像这样指定生成 CSS 的输出样式：

```
{
  outputStyle: "nested",
}
```

**注意：** 也可以使用 `node-sass` 模块编译 SCSS 带来更快的编译体验。这里有一篇在 Parcel 中使用`node-sass` 模块的[报告](https://github.com/parcel-bundler/parcel/issues/1836)。
