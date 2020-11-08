---
layout: layout.njk
eleventyNavigation:
  key: languages-stylus
  title: <img src="/assets/lang-icons/stylus.svg" alt=""/> Stylus
  order: 7
---

Parcel supports [stylus](https://stylus-lang.com/) files out of the box by utilizing the `@parcel/transformer-stylus` plugin, under the hood this plugin uses the `stylus` npm package.

## Example Usage

Importing stylus in JavaScript/TypeScript

```js
import "./custom.styl";
```

You can also directly include the stylus file in a HTML file.

```html
<link rel="stylesheet" href="./style.styl" />
```

Directly compile stylus using the Parcel CLI

```
parcel build ./style.styl
```

## Configuration

To configure stylus we support the following configuration files: `.stylusrc` and `.stylusrc.js` (we highly recommend to use the JSON version whenever possible for the best performance/cache experience)

To see the available options to configure stylus see the official [stylus documentation](https://stylus-lang.com/docs/js.html).
