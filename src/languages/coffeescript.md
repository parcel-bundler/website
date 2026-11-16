# CoffeeScript

[CoffeeScript](https://coffeescript.org) is a language that transpiles to JavaScript, which allows you to use a shorter syntax and other features like [the existential operator](https://coffeescript.org/#existential-operator), [shorter array-splicing syntax](https://coffeescript.org/#slices), [block regular expressions](https://coffeescript.org/#regexes) and more.

Parcel supports CoffeeScript using the `@parcel/transformer-coffeescript` plugin. To use it, install it into your app and add it to your `.parcelrc`.

```shell
yarn add @parcel/transformer-coffeescript@next --dev
```

<code-sample>
<code-file name=".parcelrc">

```json/3
{
  "extends": "@parcel/config-default",
  "transformers": {
    "*.coffee": ["@parcel/transformer-coffeescript"]
  }
}
```

</code-file>
</code-sample>

CoffeeScript is compiled to JavaScript and processed as described in the [JavaScript docs](/languages/javascript/).

## Example usage

<code-sample>
<code-file name="index.html">

```html
<script type="module" src="app.coffee"></script>
```

</code-file>
<code-file name="app.coffee">

```coffeescript
console.log 'Hello world!'
```

</code-file>
</code-sample>
