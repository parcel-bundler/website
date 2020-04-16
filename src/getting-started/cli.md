---
layout: layout.njk
eleventyNavigation:
  key: "CLI"
  title: "⌨️ CLI"
  order: 2
summary: The "parcel" command
---

## Commands

### `parcel [serve]`

Starts up a development server, which will automatically rebuild your app as you change files and supports [hot module replacement](/features/hmr/).
You may also pass a glob or list of globs for multiple entry points:

```bash
parcel index.html
parcel one two.html
parcel ./**/*.html
```

{% warning %}

If you have specified multiple HTML entry points, the dev server will respond to `localhost:1234/` with a 404, since Parcel doesn't know which HTML bundle is the index.

TODO test this

{% endwarning %}

### `parcel watch`

The watch command is similar to `serve`, but only with a HMR server and no dev (HTTP) server.

```bash
parcel index.html
```

### `parcel build`

Builds the assets once, it also enabled minification and sets the NODE_ENV=production environment variable. See Production for more details.

```bash
parcel build index.html
```

As opposed to `serve` and `watch`, `build` builds with scope hoisting (so the other commmands implicity specify `--no-scope-hoist`).

It's also possible to perform a single development build:

```bash
NODE_ENV=development parcel build <entry> --no-minify [--no-scope-hoist]
TODO test this
```

## Parameters

### General paramaters

| Format                                       | Description                                                   |
| -------------------------------------------- | ------------------------------------------------------------- |
| `--no-cache`                                 | disable the filesystem cache                                  |
| `--cache-dir <path>`                         | set the cache directory. defaults to ".parcel-cache"          |
| `--no-source-maps`                           | disable sourcemaps, TODO default for `targets`                |
| `--no-autoinstall`                           | disable autoinstall                                           |
| `--target [name]`                            | only build given target(s)                                    |
| `--log-level (none|error|warn|info|verbose)` | set the log level                                             |
| `--profile`                                  | profile the build and generate a flamechart                   |
| `--public-url <url>`                         | the path prefix for absolute urls, TODO default for `targets` |
| `-V, --version`                              | output the version number                                     |

### Arguments related to the dev server (`serve` and `watch`)

| Format              | Description                                                        |
| ------------------- | ------------------------------------------------------------------ |
| `--no-hmr`          | disable hot module replacement                                     |
| `-p, --port <port>` | port                                                               |
| `--host <host>`     | set the host to listen on, defaults to listening on all interfaces |
| `--https`           | serves files over HTTPS                                            |
| `--cert <path>`     | path to certificate to use with HTTPS                              |
| `--key <path>`      | path to private key to use with HTTPS                              |

### Arguments specific to `serve`

| Format             | Description                                                                        |
| ------------------ | ---------------------------------------------------------------------------------- |
| `--open [browser]` | automatically open in specified browser, defaults to default browser, TODO PR open |

### Arguments specific to the non-server commands (`watch` and `build`)

| Format               | Description                                                                   |
| -------------------- | ----------------------------------------------------------------------------- |
| `--dist-dir <dir>`   | Output directory to write to when unspecified by targets, TODO link `targets` |
| `--public-url <dir>` | the path prefix for absolute urls, TODO default for `targets`                 |

### Arguments specific to `build`

| Format             | Description                                          |
| ------------------ | ---------------------------------------------------- |
| `--no-minify`      | Disable minification                                 |
| `--no-scope-hoist` | Disable scope hoisting, TODO link to `outputFormats` |
