---
layout: layout.njk
eleventyNavigation:
  key: languages-less
  title: <img src="/assets/lang-icons/less.svg" alt=""/> Less
  order: 8
---

Parcel supports [Less](https://lesscss.org/) files out of the box by utilizing the `@parcel/transformer-less` plugin, under the hood this plugin uses the `less` npm package.

In the default Parcel config, the compiled Less files are also processed by [PostCSS](/languages/postcss) (meaning PostCSS plugins are executed and CSS modules just work: `import * as styles from "./style.module.less";`).

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
