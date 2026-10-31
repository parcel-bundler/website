---
layout: layout.njk
eleventyNavigation:
  key: plugin-system-reporter
  title: Reporter
  order: 11
---

Reporter plugins receive events from Parcel as they happen throughout the build process. For example, reporters may log status information, or statistics about the bundles at the end of a build.

## Example

A Reporter plugin implements a method for each type of event it wants to receive: {% api js="buildStart", rust="build_start", go="BuildStart", swift="buildStart" %}, {% api js="buildSuccess", rust="build_success", go="BuildSuccess", swift="buildSuccess" %}, {% api js="buildFailure", rust="build_failure", go="BuildFailure", swift="buildFailure" %}, and {% api js="log", rust="log", go="Log", swift="log" %}. At least one of these methods must be implemented, and events without one are skipped. In Go, each method has its own interface, e.g. `parcel.BuildSuccessReporter`. This example logs the number of bundles and build time when a build is successful.

{% codetabs %}

```javascript
import { Reporter } from "@parcel/plugin";

export default new Reporter({
  buildSuccess({ bundleGraph, buildTime }) {
    let bundles = bundleGraph.getBundles();
    console.log(`✨ Built ${bundles.length} bundles in ${buildTime}ms!`);
  },
});
```

```rust
use parcel_plugin::{BuildSuccess, Diagnostic, Options, Plugin, register_plugin};

struct MyReporter;

impl Plugin for MyReporter {
  fn new(_config: &[u8]) -> Result<Self, Diagnostic> {
    Ok(MyReporter)
  }

  fn build_success(&self, event: &BuildSuccess, _options: &Options) -> Result<(), Diagnostic> {
    let bundles = event.bundle_graph.bundle_count();
    println!("✨ Built {} bundles in {:?}!", bundles, event.build_time);
    Ok(())
  }
}

register_plugin!(MyReporter);
```

```go
package main

import (
	"fmt"

	parcel "github.com/parcel-bundler/parcel/plugin-go/v3"
)

type MyReporter struct{}

func (r *MyReporter) BuildSuccess(event *parcel.BuildSuccess, _ *parcel.Options) error {
	bundles := event.BundleGraph.BundleCount()
	fmt.Printf("✨ Built %d bundles in %v!\n", bundles, event.BuildTime)
	return nil
}

func init() {
	parcel.RegisterPlugin(func(config []byte) (any, error) {
		return &MyReporter{}, nil
	})
}

func main() {}
```

```swift
import ParcelPlugin

struct MyReporter: Reporter {
  init(config: NoConfig) {}

  func buildSuccess(_ event: BuildSuccess, options: Options) async throws {
    let bundles = event.bundleGraph.bundleCount
    print("✨ Built \(bundles) bundles in \(event.buildTime)!")
  }
}

#parcelPlugin(MyReporter.self)
```

{% endcodetabs %}

See [Native plugins](/plugin-system/native-plugins/) for how to build native plugins and use them in a project. The rest of the examples on this page omit the setup code, and only show the method for each event.

