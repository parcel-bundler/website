# 🖥 CLI

## Commands

### 服务（Serve）

serve 命令启用一个开发服务器，且支持 [热模块替换](hmr.html) 以实现快速开发。当你更改文件时，该服务器将自动重新构建你的应用程序。

```bash
parcel index.html
```

你也可以为多个入口点传递一个[glob](https://github.com/isaacs/node-glob)或 glob 列表。

```bash
parcel one.html two.html
# 或
parcel *.html
# 或
parcel ./**/*.html
```

### 构建（Build）

build 命令会一次性构建资源，它还启用了压缩功能，并将 NODE_ENV 变量设置为生产环境。详见[生产环境](production.html)

```bash
parcel build index.html
```

_注意:_ 对于特殊用例，它也可以从开发环境执行单次构建：

```
NODE_ENV=development parcel build <entrypoint> --no-minify
```

产生与`serve`相同的打包，但是没有监听或资源服务。

### 监听（Watch）

监听（watch）命令与服务器类似，主要区别在于它并不会启动服务器。

```bash
parcel watch index.html
```

### 帮助（Help）

尽可能的显示所有 cli 的选项

```bash
parcel help
```

### 版本（Version）

显示 Parcel 版本号

```bash
parcel --version
```

## Options

### 设置输出目录

默认为："dist"

可用于：`serve`，`watch`，`build`

```bash
parcel build entry.js --out-dir build/output
# 或者
parcel build entry.js -d build/output
```

```base
root
- build
- - output
- - - entry.js
```

### 设置要提供服务的公共 URL

默认为："/"

可用于：`serve`，`watch`，`build`

```bash
parcel entry.js --public-url ./dist/
```

将输出到：

```html
<link rel="stylesheet" type="text/css" href="/dist/entry.1a2b3c.css" />
<!-- 或者 -->
<script src="/dist/entry.e5f6g7.js"></script>
```

### 目标（Target）

默认为：browser

可用于：`serve`，`watch`，`build`

```bash
parcel build entry.js --target node
```

⚠️ Target 为`node` and `electron`的将不会打包`dependencies`（然而却包含`devDependencies`）。使用[--bundle-node-modules](#force-node-modules-bundling) 标记可以覆盖这样的行为（往下看）

可选的目标（target）：`node`, `browser`, `electron`

### 强制 node 模块打包

默认为：false

可用于： `serve`, `watch`, `build`

```bash
parcel build entry.js --target node --bundle-node-modules
```

默认情况下，当使用 `--target node` 或 `--target electron`时，package.json's `dependencies`将不包含在打包中。这个标记就是为了添加它们进去。

### 缓存目录

默认为: ".cache"

可用于： `serve`, `watch`, `build`

```bash
parcel build entry.js --cache-dir build/cache
```

### 端口

默认为：1234

可用于： `serve`

```bash
parcel serve entry.js --port 1111
```

### 更改日志级别

默认为：3

可用于：`serve`, `watch`, `build`

```bash
parcel entry.js --log-level 1
```

| 日志等级 | 效果           |
| -------- | -------------- |
| 0        | 禁用记录       |
| 1        | 只记录错误     |
| 2        | 记录错误和警告 |
| 3        | 记录一切       |

### HMR 主机名

默认为：当前 window 的 `location.hostname`

可用于：`serve`，`watch`

```bash
parcel entry.js --hmr-hostname parceljs.org
```

### HMR 端口

默认为：可访问的随机端口

可用于：`serve`, `watch`

```bash
parcel entry.js --hmr-port 8080
```

### 输出的文件名

默认为：源文件名称

可用于：`serve`，`watch`，`build`

```bash
parcel build entry.js --out-file output.html
```

这改变了入口 bundle 的输出文件名。

### 打印详细的报告

默认为：精简报告

可选参数指定要打印报告的深度（depth）

可用于：`build`

```bash
parcel build entry.js --detailed-report
parcel build entry.js --detailed-report 10
```

### 启用 https

默认为：不启用 https

可用于： `serve`，`watch`（热更新 hmr 采用 https 连接）

```bash
parcel entry.js --https
```

⚠️ 这个配置会生成一个自签名证书，你可能需要配置你的浏览器，使之接受 localhost 上的自签名证书。

### 设置一个自定义证书

默认为：不启用 https

可用于：`serve`，`watch`

```bash
parcel entry.js --cert certificate.cert --key private.key
```

### 在浏览器中打开

默认为：禁用

可用于：`serve`

```bash
parcel entry.js --open
```

### 禁用源代码映射（source-maps）

默认为：启用

可用于：`serve`，`watch`，`build`

```bash
parcel build entry.js --no-source-maps
```

### 禁用文件 hash 命名（content-hash）

默认为：启用

可用于：`build`

```bash
parcel build entry.js --no-content-hash
```

### 禁用自动安装依赖（autoinstall）

默认为：启用

可用于：`serve`，`watch`

```bash
parcel entry.js --no-autoinstall
```

### 禁用热替换（HMR）

默认为：启用

可用于：`serve`，`watch`

```bash
parcel entry.js --no-hmr
```

### 禁用代码压缩（minification）

默认为：启用

可用于：`build`

```bash
parcel build entry.js --no-minify
```

### 禁用文件系统缓存

默认为：缓存启用

可用于：`serve`, `watch`, `build`

```bash
parcel build entry.js --no-cache
```

### UMD 方式暴露模块

默认为：禁止

可用于：`serve`, `watch`, `build`

```bash
parcel serve entry.js --global myvariable
```

### 开启实验性的 scope hoisting/tree shaking 支持

默认为：禁止

可用于：`build`

```bash
parcel build entry.js --experimental-scope-hoisting
```

更多信息，请查看 Devon Govett's post on Parcel 1.9
[Tree Shaking section](https://medium.com/@devongovett/parcel-v1-9-0-tree-shaking-2x-faster-watcher-and-more-87f2e1a70f79#4ed3)
