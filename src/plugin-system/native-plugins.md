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
- You want to store a custom representation of an asset's content (e.g. an AST) and control how it is packaged. See [Custom content](/plugin-system/transformer/#custom-content).

Native plugins are called from multiple threads at once, so they must be thread safe. Errors returned by a plugin are reported as [diagnostics](/plugin-system/logging/#diagnostics).

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
parcel-plugin = "0.1.0"
serde_json = "1"
```

{% endsamplefile %}
{% endsample %}

The SDKs for every language are released together with Parcel, and tagged with its version in the Parcel repo. Depend on the tag matching the version of Parcel your plugin targets.

<!-- TODO(v3): parcel-plugin is not published to crates.io yet (the examples in plugin-rs/examples use a path dependency). Confirm the recommended dependency spec (crates.io version, or git + branch). -->

A plugin is a struct that implements the `Plugin` trait, exported with the `register_plugin!` macro. The trait has one method for each plugin type (`transform`, `resolve`, `name`, and `optimize`), and one for each type of event a reporter receives (`build_start`, `build_success`, `build_failure`, and `log`). Implement the ones your plugin supports. The default implementations return an error, except for the reporter methods, which do nothing. The `new` method is called once for each entry in the `.parcelrc` that refers to the plugin, and receives that entry's `config` as UTF-8 encoded JSON bytes (or an empty slice when there is no config). This allows the same plugin to be used multiple times with different configuration.

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
    let text = format!("{}{}", self.prefix, asset.content()?);
    let literal = serde_json::to_string(&text).map_err(|e| Diagnostic::new(e.to_string()))?;
    asset.set_content(format!("export default {literal};\n"));
    asset.set_type("js");
    Ok(())
  }
}

register_plugin!(TxtTransformer);
```

{% endsamplefile %}
{% endsample %}

Build it with `cargo build`, which produces `target/debug/libparcel_transformer_txt.dylib` (or `.so` or `.dll`).

Return a `Diagnostic` to fail a call (see [Diagnostics](/plugin-system/logging/#diagnostics)). Panics are caught and reported as errors rather than crashing Parcel. See the [examples](https://github.com/parcel-bundler/parcel/tree/v3/plugin-rs/examples) for a plugin of each type.

## Go

The Go SDK lives in the [`plugin-go`](https://github.com/parcel-bundler/parcel/tree/v3/plugin-go) directory of the Parcel repo, as the `github.com/parcel-bundler/parcel/plugin-go/v3` module:

```shell
go get github.com/parcel-bundler/parcel/plugin-go/v3@v{{ parcel.version }}
```

A plugin is a `main` package that registers a plugin in an `init` function. The plugin implements one or more of the `Transformer`, `Resolver`, `Namer`, and `Optimizer` interfaces, each of which has one method: `Transform`, `Resolve`, `Name`, or `Optimize`. A reporter implements an interface for each type of event it receives: `BuildStartReporter`, `BuildSuccessReporter`, `BuildFailureReporter`, or `LogReporter`. The function passed to `RegisterPlugin` is called once for each entry in the `.parcelrc` that refers to the plugin, and receives that entry's `config` as UTF-8 encoded JSON bytes (or an empty slice when there is no config). This allows the same plugin to be used multiple times with different configuration.

{% sample %}
{% samplefile "main.go" %}

```go
package main

import (
	"encoding/json"
	"fmt"

	parcel "github.com/parcel-bundler/parcel/plugin-go/v3"
)

type TxtTransformer struct {
	Prefix string `json:"prefix"`
}

func (t *TxtTransformer) Transform(asset *parcel.Asset, _ *parcel.Options) error {
	content, err := asset.Content()
	if err != nil {
		return err
	}

	// Emit an ES module that default-exports the text content.
	// A JSON string is a valid JavaScript string literal.
	literal, err := json.Marshal(t.Prefix + content)
	if err != nil {
		return err
	}
	asset.SetContent(fmt.Sprintf("export default %s;\n", literal))
	asset.SetType("js")
	return nil
}

func init() {
	parcel.RegisterPlugin(func(config []byte) (any, error) {
		t := &TxtTransformer{}
		if len(config) > 0 {
			if err := json.Unmarshal(config, t); err != nil {
				return nil, err
			}
		}
		return t, nil
	})
}

func main() {}
```

{% endsamplefile %}
{% endsample %}

Build it as a C shared library. This requires cgo, and therefore a C compiler.

```shell
go build -buildmode=c-shared -o plugin.dylib .
```

Return an error, e.g. a `*parcel.Diagnostic`, to fail a call (see [Diagnostics](/plugin-system/logging/#diagnostics)). Panics are recovered and reported as errors rather than crashing Parcel. See the [examples](https://github.com/parcel-bundler/parcel/tree/v3/plugin-go/examples) for a plugin of each type.

## Swift

The Swift SDK lives in the [`plugin-swift`](https://github.com/parcel-bundler/parcel/tree/v3/plugin-swift) directory of the Parcel repo, and provides the `ParcelPlugin` library. It requires Swift 6.2 or later, and macOS 15 or later at runtime. Declare a dynamic library product in your `Package.swift`:

{% sample %}
{% samplefile "Package.swift" %}

```swift
// swift-tools-version: 6.2
import PackageDescription

let package = Package(
  name: "TxtTransformer",
  platforms: [.macOS(.v15)],
  products: [.library(name: "TxtTransformer", type: .dynamic, targets: ["TxtTransformer"])],
  dependencies: [.package(url: "https://github.com/parcel-bundler/parcel", exact: "{{ parcel.version }}")],
  targets: [
    .target(
      name: "TxtTransformer",
      dependencies: [.product(name: "ParcelPlugin", package: "parcel")])
  ]
)
```

{% endsamplefile %}
{% endsample %}

A plugin conforms to one or more of the `Transformer`, `Resolver`, `Namer`, `Optimizer`, and `Reporter` protocols, and is exported with the `#parcelPlugin` macro. The plugin is created once for each entry in the `.parcelrc` that refers to it, and its `Config` is decoded from that entry's `config` using `JSONDecoder`. This allows the same plugin to be used multiple times with different configuration. Plugins without config declare `init(config: NoConfig)`.

{% sample %}
{% samplefile "Sources/TxtTransformer/TxtTransformer.swift" %}

```swift
import Foundation
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
    // Emit an ES module that default-exports the text content.
    // A JSON string is a valid JavaScript string literal.
    let literal = try JSONEncoder().encode(prefix + asset.content())
    asset.setContent("export default \(String(decoding: literal, as: UTF8.self));\n")
    asset.type = "js"
  }
}

#parcelPlugin(TxtTransformer.self)
```

{% endsamplefile %}
{% endsample %}

Build it with `swift build -c release`, which produces `.build/release/libTxtTransformer.dylib`.

Throw an error, e.g. a `Diagnostic`, to fail a call (see [Diagnostics](/plugin-system/logging/#diagnostics)). Unlike Rust and Go, Swift cannot recover from a trap (e.g. a failed force unwrap), which crashes Parcel, so throw errors instead. Every plugin method is `async`, and plugins must be `Sendable` since one instance is called from many threads at once. See the [README](https://github.com/parcel-bundler/parcel/tree/v3/plugin-swift#readme) for more details about concurrency, and the [examples](https://github.com/parcel-bundler/parcel/tree/v3/plugin-swift/Examples/Sources) for a plugin of each type.

## File system

Every plugin method receives an `Options` object, which provides the project root, environment variables, [logging](/plugin-system/logging/#logger), and access to the file system. Plugins should read files through `Options`, rather than directly with the language's own file system APIs. This way, Parcel knows which files the plugin depends on, and re-runs it when one of them changes or a missing file is created. These methods are available while transforming or resolving.

{% api rust="read_file()", go="ReadFile()", swift="fileSystem.read(_:)" %} reads a file, {% api rust="file_kind()", go="FileKind()", swift="fileSystem.kind(of:)" %} returns whether a path is a file, directory, or does not exist, and {% api rust="canonicalize()", go="Canonicalize()", swift="fileSystem.canonicalize(_:)" %} resolves symlinks.

{% codetabs %}

```rust
let config = options
  .read_to_string("/path/to/tool.config.json")
  .map_err(|e| Diagnostic::new(e.to_string()))?;
```

```go
config, err := options.ReadFile("/path/to/tool.config.json")
if err != nil {
	return err
}
```

```swift
let config = try options.fileSystem.readString("/path/to/tool.config.json")
```

{% endcodetabs %}

## C ABI

All of the SDKs are built on a C ABI, which is defined in [`plugin.h`](https://github.com/parcel-bundler/parcel/blob/v3/crates/parcel-plugin-abi/plugin.h). Plugins in other languages can implement it directly. A plugin library exports the following functions:

- `parcel_plugin_init` (required) – called once per `.parcelrc` entry with a table of host functions, the plugin's config as JSON, and an out parameter for the plugin's state. The plugin must store the table in its `parcel_api` global, and check it with `parcel_api_compatible` before calling anything else.
- `parcel_plugin_deinit` (optional) – called to free the plugin's state.
- `parcel_plugin_transform`, `parcel_plugin_resolve`, `parcel_plugin_name`, `parcel_plugin_optimize`, and `parcel_plugin_report` – the entry points for each plugin type. Only the ones for the plugin types you use are required.

Plugins don't link against any Parcel symbols. Instead, all calls into Parcel go through the table of host functions passed to `parcel_plugin_init`, which `plugin.h` wraps in inline functions such as `parcel_asset_get_content` and `parcel_asset_set_content`.

For example, this transformer converts a file into a JavaScript module that exports its number of lines. Copy `plugin.h` into your project, and include it:

{% sample %}
{% samplefile "plugin.c" %}

```c
#include <stdio.h>
#include <string.h>
#include "plugin.h"

// The host functions passed to parcel_plugin_init. The inline
// functions in plugin.h call through this.
const struct ParcelApi *parcel_api;

InitStatus parcel_plugin_init(const struct ParcelApi *api, const uint8_t *config,
                              uintptr_t config_len, void **state,
                              struct DiagnosticOptions *diagnostic) {
  if (!parcel_api_compatible(&api->header)) {
    return PARCEL_INIT_INCOMPATIBLE;
  }
  parcel_api = api;
  return PARCEL_INIT_OK;
}

// Converts a file into a JavaScript module that exports its number of lines.
void parcel_plugin_transform(Asset asset, Options options, void *state,
                             struct DiagnosticOptions *diagnostic) {
  struct Buffer content = {0};
  Diagnostics diagnostics = 0;
  if (!parcel_asset_get_content(&content, asset, options, &diagnostics)) {
    // Fail with the diagnostics Parcel reported for the read.
    const char *message = "Could not read the asset.";
    diagnostic->message = parcel_buffer_alloc((const uint8_t *)message, strlen(message));
    diagnostic->diagnostics = diagnostics;
    return;
  }

  size_t lines = 0;
  for (uintptr_t i = 0; i < content.len; i++) {
    if (content.data[i] == '\n') {
      lines++;
    }
  }
  if (content.len > 0 && content.data[content.len - 1] != '\n') {
    lines++;
  }
  parcel_buffer_free(&content);

  char code[64];
  int len = snprintf(code, sizeof(code), "export default %zu;\n", lines);
  parcel_asset_set_content_utf8(asset, (const uint8_t *)code, len, NULL, 0);
  parcel_asset_set_type(asset, (const uint8_t *)"js", 2);
}
```

{% endsamplefile %}
{% endsample %}

Then build it as a shared library with your C compiler, e.g. `cc -shared -fPIC -o plugin.dylib plugin.c`.

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
    uses: parcel-bundler/parcel/.github/workflows/native-plugin.yml@v{{ parcel.version }}
    with:
      paths: .
      publish: true
```

{% endsamplefile %}
{% endsample %}

When called with `publish: false` (the default), it builds the plugin and uploads the packages as workflow artifacts without publishing, which is useful as a check on pull requests. See the [workflow documentation](https://github.com/parcel-bundler/parcel/blob/v3/.github/scripts/native-plugin/README.md) for all of the options and supported platforms.
