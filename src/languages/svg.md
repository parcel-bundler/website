---
layout: layout.njk
title: SVG
eleventyNavigation:
  key: languages-svg
  title: <img src="/assets/lang-icons/svg.svg" alt=""/> SVG
  order: 3
---

SVG is a vector-based 2D graphics format based on XML, with support for interactivity and animation. Parcel includes support for SVG as a separate file, embedded in HTML, or imported as JSX in a JavaScript file.

## Dependencies

Parcel detects most references in SVG to other files (such as `<script>`, `<image>`, and `<use>`) and processes them as well. These references are rewritten so that they link to the correct output files.

File names are resolved relative to the current SVG file, but you can also use [absolute](/features/dependency-resolution/#absolute-specifiers) and [tilde](/features/dependency-resolution/#tilde-specifiers) specifiers. See [Dependency resolution](/features/dependency-resolution/) for details.

### Stylesheets

External stylesheets can be referenced via the `xml-stylesheet` processing instruction in an SVG document. You can reference a CSS file, or any other file that compiles to CSS such as [SASS](/languages/sass/), [Less](/languages/less/), or [Stylus](/languages/stylus).

{% sample %}
{% samplefile "example.svg" %}

```xml/0
<?xml-stylesheet href="style.css" ?>
<svg viewBox="0 0 240 20" xmlns="http://www.w3.org/2000/svg">
  <text>Red text</text>
</svg>
```

{% endsamplefile %}
{% samplefile "style.css" %}

```css
text {
  fill: red;
}
```

{% endsamplefile %}
{% endsample %}

See the [CSS](/languages/css/) docs for details on how CSS is processed by Parcel.

### Scripts

The `<script>` element can be used to reference a script file from SVG. You can reference a JavaScript file, or any other file that compiles to JavaScript such as [TypeScript](/languages/typescript/), [JSX](/languages/javascript/#jsx), or [CoffeeScript](/languages/coffeescript/).

The `type="module"` attribute should be used to indicate that a file is an [ES module](/languages/javascript/#es-modules) or [CommonJS](/languages/javascript/#commonjs) file. If it is omitted, then the referenced file is treated as a classic script. See [Classic scripts](/languages/javascript/#classic-scripts) for more information about this. ES modules are not yet supported natively in SVG, so Parcel compiles all JavaScript to classic scripts even if authored as a module.

{% note %}

**Note**: SVG uses the `href` attribute rather than the `src` attribute for `<script>` elements.

{% endnote %}

{% sample %}
{% samplefile "example.svg" %}

```xml/2
<svg viewBox="0 0 240 80" xmlns="http://www.w3.org/2000/svg">
  <circle cx="50" cy="50" r="50" fill="red" />
  <script type="module" href="interactions.js" />
</svg>
```

{% endsamplefile %}
{% samplefile "interactions.js" %}

```javascript
let circle = document.querySelector('circle');
circle.addEventListener('click', () => {
  circle.setAttribute('fill', 'blue');
});
```

{% endsamplefile %}
{% endsample %}

See the [MDN docs](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/script) for the `<script>` element for more info, and the [JavaScript](/languages/javascript/) docs for details on how Parcel processes JavaScript.

### Images

Raster images or other SVGs can be embedded in an SVG file using the [`<image>`](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/image) element. Parcel recognizes the `href` and `xlink:href` attributes.

```xml
<image href="image.jpg" width="100" height="50" />
```

Parcel’s image transformer can also be used to resize and convert images by using [Query parameters](/features/dependency-resolution/#query-parameters).

```xml
<image href="image.jpg?as=webp" width="100" height="50" />
```

{% note %}

**Note**: SVGs referenced via the `<image>` element do not load external resources such as stylesheets, fonts, and other images, and scripting and interactivity is disabled.

{% endnote %}

See the [Image](/recipes/image/) docs for details on how Parcel processes images.

### Links

SVG files can link to other web pages or files using the [`<a>`](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/a) element. Parcel supports the `href` and `xlink:href` attributes.

```xml
<a href="circle.html">
  <circle cx="50" cy="40" r="35" />
</a>
```

While other assets referenced from an SVG file will include a [content hash](/features/production/#content-hashing) in their compiled filename by default, files referenced by an `<a>` element will not. That's because these URLs are typically human readable, and need to have a stable name over time. Bundle naming can be overridden by [Namer plugins](/plugin-system/namer/).

### External references

Parcel supports external references via the `href` and `xlink:href` attributes on many other elements. See the [MDN docs](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/href) for more details.

```xml/0,2
<use href="fox.svg#path" stroke="red" />
<text>
  <textPath href="fox.svg#path">
    Quick brown fox jumps over the lazy dog.
  </textPath>
</text>
```

External resources referenced via the `url()` function in presentation attributes such as `fill`, `stroke`, `clip-path`, and many others are also supported.

```xml
<circle 
  cx="50" cy="40" r="35"
  fill="url(external.svg#gradient)" />
```

## Inline scripts and styles

`<script>` and `<style>` tags with text content are also processed just like standalone files, and the generated bundles are inserted back into the SVG file. Use the `type="module"` attribute as described above to enable importing other modules from an inline script.

{% sample %}
{% samplefile "example.svg" %}

```xml/3,6-8
<svg viewBox="0 0 240 80" xmlns="http://www.w3.org/2000/svg">
  <circle cx="50" cy="50" r="50" />
  <style>
    @import './style.scss';
  </style>
  <script type="module">
    import {setup} from './interactions.ts';
    let circle = document.querySelector('circle');
    setup(circle);
  </script>
</svg>
```

{% endsamplefile %}
{% samplefile "style.scss" %}

```scss
$fill: blue;

circle {
  fill: $fill;
}
```

{% endsamplefile %}
{% samplefile "interactions.ts" %}

```typescript
export function setup(element: SVGElement) {
  element.addEventListener('click', () => {
    element.setAttribute('fill', 'red');
  });
}
```

{% endsamplefile %}
{% endsample %}

CSS files referenced via `@import`, and JavaScript referenced via `import` will be bundled into the compiled SVG file. See [Stylesheets](#stylesheets) and [Scripts](#scripts) for how to reference an external file.

## Inline `style` attribute

The [`style`](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/style) attribute can be used on any SVG element to define CSS styles. Parcel will process the inline CSS, and insert the result back into the `style` attribute. This includes following referenced URLs, as well as applying [PostCSS](/languages/css/#postcss) plugins like autoprefixer.

```xml
<circle 
  cx="50" cy="40" r="35" 
  style="fill: url(external.svg#gradient)" />
```

## SVG in HTML

SVG in HTML can either be referenced as an external file, or embedded directly into an HTML document.

### External SVG

SVG files can be referenced from HTML in several ways. The simplest is to use the `<img>` element, and reference the SVG file using the `src` attribute. Parcel will follow the reference and process the SVG and all of its dependencies as well.

```html
<img src="logo.svg" alt="logo" />
```

This approach works great if your SVG is static. If the SVG references external resources such as other SVGs, images, fonts, stylesheets, or scripts, or contains any interactivity, it won’t work. You also cannot alter the styling of the SVG via CSS in the HTML page or manipulate the DOM of the SVG with JavaScript, and any text in the SVG cannot be selected by the user.

The [`<object>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/object) element can be used to embed an external SVG in HTML and enable external references, scripting, interactivity, and text selection. Use the `data` attribute to reference the SVG file.

```html
<object data="interactive.svg" title="Interactive SVG"></object>
```

This also allows you to get access to the SVG DOM via the `getSVGDocument()` method on the `<object>` element.

```javascript
let object = document.querySelector('object');
let svg = object.getSVGDocument();
let circle = svg.querySelector('circle');
circle.setAttribute('fill', 'red');
```

However, SVGs embedded using the `<object>` element cannot be styled by CSS on the HTML page.

### Inline SVG

SVG can be inlined into HTML directly rather than referenced as a separate file. This allows CSS on the HTML page to style the SVG elements. Parcel supports external references within embedded SVG the same way it does when the SVG is in a separate file.

```html/3-5
<!DOCTYPE html>
<html>
  <body>
    <svg width="100" height="100">
      <circle cx="50" cy="50" r="50" />
    </svg>
    <style>
      circle {
        fill: blue;
      }

      circle:hover {
        fill: green;
      }
    </style>
  </body>
</html>
```

## SVG in CSS

SVG can be referenced from CSS files using the `url()` function. As with the `<img>` element, SVGs in background images do not support external resources such as stylesheets, and scripting and interactivity is disabled.

```css
.logo {
  background: url('logo.svg');
}
```

You can also embed small SVGs in a CSS file using data URLs. Use the `data-url:` scheme to do this, and Parcel will build the SVG and inline the result into the compiled CSS. See [Bundle inlining](/features/bundle-inlining/) for more details.

```css
.logo {
  background: url('data-url:logo.svg');
}
```

## SVG in JavaScript

SVG files can either be referenced as an external URL from JavaScript, inlined as a string, or converted to JSX for rendering in a framework like React.

### URL references

Parcel supports referencing SVG files using the `URL` constructor. This example uses the result to render an `<img>` element using JSX. This works the same way as described in [External SVG](#external-svg) above. You can use an `<object>` element instead if the SVG is interactive or has external resources.

```jsx/0
const logo = new URL('logo.svg', import.meta.url);

export function Logo() {
  return <img src={logo} alt="logo" />;
}
```

See [URL dependencies](/languages/javascript/#url-dependencies) in the JavaScript docs for more details.

### Inlining as a string

SVG can be inlined as a string in JavaScript by importing it using the `bundle-text:` scheme.

```javascript/0
import svg from 'bundle-text:./logo.svg';

let logo = document.createElement('div');
logo.innerHTML = svg;
document.body.appendChild(logo);
```

See [Bundle inlining](/features/bundle-inlining/) for more details.

### Importing as a React component

The `@parcel/transformer-svg-react` plugin can be used to import an SVG file as a React component. This uses [SVGR](https://react-svgr.com) to transform the SVG file into JSX. It also uses [SVGO](https://github.com/svg/svgo) to optimize the SVG to reduce file size.

This plugin is not included in the default Parcel config, so you'll need to install it and add it to your `.parcelrc`.

```shell
yarn add @parcel/transformer-svg-react --dev
```

You can either configure your `.parcelrc` to convert all SVGs to JSX, or use a named pipeline to create a URL scheme that you can reference from a JavaScript import statement. This approach allows SVG files referenced from JavaScript to be converted to JSX, but SVGs referenced elsewhere to be kept as SVG files. Use the `"..."` syntax to run the default SVG transformer first before converting the SVG to JSX.

{% sample %}
{% samplefile ".parcelrc" %}

```json/3
{
  "extends": "@parcel/config-default",
  "transformers": {
    "jsx:*.svg": ["...", "@parcel/transformer-svg-react"]
  }
}
```

{% endsamplefile %}
{% samplefile "example.jsx" %}

```jsx/0
import Icon from "jsx:./icon.svg";

export const App = () => <Icon />;
```

{% endsamplefile %}
{% endsample %}

## Production

In production mode, Parcel includes optimizations to reduce the file size of your code. See [Production](/features/production/) for more details about how this works.

### Minification

In production mode, Parcel automatically minifies your code to reduce the file sizes of your bundles. By default, Parcel uses [SVGO](https://github.com/svg/svgo) to perform SVG minification.

To configure SVGO, you can create a `svgo.config.json` file in your project root directory. To see all the available configuration options for SVGO, see the [official documentation](https://github.com/svg/svgo#configuration).

{% sample %}
{% samplefile "svgo.config.json" %}

```json
{
  "plugins": [
    {
      "name": "preset-default",
      "params": {
        "overrides": {
          "inlineStyles": false
        }
      }
    }
  ]
}
```

{% endsamplefile %}
{% endsample %}

{% warning %}

**Note**: `svgo.config.js` is also supported for JavaScript-based configuration, but should be avoided when possible because it reduces the effectiveness of Parcel's caching. Use a JSON based configuration format instead.

{% endwarning %}

