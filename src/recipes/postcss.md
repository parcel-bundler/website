---
layout: layout.njk
eleventyNavigation:
  key: (Post)CSS
  title: <img src="/assets/lang-icons/postcss.svg"/> (Post)CSS
---

To motivate to following tips, here's an overview over how Parcel processes CSS files (in that order):
- [@parcel/transformer-postcss](/official-plugins/transformer-postcss/):
  Applies `.postcssrc` and might generate CSS modules map
- [@parcel/transformer-css](/official-plugins/transformer-css/):
  Registers `@import ...` and `url(...)` into Parcel's graph
- [@parcel/packager-css](/official-plugins/packager-css/):
  Concat all CSS assets into a single bundle.
- [@parcel/optimizer-cssnano](/official-plugins/optimizer-cssnano/):
  Minify the bundle output from `@parcel/packager-css`.

As you can see, each asset is processed individually by PostCSS and concatenated with the others afterwards.

## Using `postcss-import`

<!-- https://github.com/parcel-bundler/parcel/issues/1165 -->

Some PostCSS plugins (e.g. `postcss-custom-properties`) potentionally need to access declarations from other `@import`ed CSS assets .

If you do want to run PostCSS on the whole bundle, we recommend you use `postcs-import` (to inline `@imports`) and `psotcss-url` (to rewrite `url(...)` expressions appropriately).

This isn't done by default because it would have a negative effect on caching (Parcel could't reuse unchanged assets anymore).

{% sample "index.html", "column" %}
{% samplefile "index.html" %}

```json
<link rel="stylesheet" type="text/css" href="./app.css" />
<div id="icon"></div>
```

{% endsamplefile %}

{% samplefile ".postcssrc" %}

```json
{
  "plugins": {
    "postcss-import": {},
    "postcss-url": {},
    "postcss-custom-properties": {}
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
