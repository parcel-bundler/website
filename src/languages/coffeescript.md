---
layout: layout.njk
title: CoffeeScript
eleventyNavigation:
  key: languages-coffee
  title: <img src="/assets/lang-icons/coffeescript.svg" class="dark-invert" alt=""/> CoffeeScript
  order: 16
---

[CoffeeScript](https://coffeescript.org) is a language that transpiles to JavaScript, which allows you to use a shorter syntax and other features like [the existential operator](https://coffeescript.org/#existential-operator), [shorter array-splicing syntax](https://coffeescript.org/#slices), [block regular expressions](https://coffeescript.org/#regexes) and more.

Parcel supports CoffeeScript using the `@parcel/transformer-coffeescript` plugin. To use it, install it into your app and add it to your `.parcelrc`.

```shell
yarn add @parcel/transformer-coffeescript --dev
```

{% sample %}
{% samplefile ".parcelrc" %}

```json/3
{
  "extends": "@parcel/config-default",
  "transformers": {
    "*.coffee": ["@parcel/transformer-coffeescript"]
  }
}
```

{% endsamplefile %}
{% endsample %}

CoffeeScript is compiled to JavaScript and processed as described in the [JavaScript docs](/languages/javascript/).

## Example usage

{% sample %}
{% samplefile "index.html" %}

```html
<script type="module" src="app.coffee"></script>
```

{% endsamplefile %}
{% samplefile "app.coffee" %}

```coffeescript
console.log 'Hello world!'
```

{% endsamplefile %}
{% endsample %}
