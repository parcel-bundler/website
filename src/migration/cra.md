---
layout: layout.njk
title: Migration from Create React App
eleventyNavigation:
  key: migration-cra
  title: <img src="/assets/lang-icons/react.svg" alt=""/> Create React App
  order: 1
---

This page covers how to migrate from [Create React App](https://create-react-app.dev) to Parcel.

## Automatic migration

[cra-to-parcel](https://github.com/parcel-bundler/cra-to-parcel) is a script that automatically migrates an un-ejected app from Create React App to Parcel. To run it, `cd` into your project, and run the following command:

```bash
npx cra-to-parcel
```

This migrates your dependencies, configuration, and source code to use Parcel. See the section below for more details about what it does, or if you prefer to apply the steps manually.

If you run into any issues during this process, please [file an issue on Github](https://github.com/parcel-bundler/cra-to-parcel/issues).

## Manual migration

### 1. Migrate dependencies

Using your package manager (e.g. npm/yarn/pnpm), remove `react-scripts` and add `parcel`.

```bash
npm rm react-scripts
npm install parcel --save-dev
```

Next, in your `package.json`, replace `react-scripts` with `parcel`. You can remove the `"eject"` script entirely. In addition, add a `"source"` field pointing at `public/index.html` which will be the entrypoint of your application.

{% migration %}
{% samplefile "package.json" %}

```json/2-4
{
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "eject": "react-scripts eject"
  }
}
```

{% endsamplefile %}
{% samplefile "package.json" %}

```json/1,3-4
{
  "source": "public/index.html",
  "scripts": {
    "start": "parcel",
    "build": "parcel build"
  }
}
```

{% endsamplefile %}
{% endmigration %}


### 2. Update public/index.html

Replace the template variable `%PUBLIC_URL%` with `.` in `public/index.html` to point to the files directly. 

{% migration %}
{% samplefile "public/index.html" %}

```html/0
<link rel="icon" href="%PUBLIC_URL%/favicon.ico" />
```

{% endsamplefile %}
{% samplefile "public/index.html" %}

```html/0
<link rel="icon" href="./favicon.ico" />
```

{% endsamplefile %}
{% endmigration %}

Next, add a `<script>` tag pointing at `src/index.js` to `public/index.html`. It should be placed just before the closing `</body>` element.

{% sample %}
{% samplefile "public/index.html" %}

```html/1
  <!-- ... -->
  <script type="module" src="../src/index.js"></script>
  </body>
</html>
```

{% endsamplefile %}
{% endsample %}

### 3. Migrate SVG imports

If you use Create React App's [svg component import](https://create-react-app.dev/docs/adding-images-fonts-and-files#adding-svgs) feature, add `@parcel/transformer-svg-react` to your `.parcelrc` following [these instructions](http://localhost:1234/languages/svg/#importing-as-a-react-component).

{% sample %}
{% samplefile ".parcelrc" %}

```json/3-4
{
  "extends": "@parcel/config-default",
  "transformers": {
    "jsx:*.svg": ["...", "@parcel/transformer-svg-react"],
    "jsx:*": ["..."]
  }
}
```

{% endsamplefile %}
{% endsample %}

Then, convert import statements to use the `jsx:` prefix:

{% migration %}
{% samplefile "src/SomeComponent.jsx" %}

```jsx/0
import { ReactComponent as Logo } from './logo.svg';
```

{% endsamplefile %}
{% samplefile "public/index.html" %}

```jsx/0
import Logo from 'jsx:./logo.svg';
```

{% endsamplefile %}
{% endmigration %}

Importing SVGs without the `jsx:` prefix will return a URL instead of a component, just like in Create React App.

### 4. Migrate GraphQL imports

If you use Create React App's [GraphQL import](https://create-react-app.dev/docs/loading-graphql-files) feature, or other [Babel Macros](https://github.com/kentcdodds/babel-plugin-macros), you'll need to add `babel-plugin-macros` to a `babel.config.json` config file.

{% sample %}
{% samplefile "babel.config.json" %}

```json/3-4
{
  "plugins": ["babel-plugin-macros"]
}
```

{% endsamplefile %}
{% endsample %}

Parcel includes support for other JavaScript transpilation features (e.g. JSX, TypeScript, and Preset Env) out of the box, so they are not needed in your Babel config file. [See the documentation](http://localhost:1234/languages/javascript/#transpilation) for more information.

### 5. Migrate CSS

Parcel includes support for CSS, CSS modules, SASS, and autoprefixing out of the box. If you use the [@import-normalize](https://create-react-app.dev/docs/adding-css-reset) feature of Create React App, you'll need to add `postcss-normalize` to your `.postcssrc` configuration.

{% sample %}
{% samplefile ".postcssrc" %}

```json/3-4
{
  "plugins": ["postcss-normalize"]
}
```

{% endsamplefile %}
{% endsample %}

Additionally, if you use Tailwind CSS, you'll need to add the `tailwindcss` plugin to `.postcssrc` as well. See [the documentation](https://parceljs.org/recipes/react/#tailwind-css) for more details.

### 6. Migrate tests

Next, you'll need to update the `"test"` script to run Jest directly. First, install the required dependencies:

```bash
npm install jest jest-watch-typeahead babel-jest babel-preset-react-app identity-obj-proxy --save-dev
```

Then, update the `"test"` script in your `package.json`:

{% migration %}
{% samplefile "package.json" %}

```json/2
{
  "scripts": {
    "test": "react-scripts test"
  }
}
```

{% endsamplefile %}
{% samplefile "package.json" %}

```json/2
{
  "scripts": {
    "test": "jest"
  }
}
```

{% endsamplefile %}
{% endmigration %}

Now create the following files:

{% sample %}
{% samplefile "jest.config.json" %}

```json
{
  "roots": ["<rootDir>/src"],
  "collectCoverageFrom": ["src/**/*.{js,jsx,ts,tsx}", "!src/**/*.d.ts"],
  "setupFilesAfterEnv": ["<rootDir>/src/setupTests.js"],
  "testMatch": [
    "<rootDir>/src/**/__tests__/**/*.{js,jsx,ts,tsx}",
    "<rootDir>/src/**/*.{spec,test}.{js,jsx,ts,tsx}"
  ],
  "testEnvironment": "jsdom",
  "transform": {
    "^.+\\.(js|jsx|mjs|cjs|ts|tsx)$": "<rootDir>/config/jest/babelTransform.js",
    "^(?!.*\\.(js|jsx|mjs|cjs|ts|tsx|css|json)$)": "<rootDir>/config/jest/fileTransform.js"
  },
  "transformIgnorePatterns": [
    "[/\\\\]node_modules[/\\\\].+\\.(js|jsx|mjs|cjs|ts|tsx)$",
    "^.+\\.module\\.(css|sass|scss)$"
  ],
  "modulePaths": [],
  "moduleNameMapper": {
    "^react-native$": "react-native-web",
    "^.+\\.(css|sass|scss)$": "identity-obj-proxy",
    "^jsx:.+\\.svg": "<rootDir>/config/jest/SvgComponent.js"
  },
  "moduleFileExtensions": ["web.js", "js", "web.ts", "ts", "web.tsx", "tsx", "json", "web.jsx", "jsx", "node"],
  "watchPlugins": [
    "jest-watch-typeahead/filename",
    "jest-watch-typeahead/testname"
  ],
  "resetMocks": true
}
```

{% endsamplefile %}
{% samplefile "config/babelTransform.js" %}

```js
const babelJest = require('babel-jest').default;

module.exports = babelJest.createTransformer({
  presets: [
    [
      require.resolve('babel-preset-react-app'),
      {
        runtime: 'automatic'
      },
    ],
  ],
  babelrc: false,
  configFile: false,
});
```

{% endsamplefile %}
{% samplefile "config/fileTransform.js" %}

```js
const path = require('path').default;

module.exports = {
  process(src, filename) {
    const assetFilename = JSON.stringify(path.basename(filename));
    return `module.exports = ${assetFilename};`;
  },
};
```

{% endsamplefile %}
{% samplefile "config/SvgComponent.js" %}

```js
export function SvgComponent() {
  return null;
}
```

{% endsamplefile %}
{% endsample %}

### 7. Setup eslint

Create React App uses [Eslint](https://eslint.org/) to lint your code. Parcel does not include linting by default, but you can setup a separate npm script in your `package.json` to run it.

First, install the required dependencies:

```bash
npm install eslint eslint-config-react-app --save-dev
```

Then, add a `"lint"` script to your package.json:

{% sample %}
{% samplefile "package.json" %}

```json/2
{
  "scripts": {
    "lint": "eslint src"
  }
}
```

{% endsamplefile %}
{% endsample %}

To run the linter, run `npm run lint`.

### 8. Update .gitignore

Add the following files to your `.gitignore` file:

```
.parcel-cache
dist
```

### 9. Start the dev server

That's it! Now you can start the dev server with `npm start`. As it builds your app for the first time, Parcel may install additional plugins and dependencies it needs.

If you run into any issues during this process, please [file an issue on Github](https://github.com/parcel-bundler/cra-to-parcel/issues).
