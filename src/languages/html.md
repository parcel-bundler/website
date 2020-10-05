---
layout: layout.njk
eleventyNavigation:
  key: languages-html
  title: <img src="/assets/lang-icons/html5.svg" alt=""/> HTML (PostHTML)
  order: 0
---

HTML assets are often the entry file that you provide to Parcel, but can also be referenced by JavaScript files, e.g. to provide links to other pages.

{% sample %}
{% samplefile "index.html" %}

```html/3,6,7,9
<!DOCTYPE html>
<html>
  <head>
    <link rel="stylesheet" type="text/css" href="./style.less" />
  </head>
  <body>
    <img src="./images/header.png" />
    More content: <a href="./other.html">Link to another page</a>.

    <script src="./index.ts"></script>
  </body>
</html>
```

{% endsamplefile %}
{% endsample %}

### Dependencies

Parcel detects most references in HTML to other files (such as `<script src="..."`, `<img src="...">`, `<video>` or `<meta property="og:image">`) and processes them as well. These references are rewritten so that they link to the correct output files. Relative filenames are resolved relative to the current HTML file.

One noteworthy aspect of this is that `<script type="module">` automatically creates a ESM JavaScript bundle (and restricting the Browserslist config to browsers supporting ESM). Together with `<script nomodule>`, this makes differential serving very straight forward (see also [Generic Webapp](/getting-started/webapp/#differential-serving)).

{% sample %}
{% samplefile "index.html" %}

```html/3,6,7,9
<!DOCTYPE html>
<script nomodule src="./index.ts"></script>
<script type="module" src="./index.ts"></script>
```

{% endsamplefile %}
{% endsample %}

### Inline script and style tags

`<script>` and `<style>` tags with text content are also processed just like standalone files and the generated bundles are inserted back into the HTML file.

{% sample %}
{% samplefile "index.html" %}

```html/2,5-6
<!DOCTYPE html>
<style>
  @import "./style.scss";
</style>
<script>
  import value from "./other.ts";
  console.log(value);
</script>
```

{% endsamplefile %}
{% endsample %}

{% warning %}

Use this sparingly, as big inline scripts/styles can be detrimental to the (perceived) load speed.

{% endwarning %}

### Inline `style` attribute

Inline `style` properties on HTML elements are turned into CSS assets, then PostCSS plugins are applied if configured and the result gets minified.

{% sample %}
{% samplefile "index.html" %}

```html
<!DOCTYPE html>
<div style="text-decoration: underline red;">Hello!</div>
```

{% endsamplefile %}
{% samplefile "package.json" %}

```json
{
  "devDependencies": {
    "autoprefixer": "^9.8.6",
    "parcel": "next"
  },
  "browserslist": ["Firefox 30"]
}
```

{% endsamplefile %}
{% samplefile ".postcssrc" %}

```json
{
  "plugins": {
    "autoprefixer": true
  }
}
```

{% endsamplefile %}
{% endsample %}

Output:

```html
<!DOCTYPE html>
<div style="-moz-text-decoration:underline red;text-decoration:underline red">
  Hello!
</div>
```

## PostHTML

PostHTML is a tool for transforming HTML with plugins. You can configure PostHTML by creating a configuration file using one of these names: `.posthtmlrc` (JSON, **strongly** recommend), `.posthtmlrc.js`, or `posthtml.config.js`.

Install plugins in your app:

```bash
yarn add posthtml-img-autosize
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

Plugins are specified in the plugins object as keys, and options are defined using object values. If there are no options for a plugin, just set it to `true` instead.

Another example:

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

Some plugins may require passing a **method as a configuration option**, or you would like to set up plugins based on `process.env.NODE_ENV` , in these cases you should use the `posthtml.config.js` file for configuration, instead of `.posthtmlrc`

Install plugins in your app:

```bash
npm i posthtml-modules posthtml-shorten -D
```

Then create a config file:

{% sample %}
{% samplefile "posthtml.config.js" %}

```js
module.exports = {
  plugins: {
    "posthtml-modules": {},
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


Note that for the usage of **posthtml-modules** defined *locals* cannot have a hyphen/dash `-` within their name, otherwise parcel fails at compilation. 

Furthermore, modules do not reload with HMR, unless you modify the file where you use them (in this case index.html)


{% samplefile "index.html" %}

```html
<html>
  <head>
    <title>Home</title>
  </head>
  <body>
   <module
      href="./modules/header.html"
      locals='{"headerTitle":"Work"}'
    >I will be rendered into content</module>
    <main>My content</main>
  </body>
</html>
```

{% endsamplefile %}
{% samplefile "modules/header.html" %}

```html
<header>Welcome to {{headerTitle}} with content: <content></content></header>
```

{% endsamplefile %}


The plugins are automatically executed during build phase :


{% samplefile "package.json" %}

```json
"scripts": {
    "build": "parcel build *.html",
}
```

{% endsamplefile %}


Run the build process


```bash
npm run build
```
{% endsample %}




## htmlnano

If minification is enabled (e.g. `parcel build` without `--no-minify`) all bundles are automatically processed with [htmlnano](https://github.com/posthtml/htmlnano).

It can be configured according to its documentation with a .htmlnanorc (JSON) or .htmlnanorc.js file, for example to retain HTML comments

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
  "minifySVG": false
}
```

{% endsamplefile %}
{% endsample %}
