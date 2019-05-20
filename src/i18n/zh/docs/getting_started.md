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
console.log('hello world')
```

Parcel 内置了一个当你改变文件时能够自动重新构建应用的开发服务器，而且为了实现快速开发，该开发服务器支持[热模块替换](hmr.html)。只需要在入口文件指出：

```bash
parcel index.html
```

现在在浏览器中打开 [http://localhost:1234/](http://localhost:1234/)。如果模块热重载没有生效，你可能需要[配置你的编辑器](hmr.html#safe-write)。你也可以使用 `-p <port number>` 选项覆盖默认的端口。
如果没有自己的服务器可使用开发服务器，或者你的应用程序完全由客户端呈现。如果有自己的服务器，你可以在`watch` 模式下运行 Parcel 。当文件改变它仍然会自动重新构建并支持热替换，但是不会启动 web 服务。

```bash
parcel watch index.html
```

你也能使用[createapp.dev](https://createapp.dev/parcel)在浏览器中创建一个 Parcel 项目。选择你需要的特性列如 React， Vue，Typescript 和 CSS，然后你将会看到项目实时生成。你能通过这个工具去学习如何怎么建立一个新的项目并且你也能下载这个项目作为一个 zip 文件然后立即开始写代码。

## 多个文件入口

假设你有超过一个的入口文件，比如是`index.html` and `about.html`，你有两种方式来打包：

指定当前文件的名字：

```bash
parcel index.html about.html
```

使用 tokens 并创建一个 glob：

```bash
parcel ./**/*.html
```

_注意:_ 假设你的文件目录结构如下:

```
- folder-1
-- index.html
- folder-2
-- index.html
```

打开 http://localhost:1234/folder-1/ 是不行的，反而你需要显式地指向文件 http://localhost:1234/folder-1/index.html。

## 生产模式构建

当你准备在生产模式下创建，`build` 模式会关闭监听并且只建立一次。请查阅 [Production](production.html) 查看更多细节。

## 添加 parcel 到你的项目

有时全局安装 Parcel 是不可能的。举个例子，假如你正在构建其他人的 build agent 或者你想使用 CI 以编程的方式构建你的项目。如果这样，你可以将 Parcel 作为本地包安装并运行。

Yarn 方式安装：

```bash
yarn add parcel-bundler --dev
```

NPM 方式安装：

```bash
npm install parcel-bundler --save-dev
```

接着，通过修改你的`package.json`来添加这些任务脚本

```json
{
  "scripts": {
    "dev": "parcel <your entry file>",
    "build": "parcel build <your entry file>"
  }
}
```

然后，你就能运行它了：

```bash
# 以开发模式运行
yarn dev
# 或
npm run dev

# 以生成模式运行
yarn build
# 或
npm run build
```
