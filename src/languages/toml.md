---
layout: layout.njk
title: TOML
eleventyNavigation:
  key: languages-toml
  title: <img src="/assets/lang-icons/toml.svg" alt=""/> TOML
  order: 12
---

Parcel supports importing TOML files from JavaScript out of the box.

## Example usage

{% sample %}
{% samplefile "app.js" %}

```js
import data from "./data.toml";
console.log(data.hello[0]);
// => "world"
```

{% endsamplefile %}
{% samplefile "data.toml" %}

```toml
hello = [
  "world",
  "computer"
]
```

{% endsamplefile %}
{% endsample %}

TOML files are only converted to JavaScript when imported from JavaScript. When referenced from anywhere else, such as from an HTML file or as a [URL dependency](/languages/javascript/#url-dependencies) in JavaScript, they are copied to the output directory as is.
