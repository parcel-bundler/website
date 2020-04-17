---
layout: layout.njk
eleventyNavigation:
  key: Typescript
  title: <img src="/assets/lang-icons/typescript.svg"/> Typescript
  order: 6
summary: Explains the different ways TypeScript can be transpiled
---

TODO

- tsc vs babel
  - tsconfig ignored with babel
  - babel requries `transform-class-properties`

- isolated modules mode: limitations (`const enum`)
- tsconfig (`paths` is not supported?)
- `package.json#types`

{% sample %}
{% samplefile ".parcelrc" %}

```json/3
{
  "extends": "@parcel/config-default",
  "transforms": {
    "*.{ts,tsx}": ["@parcel/transformer-typescript-tsc"]
  }
}
```

{% endsamplefile %}
{% endsample %}

