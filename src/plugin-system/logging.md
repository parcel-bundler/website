---
layout: layout.njk
eleventyNavigation:
  key: plugin-system-logger
  title: Diagnostics and Logging
  order: 15
---

Parcel includes support for rich diagnostics that are used to describe errors and warnings in a format-agnostic way. It also includes a built in logging system that allows Reporter plugins to handle all logs and errors and present them to the user.

Diagnostics and logging work in both JavaScript and [native plugins](/plugin-system/native-plugins/). Choose a language above any example to switch the examples and API names throughout the page.

## Diagnostics

A diagnostic is a set of properties that are required to create a useful log message. This can be anything from a verbose message to a warning or error. Diagnostics can include a message, information about the file being processed, a code frame, hints on how to potentially resolve the issue, and a link to documentation to learn more.

```typescript
type Diagnostic = {
  message: string;
  origin: string | null;
  codeFrames: Array<{
    code: string | null;
    url: string | null;
    language: string | null;
    codeHighlights: Array<{
      start: { line: number; column: number };
      end: { line: number; column: number };
      message: string | null;
    }>;
  }>;
  hints: Array<string>;
  severity: "error" | "warning" | "sourceError" | "info";
  documentationURL: string | null;
};
```

Line and column numbers are 1-based. The `url` of a code frame is a `file:` URL for files on disk. [Reporter](/plugin-system/reporter/) plugins receive diagnostics in this format, and have complete freedom over how they are formatted and displayed.

### Throwing errors

When an error is thrown (or a promise is rejected) within a JavaScript plugin, the build fails, and Parcel converts the error into a diagnostic. The error's `message` becomes the message of the diagnostic. Native plugins fail by returning an error in Rust and Go, or throwing one in Swift. In Go and Swift, errors other than diagnostics are converted using their message as well.

```js
throw new Error("An error occurred");
```

