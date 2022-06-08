---
layout: layout.njk
title: CLI
eleventyNavigation:
  key: features-cli
  title: ⌨️ CLI
  order: 9
---

The `parcel` CLI is the most common way to use Parcel. It supports three different commands: `serve`, `watch`, and `build`.

## `parcel [serve] <entries>`

The `serve` command starts a development server, which will automatically rebuild your app as you change files, and supports [hot reloading](/features/development/#hot-reloading). It accepts one or more file paths or globs as [entries](#entries). `serve` is the default command, so it may also be used by passing entries directly to `parcel`.

```bash
parcel src/index.html
```

{% warning %}

**Note**: If you have specified multiple HTML entry points and none of them has the output path `/index.html`, the dev server will respond to `http://localhost:1234/` with a 404, since Parcel doesn't know which HTML bundle is the index.

In this case, load the file directly, e.g. `http://localhost:1234/a.html` and `http://localhost:1234/b.html`.

{% endwarning %}

See [Development](/features/development/) for more details.

## `parcel watch <entries>`

The `watch` command is similar to `serve`, but does not start a dev server (only a HMR server). However, it automatically rebuilds your app as you make changes, and supports [hot reloading](/features/development/#hot-reloading). Use `watch` if you're building a library, a backend, or have your own dev (HTTP) server. See [below](#entries) for how to specify entries.

```bash
parcel watch src/index.html
```

## `parcel build <entries>`

The `build` command performs a single production build and exits. This enables [scope hoisting](/features/scope-hoisting) and other production optimizations by default. See [below](#entries) for how to specify entries.

```bash
parcel build src/index.html
```

See [Production](/features/production/) for more details.

## Entries

All Parcel commands accept one or more entries. Entries may be relative or absolute paths, or globs. They may also be directories containing a `package.json` with a `source` field. If entries are omitted entirely, the `source` field in the `package.json` in the current working directory is used. See [Entries](/features/targets/#entries) in the Targets documentation for more details.

{% warning %}

**Note**: Be sure to wrap globs in single quotes to ensure that they are not resolved by your shell and are passed to Parcel directly. This ensures that Parcel can automatically pick up newly created files matching globs without needing to restart.

{% endwarning %}

```bash
# Single file
parcel src/index.html

# Multiple files
parcel src/a.html src/b.html

# Glob (quotes required)
parcel 'src/*.html'

# Directory with package.json#source
parcel packages/frontend

# Multiple packages with a glob
parcel 'packages/*'

# Current directory with package.json#source
parcel
```

## Parameters

These parameters are supported by all Parcel commands.

| Format                                       | Description                                                                                                                                  |
| -------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| `--target [name]`                            | Specifies the targets to build. May be specified multiple times. See [Targets](/features/targets/). |
| `--out-dir <dir>`                           | Output directory to write to when unspecified by targets. <br> Default value for the [`distDir`](/features/targets/#distdir) option in package.json `targets`. |
| `--public-url <url>`                         | The path prefix for absolute urls. <br> Default value for the [`publicUrl`](/features/targets/#publicurl) option in package.json `targets`.                     |
| `--no-source-maps`                           | Disables sourcemaps, <br> Overrides the [`sourceMap`](/features/targets/#sourcemap) option in package.json `targets`.                                          |
| `--config <path>`                            | Specify which Parcel config to use. <br> Can be a file path or package name. Defaults to `@parcel/config-default`. See [Parcel configuration](/features/plugins/). |
| `--reporter <package name>`                  | Run the specified reporter plugin in addition to the ones specified in the `.parcelrc`. Can be specified multiple times.                                |
| `--log-level (none/error/warn/info/verbose)` | Sets the log level.                                                                                                                           |
| `--cache-dir <path>`                         | Sets the cache directory. Defaults to `.parcel-cache`. See [Caching](/features/development/#caching).
| `--no-cache`                                 | Disables reading from the filesystem cache. See [Caching](/features/development/#caching).                                                                                                   |                                                                                        |
| `--profile`                                  | Profiles the build (a flamechart can be generated).                                                                                           |
| `-V, --version`                              | Outputs the version number.                                                                                                                   |

### Parameters specific to `serve` and `watch`

| Format              | Description                                                                           |
| ------------------- | ------------------------------------------------------------------------------------- |
| `-p, --port <port>` | The port for the dev server and HMR (the default port is `process.env.PORT` or 1234). See [Dev server](/features/development/#dev-server).  |
| `--host <host>`     | Sets the host to listen on, defaults to listening on all interfaces                   |
| `--https`           | Runs the dev server and HMR server over [HTTPS](/features/development/#https).        |
| `--cert <path>`     | Path to a certificate to use. See [HTTPS](/features/development/#https).              |
| `--key <path>`      | Path to a private key to use. See [HTTPS](/features/development/#https).              |
| `--no-hmr`          | Disables [hot reloading](/features/development/#hot-reloading).                       |
| `--hmr-port <port>` | The port for the HMR server (defaults to the dev server's port). See [Hot reloading](/features/development/#hot-reloading).     
| `--hmr-host <host>` | The host for the HMR server (defaults to the dev server's host). See [Hot reloading](/features/development/#hot-reloading).                       |
| `--no-autoinstall`  | Disables [auto install](/features/development/#auto-install).                         |
| `--watch-for-stdin` | Stop Parcel once stdin is closed.                                                     |

### Parameters specific to `serve`

| Format             | Description                                                                    |
| ------------------ | ------------------------------------------------------------------------------ |
| `--open [browser]` | Automatically opens the entry in your browser. Defaults to the default browser. See [Dev server](/features/development/#dev-server). |
| `--lazy`           | Only builds bundles requested by the dev server. See [Lazy mode](/features/development/#lazy-mode). |

### Parameters specific to `build`

| Format                      | Description                                                                                                                                                  |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `--no-optimize`             | Disables optimizations such as minification. <br> Overrides the [`optimize`](/features/targets/#optimize) option of package.json `targets`. See [Production](/features/production/).                 |
| `--no-scope-hoist`          | Disables scope hoisting. <br> Overrides the [`scopeHoist`](/features/targets/#scopehoist) option of package.json `targets`. See [Scope hoisting](/features/scope-hoisting/).      
| `--no-content-hash`         | Disables content hashing of output file names. <br> Bundle names may still include hashes, but they will not change on each build. See [Content hashing](/features/production/#content-hashing). |                                                  |
| `--detailed-report [depth]` | Displays the largest 10 (number configurable with `depth`) assets per bundle in the CLI report. See [Detailed report](/features/production/#detailed-report).                                                              |
