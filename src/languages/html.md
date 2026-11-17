# HTML

Parcel includes first-class support for HTML out of the box. HTML files are often the entry file that you provide to Parcel, and all dependencies including JavaScript, CSS, images, and links to other pages are followed from there to build your entire app.

## Dependencies

Parcel detects most references in HTML to other files (such as `<script>`, `<img>`, `<video>` or `<meta property="og:image">`) and processes them as well. These references are rewritten so that they link to the correct output files.

File names are resolved relative to the current HTML file, but you can also use [absolute](../features/dependency-resolution.md#absolute-specifiers) and [tilde](../features/dependency-resolution.md#tilde-specifiers) specifiers. See [Dependency resolution](../features/dependency-resolution.md) for details.

### Stylesheets

The `<link rel="stylesheet">` element can be used to reference stylesheets from HTML. You can reference a CSS file, or any other file that compiles to CSS such as [SASS](sass.md), [Less](less.md), or [Stylus](stylus.md).

<code-sample>
<code-file name="index.html">

```html/3
<!DOCTYPE html>
<html>
  <head>
    <link rel="stylesheet" href="./style.less" />
  </head>
  <body>
    <h1>My Parcel app</h1>
  </body>
</html>
```

</code-file>
<code-file name="style.less">

```less
h1 {
  color: darkslategray;
}
```

</code-file>
</code-sample>

See the [CSS](css.md) docs for details on how CSS is processed by Parcel.

### Scripts

The `<script>` element can be used to reference a script file from HTML. You can reference a JavaScript file, or any other file that compiles to JavaScript such as [TypeScript](typescript.md), [JSX](javascript.md#jsx), or [CoffeeScript](coffeescript.md).

<code-sample>
<code-file name="index.html">

```html/3
<!DOCTYPE html>
<html>
  <head>
    <script type="module" src="app.ts" />
  </head>
  <body>
    <h1>My Parcel app</h1>
  </body>
</html>
```

</code-file>
<code-file name="app.ts">

```js
console.log('Hello world!');
```

</code-file>
</code-sample>

The `type="module"` attribute should be used to indicate that a file is an [ES module](javascript.md#es-modules) or [CommonJS](javascript.md#commonjs) file. If it is omitted, then the referenced file is treated as a classic script. See [Classic scripts](javascript.md#classic-scripts) for more information about this.

When a `<script type="module">` is used and some of your browser targets do not support ES modules, Parcel compiles it to a classic script with the `defer` attribute instead.

Parcel also supports the `async` and `defer` attributes of the `<script>` element. When a script is `async`, it may load in an arbitrary order at runtime. Therefore, Parcel treats async scripts as "isolated”. This means that async scripts cannot share any dependencies with other scripts on the page, which may result in duplication of modules. For this reason, it's better to avoid `async` scripts except in specific circumstances.

The `defer` attribute has a similar effect as `async` (non render-blocking), but guarentees that scripts are executed in the order they are defined in the HTML file. When using `<script type="module">`, `defer` is automatically enabled and does not need to be declared.

See the [MDN docs](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script) for the `<script>` element for more info, and the [JavaScript](javascript.md) docs for details on how Parcel processes JavaScript.

### Images

Parcel supports images referenced via the [`<img>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img) element. The `src` attribute can be used to reference an image file.

```html
<img src="image.jpg" alt="An image" />
```

Parcel also supports the [`srcset`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img#using_the_srcset_attribute) attribute, which allows referencing multiple versions of an image for different sizes or resolutions.

```html
<img src="logo@1x.png" srcset="logo@2x.png 2x" alt="logo" />
```

In addition, Parcel supports the [`<picture>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/picture) element, which allows even more flexibility for providing multiple alternative images via the [`<source>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/source) element.

Parcel’s [image transformer](../recipes/image.md) can also be used to generate multiple versions of an image from a single source file. This is done using [query parameters](../features/dependency-resolution.md#query-parameters) to provide the width, height, and format to convert and resize the source image.

```html
<picture>
  <source
    type="image/webp"
    srcset="image.jpg?as=webp&width=400, image.jpg?as=webp&width=800 2x"
  />
  <source
    type="image/jpeg"
    srcset="image.jpg?width=400, image.jpg?width=800 2x"
  />
  <img src="image.jpg?width=400" width="400" />
</picture>
```

### Links and iframes

Parcel supports the [`<a>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a) element to link to another page from an HTML file.

```html
<a href="other.html">Other page</a>
```

The [`<iframe>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/iframe) element can be used to embed an HTML page inside another.

```html
<iframe src="iframe.html"></iframe>
```

While other assets referenced from an HTML file will include a [content hash](../features/production.md#content-hashing) in their compiled filename by default, files referenced by an `<a>` or `<iframe>` element will not. That's because these URLs are typically human readable, and need to have a stable name over time. Bundle naming can be customized with [naming rules](../features/targets.md#naming-rules), or overridden by [Namer plugins](../plugin-system/namer.md).

Links to URLs without a file extension, such as `/docs/` or `/api/users`, are left as is. These usually refer to routes handled by a server rather than files, so Parcel does not try to resolve them.

The [`<meta http-equiv="refresh">`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/meta/http-equiv#refresh) element is also supported. This redirects to another page after a delay, and the URL is processed just like a link.

```html
<meta http-equiv="refresh" content="0; url=new-page.html" />
```

#### Directory indexes

Static file servers typically respond to a request for a directory with its `index.html` file, so that a page written to `docs/index.html` can be served at `/docs/`. The `directoryIndex` option of `@parcel/transformer-html` makes links to these pages use the shorter URL.

<code-sample>
<code-file name=".parcelrc">

```json
{
  "extends": "@parcel/config-default",
  "transformers": {
    "*.html": [
      {
        "plugin": "@parcel/transformer-html",
        "config": {
          "directoryIndex": "index.html"
        }
      }
    ]
  }
}
```

</code-file>
</code-sample>

### Video, audio, and other assets

The [`<video>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/video), [`<audio>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/audio), [`<track>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/track), [`<embed>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/embed), and [`<object>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/object) elements are supported. The referenced URLs are processed by Parcel and rewritten to include a [content hash](../features/production.md#content-hashing).

### Open Graph and Schema.org metadata

Parcel supports [Open Graph](https://ogp.me), [Twitter Cards](https://developer.twitter.com/en/docs/twitter-for-websites/cards/overview/markup), [VK](https://vk.com/dev/publications), [Schema.org](https://schema.org), and [Microsoft pinned site](<https://docs.microsoft.com/en-us/previous-versions/windows/internet-explorer/ie-developer/platform-apis/dn255024(v=vs.85)?redirectedfrom=MSDN>) metadata defined using the [`<meta>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/meta) tag. Images and other URLs referenced in these elements are processed by Parcel and rewritten to link to the correct output files. Since these URLs are often cached by external services, most of them do not include a [content hash](../features/production.md#content-hashing).

```html
<meta property="og:image" content="100x100.png" />
```

### JSON-LD

Parcel supports [JSON-LD](https://json-ld.org) metadata embedded in HTML via `<script>` tags. Images and other URLs referenced in JSON-LD are processed by Parcel and rewritten to include a [content hash](../features/production.md#content-hashing). This is handled by the `@parcel/transformer-jsonld` plugin, which is included in Parcel's default config.

In this example, the image referenced from the `logo` object will be processed by Parcel.

```html
<script type="application/ld+json">
  {
    "@context": "http://schema.org",
    "@type": "LocalBusiness",
    "name": "Joe's Pizza",
    "description": "Delicious pizza for over 30 years.",
    "telephone": "555-111-2345",
    "openingHours": "Mo,Tu,We,Th,Fr 09:00-17:00",
    "logo": {
      "@type": "ImageObject",
      "url": "images/logo.png",
      "width": 180,
      "height": 120
    }
  }
</script>
```

### Web manifests

The `<link rel="manifest">` element is supported to reference a [Web manifest](https://developer.mozilla.org/en-US/docs/Web/Manifest). This is a JSON file that includes various metadata about the app, and allows it to be installed to the user's home screen or desktop. Parcel processes the URLs referenced in the `icons` and `screenshots` keys in this file, as well as the `icons` of each item in `shortcuts` and `file_handlers`. Web manifests may be written in either a `.json` or `.webmanifest` file.

```html
<link rel="manifest" href="manifest.json" />
```

## Inline scripts and styles

`<script>` and `<style>` tags with text content are also processed just like standalone files, and the generated bundles are inserted back into the HTML file. The `type="module"` attribute on script tags works just as described above for external scripts. However, if some of your browser targets don't support ES modules natively, Parcel will compile inline scripts to a non-module script and will not output a `<script type="module">`.

<code-sample>
<code-file name="index.html">

```html/4,7-8
<!DOCTYPE html>
<html>
  <body>
    <style>
      @import "./style.scss";
    </style>
    <script type="module">
      import value from "./other.ts";
      console.log(value);
    </script>
  </body>
</html>
```

</code-file>
</code-sample>

<p-warning>

**Note**: Use this sparingly, as big inline scripts/styles can be detrimental to the (perceived) load speed.

</p-warning>

## Inline `style` attribute

The [`style`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/style) attribute can be used on any HTML element to define CSS styles. Parcel will process the inline CSS, and insert the result back into the `style` attribute. This includes following referenced URLs such as background images, as well as transforming modern CSS for your target browsers.

```html
<div style="background: url(background.jpg)">Hello!</div>
```

## Inline SVG

Parcel supports [inline SVG](https://developer.mozilla.org/en-US/docs/Web/SVG/Tutorial/SVG_In_HTML_Introduction) in HTML. Images referenced via the [`<image>`](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/image) element and dependencies referenced via the [`<use>`](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/use) element are supported, and inline scripts and styles within the SVG are also processed as described above.

```html
<!DOCTYPE html>
<html>
  <body>
    <svg xmlns:xlink="http://www.w3.org/1999/xlink">
      <rect x="10" y="10" width="50" height="50" fill="red" />
      <use xlink:href="icon.svg" />
    </svg>
  </body>
</html>
```

## Parallel scripts and styles

When referencing a script or style, sometimes Parcel will need to insert another dependent file into the compiled HTML file. For example, when referencing a JavaScript file which imports a CSS file, Parcel will insert a `<link>` element before the `<script>` to load this stylesheet in parallel with the JavaScript.

<code-sample>
<code-file name="index.html">

```html
<!DOCTYPE html>
<html>
  <head>
    <script type="module" src="app.js"></script>
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>
```

</code-file>
<code-file name="app.js">

```javascript
import './app.css';

let app = document.createElement('div');
app.className = 'app';
app.textContent = 'My Parcel app!';
root.appendChild(app);
```

</code-file>
<code-file name="app.css">

```css
.app {
  background: red;
}
```

</code-file>
</code-sample>

Compiled HTML:

```html
<!DOCTYPE html>
<html>
  <head>
    <link rel="stylesheet" href="/ejev5k34.css" />
    <script type="module" src="/app-7yoxqbr3.js"></script>
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>
```

This may also occur with scripts. For example, if two pages depend on the same JavaScript library (e.g. React or Lodash), it may be split out into its own bundle and loaded separately. Parcel will insert a `<script>` tag into the compiled HTML to load this "shared bundle" in parallel. See [Code Splitting](../features/code-splitting.md) for more details.

## Includes

The `<parcel:include>` element inserts the compiled contents of another file into an HTML page. This is useful for sharing common parts of a site, such as headers, footers, and navigation, between multiple pages.

<code-sample>
<code-file name="index.html">

```html/6
<!DOCTYPE html>
<html>
  <head>
    <title>Home</title>
  </head>
  <body>
    <parcel:include src="header.html"></parcel:include>
    <main>My content</main>
  </body>
</html>
```

</code-file>
<code-file name="header.html">

```html
<header>
  <img src="logo.svg" alt="My site" />
  <a href="about.html">About</a>
</header>
```

</code-file>
</code-sample>

The included file is compiled on its own, and then inserted in place of the `<parcel:include>` element. URLs within it are resolved relative to the included file, so the same file can be included from pages in different directories. Any file that compiles to HTML can be included, such as [Markdown](markdown.md).

Metadata elements in included content, such as `<title>`, `<meta>`, and `<link>`, are moved into the page's `<head>`. This allows an included file to contribute stylesheets or metadata to the pages that use it.

### Slots

An included file can define placeholders with the `<parcel:slot>` element. The children of the `<parcel:include>` element are inserted into these slots. Elements with a `parcel:slot` attribute are placed into the slot with that name, and all other content is placed into the slot without a name.

<code-sample>
<code-file name="index.html">

```html
<parcel:include src="card.html">
  <h2 parcel:slot="title">Getting started</h2>
  <p>Learn how to set up a new project.</p>
</parcel:include>
```

</code-file>
<code-file name="card.html">

```html
<div class="card">
  <parcel:slot name="title"></parcel:slot>
  <parcel:slot></parcel:slot>
</div>
```

</code-file>
</code-sample>

Compiled HTML:

```html
<div class="card">
  <h2>Getting started</h2>
  <p>Learn how to set up a new project.</p>
</div>
```

If a slot does not receive any content, the children of the `<parcel:slot>` element are used as a fallback. Content for a slot that does not exist is removed.

## Layouts

Layouts are the inverse of includes: rather than inserting another file into a page, a page is inserted into a layout. The `<parcel:layout>` element wraps the page's content in the referenced layout, and the content fills the layout's [slots](#slots).

<code-sample>
<code-file name="about.html">

```html
<parcel:layout src="layout.html">
  <title>About us</title>
  <h1 parcel:slot="header">About us</h1>
  <p>We make websites.</p>
</parcel:layout>
```

</code-file>
<code-file name="layout.html">

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>My site</title>
    <link rel="stylesheet" href="style.css" />
  </head>
  <body>
    <header>
      <parcel:slot name="header"></parcel:slot>
    </header>
    <main>
      <parcel:slot></parcel:slot>
    </main>
  </body>
</html>
```

</code-file>
</code-sample>

The layout becomes the compiled page, and is processed just like any other HTML file. Like includes, URLs within a layout are resolved relative to the layout file.

Elements in the page's `<head>` are added to the layout's `<head>`, replacing equivalent elements. In the example above, the page's `<title>` replaces the layout's. Attributes on the page's `<html>` and `<body>` elements are copied to the layout, and the `class` attribute is combined. This allows each page to customize the layout as needed.

Layouts may also use other layouts. Any `<parcel:slot>` elements within the page content are passed through to be filled by the page using the layout.

Layouts are especially useful with [Markdown](markdown.md#layouts), which can specify a layout for all pages in your `.parcelrc`.

## Macros

[Macros](../features/macros.md) are JavaScript functions that run at build time. In HTML, the `<parcel:macro>` element calls a macro, and is replaced with the HTML it returns. This allows you to generate content at build time without any custom plugins, e.g. a list of blog posts read from the file system.

<code-sample>
<code-file name="index.html">

```html
<ul>
  <parcel:macro src="posts.js#postList" limit="5"></parcel:macro>
</ul>
```

</code-file>
<code-file name="posts.js">

```js
import fs from 'fs';
import path from 'path';

export function postList(content, {limit}) {
  return fs
    .readdirSync(path.join(__dirname, 'posts'))
    .slice(0, Number(limit))
    .map(file => `<li><a href="posts/${file}">${file}</a></li>`)
    .join('');
}
```

</code-file>
</code-sample>

The `src` attribute specifies the file containing the macro, and the name of the export to call after a `#`. If no export is specified, the default export is called. A macro receives two arguments: the content of the `<parcel:macro>` element as an HTML string, and an object containing the element's other attributes. It must return a string of HTML.

The returned HTML is processed as if it were written in the page. Dependencies such as links, images, and scripts are resolved relative to the file that called the macro, and macros and includes within it are expanded as well.

### Custom elements

Macros can also be called using custom elements. The `<parcel:import>` element defines an element name that calls a macro. These elements receive their content and attributes just like `<parcel:macro>`. Place `<parcel:import>` before the elements that use it, such as in the `<head>`. df

<code-sample>
<code-file name="index.html">

```html/2,5-7
<html>
  <head>
    <parcel:import name="x-card" src="card.js"></parcel:import>
  </head>
  <body>
    <x-card title="Getting started">
      <p>Learn how to set up a new project.</p>
    </x-card>
  </body>
</html>
```

</code-file>
<code-file name="card.js">

```js
export default function card(content, {title}) {
  return `<div class="card"><h2>${title}</h2>${content}</div>`;
}
```

</code-file>
</code-sample>

Custom elements may also be defined for every HTML file using the `macros` option of `@parcel/transformer-html` in your `.parcelrc`. Each key is an element name, and each value is the file and export to call, relative to the `.parcelrc`.

<code-sample>
<code-file name=".parcelrc">

```json
{
  "extends": "@parcel/config-default",
  "transformers": {
    "*.html": [
      {
        "plugin": "@parcel/transformer-html",
        "config": {
          "macros": {
            "x-card": "src/macros/card.js",
            "pre": "src/macros/highlight.js#highlight"
          }
        }
      }
    ]
  }
}
```

</code-file>
</code-sample>

As the `pre` example shows, built-in elements can be replaced by macros as well, e.g. to add syntax highlighting to all code blocks. A macro may return the same element it replaces (e.g. a `<pre>`) without calling itself again.

## PostHTML

[PostHTML](https://github.com/posthtml/posthtml) is a tool for transforming HTML with plugins. PostHTML support is provided by the `@parcel/transformer-posthtml` plugin, which is not included in the default Parcel config. Install it along with any PostHTML plugins you need:

```bash
yarn add @parcel/transformer-posthtml@next posthtml-doctype --dev
```

Then, add it to your `.parcelrc` so that it runs before Parcel's builtin HTML transformer:

<code-sample>
<code-file name=".parcelrc">

```json
{
  "extends": "@parcel/config-default",
  "transformers": {
    "*.html": ["@parcel/transformer-posthtml", "..."]
  }
}
```

</code-file>
</code-sample>

You can configure PostHTML by creating a configuration file using one of these names: `.posthtmlrc` (JSON), `.posthtmlrc.json`, `.posthtmlrc.js`, `.posthtmlrc.mjs`, `.posthtmlrc.cjs`, `posthtml.config.js`, `posthtml.config.mjs`, or `posthtml.config.cjs`. A `posthtml` key in `package.json` is also supported.

For example, create a config file:

<code-sample>
<code-file name=".posthtmlrc">

```json
{
  "plugins": {
    "posthtml-doctype": {"doctype": "HTML 5"}
  }
}
```

</code-file>
</code-sample>

Plugins are specified in the plugins object as keys, and options are defined using object values. If there are no options for a plugin, just set it to an empty object instead.

Alternatively, PostHTML options can be specified inline in your `.parcelrc`. When present, this takes precedence over any PostHTML config file.

<code-sample>
<code-file name=".parcelrc">

```json
{
  "extends": "@parcel/config-default",
  "transformers": {
    "*.html": [
      {
        "plugin": "@parcel/transformer-posthtml",
        "config": {
          "plugins": {
            "posthtml-doctype": {"doctype": "HTML 5"}
          }
        }
      },
      "..."
    ]
  }
}
```

</code-file>
</code-sample>

This example uses [posthtml-include](https://github.com/posthtml/posthtml-include) to inline another HTML file. Note that Parcel also supports this natively via [`<parcel:include>`](#includes).

<code-sample>
<code-file name=".posthtmlrc">

```json
{
  "plugins": {
    "posthtml-include": {}
  }
}
```

</code-file>
<code-file name="index.html">

```html
<html>
  <head>
    <title>Home</title>
  </head>
  <body>
    <include src="header.html"></include>
    <main>My content</main>
  </body>
</html>
```

</code-file>
<code-file name="header.html">

```html
<header>This is my header</header>
```

</code-file>
</code-sample>

### posthtml.config.js

For some plugins that require passing a function as a configuration option, or to set up plugins based on `process.env.NODE_ENV`, you need to use a `posthtml.config.js` file for configuration instead of `.posthtmlrc`.

This example uses [posthtml-shorten](https://github.com/Rebelmail/posthtml-shorten) to shorten URLs using a custom shortening function.

```bash
yarn add posthtml-shorten --dev
```

<code-sample>
<code-file name="posthtml.config.js">

```js
module.exports = {
  plugins: {
    'posthtml-shorten': {
      shortener: {
        process: function (url) {
          return new Promise((resolve, reject) => {
            resolve(url.replace('.html', ''));
          });
        },
      },
      tag: ['a'], // Allowed tags for URL shortening
      attribute: ['href'], // Attributes to replace on the elements
    },
  },
};
```

</code-file>
<code-file name="index.html">

```html
<html>
  <head>
    <title>Home</title>
  </head>
  <body>
    <a href="http://example.com/test.html">Example</a>
  </body>
</html>
```

</code-file>
</code-sample>

## Production

In production mode, Parcel includes optimizations to reduce the file size of your code. See [Production](../features/production.md) for more details about how this works.

### Minification

In production mode, Parcel automatically minifies your code to reduce the file sizes of your bundles. Parcel uses its builtin HTML minifier, which also minifies inline SVG and JSON.

To configure it, set the `optimize` option of `@parcel/transformer-html` in your `.parcelrc`. Set it to `false` to disable HTML minification, or to an object of options.

For example to retain HTML comments

<code-sample>
<code-file name=".parcelrc">

```json
{
  "extends": "@parcel/config-default",
  "transformers": {
    "*.html": [
      {
        "plugin": "@parcel/transformer-html",
        "config": {
          "optimize": {
            "removeComments": false
          }
        }
      }
    ]
  }
}
```

</code-file>
</code-sample>

or to not minify SVG elements.

<code-sample>
<code-file name=".parcelrc">

```json
{
  "extends": "@parcel/config-default",
  "transformers": {
    "*.html": [
      {
        "plugin": "@parcel/transformer-html",
        "config": {
          "optimize": {
            "minifySvg": false
          }
        }
      }
    ]
  }
}
```

</code-file>
</code-sample>

The following options are supported, and are all enabled by default: `collapseAttributeWhitespace`, `collapseWhitespace`, `deduplicateAttributeValues`, `removeComments`, `removeEmptyAttributes`, `minifyJson`, `removeRedundantAttributes`, `collapseBooleanAttributes`, `normalizeAttributeValues`, and `sortAttributesWithLists`. The `minifySvg` option can also be set to an object of options for the [SVG minifier](svg.md#minification).
