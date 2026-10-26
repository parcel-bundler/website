---
layout: layout.njk
title: CLI
eleventyNavigation:
  key: features-cli
  title: ⌨️ CLI
  order: 9
---

The `parcel` CLI is the most common way to use Parcel. It supports several different commands: `serve`, `watch`, `run`, and `build`, as well as `targets`, `trust`, and `help`.

## `parcel serve <entries>`

The `serve` command starts a development server, which will automatically rebuild your app as you change files, and supports [hot reloading](/features/development/#hot-reloading). It accepts one or more file paths or globs as [entries](#entries).

```bash
parcel serve src/index.html
```

{% warning %}

**Note**: If you have specified multiple HTML entry points and none of them has the output path `/index.html`, the dev server will respond to `http://localhost:1234/` with a 404 page listing the pages in the build, since Parcel doesn't know which HTML bundle is the index.

In this case, load the file directly, e.g. `http://localhost:1234/a.html` and `http://localhost:1234/b.html`.

{% endwarning %}

See [Development](/features/development/) for more details.

## `parcel watch <entries>`

The `watch` command is similar to `serve`, but does not start a dev server. However, it automatically rebuilds your app as you make changes. Use `watch` if you're building a library, or have your own dev (HTTP) server. To build and run a Node.js backend, use `parcel run` (see below) instead. See [below](#entries) for how to specify entries.

<!-- TODO(v3): watch does not start an HMR server or include the HMR runtime (options.hmr is only set for serve/run in crates/parcel/src/main.rs), unlike v2 where watch supported hot reloading. Confirm this is intentional. -->

```bash
parcel watch src/index.html
```

## `parcel run <entries>`

The `run` command builds a Node.js entry in development mode, runs it with `node`, and automatically rebuilds it as you make changes. It supports [hot reloading](/features/development/#hot-reloading) inside the running process: updates are applied in place when they are accepted via the `module.hot` API, and the process is restarted otherwise. With `--no-hmr`, the process is restarted whenever the code it runs changes. Code that is also loaded in the browser, such as client components rendered by the server, is hot reloaded in the browser as well.

The entry must be built for a Node.js environment, e.g. by specifying `engines.node` in your package.json. See [Targets](/features/targets/) for details.

```bash
parcel run src/server.js
```

The process inherits the environment variables from your shell, and `NODE_ENV` is set to the same value used for the build (`development` unless you set it yourself). Variables loaded from `.env` files are inlined into the build, but are not passed to the process.

The HMR server used by `run` listens on a free port by default, so that it does not conflict with your own server. Use `--hmr-port` to choose a specific port.

## `parcel build <entries>`

The `build` command performs a single production build and exits. This enables tree shaking and other production optimizations by default. See [below](#entries) for how to specify entries.

```bash
parcel build src/index.html
```

See [Production](/features/production/) for more details.

## `parcel targets <entries>`

The `targets` command prints the entries and targets that Parcel resolves for the given entries, without building anything. This can be useful to debug your target configuration.

```bash
parcel targets
```

## `parcel trust`

The `trust` command adds the local certificate authority that Parcel uses to sign certificates for `--https` to your system's trust stores, so that browsers trust them. Parcel also offers to do this the first time you use `--https`. Use `--remove` to remove it from the trust stores and delete it. See [HTTPS](/features/development/#https) for more details.

```bash
parcel trust
```

## `parcel help [command]`

The `help` command shows help for all commands, or for a specific command. You can also pass `-h` or `--help` to any command.

## Entries

All Parcel commands accept one or more entries. Entries may be relative or absolute paths, or globs. They may also be directories containing a `package.json` with a `source` field. If entries are omitted entirely, the `source` field in the `package.json` in the current working directory is used. See [Entries](/features/targets/#entries) in the Targets documentation for more details.

{% warning %}

**Note**: Be sure to wrap globs in single quotes to ensure that they are not resolved by your shell and are passed to Parcel directly. This ensures that Parcel can automatically pick up newly created files matching globs without needing to restart.

{% endwarning %}

```bash
# Single file
parcel serve src/index.html

# Multiple files
parcel serve src/a.html src/b.html

# Glob (quotes required)
parcel serve 'src/*.html'

# Directory with package.json#source
parcel serve packages/frontend

# Multiple packages with a glob
parcel serve 'packages/*'

# Current directory with package.json#source
parcel serve
```

## Parameters

These parameters are supported by all Parcel commands.

| Format                                       | Description                                                                                                                                                                 |
| -------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `--dist-dir <dir>`                           | Output directory to write to when unspecified by package.json. Defaults to `dist` in the project root.                                                                      |
| `--public-url <url>`                         | The path prefix for absolute urls.                                                                                                                                          |
| `--no-source-maps`                           | Disables sourcemaps.                                                                                                                                                        |
| `--optimize`                                 | Enables optimizations such as minification, even in development. See [Production](/features/production/).                                                                   |
| `--no-optimize`                              | Disables optimizations such as minification. See [Production](/features/production/).                                                                                       |
| `--config <path>`                            | Specify which Parcel config file to use. <br> Defaults to the `.parcelrc` in the project root, or `@parcel/config-default`. See [Parcel configuration](/features/plugins/). |
| `--log-level (none/error/warn/info/verbose)` | Sets the log level.                                                                                                                                                         |
| `-h, --help`                                 | Outputs help for the command.                                                                                                                                               |

### Parameters specific to `serve` and `run`

| Format          | Description                                                                                         |
| --------------- | --------------------------------------------------------------------------------------------------- |
| `--host <host>` | Sets the host to listen on, defaults to listening on all interfaces.                                |
| `--https`       | Runs the dev server and HMR server over [HTTPS](/features/development/#https), in addition to HTTP. |
| `--cert <path>` | Path to a certificate to use. See [HTTPS](/features/development/#https).                            |
| `--key <path>`  | Path to a private key to use. See [HTTPS](/features/development/#https).                            |
| `--no-hmr`      | Disables [hot reloading](/features/development/#hot-reloading).                                     |

### Parameters specific to `serve`

| Format              | Description                                                                                                                                                                                                                                   |
| ------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `-p, --port <port>` | The port for the dev server and HMR (the default port is `process.env.PORT` or 1234). See [Dev server](/features/development/#dev-server).                                                                                                    |
| `--open [browser]`  | Automatically opens the entry in your browser. Defaults to the default browser. Use `--open=<app>` for browsers other than common ones such as `chrome`, `firefox`, `safari`, or `edge`. See [Dev server](/features/development/#dev-server). |

### Parameters specific to `run`

| Format              | Description                                                                                                       |
| ------------------- | ----------------------------------------------------------------------------------------------------------------- |
| `--hmr-port <port>` | The port for the HMR server (defaults to a free port). See [Hot reloading](/features/development/#hot-reloading). |

### Parameters specific to `build`

| Format                      | Description                                                                                                                                                                                      |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `--no-content-hash`         | Disables content hashing of output file names. <br> Bundle names may still include hashes, but they will not change on each build. See [Content hashing](/features/production/#content-hashing). |
| `--detailed-report [count]` | Displays the largest 10 (number configurable with `count`) assets per bundle in the CLI report. See [Detailed report](/features/production/#detailed-report).                                    |
| `--analyze`                 | Writes an interactive analysis of bundle sizes to `parcel-bundle-reports/index.html`. See [Bundle analyzer](/features/production/#bundle-analyzer).                                              |
