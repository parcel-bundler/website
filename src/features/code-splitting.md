---
layout: layout.njk
title: Code Splitting
eleventyNavigation:
  key: features-code-splitting
  title: ✂️ Code Splitting
  order: 2
---

Parcel supports zero configuration code splitting out of the box. This allows you to split your application code into separate bundles which can be loaded on demand, resulting in smaller initial bundle sizes and faster load times.

Code splitting is controlled by use of the dynamic `import()` syntax, which works like the normal `import` statement, but returns a Promise. This means that the module can be loaded asynchronously.

## Using dynamic imports

The following example shows how you might use dynamic imports to load a sub-page of your application on demand.

{% sample %}
{% samplefile "pages/index.js" %}

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

Because `import()` returns a Promise, you can also use async/await syntax.

{% sample %}
{% samplefile "pages/index.js" %}

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

### Tree shaking

When Parcel can determine which exports of a dynamically imported module you use, it will tree shake the unused exports from that module. This works with static property accesses or destructuring, with either `await` or Promise `.then` syntax.

{% note %}

**Note:** For the `await` cases, unused exports can unfortunately only be removed when `await` is not transpilied away (i.e. with a modern browserslist config).

{% endnote %}

{% sample null, "column" %}

{% samplefile %}

```js
let { x: y } = await import("./b.js");
```

{% endsamplefile %}


{% samplefile %}

```js
let ns = await import("./b.js");
console.log(ns.x);
```

{% endsamplefile %}

{% samplefile %}

```js
import("./b.js").then((ns) => console.log(ns.x));
```

{% endsamplefile %}

{% samplefile %}

```js
import("./b.js").then(({ x: y }) => console.log(y));
```

{% endsamplefile %}

{% endsample %}

## Shared bundles

When multiple parts of your application depend on the same common modules, they are automatically deduplicated into a separate bundle. This allows commonly used dependencies to be loaded in parallel with your application code and cached separately by the browser.

For example, if your application has multiple pages with `<script>` tags that depend on the same common modules, those modules will be split out into a "shared bundle”. This way, if a user navigates from one page to another, they only need to download the new code for that page, and not the common dependencies between the pages.

{% sample %}
{% samplefile "home.html" %}

```html
<!doctype html>
<div id="app"></div>
<script type="module" src="home.js"></script>
```

{% endsamplefile %}
{% samplefile "home.js" %}

```jsx
import ReactDOM from 'react-dom';

ReactDOM.render(<h1>Home</h1>, app);
```

{% endsamplefile %}
{% samplefile "profile.html" %}

```html
<!doctype html>
<div id="app"></div>
<script type="module" src="profile.js"></script>
```

{% endsamplefile %}
{% samplefile "profile.js" %}

```jsx
import ReactDOM from 'react-dom';

ReactDOM.render(<h1>Profile</h1>, app);
```

{% endsamplefile %}
{% endsample %}

Compiled HTML:

{% sample %}
{% samplefile "home.html" %}

```html
<!doctype html>
<div id="app"></div>
<script type="module" src="react-dom.23f6d9.js"></script>
<script type="module" src="home.fac9ed.js"></script>
```

{% endsamplefile %}
{% samplefile "profile.html" %}

```html
<!doctype html>
<div id="app"></div>
<script type="module" src="react-dom.23f6d9.js"></script>
<script type="module" src="profile.9fc67e.js"></script>
```

{% endsamplefile %}
{% endsample %}

In the above example, both `home.js` and `profile.js` depend on `react-dom`, so it is split out into a separate bundle and loaded in parallel by adding an extra `<script>` tag to both HTML pages.

This also works between different sections of an app that have been code split with dynamic `import()`. Common dependencies shared between two dynamic imports will be split out and loaded in parallel with the dynamically imported modules.

### Configuration

By default, Parcel only creates shared bundles when shared modules reach a size threshold. This avoids splitting out very small modules and creating extra HTTP requests, which have overhead even with HTTP/2. If a module is below the threshold, it will be duplicated between pages instead.

Parcel also has a maximum parallel request limit to avoid overloading the browser with too many requests at once, and will duplicate modules if this limit is reached. Larger modules are prioritized over smaller ones when creating shared bundles.

By default, these parameters have been tuned for HTTP/2. However, you can adjust these options to raise or lower them for your application. You can do this by configuring the `@parcel/bundler-default` key in the package.json in your project root.

{% sample %}
{% samplefile "package.json" %}

```json5
{
  "@parcel/bundler-default": {
    "minBundles": 1,
    "minBundleSize": 3000,
    "maxParallelRequests": 20
  }
}
```

{% endsamplefile %}
{% endsample %}

The available options are:

- **minBundles** – For an asset to be split, it must be used by more than `minBundles` bundles.
- **minBundleSize** – For a shared bundled to be created, it has to be at least `minBundleSize`bytes big (before minification and tree shaking).
- **maxParallelRequests** – To prevent overloading the network with too many concurrent requests, this ensures that a maximum of `maxParallelRequests` sibling bundles can be loaded together.
- **http** – A shorthand for setting the above values to defaults which are optimized for HTTP/1 or HTTP/2. See the table below for these default values.

| `http`                 | `minBundles` | `minBundleSize` | `maxParallelRequests` |
| ---------------------- | ------------ | --------------- | --------------------- |
| 1                      | 1            | 30000           | 6                     |
| 2 (default)            | 1            | 20000           | 25                    |

You can read more about this topic on [web.dev](https://web.dev/granular-chunking-nextjs/).

## Internalized async bundles

If a module is imported both synchronously and asynchronously from within the same bundle, rather than splitting it out into a separate bundle, the async dependency will be “internalized”. This means it will be kept within the same bundle as the dynamic import to avoid duplication, but wrapped in a `Promise` to preserve semantics.

For this reason, dynamic import is merely a *hint* that a dependency is not needed synchronously, not a guarantee that a new bundle will be created.

## Deduplication

If a dynamically imported module has a dependency that is already available in all of its possible ancestries, it will be deduplicated. For example, if a page imports a library which is also used by a dynamically imported module, the library will only be included in the parent since it will already be on the page at runtime.
