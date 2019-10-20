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
npm install --save-dev parcel-bundler
```

<sub>Or if you have the optional Yarn package manager installed</sub>

```bash
yarn add preact
yarn add --dev parcel-bundler
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

## TypeScript

First we need to add Parcel and TypeScript to our project.

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

## Bootstrap + FontAwesome

First we need to install the dependencies for Bootstrap and FontAwesome.

```bash
npm install bootstrap jquery popper.js
npm install --save-dev parcel-bundler @fortawesome/fontawesome-free
```

<sub>Or if you have the optional Yarn package manager installed</sub>

```bash
yarn add bootstrap jquery popper.js
yarn add --dev parcel-bundler @fortawesome/fontawesome-free
```

Add Start script to `package.json`

```javascript
// package.json
"scripts": {
  "start": "parcel index.html"
}
```

### Importing Bootstrap with precompiled styles

Create a JavaScript file to act as the entry point for your app and import any necessary dependencies.

```javascript
// main.js
import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.css' // Import precompiled Bootstrap css
import '@fortawesome/fontawesome-free/css/all.css'
```

Then, in your `index.html` file, add a reference to your JavaScript entry point.

```html
<!-- index.html -->
<!DOCTYPE html>
<html lang="en">
  <head>
  </head>
  <body>
      <!-- Here 👇 -->
      <script src="./main.js"></script>
  </body>
</html>
```

Done!

### Customizing Bootstrap styles

If you wish to customize the Bootstrap styles instead of importing the precompiled css, create an entry point `.scss` file and include the Bootstrap source styles.

```scss
// main.scss
@import "~bootstrap/scss/bootstrap";
```

Next, create a JavaScript file to act as the entry point for your app and import any necessary dependencies.

```javascript
// main.js
import 'bootstrap'
import '@fortawesome/fontawesome-free/css/all.css'
import './main.scss' // Import our scss file
```

Then, in your `index.html` file, add a reference to your JavaScript entry point.

```html
<!-- index.html -->
<!DOCTYPE html>
<html lang="en">
  <head>
  </head>
  <body>
      <!-- Here 👇 -->
      <script src="./main.js"></script>
  </body>
</html>
```

Done!

## Svelte

First we need to install the dependencies for Svelte.

[Blog Post](https://dev.to/alexparra/basic-svelte-app-with-parcel-30i5)

```bash
npm install --save-dev svelte
npm install --save-dev parcel-plugin-svelte
npm install --save-dev parcel-bundler
```

<sub>Or if you have the optional Yarn package manager installed</sub>

```bash
yarn add --dev svelte
yarn add --dev parcel-plugin-svelte
yarn add --dev parcel-bundler
```

### Compiling from index.html

Add Start script to `package.json`

```javascript
// package.json
"scripts": {
  "start": "parcel src/index.html"
}
```

Then, in your `index.html` file, add a reference to your JavaScript entry point.

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

Done!
