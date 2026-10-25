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
<!DOCTYPE html>
<div id="app"></div>
<script type="module" src="home.js"></script>
```

{% endsamplefile %}
{% samplefile "home.js" %}

```jsx
import { createRoot } from "react-dom";

createRoot(app).render(<h1>Home</h1>, app);
```

{% endsamplefile %}
{% samplefile "profile.html" %}

```html
<!DOCTYPE html>
<div id="app"></div>
<script type="module" src="profile.js"></script>
```

{% endsamplefile %}
{% samplefile "profile.js" %}

```jsx
import { createRoot } from "react-dom";

createRoot(app).render(<h1>Profile</h1>, app);
```

{% endsamplefile %}
{% endsample %}

Compiled HTML:

{% sample %}
{% samplefile "home.html" %}

```html
<!DOCTYPE html>
<div id="app"></div>
<script type="module" src="23f6d9b4.js"></script>
<script type="module" src="home-fac9ed1a.js"></script>
```

{% endsamplefile %}
{% samplefile "profile.html" %}

```html
<!DOCTYPE html>
<div id="app"></div>
<script type="module" src="23f6d9b4.js"></script>
<script type="module" src="profile-9fc67e2c.js"></script>
```

{% endsamplefile %}
{% endsample %}

In the above example, both `home.js` and `profile.js` depend on `react-dom`, so it is split out into a separate bundle and loaded in parallel by adding an extra `<script>` tag to both HTML pages.

This also works between different sections of an app that have been code split with dynamic `import()`. Common dependencies shared between two dynamic imports will be split out and loaded in parallel with the dynamically imported modules.

### CSS ordering

Shared bundles are also created for CSS. Because the order of CSS rules affects the cascade, Parcel preserves the order in which stylesheets are imported on each page, splitting shared CSS bundles where needed so that the `<link>` tags on each page apply styles in the same order as your source code.

If stylesheets are imported in conflicting orders by different pages or dynamic imports, Parcel duplicates them so that each page gets the correct order, and emits a warning that names the conflicting stylesheets. Use a consistent import order to allow these styles to be shared.

### Configuration

By default, Parcel only creates shared bundles when shared modules reach a size threshold. This avoids splitting out very small modules and creating extra HTTP requests, which have overhead even with HTTP/2. If a module is below the threshold, it will be merged into another bundle that is already loaded on the page, or duplicated between pages instead.

Parcel also has a maximum parallel request limit to avoid overloading the browser with too many requests at once, and will merge or duplicate modules if this limit is reached. Parcel estimates the cost of each of these changes, including the amount of code downloaded on the first page load and on subsequent page loads, and how much cached code is invalidated when a file changes, and chooses the changes that reduce it the most. If a limit cannot be met without loading extra code, Parcel emits a warning.

By default, these parameters have been tuned for HTTP/2 with brotli compression. However, you can adjust these options to raise or lower them for your application. You can do this by configuring `@parcel/bundler-default` in the `.parcelrc` in your project root.

{% sample %}
{% samplefile ".parcelrc" %}

```json
{
  "extends": "@parcel/config-default",
  "bundler": {
    "plugin": "@parcel/bundler-default",
    "config": {
      "minBundleSize": 30000,
      "maxParallelRequests": 25
    }
  }
}
```

{% endsamplefile %}
{% endsample %}

The available options are:

- **minBundleSize** – For a shared bundle to be created, it has to be at least `minBundleSize` bytes big (before minification and tree shaking). This applies to JavaScript bundles. Defaults to `30000`. `0` disables this limit.
- **maxParallelRequests** – To prevent overloading the network with too many concurrent requests, this ensures that a maximum of `maxParallelRequests` bundles are loaded together, including the bundle itself and the shared bundles loaded in parallel with it. Defaults to `25`. `0` disables this limit.
- **firstPageLoadPriority** – A number between `0` and `1` that controls how much Parcel prioritizes the first page load over subsequent navigations, which can reuse shared bundles from the browser cache. Higher values favor fewer requests on the first load, and lower values favor reuse between pages. Defaults to `0.67`.
- **dependencyChangeRate** – A number between `0` and `1` describing how often your dependencies (e.g. code in `node_modules`) change relative to your own source code. This is used to estimate how much cached code is invalidated when a file changes. Defaults to `0.1`. `0` ignores changes to dependencies.
- **compression** – The compression your server uses to serve bundles: `"brotli"` (default), `"gzip"`, or `"none"`. This is used to estimate transfer sizes. Since each additional file adds overhead to the compressed size, Parcel may also combine small bundles when compression is enabled.

You can read more about this topic on [web.dev](https://web.dev/granular-chunking-nextjs/).

## Concurrent imports

When multiple dynamic imports are awaited together using `Promise.all` with an array of `import()` calls, Parcel knows that the modules are always loaded at the same time. They are placed into a single bundle, rather than splitting the modules they share into an extra bundle or duplicating them.

```js
let [editor, toolbar] = await Promise.all([
  import("./editor"),
  import("./toolbar"),
]);
```

If one of these modules is also imported somewhere else, it is kept in its own bundle.

## Internalized async bundles

If a module is imported both synchronously and asynchronously from within the same bundle, rather than splitting it out into a separate bundle, the async dependency will be “internalized”. This means it will be kept within the same bundle as the dynamic import to avoid duplication, but wrapped in a `Promise` to preserve semantics.

For this reason, dynamic import is merely a _hint_ that a dependency is not needed synchronously, not a guarantee that a new bundle will be created.

## Deduplication

If a dynamically imported module has a dependency that is already available in all of its possible ancestries, it will be deduplicated. For example, if a page imports a library which is also used by a dynamically imported module, the library will only be included in the parent since it will already be on the page at runtime.

## Manual shared bundles

{% warning %}

**Note**: Manual shared bundles are currently experimental and subject to change.

{% endwarning %}

By default, Parcel automatically splits commonly used modules into "shared bundles" and creates bundles in the scenarios listed above. However, in certain cases, you may want to specify exactly what goes into a bundle and who can request that bundle.

These scenarios include but are not limited to...

- Porting over your config from another build tool or bundler to Parcel
- Reducing your HTTP requests without duplicating assets, in favor of over-fetching
  - Over-fetching and loading fewer bundles overall can benefit measurements like [time-to-interactive](https://web.dev/articles/tti), especially for very large projects.
- Creating an optimized shared bundle for a specific route or set of modules

Manual Shared Bundles can be specified in the `@parcel/bundler-default` config in your project root `.parcelrc`. The `assets` property must be set to a list of globs. Any asset file paths matching these globs will be included in the manual shared bundle.

This example creates a vendor bundle which includes all JS assets from `node_modules`.

{% sample %}
{% samplefile ".parcelrc" %}

```json
{
  "extends": "@parcel/config-default",
  "bundler": {
    "plugin": "@parcel/bundler-default",
    "config": {
      "manualSharedBundles": [
        {
          "assets": ["node_modules/**/*"],
          "types": ["js"]
        }
      ]
    }
  }
}
```

{% endsamplefile %}
{% endsample %}

The full list of options are as follows:

- **assets** (required) - globs for Parcel to match on, relative to the project root. Files that match the globs will be placed into a singular bundle, and deduplicated across the project. Rules are checked in order, and an asset is placed in the bundle for the first rule it matches.
- **types** (optional) - Limits globs to only match on certain types (e.g. `js` or `css`). A bundle can only contain assets of the same type, so if a rule matches multiple types, a separate bundle is created for each type.

<!-- TODO(v3): the v2 `name`, `root` and `split` options are not implemented by v3's DefaultBundler (crates/parcel/src/bundler.rs ManualSharedBundle only has `assets` and `types`; unknown keys are silently ignored rather than rejected). Removed from the docs; confirm whether they are planned. -->

{% warning %}

**Be careful!**

Manual shared bundles apply to your **entire** code base, **including** `node_modules`, and the matched assets are excluded from the automatic code splitting normally done by Parcel. A manual shared bundle is loaded everywhere any of its assets are needed, which may result in over-fetching. Be mindful of the globs you use.

{% endwarning %}
