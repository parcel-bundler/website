---
layout: layout.njk
title: Stylus
eleventyNavigation:
  key: languages-stylus
  title: <img src="/assets/lang-icons/stylus.svg" class="dark-invert" alt=""/> Stylus
  order: 7
---

Parcel supports [Stylus](https://stylus-lang.com/) files automatically using the `@parcel/transformer-stylus` plugin. When a `.styl` file is detected, it will be installed into your project automatically.

Compiled Stylus files are also processed the same way as [CSS](/languages/css/), which means it is compiled for your browser targets, and any [PostCSS](/languages/css/#postcss) plugins are also applied. [CSS modules](/languages/css/#css-modules) can also be used by naming your file with the `.module.styl` extension.

## Example usage

Referencing a Stylus file in an HTML file:

```html
<link rel="stylesheet" href="style.styl" />
```

Importing a Stylus file as a CSS module in JavaScript or TypeScript:

```js
import * as classes from './style.module.styl';

document.body.className = classes.body;
```

Directly compiling Stylus using the Parcel CLI

```
parcel build style.styl
```

## Configuration

To configure Stylus, create a `.stylusrc` file. To see the available options to configure stylus see the official [Stylus documentation](https://stylus-lang.com/docs/js.html).

{% warning %}

**Note**: `.stylusrc.js` is also supported for JavaScript-based configuration, but should be avoided when possible because it reduces the effectiveness of Parcel's caching. Use a JSON based configuration format (e.g. `.stylusrc`) instead.

{% endwarning %}
