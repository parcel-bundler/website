---
layout: layout.njk
title: Stylus
eleventyNavigation:
  key: languages-stylus
  title: <img src="/assets/lang-icons/stylus.svg" class="dark-invert" alt=""/> Stylus
  order: 7
---

Parcel supports [Stylus](https://stylus-lang.com/) files using the `@parcel/transformer-stylus` plugin. To use it, install it into your app and add it to your `.parcelrc`.

```shell
yarn add @parcel/transformer-stylus --dev
```

{% sample %}
{% samplefile ".parcelrc" %}

```json/3
{
  "extends": "@parcel/config-default",
  "transformers": {
    "*.{styl,stylus}": ["@parcel/transformer-stylus"]
  }
}
```

{% endsamplefile %}
{% endsample %}

Compiled Stylus files are also processed the same way as [CSS](/languages/css/), which means it is compiled for your browser targets, and any [PostCSS](/languages/css/#postcss) plugins are also applied. [CSS modules](/languages/css/#css-modules) can also be used by naming your file with the `.module.styl` extension.

## Example usage

Referencing a Stylus file in an HTML file:

```html
<link rel="stylesheet" href="style.styl" />
```

Importing a Stylus file as a CSS module in JavaScript or TypeScript:

```js
import * as classes from "./style.module.styl";

document.body.className = classes.body;
```

Directly compiling Stylus using the Parcel CLI

```
parcel build style.styl
```

## Configuration

Stylus can be configured for `@parcel/transformer-stylus` in your `.parcelrc`. To see the available options to configure stylus see the official [Stylus documentation](https://stylus-lang.com/docs/js.html). Directories listed in the `paths` option are relative to your project root.

{% sample %}
{% samplefile ".parcelrc" %}

```json/6-7
{
  "extends": "@parcel/config-default",
  "transformers": {
    "*.{styl,stylus}": [{
      "plugin": "@parcel/transformer-stylus",
      "config": {
        "paths": ["src/styles"],
        "imports": ["mixins"]
      }
    }]
  }
}
```

{% endsamplefile %}
{% endsample %}
