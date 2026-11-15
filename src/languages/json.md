<title>JSON</title>

# JSON

Parcel supports importing JSON and [JSON5](https://json5.org) files into JavaScript out of the box.

## Example usage

{% sample %}
{% samplefile "app.js" %}

```js
import data from "./data.json";
console.log(data.hello[0]);
// => "world"
```

{% endsamplefile %}
{% samplefile "data.json" %}

```json
{
  "hello": ["world", "computer"]
}
```

{% endsamplefile %}
{% endsample %}

JSON files are only converted to JavaScript when imported from JavaScript. When referenced from anywhere else, such as from an HTML file or as a [URL dependency](/languages/javascript/#url-dependencies) in JavaScript, they are copied to the output directory as is.
