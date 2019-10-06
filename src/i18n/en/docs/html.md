# HTML

_Supported extensions: `htm`, `html`_

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

## Importing HTML in JavaScript

Importing HTML in JavaScript does not statically include the HTML strings, but the HTML files will dynamically be fetched using the [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API). To achieve Internet Explorer 11 and older browser support, `Promise` and `fetch` polyfills need to be provided.

## Importing uncompiled assets

Adding links to files that Parcel can compile (e.g. JavaScript, TypeScript, SCSS, etc.) in HTML is supported. Parcel will automatically process the file and update the link to point to the compiled asset.

```html
<html>
  <head>
    <!-- include a SCSS file -->
    <link rel="stylesheet" href="./my-styles/style.scss">
  </head>
</html>
```

# PostHTML

[PostHTML](https://github.com/posthtml/posthtml) is a tool for transforming HTML with plugins. You can configure PostHTML with Parcel by creating a configuration file using one of these names: `.posthtmlrc` (JSON), `.posthtmlrc.js`, or `posthtml.config.js`.

Install plugins in your app:

```bash
yarn add posthtml-img-autosize
```

Then, create a `.posthtmlrc`:

```json
{
  "plugins": {
    "posthtml-img-autosize": {
      "root": "./images"
    },
    "posthtml-modules": {
      "root": "./src"
    }
  }
}
```
Plugins are specified in the `plugins` object as keys, and options are defined using object values. If there are no options for a plugin, just set it to `true` instead.

When importing modules using `posthtml-modules`, if you start paths with `/`, they will become relative to `./src`.

# htmlnano

Parcel automatically processes all HTML assets with [htmlnano](https://github.com/posthtml/htmlnano) when minification is enabled. htmlnano can be configured according to its documentation with a `.htmlnanorc` (JSON) or `.htmlnanorc.js` file, for example:
```json
{
    "removeComments": false
}
```
