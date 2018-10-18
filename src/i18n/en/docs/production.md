# ✨ Production

When it comes time to bundle your application for production, you can use Parcel's production mode.

```bash
parcel build entry.js
```

## Optimisations

This disables watch mode and hot module replacement so it will only build once. It also enables the minifier for all output bundles to reduce file size. The minifiers used by Parcel are [terser](https://github.com/fabiosantoscode/terser) for JavaScript, [cssnano](http://cssnano.co) for CSS, and [htmlnano](https://github.com/posthtml/htmlnano) for HTML.

Enabling production mode also sets the `NODE_ENV=production` environment variable. Large libraries like React have development only debugging features which are disabled by setting this environment variable, which results in smaller and faster builds for production.

## File naming strategy

To allow setting very aggresive caching rules to your cdn, for optimal performance and efficiency, Parcel hashes the file names of most bundles (according to whether the bundle should have a readable/rememberable name or not, mainly for SEO).

Parcel follows the following table, when it comes to naming bundles. (Entrypoints are never hashed)

| Bundle Type | Type | Content hashed |
| ---:| --- |:---:|:---:|
| Any | Entrypoint            | ❌ |
| JavaScript | `<script>`     | ✅ |
| JavaScript | Dynamic import | ❌ |
| JavaScript | Service worker | ❌ |
| HTML | iframe               | ❌ |
| HTML | anchor link          | ❌ |
| Raw (Images, text files, ...) | Import/Require/... | ✅ |

The file hash follows the following naming pattern: `<directory name>-<hash>.<extension>`

## Cross platform gotchas

In an effort to optimize production build performance, Parcel will try to determine the number of CPUs available at the machine running the build command so it can distribute the work accordingly. To do so, Parcel relies on the [physical-cpu-count](https://www.npmjs.com/package/physical-cpu-count) library.

Be aware that this module assumes you have the [`lscpu`](http://manpages.courier-mta.org/htmlman1/lscpu.1.html) program available in your system.

## If You Can't Install Parcel Globally

Sometimes it's not possible to install Parcel globally e.g. if you're building on someone else's build agent. In this case, you can install and run Parcel as a local package.

To install with Yarn:

```bash
yarn add parcel-bundler --dev
```

To install with NPM:

```bash
npm install parcel-bundler --save-dev
```

In this situation you won't have access to an alias for the Parcel CLI. To build your project use the following command:

```bash
node ./node_modules/parcel-bundler/bin/cli.js build entry.js
```

To make working on your own machine easier, you can add the script to package.json.

```json
"scripts": {
    "build": "parcel build entry.js",
}
```

You can then build your site with `npm run build`.
