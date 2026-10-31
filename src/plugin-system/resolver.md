---
layout: layout.njk
eleventyNavigation:
  key: plugin-system-resolver
  title: Resolver
  order: 5
---

Resolver plugins are responsible for turning a dependency specifier into a full file path that will be processed by transformers. Resolvers run in a pipeline until one of them returns a result. See [Dependency resolution](/features/dependency-resolution/) for details on how the default resolver works.

Resolvers can be written in JavaScript, or as [native plugins](/plugin-system/native-plugins/) in Rust, Go, or Swift. Choose a language above any example to switch the examples and API names throughout the page.

## Example

This example overrides the resolution of `special-module`, and otherwise returns {% api js="null", rust="ResolveResult::None", go="parcel.ResolveResult{}", swift=".unresolved" %} to allow the next resolver in the pipeline to handle the dependency. See [Resolvers](/features/plugins/#resolvers) in the Parcel configuration docs for details on how this works.

{% codetabs %}

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

```rust
use parcel_plugin::{Dependency, Diagnostic, Options, Plugin, ResolveResult, register_plugin};

struct MyResolver;

impl Plugin for MyResolver {
  fn new(_config: &[u8]) -> Result<Self, Diagnostic> {
    Ok(MyResolver)
  }

  fn resolve(
    &self,
    _dependency: &Dependency,
    specifier: &str,
    _pipeline: Option<&str>,
    options: &Options,
  ) -> Result<ResolveResult, Diagnostic> {
    if specifier == "special-module" {
      return Ok(ResolveResult::file(
        options.project_root().join("special-module.js"),
      ));
    }

    // Let the next resolver in the pipeline handle
    // this dependency.
    Ok(ResolveResult::None)
  }
}

register_plugin!(MyResolver);
```

```go
package main

import (
	"path/filepath"

	parcel "github.com/parcel-bundler/parcel/plugin-go/v3"
)

type MyResolver struct{}

func (r *MyResolver) Resolve(dependency *parcel.Dependency, specifier, pipeline string, options *parcel.Options) (parcel.ResolveResult, error) {
	if specifier == "special-module" {
		return parcel.Resolved(filepath.Join(options.ProjectRoot(), "special-module.js"), ""), nil
	}

	// Let the next resolver in the pipeline handle
	// this dependency.
	return parcel.ResolveResult{}, nil
}

func init() {
	parcel.RegisterPlugin(func(config []byte) (any, error) {
		return &MyResolver{}, nil
	})
}

func main() {}
```

```swift
import ParcelPlugin

struct MyResolver: Resolver {
  init(config: NoConfig) {}

  func resolve(
    _ dependency: Dependency, specifier: String, pipeline: String?, options: Options
  ) async throws -> ResolveResult {
    if specifier == "special-module" {
      return .file(options.projectRoot + "/special-module.js")
    }

    // Let the next resolver in the pipeline handle
    // this dependency.
    return .unresolved
  }
}

#parcelPlugin(MyResolver.self)
```

{% endcodetabs %}

See [Native plugins](/plugin-system/native-plugins/) for how to build native plugins and use them in a project. The rest of the examples on this page omit the setup code, and only show the `resolve` method.

## Loading configuration

Configuration for a Resolver plugin is specified in the user's `.parcelrc`. JavaScript plugins receive it as the `config` option of the `resolve` method, and native plugins receive it as JSON when they are created. See [Configuration](/plugin-system/authoring-plugins/#configuration) for details, and the [Transformer](/plugin-system/transformer/#loading-configuration) docs for an example in each language.

## Virtual modules

Rather than resolving to a file on the file system, Resolvers may also return `code` directly. This allows programmatically generating virtual modules on demand. You must still return a `filePath` as well, however, as this indicates where any dependencies in the code should be resolved relative to, as well as how the source code should be processed by transformers (e.g. by file extension). Virtual modules are currently only supported in JavaScript plugins.

<!-- TODO(v3): native resolvers can't return code. The native ResolveResult only has None / Resolved { file_path, pipeline } / External / Excluded (crates/parcel-plugin/src/lib.rs, plugin-go/parcel.go ResolveResult, plugin-swift Dependency.swift ResolveResult). Same for `sideEffects` and `query`. -->

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

In addition to the specifier, Resolver plugins also receive the full [dependency](/plugin-system/transformer/#Dependency), which includes additional metadata. The specifier type, {% api js="dependency.specifierType", rust="dependency.specifier_type()", go="dependency.SpecifierType()", swift="dependency.specifierType" %}, indicates how the specifier should be interpreted (e.g. ESM, CommonJS, URL, etc.). {% api js="dependency.resolveFrom", rust="dependency.resolve_from()", go="dependency.ResolveFrom()", swift="dependency.resolveFrom" %} is the path of the file the dependency should be resolved from (e.g. if the specifier is a relative path).

If the specifier starts with a [named pipeline](/features/plugins/#named-pipelines) defined in `.parcelrc` (e.g. `url:./image.png`), the pipeline name is passed to the resolver separately, and removed from the specifier.

This example resolves relative URLs and paths depending on the specifier type.

{% codetabs %}

```javascript
import { Resolver } from "@parcel/plugin";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";

export default new Resolver({
  async resolve({ specifier, dependency }) {
    return {
      filePath:
        dependency.specifierType === "url"
          ? fileURLToPath(
              new URL(specifier, pathToFileURL(dependency.resolveFrom))
            )
          : path.resolve(path.dirname(dependency.resolveFrom), specifier),
    };
  },
});
```

```rust
impl Plugin for MyResolver {
  fn resolve(
    &self,
    dependency: &Dependency,
    specifier: &str,
    _pipeline: Option<&str>,
    _options: &Options,
  ) -> Result<ResolveResult, Diagnostic> {
    let resolve_from = dependency.resolve_from().unwrap_or_default();
    let file_path = if dependency.specifier_type() == SpecifierType::Url {
      Url::from_file_path(&resolve_from)
        .and_then(|base| base.join(specifier).map_err(|_| ()))
        .and_then(|url| url.to_file_path())
        .map_err(|_| Diagnostic::new(format!("Invalid URL: {specifier}")))?
    } else {
      resolve_from.parent().unwrap_or(Path::new("/")).join(specifier)
    };

    Ok(ResolveResult::file(file_path))
  }
}
```

```go
func (r *MyResolver) Resolve(dependency *parcel.Dependency, specifier, pipeline string, _ *parcel.Options) (parcel.ResolveResult, error) {
	resolveFrom := dependency.ResolveFrom()
	if dependency.SpecifierType() == parcel.SpecifierTypeURL {
		base := &url.URL{Scheme: "file", Path: resolveFrom}
		u, err := base.Parse(specifier)
		if err != nil {
			return parcel.ResolveResult{}, err
		}
		return parcel.Resolved(u.Path, ""), nil
	}

	return parcel.Resolved(filepath.Join(filepath.Dir(resolveFrom), specifier), ""), nil
}
```

```swift
struct MyResolver: Resolver {
  func resolve(
    _ dependency: Dependency, specifier: String, pipeline: String?, options: Options
  ) async throws -> ResolveResult {
    let base = URL(filePath: dependency.resolveFrom)
    let url =
      dependency.specifierType == .url
      ? URL(string: specifier, relativeTo: base)
      : URL(filePath: specifier, relativeTo: base.deletingLastPathComponent())

    guard let url else {
      throw Diagnostic("Invalid URL: \(specifier)")
    }
    return .file(url.standardizedFileURL.path(percentEncoded: false))
  }
}
```

{% endcodetabs %}

## Excluding modules

A resolver can indicate that a module should be excluded from the build by returning {% api js="isExcluded: true", rust="ResolveResult::Excluded", go="parcel.Excluded()", swift=".excluded" %}, or that it is external by returning {% api js="isExternal: true", rust="ResolveResult::External", go="parcel.External()", swift=".external" %}, which leaves it out of the bundle to be loaded at runtime instead. This example excludes `aws-sdk` which is included in the AWS hosting environment automatically and does not need to be bundled.

{% codetabs %}

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

```rust/10
impl Plugin for MyResolver {
  fn resolve(
    &self,
    _dependency: &Dependency,
    specifier: &str,
    _pipeline: Option<&str>,
    _options: &Options,
  ) -> Result<ResolveResult, Diagnostic> {
    if specifier == "aws-sdk" {
      return Ok(ResolveResult::Excluded);
    }

    Ok(ResolveResult::None)
  }
}
```

```go/3
func (r *MyResolver) Resolve(dependency *parcel.Dependency, specifier, pipeline string, _ *parcel.Options) (parcel.ResolveResult, error) {
	if specifier == "aws-sdk" {
		return parcel.Excluded(), nil
	}

	return parcel.ResolveResult{}, nil
}
```

```swift/6
struct MyResolver: Resolver {
  func resolve(
    _ dependency: Dependency, specifier: String, pipeline: String?, options: Options
  ) async throws -> ResolveResult {
    if specifier == "aws-sdk" {
      return .excluded
    }

    return .unresolved
  }
}
```

{% endcodetabs %}

## Cache invalidation

The results of Resolver plugins are cached by Parcel automatically. Parcel tracks the files a resolver reads during resolution, and rebuilds when they are changed or created. JavaScript plugins can read files with the `fs` module. Native plugins must read files through the `Options` object instead (see [File system](/plugin-system/native-plugins/#file-system)). See [Invalidation](/plugin-system/authoring-plugins/#invalidation) for details.

{% codetabs %}

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

```rust/10,14-16
impl Plugin for MyResolver {
  fn resolve(
    &self,
    _dependency: &Dependency,
    specifier: &str,
    _pipeline: Option<&str>,
    options: &Options,
  ) -> Result<ResolveResult, Diagnostic> {
    let alias_file = options.project_root().join("alias.json");
    if options.file_kind(&alias_file).is_empty() {
      return Ok(ResolveResult::None);
    }

    let aliases = options
      .read_to_string(&alias_file)
      .map_err(|e| Diagnostic::new(e.to_string()))?;
    let aliases: HashMap<String, PathBuf> =
      serde_json::from_str(&aliases).map_err(|e| Diagnostic::new(e.to_string()))?;
    Ok(aliases.get(specifier).map_or(ResolveResult::None, ResolveResult::file))
  }
}
```

```go/3,7
func (r *MyResolver) Resolve(dependency *parcel.Dependency, specifier, pipeline string, options *parcel.Options) (parcel.ResolveResult, error) {
	aliasFile := filepath.Join(options.ProjectRoot(), "alias.json")
	if options.FileKind(aliasFile) == 0 {
		return parcel.ResolveResult{}, nil
	}

	data, err := options.ReadFile(aliasFile)
	if err != nil {
		return parcel.ResolveResult{}, err
	}

	var aliases map[string]string
	if err := json.Unmarshal(data, &aliases); err != nil {
		return parcel.ResolveResult{}, err
	}
	if filePath, ok := aliases[specifier]; ok {
		return parcel.Resolved(filePath, ""), nil
	}
	return parcel.ResolveResult{}, nil
}
```

```swift/6,10
struct MyResolver: Resolver {
  func resolve(
    _ dependency: Dependency, specifier: String, pipeline: String?, options: Options
  ) async throws -> ResolveResult {
    let aliasFile = options.projectRoot + "/alias.json"
    guard options.fileSystem.exists(aliasFile) else {
      return .unresolved
    }

    let data = try options.fileSystem.read(aliasFile)
    let aliases = try JSONDecoder().decode([String: String].self, from: Data(data))
    if let filePath = aliases[specifier] {
      return .file(filePath)
    }
    return .unresolved
  }
}
```

{% endcodetabs %}

## Diagnostics

A Resolver plugin may encounter errors during resolution. When this happens, it can fail with an error: by throwing one in JavaScript or Swift, or returning one in Rust or Go. If a Resolver fails, the resolution process is immediately halted, and the error is shown to the user. See [Diagnostics](/plugin-system/logging/#diagnostics) for more detail.

<!-- TODO(v3): v2 resolvers could return `diagnostics` (resolution continues and they are shown only if no resolver succeeds) and `invalidateOnFileChange`/`invalidateOnFileCreate`. crates/plugin-js/src/plugin.rs ignores these ("TODO: Support diagnostics and invalidation result fields"). fs reads are tracked automatically instead (full rebuild). -->

## Side effects

JavaScript resolvers may also return a `sideEffects` property which indicates whether the asset may have side effects when executed. This usually corresponds to the same property in `package.json`, and is used for [tree shaking](/features/production/#tree-shaking). This is currently only supported in JavaScript plugins.

## Relevant API

The API reference below covers JavaScript plugins. For native plugins, see the [Rust](https://github.com/parcel-bundler/parcel/tree/v3/crates/parcel-plugin), [Go](https://github.com/parcel-bundler/parcel/tree/v3/plugin-go), and [Swift](https://github.com/parcel-bundler/parcel/tree/v3/plugin-swift) SDKs.

<!-- TODO(v3): link to the generated docs for each SDK (docs.rs, pkg.go.dev, DocC) once they are published. -->

{% include "../../api/resolver.html" %}
