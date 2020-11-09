---
layout: layout.njk
eleventyNavigation:
  key: languages-less
  title: <img src="/assets/lang-icons/less.svg" alt=""/> Less
  order: 8
---

Parcel supports [Less](https://lesscss.org/) files out of the box by utilizing the `@parcel/transformer-less` plugin, under the hood this plugin uses the `less` npm package.

In the default Parcel config the [PostCSS](/languages/postcss) transformation pipeline also gets run over the compiled Less file to ensure minification and css modules just work.

## Example Usage

Importing Less in JavaScript/TypeScript

```js
import "./custom.less";
```

You can also directly include the Less file in a HTML file.

```html
<link rel="stylesheet" href="./style.less" />
```

Directly compile Less using the Parcel CLI

```
parcel build ./style.less
```

## Configuration

To configure Less we support the following configuration files: `.lessrc` and `.lessrc.js` (we highly recommend to use the JSON version whenever possible for the best performance/cache experience)

To see the available options to configure Less see the official [Less documentation](http://lesscss.org/usage/#less-options).
