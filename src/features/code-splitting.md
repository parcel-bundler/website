---
layout: layout.njk
eleventyNavigation:
  key: Code Splitting
  title: ✂️ Code Splitting
  order: 2
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
// pages/about.js
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
// pages/about.js
export function render() {
  // Render the page
}
```

{% endsamplefile %}
{% endsample %}

## "Internalized" Bundles

If a asset is imported both synchrounously and asynchrounously, it doesn't make sense to create an actual async bundle (because the module is already loaded anyways).

In this situation, Parcel instead turns `import("foo")` into `Promise.resolve(require("foo"))`. So in a larger build, you should think of dynamic/async imports as "I don't need this import synchronously" rather than "This will become a new bundle".

## Bundle resolution

TODO ???

Parcel infers the location of bundles automatically. This is done in the [bundle-url](https://github.com/parcel-bundler/parcel/blob/master/packages/core/parcel-bundler/src/builtins/bundle-url.js) module, and uses the stack trace to determine the path where the initial bundle was loaded.

This means you don't need to configure where bundles should be loaded from, but also means you must serve the bundles from the same location.

Parcel currently resolves bundles at the following protocols: `http`, `https`, `file`, `ftp`, `chrome-extension` and `moz-extension`.
