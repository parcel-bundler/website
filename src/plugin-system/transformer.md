---
layout: layout.njk
eleventyNavigation:
  key: plugin-system-transformer
  title: Transformer
  order: 4
---

Transformer plugins transform a single asset to compile it, discover dependencies, or convert it to a different format. Many transformers are wrappers around other tools such as compilers and preprocessors, and are responsible for integrating them with Parcel.

Transformers can be written in JavaScript, or as [native plugins](/plugin-system/native-plugins/) in Rust, Go, or Swift. Choose a language above any example to switch the examples and API names throughout the page.

## Transforming assets

A transformer implements one method: {% api js="transform", rust="transform", go="Transform", swift="transform(_:options:)" %}. It receives an asset, which represents a file. The transformer reads the asset's content, along with any associated source map ([see below](#source-maps)), transforms it in some way, and sets the compiled result back on the asset.

{% codetabs %}

```javascript
import { Transformer } from "@parcel/plugin";

export default new Transformer({
  async transform({ asset }) {
    // Retrieve the asset's source code and source map.
    let source = asset.getCode();
    let sourceMap = asset.getMap();

    // Run it through some compiler, and set the results
    // on the asset.
    let { code, map } = compile(source, sourceMap);
    asset.setCode(code, map);
  },
});
```

```rust
use parcel_plugin::{Asset, Diagnostic, Options, Plugin, register_plugin};

struct MyTransformer;

impl Plugin for MyTransformer {
  fn new(_config: &[u8]) -> Result<Self, Diagnostic> {
    Ok(MyTransformer)
  }

  fn transform(&self, asset: &mut Asset, _options: &Options) -> Result<(), Diagnostic> {
    // Retrieve the asset's source code and source map.
    let source = asset.content()?;
    let source_map = asset.source_map();

    // Run it through some compiler, and set the results
    // on the asset.
    let (code, map) = compile(&source, source_map.as_deref());
    asset.set_content_with_map(code, map);
    Ok(())
  }
}

register_plugin!(MyTransformer);
```

```go
package main

import parcel "github.com/parcel-bundler/parcel/plugin-go/v3"

type MyTransformer struct{}

func (t *MyTransformer) Transform(asset *parcel.Asset, _ *parcel.Options) error {
	// Retrieve the asset's source code and source map.
	source, err := asset.Content()
	if err != nil {
		return err
	}
	sourceMap := asset.SourceMap()

	// Run it through some compiler, and set the results
	// on the asset.
	code, m := compile(source, sourceMap)
	asset.SetContentWithMap(code, m)
	return nil
}

func init() {
	parcel.RegisterPlugin(func(config []byte) (any, error) {
		return &MyTransformer{}, nil
	})
}

func main() {}
```

```swift
import ParcelPlugin

struct MyTransformer: Transformer {
  init(config: NoConfig) {}

  func transform(_ asset: Asset, options: Options) async throws {
    // Retrieve the asset's source code and source map.
    let source = try asset.content()
    let sourceMap = asset.sourceMap

    // Run it through some compiler, and set the results
    // on the asset.
    let (code, map) = compile(source, sourceMap)
    asset.setContent(code, sourceMap: map)
  }
}

#parcelPlugin(MyTransformer.self)
```

{% endcodetabs %}

See [Native plugins](/plugin-system/native-plugins/) for how to build native plugins and use them in a project. The rest of the examples on this page omit the setup code, and only show the `transform` method.

## Loading configuration

Configuration for a Transformer plugin is specified in the user's `.parcelrc`. JavaScript plugins receive it as the `config` option of the `transform` method, and native plugins receive it as JSON when they are created. See [Configuration](/plugin-system/authoring-plugins/#configuration) for details.

{% codetabs %}

```javascript
import { Transformer } from "@parcel/plugin";

export default new Transformer({
  async transform({ asset, config }) {
    let prefix = config?.prefix ?? "";
    asset.setCode(prefix + asset.getCode());
  },
});
```

```rust
struct MyTransformer {
  prefix: String,
}

impl Plugin for MyTransformer {
  fn new(config: &[u8]) -> Result<Self, Diagnostic> {
    // `config` is empty if none was provided.
    let prefix = if config.is_empty() {
      String::new()
    } else {
      let config: serde_json::Value =
        serde_json::from_slice(config).map_err(|e| Diagnostic::new(e.to_string()))?;
      config["prefix"].as_str().unwrap_or_default().to_owned()
    };

    Ok(MyTransformer { prefix })
  }

  fn transform(&self, asset: &mut Asset, _options: &Options) -> Result<(), Diagnostic> {
    asset.set_content(format!("{}{}", self.prefix, asset.content()?));
    Ok(())
  }
}
```

