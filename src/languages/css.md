---
layout: layout.njk
title: CSS
eleventyNavigation:
  key: languages-css
  title: <img src="/assets/lang-icons/postcss.svg" alt=""/> CSS
  order: 2
---

Parcel includes support for CSS out of the box. To add a CSS file, either reference it with a `<link>` tag in an HTML file:

```html
<link rel="stylesheet" href="index.css" />
```

or import it from a JavaScript file:

```javascript
import './index.css';
```

## Dependencies

CSS assets can contain dependencies referenced by `@import` syntax, as well as references to images, fonts, etc. via the `url()` function.

### `@import`

The [`@import`](https://developer.mozilla.org/en-US/docs/Web/CSS/@import) at-rule can be used to inline another CSS file into the same CSS bundle as the containing file. This means that at runtime a separate network request will not be needed to load the dependency.

```css
@import 'other.css';
```

Referenced files should be [relative](/features/dependency-resolution/#relative-specifiers) to the containing CSS file. You can also use [absolute](/features/dependency-resolution/#absolute-specifiers) and [tilde](/features/dependency-resolution/#tilde-specifiers) specifiers. To import a CSS file from npm, use the `npm:` [scheme](/features/dependency-resolution/#url-schemes).

```css
@import 'npm:bootstrap/bootstrap.css';
```

When the `@parcel/resolver-glob` plugin is enabled, you can also use globs to import multiple CSS files at once. See [Glob specifiers](/features/dependency-resolution/#glob-specifiers) for more details.

```css
@import "./components/*.css";
```

### `url()`

The [`url()`](https://developer.mozilla.org/en-US/docs/Web/CSS/url()) function can be used to reference a file, for example a background image or font. The referenced file will be processed by Parcel, and the URL reference will be rewritten to point to the output filename.

```css
body {
  background: url(images/background.png);
}
```

Referenced files should be [relative](/features/dependency-resolution/#relative-specifiers) to the containing CSS file. You can also use [absolute](/features/dependency-resolution/#absolute-specifiers) and [tilde](/features/dependency-resolution/#tilde-specifiers) specifiers. The `data-url:` scheme can also be used to inline a file as a data URL. See [Bundle inlining](/features/bundle-inlining/) for more details.

```css
.logo {
  background: url('data-url:./logo.png');
}
```

{% warning %}

**Note**: Only [absolute paths](/features/dependency-resolution/#absolute-specifiers) may be used within CSS custom properties, not relative paths. This is because `url()` references in custom properties are resolved from the location where the `var()` is used, not where the custom property is defined. This means that the custom property could resolve to different URLs depending on which file it is used in. To resolve this ambiguity, use absolute paths when referencing URLs in custom properties.

{% sample %}
{% samplefile "/src/index.css" %}

```css
body {
  /* ❌ relative paths are not allowed in custom properties. */
  --logo: url(images/logo.png);
  /* ✅ use absolute paths instead. */
  --logo: url(/src/images/logo.png);
}
```

{% endsamplefile %}
{% samplefile "/src/home/header.css" %}

```css
.logo {
  background: var(--logo);
}
```

{% endsamplefile %}
{% endsample %}

In the above example, the relative path `images/logo.png` would resolve to `/src/home/images/logo.png` rather than `/src/images/logo.png` as you might expect, because it is referenced in `/src/home/header.css`. The absolute path `/src/images/logo.png` resolves consistently no matter which file `var(--logo)` is used in.

{% endwarning %}

## CSS modules

By default, CSS imported from JavaScript is global. If two CSS files define the same class names, they will potentially clash and overwrite each other. To solve this, Parcel supports [CSS modules](https://github.com/css-modules/css-modules).

CSS modules treat the classes defined in each file as unique. Each class name is renamed to include a unique hash, and a mapping is exported to JavaScript to allow referencing these renamed class names.

To use CSS modules, create a file with the `.module.css` extension, and import it from a JavaScript file with a [namespace import](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import#import_an_entire_modules_contents). Then, you can access each of the classes defined in the CSS file as an export from the module.

```javascript
import * as classes from './styles.module.css';

document.body.className = classes.body;
```

```css
.body {
  background: skyblue;
}
```

The `.body` class will be renamed to something unique to avoid selector clashes with other CSS files.

CSS modules also work with other languages that compile to CSS, such as SASS, Less, or Stylus. Name your file using the corresponding file extension, such as `.module.scss`, `.module.less`, or `.module.styl`.

### Tree shaking

Using CSS modules also has the benefit of making dependencies on specific class names explicit in your code. This enables unused CSS classes to be automatically removed.

![Example of tree shaking CSS modules](/blog/beta3/tree-shaking-css-modules.jpg)

As you can see in the above example, only the `.button` class is used, so the unused `.cta` class is removed from the compiled CSS file.

{% warning %}

**Note**: Tree shaking only works when you reference classes using either a [namespace](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import#import_an_entire_modules_contents) or [named](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import#import_a_single_export_from_a_module) import. Tree shaking does not work with [default imports](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import#importing_defaults).

```javascript
import styles from './styles.module.css';
```

should be replaced with:

```javascript
import * as styles from './styles.module.css';
```

{% endwarning %}

### Enabling CSS modules globally

By default, CSS modules are only enabled for files ending with `.module.css`. All other CSS files are treated as global CSS by default. However, this can be overridden to enable CSS modules for all files by configuring `@parcel/transformer-css` in your project root `package.json`.

{% sample %}
{% samplefile "package.json" %}

```json/2
{
  "@parcel/transformer-css": {
    "cssModules": true
  }
}
```

{% endsamplefile %}
{% endsample %}

{% warning %}

**Note**: In prior versions of Parcel, `postcss-modules` was used to implement CSS module support. Enabling CSS modules globally occurred in your project's PostCSS config file. This plugin can now be removed from your PostCSS config if you enable CSS modules as described above.

If this was the only PostCSS plugin you used, you can remove your PostCSS config entirely. This can improve build performance significantly. You may see a warning about this if you are not using any `postcss-modules` config options.

{% endwarning %}

## Transpilation

Parcel includes support for transpiling modern CSS syntax to support older browsers out of the box, including vendor prefixing and syntax lowering. In addition, [PostCSS](https://postcss.org) is supported to enable custom CSS transformations.

### Browser targets

By default Parcel does not perform any transpilation of CSS syntax for older browsers. This means that if you write your code using modern syntax or without vendor prefixes, that’s what Parcel will output. You can declare your app’s supported browsers using the `browserslist` field in your package.json. When this field is declared, Parcel will transpile your code accordingly to ensure compatibility with your supported browsers.

{% sample %}
{% samplefile "package.json" %}

```json
{
  "browserslist": "> 0.5%, last 2 versions, not dead"
}
```

{% endsamplefile %}
{% endsample %}

See the [Targets](/features/targets/) docs for more details on how to configure this.

### Vendor prefixing

Based on your configured browser targets, Parcel automatically adds vendor prefixed fallbacks for many CSS features. For example, when using the [`image-set()`](https://developer.mozilla.org/en-US/docs/Web/CSS/image/image-set()) function, Parcel will output a fallback `-webkit-image-set()` value as well, since Chrome does not yet support the unprefixed value.

```css
.logo {
  background: image-set(url(logo.png) 2x, url(logo.png) 1x);
}
```

compiles to:

```css
.logo {
  background: -webkit-image-set(url(logo.png) 2x, url(logo.png) 1x);
  background: image-set("logo.png" 2x, "logo.png");
}
```

In addition, if your CSS source code (or more likely a library) includes unnecessary vendor prefixes, Parcel CSS will automatically remove them to reduce bundle sizes. For example, when compiling for modern browsers, prefixed versions of the `transition` property will be removed, since the unprefixed version is supported by all browsers.

```css
.button {
  -webkit-transition: background 200ms;
  -moz-transition: background 200ms;
  transition: background 200ms;
}
```

becomes:

```css
.button {
  transition: background .2s;
}
```

### Syntax lowering

Parcel automatically compiles many modern CSS syntax features to more compatible output that is supported in your target browsers.

The following features are supported:

* [Color Level 5](https://drafts.csswg.org/css-color-5/)
  - [`color-mix()`](https://drafts.csswg.org/css-color-5/#color-mix) function
* [Color Level 4](https://drafts.csswg.org/css-color-4/)
  - [`lab()`](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/lab()), [`lch()`](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/lch()), `oklab()`, and `oklch()` colors
  - [`color()`](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/color()) function supporting predefined color spaces such as `display-p3` and `xyz`
  - [`hwb()`](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/hwb()) function
  - Space separated components in `rgb()` and `hsl()` functions
  - Hex colors with alpha, e.g. `#rgba` and `#rrggbbaa`
* [Logical properties](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Logical_Properties), e.g. `margin-inline-start`
* [Media query range syntax](https://developer.mozilla.org/en-US/docs/Web/CSS/Media_Queries/Using_media_queries#syntax_improvements_in_level_4), e.g. `@media (width <= 100px)` or `@media (100px < width < 500px)`
* Alignment shorthands, e.g. [`place-items`](https://developer.mozilla.org/en-US/docs/Web/CSS/place-items) and [`place-content`](https://developer.mozilla.org/en-US/docs/Web/CSS/place-content)
* [`clamp()`](https://developer.mozilla.org/en-US/docs/Web/CSS/clamp()) function
* [Double position gradient stops](https://css-tricks.com/while-you-werent-looking-css-gradients-got-better/) (e.g. `red 40% 80%`)
* Two-value [`overflow`](https://developer.mozilla.org/en-US/docs/Web/CSS/overflow) shorthand
* Multi-value [`display`](https://developer.mozilla.org/en-US/docs/Web/CSS/display) property (e.g. `inline flex`)

### Draft syntax

Parcel can also be configured to compile several draft specs that are not yet available natively in any browser. Because these are drafts and the syntax can still change, they must be enabled manually in your project.

#### Nesting

The [CSS Nesting](https://drafts.csswg.org/css-nesting/) draft spec enables style rules to be nested, with the selectors of the child rules extending the parent selector in some way. This is very commonly supported by CSS pre-processors like SASS, but with this spec, it will eventually be supported natively in browsers. Parcel compiles this syntax to un-nested style rules that are supported in all browsers today.

Because nesting is a draft, it is not enabled by default. To use it, enable it by configuring `@parcel/transformer-css` in your project root `package.json` file.

{% sample %}
{% samplefile "package.json" %}

```json
{
  "@parcel/transformer-css": {
    "drafts": {
      "nesting": true
    }
  }
}
```

{% endsamplefile %}
{% endsample %}

Once enabled, any CSS file in your project can use directly nested style rules or the `@nest` at rule.

[Directly nested style rules](https://drafts.csswg.org/css-nesting/#direct) must be prefixed with the `&` nesting selector. This indicates where the parent selector will be substituted. For example:

```css
.foo {
  color: blue;
  & > .bar { color: red; }
}
```

is equivalent to:

```css
.foo { color: blue; }
.foo > .bar { color: red; }
```

The [@nest rule](https://drafts.csswg.org/css-nesting/#at-nest) allows nesting where the parent selector is substituted somewhere other than at the start.

```css
.foo {
  color: red;
  @nest .parent & {
    color: blue;
  }
}
```

is equivalent to:

```css
.foo { color: red; }
.parent .foo { color: blue; }
```

[Conditional rules](https://drafts.csswg.org/css-nesting/#conditionals) such as `@media` may also be nested within a style rule, without repeating the selector. For example:

```css
.foo {
  display: grid;

  @media (orientation: landscape) {
    grid-auto-flow: column;
  }
}
```

is equivalent to:

```css
.foo { display: grid; }

@media (orientation: landscape) {
  .foo {
    grid-auto-flow: column;
  }
}
```

#### Custom media queries

Support for [custom media queries](https://drafts.csswg.org/mediaqueries-5/#custom-mq) is included in the Media Queries Level 5 draft spec. This allows you to define media queries that are reused in multiple places within a CSS file. Parcel CSS will perform this substitution ahead of time when this feature is enabled.

For example:

```css
@custom-media --modern (color), (hover);

@media (--modern) and (width > 1024px) {
  .a { color: green; }
}
```

is equivalent to:

```css
@media ((color) or (hover)) and (width > 1024px) {
  .a { color: green; }
}
```

Because custom media queries are a draft, they are not enabled by default. To use them, enable the `customMedia` feature by configuring `@parcel/transformer-css` in your project root `package.json` file.

{% sample %}
{% samplefile "package.json" %}

```json
{
  "@parcel/transformer-css": {
    "drafts": {
      "customMedia": true
    }
  }
}
```

{% endsamplefile %}
{% endsample %}

### Pseudo class replacement

Parcel supports replacing CSS pseudo classes such as `:focus-visible` with normal CSS classes that can be applied using JavaScript. This makes it possible to polyfill these pseudo classes for older browsers.

Pseudo class mappings can be configured in your project root `package.json` file:

{% sample %}
{% samplefile "package.json" %}

```json
{
  "@parcel/transformer-css": {
    "pseudoClasses": {
      "focusVisible": "focus-visible"
    }
  }
}
```

{% endsamplefile %}
{% endsample %}

The above configuration will result in the `:focus-visible` pseudo class in all selectors being replaced with the `.focus-visible` class. This enables you to use a JavaScript [polyfill](https://github.com/WICG/focus-visible), which will apply the `.focus-visible` class as appropriate.

The following pseudo classes may be configured as shown above:

* `hover` – corresponds to the `:hover` pseudo class
* `active` – corresponds to the `:active` pseudo class
* `focus` – corresponds to the `:focus` pseudo class
* `focusVisible` – corresponds to the `:focus-visible` pseudo class
* `focusWithin` – corresponds to the `:focus-within` pseudo class

## PostCSS

[PostCSS](http://postcss.org/) is a tool for transforming CSS with plugins. While Parcel supports equivalent functionality to many common PostCSS plugins such as [autoprefixer](https://github.com/postcss/autoprefixer) and [postcss-preset-env](https://github.com/csstools/postcss-preset-env) out of the box as described above, PostCSS is useful for more custom CSS transformations such as non-standard syntax additions. It is also used by popular CSS frameworks such as [Tailwind](https://tailwindcss.com).

You can use PostCSS with Parcel by creating a configuration file using one of these names: `.postcssrc`, `.postcssrc.json`, `.postcssrc.js`, or `postcss.config.js`.

First, install the postcss plugins you wish to use into your app:

```shell
yarn add tailwindcss --dev
```

Then, create a `.postcssrc`. Plugins are specified in the `plugins` object as keys, and options are defined using object values. If there are no options for a plugin, just set it to `true` instead.

If your plugins require additional configuration, create those files as well. For example, with Tailwind, you need a `tailwind.config.js`.

{% sample %}
{% samplefile ".postcssrc" %}

```json
{
  "plugins": {
    "tailwindcss": true
  }
}
```

{% endsamplefile %}

{% samplefile "tailwind.config.js" %}

```js
module.exports = {
  content: ["./src/*.{html,js}"],
  theme: {
    extend: {},
  },
  variants: {},
  plugins: [],
};
````

{% endsamplefile %}
{% endsample %}

### Default plugins

Parcel includes equivalents of `autoprefixer` and `postcss-preset-env` automatically when a `browserslist` is specified in your `package.json`. These are [implemented in Rust](https://github.com/parcel-bundler/parcel-css) and are significantly faster than PostCSS. If these are the only transforms you need in your project, then you may not need PostCSS at all.

If you have an existing project with a PostCSS config containing only the above plugins, you may be able to remove it entirely. If you are using additional plugins, you can remove `autoprefixer` and `postcss-preset-env` while keeping only the custom plugins. This can significantly improve build performance since Parcel’s builtin transpiler is much faster than PostCSS.

See [above](#transpilation) for more details about Parcel’s builtin transpilation support.

### postcss-import

By default, Parcel transforms each CSS file with PostCSS independently. However, some PostCSS plugins (e.g. `postcss-custom-properties`) potentially need to access declarations from other `@import`ed CSS assets.

In these cases, you can use [`postcss-import`](https://github.com/postcss/postcss-import) to run PostCSS over the whole bundle at once instead. [`postcss-url`](https://github.com/postcss/postcss-url) should also be used to ensure `url()` references are resolved correctly when imported files are inlined.

{% sample %}
{% samplefile ".postcssrc" %}

```json
{
  "plugins": {
    "postcss-import": true,
    "postcss-url": true,
    "postcss-custom-properties": true
  }
}
```

{% endsamplefile %}
{% samplefile "app.css" %}

```css
@import "./config/index.css";

html {
  background-color: var(--varColor);
}

.icon {
  width: 50px;
  height: 50px;
  background-image: var(--varIcon);
}
```

{% endsamplefile %}
{% samplefile "config/index.css" %}

```css
:root {
  --varColor: red;
  --varIcon: url("../icon.svg");
}
```

{% endsamplefile %}
{% endsample %}

## Production

In production mode, Parcel includes optimizations to reduce the file size of your code. See [Production](/features/production/) for more details about how this works.

### Minification

In production mode, Parcel automatically minifies your code to reduce the file sizes of your bundles. By default, Parcel uses [@parcel/css](https://github.com/parcel-bundler/parcel-css) to perform CSS minification.

{% warning %}

**Note**: In prior versions, Parcel used [cssnano](http://cssnano.co/) for minification. If your project contains a cssnano config file such as `.cssnanorc` or `cssnano.config.json`, you may see a warning that it is no longer applied after upgrading Parcel.

In most cases, you can simply remove the cssnano config file and allow Parcel to handle minification. However, if you do rely on certain settings in this configuration and want to continue using cssnano instead of `@parcel/css` for minifcation, you can configure Parcel to use `@parcel/optimizer-cssnano` instead.

{% sample %}
{% samplefile ".parcelrc" %}

```json
{
  "extends": "@parcel/config-default",
  "optimizers": {
    "*.css": ["@parcel/optimizer-cssnano"]
  }
}
```

{% endsamplefile %}
{% endsample %}

{% endwarning %}
