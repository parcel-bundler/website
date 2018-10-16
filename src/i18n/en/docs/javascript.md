# Javascript

The most traditional file type for web bundlers is JavaScript. Parcel supports both CommonJS and ES6 module syntax for importing files. It also supports dynamic `import()` function syntax to load modules asynchronously, which is discussed in the [Code Splitting](code_splitting.html) section.

```javascript
// Import a module using CommonJS syntax
const dep = require('./path/to/dep');

// Import a module using ES6 import syntax
import dep from './path/to/dep';
```

You can also import non-JavaScript assets from a JavaScript file, e.g. CSS, HTML or even an image file. When you import one of these files, it is not inlined as in some other bundlers. Instead, it is placed in a separate bundle (e.g. a CSS file) along with all of its dependencies. When using [CSS Modules](https://github.com/css-modules/css-modules), the exported classes are placed in the JavaScript bundle. Other asset types export a URL to the output file in the JavaScript bundle so you can reference them in your code.

```javascript
// Import a CSS file
import './test.css';

// Import a CSS file with CSS modules
import classNames from './test.css';

// Import the URL to an image file
import imageURL from './test.png';

// Import an HTML file
import('./some.html')
// or:
import html from './some.html'
// or:
require('./some.html')
```

If you want to inline a file into the JavaScript bundle instead of reference it by URL, you can use the Node.js `fs.readFileSync` API to do that. The URL must be statically analyzable, meaning it cannot have any variables in it (other than `__dirname` and `__filename`).

```javascript
import fs from 'fs';

// Read contents as a string
const string = fs.readFileSync(__dirname + '/test.txt', 'utf8');

// Read contents as a Buffer
const buffer = fs.readFileSync(__dirname + '/test.png');

// Convert Buffer contents to an image
<img  src={`data:image/png;base64,${buffer.toString('base64')}`}/>
```