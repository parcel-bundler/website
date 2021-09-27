---
layout: layout.njk
title: TOML
eleventyNavigation:
  key: languages-toml
  title: <img src="/assets/lang-icons/toml.svg" alt=""/> TOML
  order: 12
---

Parcel supports importing TOML files from JavaScript using the `@parcel/transformer-toml` plugin. When a `.toml` file is detected, it will be installed into your project automatically.

## Example usage

{% sample %}
{% samplefile "app.js" %}

```js
import data from './data.toml';
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
