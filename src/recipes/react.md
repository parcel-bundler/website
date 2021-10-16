---
layout: layout.njk
title: React
eleventyNavigation:
  key: recipes-react
  title: <img src="/assets/lang-icons/react.svg" alt=""/> React
  order: 3
---

Parcel works great for building single or multi-page React applications. It includes a first-class development experience with Fast Refresh, and supports JSX, TypeScript, Flow, and many styling methodologies out of the box.

## Getting started

First, install `react` and `react-dom` into your project:

```shell
yarn add react react-dom
```

Most Parcel apps start with an HTML file. Parcel follows the dependencies (such as a `<script>` tag) from there to build your app.

{% sample %}
{% samplefile "src/index.html" %}

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>My Parcel App</title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="index.js"></script>
  </body>
</html>
```

{% endsamplefile %}
{% samplefile "src/index.js" %}

```jsx
import ReactDOM from "react-dom";
import { App } from "./App";

const app = document.getElementById("app");
ReactDOM.render(<App />, app);
```

{% endsamplefile %}
{% samplefile "src/App.js" %}

```jsx
export function App() {
  return <h1>Hello world!</h1>;
}
```

{% endsamplefile %}
{% endsample %}

As you can see, we’ve referenced `index.js` from a `<script>` element in our HTML file. This imported `react-dom` and used it to render our `App` component into the `<div id="app">` element in our page.

See [Building a web app with Parcel](/getting-started/webapp/) for more details on getting started with a new project.

## JSX

Parcel supports JSX automatically when it detects you are using React. If you’re using React 17 or later, it also automatically enables the [modern JSX transform](https://reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html), which means you don't even need to import React for JSX to work, as you can see in `App.js` in the above example.

To learn more about JSX, see [Introducing JSX](https://reactjs.org/docs/introducing-jsx.html) and [JSX In Depth](https://reactjs.org/docs/jsx-in-depth.html) in the React docs, and the [JSX](/languages/javascript/#jsx) section from Parcel's JavaScript docs for details on how you can configure some details of how it's handled.

## Fast Refresh

Parcel has first-class support for [React Fast Refresh](https://reactnative.dev/docs/fast-refresh), which gives you quick feedback as you edit your code without needing to reload the page. In most cases, it can preserve component state as code is edited, even if you make an error. See the [Hot reloading](/features/development#hot-reloading) docs for details on how this works.

### Tips

- **Avoid class components** – Fast Refresh only works with function components (and Hooks).
- **Export only React components** – If a file exports a mix of React components and other types of values, its state will be reset whenever it changes. To preserve state, only export React components and move other exports to a different file if possible.
- **Avoid unnamed default exports** – Declaring components using a default exported arrow function will cause state to be reset when it is changed. Use a named function, or assign the arrow function to a variable instead.
- **Keep entry components in their own files** – Entry components should be in a separate file from the one that calls `ReactDOM.render` or they will be remounted on every change.

For more tips, see the official [React Fast Refresh docs](https://reactnative.dev/docs/fast-refresh).

## TypeScript

[TypeScript](https://www.typescriptlang.org/) is supported out of the box. You can reference a `.ts` or `.tsx` file from your HTML page, and Parcel will compile it as you'd expect.

To add TypeScript definitions for React, install the following packages into your project:

```shell
yarn add @types/react @types/react-dom --dev
```

See the [TypeScript](/languages/typescript/) docs for more details on using TypeScript with Parcel.

## Flow

[Flow](https://flow.org/) is supported automatically when it is installed. To add it to an existing project, first install `flow-bin` as a dependency:

```shell
yarn add flow-bin --dev
```

Then, use the `// @flow` directive at the top of the files you'd like to type check. This also signals to Parcel which files can have Flow types that should be stripped when compiling for the browser.

