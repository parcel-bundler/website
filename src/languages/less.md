---
layout: layout.njk
eleventyNavigation:
  key: languages-less
  title: <img src="/assets/lang-icons/less.svg" alt=""/> Less
  order: 8
---

Parcel supports [less](https://lesscss.org/) files out of the box by utilizing the `@parcel/transformer-less` plugin, under the hood this plugin uses the `less` npm package.

## Example Usage

Importing less in JavaScript/TypeScript

```JS
import './custom.less'
```

You can also directly include the less file in a HTML file.

```HTML
<link rel="stylesheet" href="./style.less">
```

Directly compile less using the Parcel CLI

```
parcel ./style.less
```

## Configuration

To configure less we support the following configuration files: `.lessrc` and `.lessrc.js` (we highly recommend to use the JSON version whenever possible for the best performance/cache experience)

To see the available options to configure less see the official [less documentation](http://lesscss.org/usage/#less-options).
