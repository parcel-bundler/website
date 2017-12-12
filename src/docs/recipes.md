# 🍰 Recipes

## React

First need to install the dependencies for React.

[Blog Post](http://blog.jakoblind.no/react-parcel/)

```
npm install --save react
npm install --save react-dom
npm install --save-dev parcel-bundler
npm install --save-dev babel-preset-env
npm install --save-dev babel-preset-react
```

<sub>Or if you have the optional Yarn package manager installed</sub>

```
yarn add react
yarn add react-dom
yarn add --dev parcel-bundler
yarn add --dev babel-preset-env
yarn add --dev babel-preset-react
```

Then make sure the following Babel config is present.

```javascript
 // .babelrc
{
  "presets": ["env", "react"]
}
```

Add Start script to `package.json`

```javascript
// package.json
"scripts": {
  "start": "parcel index.html"
}
```

## Preact

First we need to install the dependencies for Preact.

```
npm install --save preact
npm install --save preact-compat
npm install --save-dev parcel-bundler
npm install --save-dev babel-preset-env
npm install --save-dev babel-preset-preact
```

<sub>Or if you have the optional Yarn package manager installed</sub>

```
yarn add preact
yarn add preact-compat
yarn add --dev parcel-bundler
yarn add --dev babel-preset-env
yarn add --dev babel-preset-preact
```

Then make sure the following Babel config is present.

```javascript
// .babelrc
{
  "presets": ["env", "preact"]
}
```

Add Start script to `package.json`

```javascript
// package.json
"scripts": {
  "start": "parcel index.html"
}
```