Each event includes its properties, along with Parcel's options. JavaScript reporters also receive the plugin's `config` from `.parcelrc` with each event, and native reporters receive it when they are created. See [Configuration](/plugin-system/authoring-plugins/#configuration) for details. Reporters cannot affect the result of a build. If a reporter fails with an error, it is logged, and the build continues.

{% note %}

**Note**: Messages logged by JavaScript reporters using `console` methods (or `process.stdout`/`process.stderr`) are sent as log events to all reporters, including Parcel's built-in CLI reporter, which prints them. To prevent infinite loops, messages logged while handling a log event may be discarded. Native reporters write to stdout and stderr directly. See [Logging](/plugin-system/logging/) for more details.

{% endnote %}

<!-- TODO(v3): JS reporters cannot write files (the plugin fs is read-only) or write directly to stdout (process.stdout.write is routed to console.log as an info-level log, so it is filtered by --log-level and formatted by the CLI reporter). v2 reporters commonly did both (e.g. bundle analyzers, build metrics). Native reporters can use println!/std::fs. -->

## Build start

The build start event is emitted when a build is started. In watch mode, it is emitted at the start of each rebuild.

{% codetabs %}

```javascript
import { Reporter } from "@parcel/plugin";

export default new Reporter({
  buildStart() {
    console.log("Started build!");
  },
});
```

```rust
impl Plugin for MyReporter {
  fn build_start(&self, _options: &Options) -> Result<(), Diagnostic> {
    println!("Started build!");
    Ok(())
  }
}
```

```go
func (r *MyReporter) BuildStart(_ *parcel.Options) error {
	fmt.Println("Started build!")
	return nil
}
```

```swift
struct MyReporter: Reporter {
  func buildStart(options: Options) async throws {
    print("Started build!")
  }
}
```

{% endcodetabs %}

## Build success

The build success event is emitted when a build completes successfully. It includes the full bundle graph that was built, the build time, and a list of the assets that changed. On a full build, the changed assets include every asset, and on rebuilds they include the assets that were transformed again. The build time is a number of milliseconds in JavaScript, and a duration in native plugins. Native plugins receive the changed assets as indices, which can be looked up in the bundle graph.

{% api js="bundle.filePath", rust="bundle.dist_path()", go="bundle.DistPath()", swift="bundle.distPath" %} returns the absolute path that each bundle in the bundle graph was written to, or nothing for inline bundles.

{% codetabs %}

```javascript
import { Reporter } from "@parcel/plugin";

export default new Reporter({
  buildSuccess({ changedAssets, buildTime }) {
    console.log(`✨ Rebuilt ${changedAssets.length} assets in ${buildTime}ms!`);
  },
});
```

```rust
impl Plugin for MyReporter {
  fn build_success(&self, event: &BuildSuccess, _options: &Options) -> Result<(), Diagnostic> {
    println!("✨ Rebuilt {} assets in {:?}!", event.changed_assets.len(), event.build_time);
    Ok(())
  }
}
```

```go
func (r *MyReporter) BuildSuccess(event *parcel.BuildSuccess, _ *parcel.Options) error {
	fmt.Printf("✨ Rebuilt %d assets in %v!\n", len(event.ChangedAssets), event.BuildTime)
	return nil
}
```

```swift
struct MyReporter: Reporter {
  func buildSuccess(_ event: BuildSuccess, options: Options) async throws {
    print("✨ Rebuilt \(event.changedAssets.count) assets in \(event.buildTime)!")
  }
}
```

{% endcodetabs %}

## Build failure

The build failure event is emitted when a build completes with errors. It includes a list of [diagnostics](/plugin-system/logging/#diagnostics) describing the errors. See [Diagnostics](/plugin-system/logging/#diagnostics) for details.

{% codetabs %}

```javascript
import { Reporter } from "@parcel/plugin";

export default new Reporter({
  buildFailure({ diagnostics }) {
    console.log(`🚨 Build failed with ${diagnostics.length} errors.`);
  },
});
```

```rust
impl Plugin for MyReporter {
  fn build_failure(&self, event: &BuildFailure, _options: &Options) -> Result<(), Diagnostic> {
    println!("🚨 Build failed with {} errors.", event.diagnostics.len());
    Ok(())
  }
}
```

```go
func (r *MyReporter) BuildFailure(event *parcel.BuildFailure, _ *parcel.Options) error {
	fmt.Printf("🚨 Build failed with %d errors.\n", event.Diagnostics.Len())
	return nil
}
```

```swift
struct MyReporter: Reporter {
  func buildFailure(_ event: BuildFailure, options: Options) async throws {
    print("🚨 Build failed with \(event.diagnostics.count) errors.")
  }
}
```

{% endcodetabs %}

## Logging

All logging in Parcel is routed through Reporter plugins. The level of each log event is one of error, warn, info, or verbose. Each event includes either a message string, or a list of [diagnostics](/plugin-system/logging/#diagnostics), which provide detail about the context of the log. Only messages allowed by the [`--log-level`](/features/cli/#parameters) CLI option are sent to reporters.

{% codetabs %}

```javascript
import { Reporter } from "@parcel/plugin";

export default new Reporter({
  log({ level, message, diagnostics }) {
    let messages =
      message != null ? [message] : diagnostics.map((d) => d.message);

    for (let message of messages) {
      sendToLogService(level, message);
    }
  },
});
```

```rust
impl Plugin for MyReporter {
  fn log(&self, event: &Log, _options: &Options) -> Result<(), Diagnostic> {
    let messages: Vec<String> = match event.message {
      Some(message) => vec![message.to_string()],
      None => event.diagnostics.iter().flat_map(|d| d.iter()).map(|d| d.message()).collect(),
    };

    for message in messages {
      send_to_log_service(event.level, &message);
    }
    Ok(())
  }
}
```

```go
func (r *MyReporter) Log(event *parcel.Log, _ *parcel.Options) error {
	var messages []string
	if event.Diagnostics == nil {
		messages = []string{event.Message}
	} else {
		for _, d := range event.Diagnostics.All() {
			messages = append(messages, d.Message())
		}
	}

	for _, message := range messages {
		sendToLogService(event.Level, message)
	}
	return nil
}
```

```swift
struct MyReporter: Reporter {
  func log(_ event: Log, options: Options) async throws {
    let messages: [String]
    switch event.message {
    case .text(let message):
      messages = [message]
    case .diagnostics(let diagnostics):
      messages = diagnostics.map(\.message)
    @unknown default:
      messages = []
    }

    for message in messages {
      sendToLogService(event.level, message)
    }
  }
}
```

{% endcodetabs %}

## Relevant API

The API reference below covers JavaScript plugins. For native plugins, see the [Rust](https://github.com/parcel-bundler/parcel/tree/v3/crates/parcel-plugin), [Go](https://github.com/parcel-bundler/parcel/tree/v3/plugin-go), and [Swift](https://github.com/parcel-bundler/parcel/tree/v3/plugin-swift) SDKs.

<!-- TODO(v3): link to the generated docs for each SDK (docs.rs, pkg.go.dev, DocC) once they are published. -->

{% include "../../api/reporter.html" %}
