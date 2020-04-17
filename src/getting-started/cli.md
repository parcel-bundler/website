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
parcel a.html b.html
parcel ./**/*.html
```

{% warning %}

If you have specified multiple HTML entry points, the dev server will respond to `localhost:1234/` with a 404, since Parcel doesn't know which HTML bundle is the index.

TODO test this

{% endwarning %}

### `parcel watch`

The watch command is similar to `serve`, but only with a HMR server and no HTTP (dev) server.

```bash
parcel index.html
```

### `parcel build`

Builds the assets once, it also enabled minification and sets the NODE_ENV=production environment variable. See Production for more details.

```bash
parcel build index.html
```

As opposed to `serve` and `watch`, `build` has [scope hoisting](/features/scope-hoisting) enabled by default (so the other commmands implicity specify `--no-scope-hoist`).

It's also possible to perform a single development build:

```bash
NODE_ENV=development parcel build <entry> --no-minify [--no-scope-hoist]
TODO test this
```

## Parameters

### General paramaters

| Format                                       | Description                                                                               |
| -------------------------------------------- | ----------------------------------------------------------------------------------------- |
| `--no-cache`                                 | Disables reading from the filesystem cache                                                |
| `--cache-dir <path>`                         | Sets the cache directory. defaults to `.parcel-cache`                                     |
| `--no-source-maps`                           | Disables sourcemaps, <br> Default value for `targets.*.sourceMaps` TODO LINK              |
| `--no-autoinstall`                           | Disables autoinstall                                                                      |
| `--target [name]`                            | Only build the specified target(s) TODO LINK                                              |
| `--log-level (none|error|warn|info|verbose)` | Sets the log level                                                                        |
| `--profile`                                  | Profiles the build (a flamechart can be generated)                                        |
| `--public-url <url>`                         | The path prefix for absolute urls. <br> Default value for `targets.*.publicUrl` TODO link |
| `-V, --version`                              | Outputs the version number                                                                |

### Arguments related to the dev server/watch mode (`serve` and `watch`)

TODO, ports can be specified seperatly?

| Format              | Description                                                         |
| ------------------- | ------------------------------------------------------------------- |
| `--no-hmr`          | Disables [hot module replacement](/features/hmr)                    |
| `-p, --port <port>` | The port for the HMR and HTTP server                                |
| `--host <host>`     | Sets the host to listen on, defaults to listening on all interfaces |
| `--https`           | Serves files over HTTPS                                             |
| `--cert <path>`     | Path to a certificate to use with HTTPS                             |
| `--key <path>`      | Path to a private key to use with HTTPS                             |
| `--watch-for-stdin` | Stop Parcel once stdin is closed                                    |

### Arguments specific to `serve`

| Format             | Description                                                                                  |
| ------------------ | -------------------------------------------------------------------------------------------- |
| `--open [browser]` | Automatically opens the entry in your browser, defaults to the default browser, TODO PR open |

### Arguments specific to the non-server commands (`watch` and `build`)

| Format             | Description                                                                                                    |
| ------------------ | -------------------------------------------------------------------------------------------------------------- |
| `--dist-dir <dir>` | Output directory to write to when unspecified by targets. <br> Default value for `targets.*.distDir` TODO link |

### Arguments specific to `build`

| Format             | Description                                                      |
| ------------------ | ---------------------------------------------------------------- |
| `--no-minify`      | Disables minification (exact behaviour is determined by plugins) |
| `--no-scope-hoist` | Disables scope hoisting, TODO link to `outputFormats`            |
