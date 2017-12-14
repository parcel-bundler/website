# 📦 Assets

Parcel is based around assets. An asset can represent any file, but Parcel has special support for certain types of assets like JavaScript, CSS, and HTML files. Parcel automatically analyzes the dependencies referenced in these files and includes them in the output bundle. Assets of similar types are grouped together into the same output bundle. If you import an asset of a different type (for example, if you imported a CSS file from JS), it starts a child bundle and leaves a reference to it in the parent. This will be illustrated in the following sections.

## JavaScript

The most traditional file type for web bundlers is JavaScript. Parcel supports both CommonJS and ES6 module syntax for importing files. It also supports dynamic `import()` function syntax to load modules asynchronously, which is discussed in the [Code Splitting](code_splitting.html) section.

```javascript
// Import a module using CommonJS syntax
const dep = require('./path/to/dep');

// Import a module using ES6 import syntax
import dep from './path/to/dep';
```

You can also import non-JavaScript assets from a JavaScript file, e.g. CSS or even an image file. When you import one of these files, it is not inlined as in some other bundlers. Instead, it is placed in a separate bundle (e.g. a CSS file) along with all of its dependencies. When using [CSS Modules](https://github.com/css-modules/css-modules), the exported classes are placed in the JavaScript bundle. Other asset types export a URL to the output file in the JavaScript bundle so you can reference them in your code.

```javascript
// Import a CSS file
import './test.css';

// Import a CSS file with CSS modules
import classNames from './test.css';

// Import the URL to an image file
import imageURL from './test.png';
```

If you want to inline a file into the JavaScript bundle instead of reference it by URL, you can use the Node.js `fs.readFileSync` API to do that. The URL must be statically analyzable, meaning it cannot have any variables in it (other than `__dirname` and `__filename`).

```javascript
import fs from 'fs';

// Read contents as a string
const string = fs.readFileSync(__dirname + '/test.txt', 'utf8');

// Read contents as a Buffer
const buffer = fs.readFileSync(__dirname + '/test.png');
```

## CSS

CSS assets can be imported from a JavaScript or HTML file, and can contain dependencies referenced by `@import` syntax as well as references to images, fonts, etc. via the `url()` function. Other CSS files that are `@import`ed are inlined into the same CSS bundle, and `url()` references are rewritten to their output filenames. All filenames should be relative to the current CSS file.

```css
/* Import another CSS file */
@import './other.css';

.test {
  /* Reference an image file */
  background: url('./images/background.png');
}
```

In addition to plain CSS, other compile-to-CSS languages like LESS, SASS, and Stylus are also supported, and work the same way.

## SCSS
SCSS compilation needs `node-sass` module. To install it with npm:
```
npm install node-sass
```
Once you have `node-sass` installed you can import SCSS files from JavaScript files.
```
import './custom.scss'
```
Dependencies in the SCSS files can be used with the `@import` statements.

## HTML

HTML assets are often the entry file that you provide to Parcel, but can also be referenced by JavaScript files, e.g. to provide links to other pages. URLs to scripts, styles, media, and other HTML files are extracted and compiled as described above. The references are rewritten in the HTML so that they link to the correct output files. All filenames should be relative to the current HTML file.

```html
<html>
<body>
  <!-- reference an image file -->
  <img src="./images/header.png">

  <a href="./other.html">Link to another page</a>

  <!-- import a JavaScript bundle -->
  <script src="./index.js"></script>
</body>
</html>
```
