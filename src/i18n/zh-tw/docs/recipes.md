# 🍰 秘方

## React

首先我們需要安裝 React 的相依套件。

[部落格文章](http://blog.jakoblind.no/react-parcel/)

```bash
npm install --save react
npm install --save react-dom
npm install --save-dev parcel-bundler
```

<sub>或者你也可以使用 Yarn 安裝</sub>

```bash
yarn add react
yarn add react-dom
yarn add --dev parcel-bundler
```

在 `package.json` 中加入啟動指令

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
npm install --save-dev parcel-bundler
```

<sub>或者是你想使用 Yarn 來管理套件</sub>

```bash
yarn add preact
yarn add --dev parcel-bundler
```

接著在 `package.json` 中加入啟動指令

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

在 `package.json` 中加入啟動指令

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
yarn add --dev typescript
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

搞定！

### 直接編譯 `.ts` 檔案

將啟動指令加入 `package.json`

```javascript
// package.json
"scripts": {
  "start": "parcel myTypescriptFile.ts"
}
```

搞定！編譯過的 `.js` 檔案將會在 dist 目錄中。

## Bootstrap + FontAwesome

首先需要安裝 Bootstrap 及 FontAwesome 的相依套件。

```bash
npm install bootstrap jquery popper.js
npm install --save-dev parcel-bundler @fortawesome/fontawesome-free
```

<sub>或者你也可以使用 Yarn 安裝</sub>

```bash
yarn add bootstrap jquery popper.js
yarn add --dev parcel-bundler @fortawesome/fontawesome-free
```

在 `package.json` 中加入啟動指令

```javascript
// package.json
"scripts": {
  "start": "parcel index.html"
}
```

### 匯入 Bootstrap 及預先編譯的樣式

建立一個 JavaScript 檔案作為 app 進入點，接著匯入任何必要的相依套件。

```javascript
// main.js
import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.css' // 匯入預先編譯的 Bootstrap CSS
import '@fortawesome/fontawesome-free/css/all.css'
```

然後在你的 `index.html` 中加入 JavaSctipt 進入點。

```html
<!-- index.html -->
<!DOCTYPE html>
<html lang="en">
  <head>
  </head>
  <body>
    <!-- 這裡 👇 -->
    <script src="./main.js"></script>
  </body>
</html>
```

搞定！

### 自訂 Bootstrap 樣式

若你想自訂 Bootstrap 樣式的話，可以建立一個 `.scss` 進入點，並引入 Bootstrap 樣式源碼。

```scss
// main.scss
@import "~bootstrap/scss/bootstrap";
```

接著建立一個 JavaScript 檔案作為 app 進入點，並匯入任何必要的相依套件。

```javascript
// main.js
import 'bootstrap'
import '@fortawesome/fontawesome-free/css/all.css'
import './main.scss' // 匯入剛建立的 scss 檔案
```

然後在你的 `index.html` 中加入 JavaSctipt 進入點。

```html
<!-- index.html -->
<!DOCTYPE html>
<html lang="en">
  <head>
  </head>
  <body>
    <!-- 這裡 👇 -->
    <script src="./main.js"></script>
  </body>
</html>
```

搞定！

## Svelte

首先我們需要安裝 Svelte 的相依套件。

[部落格文章](https://dev.to/alexparra/basic-svelte-app-with-parcel-30i5)

```bash
npm install --save-dev svelte
npm install --save-dev parcel-plugin-svelte
npm install --save-dev parcel-bundler
```

<sub>或者你也可以使用 Yarn 安裝</sub>

```bash
yarn add --dev svelte
yarn add --dev parcel-plugin-svelte
yarn add --dev parcel-bundler
```

### 從 index.html 編譯

在 `package.json` 中加入啟動指令

```javascript
// package.json
"scripts": {
  "start": "parcel src/index.html"
}
```

然後在你的 index.html 中加入 JavaSctipt 進入點。

```html
<!-- .src/index.html -->
<!DOCTYPE html>
<html lang="en">
<head>
  <title>My Svelte App</title>
</head>
<body>
  <!-- 這裡 👇 -->
  <script src="./src/main.js"></script>
</body>
</html>
```

搞定！
