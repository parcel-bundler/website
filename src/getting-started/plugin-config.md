---
layout: layout.njk
eleventyNavigation:
  key: 🔌 Plugin Configuration
  order: 3
summary: How to use your own plugins and create named pipelines
---

{% note %}
Contrary to what this page's title might suggest, this is not about configuring individual plugins, but how to tell Parcel which plugin is responsible for (among others) which file type.
{% endnote %}

This is ... TODO

{% sample %}
{% samplefile ".parcelrc" %}

```json
{
  "extends": "@parcel/config-default",
  "transformers": {
    "*.{foo}": ["parcel-transformer-foo"]
  }
}
```

{% endsamplefile %}
{% endsample %}

### Named Pipelines

Transformers, Packagers (?), Optimizers, ?
