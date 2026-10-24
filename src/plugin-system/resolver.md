---
layout: layout.njk
eleventyNavigation:
  key: plugin-system-resolver
  title: Resolver
  order: 5
---

Resolver plugins are responsible for turning a dependency specifier into a full file path that will be processed by transformers. Resolvers run in a pipeline until one of them returns a result. See [Dependency resolution](/features/dependency-resolution/) for details on how the default resolver works.

## Example

This example overrides the resolution of `special-module`, and otherwise returns `null` to allow the next resolver in the pipeline to handle the dependency. See [Resolvers](/features/plugins/#resolvers) in the Parcel configuration docs for details on how this works.

```javascript
import { Resolver } from "@parcel/plugin";
import path from "path";

export default new Resolver({
  async resolve({ specifier }) {
    if (specifier === "special-module") {
      return {
        filePath: path.join(__dirname, "special-module.js"),
      };
    }

    // Let the next resolver in the pipeline handle
    // this dependency.
    return null;
  },
});
```

## Loading configuration

Configuration for a Resolver plugin is specified in the user's `.parcelrc`, and passed to the `resolve` method as the `config` option. See [Configuration](/plugin-system/authoring-plugins/#configuration) for details.

## Virtual modules

Rather than resolving to a file on the file system, Resolvers may also return `code` directly. This allows programmatically generating virtual modules on demand. You must still return a `filePath` as well, however, as this indicates where any dependencies in the code should be resolved relative to, as well as how the source code should be processed by transformers (e.g. by file extension).

```javascript/8
import {Resolver} from '@parcel/plugin';
import path from 'path';

export default new Resolver({
  async resolve({specifier}) {
    if (specifier === 'special-module') {
      return {
        filePath: path.join(__dirname, 'special-module.js'),
        code: 'export default "This is a special module!";'
      };
    }

    return null;
  }
});
```

## Dependency metadata

In addition to the `specifier`, Resolver plugins also receive a full [`Dependency`](/plugin-system/transformer/#Dependency) object, which includes additional metadata about the dependency. The `specifierType` property indicates how the `specifier` should be interpreted (e.g. ESM, CommonJS, URL, etc.). The `resolveFrom` property specifies the URL of the file where the dependency should be resolved from (e.g. if the specifier is a relative path). Files on disk use `file:` URLs.

If the specifier starts with a [named pipeline](/features/plugins/#named-pipelines) defined in `.parcelrc` (e.g. `url:./image.png`), the pipeline name is passed as the `pipeline` option, and removed from the `specifier`.

This example resolves relative URLs and paths depending on the `specifierType`.

```javascript
import { Resolver } from "@parcel/plugin";
import path from "path";
import { fileURLToPath } from "url";

export default new Resolver({
  async resolve({ specifier, dependency }) {
    return {
      filePath:
        dependency.specifierType === "url"
          ? fileURLToPath(new URL(specifier, dependency.resolveFrom))
          : path.resolve(
              path.dirname(fileURLToPath(dependency.resolveFrom)),
              specifier
            ),
    };
  },
});
```

## Excluding modules

The `isExcluded` property can be returned to indicate that a module should be excluded from the build. This example excludes `aws-sdk` which is included in the AWS hosting environment automatically and does not need to be bundled.

```javascript/5
import {Resolver} from '@parcel/plugin';

export default new Resolver({
  async resolve({specifier}) {
    if (specifier === 'aws-sdk') {
      return {isExcluded: true};
    }

    return null;
  }
});
```

## Cache invalidation

The results of Resolver plugins are cached by Parcel automatically. If you read any files from the file system during resolution using the `fs` module, Parcel tracks them, and rebuilds when they are changed or created. See [Invalidation](/plugin-system/authoring-plugins/#invalidation) for details.

```javascript/8,12
import {Resolver} from '@parcel/plugin';
import fs from 'fs';
import path from 'path';

export default new Resolver({
  async resolve({specifier, options}) {
    let aliasFile = path.join(options.projectRoot, 'alias.json');
    if (!fs.existsSync(aliasFile)) {
      return null;
    }

    let aliases = JSON.parse(fs.readFileSync(aliasFile, 'utf8'));
    return {
      filePath: aliases[specifier] || null
    };
  }
});
```

## Diagnostics

A Resolver plugin may encounter errors during resolution. When this happens, it may `throw` an error. If a Resolver throws, the resolution process is immediately halted, and the error is shown to the user. See [Diagnostics](/plugin-system/logging/#diagnostics) for more detail.

<!-- TODO(v3): v2 resolvers could return `diagnostics` (resolution continues and they are shown only if no resolver succeeds) and `invalidateOnFileChange`/`invalidateOnFileCreate`. crates/plugin-js/src/plugin.rs ignores these ("TODO: Support diagnostics and invalidation result fields"). fs reads are tracked automatically instead (full rebuild). -->

## Side effects

Resolvers may also return a `sideEffects` property which indicates whether the asset may have side effects when executed. This usually corresponds to the same property in `package.json`, and is used for [tree shaking](/features/production/#tree-shaking).

## Native resolvers

Resolvers can also be written as [native plugins](/plugin-system/native-plugins/). With the Rust SDK, implement the `resolve` method of the `Plugin` trait, and return `ResolveResult::None` to let the next resolver in the pipeline handle the dependency.

```rust
use parcel_plugin::{register_plugin, Dependency, Diagnostic, Options, Plugin, ResolveResult};
use std::path::Path;

struct MyResolver;

impl Plugin for MyResolver {
  fn new(_config: &[u8]) -> Result<Self, Diagnostic> {
    Ok(MyResolver)
  }

  fn resolve(
    &self,
    dep: &Dependency,
    specifier: &str,
    _pipeline: Option<&str>,
    _options: &Options,
  ) -> Result<ResolveResult, Diagnostic> {
    if specifier != "special-module" {
      return Ok(ResolveResult::None);
    }

    let resolve_from = dep.resolve_from();
    let dir = Path::new(&resolve_from).parent().unwrap_or(Path::new("."));
    Ok(ResolveResult::Resolved {
      file_path: dir.join("special-module.js"),
      pipeline: None,
    })
  }
}

register_plugin!(MyResolver);
```

Native resolvers may also return `ResolveResult::Excluded` to exclude a module from the build, or `ResolveResult::External` to leave it unbundled.

## Relevant API

{% include "../../api/resolver.html" %}
