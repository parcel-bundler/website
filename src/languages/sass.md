---
layout: layout.njk
title: Sass
eleventyNavigation:
  key: languages-sass
  title: <img src="/assets/lang-icons/sass.svg" alt=""/> Sass
  order: 6
---

Parcel supports [Sass](https://sass-lang.com/) files automatically using the `@parcel/transformer-sass` plugin. When a `.sass` or `.scss` file is detected, it will be installed into your project automatically.

Compiled Sass files are also processed the same way as [CSS](/languages/css/), which means [PostCSS](/languages/css/#postcss) plugins are also applied. [CSS modules](/languages/css/#css-modules) can also be used by naming your file with the `.module.scss` extension.

## Example usage

Referencing an SCSS file in an HTML file:

```html
<link rel="stylesheet" href="style.scss" />
```

Importing a Sass/SCSS file as a CSS module in JavaScript or TypeScript:

```js
import * as classes from './style.module.scss';

document.body.className = classes.body;
```

Directly compiling Sass/SCSS using the Parcel CLI:

```
parcel build style.scss
```

## Configuration

To configure Sass, create a `.sassrc` or `.sassrc.json` file. For a list of all options that you can define in these configuration files you can have a look at the official [Sass documentation](https://sass-lang.com/documentation/js-api#options)

{% warning %}

**Note**: `.sassrc.js` is also supported for JavaScript-based configuration, but should be avoided when possible because it reduces the effectiveness of Parcel's caching. Use a JSON based configuration format (e.g. `.sassrc.json`) instead.

{% endwarning %}
