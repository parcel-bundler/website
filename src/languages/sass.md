---
layout: layout.njk
eleventyNavigation:
  key: languages-sass
  title: <img src="/assets/lang-icons/sass.svg" alt=""/> Sass
  order: 6
---

Parcel supports [sass](https://sass-lang.com/) files out of the box by utilizing the `@parcel/transformer-sass` plugin, under the hood this plugin uses the `sass` npm package which is the JavaScript version of `dart-sass`.

In the default Parcel config, the compiled Sass/SCSS files are also processed by [PostCSS](/languages/postcss) (meaning PostCSS plugins are executed and CSS modules just work: `import * as styles from "./style.module.scss";`).

## Example Usage

Importing Sass/SCSS in JavaScript/TypeScript

```js
import "./custom.scss";
```

You can also directly include the SCSS file in a HTML file.

```html
<link rel="stylesheet" href="./style.scss" />
```

Directly compile Sass/SCSS using the Parcel CLI

```
parcel build ./style.scss
```

## Configuration

To configure Sass we support the following configuration files: `.sassrc` and `.sassrc.js` (we highly recommend to use the JSON version whenever possible for the best performance/cache experience)

For a list of all options that you can define in these configuration files you can have a look at the official [Sass documentation](https://sass-lang.com/documentation/js-api)
