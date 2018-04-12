# 🖥 CLI

## Commands

### Serve

Serve starts up a development server, which will automatically rebuild your app as you change files and supports [hot module replacement](hmr.html) for fast development.

```bash
parcel index.html
```

### Build

Build builds the assets once, it also enabled minification and sets the NODE_ENV variable to production. [Production](production.html)

```bash
parcel build index.html
```

### Watch

The watch command is similar to serve, with the main difference being it doesn't start up a server.

```bash
parcel watch index.html
```

### Help

Displays all possible cli options

```bash
parcel help
```

## Options

### Output directory

Default: "dist"

Available in: `serve`, `watch`, `build`

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

### Set the public URL to serve on

Default: "/"

Available in: `serve`, `watch`, `build`

```bash
parcel build entry.js --public-url ./dist/
```

will output:

```html
<link rel="stylesheet" type="text/css" href="/dist/entry.1a2b3c.css">
or
<script src="/dist/entry.e5f6g7.js"></script>
```

### Target

Default: browser

Available in: `serve`, `watch`, `build`

```bash
parcel build entry.js --target node
```

Possible targets: node, browser and electron

### Change Log level

Default: 3

Available in: `serve`, `watch`, `build`

```bash
parcel build entry.js --log-level 1
```

| Loglevel | Effect                    |
|---       |---                        |
| 0        | Logging disabled          |
| 1        | Only log errors           |
| 2        | Log errors and warnings   |
| 3        | Log everything            |

### HMR Hostname

Default: `location.hostname` of current window

Available in: `serve`, `watch`

```bash
parcel build entry.js --hmr-hostname parceljs.org
```

### HMR Port

Default: A random available port

Available in: `serve`, `watch`

```bash
parcel build entry.js --hmr-port 8080
```

### Output filename

Default: Original filename

Available in: `serve`, `watch`, `build`

```bash
parcel build entry.js --out-file output.html
```

This changes the output filename of the entrypoint bundle

### Print a detailed report

Default: Minimal report

Available in: `build`

```bash
parcel build entry.js --detailed-report
```

### Enable https

Default: https disabled

Available in: `server`

```bash
parcel build entry.js --https
```

⚠️ This flag generates a self-signed certificate, you might have to configure your browser to allow self-signed certificates for localhost.

### Set a custom certificate

Default: https disabled

Available in: `serve`

```bash
parcel build entry.js --cert certificate.cert --key private.key
```

### Open in browser

Default: open disabled

Available in: `serve`

```bash
parcel build entry.js --open
```

### Disable source-maps

Default: source-maps enabled

Available in: `serve`, `watch`, `build`

```bash
parcel build entry.js --no-source-maps
```

### Disable autoinstall

Default: autoinstall enabled

Available in: `serve`, `watch`

```bash
parcel build entry.js --no-autoinstall
```

### Disable HMR

Default: HMR enabled

Available in: `serve`, `watch`

```bash
parcel build entry.js --no-hmr
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