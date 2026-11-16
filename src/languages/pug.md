# Pug

[Pug](https://pugjs.org) is a templating language that compiles to HTML. Parcel supports Pug using the `@parcel/transformer-pug` plugin. To use it, install it into your app and add it to your `.parcelrc`.

```shell
yarn add @parcel/transformer-pug@next --dev
```

<code-sample>
<code-file name=".parcelrc">

```json/3
{
  "extends": "@parcel/config-default",
  "transformers": {
    "*.pug": ["@parcel/transformer-pug"]
  }
}
```

</code-file>
</code-sample>

Pug is compiled to HTML and processed as described in the [HTML docs](/languages/html/).

## Example usage

```pug
doctype html
html(lang="en")
  head
    link(rel="stylesheet", href="style.css")
  body
    h1 Hello Pug!
    p.
      Pug is a terse and simple templating language with a
      strong focus on performance and powerful features.
    script(type="module", src="index.js")
```

Pug may be used as an entry to Parcel just like HTML:

```shell
parcel serve index.pug
```

Pug may also be referenced anywhere a URL is allowed, e.g. in an HTML file, or from a JS file. To inline the compiled HTML into a JavaScript file, use the `bundle-text:` scheme. See [Bundle inlining](/features/bundle-inlining/) for details.

```js
import html from "bundle-text:./index.pug";

document.body.innerHTML = html;
```

## Configuration

Pug can be configured for `@parcel/transformer-pug` in your `.parcelrc`. See the [Pug API Reference](https://pugjs.org/api/reference.html) for details on the available options.

### Locals

You can define a `locals` object in your Pug config, and this will be provided to your Pug templates when rendering.

<code-sample>
<code-file name="index.pug">

```pug
h1 Hello, #{name}!
```

</code-file>
<code-file name=".parcelrc">

```json/6-8
{
  "extends": "@parcel/config-default",
  "transformers": {
    "*.pug": [{
      "plugin": "@parcel/transformer-pug",
      "config": {
        "locals": {
          "name": "Puggy"
        }
      }
    }]
  }
}
```

</code-file>
</code-sample>
