---
layout: layout.njk
title: SugarSS
eleventyNavigation:
  key: languages-sugarss
  title: <img src="/assets/lang-icons/sugarss.svg" alt=""/> SugarSS
  order: 9
---

[SugarSS](https://github.com/postcss/sugarss) is an indent-based CSS syntax for [PostCSS](https://github.com/postcss/postcss). Parcel supports SugarSS using the `@parcel/transformer-sugarss` plugin. To use it, install it into your app and add it to your `.parcelrc`.

```shell
yarn add @parcel/transformer-sugarss@next --dev
```

{% sample %}
{% samplefile ".parcelrc" %}

```json/3
{
  "extends": "@parcel/config-default",
  "transformers": {
    "*.sss": ["@parcel/transformer-sugarss"]
  }
}
```

{% endsamplefile %}
{% endsample %}

Compiled SugarSS files are also processed the same way as [CSS](/languages/css/), which means it is compiled for your browser targets, and any [PostCSS](/languages/css/#postcss) plugins are also applied. [CSS modules](/languages/css/#css-modules) can also be used by naming your file with the `.module.sss` extension.

## Example usage

Referencing a SugarSS file in an HTML file:

```html
<link rel="stylesheet" href="style.sss" />
```

Importing a SugarSS file as a CSS module in JavaScript or TypeScript:

```js
import * as classes from "./style.module.sss";

document.body.className = classes.body;
```

Directly compiling SugarSS using the Parcel CLI

```
parcel build style.sss
```
