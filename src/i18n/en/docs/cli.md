# 🖥 CLI

## Commands

### Serve

Starts up a development server, which will automatically rebuild your app as you change files and supports [hot module replacement](hmr.html) for fast development.

```bash
parcel index.html
```

You may also pass a [glob](https://github.com/isaacs/node-glob) or list of globs for multiple entry points.

```bash
parcel one.html two.html
# OR
parcel *.html
# OR
parcel ./**/*.html
```

### Build

Builds the assets once, it also enabled minification and sets the `NODE_ENV=production` environment variable. See [Production](production.html) for more details.

```bash
parcel build index.html
```

_NOTE:_ For special use cases, it's also possible to perform a single build from the `development` environment, like this:

```
NODE_ENV=development parcel build <entrypoint> --no-minify
```

It creates the same bundles as `serve`, but it doesn't watch or serve assets.

### Watch

The `watch` command is similar to `serve`, with the main difference being it doesn't start up a server.

```bash
parcel watch index.html
```

### Help

Displays all possible cli options

```bash
parcel help
```

### Version

Displays Parcel version number

```bash
parcel --version
```

## Options

### Output directory

Default: "dist"

Available in: `serve`, `watch`, `build`

```bash
parcel build entry.js --out-dir build/output
# or
parcel build entry.js -d build/output
```

```base
root
- build
- - output
- - - entry.js
```

### Set the public URL to serve on

Default: "/"

Available in: `serve`, `watch`, `build`

```bash
parcel entry.js --public-url ./dist/
```

will output:

```html
<link rel="stylesheet" type="text/css" href="dist/entry.1a2b3c.css" />
<!-- or -->
<script src="dist/entry.e5f6g7.js"></script>
```

### Target

Default: browser

Available in: `serve`, `watch`, `build`

```bash
parcel build entry.js --target node
```

⚠️ Target `node` and `electron` will not bundle package.json's `dependencies`. This behavior can be overriden using [--bundle-node-modules](#force-node-modules-bundling) flag (see below).

Possible targets: `node`, `browser`, `electron`

### Force node modules bundling

Default: false

Available in: `serve`, `watch`, `build`

```bash
parcel build entry.js --target node --bundle-node-modules
```

By default, package.json's `dependencies` are not included when using `--target node` or `--target electron`. This flag adds them to the bundle.

### Cache directory

Default: ".cache"

Available in: `serve`, `watch`, `build`

```bash
parcel build entry.js --cache-dir build/cache
```

### Host

Default: localhost

Available in: `serve`

```bash
parcel serve entry.js --host local.myhost.co.uk
```

### Port

Default: 1234

Available in: `serve`

```bash
parcel serve entry.js --port 1111
```

### Change Log level

Default: 3

Available in: `serve`, `watch`, `build`

```bash
parcel entry.js --log-level 1
```

| Loglevel | Effect                                                                                          |
| -------- | ----------------------------------------------------------------------------------------------- |
| 0        | Logging disabled                                                                                |
| 1        | Only log errors                                                                                 |
| 2        | Log errors and warnings                                                                         |
| 3        | Log errors, warnings and info                                                                   |
| 4        | Verbose (keep everything in log with timestamps <br> and also log http requests to dev server) |
| 5        | Debug (save everything to a file with timestamps)                                               |

### HMR Hostname

Default: `location.hostname` of current window

Available in: `serve`, `watch`

```bash
parcel entry.js --hmr-hostname parceljs.org
```

### HMR Port

Default: A random available port

Available in: `serve`, `watch`

```bash
parcel entry.js --hmr-port 8080
```

### Output filename

Default: Original filename

Available in: `serve`, `watch`, `build`

```bash
parcel build entry.js --out-file output.html
```

This changes the output filename of the entrypoint bundle

### Print a detailed report

Default: Minimal report, otherwise depth 10

The optional argument specifies the depth to print.

Available in: `build`

```bash
parcel build entry.js --detailed-report
parcel build entry.js --detailed-report 10
```

### Enable https

Default: https disabled

Available in: `serve`, `watch` (listen on HTTPS for HMR connections)

```bash
parcel build entry.js --https
```

⚠️ This flag generates a self-signed certificate, you might have to configure your browser to allow self-signed certificates for localhost.

### Set a custom certificate

Default: https disabled

Available in: `serve`, `watch`

```bash
parcel entry.js --cert certificate.cert --key private.key
```

### Open in browser

Default: open disabled

Available in: `serve`

```bash
parcel entry.js --open
```

### Disable source-maps

Default: source-maps enabled

Available in: `serve`, `watch`, `build`

```bash
parcel build entry.js --no-source-maps
```

### Disable content hashing

Default: content-hash enabled

Available in: `build`

```bash
parcel build entry.js --no-content-hash
```

### Disable autoinstall

Default: autoinstall enabled

Available in: `serve`, `watch`

```bash
parcel entry.js --no-autoinstall
```

### Disable HMR

Default: HMR enabled

Available in: `serve`, `watch`

```bash
parcel entry.js --no-hmr
```

### Disable minification

Default: minification enabled

Available in: `build`

```bash
parcel build entry.js --no-minify
```

### Disable the filesystem cache

Default: cache enabled

Available in: `serve`, `watch`, `build`

```bash
parcel build entry.js --no-cache
```

### Expose modules as UMD

Default: disabled

Available in: `serve`, `watch`, `build`

```bash
parcel serve entry.js --global myvariable
```

### Enable experimental scope hoisting/tree shaking support

Default: disabled

Available in: `build`

```bash
parcel build entry.js --experimental-scope-hoisting
```

For more information, see the [Tree Shaking section](https://medium.com/@devongovett/parcel-v1-9-0-tree-shaking-2x-faster-watcher-and-more-87f2e1a70f79#4ed3) of Devon Govett's post on Parcel 1.9.