```go
type MyTransformer struct {
	Prefix string `json:"prefix"`
}

func (t *MyTransformer) Transform(asset *parcel.Asset, _ *parcel.Options) error {
	content, err := asset.Content()
	if err != nil {
		return err
	}
	asset.SetContent(t.Prefix + content)
	return nil
}

func init() {
	parcel.RegisterPlugin(func(config []byte) (any, error) {
		t := &MyTransformer{}
		// `config` is empty if none was provided.
		if len(config) > 0 {
			if err := json.Unmarshal(config, t); err != nil {
				return nil, err
			}
		}
		return t, nil
	})
}
```

```swift
struct MyTransformer: Transformer {
  // Decoded from the plugin's config using JSONDecoder.
  struct Config: Decodable {
    var prefix: String?
  }

  let prefix: String

  init(config: Config) {
    prefix = config.prefix ?? ""
  }

  func transform(_ asset: Asset, options: Options) async throws {
    asset.setContent(prefix + (try asset.content()))
  }
}
```

{% endcodetabs %}

{% note %}

**Note**: Parcel rebuilds an asset when a file its transformer read changes. Files that JavaScript plugins read with the `fs` module (e.g. a config file loaded by the compiler it wraps) are tracked automatically. Native plugins must read files through the `Options` object instead (see [File system](/plugin-system/native-plugins/#file-system)). Use {% api js="resolve()", rust="asset.resolve()", go="asset.Resolve()", swift="asset.resolve(_:from:)" %} to resolve other files the same way Parcel resolves dependencies. See [Invalidation](/plugin-system/authoring-plugins/#invalidation) for details.

{% endnote %}

## Changing the asset type

Transformers may transform an asset from one format to another, for example from TypeScript to JavaScript. To do this, set the asset's type to the new file type (e.g. `js`) with {% api js="asset.type", rust="asset.set_type()", go="asset.SetType()", swift="asset.type" %}. The asset will then be processed by the pipeline matching the new type. See [Transformers](/features/plugins/#transformers) in the Parcel configuration docs for details.

{% codetabs %}

```javascript/8
import {Transformer} from '@parcel/plugin';

export default new Transformer({
  async transform({asset}) {
    let code = asset.getCode();

    let result = compile(code);
    asset.type = 'js';
    asset.setCode(result);
  }
});
```

```rust/6
impl Plugin for MyTransformer {
  fn transform(&self, asset: &mut Asset, _options: &Options) -> Result<(), Diagnostic> {
    let code = asset.content()?;

    let result = compile(&code);
    asset.set_type("js");
    asset.set_content(result);
    Ok(())
  }
}
```

```go/8
func (t *MyTransformer) Transform(asset *parcel.Asset, _ *parcel.Options) error {
	code, err := asset.Content()
	if err != nil {
		return err
	}

	result := compile(code)
	asset.SetType("js")
	asset.SetContent(result)
	return nil
}
```

```swift/6
struct MyTransformer: Transformer {
  func transform(_ asset: Asset, options: Options) async throws {
    let code = try asset.content()

    let result = compile(code)
    asset.type = "js"
    asset.setContent(result)
  }
}
```

{% endcodetabs %}

## The environment

Assets are associated with a target, available as {% api js="asset.target", rust="asset.target()", go="asset.Target()", swift="asset.target" %}, which describes the environment the asset should be compiled for. The same asset may be processed multiple times with different targets, for example, when building for both browsers and Node. If possible, Transformer plugins should take the target into account when compiling code to ensure that the result works in and is optimized for the target. See [Targets](/features/targets/) for details.

{% codetabs %}

```javascript/6-8
import {Transformer} from '@parcel/plugin';

export default new Transformer({
  async transform({asset}) {
    let code = asset.getCode();

    let result = asset.target.isBrowser()
      ? compileForBrowser(code, asset.target.engines.browsers)
      : compileForNode(code, asset.target.engines.node);

    asset.setCode(result);
  }
});
```

```rust/5-9
impl Plugin for MyTransformer {
  fn transform(&self, asset: &mut Asset, _options: &Options) -> Result<(), Diagnostic> {
    let code = asset.content()?;

    let target = asset.target();
    let result = match target.environment() {
      Environment::Node => compile_for_node(&code, target.engines().node),
      _ => compile_for_browser(&code, target.engines().browsers),
    };

    asset.set_content(result);
    Ok(())
  }
}
```

```go/7-13
func (t *MyTransformer) Transform(asset *parcel.Asset, _ *parcel.Options) error {
	code, err := asset.Content()
	if err != nil {
		return err
	}

	target := asset.Target()
	var result string
	if target.Environment() == parcel.EnvironmentNode {
		result = compileForNode(code, target.Engines().Node)
	} else {
		result = compileForBrowser(code, target.Engines().Browsers)
	}

	asset.SetContent(result)
	return nil
}
```

```swift/5-8
struct MyTransformer: Transformer {
  func transform(_ asset: Asset, options: Options) async throws {
    let code = try asset.content()

    let target = asset.target
    let result = target.environment == .node
      ? compileForNode(code, target.engines.node)
      : compileForBrowser(code, target.engines.browsers)

    asset.setContent(result)
  }
}
```

{% endcodetabs %}

In JavaScript, see the [`Target`](/plugin-system/api/#Target) API docs for details on the available properties. In native plugins, the target provides the environment, output format, source type, engines, public URL, and dist directory. JavaScript plugins receive the target's browsers as a [browserslist](https://github.com/browserslist/browserslist) query, while native plugins receive the minimum version of each browser that the query resolves to.

## Adding dependencies

In addition to transforming the contents of an asset, Transformer plugins are also responsible for discovering dependencies in the code so that they may also be processed by Parcel. Some transformers don’t need to worry about this, because another transformer will run afterward and do it (e.g. the default JavaScript transformer). If you’re adding support for a new language that doesn’t compile to one of the existing languages supported by Parcel, or otherwise introduces dependencies outside the compiled code, you’ll need to add them to the asset.

Dependencies can be added to an asset using {% api js="asset.addDependency()", rust="asset.add_dependency()", go="asset.AddDependency()", swift="asset.addDependency()" %}. The only required option is the specifier, which is a string describing the location of the dependency. The specifier type describes how the specifier should be interpreted, and defaults to ESM. See [Dependency resolution](/features/dependency-resolution/) for details.

{% codetabs %}

```javascript/8-11
import {Transformer} from '@parcel/plugin';

export default new Transformer({
  async transform({asset}) {
    let code = asset.getCode();
    let deps = code.matchAll(/import "(.*?)"/g);

    for (let [, specifier] of deps) {
      asset.addDependency({
        specifier,
        specifierType: 'esm'
      });
    }
  }
});
```

```rust/7-9
impl Plugin for MyTransformer {
  fn transform(&self, asset: &mut Asset, _options: &Options) -> Result<(), Diagnostic> {
    let code = asset.content()?;
    let deps = Regex::new(r#"import "(.*?)""#).unwrap();

    for (_, [specifier]) in deps.captures_iter(&code).map(|c| c.extract()) {
      asset.add_dependency(
        DependencyOptions::new(specifier).specifier_type(SpecifierType::Esm),
      )?;
    }
    Ok(())
  }
}
```

```go/10-13
var deps = regexp.MustCompile(`import "(.*?)"`)

func (t *MyTransformer) Transform(asset *parcel.Asset, _ *parcel.Options) error {
	code, err := asset.Content()
	if err != nil {
		return err
	}

	for _, match := range deps.FindAllStringSubmatch(code, -1) {
		err := asset.AddDependency(parcel.DependencyOptions{
			Specifier:     match[1],
			SpecifierType: parcel.SpecifierTypeESM,
		})
		if err != nil {
			return err
		}
	}
	return nil
}
```

```swift/6
struct MyTransformer: Transformer {
  func transform(_ asset: Asset, options: Options) async throws {
    let code = try asset.content()

    for match in code.matches(of: /import "(.*?)"/) {
      try asset.addDependency(String(match.1), specifierType: .esm)
    }
  }
}
```

{% endcodetabs %}

### Influencing bundling

The way a dependency is specified can influence how it is bundled. By default, dependencies are bundled together into the same output file. The priority of a dependency can specify that it should be loaded lazily or in parallel with the asset that depends on it. For example, dynamic `import()` in JavaScript loads dependencies with lazy priority. See [Code splitting](/features/code-splitting/).

The bundle behavior further controls how a dependency is bundled. For example, dependencies may be separated into a new bundle but inlined into the parent by setting the bundle behavior to inline. See [Bundle inlining](/features/bundle-inlining/).

See [`DependencyOptions`](#DependencyOptions) for more details on each of the available options.

### URL dependencies

In some languages, dependencies reference other files by URL. In the compiled code, these URL references will need to be updated to point to the final bundle names. However, when an asset is being transformed, bundle names will not yet be known. Placeholders solve this, but they are currently only supported in JavaScript plugins.

`addDependency` returns a unique placeholder string for the dependency. This can be placed in the transformed asset content as a placeholder for the final bundle URL, and it will be replaced later during packaging once the URL is known.

As a shortcut, the `addURLDependency` method creates a dependency with `specifierType` and `importType` set to `url`, and `priority` set to `lazy` (to create a separate bundle).

<!-- TODO(v3): native `add_dependency` returns nothing, so native transformers have no way to get a placeholder for a URL dependency. -->

<!-- TODO(v3): placeholders are not replaced when the asset is later processed by another transformer that re-parses the code. E.g. a transformer that sets `asset.type = 'js'` and emits `import "<placeholder>"` fails with "Failed to resolve '<placeholder>'": the JS transformer collects the placeholder as a new dependency rather than matching it to the one added with addURLDependency. Tested with target/release/parcel. Only content packaged without re-parsing (or native custom content) can use placeholders today. -->

```javascript/10-11
import {Transformer} from '@parcel/plugin';

export default new Transformer({
  async transform({asset}) {
    let code = asset.getCode();
    let result = code.replace(/import "(.*?)"/g, (m, dep) => {
      // Replace the original specifier with a placeholder.
      // This will be replaced later with the final
      // bundle URL.
      let placeholder = asset.addURLDependency(dep);
      return `import "${placeholder}"`;
    });

    asset.setCode(result);
  }
});
```

## Source maps

Source maps help developers when debugging compiled and bundled code in the browser by mapping locations in the compiled code back to the original source code. Transformer plugins should add a source map to assets when transforming their content if possible. Since assets may be processed by multiple Transformers, you should also transform the existing source map included with the asset in addition to its content.

Source maps are passed to and from plugins as JSON in the standard [source map format](https://tc39.es/ecma426/) (version 3), so they can usually be passed to and from other tools directly. JavaScript plugins receive them as plain objects, and native plugins as JSON strings. {% api js="asset.getMap()", rust="asset.source_map()", go="asset.SourceMap()", swift="asset.sourceMap" %} returns the asset's current source map, or nothing if it doesn't have one, and {% api js="asset.setCode(code, map)", rust="asset.set_content_with_map()", go="asset.SetContentWithMap()", swift="asset.setContent(_:sourceMap:)" %} sets new content along with a source map. See [Source Maps](/plugin-system/source-maps/) for more details.

{% codetabs %}

```javascript
import { Transformer } from "@parcel/plugin";

export default new Transformer({
  async transform({ asset }) {
    let source = asset.getCode();
    let sourceMap = asset.getMap();

    // Pass the input source map to the compiler, and set
    // the returned source map on the asset.
    let result = compile(source, sourceMap);
    asset.setCode(result.code, result.map);
  },
});
```

```rust
impl Plugin for MyTransformer {
  fn transform(&self, asset: &mut Asset, _options: &Options) -> Result<(), Diagnostic> {
    let source = asset.content()?;
    let source_map = asset.source_map();

    // Pass the input source map to the compiler, and set
    // the returned source map on the asset.
    let result = compile(&source, source_map.as_deref());
    asset.set_content_with_map(result.code, result.map);
    Ok(())
  }
}
```

```go
func (t *MyTransformer) Transform(asset *parcel.Asset, _ *parcel.Options) error {
	source, err := asset.Content()
	if err != nil {
		return err
	}
	sourceMap := asset.SourceMap()

	// Pass the input source map to the compiler, and set
	// the returned source map on the asset.
	result := compile(source, sourceMap)
	asset.SetContentWithMap(result.Code, result.Map)
	return nil
}
```

```swift
struct MyTransformer: Transformer {
  func transform(_ asset: Asset, options: Options) async throws {
    let source = try asset.content()
    let sourceMap = asset.sourceMap

    // Pass the input source map to the compiler, and set
    // the returned source map on the asset.
    let result = compile(source, sourceMap)
    asset.setContent(result.code, sourceMap: result.map)
  }
}
```

{% endcodetabs %}

## Binary data

In addition to textual source code, Transformers can handle binary content. {% api js="asset.getBuffer()", rust="asset.content_bytes()", go="asset.ContentBytes()", swift="asset.contentBytes()" %} returns the contents of the asset as bytes, and {% api js="asset.setBuffer()", rust="asset.set_content_bytes()", go="asset.SetContentBytes()", swift="asset.setContent(_:)" %} replaces them. In JavaScript, bytes are represented as a [Uint8Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) (or a [Buffer](https://nodejs.org/api/buffer.html)).

{% codetabs %}

```javascript/4,7
import {Transformer} from '@parcel/plugin';

export default new Transformer({
  async transform({asset}) {
    let buffer = asset.getBuffer();

    let result = transform(buffer);
    asset.setBuffer(result);
  }
});
```

```rust/3,6
impl Plugin for MyTransformer {
  fn transform(&self, asset: &mut Asset, _options: &Options) -> Result<(), Diagnostic> {
    let buffer = asset.content_bytes()?;

    let result = transform(&buffer);
    asset.set_content_bytes(&result);
    Ok(())
  }
}
```

```go/2,8
func (t *MyTransformer) Transform(asset *parcel.Asset, _ *parcel.Options) error {
	buffer, err := asset.ContentBytes()
	if err != nil {
		return err
	}

	result := transform(buffer)
	asset.SetContentBytes(result)
	return nil
}
```

```swift/3,6
struct MyTransformer: Transformer {
  func transform(_ asset: Asset, options: Options) async throws {
    let buffer = try asset.contentBytes()

    let result = transform(buffer)
    asset.setContent(result)
  }
}
```

{% endcodetabs %}

## Query parameters

An asset may be referenced by a dependency with [query parameters](/features/dependency-resolution/#query-parameters). These specify options for the transformer to use when compiling or transforming the asset. For example, the Parcel [image transformer](/recipes/image/) uses query parameters to allow users to specify the width, height, and format to convert images to. The same asset may be compiled multiple times with different query parameters. Read the query from {% api js="asset.url", rust="asset.query()", go="asset.Query()", swift="asset.query" %}. In JavaScript, it is part of the asset's URL. Native plugins receive it as a string, without the leading `?`.

{% codetabs %}

```javascript/5,11-12
import {Transformer} from '@parcel/plugin';

export default new Transformer({
  async transform({asset}) {
    let query = new URL(asset.url).searchParams;
    let buffer = asset.getBuffer();

    let result = resize(
      buffer,
      query.get('width'),
      query.get('height')
    );

    asset.setBuffer(result);
  }
});
```

```rust/3,8-9
impl Plugin for MyTransformer {
  fn transform(&self, asset: &mut Asset, _options: &Options) -> Result<(), Diagnostic> {
    let query: HashMap<_, _> = form_urlencoded::parse(asset.query().as_bytes()).collect();
    let buffer = asset.content_bytes()?;

    let result = resize(
      &buffer,
      query.get("width"),
      query.get("height"),
    );

    asset.set_content_bytes(&result);
    Ok(())
  }
}
```

```go/2,13-14
func (t *MyTransformer) Transform(asset *parcel.Asset, _ *parcel.Options) error {
	query, err := url.ParseQuery(asset.Query())
	if err != nil {
		return err
	}
	buffer, err := asset.ContentBytes()
	if err != nil {
		return err
	}

	result := resize(
		buffer,
		query.Get("width"),
		query.Get("height"),
	)

	asset.SetContentBytes(result)
	return nil
}
```

```swift/3,8-9
struct MyTransformer: Transformer {
  func transform(_ asset: Asset, options: Options) async throws {
    let query = URLComponents(string: "?" + asset.query)?.queryItems ?? []
    let buffer = try asset.contentBytes()

    let result = resize(
      buffer,
      width: query.first { $0.name == "width" }?.value,
      height: query.first { $0.name == "height" }?.value
    )

    asset.setContent(result)
  }
}
```

{% endcodetabs %}

## Custom content

Normally, an asset's content is a string or bytes. [Native](/plugin-system/native-plugins/) transformers can also store a custom value as the content of an asset, e.g. an AST, using {% api rust="asset.set_custom_content()", go="asset.SetCustomContent()", swift="asset.setCustomContent(_:)" %}. This avoids converting the value back to code after each transformer, and lets the plugin control how the asset is packaged into a bundle. Custom content is not supported in JavaScript plugins.

The value must implement `AssetContent`, which has:

- A stable type id, unique to the plugin. Parcel uses it to group assets when packaging, and includes it in bundle ids, so it must not change between builds. In Go, the id is derived from the name of the type, or from its `ContentTypeName` method if it has one.
- A {% api rust="read", go="Read", swift="read()" %} method, which returns the content as a string or bytes when Parcel or another plugin needs it before packaging.
- A {% api rust="package", go="Package", swift="package(_:in:options:)" %} method, which is called to produce the final contents of a bundle that contains the asset. It receives the bundle graph and the bundle, so it can find the other assets in the bundle and the bundles they reference.

{% codetabs %}

```rust
use parcel_plugin::{AssetContent, Bundle, BundleGraph, ContentBuffer, Diagnostic, Options};

struct MyContent {
  ast: Ast,
}

impl AssetContent for MyContent {
  const TYPE_ID: [u8; 16] = parcel_plugin::type_id!("MyContent");

  fn read(&self) -> Result<ContentBuffer, Diagnostic> {
    Ok(ContentBuffer::String(self.ast.to_code()))
  }

  fn package(
    &self,
    bundle_graph: &BundleGraph,
    bundle: &Bundle,
    _options: &Options,
  ) -> Result<ContentBuffer, Diagnostic> {
    // Generate the final code, e.g. using the bundle graph
    // to find the bundles it references.
    Ok(ContentBuffer::String(self.ast.generate(bundle_graph, bundle)))
  }
}

impl Plugin for MyTransformer {
  fn transform(&self, asset: &mut Asset, _options: &Options) -> Result<(), Diagnostic> {
    let ast = parse(&asset.content()?);
    asset.set_custom_content(MyContent { ast });
    Ok(())
  }
}
```

```go
type MyContent struct {
	AST *AST
}

func (c *MyContent) Read() (parcel.Content, error) {
	return parcel.StringContent(c.AST.ToCode()), nil
}

func (c *MyContent) Package(bundleGraph *parcel.BundleGraph, bundle *parcel.Bundle, _ *parcel.Options) (parcel.Content, error) {
	// Generate the final code, e.g. using the bundle graph
	// to find the bundles it references.
	return parcel.StringContent(c.AST.Generate(bundleGraph, bundle)), nil
}

func (t *MyTransformer) Transform(asset *parcel.Asset, _ *parcel.Options) error {
	content, err := asset.Content()
	if err != nil {
		return err
	}
	asset.SetCustomContent(&MyContent{AST: parse(content)})
	return nil
}
```

```swift
struct MyContent: AssetContent {
  static let contentTypeID = ContentTypeID("MyContent")

  var ast: AST

  func read() async throws -> Content {
    .string(ast.toCode())
  }

  func package(_ bundle: OutputBundle, in bundleGraph: BundleGraph, options: Options) async throws
    -> Content
  {
    // Generate the final code, e.g. using the bundle graph
    // to find the bundles it references.
    .string(ast.generate(bundleGraph, bundle))
  }
}

struct MyTransformer: Transformer {
  func transform(_ asset: Asset, options: Options) async throws {
    asset.setCustomContent(MyContent(ast: parse(try asset.content())))
  }
}
```

{% endcodetabs %}

Later transformers, and the {% api rust="package", go="Package", swift="package(_:in:options:)" %} method of other assets in the bundle graph, can access the value with {% api rust="custom_content::<T>()", go="CustomContent()", swift="customContent(as:)" %}. Reading the asset's content as a string or bytes calls {% api rust="read", go="Read", swift="read()" %} instead.

See the custom content example for [Rust](https://github.com/parcel-bundler/parcel/tree/v3/plugin-rs/examples/custom-content-transformer), [Go](https://github.com/parcel-bundler/parcel/tree/v3/plugin-go/examples/custom-content-transformer), or [Swift](https://github.com/parcel-bundler/parcel/tree/v3/plugin-swift/Examples/Sources/CustomContentTransformer) for more details.

<!-- TODO(v3): confirm how bundles containing custom content are packaged when the bundle contains multiple assets (packaging uses the content of the bundle's first asset, crates/core/src/packaging.rs packaging_plan). -->

## Relevant API

The API reference below covers JavaScript plugins. For native plugins, see the [Rust](https://github.com/parcel-bundler/parcel/tree/v3/crates/parcel-plugin), [Go](https://github.com/parcel-bundler/parcel/tree/v3/plugin-go), and [Swift](https://github.com/parcel-bundler/parcel/tree/v3/plugin-swift) SDKs.

<!-- TODO(v3): link to the generated docs for each SDK (docs.rs, pkg.go.dev, DocC) once they are published. -->

{% include "../../api/transformer.html" %}
