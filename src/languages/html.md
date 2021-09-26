---
layout: layout.njk
title: HTML
eleventyNavigation:
  key: languages-html
  title: <img src="/assets/lang-icons/html5.svg" alt=""/> HTML
  order: 1
---

Parcel includes first-class support for HTML out of the box. HTML files are often the entry file that you provide to Parcel, and all dependencies including JavaScript, CSS, images, and links to other pages are followed from there to build your entire app.

## Dependencies

Parcel detects most references in HTML to other files (such as `<script>`, `<img>`, `<video>` or `<meta property="og:image">`) and processes them as well. These references are rewritten so that they link to the correct output files.

File names are resolved relative to the current HTML file, but you can also use [absolute](/features/dependency-resolution/#absolute-specifiers) and [tilde](/features/dependency-resolution/#tilde-specifiers) specifiers. See [Dependency resolution](/features/dependency-resolution/) for details.

### Stylesheets

The `<link rel="stylesheet">` element can be used to reference stylesheets from HTML. You can reference a CSS file, or any other file that compiles to CSS such as [SASS](/languages/sass/), [Less](/languages/less/), or [Stylus](/languages/stylus).

{% sample %}
{% samplefile "index.html" %}

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

{% endsamplefile %}
{% samplefile "style.less" %}

```less
h1 {
  color: darkslategray;
}
```

{% endsamplefile %}
{% endsample %}

See the [CSS](/languages/css/) docs for details on how CSS is processed by Parcel.

### Scripts

The `<script>` element can be used to reference a script file from HTML. You can reference a JavaScript file, or any other file that compiles to JavaScript such as [TypeScript](/languages/typescript/), [JSX](/languages/javascript/#jsx), or [CoffeeScript](/languages/coffeescript/).

{% sample %}
{% samplefile "index.html" %}

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

{% endsamplefile %}
{% samplefile "app.ts" %}

```js
console.log('Hello world!')
```

{% endsamplefile %}
{% endsample %}

The `type="module"` attribute should be used to indicate that a file is an [ES module](/languages/javascript/#es-modules) or [CommonJS](/languages/javascript/#commonjs) file. If it is omitted, then the referenced file is treated as a classic script. See [Classic scripts](/languages/javascript/#classic-scripts) for more information about this.

When a `<script type="module">` is used, Parcel will automatically generate a `<script nomodule>` version as well if some of your browser targets do not support ES modules. See [Differential bundling](/features/targets/#differential-bundling) for more details.

Parcel also supports the `async` and `defer` attributes of the `<script>` element. When a script is `async`, it may load in an arbitrary order at runtime. Therefore, Parcel treats async scripts as "isolated”. This means that async scripts cannot share any dependencies with other scripts on the page, which may result in duplication of modules. For this reason, it's better to avoid `async` scripts except in specific circumstances.

The `defer` attribute has a similar effect as `async` (non render-blocking), but guarentees that scripts are executed in the order they are defined in the HTML file. When using `<script type="module">`, `defer` is automatically enabled and does not need to be declared.

See the [MDN docs](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script) for the `<script>` element for more info, and the [JavaScript](/languages/javascript/) docs for details on how Parcel processes JavaScript.

### Images

Parcel supports images referenced via the [`<img>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img) element. The `src` attribute can be used to reference an image file.

```html
<img src="image.jpg" alt="An image">
```

Parcel also supports the [`srcset`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img#using_the_srcset_attribute) attribute, which allows referencing multiple versions of an image for different sizes or resolutions.

```html
<img src="logo@1x.png" srcset="logo@2x.png 2x" alt="logo">
```

In addition, Parcel supports the [`<picture>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/picture) element, which allows even more flexibility for providing multiple alternative images via the [`<source>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/source) element.

Parcel’s [image transformer](/recipes/image/) can also be used to generate multiple versions of an image from a single source file. This is done using [query parameters](/features/dependency-resolution/#query-parameters) to provide the width, height, and format to convert and resize the source image.

```html
<picture>
  <source type="image/webp" srcset="image.jpg?as=webp&width=400, image.jpg?as=webp&width=800 2x">
  <source type="image/jpeg" srcset="image.jpg?width=400, image.jpg?width=800 2x">
  <img src="image.jpg?width=400" width="400">
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

While other assets referenced from an HTML file will include a [content hash](/features/production/#content-hashing) in their compiled filename by default, files referenced by an `<a>` or `<iframe>` element will not. That's because these URLs are typically human readable, and need to have a stable name over time. Bundle naming can be overridden by [Namer plugins](/plugin-system/namer/).

### Video, audio, and other assets

The [`<video>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/video), [`<audio>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/audio), [`<track>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/track), [`<embed>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/embed), and [`<object>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/object) elements are supported. The referenced URLs are processed by Parcel and rewritten to include a [content hash](/features/production/#content-hashing).

### Open Graph and Schema.org metadata

Parcel supports [Open Graph](https://ogp.me), [Twitter Cards](https://developer.twitter.com/en/docs/twitter-for-websites/cards/overview/markup), [VK](https://vk.com/dev/publications), [Schema.org](https://schema.org), and [Microsoft pinned site](https://docs.microsoft.com/en-us/previous-versions/windows/internet-explorer/ie-developer/platform-apis/dn255024(v=vs.85)?redirectedfrom=MSDN) metadata defined using the [`<meta>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/meta) tag. Images and other URLs referenced in these elements are processed by Parcel and rewritten to include a [content hash](/features/production/#content-hashing).

```html
<meta property="og:image" content="100x100.png" />
```

### JSON-LD

Parcel supports [JSON-LD](https://json-ld.org) metadata embedded in HTML via `<script>` tags. Images and other URLs referenced in JSON-LD are processed by Parcel and rewritten to include a [content hash](/features/production/#content-hashing). This is handled by the `@parcel/transformer-jsonld` plugin, which will automatically be installed into your project when needed.

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

The `<link rel="manifest">` element is supported to reference a [Web manifest](https://developer.mozilla.org/en-US/docs/Web/Manifest). This is a JSON file that includes various metadata about the app, and allows it to be installed to the user's home screen or desktop. Parcel processes the URLs referenced in the `icons` and `screenshots` keys in this file. Web manifests may be written in either a `.json` or `.webmanifest` file.

```html
<link rel="manifest" href="manifest.json">
```

## Inline scripts and styles

`<script>` and `<style>` tags with text content are also processed just like standalone files, and the generated bundles are inserted back into the HTML file. The `type="module"` attribute on script tags works just as described above for external scripts. However, if some of your browser targets don't support ES modules natively, Parcel will only compile inline scripts to a non-module script and will not output a `<script type="module">` in order to keep the generated HTML small.

{% sample %}
{% samplefile "index.html" %}

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

{% endsamplefile %}
{% endsample %}

{% warning %}

**Note**: Use this sparingly, as big inline scripts/styles can be detrimental to the (perceived) load speed.

{% endwarning %}

## Inline `style` attribute

The [`style`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/style) attribute can be used on any HTML element to define CSS styles. Parcel will process the inline CSS, and insert the result back into the `style` attribute. This includes following referenced URLs such as background images, as well as applying [PostCSS](/languages/css/#postcss) plugins like autoprefixer.

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
      <use xlink:href="icon.svg"/>
    </svg>
  </body>
</html>
```

## Parallel scripts and styles

When referencing a script or style, sometimes Parcel will need to insert another dependent file into the compiled HTML file. For example, when referencing a JavaScript file which imports a CSS file, Parcel will insert a `<link>` element into the `<head>` to load this stylesheet in parallel with the JavaScript.

{% sample %}
{% samplefile "index.html" %}

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

{% endsamplefile %}
{% samplefile "app.js" %}

```javascript
import './app.css';

let app = document.createElement('div');
app.className = 'app';
app.textContent = 'My Parcel app!';
root.appendChild(app);
```

{% endsamplefile %}
{% samplefile "app.css" %}

```css
.app {
  background: red;
}
```

{% endsamplefile %}
{% endsample %}

Compiled HTML:

```html
<!DOCTYPE html>
<html>
  <head>
    <link rel="stylesheet" src="app.f8e9c6.css">
    <script type="module" src="app.26fce9.js"></script>
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>
```

This may also occur with scripts. For example, if two pages depend on the same JavaScript library (e.g. React or Lodash), it may be split out into its own bundle and loaded separately. Parcel will insert a `<script>` tag into the compiled HTML to load this "shared bundle" in parallel. See [Code Splitting](/features/code-splitting/) for more details.

## PostHTML

[PostHTML](https://github.com/posthtml/posthtml) is a tool for transforming HTML with plugins. You can configure PostHTML by creating a configuration file using one of these names: `.posthtmlrc` (JSON, **strongly** recommended), `.posthtmlrc.js`, or `posthtml.config.js`.

Install plugins in your app:

```bash
yarn add posthtml-doctype --dev
```

Then, create a config file:

{% sample %}
{% samplefile ".posthtmlrc" %}

```json
{
  "plugins": {
    "posthtml-doctype": { "doctype": "HTML 5" }
  }
}
```

{% endsamplefile %}
{% endsample %}

Plugins are specified in the plugins object as keys, and options are defined using object values. If there are no options for a plugin, just set it to an empty object instead.

This example uses [posthtml-include](https://github.com/posthtml/posthtml-include) to inline another HTML file.

{% sample %}
{% samplefile ".posthtmlrc" %}

```json
{
  "plugins": {
    "posthtml-include": {}
  }
}
```

{% endsamplefile %}
{% samplefile "index.html" %}

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

{% endsamplefile %}
{% samplefile "header.html" %}

```html
<header>This is my header</header>
```

{% endsamplefile %}
{% endsample %}

### posthtml.config.js

For some plugins that require passing a function as a configuration option, or to set up plugins based on `process.env.NODE_ENV`, you need to use a `posthtml.config.js` file for configuration instead of `.posthtmlrc`.

{% warning %}

**Note**: Using a JavaScript config file should be avoided if possible. These cause Parcel’s caching to be less effective, which means all of your HTML files will be recompiled each time you restart Parcel. To avoid this, use a JSON-based config format instead (e.g. `.posthtmlrc`).

{% endwarning %}

This example uses [posthtml-shorten](https://github.com/Rebelmail/posthtml-shorten) to shorten URLs using a custom shortening function.

```bash
yarn add posthtml-shorten --dev
```

{% sample %}
{% samplefile "posthtml.config.js" %}

```js
module.exports = {
  plugins: {
    "posthtml-shorten": {
      shortener: {
        process: function (url) {
          return new Promise((resolve, reject) => {
            resolve(url.replace(".html", ""));
          });
        },
      },
      tag: ["a"], // Allowed tags for URL shortening
      attribute: ["href"], // Attributes to replace on the elements
    },
  },
};
```

{% endsamplefile %}
{% samplefile "index.html" %}

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

{% endsamplefile %}
{% endsample %}

## Production

In production mode, Parcel includes optimizations to reduce the file size of your code. See [Production](/features/production/) for more details about how this works.

### Minification

In production mode, Parcel automatically minifies your code to reduce the file sizes of your bundles. By default, Parcel uses [htmlnano](https://github.com/posthtml/htmlnano) to perform HTML minification. To configure htmlnano, you can create a `.htmlnanorc` or `.htmlnanorc.json` file in your project root directory.

For example to retain HTML comments

{% sample %}
{% samplefile ".htmlnanorc" %}

```json
{
  "removeComments": false
}
```

{% endsamplefile %}
{% endsample %}

or to not minify SVG elements.

{% sample %}
{% samplefile ".htmlnanorc" %}

```json
{
  "minifySvg": false
}
```

{% endsamplefile %}
{% endsample %}

{% warning %}

**Note**: `.htmlnanorc.js` and `htmlnano.config.js` is also supported for JavaScript-based configuration, but should be avoided when possible because it reduces the effectiveness of Parcel's caching. Use a JSON based configuration format instead.

{% endwarning %}
