---
layout: layout.njk
title: XML
eleventyNavigation:
  key: languages-xml
  title: <img src="/assets/lang-icons/xml.svg" class="dark-invert" alt=""/> XML
  order: 17
---

Parcel supports transforming [RSS](https://en.wikipedia.org/wiki/RSS) and [Atom](https://en.wikipedia.org/wiki/Atom_(Web_standard)) feeds defined in XML files using the `@parcel/transformer-xml` plugin. When a `.xml`, `.rss`, or `.atom` file is detected, it will be installed into your project automatically.

## Dependencies

Parcel transforms URL references within RSS and Atom feeds to match the final name and [public URL](/features/targets/#publicurl), including [content hashes](/features/production/#content-hashing) where appropriate.

In RSS this includes:

* `<link>`
* `<url>`
* `<comments>`
* `<enclosure>`

In Atom this includes:

* `<link>`
* `<icon>`
* `<logo>`

## Embedded HTML

Embedded HTML and XHTML content inside RSS and Atom feeds is also transformed as described in [HTML](/languages/html/). All URL references within embedded HTML will also be transformed, and the referenced files will be processed with the relevant Parcel pipelines.

## HTML references

RSS and Atom feeds can be referenced from an HTML file using the `<link>` element. Use the `application/rss+xml` or `application/atom+xml` mime type as appropriate. Parcel will ensure that XML files referenced this way do not receive a content hash and have a consistent URL over time.

```html
<link
  href="feed.xml"
  rel="alternate"
  type="application/rss+xml"
  title="Blog RSS feed" />
```

## Example

This example shows an Atom feed containing a single entry. The URL references in the two `<link>` elements will be rewritten to include the public URL, and the image referenced in the content of the post will be processed and content hashed.

```xml
<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>Example Feed</title>
  <subtitle>A subtitle.</subtitle>
  <link href="/" />
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
