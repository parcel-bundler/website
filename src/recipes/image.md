---
layout: layout.njk
title: Image
eleventyNavigation:
  key: recipes-image
  title: <img src="/assets/lang-icons/image.svg" alt=""/> Image
  order: 2
---

Parcel has built in support for resizing, converting, and optimizing images. Images can be referenced from HTML, CSS, JavaScript, or any other file type.

## Resizing and converting images

Parcel includes an image transformer out of the box, which allows you to resize images, convert them to a different format, or adjust the quality to reduce file size. This can be done using query parameters when referencing the image, or using a [configuration](#configuration) file.

The image transformer relies on the [Sharp](https://sharp.pixelplumbing.com/) image transformation library, which will be automatically installed as a dev dependency into your project when needed.

The query parameters you can use are:

- `width` – The width to resize the image to
- `height` – The height to resize the image to
- `quality` – The image quality percentage you want, for example `?quality=75`
- `as` – File format to convert the image to, for example: `?as=webp`

### Image formats

The following image formats are supported, both as input and as output via the `as` query parameter: 

- `jpeg` / `jpg` - [JPEG](https://en.wikipedia.org/wiki/JPEG) is a very widely supported lossy image format. It's often used for photos, and offers reasonably good compression, but does not support transparency or lossless compression.
- `png` - [Portable Network Graphics](https://en.wikipedia.org/wiki/Portable_Network_Graphics) (PNG) is a lossless image format. PNGs are typically much larger than JPEGs or other lossy image formats, but support transparency and offer much higher quality for fine details.
- `webp` – [WebP](https://en.wikipedia.org/wiki/WebP) supports both lossy and lossless compression as well as animation and transparency. It's [supported](https://caniuse.com/webp) in all modern browsers, and offers better compression for the same quality as JPEGs and PNGs.
- `avif` – [AVIF](https://jakearchibald.com/2020/avif-has-landed/) is a new lossy image format based on the AV1 video codec which offers significant compression and quality improvements over JPEG and WebP. It's currently [supported](https://caniuse.com/avif) in the latest versions of Chrome and Firefox.

The following formats are also supported as inputs, but are not generally supported by browsers: `tiff`, `heic` / `heif`, and `raw`.

GIFs are also supported if you [setup a custom libvips build](https://github.com/lovell/sharp/issues/2437), however, using GIFs is discouraged due to their large file sizes. [Use a video format instead](https://web.dev/replace-gifs-with-videos/).

For more guidance on choosing the right image formats, see the guide on [web.dev](https://web.dev/choose-the-right-image-format/).

### JavaScript

To reference an image from JavaScript, use the `URL` constructor. For more details, see [URL dependencies](/languages/javascript/#url-dependencies) in the JavaScript docs.

{% sample %}
{% samplefile "main.js" %}

```js
const imageUrl = new URL(
  'image.jpeg?as=webp&width=250',
  import.meta.url
);
```

{% endsamplefile %}
{% endsample %}

### HTML

To reference an image from HTML, use the `<img>` or `<picture>` element. The same image can be referenced multiple times with different query parameters to create multiple versions in different formats or sizes. See the [HTML docs](/languages/html/#images) for more details.

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
    <picture>
      <source srcset="image.jpeg?as=avif&width=800" type="image/avif" />
      <source srcset="image.jpeg?as=webp&width=800" type="image/webp" />
      <source srcset="image.jpeg?width=800" type="image/jpeg" />
      <img src="image.jpeg?width=200" alt="test image" />
    </picture>
  </body>
</html>
```

{% endsamplefile %}
{% endsample %}

## Configuration

In addition to query parameters, Parcel also supports using a configuration file to define options that apply to all of the images in your project. For example, you could re-encode all images at a certain quality setting to reduce file size, or define more advanced options for each output format.

To set the quality across all images in your project, create a `sharp.config.json` file in your project and define the `quality` field. This will re-encode every image, not just ones referenced with query params.

{% sample %}
{% samplefile "sharp.config.json" %}

```json
{
  "quality": 80
}
```

{% endsamplefile %}
{% endsample %}

You can also define more advanced options per format. All images in formats with options defined in `sharp.config.json` will be re-encoded. See the full list of supported options [here](https://sharp.pixelplumbing.com/api-output#jpeg).

{% sample %}
{% samplefile "sharp.config.json" %}

```json
{
  "jpeg": {
    "quality": 75,
    "chromaSubsampling": "4:4:4"
  },
  "webp": {
    "nearLossless": true
  },
  "png": {
    "palette": true
  }
}
```

{% endsamplefile %}
{% endsample %}

## Image optimization

Parcel also includes lossless image optimization for JPEGs and PNGs by default in production mode, which reduces the size of images without affecting their quality. This does not require any query parameters or configuration to use. However, since the optimization is lossless, the size reduction possible may be less than if you use the `quality` query param, or use a modern format such as WebP or AVIF.

## Disabling image optimization

To disable the default image optimization for JPEGs and PNGs in production mode, add the following to your .parcelrc configuration file:

{% sample %}
{% samplefile ".parcelrc" %}

```json
{
  "extends": "@parcel/config-default",
  "optimizers": {
    "*.{jpg,jpeg,png}": []
  }
}
```

{% endsamplefile %}
{% endsample %}
