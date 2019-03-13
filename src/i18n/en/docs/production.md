# ✨ Production

When it comes time to bundle your application for production, you can use Parcel's production mode.

```bash
parcel build entry.js
```

## Optimisations

This disables watch mode and hot module replacement so it will only build once. It also enables the minifier for all output bundles to reduce file size. The minifiers used by Parcel are [terser](https://github.com/fabiosantoscode/terser) for JavaScript, [cssnano](http://cssnano.co) for CSS, and [htmlnano](https://github.com/posthtml/htmlnano) for HTML.

Enabling production mode also sets the `NODE_ENV=production` environment variable. Large libraries like React have development-only debugging features which are disabled by setting this environment variable, which results in smaller and faster builds for production.

To take advantage of the same kind of development-only debugging features, ensure that [terser's `dead_code` option](https://github.com/terser-js/terser#compress-options) is on (it is by default) and wrap any development-only debugging in a conditional check like so:

```js
if (process.env.NODE_ENV === 'development') { // Or, `process.env.NODE_ENV !== 'production'`
  // Only runs in development and will be stripped from production build.
}
```

## File naming strategy

To allow setting very aggresive caching rules to your cdn, for optimal performance and efficiency, Parcel hashes the file names of most bundles (according to whether the bundle should have a readable/rememberable name or not, mainly for SEO).

Parcel follows the following table, when it comes to naming bundles (Entrypoints are never hashed).

|                   Bundle Type | Type               | Content hashed |
| ----------------------------: | ------------------ | :------------: |
|                           Any | Entrypoint         |       ❌       |
|                    JavaScript | `<script>`         |       ✅       |
|                    JavaScript | Dynamic import     |       ❌       |
|                    JavaScript | Service worker     |       ❌       |
|                          HTML | iframe             |       ❌       |
|                          HTML | anchor link        |       ❌       |
| Raw (Images, text files, ...) | Import/Require/... |       ✅       |

The file hash follows the following naming pattern: `<directory name>-<hash>.<extension>`

## Cross platform gotchas

In an effort to optimize production build performance, Parcel will try to determine the number of CPUs available at the machine running the build command so it can distribute the work accordingly. To do so, Parcel relies on the [physical-cpu-count](https://www.npmjs.com/package/physical-cpu-count) library.

Be aware that this module assumes you have the [`lscpu`](http://manpages.courier-mta.org/htmlman1/lscpu.1.html) program available in your system.

## Using a CI

If you want to integrate Parcel in your Continuous Integration system (e.g. Travis or Circle CI), you might need to install Parcel as a local dependency.

The instructions can be [found here](getting_started.html#adding-parcel-to-your-project).
