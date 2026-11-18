<meta property="article:published_time" content="2026-11-18">

<header parcel:slot="header">
  <h1>Parcel 3 alpha 3: Static sites</h1>
  <div class="summary">
    <time datetime="2026-11-18" class="entry-date js-replace-date">2026-11-18</time>
  </div>
</header>

Parcel has always been great at building static websites. Point it at an HTML file and it follows every script, stylesheet, image, and link to build your whole site. But as sites grow, you need more than plain HTML: shared headers and footers, layouts, content written in Markdown, generated lists of pages, feeds, and clean URLs. Until now, that meant reaching for a separate static site generator, or a collection of PostHTML plugins.

Parcel 3 alpha 3 builds all of this in. It adds Markdown support, layouts and includes, build-time HTML macros, and naming rules for output files. These features are designed to work together to build complete content sites like documentation and blogs, with no extra dependencies or configuration files.

In fact, this website is now built with Parcel alone. We migrated it from Eleventy and a set of custom Parcel plugins, and now the whole site, including the blog you're reading, builds with just a `.parcelrc`.

## Markdown

Parcel now compiles [Markdown](../../languages/markdown.md) files to HTML pages out of the box. Markdown files can be build entries, or linked to from other pages just like HTML. Links between Markdown files point to the compiled pages, and images and other references are processed as usual.

```md
# Getting started

Read the [configuration guide](configuration.md#plugins) next.

![Screenshot](screenshot.png)
```

The Markdown transformer can be configured in your `.parcelrc`. It supports GitHub Flavored Markdown, generating a table of contents, linking headings to themselves, and setting each page's `<title>` and `<meta name="description">` from its content.

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

Since transformer configuration uses glob maps, you can use different options for different parts of a site, e.g. a different layout for blog posts.

## Layouts and includes

The `layout` option above wraps each page in an HTML layout. A layout is a regular HTML file with `<parcel:slot>` placeholders, which are filled with the page's content.

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <link rel="stylesheet" href="style.css" />
  </head>
  <body>
    <main><parcel:slot></parcel:slot></main>
    <aside><parcel:slot name="toc"></parcel:slot></aside>
  </body>
</html>
```

HTML pages can use layouts too, with the [`<parcel:layout>`](../../languages/html.md#layouts) element. Elements with a `parcel:slot` attribute fill the named slot in the layout, and everything else fills the unnamed slot. Layouts can also use other layouts. When a page is placed into a layout, elements like `<title>` and `<meta>` are moved into the layout's `<head>`, and attributes on `<html>` and `<body>` are merged.

The inverse is [`<parcel:include>`](../../languages/html.md#includes), which inserts the contents of another file into a page. This is useful for shared parts of a site such as headers and navigation. Included files can also define slots, which are filled by the children of the `<parcel:include>` element.

```html
<parcel:include src="card.html">
  <h2 parcel:slot="title">Getting started</h2>
  <p>Learn how to set up Parcel.</p>
</parcel:include>
```

Unlike a template language, each included file is compiled on its own, and the URLs within it are resolved relative to that file. A header can reference its logo as `logo.svg` and be included from pages in any directory.

## HTML macros

In Parcel 2.12, we [introduced](../v2-12-0/v2-12-0.md) macros: JavaScript functions that run at build time. In Parcel 3, macros can be called from HTML as well, using the [`<parcel:macro>`](../../languages/html.md#macros) element. A macro receives the element's content and attributes, and returns HTML to put in its place. This makes it easy to generate content from data, without writing a plugin.

<code-sample>
<code-file name="posts.html">

```html
<ul>
  <parcel:macro src="posts.js#postList" limit="5"></parcel:macro>
</ul>
```

</code-file>
<code-file name="posts.js">

```js
import fs from 'fs';

