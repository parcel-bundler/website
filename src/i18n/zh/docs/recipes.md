# 🍰 配方(Recipes)

## React

首先需要安装 React 相关的依赖。

[博客](http://blog.jakoblind.no/react-parcel/)

```
npm install --save react
npm install --save react-dom
npm install --save-dev parcel-bundler
npm install --save-dev babel-preset-env
npm install --save-dev babel-preset-react
```

<sub>或者如果你安装了 Yarn 包管理器</sub>

```
yarn add react
yarn add react-dom
yarn add --dev parcel-bundler
yarn add --dev babel-preset-env
yarn add --dev babel-preset-react
```

然后确保以下 Babel 预设存在。

```javascript
 // .babelrc
{
  "presets": ["env", "react"]
}
```

在 `package.json` 中添加 start 命令

```javascript
// package.json
"scripts": {
  "start": "parcel index.html"
}
```

## Preact

首先需要安装 Preact 相关的依赖。

```
npm install --save preact
npm install --save preact-compat
npm install --save-dev parcel-bundler
npm install --save-dev babel-preset-env
npm install --save-dev babel-preset-preact
```

<sub>或者如果你安装了 Yarn 包管理器</sub>

```
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

在 `package.json` 中添加 start 命令

```javascript
// package.json
"scripts": {
  "start": "parcel index.html"
}
```
