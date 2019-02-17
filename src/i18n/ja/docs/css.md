# CSS

_Supported extensions: `css`, `pcss`, `postcss`_

CSS assets can be imported from a JavaScript or HTML file:

```js
import './index.css'
```

```html
<link rel="stylesheet" type="text/css" href="index.css" />
```

CSS assets can contain dependencies referenced by `@import` syntax as well as references to images, fonts, etc. via the `url()` function. Other CSS files that are `@import`ed are inlined into the same CSS bundle, and `url()` references are rewritten to their output filenames. All filenames should be relative to the current CSS file.

```css
/* Import another CSS file */
@import './other.css';

.test {
  /* Reference an image file */
  background: url('./images/background.png');
}
```

In addition to plain CSS, other compile-to-CSS languages like LESS, SASS, and Stylus are also supported, and work the same way.

# PostCSS

[PostCSS](http://postcss.org) is a tool for transforming CSS with plugins, like [autoprefixer](https://github.com/postcss/autoprefixer), [Preset Env](https://github.com/csstools/postcss-preset-env), and [CSS Modules](https://github.com/css-modules/css-modules). You can configure PostCSS with Parcel by creating a configuration file using one of these names: `.postcssrc` (JSON), `.postcssrc.js`, or `postcss.config.js`.

Install plugins in your app:

```bash
yarn add postcss-modules autoprefixer
```

Then, create a `.postcssrc`:

```json
{
  "modules": true,
  "plugins": {
    "autoprefixer": {
      "grid": true
    }
  }
}
```

Plugins are specified in the `plugins` object as keys, and options are defined using object values. If there are no options for a plugin, just set it to `true` instead.

Target browsers for Autoprefixer, cssnext and other tools can be specified in `.browserslistrc` file:

```
> 1%
last 2 versions
```

CSS Modules are enabled slightly differently using the a top-level `modules` key. This is because Parcel needs to have special support for CSS Modules since they export an object to be included in the JavaScript bundle as well. Note that you still need to install `postcss-modules` in your project.

## Usage with existing CSS libraries

For CSS Modules to work properly with existing modules they need to specify this support in their own `.postcssrc`.

## Set cssnano minify config

Parcel adds [cssnano](http://cssnano.co) to postcss in order to minify css in production build, where custom configuration can be set by creating `cssnano.config.js` file:

```js
module.exports = {
  preset: [
    'default',
    {
      calc: false,
      discardComments: {
        removeAll: true
      }
    }
  ]
}
```