export function postList(content, {limit}) {
  return fs
    .globSync('posts/*.md')
    .slice(0, Number(limit))
    .map(file => `<li><a href="${file}">${file}</a></li>`)
    .join('');
}
```

</code-file>
</code-sample>

The HTML returned by a macro is processed like any other part of the page. In this example, the links point to Markdown files, which Parcel compiles and rewrites to the final URLs. The navigation on this blog is generated this way.

Macros can also be called using custom elements, defined with [`<parcel:define>`](../../languages/html.md#custom-elements), or for every page via the `macros` option of the HTML transformer (which also applies to compiled Markdown). These can even override built-in elements. For example, this site highlights code blocks at build time with a macro for the `<pre>` element.

```json
{
  "transformers": {
    "*.html": [
      {
        "plugin": "@parcel/transformer-html",
        "config": {
          "macros": {
            "pre": "src/highlight.mjs#pre"
          }
        }
      }
    ]
  }
}
```

## Feeds

Macros work in [XML](../../languages/xml.md#macros) files too, which makes it possible to generate RSS and Atom feeds. Each entry can use `<parcel:include>` to embed the full content of a post.

```xml
<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom" xmlns:parcel="http://parceljs.org">
  <title>My blog</title>
  <parcel:macro src="posts.js#entries" />
</feed>
```

The [feed](../../feed.xml) for this blog is generated this way, from the same list of posts used by the navigation.

## Naming rules

By default, Parcel names output files after their source files, so `docs/getting-started.md` becomes `docs/getting-started.html`. Many sites use URLs without the `.html` extension instead, with each page written to an `index.html` file in its own directory. Previously, this required a custom namer plugin.

The default namer now supports [naming rules](../../features/targets.md#naming-rules), which map source paths to output paths using globs. Parts of the path matched by the glob can be referenced using `$1`, `$2`, etc., and `[hash]` and `[ext]` placeholders are also supported.

```json
{
  "extends": "@parcel/config-default",
  "namers": [
    {
      "plugin": "@parcel/namer-default",
      "config": {
        "rules": {
          "src/index.html": "index.html",
          "src/**/*.md": "$1/$2/index.html",
          "src/images/**/*.{png,jpg}": "images/$1/$2.[hash].[ext]"
        }
      }
    }
  ]
}
```

A `shared` option also configures the names of bundles that aren't associated with a single source file, such as shared JavaScript and CSS bundles.

When pages are written to `index.html` files, links to them should point to the directory rather than the file. The new [`directoryIndex`](../../languages/html.md#directory-indexes) option of the HTML transformer does this, so `<a href="getting-started.md">` is written as `<a href="/docs/getting-started/">`.

## Performance improvements

This release also makes Parcel 3 even faster, and reduces memory usage. In development, JavaScript is now stored as generated code rather than as an AST, which takes much less memory and avoids printing unchanged code again on rebuilds. We also parallelized PNG image optimization.

Here's how cold builds compare before and after these changes:

| Build             | Alpha 2 | Alpha 3 | Change          |
| ----------------- | ------- | ------- | --------------- |
| three.js x10 dev  | 141ms   | 104ms   | −26%            |
| three.js x10 prod | 179ms   | 153ms   | −15%            |
| Storybook dev     | 408ms   | 325ms   | −20%            |
| Storybook prod    | 4.87s   | 1.12s   | **4.4× faster** |

Peak memory usage is also down significantly in development builds.

| Build             | Alpha 2 | Alpha 3 | Change |
| ----------------- | ------- | ------- | ------ |
| three.js x10 dev  | 564 MB  | 132 MB  | −77%   |
| three.js x10 prod | 539 MB  | 329 MB  | −39%   |
| Storybook dev     | 1.07 GB | 602 MB  | −44%   |
| Storybook prod    | 1.21 GB | 1.25 GB | +4%    |

## Native plugin improvements

Native plugins now receive the file path of the `.parcelrc` during initialization, as well as the parcel options, which enable resolving relative paths in plugin configuration, and reading files tracked by Parcel's file system. See [Configuration](../../plugin-system/native-plugins.md#configuration) in the native plugin docs for an example.

Native plugins can also report richer [diagnostics](../../plugin-system/logging.md#diagnostics), with multiple code frames, highlights, and hints, just like JavaScript plugins. A code frame can show generated code that doesn't exist on disk, such as a suggested fix.

Plugins built for earlier alphas keep working without being rebuilt. Plugins rebuilt with the new SDKs require Parcel 3.0.0-alpha.3 or later, and should declare that in their `package.json#engines.parcel` field.

## Try it out

Install `parcel@next` to try out Parcel 3 alpha 3, or `@parcel/parcel3` to try it side-by-side with Parcel 2. See the [Markdown](../../languages/markdown.md) and [HTML](../../languages/html.md) docs to learn more about these features, and the [source code](https://github.com/parcel-bundler/website) of this website for a complete example. Please send your feedback on [GitHub](https://github.com/parcel-bundler/parcel/issues).
