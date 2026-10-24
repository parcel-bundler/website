---
layout: layout.njk
eleventyNavigation:
  key: plugin-system-native-plugins
  title: Native Plugins
  order: 3
summary: "How to write Parcel plugins in Rust, Go, Swift, or C"
---

In addition to JavaScript, Parcel plugins can be written in Rust, Go, Swift, or any other language that can produce a shared library with a C ABI. Native plugins are compiled to a dynamic library (`.dylib` on macOS, `.so` on Linux, or `.dll` on Windows), which Parcel loads directly into its process.

Native plugins can act as [transformers](/plugin-system/transformer/), [resolvers](/plugin-system/resolver/), [namers](/plugin-system/namer/), [optimizers](/plugin-system/optimizer/), and [reporters](/plugin-system/reporter/). A single library can implement any combination of these. The same rules described in [Authoring Plugins](/plugin-system/authoring-plugins/) apply: plugins should be stateless and pure.

## When to use native plugins

[JavaScript plugins](/plugin-system/authoring-plugins/) are the easiest way to extend Parcel, and can use the huge ecosystem of existing compilers and tools on npm. However, they run in an embedded JavaScript engine, which is plenty fast for many types of infrequently used or simple plugins, but generally slower than native plugins for CPU-intensive work.

Native plugins are a good fit when:

- Performance matters, e.g. for a transformer that runs on many files.
- You want to wrap a compiler or library that is written in Rust, Go, Swift, C, or C++.
- You need access to the system that is not available to JavaScript plugins.
- You want to store a custom representation of an asset's content (e.g. an AST) and control how it is packaged. See [Custom content](#custom-content) below.

Native plugins are called from multiple threads at once, so they must be thread safe. Errors returned by a plugin are reported as [diagnostics](/plugin-system/logging/), and Rust panics and Go panics are caught and reported as errors rather than crashing Parcel.

## Rust

The `parcel-plugin` crate is the Rust SDK for native plugins. Create a new library crate, and configure it to build a `cdylib`:

{% sample %}
{% samplefile "Cargo.toml" %}

```toml
[package]
name = "parcel-transformer-txt"
version = "0.1.0"
edition = "2024"

[lib]
crate-type = ["cdylib"]

[dependencies]
parcel-plugin = { git = "https://github.com/parcel-bundler/parcel", branch = "core-rs3" }
serde_json = "1"
```

{% endsamplefile %}
{% endsample %}

<!-- TODO(v3): parcel-plugin is not published to crates.io yet (the examples in plugin-rs/examples use a path dependency). Confirm the recommended dependency spec (crates.io version, or git + branch). -->

A plugin is a struct that implements the `Plugin` trait, exported with the `register_plugin!` macro. The `new` method is called once for each entry in the `.parcelrc` that refers to the plugin, and receives that entry's `config` as UTF-8 encoded JSON bytes (or an empty slice when there is no config). This allows the same plugin to be used multiple times with different configuration.

{% sample %}
{% samplefile "src/lib.rs" %}

```rust
use parcel_plugin::{Asset, Diagnostic, Options, Plugin, register_plugin};

struct TxtTransformer {
  prefix: String,
}

impl Plugin for TxtTransformer {
  fn new(config: &[u8]) -> Result<Self, Diagnostic> {
    let prefix = if config.is_empty() {
      String::new()
    } else {
      let config: serde_json::Value =
        serde_json::from_slice(config).map_err(|e| Diagnostic::new(e.to_string()))?;
      config["prefix"].as_str().unwrap_or_default().to_owned()
    };

    Ok(TxtTransformer { prefix })
  }

  fn transform(&self, asset: &mut Asset, _options: &Options) -> Result<(), Diagnostic> {
    // Emit an ES module that default-exports the text content.
    asset.set_content(format!(
      "export default {:?};\n",
      format!("{}{}", self.prefix, asset.content())
    ));
    asset.set_type("js");
    Ok(())
  }
}

register_plugin!(TxtTransformer);
```

{% endsamplefile %}
{% endsample %}

