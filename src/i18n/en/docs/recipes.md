# 🍰 Recipes

## React

First we need to install the dependencies for React.

[Blog Post](http://blog.jakoblind.no/react-parcel/)

```bash
npm install --save react
npm install --save react-dom
npm install --save-dev parcel-bundler
```

<sub>Or if you have the optional Yarn package manager installed</sub>

```bash
yarn add react
yarn add react-dom
yarn add --dev parcel-bundler
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

```bash
npm install --save preact
npm install --save preact-compat
npm install --save-dev parcel-bundler
npm install --save-dev babel-core
npm install --save-dev babel-preset-preact
```

<sub>Or if you have the optional Yarn package manager installed</sub>

```bash
yarn add preact
yarn add preact-compat
yarn add --dev parcel-bundler
yarn add --dev babel-core
yarn add --dev babel-preset-preact
```

You should manually add [babel-core](https://www.npmjs.com/package/babel-core) for [babel-preset-preact](https://github.com/developit/babel-preset-preact) has not supported babel7 yet

Then make sure the following Babel config is present.

```javascript
// .babelrc
{
  "presets": [
    "preact"
  ]
}
```

Add Start script to `package.json`

```javascript
// package.json
"scripts": {
  "start": "parcel index.html"
}
```

## Vue

First we need to install the dependencies for Vue.

```bash
npm install --save vue
npm install --save-dev parcel-bundler
```

<sub>Or if you have the optional Yarn package manager installed</sub>

```bash
yarn add vue
yarn add --dev parcel-bundler
```

Add Start script to `package.json`

```javascript
// package.json
"scripts": {
  "start": "parcel index.html"
}
```

## Typescript

First we need to add Parcel and Typescript to our project.

```bash
npm install --save-dev typescript
npm install --save-dev parcel-bundler
```

<sub>Or if you have the optional Yarn package manager installed</sub>

```bash
yarn add --dev typescript
yarn add --dev parcel-bundler
```

### Compiling from index.html

Add Start script to `package.json`

```javascript
// package.json
"scripts": {
  "start": "parcel index.html"
}
```

Then, in your `index.html` file, simply reference your `.ts` file.

```html
<!-- index.html -->
<!DOCTYPE html>
<html lang="en">
<head>
</head>
<body>
    <!-- Here 👇 -->
    <script src="./myTypescriptFile.ts"></script>
</body>
</html>
```

Done!

### Compiling the `.ts` file directly

Add Start script to `package.json`

```javascript
// package.json
"scripts": {
  "start": "parcel myTypescriptFile.ts"
}
```

Done! 😄 Compiled `.js` file can be found inside the dist folder.
