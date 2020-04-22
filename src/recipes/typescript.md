---
layout: layout.njk
eleventyNavigation:
  key: Typescript
  title: <img src="/assets/lang-icons/typescript.svg" alt=""/> Typescript
  order: 7
summary: Explains the different ways TypeScript can be transpiled
---

TODO

- tsc vs babel
  - tsconfig ignored with babel
  - `@babel/preset-env` requries `plugin-transform-class-properties`

- isolated modules mode: limitations (`const enum`)
- tsconfig (`paths` is not supported?)
- `package.json#types` (automatic target like `main`)
-

{% sample %}
{% samplefile ".parcelrc" %}

```json/3
{
  "extends": "@parcel/config-default",
  "transformers": {
    "*.{ts,tsx}": ["@parcel/transformer-typescript-tsc"]
  }
}
```

{% endsamplefile %}
{% endsample %}

(This functionality is provided by `@parcel/transformer-babel` and `@parcel/transformer-typescript-tsc` TODO LINK.)
