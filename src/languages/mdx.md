---
layout: layout.njk
title: MDX
eleventyNavigation:
  key: languages-mdx
  title: <img src="/assets/lang-icons/mdx.svg" alt=""/> MDX
  order: 16
---

[MDX](https://mdxjs.com) is a variant of [Markdown](https://daringfireball.net/projects/markdown/) that compiles to JSX, and supports embedding interactive components inside Markdown documents.

## MDX v1 usage

Parcel supports MDX v1 automatically using the `@parcel/transformer-mdx` plugin. When a `.mdx` file is detected, it will be installed into your project automatically.

First, install `@mdx-js/react`. This is needed to render MDX files as React components.

```shell
yarn add @mdx-js/react@^1
```

Then, you can import a `.mdx` file into your JavaScript and render it using React:

{% sample %}
{% samplefile "app.js" %}

```js
import Hello from './hello.mdx';

export function App() {
  return <Hello />;
}
```

{% endsamplefile %}
{% samplefile "hello.mdx" %}

```md
# Hello, MDX!

This is a pretty cool MDX file.
```

{% endsamplefile %}
{% endsample %}

## MDX v3 usage

If you're using MDX v3, community plugin [`parcel-transformer-mdx`][1] is recommended, Babel & TypeScript configuration can be loaded automatically.

### Installation

```shell
npm i @parcel/config-default parcel-transformer-mdx -D
```

### Configuration

{% sample %}
{% samplefile ".parcelrc" %}

```json
{
    "extends": "@parcel/config-default",
    "transformers": {
        "*.{md,mdx}": ["parcel-transformer-mdx"]
    }
}
```

{% endsamplefile %}
{% endsample %}

[1]: https://img.shields.io/librariesio/github/EasyWebApp/Parcel-transformer-MDX.svg
