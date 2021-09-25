---
layout: layout.njk
title: MDX
eleventyNavigation:
  key: languages-mdx
  title: <img src="/assets/lang-icons/mdx.svg" alt=""/> MDX
  order: 16
---

[MDX](https://mdxjs.com) is a variant of [Markdown](https://daringfireball.net/projects/markdown/) that compiles to JSX, and supports embedding interactive components inside Markdown documents. Parcel supports MDX automatically using the `@parcel/transformer-mdx` plugin. When a `.mdx` file is detected, it will be installed into your project automatically.

## Example usage

First, install `@mdx-js/react`. This is needed to render MDX files as React components.

```shell
yarn add @mdx-js/react
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