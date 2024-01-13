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
import { createRoot } from 'react-dom';

createRoot(app).render(<h1>Home</h1>, app);
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
import { createRoot } from 'react-dom';

createRoot(app).render(<h1>Profile</h1>, app);
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

## Manual Shared Bundles (EXPERIMENTAL)

Parcel automatically splits out commonly used modules into "shared bundles" and creates bundles in the scenarios listed above. However, in certain cases, you may want to specify exactly what goes into a bundle and who can request that bundle.

These scenarios include but are not limited to...

- Porting over your config from another build tool or bundler to Parcel
- Reducing your HTTP requests without duplicating assets, in favor of over-fetching
  - We've found over-fetching and loading fewer bundles overall can greatly benefit measurements like TTI, especially for very large projects
- Creating an optimized shared bundle for a specific route or set of modules

As of this writing, MSBs, or Manual Shared Bundles can be specified via `package.json` using globs which Parcel will match on.

{% sample %}
{% samplefile "package.json" %}

```json5
{
  "@parcel/bundler-default": {
   "manualSharedBundles": [
      {
        "name": "vendor",
        "root": "manual.js",
        "assets": ["**/*"],
        "loadedBy": ["async1.js", "async2.js"],
        "types": ["js"],
        "split": 3
      },
    ],
  },
}
```

{% endsamplefile %}
{% endsample %}

`manualSharedBundles` takes an array of objects that require an `assets` field as an array of globs.

The optional parameters are as follows:

- **name** (optional) - Sets field `manualSharedBundle` on bundle to \<name\>, this can be read in a custom reporter or namer for development purposes
- **root** (optional) - Narrows the scope of the glob to the file specified. In the example above, the glob, `**/*` will match all imports within `manual.js`
- **assets** (required) - glob for Parcel to match on. Files that match the glob will be placed into a singular bundle, and deduplicated across the project unless otherwise specified. If no `root` is specified, Parcel attempts to match the glob **globally**.
- **types** (optional) - Limits globs to only match on a certain type. This field must be set if your `root` file contains multiple types or if the glob can match different types, as a bundle can only contain assets of the same type.
  - A **root** file can contain imports of multiple types, just make sure to add an object in the `manualSharedBundle` array per type.
- **split** (optional) - splits the manual bundle into x bundles. 
  - We've found that, for very large bundles, splitting them can improve measurements like CHR (cache hit ratio), as a smaller bundle is invalidated for a given change. 
- **loadedBy** (optional) - Narrows the scope of what bundles can reference your MSB (Manual Shared Bundle).
  - This is useful in the case where your MSB is used by asynchronous modules. Specifying the `loadedBy` field with those asynchronous modules ensures that the MSB's load and execution time will in fact be deferred. Parcel will instead duplicate the asset(s) required by any bundles not included in `loadedBy`.



#### BE CAREFUL 

This feature will overwrite any automatic code splitting parcel does, and can cause unintended load-order issues as it maps on your **entire** code base, **including** `/node_modules`. Be mindful of the globs you use, only specify 1 bundle per file type, and we recommend you specify a **root** file. 