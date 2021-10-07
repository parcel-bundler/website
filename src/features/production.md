---
layout: layout.njk
title: Production
eleventyNavigation:
  key: features-production
  title: 🚀 Production
  order: 6
---

Parcel’s production mode automatically bundles and optimizes your application for production. It can be run using the `parcel build` command:

```shell
parcel build src/index.html
```

## Size optimization

Parcel includes many optimizations designed to reduce bundle sizes, including automatic minification, tree shaking, image optimization, and more.

### Minification

Parcel includes minifiers for JavaScript, CSS, HTML, and SVG out of the box. Minification reduces the file size of your output bundles by removing whitespace, renaming variables to shorter names, and many other optimizations.

By default, minification is enabled when using the `parcel build` command. You can use the `--no-optimize` CLI flag to disable minification and other optimizations if needed.

Parcel uses [terser](https://github.com/fabiosantoscode/terser) to minify JavaScript, [cssnano](http://cssnano.co/) for CSS, [htmlnano](https://github.com/posthtml/htmlnano) for HTML, and [svgo](https://github.com/svg/svgo) for SVG. If needed, you can configure these tools using a `.terserrc`, `.cssnanorc`, `.htmlnanorc`, or `svgo.config.json` config file. See the docs for [JavaScript](/languages/javascript/), [CSS](/languages/css/), [HTML](/languages/html), and [SVG](/languages/svg/) for more details.

### Tree shaking

In production builds, Parcel statically analyzes the imports and exports of each module, and removes everything that isn't used. This is called "tree shaking" or "dead code elimination". Tree shaking is supported for both static and dynamic `import()`, CommonJS and ES modules, and even across languages with CSS modules.

Parcel also concatenates modules into a single scope when possible, rather than wrapping each module in a separate function. This is called “scope hoisting”. This helps make minification more effective, and also improves runtime performance by making references between modules static rather than dynamic object lookups.

See the [Scope hoisting](/features/scope-hoisting/) docs for tips to make tree shaking more effective.

### Development branch removal

`parcel build` automatically sets the `NODE_ENV` environment variable to `production`. This environment variable is often used in libraries to enable development-only debugging features that can be stripped in production builds to reduce bundle size. Parcel inlines this environment variable and optimizes comparisons to remove dead branches.

You can take advantage of this feature in your own code as well. For example, you could use an if statement to check the `NODE_ENV` environment variable.

```javascript
if (process.env.NODE_ENV !== 'production') {
  // Only runs in development and will be stripped in production builds.
}
```

See the [Node emulation docs](/features/node-emulation/) for more details on environment variable inlining.

### Image optimization

Parcel supports resizing, converting, and optimizing images. You can use query parameters when referencing an image in HTML, CSS, or JavaScript to specify which format and size the image should be converted to. You can request multiple sizes or formats from the same source image, which helps support different types of devices or browsers efficiently.

```html
<picture>
  <source type="image/webp" srcset="image.jpg?as=webp&width=400, image.jpg?as=webp&width=800 2x">
  <source type="image/jpeg" srcset="image.jpg?width=400, image.jpg?width=800 2x">
  <img src="image.jpg?width=400" width="400">
</picture>
```

Resizing and converting images occurs both in development and production mode, so you can test with the correct image dimentions and formats as well. See the [Image transformer](/recipes/image/) docs for more details.

Parcel also includes lossless image optimization for JPEGs and PNGs by default in production mode, which reduces the size of images without affecting their quality. This does not require any query parameters or configuration to use. However, since the optimization is lossless, the size reduction possible may be less than if you use the `quality` query param, or use a modern format such as WebP or AVIF.

### Differential bundling

Parcel automatically produces a `<script type="module">` with modern JavaScript syntax, as well as a fallback `<script nomodule>` for older browsers when necessary. This reduces bundle sizes for a majority of users by avoiding transpilation of features like classes, async/await, and more. See [Differential bundling](/features/targets/#differential-bundling) in the Targets documentation for more details.

### Compression


Parcel supports compressing bundles using [Gzip](https://en.wikipedia.org/wiki/Gzip) and [Brotli](https://en.wikipedia.org/wiki/Brotli). While many servers compress data on the fly, others require you to upload pre-compressed payloads ahead of time. This may also allow for better compression, which would be too slow to do on every network request.

Because not everyone needs it, compression is not enabled by default. To enable it, add `@parcel/compressor-gzip` and/or `@parcel/compressor-brotli` to your `.parcelrc`.

```shell
yarn add @parcel/compressor-gzip @parcel/compressor-brotli --dev
```

{% sample %}
{% samplefile ".parcelrc" %}

```json
{
  "compressors": {
    "*.{html,css,js,svg,map}": [
      "...",
      "@parcel/compressor-gzip",
      "@parcel/compressor-brotli"
    ]
  }
}
```

{% endsamplefile %}
{% endsample %}

Now you’ll get a `.gz` and a `.br` file along side the original uncompressed bundle. If you have more text-based file types than listed in the above example, you'll need to extend the glob accordingly.

If you don’t need the uncompressed bundle, you can also remove the `"..."` from the above example to *only* output compressed files. For example, to only output a `.gz` file, you could use the following config:

{% sample %}
{% samplefile ".parcelrc" %}

```json
{
  "compressors": {
    "*.{html,css,js,svg,map}": ["@parcel/compressor-gzip"]
  }
}
```

{% endsamplefile %}
{% endsample %}

## Cache optimization

Parcel includes several optimizations related to browser and CDN caching, including content hashing, bundle manifests, and shared bundles.

### Content hashing

Parcel automatically includes content hashes in the names of all output files, which enables long-term browser caching. Whenever the contents of a bundle changes, the hash included in the filename will be updated, triggering invalidation of CDN and browser caches.

By default, all bundles include a content hash except entries and certain dependency types that require names to be stable. For example, service workers require a stable file name to work properly, and `<a>` tags in HTML reference user readable URLs.

You can also disable content hashing using the `--no-content-hash` CLI flag. Note that the name will still include a hash, but it will not change on each build. You can customize bundle naming completely using [Namer](/plugin-system/namer/) plugins.

### Cascading invalidation

Parcel uses a manifest in each entry bundle to avoid the [cascading invalidation](https://philipwalton.com/articles/cascading-cache-invalidation/) problem in many cases. This manifest includes a mapping of stable bundle ids to final content hashed filenames. When one bundle needs to reference another, it uses the bundle id rather than the content hashed name. This means that when a bundle updates, only that bundle and the entry will need to be invalidated in the browser cache and intermediary bundles will not change. This improves the cache hit rate across deployments.

### Shared bundles

In production builds, Parcel automatically optimizes the bundle graph in your application to reduce duplication and improve cacheability. When multiple parts of your application depend on the same common modules, they are automatically deduplicated into a separate bundle. This allows commonly used dependencies to be loaded in parallel with your application code and cached separately by the browser.

For example, if multiple pages in your app depend on `react` and `lodash`, they might be moved into a separate bundle rather than duplicated in each page. This way, when a user navigates from one page to another, they only need to download the additional code for that page rather than re-downloading those libraries which are already cached.

See the [Code splitting](/features/code-splitting/) docs for more details on how to configure this.

## Analyzing bundle sizes

Parcel includes some tools to help you analyze bundle sizes.

### Detailed report

By default, Parcel outputs a bundle report in the terminal when building for production. It includes the size and build time for each output bundle. To see more details about what files make up each bundle, you can use the `--detailed-report` CLI option. By default, it shows up to 10 files in each bundle, sorted by size. You can also pass a number to increase this, e.g. `--detailed-report 20`.

### Bundle analyzer

The `@parcel/reporter-bundle-analyzer` plugin can be used to generate an HTML file containing a tree map that shows the relative size of each asset in every bundle visually. You can run it using the `--reporter` CLI option.

```shell
parcel build src/index.html --reporter @parcel/reporter-bundle-analyzer
```

This generates a folder `parcel-bundle-reports` in your project root with an HTML file for every target:

<div style="border: 1px solid black">

![A screenshot of the bundle analyzer output](/assets/bundle-analyzer.png)

</div>

You can also add it to `"reporters"` in your `.parcelrc` file if you want to run the bundle analyzer on every build automatically.

### Bundle Buddy

The `@parcel/reporter-bundle-buddy` plugin can be used to generate a report that is compatible with [Bundle Buddy](https://bundle-buddy.com). You can run it using the `--reporter` CLI option.

```shell
parcel build src/index.html --reporter @parcel/reporter-bundle-buddy
```

Now upload the files in the `dist` directory to the [Bundle Buddy website](https://bundle-buddy.com/parcel).

<div style="border: 1px solid black">

![A screenshot of the Bundle Buddy website with a loaded project](/assets/bundle-buddy.png)

</div>
