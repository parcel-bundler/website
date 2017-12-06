# 🍰 Recipes

## React

First need to install the dependencies for React.

[Blog Post](http://blog.jakoblind.no/react-parcel/)

```
npm install --save react react-dom npm install --save-dev parcel-bundler
babel-preset-env babel-preset-react
```

Then make sure the following Babel config is present.

```js
 // .babelrc
{
  "presets": ["env", "react"]
}
```

Add Start script to `package.json`

```js
// package.json
"scripts": {
  "start": "parcel index.html"
  }
```

## Preact

First we need to install the dependencies for Preact.

```
npm install --save preact preact-compat npm install --save-dev parcel-bundler
babel-preset-env babel-preset-preact
```

Then make sure the following Babel config is present.

```js
// .babelrc
{
  "presets": ["env", "preact"]
}
```

Add Start script to `package.json`

```js
// package.json
"scripts": {
  "start": "parcel index.html"
  }
```
