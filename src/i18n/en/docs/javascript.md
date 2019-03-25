# JavaScript

_Supported extensions: `js`, `jsx`, `es6`, `jsm`, `mjs`_

The most traditional file type for web bundlers is JavaScript. Parcel supports both CommonJS and ES6 module syntax for importing files. It also supports dynamic `import()` function syntax to load modules asynchronously, which is discussed in the [Code Splitting](code_splitting.html) section. Dynamic imports can also import modules from URLs.

```javascript
// Import a module using CommonJS syntax
const dep = require('./path/to/dep')

// Import a module using ES6 import syntax
import dep from './path/to/dep'

// Import a module from a URL (e.g. CDN), using dynamic imports
import('https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.11/lodash.min.js').then(() => {
  console.log(_.VERSION);
});
```

You can also import non-JavaScript assets from a JavaScript file, e.g. CSS, HTML or even an image file. When you import one of these files, it is not inlined as in some other bundlers. Instead, it is placed in a separate bundle (e.g. a CSS file) along with all of its dependencies. When using [CSS Modules](https://github.com/css-modules/css-modules), the exported classes are placed in the JavaScript bundle. Other asset types export a URL to the output file in the JavaScript bundle so you can reference them in your code.

```javascript
// Import a CSS file
import './test.css'

// Import a CSS file with CSS modules
import classNames from './test.css'

// Import the URL to an image file
import imageURL from './test.png'

// Import an HTML file
import('./some.html')
// or:
import html from './some.html'
// or:
require('./some.html')
```

If you want to inline a file into the JavaScript bundle instead of reference it by URL, you can use the Node.js `fs.readFileSync` API to do that. The URL must be statically analyzable, meaning it cannot have any variables in it (other than `__dirname` and `__filename`).

```javascript
import fs from 'fs'

// Read contents as a string
const string = fs.readFileSync(__dirname + '/test.txt', 'utf8')

// Read contents as a Buffer
const buffer = fs.readFileSync(__dirname + '/test.png')

// Convert Buffer contents to an image
;<img src={`data:image/png;base64,${buffer.toString('base64')}`} />
```

## Images in JSX

Below is an example of how you could import an image file for use in JSX.

```js
// Import the image file
import megaMan from "./images/mega-man.png";

// JSX
<img src={megaMan} title="Mega Man" alt="Mega Man" />

// JSX (w/ custom path)
<img src={`/dist${megaMan}`} title="Mega Man" alt="Mega Man" />
```

## Babel

[Babel](https://babeljs.io) is a popular transpiler for JavaScript, with a large plugin ecosystem. Using Babel with Parcel works the same way as using it standalone or with other bundlers.

Install presets and plugins in your app:

```shell
yarn add --dev @babel/preset-react
```

Then, create a `.babelrc`:

```json
{
  "presets": ["@babel/preset-react"]
}
```

You can also put `babel` config in `package.json`

```json
"babel": {
  "presets": ["@babel/preset-react"]
}
```

NOTE: `package.json` takes precedence over `.babelrc`.

## Default Babel transforms

Parcel transpiles your code (every internal module) with `@babel/preset-env` by default to match the defined target.

For the `browser` target it utilises [browserslist](https://github.com/browserslist/browserslist), the target browserlist can be defined in `package.json` (`engines.browsers` or `browserslist`) or using a configuration file (`browserslist` or `.browserslistrc`).

The browserlist target defaults to: `> 0.25%` (Meaning, support every browser that has 0.25% or more of the total amount of active web users)

For the `node` target, Parcel uses the `engines.node` defined in `package.json`, this default to _node 8_.

## Flow

[Flow](https://flow.org/) is a popular static type checker for JavaScript. Using Flow with Parcel is as simple as placing `// @flow` as the first line of your `js` files.

Parcel will automatically install the required Babel config to strip the Flow types from the compiled output, so there's nothing you have to worry about except [editor integrations](https://flow.org/en/docs/editors/) or supporting [Absolute Path module resolution](module_resolution.html#flow-with-absolute-or-tilde-resolution) with `.flowconfig`.
