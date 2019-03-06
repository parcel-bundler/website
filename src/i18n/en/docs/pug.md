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
    link(rel="stylesheet", href="index.css")
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
    ├── data.js
    ├── index.js
    └── index.pug
```
We need to export a `locals` object and import it into our index.js file
```js
// data.js

module.exports = {
  locals: {
    hello: "world"
  }
};
```
```js
// index.js

import "./data.js";
```
```pug
// index.pug

doctype html
html(lang="")
  head
    // ...
  body
    h1 #{hello} 

    script(src="index.js")
```
Again, we can get this running by using the same parcel command: `parcel src/index.pug`. 

You will not be able to see changes made to your `locals` object on the fly.  If you update your `locals` object, you will need to cancel the parcel process in your terminal and relaunch `parcel src/index.pug` again.

## Adding a script to package.json
```json
"scripts": {
    "dev": "parcel src/index.pug",
    "devopen": "parcel src/index.pug --open 'google chrome'",
    "build": "parcel build src/index.pug"
  },
```
We can key `npm run dev` or `npm run devopen` to have the project open in the browser. We can then build the pub project with `npm run build`.
