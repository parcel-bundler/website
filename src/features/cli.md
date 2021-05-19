---
layout: layout.njk
eleventyNavigation:
  key: features-cli
  title: ⌨️ CLI
  order: 2
summary: The "parcel" command
---

## Commands

The "entries" in all commands can be:

- one or more files
- one or more globs
- one or more directorises (see [Specifying Entrypoints](/getting-started/configuration/#specifying-entrypoints))

{% warning %}

If a glob pattern contains a wildcard `*` (or generally, is a glob), be sure to wrap the pattern in single quotes to ensure that the glob is not resolved by your shell and is passed to Parcel directly. This way, globs like `./**/*` are resolved correctly and Parcel will also pick up newly created files without having to restart.

```bash
# ✅ Recommended
parcel './**/*.html'
parcel './img/**/*'

# ❌ Problematic
parcel ./**/*.html
parcel ./img/**/*
```

{% endwarning %}

### `parcel [serve] <entries>`

Starts up a development server, which will automatically rebuild your app as you change files and supports [hot module replacement](/features/hmr/).
You may also pass a glob or list of globs for multiple entry points:

```bash
parcel index.html
parcel a.html b.html
parcel './**/*.html'
```

{% warning %}

If you have specified multiple HTML entry points and none of them is has the output path `/index.html`, the dev server will respond to `localhost:1234/` with a 404, since Parcel doesn't know which HTML bundle is the index.

In this case, load the file directly e.g. `http://localhost:1234/a.html` and `http://localhost:1234/b.html`

{% endwarning %}

### `parcel watch <entries>`

The watch command is similar to `serve`, but only with a HMR server and no HTTP (dev) server.

```bash
parcel watch index.html
```

### `parcel build <entries>`

Builds the assets once, it also enabled minification and sets the NODE_ENV=production environment variable. See Production for more details.

```bash
parcel build index.html
```

As opposed to `serve` and `watch`, `build` has [scope hoisting](/features/scope-hoisting) enabled by default (so the other commmands implicitly specify `--no-scope-hoist`).

## Parameters

### General parameters

| Format                                       | Description                                                                                                                                  |
| -------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| `--cache-dir <path>`                         | Sets the cache directory. defaults to `.parcel-cache`                                                                                        |
| `--dist-dir <dir>`                           | Output directory to write to when unspecified by targets. <br> Default value for [`targets.*.distDir`](/configuration/package-json/#targets) |
| `--log-level (none/error/warn/info/verbose)` | Sets the log level                                                                                                                           |
| `--no-cache`                                 | Disables reading from the filesystem cache                                                                                                   |
| `--no-source-maps`                           | Disables sourcemaps, <br> Overrides [`targets.*.sourceMap`](/configuration/package-json/#sourcemap)                                          |
| `--profile`                                  | Profiles the build (a flamechart can be generated)                                                                                           |
| `--public-url <url>`                         | The path prefix for absolute urls. <br> Default value for [`targets.*.publicUrl`](/configuration/package-json/#targets)                      |
| `--target [name]`                            | Only build the specified target(s)                                                                                                           |
| `--reporter <package name>`                  | Run the specified reporter in addition to the ones specified in the parcelrc. Can be specified multiple times                                |
| `-V, --version`                              | Outputs the version number                                                                                                                   |

### Parameters related to the dev server/watch mode (`serve` and `watch`)

| Format              | Description                                                                           |
| ------------------- | ------------------------------------------------------------------------------------- |
| `--no-hmr`          | Disables [hot module replacement](/features/hmr)                                      |
| `-p, --port <port>` | The port for the HMR and HTTP server (the default port is `process.env.PORT` or 1234) |
| `--hmr-port <port>` | The port for the HMR server (defaults to the HTTP server's port)                      |
| `--host <host>`     | Sets the host to listen on, defaults to listening on all interfaces                   |
| `--https`           | Serves files over HTTPS                                                               |
| `--cert <path>`     | Path to a certificate to use with HTTPS                                               |
| `--key <path>`      | Path to a private key to use with HTTPS                                               |
| `--no-autoinstall`  | Disables autoinstall                                                                  |
| `--watch-for-stdin` | Stop Parcel once stdin is closed                                                      |
| `--lazy`            | Lazy mode, only bundle requested bundles                                              |

### Parameters specific to `serve`

| Format             | Description                                                                    |
| ------------------ | ------------------------------------------------------------------------------ |
| `--open [browser]` | Automatically opens the entry in your browser, defaults to the default browser |

### Parameters specific to `build`

| Format                      | Description                                                                                                                                                  |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `--no-optimize`             | Disables minification (exact behaviour is determined by plugins). <br> Related [`targets.*.optimize`](/configuration/package-json/#targets)                  |
| `--no-scope-hoist`          | Disables scope hoisting. <br> Related: [`targets.*.scopeHoist`](/configuration/package-json/#targets)                                                        |
| `--detailed-report [depth]` | Displays the largest 10 (number configurable with `depth`) assets per bundle in the CLI report                                                               |
| `--no-content-hash`         | Disables content hashing of the output files. <br> Bundle names still include hashes, but they should remain somewhat constant when the source files change. |