Then build it with `cargo build`, and reference the library from your `.parcelrc` (see [Using native plugins](#using-native-plugins) below).

### Plugin methods

The `Plugin` trait has one method for each plugin type. Implement the ones your plugin supports. The default implementations return an error.

| Method      | Plugin type                                | Returns                                                                                                                    |
| ----------- | ------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------- |
| `transform` | [Transformer](/plugin-system/transformer/) | Modifies the `Asset` in place.                                                                                             |
| `resolve`   | [Resolver](/plugin-system/resolver/)       | A `ResolveResult`: `Resolved { file_path, pipeline }`, `External`, `Excluded`, or `None` to continue to the next resolver. |
| `name`      | [Namer](/plugin-system/namer/)             | A path relative to the bundle's dist directory, or `None` to continue to the next namer.                                   |
| `optimize`  | [Optimizer](/plugin-system/optimizer/)     | An `OptimizeResult` containing the new contents, and optionally a source map.                                              |
| `report`    | [Reporter](/plugin-system/reporter/)       | Receives a `ReportEvent`: `BuildStart`, `BuildSuccess`, `BuildFailure`, or `Log`.                                          |

Every method also receives an `Options` object, which provides access to the project root (`project_root()`), environment variables (`env(key)`), [logging](#logging), and the [file system](#file-system).

The [examples](https://github.com/parcel-bundler/parcel/tree/core-rs3/plugin-rs/examples) include a plugin of each type.

<!-- TODO(v3): GitHub links in this page point at the core-rs3 branch of parcel-bundler/parcel. Update once the v3 branch/tag name is settled. -->

### Assets

The `Asset` passed to `transform` provides access to the asset's content and metadata. It is only valid for the duration of the call.

- `content()` and `content_bytes()` return the asset's content as a string or bytes. `set_content(...)` and `set_content_bytes(...)` replace it.
- `set_content_with_map(...)` and `set_content_bytes_with_map(...)` replace the content along with a [source map](/plugin-system/source-maps/) as JSON.
- `asset_type()` and `set_type(...)` get and set the asset's type, e.g. `"js"`. Changing the type causes the asset to be processed by the pipeline that matches the new type.
- `file_path()`, `query()`, and `target()` describe the asset and the environment it is built for.
- `pipeline()`, `bundle_behavior()`, `unique_key()`, and `flags()` have corresponding setters.
- `add_dependency(DependencyOptions)` adds a dependency to the asset. `DependencyOptions` includes the specifier, specifier type, priority, bundle behavior, flags, and package `exports` conditions.
- `resolve(&dependency, from, options)` resolves a dependency with the resolvers configured in `.parcelrc`, exactly as if it had been added with `add_dependency`, without adding it. Parcel tracks the files the resolvers read, so the asset is rebuilt when the result would change.

### Diagnostics

Return a `Diagnostic` to fail a plugin call. Diagnostics may include a file path and location to display a code frame, along with a hint about how to resolve the problem. Line and column numbers are 1-based.

```rust
return Err(
  Diagnostic::new("Unexpected token")
    .with_file(asset.file_path())
    .at(10, 5)
    .with_hint("Check the syntax of the file."),
);
```

Returning an error from a reporter does not fail the build. The error is reported, and the build continues.

### Logging

The `Options` object passed to every method can be used to log messages. `log` logs a plain message at a given `LogLevel` (`Error`, `Warn`, `Info`, or `Verbose`). `log_diagnostic` logs a diagnostic without failing the build, which is useful to emit a warning with a code frame.

```rust
options.log(LogLevel::Verbose, "Transforming file");

options.log_diagnostic(
  &Diagnostic::warning("This feature is deprecated.")
    .with_file(asset.file_path())
    .at(1, 5)
    .with_hint("Please use this other feature instead."),
);
```

### File system

Plugins should read files through `Options` rather than directly with `std::fs`. This way, Parcel knows which files the plugin depends on, and re-runs it when one of them changes or a missing file is created. `read_file` and `read_to_string` read a file, `file_kind` returns whether a path is a file, directory, or does not exist, and `canonicalize` resolves symlinks. These are available while transforming or resolving.

```rust
let config = options.read_to_string("/path/to/tool.config.json")?;
```

### Custom content

Normally, an asset's content is a string or bytes. Transformers can also store a custom Rust value as the content of an asset, e.g. an AST, using `set_custom_content`. The value must implement the `AssetContent` trait, which has a stable `TYPE_ID`, a `read` method that returns the content as a string or bytes when another plugin needs it, and a `package` method which is called to produce the final contents of a bundle that contains the asset. `package` receives the `BundleGraph` and `Bundle`, so it can find the other assets in the bundle and the bundles they reference.

```rust
use parcel_plugin::{AssetContent, Bundle, BundleGraph, ContentBuffer, Diagnostic, Options};

struct MyContent {
  // ...
}

impl AssetContent for MyContent {
  const TYPE_ID: [u8; 16] = parcel_plugin::type_id!("MyContent");

  fn read(&self) -> Result<ContentBuffer, Diagnostic> {
    Ok(ContentBuffer::String(self.to_code()))
  }

  fn package(
    &self,
    bundle_graph: &BundleGraph,
    bundle: &Bundle,
    options: &Options,
  ) -> Result<ContentBuffer, Diagnostic> {
    Ok(ContentBuffer::String(self.to_code()))
  }
}
```

See the [custom content example](https://github.com/parcel-bundler/parcel/tree/core-rs3/plugin-rs/examples/custom-content-transformer) for more details.

<!-- TODO(v3): confirm how bundles containing custom content are packaged when the bundle contains multiple assets (packaging uses the content of the bundle's first asset, crates/core/src/packaging.rs packaging_plan). -->

## Go

The Go SDK lives in the [`plugin-go`](https://github.com/parcel-bundler/parcel/tree/core-rs3/plugin-go) directory of the Parcel repo, as the `github.com/parcel-bundler/parcel/plugin-go` module. A plugin is a `main` package that registers a plugin in an `init` function. Embed `parcel.DefaultPlugin` to get default implementations of the methods you don't need.

```go
package main

import (
	"fmt"

	parcel "github.com/parcel-bundler/parcel/plugin-go"
)

type TxtTransformer struct {
	parcel.DefaultPlugin
}

func (t *TxtTransformer) Transform(asset *parcel.Asset, _ *parcel.Options) error {
	asset.SetContent(fmt.Sprintf("export default %q;\n", asset.Content()))
	asset.SetType("js")
	return nil
}

func init() {
	parcel.RegisterPlugin(func(config []byte) (parcel.Plugin, error) {
		return &TxtTransformer{}, nil
	})
}

func main() {}
```

Build it as a C shared library. This requires cgo, and therefore a C compiler.

```shell
go build -buildmode=c-shared -o plugin.dylib .
```

The Go API mirrors the Rust SDK: `Transform`, `Resolve`, `Name`, `Optimize`, and `Report` methods, `Asset` methods such as `Content`, `SetContent`, `SetContentWithMap`, `AddDependency`, and `Resolve`, and `Options` methods such as `Log`, `LogDiagnostic`, and `ReadFile`. Returning an error fails the call. Custom content is supported via `SetCustomContent`. See the [examples](https://github.com/parcel-bundler/parcel/tree/core-rs3/plugin-go/examples).

<!-- TODO(v3): confirm how Go users should depend on the SDK (e.g. `go get github.com/parcel-bundler/parcel/plugin-go@<branch or tag>`); there are no tags for the module yet. -->

## Swift

The Swift SDK lives in the [`plugin-swift`](https://github.com/parcel-bundler/parcel/tree/core-rs3/plugin-swift) directory of the Parcel repo, and provides the `ParcelPlugin` library. It requires Swift 6.2 or later, and macOS 15 or later at runtime. Declare a dynamic library product in your `Package.swift`:

{% sample %}
{% samplefile "Package.swift" %}

```swift
let package = Package(
  name: "TxtTransformer",
  platforms: [.macOS(.v15)],
  products: [.library(name: "TxtTransformer", type: .dynamic, targets: ["TxtTransformer"])],
  dependencies: [.package(url: "https://github.com/parcel-bundler/parcel", branch: "core-rs3")],
  targets: [
    .target(
      name: "TxtTransformer",
      dependencies: [.product(name: "ParcelPlugin", package: "parcel")])
  ]
)
```

{% endsamplefile %}
{% endsample %}

A plugin conforms to one or more of the `Transformer`, `Resolver`, `Namer`, `Optimizer`, and `Reporter` protocols, and is exported with the `#parcelPlugin` macro. Its `Config` is decoded from the plugin's config in `.parcelrc` using `JSONDecoder`. Plugins without config declare `init(config: NoConfig)`.

{% sample %}
{% samplefile "Sources/TxtTransformer/TxtTransformer.swift" %}

```swift
import ParcelPlugin

struct TxtTransformer: Transformer {
  struct Config: Decodable {
    var prefix: String?
  }

  let prefix: String

  init(config: Config) {
    prefix = config.prefix ?? ""
  }

  func transform(_ asset: Asset, options: Options) async throws {
    asset.content = "export default \(javaScriptString(prefix + asset.content));"
    asset.type = "js"
  }
}

#parcelPlugin(TxtTransformer.self)
```

{% endsamplefile %}
{% endsample %}

Build it with `swift build -c release`, which produces `.build/release/libTxtTransformer.dylib`.

Every plugin method is `async`, and plugins must be `Sendable` since one instance is called from many threads at once. Throw a `Diagnostic` to fail a call with a code frame and a hint, and use `options.log(.warning("..."))` to warn without failing. Unlike Rust and Go, Swift cannot recover from a trap (e.g. a failed force unwrap), which crashes Parcel, so throw errors instead. See the [README](https://github.com/parcel-bundler/parcel/tree/core-rs3/plugin-swift#readme) for more details about concurrency, and the [examples](https://github.com/parcel-bundler/parcel/tree/core-rs3/plugin-swift/Examples/Sources).

<!-- TODO(v3): the Package.swift dependency above uses branch "core-rs3" (copied from plugin-swift/README.md); update to a released tag/branch. -->

## C ABI

All of the SDKs are built on a C ABI, which is defined in [`plugin.h`](https://github.com/parcel-bundler/parcel/blob/core-rs3/crates/parcel-plugin-abi/plugin.h). Plugins in other languages can implement it directly. A plugin library exports the following functions:

- `parcel_plugin_init` (required) – called once per `.parcelrc` entry with a table of host functions, the plugin's config as JSON, and an out parameter for the plugin's state. The plugin must store the table in its `parcel_api` global, and check it with `parcel_api_compatible` before calling anything else.
- `parcel_plugin_deinit` (optional) – called to free the plugin's state.
- `parcel_plugin_transform`, `parcel_plugin_resolve`, `parcel_plugin_name`, `parcel_plugin_optimize`, and `parcel_plugin_report` – the entry points for each plugin type. Only the ones for the plugin types you use are required.

Plugins don't link against any Parcel symbols. Instead, all calls into Parcel go through the table of host functions passed to `parcel_plugin_init`, which `plugin.h` wraps in inline functions such as `parcel_asset_get_content` and `parcel_asset_set_content`.

The ABI is versioned with `PARCEL_ABI_VERSION`. A plugin built against a different ABI version than the one Parcel implements is rejected with an error, so it needs to be rebuilt.

## Local development

While developing a native plugin, you can reference the built library by its relative path in `.parcelrc`. Paths ending in `.dylib`, `.so`, or `.dll` are loaded as native plugins.

{% sample %}
{% samplefile ".parcelrc" %}

```json
{
  "extends": "@parcel/config-default",
  "transformers": {
    "*.txt": [
      {
        "plugin": "./target/debug/libparcel_transformer_txt.dylib",
        "config": {
          "prefix": "Hello: "
        }
      }
    ]
  }
}
```

{% endsamplefile %}
{% endsample %}

Native plugins can also be referenced by package name, the same way they are when they are installed from npm. To do this, set the `parcel.devLibrary` field in the plugin's `package.json` (alongside `parcel.artifacts`, described [below](#publishing)) to the path of your local build. The file extension may be omitted, in which case Parcel appends the extension for the current platform. This way, the same entry works on every platform.

{% sample %}
{% samplefile "package.json" %}

```json
{
  "name": "parcel-transformer-txt",
  "version": "1.0.0",
  "parcel": {
    "abi": 1,
    "artifacts": {
      "aarch64-apple-darwin": "parcel-transformer-txt-darwin-arm64",
      "x86_64-unknown-linux-gnu": "parcel-transformer-txt-linux-x64-gnu"
    },
    "devLibrary": "./target/debug/libparcel_transformer_txt"
  }
}
```

{% endsamplefile %}
{% endsample %}

When `devLibrary` is set, it is always used instead of the published binaries. If the file does not exist, the build fails. `devLibrary` is removed when the plugin is published using the workflow described below.

## Publishing

Native plugins are published to npm, and installed and referenced in `.parcelrc` just like JavaScript plugins. They follow the same [naming conventions](/plugin-system/authoring-plugins/#naming).

A native plugin is published as one package per platform, each containing the shared library for that platform, along with a main package that only contains metadata. The main package's `package.json` lists the package for each platform under `parcel.artifacts`, keyed by Rust target triple, and declares the ABI version the plugin was built against in `parcel.abi`. The platform packages are listed as `optionalDependencies`, so npm only installs the one matching the user's platform. Each platform package names its library in `parcel.library`.

{% sample %}
{% samplefile "package.json" %}

```json
{
  "name": "parcel-transformer-txt",
  "version": "1.0.0",
  "files": [],
  "parcel": {
    "abi": 1,
    "artifacts": {
      "aarch64-apple-darwin": "parcel-transformer-txt-darwin-arm64",
      "x86_64-apple-darwin": "parcel-transformer-txt-darwin-x64",
      "x86_64-pc-windows-msvc": "parcel-transformer-txt-win32-x64-msvc",
      "x86_64-unknown-linux-gnu": "parcel-transformer-txt-linux-x64-gnu",
      "aarch64-unknown-linux-gnu": "parcel-transformer-txt-linux-arm64-gnu",
      "x86_64-unknown-linux-musl": "parcel-transformer-txt-linux-x64-musl",
      "aarch64-unknown-linux-musl": "parcel-transformer-txt-linux-arm64-musl"
    }
  }
}
```

{% endsamplefile %}
{% endsample %}

An artifact may also be a relative path to a library inside the main package itself, e.g. `"./plugin-darwin-arm64.dylib"`. This ships all platforms in a single package, which is simpler for small plugins, at the cost of every user downloading every binary.

Parcel provides a reusable GitHub Actions workflow that builds a Rust, Go, or Swift plugin for every platform listed in `parcel.artifacts`, generates the platform packages, and publishes everything to npm using [trusted publishing](https://docs.npmjs.com/trusted-publishers).

{% sample %}
{% samplefile ".github/workflows/release.yml" %}

```yaml
name: release

on:
  push:
    tags: ["v*"]

jobs:
  release:
    permissions:
      contents: read
      id-token: write # required for npm trusted publishing
    uses: parcel-bundler/parcel/.github/workflows/native-plugin.yml@v2
    with:
      paths: .
      publish: true
```

{% endsamplefile %}
{% endsample %}

When called with `publish: false` (the default), it builds the plugin and uploads the packages as workflow artifacts without publishing, which is useful as a check on pull requests. See the [workflow documentation](https://github.com/parcel-bundler/parcel/blob/core-rs3/.github/scripts/native-plugin/README.md) for all of the options and supported platforms.

<!-- TODO(v3): `native-plugin.yml@v2` is copied from .github/scripts/native-plugin/README.md, but the workflow does not exist on the v2 branch (only core-rs3), so this ref currently fails. Update the ref once it is merged/tagged. Swift plugins are currently only supported on macOS (arm64/x64) and Linux glibc (x64/arm64). -->
