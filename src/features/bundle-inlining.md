---
layout: layout.njk
title: Bundle inlining
eleventyNavigation:
  key: features-bundle-inlining
  title: 🪆 Bundle inlining
  order: 4
---

Parcel includes several ways to inline the compiled contents of one bundle inside another bundle.

## Inlining a bundle as text

The `bundle-text:` scheme can be used to inline the contents of a bundle as plain text. Parcel will compile the resolved file as normal, including bundling all dependencies, and then inline the result as a string into the parent bundle.

This could be used in many ways. For example, you could inline a compiled CSS bundle and use the result to inject a style tag at runtime. This might be useful in cases where you need to control where the style tag is inserted, e.g. into a Shadow DOM root.

```javascript
import cssText from "bundle-text:./test.css";

// inject <style> tag
let style = document.createElement("style");
style.textContent = cssText;
shadowRoot.appendChild(style);
```

## Inlining as a data URL

The `data-url:` scheme allows inlining a bundle as a data URL. The resolved file will be compiled, including all dependencies, and converted to a base 64 encoded data URL.

One example where this could be useful is inlining small images inside a CSS file.

```css
.foo {
  background: url(data-url:./background.png);
}
```

## Import attributes

In JavaScript, the `type` [import attribute](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import/with) can also be used to control how a file is imported. Like the schemes above, the resolved file is compiled as normal, including bundling all dependencies, and the result is inlined into the parent bundle.

- `type: 'text'` – the contents of the compiled bundle as a string, like `bundle-text:`.
- `type: 'bytes'` – the contents of the compiled bundle as a [Uint8Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array).
- `type: 'css'` – a [CSSStyleSheet](https://developer.mozilla.org/en-US/docs/Web/API/CSSStyleSheet) object constructed from the compiled CSS, which can be added to a document or Shadow DOM root via `adoptedStyleSheets`.
- `type: 'url'` – the URL of the compiled bundle, which is written to a separate file rather than inlined.

```javascript
import cssText from './test.css' with {type: 'text'};
import bytes from './image.png' with {type: 'bytes'};
import sheet from './test.css' with {type: 'css'};

shadowRoot.adoptedStyleSheets = [sheet];
```

## Under the hood

`bundle-text:` and `data-url:` are implemented in the default Parcel config using [Named pipelines](/features/plugins/#named-pipelines). The `@parcel/transformer-inline` [Transformer](/plugin-system/transformer/) plugin marks the compiled asset as inline, which tells Parcel not to write the bundle to disk and instead inline it into the parent bundle. To implement data URLs, the `@parcel/optimizer-data-url` [Optimizer](/plugin-system/optimizer/) plugin is used to convert the compiled bundle to a data url.

In the Parcel config, it looks like the following. The `"..."` in each pipeline tells Parcel to run the normal transformers that match the file first, and then run `@parcel/transformer-inline`.

{% sample %}
{% samplefile "@parcel/config-default" %}

```json
{
  "transformers": {
    "bundle-text:*": ["...", "@parcel/transformer-inline"],
    "data-url:*": ["...", "@parcel/transformer-inline"]
  },
  "optimizers": {
    "data-url:*": ["...", "@parcel/optimizer-data-url"]
  }
}
```

{% endsamplefile %}
{% endsample %}

You can create your own named pipelines to customize inlining however you’d like, reusing the above plugins or creating custom ones. See [Parcel configuration](/features/plugins/) for more details.

See the [Plugin system](/plugin-system/overview/) docs for more details on writing custom plugins.

## Inlining without transforming

In JavaScript, it’s possible to inline the contents of a file without running it through Parcel transformers first. This can be done using the `fs` Node module, which Parcel statically analyzes. It can be inlined as a string in a number of different encodings, or as a [Buffer](https://nodejs.org/api/buffer.html). See the [Node emulation](/features/node-emulation/) docs for more details.

```javascript
import fs from "fs";

const sourceCode = fs.readFileSync(__dirname + "/foo.js", "utf8");
```

In the above example, the `sourceCode` variable would be the contents of `foo.js` _without_ being compiled, i.e. the original source code rather than the bundled result.

## Integration with other tools

Since bundle inlining is a Parcel-specific feature, you’ll need to configure other tools such as TypeScript or Flow to support it. See the [Configuring other tools](/features/dependency-resolution/#configuring-other-tools) section in the dependency resolution docs for details on how to do this.
