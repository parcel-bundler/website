---
layout: layout.njk
eleventyNavigation:
  key: "CLI"
  title: "⌨️ CLI"
  order: 2
summary: The "parcel" command
---

- `parcel [serve]`
- `parcel watch`
- `parcel build`

Parameters for every command

| Format                                       | Description                                                   |
| -------------------------------------------- | ------------------------------------------------------------- |
| `--no-cache`                                 | disable the filesystem cache                                  |
| `--cache-dir <path>`                         | set the cache directory. defaults to ".parcel-cache"          |
| `--no-source-maps`                           | disable sourcemaps, TODO default for `targets`                |
| `--no-autoinstall`                           | disable autoinstall                                           |
| `--target [name]`                            | only build given target(s)                                    |
| `--log-level (none|error|warn|info|verbose)` | set the log level                                             |
| `--profile`                                  | enable build profiling                                        |
| `--public-url <url>`                         | the path prefix for absolute urls, TODO default for `targets` |
| `-V, --version`                              | output the version number                                     |

Arguments related to the dev server (`serve` and `watch`)

| Format              | Description                                                        |
| ------------------- | ------------------------------------------------------------------ |
| `--no-hmr`          | disable hot module replacement                                     |
| `-p, --port <port>` | port                                                               |
| `--host <host>`     | set the host to listen on, defaults to listening on all interfaces |
| `--https`           | serves files over HTTPS                                            |
| `--cert <path>`     | path to certificate to use with HTTPS                              |
| `--key <path>`      | path to private key to use with HTTPS                              |

Arguments specific to `serve`

| Format             | Description                                                              |
| ------------------ | ------------------------------------------------------------------------ |
| `--open [browser]` | ??? automatically open in specified browser, defaults to default browser |

Arguments specific to the non-server commands (`watch` and `build`)

| Format               | Description                                                                   |
| -------------------- | ----------------------------------------------------------------------------- |
| `--dist-dir <dir>`   | Output directory to write to when unspecified by targets, TODO link `targets` |
| `--public-url <dir>` | the path prefix for absolute urls, TODO default for `targets`                 |

Arguments specific to the `build`

| Format             | Description                                          |
| ------------------ | ---------------------------------------------------- |
| `--no-minify`      | Disable minification                                 |
| `--no-scope-hoist` | Disable scope hoisting, TODO link to `outputFormats` |
