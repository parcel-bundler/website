# 🍰 配方(Recipes)

## React

首先需要安装 React 相关的依赖。

[博客](http://blog.jakoblind.no/react-parcel/)

```bash
npm install --save react
npm install --save react-dom
npm install --save-dev parcel-bundler
```

<sub>或者如果你安装了 Yarn 包管理器</sub>

```bash
yarn add react
yarn add react-dom
yarn add --dev parcel-bundler
```

添加 start 指令到 `package.json`

```javascript
// package.json
"scripts": {
  "start": "parcel index.html"
}
```

## Preact

首先需要安装 Preact 相关的依赖。

```bash
npm install --save preact
npm install --save-dev parcel-bundler
```

<sub>或者如果说你安装了 Yarn 包管理器，作为 npm 的备选</sub>

```bash
yarn add preact
yarn add --dev parcel-bundler
```

向 `package.json` 的 scripts 中添加 start 脚本。

```javascript
// package.json
"scripts": {
  "start": "parcel index.html"
}
```

## Vue

首先，我们需要安装 Vue 的依赖关系。

```bash
npm install --save vue
npm install --save-dev parcel-bundler
```

<sub>或者如果说你安装了 Yarn 包管理器，作为 npm 的备选</sub>

```bash
yarn add vue
yarn add --dev parcel-bundler
```

向 `package.json` 的 scripts 中添加 start 脚本。

```javascript
// package.json
"scripts": {
  "start": "parcel index.html"
}
```

## Typescript

首先，我们需要添加 Parcel 和 Typescript 到你的项目里。

```bash
npm install --save-dev typescript
npm install --save-dev parcel-bundler
```

<sub>或者如果说你安装了 Yarn 包管理器，作为 npm 的备选</sub>

```bash
yarn add --dev typescript
yarn add --dev parcel-bundler
```

### 从 index.html 开始编译

添加 start 脚本到`package.json`

```javascript
// package.json
"scripts": {
  "start": "parcel index.html"
}
```

接着，在你的`index.html`文件，简单的引入你的`.ts`文件

```html
<!-- index.html -->
<!DOCTYPE html>
<html lang="en">
  <head> </head>
  <body>
    <!-- 这里 👇 -->
    <script src="./myTypescriptFile.ts"></script>
  </body>
</html>
```

完成！

### 直接编译`.ts`文件

添加 start 脚本到`package.json`

```javascript
// package.json
"scripts": {
  "start": "parcel myTypescriptFile.ts"
}
```

完成！😄 在 dist 文件夹中将发现编译后的`.js`文件
