---
layout: layout.njk
title: YAML
eleventyNavigation:
  key: languages-yaml
  title: <img src="/assets/lang-icons/yaml.svg" class="dark-invert" alt=""/> YAML
  order: 13
---

Parcel supports importing YAML files (`.yaml` or `.yml`) from JavaScript out of the box.

## Example usage

{% sample %}
{% samplefile "app.js" %}

```js
import data from "./data.yaml";
console.log(data.hello[0]);
// => "world"
```

{% endsamplefile %}
{% samplefile "data.yaml" %}

```yaml
hello:
  - world
  - computer
```

{% endsamplefile %}
{% endsample %}

YAML files are only converted to JavaScript when imported from JavaScript. When referenced from anywhere else, such as from an HTML file or as a [URL dependency](/languages/javascript/#url-dependencies) in JavaScript, they are copied to the output directory as is.
