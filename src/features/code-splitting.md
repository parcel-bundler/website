---
layout: layout.njk
eleventyNavigation:
  key: features-code-splitting
  title: ✂️ Code Splitting
  order: 3
summary: Load code as you need it (if you need it)
---

Parcel supports zero configuration code splitting out of the box. This allows you to split your application code into separate bundles which can be loaded on demand, which means smaller initial bundle sizes and faster load times. As the user navigates around in your application and modules are required, you can load child bundles on demand.

Code splitting is controlled by use of the dynamic `import()` syntax, which works like a hybrid of the normal `import` statement and the `require` function, but returns a Promise. This means that the module can be loaded asynchronously.

## Using dynamic imports

The following example shows how you might use dynamic imports to load a sub-page of your application on demand.

{% sample %}
{% samplefile %}

```js
import("./pages/about").then(function (page) {
  // Render page
  page.render();
});
```

{% endsamplefile %}
{% samplefile "pages/about.js" %}

```js
export function render() {
  // Render the page
}
```

{% endsamplefile %}
{% endsample %}

## Dynamic imports with async/await

Because `import()` returns a Promise, you can also use async/await syntax.

{% sample %}
{% samplefile %}

```js
async function load() {
  const page = await import("./pages/about");
  // Render page
  page.render();
}
load();
```

{% endsamplefile %}
{% samplefile "pages/about.js" %}

```js
export function render() {
  // Render the page
}
```

{% endsamplefile %}
{% endsample %}

## "Internalized" Bundles

If a asset is imported both synchronously and asynchronously, it doesn't make sense to create an actual async bundle (because the module is already loaded anyways).

In this situation, Parcel instead turns `import("foo")` into `Promise.resolve(require("foo"))`. So in a larger build, you should think of dynamic/async imports as "I don't need this import synchronously" rather than "This will become a new bundle".

## Shared Bundles

In many situations (e.g. when two HTML entry with a JavaScript `<script>` use the asset(s) or when two dynamic imports have common assets), Parcel splits these into a separate sibling bundle ("shared" bundle) to minimize code duplication.

The parameters for when this happens can be configured in `package.json`:

{% sample %}
{% samplefile "package.json" %}

```json5
{
  "name": "my-project",
  "dependencies": {
    ...
  },
  "@parcel/bundler-default": {
    "minBundles": 1,
    "minBundleSize": 3000,
    "maxParallelRequests": 20
  }
}
```

{% endsamplefile %}
{% endsample %}

Options:

- **minBundles**: for an asset to be split, it has to be used by more than `minBundles` bundles
- **minBundleSize**: for a shared bundled to be created, it has to be at least `minBundleSize` bytes big (before minification/treeshaking)
- **maxParallelRequests**: To prevent overloading the network with too many concurrent requests, this ensure that a given bundle can have only `maxParallelRequests - 1` sibling bundles (which have be loaded together with the actual bundle).

- **http**: This is a shorthand for setting the above values to defaults which are optimized for HTTP/1 or HTTP/2:

| HTTP version `version` | `minBundles` | `minBundleSize` | `maxParallelRequests` |
| ---------------------- | ------------ | --------------- | --------------------- |
| 1                      | 1            | 30000           | 6                     |
| 2 (default)            | 1            | 20000           | 25                    |

You can read more about this topic here on [web.dev](https://web.dev/granular-chunking-nextjs/)

<!--

## Bundle resolution

TODO ???

Parcel infers the location of bundles automatically. This is done in the [bundle-url](https://github.com/parcel-bundler/parcel/blob/master/packages/core/parcel-bundler/src/builtins/bundle-url.js) module, and uses the stack trace to determine the path where the initial bundle was loaded.

This means you don't need to configure where bundles should be loaded from, but also means you must serve the bundles from the same location.

Parcel currently resolves bundles at the following protocols: `http`, `https`, `file`, `ftp`, `chrome-extension` and `moz-extension`.

-->
