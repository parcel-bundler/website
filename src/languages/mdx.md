---
layout: layout.njk
title: MDX
eleventyNavigation:
  key: languages-mdx
  title: <img src="/assets/lang-icons/mdx.svg" alt=""/> MDX
  order: 5
---

[MDX](https://mdxjs.com) is a variant of [Markdown](https://daringfireball.net/projects/markdown/) that compiles to JSX, and supports embedding interactive components inside Markdown documents. Parcel supports MDX out of the box.

## Example

You can import a `.mdx` file into your JavaScript and render it using React:

{% sample %}
{% samplefile "app.js" %}

```jsx
import Hello from "./hello.mdx";

export function App() {
  return <Hello />;
}
```

{% endsamplefile %}
{% samplefile "hello.mdx" %}

```md
# Hello, MDX!

This is an MDX file.
```

{% endsamplefile %}
{% endsample %}

## Dependencies

Parcel detects dependency references in MDX files and processes them as well. These references are re-written so that they link to the correct output files. Supported dependencies include:

### Links

Links to other pages can be created with the Markdown link syntax or the HTML [`<a>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a) element.

```md
This is a [link](another-page.mdx).

This is <a href="somewhere.html">another link</a>
```

### Images

Images can be referenced using the Markdown image syntax, or the HTML [`<img>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img) element.

```md
![alt](some-image.jpg)

<img src="another-image.png">
```

### Video, audio, and other assets

The [`<video>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/video), [`<audio>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/audio), [`<track>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/track), [`<embed>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/embed), and [`<iframe>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/iframe) elements are supported. The referenced URLs are processed by Parcel and rewritten to include a [content hash](/features/production/#content-hashing).

## Code blocks

Parcel supports customizing how code blocks are rendered by specifying your own `CodeBlock` component. This allows you to implement syntax highlighting and other features.

{% sample %}
{% samplefile "app.js" %}

```jsx
import Hello from "./hello.mdx";

const components = { CodeBlock };

export function App() {
  return <Hello components={components} />;
}

function CodeBlock({ lang, children }) {
  return (
    <pre>
      <code className={lang ? `language-${lang}` : null}>
        {syntaxHighlight(children)}
      </code>
    </pre>
  );
}

function syntaxHighlight() {
  // ...
}
```

{% endsamplefile %}
{% endsample %}

### CodeBlock props

Markdown code fences accept arbitrary props, which are parsed as JSX and passed into the `CodeBlock` component.

````md
```tsx boolean string="hi" number={2}
console.log("hi");
```
````

The above example compiles to:

```jsx
<CodeBlock lang="tsx" boolean string="hi" number={2}>
  console.log("hi");
</CodeBlock>
```

### Rendering live code examples

Markdown code fences in JavaScript, TypeScript, and CSS support running the code live and rendering the result inline. Set the `render` prop on the code fence to pass the result of the code block to the `<CodeBlock>` component. For JavaScript and TypeScript, the result is the code block's default export. If there is no default export, the last expression in the code block is used, or the last function or class declaration, which is rendered as a component. For example:

````md
```tsx render
<div>Hello world!</div>
```
````

would render

```tsx
<CodeBlock lang="tsx" render={<div>Hello world!</div>}>
  &lt;div&gt;Hello world!&lt;/div&gt;
</CodeBlock>
```

The provided `CodeBlock` component can choose where to display the rendered value. The default implementation renders it after the `<pre>` element.

```html
<pre>
  <code class="language-tsx">
    &lt;div&gt;Hello world!&lt;/div&gt;
  </code>
</pre>
<div>Hello world!</div>
```

Rendered JSX expressions and components are updated in place with React Fast Refresh (see [Hot reloading](/features/development/#hot-reloading)) when you edit the MDX file during development.

## Table of contents

MDX files also export a `tableOfContents` array, which contains the headings in the document. Each entry has a `title`, the heading `level` (1–6), and an array of `children` containing nested headings. This can be used to render a navigation sidebar, for example.

{% sample %}
{% samplefile "app.js" %}

```jsx
import Hello, { tableOfContents } from "./hello.mdx";

export function App() {
  return (
    <>
      <Toc items={tableOfContents} />
      <Hello />
    </>
  );
}

function Toc({ items }) {
  return (
    <ul>
      {items.map((item) => (
        <li key={item.title}>
          {item.title}
          {item.children.length > 0 && <Toc items={item.children} />}
        </li>
      ))}
    </ul>
  );
}
```

{% endsamplefile %}
{% endsample %}
