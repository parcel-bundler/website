# ✨ Production

When it comes time to bundle your application for production, you can use Parcel's production mode.

```bash
parcel build entry.js
```

## Optimisations

This disables watch mode and hot module replacement so it will only build once. It also enables the minifier for all output bundles to reduce file size. The minifiers used by Parcel are [terser](https://github.com/fabiosantoscode/terser) for JavaScript, [cssnano](http://cssnano.co) for CSS, and [htmlnano](https://github.com/posthtml/htmlnano) for HTML.

Enabling production mode also sets the `NODE_ENV=production` environment variable. Large libraries like React have development only debugging features which are disabled by setting this environment variable, which results in smaller and faster builds for production.

## File naming strategy

To allow setting very aggresive caching rules to your cdn, for optimal performance and efficiency Parcel hashes the file names of most assets (according to whether the bundle should have a readable/rememberable name or not, mainly for SEO).

Parcel follows the following table, when it comes to naming bundles. (Entrypoints are never hashed)

| Language | Type | Content hashed | Public URL (maintains original name) |
| ---:| --- |:---:|:---:|
| JavaScript | Regular require/import |  |  |
| JavaScript | Dynamic import | ✅  |    |
| JavaScript | Service worker | ✅  | ✅ |
| HTML | iframe src | ✅ | ✅ |
| HTML | a href | ✅ | ✅ |
| CSS | import | ✅ |  |
| Raw (Images, text files, ...) | Import/Require/html link/... | ✅ |  |

The file hash follows the following naming pattern: `<directory name>-<hash>.<extension>`