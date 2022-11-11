---
layout: layout.njk
title: SugarSS
eleventyNavigation:
  key: languages-sugarss
  title: <img src="/assets/lang-icons/sugarss.svg" alt=""/> SugarSS
  order: 9
---

[SugarSS](https://github.com/postcss/sugarss) is an indent-based CSS syntax for [PostCSS](https://github.com/postcss/postcss). Parcel supports SugarSS automatically using the `@parcel/transformer-sugarss` plugin. When a `.sss` file is detected, it will be installed into your project automatically.

Compiled SugarSS files are also processed the same way as [CSS](/languages/css/), which means it is compiled for your browser targets, and any [PostCSS](/languages/css/#postcss) plugins are also applied. [CSS modules](/languages/css/#css-modules) can also be used by naming your file with the `.module.sss` extension.


## Example usage

Referencing a SugarSS file in an HTML file:

```html
<link rel="stylesheet" href="style.sss" />
```

Importing a SugarSS file as a CSS module in JavaScript or TypeScript:

```js
import * as classes from './style.module.sss';

document.body.className = classes.body;
```

Directly compiling SugarSS using the Parcel CLI

```
parcel build style.sss
```
