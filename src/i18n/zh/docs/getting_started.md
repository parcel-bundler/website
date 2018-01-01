# 🚀 快速开始

Parcel 是 Web 应用打包工具，适用于经验不同的开发者。它利用多核处理提供了极快的速度，并且不需要任何配置。

首先通过 Yarn 或者 npm 安装 Parcel ：

Yarn:
```bash
yarn global add parcel-bundler
```

npm:
```bash
npm install -g parcel-bundler
```

在你正在使用的项目目录下创建一个 package.json 文件：

```bash
yarn init -y
```
or 
```bash
npm init -y
```

Parcel 可以使用任何类型的文件作为入口，但是最好还是使用 HTML 或 JavaScript 文件。如果在 HTML 中使用相对路径引入主要的 JavaScript 文件，Parcel 也将会对它进行处理将其替换为相对于输出文件的 URL 地址。

接下来，创建一个 index.html 和 index.js 文件。

```html
<html>
<body>
  <script src="./index.js"></script>
</body>
</html>
```

```javascript
console.log("hello world");
```

Parcel 内置了一个当你改变文件时能够自动重新构建应用的开发服务器，而且为了实现快速开发，该开发服务器支持[热模块替换](hmr.html)。只需要在入口文件指出：

```bash
parcel index.html
```

现在在浏览器中打开 [http://localhost:1234/](http://localhost:1234/)。你也可以使用 `-p <port number>` 选项覆盖默认的端口。
如果没有自己的服务器可使用开发服务器，或者你的应用程序完全由客户端呈现。如果有自己的服务器，你可以在`watch` 模式下运行 Parcel 。当文件改变它仍然会自动重新构建并支持热替换，但是不会启动 web 服务。

```bash
parcel watch index.html
```

当你准备在生产模式下创建，`build` 模式会关闭监听并且只建立一次。请查阅 [Production](production.html) 查看更多细节。

