# Markdown

[Markdown](https://commonmark.org) is a lightweight markup language for writing formatted text. Parcel supports compiling Markdown files to HTML pages out of the box, which makes it easy to build documentation sites, blogs, and other static websites.

## Example

Markdown files can be used as entries, or linked to from other pages. Each Markdown file is compiled to an HTML page.

```shell
parcel build 'src/**/*.md'
```

<code-sample>
<code-file name="index.md">

```md
# Hello, Markdown!

This is a [link to another page](other.md).

![An image](image.png)
```

</code-file>
</code-sample>

## Dependencies

Markdown files are processed just like [HTML](html.md). This means that links to other pages, images, and other references are followed and rewritten to point to the correct output files. You can link to other Markdown files directly, and the links will point to the compiled HTML pages.

```md
See the [getting started guide](getting-started.md#installation).
```

HTML is also allowed within Markdown. This includes all of Parcel's HTML features, such as [includes](html.md#includes) and [macros](html.md#macros).

```md
# My page

<div class="signup">
  <parcel:include src="newsletter-signup.html"></parcel:include>
</div>
```

<p-warning>

Markdown does not recognize element names that contain a colon, such as `<parcel:include>`, as HTML. When used on their own, they are treated as text. Place them inside another HTML element, such as a `<div>`, so that Markdown passes them through as HTML.

</p-warning>

## Configuration

The Markdown transformer can be configured using options in your `.parcelrc`. This example enables all of the options described below.

<code-sample>
<code-file name=".parcelrc">

```json
{
  "extends": "@parcel/config-default",
  "transformers": {
    "*.md": [
      {
        "plugin": "@parcel/transformer-markdown",
        "config": {
          "layout": "src/layout.html",
          "gfm": true,
          "toc": true,
          "anchors": true,
          "title": true,
          "description": true
        }
      }
    ]
  }
}
```

</code-file>
</code-sample>

### Layouts

Markdown files are compiled to HTML fragments by default. The `layout` option specifies an HTML [layout](html.md#layouts) to wrap each page in. The path is relative to the `.parcelrc`. The compiled Markdown content is inserted into the unnamed `<parcel:slot>` of the layout.

<code-sample>
<code-file name="src/layout.html">

```html/7
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <link rel="stylesheet" href="style.css" />
  </head>
  <body>
    <main><parcel:slot></parcel:slot></main>
  </body>
</html>
```

</code-file>
</code-sample>

Markdown files can also fill named slots using HTML elements with a `parcel:slot` attribute.

```md
# About us

<aside parcel:slot="sidebar">Contact us at hello@example.com</aside>

We make websites.
```

### GitHub Flavored Markdown

The `gfm` option enables [GitHub Flavored Markdown](https://github.github.com/gfm/) extensions, including tables, strikethrough, task lists, autolinks, and footnotes.

### Table of contents

The `toc` option generates a table of contents from the `<h2>`, `<h3>`, and `<h4>` headings in each page. It is rendered as a nested `<ol>` list of links, and placed in a slot named `toc`. Add a `<parcel:slot name="toc">` element to your layout to choose where it appears. When the layout has no `toc` slot, it is omitted.

<code-sample>
<code-file name="src/layout.html">

```html/3-5
<body>
  <main><parcel:slot></parcel:slot></main>
  <aside>
    <h3>Contents</h3>
    <parcel:slot name="toc"></parcel:slot>
  </aside>
</body>
```

</code-file>
</code-sample>

The `toc` and `anchors` options add an `id` to each heading that doesn't already have one (except the `<h1>`, which is the page title), so it can be linked to.

### Heading anchors

The `anchors` option makes headings link to themselves, so readers can easily copy a link to a section. The contents of each heading (except the `<h1>`) are wrapped in a link to its `id`. You can style these links with CSS, e.g. to show a `#` symbol on hover.

```html
<h2 id="getting-started"><a href="#getting-started">Getting started</a></h2>
```

### Title and description

The `title` option adds a `<title>` element to each page, using the text of the first `<h1>` heading. The `description` option adds a `<meta name="description">` element using the text of the first paragraph. These are useful for search engines and link previews.

If a page already has a `<title>` or `<meta name="description">` element, it is used instead. This allows you to override them when needed, e.g. by adding a `<title>` to the top of a Markdown file. These elements are moved into the page's `<head>` automatically.

## Code blocks

Fenced code blocks are compiled to `<pre><code>` elements, with a `language-*` class indicating the language of the code (e.g. `language-js`). To add syntax highlighting at build time, you can use an [HTML macro](html.md#custom-elements) that replaces `<pre>` elements, using a library such as [Prism](https://prismjs.com) or [Shiki](https://shiki.style).
