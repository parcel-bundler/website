---
layout: layout.njk
title: Less
eleventyNavigation:
  key: languages-less
  title: <img src="/assets/lang-icons/less.svg" class="dark-invert" alt=""/> Less
  order: 8
---

Parcel supports [Less](https://lesscss.org/) files using the `@parcel/transformer-less` plugin. To use it, install it into your app and add it to your `.parcelrc`.

```shell
yarn add @parcel/transformer-less@next --dev
```

{% sample %}
{% samplefile ".parcelrc" %}

```json/3
{
  "extends": "@parcel/config-default",
  "transformers": {
    "*.less": ["@parcel/transformer-less"]
  }
}
```

{% endsamplefile %}
{% endsample %}

Compiled Less files are also processed the same way as [CSS](/languages/css/), which means it is compiled for your browser targets, and any [PostCSS](/languages/css/#postcss) plugins are also applied. [CSS modules](/languages/css/#css-modules) can also be used by naming your file with the `.module.less` extension.

## Example usage

Referencing a Less file in an HTML file:

```html
<link rel="stylesheet" href="style.less" />
```

Importing a Less file as a CSS module in JavaScript or TypeScript:

```js
import * as classes from "./style.module.less";

document.body.className = classes.body;
```

Directly compiling Less using the Parcel CLI

```
parcel build style.less
```

## Configuration

Less can be configured for `@parcel/transformer-less` in your `.parcelrc`. The `paths` option specifies additional directories to search when resolving `@import` rules, relative to your project root. See the official [Less documentation](https://lesscss.org/usage/#less-options-include-paths) for more details.

<!-- TODO(v3): v2 read any Less option from .lessrc/.lessrc.js and passed it to less.render. The v3 plugin (packages-v3/less/src/LessTransformer.ts) only reads `paths` from its .parcelrc config and ignores everything else (e.g. javascriptEnabled, math, modifyVars, globalVars). No .lessrc support. Intentional? -->

{% sample %}
{% samplefile ".parcelrc" %}

```json/6
{
  "extends": "@parcel/config-default",
  "transformers": {
    "*.less": [{
      "plugin": "@parcel/transformer-less",
      "config": {
        "paths": ["src/styles"]
      }
    }]
  }
}
```

{% endsamplefile %}
{% endsample %}
