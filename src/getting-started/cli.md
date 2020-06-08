---
layout: layout.njk
eleventyNavigation:
  key: "CLI"
  title: "⌨️ CLI"
  order: 2
summary: The "parcel" command
---

## Commands

The "entries" in all commands can be:

- one or more files
- one or more globs
- one or more directorises (see [Specifying Entrypoints](/getting-started/configuration/#specifying-entrypoints))

### `parcel [serve] <entries>`

Starts up a development server, which will automatically rebuild your app as you change files and supports [hot module replacement](/features/hmr/).
You may also pass a glob or list of globs for multiple entry points:

```bash
parcel index.html
parcel a.html b.html
parcel ./**/*.html
```

{% warning %}

If you have specified multiple HTML entry points and none of them is has the output path `/index.html`, the dev server will respond to `localhost:1234/` with a 404, since Parcel doesn't know which HTML bundle is the index.

In this case, load the file directly e.g. `http://localhost:1234/a.html` and `http://localhost:1234/b.html`

{% endwarning %}

### `parcel watch <entries>`

The watch command is similar to `serve`, but only with a HMR server and no HTTP (dev) server.

```bash
parcel index.html
```

### `parcel build <entries>`

Builds the assets once, it also enabled minification and sets the NODE_ENV=production environment variable. See Production for more details.

```bash
parcel build index.html
```

As opposed to `serve` and `watch`, `build` has [scope hoisting](/features/scope-hoisting) enabled by default (so the other commmands implicity specify `--no-scope-hoist`).

## Parameters

### General parameters

| Format                                       | Description                                                                                                                  |
| -------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `--cache-dir <path>`                         | Sets the cache directory. defaults to `.parcel-cache`                                                                        |
| `--log-level (none|error|warn|info|verbose)` | Sets the log level                                                                                                           |
| `--no-autoinstall`                           | Disables autoinstall                                                                                                         |
| `--no-cache`                                 | Disables reading from the filesystem cache                                                                                   |
| `--no-source-maps`                           | Disables sourcemaps, <br> Overrides [`targets.*.sourceMaps`](/getting-started/configuration/#sourcemap)                      |
| `--profile`                                  | Profiles the build (a flamechart can be generated)                                                                           |
| `--public-url <url>`                         | The path prefix for absolute urls. <br> Default value for [`targets.*.publicUrl`](/getting-started/configuration/#targets-2) |
| `--target [name]`                            | Only build the specified target(s)                                                                                           |
| `-V, --version`                              | Outputs the version number                                                                                                   |

### Parameters related to the dev server/watch mode (`serve` and `watch`)

TODO, ports for HMR can be specified separately?

| Format              | Description                                                         |
| ------------------- | ------------------------------------------------------------------- |
| `--no-hmr`          | Disables [hot module replacement](/features/hmr)                    |
| `-p, --port <port>` | The port for the HMR and HTTP server                                |
| `--host <host>`     | Sets the host to listen on, defaults to listening on all interfaces |
| `--https`           | Serves files over HTTPS                                             |
| `--cert <path>`     | Path to a certificate to use with HTTPS                             |
| `--key <path>`      | Path to a private key to use with HTTPS                             |
| `--watch-for-stdin` | Stop Parcel once stdin is closed                                    |

### Parameters specific to `serve`

| Format             | Description                                                                    |
| ------------------ | ------------------------------------------------------------------------------ |
| `--open [browser]` | Automatically opens the entry in your browser, defaults to the default browser |

### Parameters specific to the non-server commands (`watch` and `build`)

| Format             | Description                                                                                                                                       |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| `--dist-dir <dir>` | Output directory to write to when unspecified by targets. <br> Default value for [`targets.*.distDir`](/getting-started/configuration/#targets-2) |

### Parameters specific to `build`

| Format                      | Description                                                                                                                                    |
| --------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| `--no-minify`               | Disables minification (exact behaviour is determined by plugins). <br> Related [`targets.*.minify`](/getting-started/configuration/#targets-2) |
| `--no-scope-hoist`          | Disables scope hoisting. <br> Related: [`targets.*.scopeHoist`](/getting-started/configuration/#targets-2)                                     |
| `--detailed-report [depth]` | Displays the largest 10 (number configurable with `depth`) assets per bundle in the CLI report                                                 |