See the [Flow](/languages/javascript/#flow) docs for more details on using Flow with Parcel.

## Styling

Parcel supports many different ways of styling applications written with React.

### CSS

You can import a CSS file into a JavaScript or TypeScript file to load it along with a component.

{% sample %}
{% samplefile "Button.js" %}

```jsx/0
import './Button.css';

export function Button({ children }) {
  return (
    <button className="button">
      {children}
    </button>
  );
}
```

{% endsamplefile %}
{% samplefile "Button.css" %}

```css
.button {
  background: hotpink;
}
```

{% endsamplefile %}
{% endsample %}

You can also load CSS using a standard `<link rel="stylesheet">` element in your HTML file, but referencing CSS from your components helps make it clear which components depend on which CSS. This can also help with code splitting because only the CSS necessary for the components that you render will be loaded.

Parcel also supports CSS languages like [SASS](/languages/sass/), [Less](/languages/less/), and [Stylus](/languages/stylus/). See [CSS](/languages/css/) for more details on how CSS is processed by Parcel.

### CSS modules

By default, CSS imported from JavaScript is global. If two CSS files define the same class names, they will potentially clash and overwrite each other. To solve this, Parcel supports [CSS modules](https://github.com/css-modules/css-modules).

CSS modules treat the classes defined in each file as unique. Each class name is renamed to include a unique hash, and a map is exported to JavaScript to allow referencing these renamed class names.

To use CSS modules, create a file with the `.module.css` extension, and import it from a JavaScript file with a [namespace import](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import#import_an_entire_modules_contents). Then, you can use the exports of the CSS module when rendering elements in JSX.

{% sample %}
{% samplefile "Button.js" %}

```jsx/0,4
import * as classes './Button.module.css';

export function Button({ children }) {
  return (
    <button className={classes.button}>
      {children}
    </button>
  );
}
```

{% endsamplefile %}
{% samplefile "Button.module.css" %}

```css
.button {
  background: hotpink;
}
```

{% endsamplefile %}
{% endsample %}

See [CSS modules](/languages/css/#css-modules) to learn more about how Parcel handles CSS modules.

### CSS-in-JS

CSS-in-JS libraries like [Styled Components](https://styled-components.com), [Emotion](https://emotion.sh/docs/introduction), and many others work well with Parcel. Some may require build configuration, such as a [Babel](/languages/javascript/#babel) plugin. To enable it, create a Babel configuration in your project and Parcel will pick it up automatically.

For example, to use Emotion, install the Babel plugin and create a `.babelrc` in your project:

```shell
yarn add @emotion/babel-plugin --dev
yarn add @emotion/react
```

{% sample %}
{% samplefile ".babelrc" %}

```json
{
  "plugins": ["@emotion/babel-plugin"]
}
```

{% endsamplefile %}
{% endsample %}

You’ll also need to set the `jsxImportSource` option in a `tsconfig.json` or `jsconfig.json` so that Emotion's JSX pragma is used instead of the default one. This enables the `css` prop to work.

{% sample %}
{% samplefile "jsconfig.json" %}

```json
{
  "compilerOptions": {
    "jsxImportSource": "@emotion/react"
  }
}
```

{% endsamplefile %}
{% endsample %}

Now, you can render elements with CSS-in-JS:

{% sample %}
{% samplefile "Button.js" %}

```jsx
import { css } from "@emotion/react";

export function Button({ children }) {
  return (
    <button
      css={css`
        background: hotpink;
        &:hover {
          background: purple;
        }
      `}
    >
      {children}
    </button>
  );
}
```

{% endsamplefile %}
{% endsample %}

### Tailwind CSS

[Tailwind CSS](https://tailwindcss.com) is a popular utility-first CSS framework. It uses [PostCSS](/languages/css/#postcss) to build a CSS file containing only the classes you use in your code.

To use it, first, install the necessary dependencies:

```shell
yarn add tailwindcss postcss autoprefixer --dev
```

Next, create the config files needed for PostCSS and Tailwind. This example will use Tailwind’s [JIT mode](https://tailwindcss.com/docs/just-in-time-mode) to speed up builds by only compiling the classes you use. Make sure you modify the glob passed to the `purge` option so it matches all of the source files where you'll use Tailwind classes.

{% sample %}
{% samplefile ".postcssrc" %}

```json
{
  "plugins": {
    "tailwindcss": {},
    "autoprefixer": {}
  }
}
```

{% endsamplefile %}
{% samplefile "tailwind.config.js" %}

```javascript
module.exports = {
  mode: "jit",
  purge: ["./src/*.{html,js}"],
  theme: {
    extend: {},
  },
  variants: {},
  plugins: [],
};
```

{% endsamplefile %}
{% endsample %}

Finally, you can reference Tailwind classes from any files that match the `purge` glob listed in `tailwind.config.js`.

{% sample %}
{% samplefile "Button.js" %}

```jsx
export function Button({ children }) {
  return (
    <button className="p-2 rounded bg-blue-500 hover:bg-blue-600 transition">
      {children}
    </button>
  );
}
```

{% endsamplefile %}
{% endsample %}

## Images

You can reference external images from JSX using the `URL` constructor. Parcel also supports using [query parameters](/features/dependency-resolution/#query-parameters) to resize and convert images to a different format. It also handles image optimization, and includes a [content hash](/features/production/#content-hashing) in output filenames for long term browser caching.

{% sample %}
{% samplefile "Logo.js" %}

```jsx/0,3
const logo = new URL('logo.svg', import.meta.url);

export function Logo() {
  return <img src={logo} alt="logo" />;
}
```

{% endsamplefile %}
{% endsample %}

See [URL dependencies](/languages/javascript/#url-dependencies) in the JavaScript docs for more details about this syntax, and the [Image](/recipes/image/) docs for more information about how Parcel handles images.

### SVG

External SVG files can be referenced as described above. You can also import SVGs as React components which can be rendered directly in JSX.

First, install the `@parcel/transformer-svg-react` plugin and add it to your `.parcelrc`:

```shell
yarn add @parcel/transformer-svg-react --dev
```

{% sample %}
{% samplefile ".parcelrc" %}

```json
{
  "extends": "@parcel/config-default",
  "transformers": {
    "*.svg": ["...", "@parcel/transformer-svg-react"]
  }
}
```

{% endsamplefile %}
{% endsample %}

Now, you can import SVGs from your component files and render them just like any other component.

{% sample %}
{% samplefile "AddButton.js" %}

```jsx
import AddIcon from "./AddIcon.svg";

export function AddButton() {
  return (
    <button aria-label="Add">
      <AddIcon />
    </button>
  );
}
```

{% endsamplefile %}
{% endsample %}

The above example showed how to convert every SVG file to JSX, but you may want to be more selective in some cases. See [Importing as a React component](/languages/svg/#importing-as-a-react-component) in the SVG docs for more details.

See the [SVG](/languages/svg/) docs for more about how Parcel transforms and optimizes SVG files.

## Code splitting

Code splitting helps reduce initial page load size by lazily loading sections of your app. This can be accomplished by using the dynamic `import()` syntax, along with [`React.lazy`](https://reactjs.org/docs/code-splitting.html#reactlazy).

This example lazily loads a `Profile` component when a user clicks a button. When it sees the dynamic `import()`, Parcel moves the `Profile` component into a separate bundle from the `Home` component and loads it on demand. `React.lazy` handles turning this into a component, and `Suspense` handles rendering a fallback while it is loading.

{% sample %}
{% samplefile "Home.js" %}

```jsx
import React, {Suspense} from 'react';

const Profile = React.lazy(() => import('./Profile'));

export function Home() {
  let [showProfile, setShowProfile] = React.useState(false);

  return (
    <main>
      <h1>Home<h1>
      <button onClick={() => setShowProfile(true)}>
        Show Profile
      </button>
      {showProfile &&
        <Suspense fallback={<div>Loading...</div>}>
          <Profile />
        </Suspense>
      }
    </main>
  );
}
```

{% endsamplefile %}
{% samplefile "Profile.js" %}

```jsx
export default function Profile() {
  return <h2>Profile</h2>;
}
```

{% endsamplefile %}
{% endsample %}

See the [Code Splitting](/features/code-splitting/) docs for more details about code splitting in Parcel, and [Code Splitting](https://reactjs.org/docs/code-splitting.html) in the React docs for more about `Suspense` and `React.lazy`.
