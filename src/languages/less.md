---
layout: layout.njk
title: Less
eleventyNavigation:
  key: languages-less
  title: <img src="/assets/lang-icons/less.svg" class="dark-invert" alt=""/> Less
  order: 8
---

Parcel supports [Less](https://lesscss.org/) files automatically using the `@parcel/transformer-less` plugin. When a `.less` file is detected, it will be installed into your project automatically.

Compiled Less files are also processed the same way as [CSS](/languages/css/), which means it is compiled for your browser targets, and any [PostCSS](/languages/css/#postcss) plugins are also applied. [CSS modules](/languages/css/#css-modules) can also be used by naming your file with the `.module.less` extension.

## Example usage

Referencing a Less file in an HTML file:

```html
<link rel="stylesheet" href="style.less" />
```

Importing a Less file as a CSS module in JavaScript or TypeScript:

```js
import * as classes from './style.module.less';

document.body.className = classes.body;
```

Directly compiling Less using the Parcel CLI

```
parcel build style.less
```

## Configuration

To configure Less, create a `.lessrc` file. To see the available options to configure Less see the official [Less documentation](http://lesscss.org/usage/#less-options).

{% warning %}

**Note**: `.lessrc.js` is also supported for JavaScript-based configuration, but should be avoided when possible because it reduces the effectiveness of Parcel's caching. Use a JSON based configuration format (e.g. `.lessrc`) instead.

{% endwarning %}
