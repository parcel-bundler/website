# Sass

Parcel supports [Sass](https://sass-lang.com/) files using the `@parcel/transformer-sass` plugin. Sass is compiled natively in Rust, so the `sass` npm package is not needed. To use it, install the plugin into your app and add it to your `.parcelrc`.

```shell
yarn add @parcel/transformer-sass@next --dev
```

<code-sample>
<code-file name=".parcelrc">

```json/3
{
  "extends": "@parcel/config-default",
  "transformers": {
    "*.{sass,scss}": ["@parcel/transformer-sass"]
  }
}
```

</code-file>
</code-sample>

Compiled Sass files are also processed the same way as [CSS](css.md), which means it is compiled for your browser targets, and any [PostCSS](css.md#postcss) plugins are also applied. [CSS modules](css.md#css-modules) can also be used by naming your file with the `.module.scss` extension.

## Example usage

Referencing an SCSS file in an HTML file:

```html
<link rel="stylesheet" href="style.scss" />
```

Importing a Sass/SCSS file as a CSS module in JavaScript or TypeScript:

```js
import * as classes from "./style.module.scss";

document.body.className = classes.body;
```

Directly compiling Sass/SCSS using the Parcel CLI:

```
parcel build style.scss
```

## Configuration

Sass can be configured for `@parcel/transformer-sass` in your `.parcelrc`. The `loadPaths` option specifies additional directories to search when resolving `@use`, `@forward`, and `@import` rules, relative to your project root. See the official [Sass documentation](https://sass-lang.com/documentation/js-api/interfaces/options/#loadPaths) for more details.

<!-- TODO(v3): v2 read any Sass option from .sassrc/.sassrc.json/.sassrc.js and passed it to the sass npm package. The v3 native plugin (crates/sass/src/lib.rs, compiled with the `sasso` Rust crate) only accepts `loadPaths` from its .parcelrc config; no .sassrc support and no other options (e.g. style, quietDeps, silenceDeprecations, includePaths alias). Intentional? -->

<code-sample>
<code-file name=".parcelrc">

```json/6
{
  "extends": "@parcel/config-default",
  "transformers": {
    "*.{sass,scss}": [{
      "plugin": "@parcel/transformer-sass",
      "config": {
        "loadPaths": ["src/styles"]
      }
    }]
  }
}
```

</code-file>
</code-sample>

Imports that cannot be found relative to the containing file or in `loadPaths` are resolved using Parcel's [dependency resolution](../features/dependency-resolution.md), so stylesheets can be imported from npm packages (including via the `sass` and `style` [package exports](../features/dependency-resolution.md#conditional-exports) conditions).
