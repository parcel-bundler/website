# 🍰 秘方

## React

首先我們需要安裝 React 的相依套件。

[部落格文章](http://blog.jakoblind.no/react-parcel/)

```bash
npm install --save react
npm install --save react-dom
npm install --save-dev parcel-bundler
```

<sub>或者是你想使用 Yarn 來管理套件</sub>

```bash
yarn add react
yarn add react-dom
yarn add --dev parcel-bundler
```

在 `package.json` 中增加啟動指令

```javascript
// package.json
"scripts": {
  "start": "parcel index.html"
}
```

## Preact

首先我們需要安裝 Preact 的相依套件。

```bash
npm install --save preact
npm install --save preact-compat
npm install --save-dev parcel-bundler
npm install --save-dev babel-preset-preact
```

<sub>或者是你想使用 Yarn 來管理套件</sub>

```bash
yarn add preact
yarn add preact-compat
yarn add --dev parcel-bundler
yarn add --dev babel-preset-preact
```

確保你的 Babel 設定如下：

```javascript
// .babelrc
{
  "presets": [
    "preact"
  ]
}
```

接著在 `package.json` 中增加啟動指令

```javascript
// package.json
"scripts": {
  "start": "parcel index.html"
}
```

## Vue

首先我們需要安裝 Vue 的相依套件。

```bash
npm install --save vue
npm install --save-dev parcel-bundler
```

<sub>或者是你想使用 Yarn 來管理套件</sub>

```bash
yarn add vue
yarn add --dev parcel-bundler
```

在 `package.json` 中增加啟動指令

```javascript
// package.json
"scripts": {
  "start": "parcel index.html"
}
```

## TypeScript

首先我們將 Parcel 及 TypeScript 加入至專案。

```bash
npm install --save-dev typescript
npm install --save-dev parcel-bundler
```

<sub>或者你想使用 yarn 來安裝</sub>

```bash
yarn add typescript --dev
yarn add --dev parcel-bundler
```

### 由 index.html 進行編譯

將啟動指令加入 `package.json`

```javascript
// package.json
"scripts": {
  "start": "parcel index.html"
}
```

接著在你的 `index.html` 中引用你的 `.ts` 檔案即可。

```html
<!-- index.html -->
<!DOCTYPE html>
<html lang="en">
<head>
</head>
<body>
  <!-- 這裡 👇 --> 
  <script src="./myTypescriptFile.ts"></script>
</body>
</html>
```

完成！

### 直接編譯 `.ts` 檔案

將啟動指令加入 `package.json`

```javascript
// package.json
"scripts": {
  "start": "parcel myTypescriptFile.ts"
}
```

完成！ 😄 編譯過的 `.js` 檔案將會在 dist 目錄中。
