---
layout: layout.njk
eleventyNavigation:
  key: plugin-system-reporter
  title: Reporter
  order: 11
---

Reporter plugins receive events from Parcel as they happen throughout the build process. For example, reporters may log status information, or statistics about the bundles at the end of a build.

## Example

A Reporter plugin implements a method for each type of event it wants to receive: `buildStart`, `buildSuccess`, `buildFailure`, and `log`. At least one of these methods must be implemented. This example logs the number of bundles and build time when a build is successful.

```javascript
import { Reporter } from "@parcel/plugin";

export default new Reporter({
  buildSuccess({ bundleGraph, buildTime }) {
    let bundles = bundleGraph.getBundles();
    console.log(`✨ Built ${bundles.length} bundles in ${buildTime}ms!`);
  },
});
```

Each method receives an object with the properties of the event, along with the plugin's `config` from `.parcelrc` and Parcel's `options`. Reporters cannot affect the result of a build. If a Reporter throws an error, it is logged, and the build continues.

{% note %}

**Note**: Messages logged by Reporter plugins using `console` methods (or `process.stdout`/`process.stderr`) are sent as log events to all reporters, including Parcel's built-in CLI reporter, which prints them. To prevent infinite loops, messages logged while handling a `log` event may be discarded. See [Logging](/plugin-system/logging/) for more details.

{% endnote %}

<!-- TODO(v3): JS reporters cannot write files (the plugin fs is read-only) or write directly to stdout (process.stdout.write is routed to console.log as an info-level log, so it is filtered by --log-level and formatted by the CLI reporter). v2 reporters commonly did both (e.g. bundle analyzers, build metrics). Native reporters can use println!/std::fs. -->

## Build start

The `buildStart` event is emitted when a build is started. In watch mode, it is emitted at the start of each rebuild.

```javascript
import { Reporter } from "@parcel/plugin";

export default new Reporter({
  buildStart() {
    console.log("Started build!");
  },
});
```

## Build success

The `buildSuccess` event is emitted when a build completes successfully. It includes the full `bundleGraph` that was built, the `buildTime` in milliseconds, and a list of `changedAssets`.

```javascript
import { Reporter } from "@parcel/plugin";

export default new Reporter({
  buildSuccess({ changedAssets, buildTime }) {
    console.log(`✨ Rebuilt ${changedAssets.length} assets in ${buildTime}ms!`);
  },
});
```

<!-- TODO(v3): Bundle.filePath is null in buildSuccess for bundles that are not content hashed, e.g. entries (tested with target/release/parcel build; JsBundle::file_path checks bundle.has_final_path()), even though types.ts says it is "the absolute path the bundle is written to, once it is known". `name` works. Also, changedAssets contained every asset on a full build, while crates/core/src/reporter.rs documents it as empty on a full build. -->

## Build failure

The `buildFailure` event is emitted when a build is completes with errors. It includes a list of [`Diagnostic`](/plugin-system/logging/#diagnostics) objects describing the errors. See [Diagnostics](/plugin-system/logging/#diagnostics) for details.

```javascript
import { Reporter } from "@parcel/plugin";

export default new Reporter({
  buildFailure({ diagnostics }) {
    console.log(`🚨 Build failed with ${diagnostics.length} errors.`);
  },
});
```

## Logging

All logging in Parcel is routed through Reporter plugins. The `level` property indicates the type of each `log` event, and is one of `error`, `warn`, `info`, or `verbose`. Each event includes either a `message` string, or a list of [`Diagnostic`](/plugin-system/logging/#diagnostics) objects, which provide detail about the context of the log. Only messages allowed by the [`--log-level`](/features/cli/#parameters) CLI option are sent to reporters.

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

<!-- TODO(v3): a JS reporter that implements `log` failed with "unknown: ArrayBuffer object expected" (printed twice, build still succeeded) when a JS optimizer logged via console.log after reading `contents.length`. Repro in the group-j scratchpad (p1). -->

## Native reporters

Reporters can also be written as [native plugins](/plugin-system/native-plugins/). With the Rust SDK, implement the `report` method of the `Plugin` trait. Native reporters may write to stdout directly.

```rust
use parcel_plugin::{register_plugin, Diagnostic, Options, Plugin, ReportEvent};

struct MyReporter;

impl Plugin for MyReporter {
  fn new(_config: &[u8]) -> Result<Self, Diagnostic> {
    Ok(MyReporter)
  }

  fn report(&self, event: &ReportEvent, _options: &Options) -> Result<(), Diagnostic> {
    match event {
      ReportEvent::BuildSuccess { bundle_graph, build_time, .. } => {
        println!("✨ Built {} bundles in {:?}!", bundle_graph.bundle_count(), build_time);
      }
      ReportEvent::BuildFailure { diagnostics } => {
        println!("🚨 Build failed with {} errors.", diagnostics.len());
      }
      // Ignore other events, including ones added in future versions of Parcel.
      _ => {}
    }

    Ok(())
  }
}

register_plugin!(MyReporter);
```

## Relevant API

{% include "../../api/reporter.html" %}
