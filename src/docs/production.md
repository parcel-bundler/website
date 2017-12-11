# ✨ Production

When it comes time to bundle your application for production, you can use Parcel's production mode.

```bash
parcel build entry.js
```

To change the output directory that bundles are written to, you can pass `--out-dir [directory]` (it will default to `dist`)

```bash
parcel build entry.js --out-dir build/output
# or -d for short:
parcel build entry.js -d build/output
```

You can also set the base URL for asset URLs in the entry point (if the entry point is a HTML file), using the `--public-url [URL]` option. E.g `--public-url .` would mean you get `<script src="[some hash].js"></script>` instead of `<script src="[out-dir]/<some hash>.js"></script>`.

This disables watch mode and hot module replacement so it will only build once. It also enables the minifier for all output bundles to reduce file size. The minifiers used by Parcel are [uglify-es](https://github.com/mishoo/UglifyJS2/tree/harmony) for JavaScript, [cssnano](http://cssnano.co) for CSS, and [htmlnano](https://github.com/posthtml/htmlnano) for HTML.

Enabling production mode also sets the `NODE_ENV=production` environment variable. Large libraries like React have development only debugging features which are disabled by setting this environment variable, which results in smaller and faster builds for production.
