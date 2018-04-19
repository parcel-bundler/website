# 🍰 レシピ

## React

まずはReactの依存関係をインストールする必要があります。

[ブログ記事](http://blog.jakoblind.no/react-parcel/)

```bash
npm install --save react
npm install --save react-dom
npm install --save-dev parcel-bundler
```

<sub>またはYarnパッケージマネージャがインストールされている場合</sub>

```bash
yarn add react
yarn add react-dom
yarn add --dev parcel-bundler
```

`package.json`にスタートスクリプトを登録します。

```javascript
// package.json
"scripts": {
  "start": "parcel index.html"
}
```

## Preact

まずはPreactの依存関係をインストールする必要があります。

```bash
npm install --save preact
npm install --save preact-compat
npm install --save-dev parcel-bundler
npm install --save-dev babel-preset-env
npm install --save-dev babel-preset-preact
```

<sub>またはYarnパッケージマネージャがインストールされている場合</sub>

```bash
yarn add preact
yarn add preact-compat
yarn add --dev parcel-bundler
yarn add --dev babel-preset-env
yarn add --dev babel-preset-preact
```

次に、以下のBabel設定が存在することを確認します。

```javascript
// .babelrc
{
  "presets": ["env", "preact"]
}
```

`package.json`にスタートスクリプトを登録します。

```javascript
// package.json
"scripts": {
  "start": "parcel index.html"
}
```

## Vue

まずはVueの依存関係をインストールする必要があります。

```bash
npm install --save vue
npm install --save-dev parcel-bundler
```

<sub>またはYarnパッケージマネージャがインストールされている場合</sub>

```bash
yarn add vue
yarn add --dev parcel-bundler
```

`package.json`にスタートスクリプトを登録します。

```javascript
// package.json
"scripts": {
  "start": "parcel index.html"
}
```
