# XML

Parcel supports transforming [RSS](https://en.wikipedia.org/wiki/RSS) and [Atom](<https://en.wikipedia.org/wiki/Atom_(Web_standard)>) feeds defined in XML files using the builtin `@parcel/transformer-xml` plugin. This applies to `.xml`, `.rss`, and `.atom` files.

## Dependencies

Parcel transforms URL references within RSS and Atom feeds to match the final name and [public URL](../features/targets.md#targets), including [content hashes](../features/production.md#content-hashing) where appropriate.

In RSS this includes:

- `<link>`
- `<url>`
- `<comments>`
- `<enclosure>`

In Atom this includes:

- `<link>`
- `<icon>`
- `<logo>`

In any XML file, stylesheets referenced via the `xml-stylesheet` processing instruction are also processed.

## Embedded HTML

Embedded HTML and XHTML content inside RSS and Atom feeds is also transformed as described in [HTML](html.md). All URL references within embedded HTML will also be transformed, and the referenced files will be processed with the relevant Parcel pipelines.

Embedded HTML may also use [`<parcel:include>`](html.md#includes) to insert the contents of another file. This is useful to include the full content of a blog post in a feed entry.

```xml
<entry>
  <title>Awesome post</title>
  <link href="posts/awesome.html" />
  <content type="html">
    &lt;parcel:include src="posts/awesome.md"&gt;&lt;/parcel:include&gt;
  </content>
</entry>
```

## Macros

[Macros](html.md#macros) can be called from XML files using the `<parcel:macro>` element, in the `http://parceljs.org` namespace. The content of the element is passed to the macro as an XML string, and the macro returns XML to insert in its place. For example, this could be used to generate the entries of a feed from your blog posts.

<code-sample>
<code-file name="feed.xml">

```xml/1,3
<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom" xmlns:parcel="http://parceljs.org">
  <title>My Blog</title>
  <parcel:macro src="posts.js#entries" />
</feed>
```

</code-file>
<code-file name="posts.js">

```js
const escape = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');

export function entries() {
  // getPosts reads the title and file names of each post, e.g. using the fs module.
  return getPosts()
    .map(
      post => `<entry>
  <title>${escape(post.title)}</title>
  <link href="${post.file}"/>
  <content type="html">${escape(`<parcel:include src="fragment:${post.source}"></parcel:include>`)}</content>
</entry>`,
    )
    .join('');
}
```

</code-file>
</code-sample>

The returned XML is parsed in the context of the macro element, so it uses the namespaces declared in the document, such as the default Atom namespace. URLs within it, including any embedded HTML, are processed as described above.

## HTML references

RSS and Atom feeds can be referenced from an HTML file using the `<link>` element. Use the `application/rss+xml` or `application/atom+xml` mime type as appropriate. Parcel will ensure that XML files referenced this way do not receive a content hash and have a consistent URL over time.

```html
<link
  href="feed.xml"
  rel="alternate"
  type="application/rss+xml"
  title="Blog RSS feed"
/>
```

## Example

This example shows an Atom feed containing a single entry. The URL references in the two `<link>` elements will be rewritten to include the public URL, and the image referenced in the content of the post will be processed and content hashed.

```xml
<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>Example Feed</title>
  <subtitle>A subtitle.</subtitle>
  <link href="index.html" />
  <id>urn:uuid:60a76c80-d399-11d9-b91C-0003939e0af6</id>
  <updated>2021-12-13T18:30:02Z</updated>
  <entry>
    <title>Awesome post</title>
    <link href="post.html" />
    <id>urn:uuid:1225c695-cfb8-4ebb-aaaa-80da344efa6a</id>
    <updated>2021-12-13T18:30:02Z</updated>
    <summary>Some text.</summary>
    <content type="xhtml">
      <div xmlns="http://www.w3.org/1999/xhtml">
        <p>This is the entry content.</p>
        <img src="image.png" />
      </div>
    </content>
    <author>
      <name>John Doe</name>
      <email>johndoe@example.com</email>
    </author>
  </entry>
</feed>
```
