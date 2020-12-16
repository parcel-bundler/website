---
layout: layout.njk
eleventyNavigation:
  key: recipes-image
  title: <img src="/assets/lang-icons/image.svg" alt=""/> Image
  order: 2
---

Image assets can be imported and processed like any other asset in Parcel. As with any other asset you can import this asset from any other asset, so you can import images from html, css, js, ts, ...

## Parcel image transformer

Using the Parcel transformer `@parcel/transformer-image` you can resize, change the format and quality of an image. To do this we added the possibility to define query parameters.

The query parameters you can use are:

- `width`: The width to resize the image to
- `height`: The height to resize the image to
- `quality`: The image quality percentage you want, for example `?quality=75`
- `as`: File format to use, for example: `?as=webp`

Supported image formats: `jpeg` / `jpg`, `png`, `webp`, `tiff`, `heic` / `heif` and `raw`

A JavaScript example:

{% sample %}
{% samplefile "main.js" %}

```js
import imageUrl from "url:./image.jpeg?as=webp&width=250";
```

{% endsamplefile %}
{% endsample %}

An HTML example:

{% sample %}
{% samplefile "index.html" %}

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>HTML Example</title>
  </head>
  <body>
    <img src="url:./image.jpeg?as=webp&width=250" alt="test image" />
  </body>
</html>
```

{% endsamplefile %}
{% endsample %}

To do these image transformations we rely on the image transformation library [Sharp](https://sharp.pixelplumbing.com/)
