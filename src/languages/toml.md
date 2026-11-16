# TOML

Parcel supports importing TOML files from JavaScript out of the box.

## Example usage

<code-sample>
<code-file name="app.js">

```js
import data from "./data.toml";
console.log(data.hello[0]);
// => "world"
```

</code-file>
<code-file name="data.toml">

```toml
hello = [
  "world",
  "computer"
]
```

</code-file>
</code-sample>

TOML files are only converted to JavaScript when imported from JavaScript. When referenced from anywhere else, such as from an HTML file or as a [URL dependency](javascript.md#url-dependencies) in JavaScript, they are copied to the output directory as is.
