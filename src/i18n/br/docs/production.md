# ✨ Production

When it comes time to bundle your application for production, you can use Parcel's production mode.

```bash
parcel build entry.js
```

This disables watch mode and hot module replacement so it will only build once. It also enables the minifier for all output bundles to reduce file size. The minifiers used by Parcel are [uglify-es](https://github.com/mishoo/UglifyJS2/tree/harmony) for JavaScript, [cssnano](http://cssnano.co) for CSS, and [htmlnano](https://github.com/posthtml/htmlnano) for HTML.

Enabling production mode also sets the `NODE_ENV=production` environment variable. Large libraries like React have development only debugging features which are disabled by setting this environment variable, which results in smaller and faster builds for production.


### Options

#### Set the output directory

Default: "dist"

```bash
parcel build entry.js --out-dir build/output
or
parcel build entry.js -d build/output
```

```base
root
- build
- - output
- - - entry.js
```

#### Set the public URL to serve on

Default: --out-dir option

```bash
parcel build entry.js --public-url ./
```

will output:

```html
<link rel="stylesheet" type="text/css" href="1a2b3c4d.css">
or
<script src="e5f6g7h8.js"></script>
```


#### Disable minification

Default: minification enabled

```
parcel build entry.js --no-minify
```

#### Disable the filesystem cache
Default: cache enabled

```bash
parcel build entry.js --no-cache
```
