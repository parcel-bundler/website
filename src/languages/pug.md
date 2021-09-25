---
layout: layout.njk
title: Pug
eleventyNavigation:
  key: languages-pug
  title: <img src="/assets/lang-icons/pug.svg" alt=""/> Pug
  order: 15
---

[Pug](https://pugjs.org) is a templating language that compiles to HTML. Parcel supports Pug automatically using the `@parcel/transformer-pug` plugin. When a `.pug` file is detected, it will be installed into your project automatically.

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
parcel index.pug
```

Pug may also be referenced anywhere a URL is allowed, e.g. in an HTML file, or from a JS file. To inline the compiled HTML into a JavaScript file, use the `bundle-text:` scheme. See [Bundle inlining](/features/bundle-inlining/) for details.

```js
import html from 'bundle-text:./index.pug';

document.body.innerHTML = html;
```

## Configuration

Pug can be configured using a `.pugrc`, `.pugrc.js`, or `pug.config.js` file. See the [Pug API Reference](https://pugjs.org/api/reference.html) for details on the available options.

{% warning %}

**Note:** `.pugrc.js` and `pug.config.js` are supported for JavaScript-based configuration, but should be avoided when possible because they reduce the effectiveness of Parcel's caching. Use a JSON based configuration format (e.g. `.pugrc`) instead.

{% endwarning %}

### Locals

You can define a `locals` object in your Pug config, and this will be provided to your Pug templates when rendering.

{% sample %}
{% samplefile "index.pug" %}

```pug
h1 Hello, #{name}!
```

{% endsamplefile %}
{% samplefile ".pugrc" %}

```json
{
  "locals": {
    "name": "Puggy"
  }
}
```

{% endsamplefile %}
{% endsample %}