To attach context about the error, use a `Diagnostic`. In JavaScript, the [`Diagnostic`](/plugin-system/api/#Diagnostic) class exported by `@parcel/plugin` extends the `Error` object, and accepts the properties described above, all of which are optional except for `message` (see [`DiagnosticOptions`](/plugin-system/api/#DiagnosticOptions)). Each native SDK has its own `Diagnostic` type. Parcel will automatically attach your plugin name, as written in `.parcelrc`, as the origin of the diagnostic.

{% codetabs %}

```js
import { Diagnostic } from "@parcel/plugin";

throw new Diagnostic({
  message: "An error occurred",
});
```

```rust
return Err(Diagnostic::new("An error occurred"));
```

```go
return &parcel.Diagnostic{Message: "An error occurred"}
```

```swift
throw Diagnostic("An error occurred")
```

{% endcodetabs %}

In JavaScript, you can also throw multiple diagnostics at once by passing an array to the `Diagnostic` constructor.

### Code frames

A diagnostic can have one or more code frames attached, which give context about where in a file an error occurred. A code frame includes an absolute file path along with one or more code highlights. Code highlights are defined by the line and column position within the file, and may also have a message to be displayed at that position. The `end` position is inclusive, and defaults to the `start` position if omitted.

Code frames should also include the source code for the file the error occurred in. If omitted, Parcel will read the file from the file system. However, in many cases the input source code may have come from another plugin that ran before, so the code will have been modified in some way. Including the code in the code frame avoids this issue.

Diagnostics created by native plugins can include one code frame with a single highlight. Parcel reads the code for it from the file system.

{% codetabs %}

```js
throw new Diagnostic({
  message: `Could not parse ${asset.filePath}`,
  codeFrames: [
    {
      filePath: asset.filePath,
      code: asset.getCode(),
      codeHighlights: [
        {
          start: {
            line: 1,
            column: 5,
          },
          end: {
            line: 2,
            column: 3,
          },
          message: "Expected a string but got a number",
        },
      ],
    },
  ],
});
```

```rust
return Err(
  Diagnostic::new(format!("Could not parse {}", asset.file_path().display()))
    .with_file(asset.file_path())
    .at(1, 5)
    .to(2, 3)
    .with_highlight_message("Expected a string but got a number"),
);
```

```go
return &parcel.Diagnostic{
	Message:          fmt.Sprintf("Could not parse %s", asset.FilePath()),
	FilePath:         asset.FilePath(),
	Line:             1,
	Column:           5,
	EndLine:          2,
	EndColumn:        3,
	HighlightMessage: "Expected a string but got a number",
}
```

```swift
throw Diagnostic(
  "Could not parse \(asset.filePath)",
  filePath: asset.filePath,
  line: 1,
  column: 5,
  endLine: 2,
  endColumn: 3,
  highlightMessage: "Expected a string but got a number"
)
```

{% endcodetabs %}

When a regular `Error` is thrown by a JavaScript plugin, Parcel can also display a code frame. If the error thrown by your plugin has `filename` (or `fileName`), `line`, and `column` properties, Parcel uses them to display a code frame pointing at that location. Otherwise, the location is taken from the top frame of the error's stack. Line and column numbers are 1-based. Many compilers already attach these properties to the errors they throw, so they can often be rethrown as is.

```js
let error = new Error("Expected a string but got a number");
error.fileName = asset.filePath;
error.line = 1;
error.column = 5;
throw error;
```

In this case, Parcel reads the source code for the code frame from the file system.

### Hints

Diagnostics can also include hints about how to fix a problem, and a link to documentation for users to learn more. JavaScript diagnostics can include multiple hints, and native diagnostics can include one.

{% codetabs %}

```js
throw new Diagnostic({
  message: "Could not find a config file",
  hints: ["Create a tool.config.json file in the project root."],
  documentationURL: "http://example.com/",
});
```

```rust
return Err(
  Diagnostic::new("Could not find a config file")
    .with_hint("Create a tool.config.json file in the project root.")
    .with_documentation_url("http://example.com/"),
);
```

```go
return &parcel.Diagnostic{
	Message:          "Could not find a config file",
	Hint:             "Create a tool.config.json file in the project root.",
	DocumentationURL: "http://example.com/",
}
```

```swift
throw Diagnostic(
  "Could not find a config file",
  hint: "Create a tool.config.json file in the project root.",
  documentationURL: "http://example.com/"
)
```

{% endcodetabs %}

## Logger

JavaScript plugins log messages using the standard `console` methods. Parcel collects these messages and sends them to [Reporter](/plugin-system/reporter/) plugins, which decide how to display them. When `console` methods are called with anything other than a single string or [diagnostics](#diagnostics), each argument is formatted using `util.inspect`. Native plugins log messages using {% api rust="options.log()", go="options.Log()", swift="options.log(_:level:)" %}, passing a log level.

These log levels specify the severity of log messages, which is useful for formatting and filtering. For example, the [`--log-level`](/features/cli/#parameters) CLI option can be used to choose which messages you want to see.

{% note %}

**Note**: When watching or using the dev server, Parcel only re-runs plugins for the assets affected by a change. This means any logs or warnings that a plugin emits will only be shown when the plugin actually runs, and not on every rebuild.

{% endnote %}

### Log levels

| Level   | When to use                                                                                                                              | API                                                                                                   |
| ------- | ---------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| verbose | Use this when you want to log anything that can be used for debugging issues, while not being particularly interesting for normal usage. | {% api js="console.debug(...)", rust="LogLevel::Verbose", go="parcel.LogVerbose", swift=".verbose" %} |
| info    | Use this to log any information that is not related to a problem.                                                                        | {% api js="console.info(...)", rust="LogLevel::Info", go="parcel.LogInfo", swift=".info" %}           |
| warning | Use this to log anything related to a problem that is not critical.                                                                      | {% api js="console.warn(...)", rust="LogLevel::Warn", go="parcel.LogWarn", swift=".warn" %}           |
| error   | Use this to log any critical issues. You may want to throw an error instead to cause the build to fail.                                  | {% api js="console.error(...)", rust="LogLevel::Error", go="parcel.LogError", swift=".error" %}       |

In JavaScript, `console.log(...)` also logs at the info level.

### How to log a message

This example shows how to log a warning from a transformer.

{% codetabs %}

```js
import { Transformer } from "@parcel/plugin";

export default new Transformer({
  async transform({ asset }) {
    // ...

    console.warn(
      `${asset.filePath} uses a deprecated feature. Please use this other feature instead.`
    );
  },
});
```

```rust
impl Plugin for MyTransformer {
  fn transform(&self, asset: &mut Asset, options: &Options) -> Result<(), Diagnostic> {
    // ...

    options.log(
      LogLevel::Warn,
      format!(
        "{} uses a deprecated feature. Please use this other feature instead.",
        asset.file_path().display()
      ),
    );
    Ok(())
  }
}
```

```go
func (t *MyTransformer) Transform(asset *parcel.Asset, options *parcel.Options) error {
	// ...

	options.Log(parcel.LogWarn, fmt.Sprintf(
		"%s uses a deprecated feature. Please use this other feature instead.",
		asset.FilePath(),
	))
	return nil
}
```

```swift
struct MyTransformer: Transformer {
  func transform(_ asset: Asset, options: Options) async throws {
    // ...

    options.log(
      "\(asset.filePath) uses a deprecated feature. Please use this other feature instead.",
      level: .warn
    )
  }
}
```

{% endcodetabs %}

To log a message with a code frame, hints, or a documentation URL, log a diagnostic using {% api js="console.warn()", rust="options.log_diagnostic()", go="options.LogDiagnostic()", swift="options.log(_:)" %}. In JavaScript, a [`Diagnostic`](/plugin-system/api/#Diagnostic) can be passed to any `console` method, and is logged at the level of the method unless it sets a `severity`. In native plugins, the level comes from the diagnostic's severity. This example shows how to log a warning, complete with a code frame, hints, and a documentation URL, without failing the build.

{% codetabs %}

```js
import { Transformer, Diagnostic } from "@parcel/plugin";

export default new Transformer({
  async transform({ asset }) {
    // ...

    console.warn(
      new Diagnostic({
        message: "This feature is deprecated.",
        codeFrames: [
          {
            filePath: asset.filePath,
            code: asset.getCode(),
            codeHighlights: [
              {
                start: {
                  line: 1,
                  column: 5,
                },
                end: {
                  line: 1,
                  column: 10,
                },
              },
            ],
          },
        ],
        hints: ["Please use this other feature instead."],
        documentationURL: "http://example.com/",
      })
    );
  },
});
```

```rust
impl Plugin for MyTransformer {
  fn transform(&self, asset: &mut Asset, options: &Options) -> Result<(), Diagnostic> {
    // ...

    options.log_diagnostic(
      &Diagnostic::warning("This feature is deprecated.")
        .with_file(asset.file_path())
        .at(1, 5)
        .to(1, 10)
        .with_hint("Please use this other feature instead.")
        .with_documentation_url("http://example.com/"),
    );
    Ok(())
  }
}
```

```go
func (t *MyTransformer) Transform(asset *parcel.Asset, options *parcel.Options) error {
	// ...

	options.LogDiagnostic(&parcel.Diagnostic{
		Message:          "This feature is deprecated.",
		Severity:         parcel.SeverityWarning,
		FilePath:         asset.FilePath(),
		Line:             1,
		Column:           5,
		EndLine:          1,
		EndColumn:        10,
		Hint:             "Please use this other feature instead.",
		DocumentationURL: "http://example.com/",
	})
	return nil
}
```

```swift
struct MyTransformer: Transformer {
  func transform(_ asset: Asset, options: Options) async throws {
    // ...

    options.log(
      .warning(
        "This feature is deprecated.",
        filePath: asset.filePath,
        line: 1,
        column: 5,
        endLine: 1,
        endColumn: 10,
        hint: "Please use this other feature instead.",
        documentationURL: "http://example.com/"
      ))
  }
}
```

{% endcodetabs %}
