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
npm install --save preact-compat
npm install --save-dev parcel-bundler
npm install --save-dev babel-preset-env
npm install --save-dev babel-preset-preact
```

<sub>或者如果说你安装了 Yarn 包管理器，作为 npm 的备选</sub>

```bash
yarn add preact
yarn add preact-compat
yarn add --dev parcel-bundler
yarn add --dev babel-preset-env
yarn add --dev babel-preset-preact
```

然后确保以下 Babel 预设存在.

```javascript
// .babelrc
{
  "presets": ["env", "preact"]
}
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
