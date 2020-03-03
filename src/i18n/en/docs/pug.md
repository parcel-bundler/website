# Pug

_Supported extensions: `jade`, `pug`_

Setting Pug up is easy. You can have any file structure you want, I am only providing several simple examples as a point of reference.

## Example 1 - Just index.pug

Let's assume this file structure:

```bash
.
├── package.json
└── src
    └── index.pug
```

We can get this running by using this parcel command: `parcel src/index.pug`.

## Example 2 - index.pug, index.js and style.css

Let's assume this file structure:

```bash
.
├── package.json
└── src
    ├── index.js
    ├── index.pug
    └── style.css
```

Inside index.pug, just wire up your stylesheet and js as usual.

```pug
// index.pug

doctype html
html(lang="")
  head
    // ...
    link(rel="stylesheet", href="style.css")
  body
    h1 Hello

    script(src="index.js")
```

If you were using Stylus, Sass or LESS, you would still wire it up the same way. You can import your style file directly into your JS file if you prefer.

We can get this running by using the same parcel command: `parcel src/index.pug`.

## Example 3 - Pug with locals

Let's assume this file structure:

```bash
.
├── package.json
└── src
    ├── index.pug
    └── pug.config.js
```

We need to export a `locals` object from a `pug.config.js` file. The `pug.config.js` file must be in the directory with the `index.pug` file OR, in the directory containing the `package.json` file. The `pug.config.js` file does not need to be imported into a js file explicitly. This **IS** the only way to make a `locals` object available for your Pug templates.

```js
// pug.config.js

module.exports = {
  locals: {
    hello: "world"
  }
};
```

```pug
// index.pug

doctype html
html(lang="")
  head
    // ...
  body
    h1 #{hello}
```

Again, we can get this running by using the same parcel command: `parcel src/index.pug`.

### Cancel and rerun parcel after updating locals object

You will not be able to see changes made to your `locals` object on the fly.  If you update your `locals` object, you will need to cancel the parcel process in your terminal and relaunch `parcel src/index.pug` again.

### Watch out for silent errors

Also, understand that if you use this locals setup, you will not get an error if you use a property that doesn't exist for interpolation in your Pug. Thus, if we wrote `h1 #{thing}` and there was no `thing` property in locals, then Parcel will not crash, nor report an error. You will only be left with an empty result in the browser. So, be careful to get this right, or you might not know that an interpolated element is not working.

### Three file naming options only

You can use a `.pugrc` or a `.pugrc.js` file instead of `pug.config.js`. But these are the only 3 variations that will work for setting up locals.

### Can't use import statements in the `pug.config.js` file

If you want to import other files into the `pug.config.js` file, then you must use require statements.

This will work:

```js
// pug.config.js

const data = require("./data.js");

module.exports = {
  locals: {
    d: data
  }
};

```

This will NOT work:

```js
import data from "./data.js";

module.exports = {
  locals: {
    d: data
  }
};
```

## Adding a script to package.json

```json
"scripts": {
    "dev": "parcel src/index.pug",
    "devopen": "parcel src/index.pug --open 'google chrome'",
    "build": "parcel build src/index.pug"
  },
```

We can key `npm run dev` or `npm run devopen` to have the project open in the browser. We can then build the pug project with `npm run build`.
