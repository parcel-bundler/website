# 🍰 Recipes

## React

まず React の依存関係をインストールする必要があります。

[ブログの投稿](http://blog.jakoblind.no/react-parcel/)

```bash
npm install --save react
npm install --save react-dom
npm install --save-dev parcel-bundler
```

<sub>パッケージマネージャー Yarn をインストールして選択している場合</sub>

```bash
yarn add react
yarn add react-dom
yarn add --dev parcel-bundler
```

Start スクリプトを `package.json` に追加します。

```javascript
// package.json
"scripts": {
  "start": "parcel index.html"
}
```

## Preact

まず Preact の依存関係をインストールする必要があります。

```bash
npm install --save preact
npm install --save-dev parcel-bundler
```

<sub>パッケージマネージャー Yarn をインストールして選択している場合</sub>

```bash
yarn add preact
yarn add --dev parcel-bundler
```

Start スクリプトを `package.json` に追加します。

```javascript
// package.json
"scripts": {
  "start": "parcel index.html"
}
```

## Vue

まず Vue の依存関係をインストールする必要があります。

```bash
npm install --save vue
npm install --save-dev parcel-bundler
```

<sub>パッケージマネージャー Yarn をインストールして選択している場合</sub>

```bash
yarn add vue
yarn add --dev parcel-bundler
```

Start スクリプトを `package.json` に追加します。

```javascript
// package.json
"scripts": {
  "start": "parcel index.html"
}
```

## TypeScript

まずプロジェクトへ Parcel と TypeScript を追加する必要があります。

```bash
npm install --save-dev typescript
npm install --save-dev parcel-bundler
```

<sub>パッケージマネージャー Yarn をインストールして選択している場合</sub>

```bash
yarn add --dev typescript
yarn add --dev parcel-bundler
```

### index.html からコンパイルする

Start スクリプトを `package.json` に追加します。

```javascript
// package.json
"scripts": {
  "start": "parcel index.html"
}
```

次に、 `index.html` ファイルで `.ts` ファイルを参照するだけです。

```html
<!-- index.html -->
<!DOCTYPE html>
<html lang="en">
  <head> </head>
  <body>
    <!-- Here 👇 -->
    <script src="./myTypescriptFile.ts"></script>
  </body>
</html>
```

完了です！

### `.ts` ファイルを直接コンパイルする

Start スクリプトを `package.json` に追加します。

```javascript
// package.json
"scripts": {
  "start": "parcel myTypescriptFile.ts"
}
```

完了です! 😄 コンパイルされた `.js` ファイルは dist フォルダー内で見つけることができます。

## Bootstrap + FontAwesome

まず Bootstrap と FontAwesome の依存関係をインストールする必要があります。

```bash
npm install bootstrap jquery popper.js
npm install --save-dev parcel-bundler @fortawesome/fontawesome-free
```

<sub>パッケージマネージャー Yarn をインストールして選択している場合</sub>

```bash
yarn add bootstrap jquery popper.js
yarn add --dev parcel-bundler @fortawesome/fontawesome-free
```

Start スクリプトを `package.json` に追加します。

```javascript
// package.json
"scripts": {
  "start": "parcel index.html"
}
```

### プリコンパイル済みのスタイルで Bootstrap をインポートする

アプリのエントリポイントとして機能する JavaScript ファイルを作成し、必要な依存関係をインポートします。

```javascript
// main.js
import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.css' // プリコンパイル済みの Bootstrap css をインポートします
import '@fortawesome/fontawesome-free/css/all.css'
```

次に、 `index.html` ファイルで JavaScript エントリポイントへの参照を追加します。

```html
<!-- index.html -->
<!DOCTYPE html>
<html lang="en">
  <head> </head>
  <body>
    <!-- Here 👇 -->
    <script src="./main.js"></script>
  </body>
</html>
```

完了です！

### Bootstrap のスタイルをカスタマイズ

プリコンパイルされた css をインポートせずに Bootstrap のスタイルをカスタマイズしたい場合、エントリポイントの `.scss` ファイルを作成し、Bootstrap のスタイルのソースを含めます。

```scss
// main.scss
@import '~bootstrap/scss/bootstrap';
```

次に、アプリのエントリポイントとして機能する JavaScript ファイルを作成し、必要な依存関係をインポートします。

```javascript
// main.js
import 'bootstrap'
import '@fortawesome/fontawesome-free/css/all.css'
import './main.scss' // scss ファイルをインポートします
```

次に、 `index.html`ファイルで、JavaScript エントリポイントへの参照を追加します。

```html
<!-- index.html -->
<!DOCTYPE html>
<html lang="en">
  <head> </head>
  <body>
    <!-- Here 👇 -->
    <script src="./main.js"></script>
  </body>
</html>
```

完了です！

## Svelte

まず Svelte の依存関係をインストールする必要があります。

[ブログの投稿](https://dev.to/alexparra/basic-svelte-app-with-parcel-30i5)

```bash
npm install --save-dev svelte
npm install --save-dev parcel-plugin-svelte
npm install --save-dev parcel-bundler
```

<sub>パッケージマネージャー Yarn をインストールして選択している場合</sub>

```bash
yarn add --dev svelte
yarn add --dev parcel-plugin-svelte
yarn add --dev parcel-bundler
```

### index.html からコンパイルする

Start スクリプトを `package.json` に追加します。

```javascript
// package.json
"scripts": {
  "start": "parcel src/index.html"
}
```

次に、 `index.html`ファイルで、JavaScript エントリポイントへの参照を追加します。

```html
<!-- .src/index.html -->
<!DOCTYPE html>
<html lang="en">
  <head>
    <title>My Svelte App</title>
  </head>
  <body>
    <!-- Here 👇 -->
    <script src="./src/main.js"></script>
  </body>
</html>
```

完了です！
