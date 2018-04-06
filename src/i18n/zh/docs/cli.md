# 🖥 CLI

## Commands

### 服务

serve 命令启用一个开发服务器，且支持 [热模块替换](hmr.html) 以实现快速开发。当你更改文件时，该服务器将自动重新构建你的应用程序。

```bash
parcel index.html
```

### 构建（Build）

build 命令会一次性构建资源，它还启用了压缩功能，并将 NODE_ENV 变量设置为生产环境。详见[生产环境](production.html)

```bash
parcel build index.html
```

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

## Options

### 设置输出目录

默认为："dist"

可用于：`serve`，`watch`，`build`

```bash
parcel build entry.js --out-dir build/output
或者
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
parcel build entry.js --public-url ./dist/
```

将输出到：

```html
<link rel="stylesheet" type="text/css" href="/dist/entry.1a2b3c.css">
或者
<script src="/dist/entry.e5f6g7.js"></script>
```

### 目标（Target）

默认为：browser

可用于：`serve`，`watch`，`build`

```bash
parcel build entry.js --target node
```

可选的目标（target）：node，browser 和 electron

### 更改日志级别

默认为：3

可用于：`serve`, `watch`, `build`

```bash
parcel build entry.js --log-level 1
```

| 日志等级 | 效果                 |
|---       |---                 |
| 0        | 禁用记录             |
| 1        | 只记录错误           |
| 2        | 记录错误和警告        |
| 3        | 记录一切             |

### HMR 主机名

默认为：当前 window 的 `location.hostname`

可用于：`serve`，`watch`

```bash
parcel build entry.js --hmr-hostname parceljs.org
```

### HMR 端口

默认为：可访问的随机端口

可用于：`serve`, `watch`

```bash
parcel build entry.js --hmr-port 8080
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

可用于：`build`

```bash
parcel build entry.js --detailed-report
```

### 设置一个自定义证书

默认为：生成一个证书

可用于：`serve`

```bash
parcel build entry.js --cert certificate.cert --key private.key
```

### 在浏览器中打开

默认为：禁用开启

可用于：`serve`

```bash
parcel build entry.js --open
```

### 禁用 source-maps

默认为：source-maps 启用

可用于：`serve`，`watch`，`build`

```bash
parcel build entry.js --no-source-maps
```

### 禁用 autoinstall

默认为：autoinstall 启用

可用于：`serve`，`watch`

```bash
parcel build entry.js --no-autoinstall
```

### 禁用 HMR

默认为：HMR 启用

可用于：`serve`，`watch`

```bash
parcel build entry.js --no-hmr
```

### 禁用 minification

默认为：minification 启用

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