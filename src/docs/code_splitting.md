# ✂️ Code Splitting

Parcel supports zero configuration code splitting out of the box. This allows you to split your application code into separate bundles which can be loaded on demand, which means smaller initial bundle sizes and faster load times. As the user navigates around in your application and modules are required, Parcel automatically takes care of loading child bundles on demand.

Code splitting is controlled by use of the dynamic `import()` function [syntax proposal](https://github.com/tc39/proposal-dynamic-import), which works like the normal `import` statement or `require` function, but returns a Promise. This means that the module is loaded asynchronously.

The following example shows how you might use dynamic imports to load a sub-page of your application on demand.

```javascript
import('./pages/about').then(function (page) {
  // Render page
});
```

Because `import()` returns a Promise, you can also use async/await syntax. You probably need to configure Babel to transpile the syntax though, until it is more widely supported by browsers.

```javascript
const page = await import('./pages/about');
// Render page
```

Dynamic imports are also lazily loaded in Parcel, so you can still put all your `import()` calls at the top of your file and the child bundles won't be loaded until they are used. The following example shows how you might lazily load sub-pages of an application dynamically.

```javascript
// Setup a map of page names to dynamic imports.
// These are not loaded until they are used.
const pages = {
  about: import('./pages/about'),
  blog: import('./pages/blog')
};

async function renderPage(page) {
  // Lazily load the requested page.
  const render = await pages[page];
  return render();
}
```
