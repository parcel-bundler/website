---
layout: layout.njk
title: CSS
eleventyNavigation:
  key: languages-css
  title: <img src="/assets/lang-icons/postcss.svg" alt=""/> CSS
  order: 2
---

Parcel includes support for CSS out of the box. To add a CSS file, either reference it with a `<link>` tag in an HTML file:

```html
<link rel="stylesheet" href="index.css" />
```

or import it from a JavaScript file:

```javascript
import './index.css';
```

## Dependencies

CSS assets can contain dependencies referenced by `@import` syntax, as well as references to images, fonts, etc. via the `url()` function.

### `@import`

The [`@import`](https://developer.mozilla.org/en-US/docs/Web/CSS/@import) at-rule can be used to inline another CSS file into the same CSS bundle as the containing file. This means that at runtime a separate network request will not be needed to load the dependency.

```css
@import 'other.css';
```

Referenced files should be [relative](/features/dependency-resolution/#relative-specifiers) to the containing CSS file. You can also use [absolute](/features/dependency-resolution/#absolute-specifiers) and [tilde](/features/dependency-resolution/#tilde-specifiers) specifiers. To import a CSS file from npm, use the `npm:` [scheme](/features/dependency-resolution/#url-schemes).

```css
@import 'npm:bootstrap/bootstrap.css';
```

When the `@parcel/resolver-glob` plugin is enabled, you can also use globs to import multiple CSS files at once. See [Glob specifiers](/features/dependency-resolution/#glob-specifiers) for more details.

```css
@import "./components/*.css";
```

### `url()`

The [`url()`](https://developer.mozilla.org/en-US/docs/Web/CSS/url()) function can be used to reference a file, for example a background image or font. The referenced file will be processed by Parcel, and the URL reference will be rewritten to point to the output filename.

```css
body {
  background: url('images/background.png');
}
```

Referenced files should be [relative](/features/dependency-resolution/#relative-specifiers) to the containing CSS file. You can also use [absolute](/features/dependency-resolution/#absolute-specifiers) and [tilde](/features/dependency-resolution/#tilde-specifiers) specifiers. The `data-url:` scheme can also be used to inline a file as a data URL. See [Bundle inlining](/features/bundle-inlining/) for more details.

```css
.logo {
  background: url('data-url:./logo.png');
}
```

## CSS modules

By default, CSS imported from JavaScript is global. If two CSS files define the same class names, they will potentially clash and overwrite each other. To solve this, Parcel supports [CSS modules](https://github.com/css-modules/css-modules).

CSS modules treat the classes defined in each file as unique. Each class name is renamed to include a unique hash, and a mapping is exported to JavaScript to allow referencing these renamed class names.

To use CSS modules, create a file with the `.module.css` extension, and import it from a JavaScript file with a [namespace import](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import#import_an_entire_modules_contents). Then, you can access each of the classes defined in the CSS file as an export from the module.

```javascript
import * as classes from './styles.module.css';

document.body.className = classes.body;
```

```css
.body {
  background: skyblue;
}
```

The `.body` class will be renamed to something unique to avoid selector clashes with other CSS files.

CSS modules also work with other languages that compile to CSS, such as SASS, Less, or Stylus. Name your file using the corresponding file extension, such as `.module.scss`, `.module.less`, or `.module.styl`.

### Tree shaking

Using CSS modules also has the benefit of making dependencies on specific class names explicit in your code. This enables unused CSS classes to be automatically removed.

![Example of tree shaking CSS modules](/blog/beta3/tree-shaking-css-modules.jpg)

As you can see in the above example, only the `.button` class is used, so the unused `.cta` class is removed from the compiled CSS file.

{% warning %}

**Note**: Tree shaking only works when you reference classes using either a [namespace](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import#import_an_entire_modules_contents) or [named](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import#import_a_single_export_from_a_module) import. Tree shaking does not work with [default imports](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import#importing_defaults).

```javascript
import styles from './styles.module.css';
```

should be replaced with:

```javascript
import * as styles from './styles.module.css';
```

{% endwarning %}

### Enabling CSS modules globally

By default, CSS modules are only enabled for files ending with `.module.css`. All other CSS files are treated as global CSS by default. However, this can be overridden using a PostCSS config. This also allows customizing the options of [postcss-modules](https://github.com/madyankin/postcss-modules).

{% sample %}
{% samplefile ".postcssrc" %}

```json/1
{
  "modules": true,
  "plugins": {
    "postcss-modules": {
      "generateScopedName": "_[name]__[local]"
    }
  }
}
```

{% endsamplefile %}
{% endsample %}

## PostCSS

[PostCSS](http://postcss.org/) is a tool for transforming CSS with plugins, like [autoprefixer](https://github.com/postcss/autoprefixer), [Preset Env](https://github.com/csstools/postcss-preset-env), and many others. You can configure PostCSS with Parcel by creating a configuration file using one of these names: `.postcssrc`, `.postcssrc.json`, `.postcssrc.js`, or `postcss.config.js`.

Install plugins in your app:

```shell
yarn add autoprefixer --dev
```

Then, create a `.postcssrc`:

{% sample %}
{% samplefile ".postcssrc" %}

```json
{
  "plugins": {
    "autoprefixer": {
      "grid": true
    }
  }
}
```

{% endsamplefile %}
{% endsample %}

Plugins are specified in the `plugins` object as keys, and options are defined using object values. If there are no options for a plugin, just set it to `true` instead.

Target browsers for Autoprefixer, cssnext and other tools can be specified in a [Browserslist](https://github.com/browserslist/browserslist).

### postcss-import

By default, Parcel transforms each CSS file with PostCSS independently. However, some PostCSS plugins (e.g. `postcss-custom-properties`) potentially need to access declarations from other `@import`ed CSS assets.

In these cases, you can use [`postcss-import`](https://github.com/postcss/postcss-import) to run PostCSS over the whole bundle at once instead. [`postcss-url`](https://github.com/postcss/postcss-url) should also be used to ensure `url()` references are resolved correctly when imported files are inlined.

{% sample %}
{% samplefile ".postcssrc" %}

```json
{
  "plugins": {
    "postcss-import": true,
    "postcss-url": true,
    "postcss-custom-properties": true
  }
}
```

{% endsamplefile %}
{% samplefile "app.css" %}

```css
@import "./config/index.css";

html {
  background-color: var(--varColor);
}

.icon {
  width: 50px;
  height: 50px;
  background-image: var(--varIcon);
}
```

{% endsamplefile %}
{% samplefile "config/index.css" %}

```css
:root {
  --varColor: red;
  --varIcon: url("../icon.svg");
}
```

{% endsamplefile %}
{% endsample %}

## Production

In production mode, Parcel includes optimizations to reduce the file size of your code. See [Production](/features/production/) for more details about how this works.

### Minification

In production mode, Parcel automatically minifies your code to reduce the file sizes of your bundles. By default, Parcel uses [cssnano](http://cssnano.co/) to perform CSS minification. To configure cssnano, you can create a `.cssnanorc` or `cssnano.config.json` file in your project root directory.

{% sample %}
{% samplefile ".cssnanorc" %}

```json
{
  "preset": [
    "default",
    {
      "calc": false,
      "discardComments": {
        "removeAll": true
      }
    }
  ]
}
```

{% endsamplefile %}
{% endsample %}

{% warning %}

**Note**: `cssnano.config.js` is also supported for JavaScript-based configuration, but should be avoided when possible because it reduces the effectiveness of Parcel's caching. Use a JSON based configuration format (e.g. `cssnano.config.json`) instead.

{% endwarning %}
