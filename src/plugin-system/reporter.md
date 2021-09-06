---
layout: layout.njk
eleventyNavigation:
  key: plugin-system-reporter
  title: Reporter
  order: 11
---

Reporter plugins receive events from Parcel as they happen throughout the build process. For example, reporters may write status information to stdout, run a dev server, or generate a bundle analysis report at the end of a build.

## Example

This example writes the number of bundles and build time to stdout when a build is successful.

```javascript
import {Reporter} from '@parcel/plugin';

export default new Reporter({
  report({event}) {
    if (event.type === 'buildSuccess') {
      let bundles = event.bundleGraph.getBundles();
      process.stdout.write(`✨ Built ${bundles.length} bundles in ${event.buildTime}ms!\n`);
    }
  }
});
```

{% warning %}

**Note**: Do not use `console.log` in Reporter plugins. Parcel overrides `console` methods and routes messages to Reporter plugins. This can create an infinite loop in your Reporter. If you intend to write to stdout/stderr, use `process.stdout`/`process.stderr` instead. If another reporter will handle log events, use the provided `logger`. See [Logging](/plugin-system/logging/) for more details.

{% endwarning %}

## Build start

The `buildStart` event is emitted when a build is started. In watch mode, it is emitted at the start of each rebuild.

```javascript
import {Reporter} from '@parcel/plugin';

export default new Reporter({
  report({event}) {
    if (event.type === 'buildStart') {
      process.stdout.write('Started build!\n');
    }
  }
});
```

## Build progress

The `buildProgress` event is emitted throughout the build. It includes a `phase` property that indicates which phase of the build is occurring, and events include additional information specific to the phase. For example, events in the `transforming` phase include a `filePath` property of the asset being transformed. See [`BuildProgressEvent`](#BuildProgressEvent).

```javascript
import {Reporter} from '@parcel/plugin';

export default new Reporter({
  report({event}) {
    if (event.type === 'buildProgress') {
      switch (event.phase) {
        case 'transforming':
          process.stdout.write(`Transforming ${event.filePath}...\n`);
          break;
        case 'resolving':
          process.stdout.write(`Resolving ${event.dependency.specifier}...\n`);
          break;
        case 'bundling':
          process.stdout.write('Bundling...\n');
          break;
        case 'packaging':
          process.stdout.write(`Packaging ${event.bundle.displayName}...\n`);
          break;
        case 'optimizing':
          process.stdout.write(`Optimizing ${event.bundle.displayName}...\n`);
         break;
      }
    }
  }
});
```

## Build success

The `buildSuccess` event is emitted when a build completes successfully. It includes the full `bundleGraph` that was built, the `buildTime`, and a list of `changedAssets`.

```javascript
import {Reporter} from '@parcel/plugin';

export default new Reporter({
  report({event}) {
    if (event.type === 'buildSuccess') {
      process.stdout.write(`✨ Rebuilt ${event.changedAssets.size} assets in ${event.buildTime}ms!\n`);
    }
  }
});
```

## Build failure

The `buildFailure` event is emitted when a build is completes with errors. It includes a list of [`Diagnostic`](/plugin-system/logging/#Diagnostic) objects describing the errors. See [Diagnostics](/plugin-system/logging/#diagnostics) for details.

```javascript
import {Reporter} from '@parcel/plugin';

export default new Reporter({
  report({event}) {
    if (event.type === 'buildFailure') {
      process.stdout.write(`🚨 Build failed with ${event.diagnostics.length} errors.\n`);
    }
  }
});
```

## Logging

All logging in Parcel is routed through Reporter plugins. The `level` property indicates the type of each `log` event. The `info`, `warn`, `error`, and `verbose` log levels include a [`Diagnostic`](/plugin-system/logging/#Diagnostic) object, which provides detail about the context of the log. Other log levels include only a `message` property.

```javascript
import {Reporter} from '@parcel/plugin';

export default new Reporter({
  report({event}) {
    if (event.type === 'log') {
      switch (event.level) {
        case 'info':
        case 'verbose':
          process.stdout.write(`ℹ️ ${event.diagnostic.message}\n`);
          break;
        case 'warn':
          process.stdout.write(`⚠️ ${event.diagnostic.message}\n`);
          break;
        case 'error':
          process.stdout.write(`🚨 ${event.diagnostic.message}\n`);
          break;
      }
    }
  }
});
```

{% error %}

**Note**: Do not use `console.log` in Reporter plugins, especially when handling `log` events. Parcel overrides `console` methods and routes messages to Reporter plugins. This will create an infinite loop in your Reporter. Use `process.stdout`/`process.stderr` instead.

{% enderror %}

## Watcher events

The `watchStart` and `watchEnd` events are emitted when watch mode starts and ends. Unlike `buildStart` and `buildSuccess`/`buildFailure`, the watcher events are only fired once rather than for each build.

```javascript
import {Reporter} from '@parcel/plugin';

export default new Reporter({
  report({event}) {
    if (event.type === 'watchStart') {
      process.stdout.write(`Watching started\n`);
    } else if (event.type === 'watchEnd') {
      process.stdout.write(`Watching ended\n`);
    }
  }
});
```

## Relevant API

{% include "../../api/reporter.html" %}
