# 📔 模块解析

Parcel 解析器实现了一版改进后的[node_modules 解析](https://nodejs.org/api/modules.html#modules_all_together)算法

## 模块解析

除了标准算法，所有[Parcel 支持的资源种类](/assets.html) 都可以被解析

模块解析可以相对于：

- **入口根目录**：指定给 Parcel 的入口目录，或者多个入口执定的共享根目录（同一个父目录）。
- **包的根目录**：`node_modules` 中最接近模块根的目录。

### 绝对路径

`/foo`相对于**入口根目录**解析成`foo`。

### 波浪号路径

`~/foo`解析成`foo`相对于最近的**包的根目录**，如果不存在则是**入口根目录**

### Glob 文件路径

Globs 可以使用通配符一次导入多个资源，匹配一些文件(`/assets/*.png`)，或者匹配多个目录中的文件(`/assets/**/*`)

此示例打包了一个文件中的所有 png 并返回了 dist 的 URLs。

```javascript
import foo from '/assets/*.png'
// {
//   'file-1': '/file-1.8e73c985.png',
//   'file-2': '/file-1.8e73c985.png'
// }
```

### package.json `browser` 字段

如果一个包的 package.json 包含 [package.browser 字段](https://docs.npmjs.com/files/package.json#browser)，Parcel 将使用它替换 package.main 入口

### 别名

支持在`package.json`中设置`alias` 字段

这个例子的`react`别名是`preact`，而`local-module`并不是来自`node_modules`

```json
// package.json
{
  "name": "some-package",
  "devDependencies": {
    "parcel-bundler": "^1.7.0"
  },
  "alias": {
    "react": "preact-compat",
    "react-dom": "preact-compat",
    "local-module": "./custom/modules"
  }
}
```

应避免在你的别名中使用特殊字符，因为可能被 Parcel 和其他第三方工具或扩展使用。比如：

- `~` 被 Parcel 用来处理 [波浪号路径](#波浪号路径)
- `@` 被 npm 解释成 npm 组织（译者注：如@babel 是 babel 组织下的 npm 包）

我们建议在定义别名时要明确，所以最好指出**文件的扩展名**，而不是让 Parcel 猜。请看这个例子 [JavaScript 命名导出](#JavaScript-命名导出)。

## 常见问题

### JavaScript 命名导出

别名映射应用于很多种类的资源，但是并没有特别支持 JavaScript 命名导出。如果你想要这样做：

```json
// package.json
{
  "name": "some-package",
  "alias": {
    "ipcRenderer": "./electron-ipc.js" // 指定文件扩展名
  }
}
```

接着，在有别名的文件中重新导出

```js
// electron-ipc.js
module.exports = require('electron').ipcRenderer
```

### Flow 中的绝对路径和波浪号路径解析

解析这样的模块你需要配置 Flow 并且使用[module.name_mapper](https://flow.org/en/docs/config/options/#toc-module-name-mapper-regex-string)特性

这里有个文件结构如下：

```
package.json
.flowconfig
src/
  index.html
  index.js
  components/
    apple.js
    banana.js
```

`src/index.html`是入口，`src/` 文件是**入口根目录**

因此，当前正确的引入映射是：

```javascript
// index.js
import Apple from '/components/apple'
```

我们需要 Flow 将`'/components/apple'`前头的`/`替换成`src/`，这样就是`'src/components/apple'`。

下面在`.flowconfig`的设置可以完成这个替换

```ini
[options]
module.name_mapper='^\/\(.*\)$' -> '<PROJECT_ROOT>/src/\1'
```

这里的`<PROJECT_ROOT>`在 Flow 里是一个特定的标识符代表`.flowconfig`所在的路径

注意：`module.name_mapper`可以有多个入口，除了[别名](module_resolution.html#别名)，还可以支持[绝对路径](module_resolution.html#绝对路径)，[波浪号路径](module_resolution.html#波浪号路径)解析

### TypeScript ~ 解析

TypeScript 需要了解你是如何使用 `~` 进行模块解析和别名映射。
更多信息请参考 [TypeScript 模块解析文档](https://www.typescriptlang.org/docs/handbook/module-resolution.html)

```json
// tsconfig.json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "~*": ["./src/*"]
    }
  }
}
```

### Monorepo 解析

下列是 Monorepo 目前建议的用法

建议：

- 使用相对路径
- 若使用根目录时，使用 `/`

不建议：

- **避免**在 monorepo 中使用 `~`

如果你是 monorepo 使用者且有意分享你的建议，请提交 issues 并提供一个范例以便讨论。
