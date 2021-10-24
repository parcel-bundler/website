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
import cssText from 'bundle-text:./test.css';

// inject <style> tag
let style = document.createElement('style');
style.textContent = cssText;
shadowRoot.appendChild(style);
```

## Inlining as a data URL

The `data-url:` scheme allows inlining a bundle as a data URL. The resolved file will be compiled, including all dependencies, and converted to a data URL. If the file is in a binary format, it will be encoded as base 64, otherwise as a URI.

One example where this could be useful is inlining small images inside a CSS file.

```css
.foo {
  background: url(data-url:./background.png);
}
```

## Under the hood

`bundle-text:` and `data-url:` are implemented in the default Parcel config using [Named pipelines](/features/plugins/#named-pipelines). The `@parcel/transformer-inline-string` [Transformer](/plugin-system/transformer/) plugin marks the compiled asset as inline, which tells Parcel not to write the bundle to disk and instead inline it into the parent bundle. To implement data URLs, the `@parcel/optimizer-data-url` [Optimizer](/plugin-system/optimizer/) plugin is used to convert the compiled bundle to a data url.

In the Parcel config, it looks like the following. The `"..."` in each pipeline tells Parcel to run the normal transformers that match the file first, and then run `@parcel/transformer-inline-string`.

{% sample %}
{% samplefile "@parcel/config-default" %}

```json
{
  "transformers": {
    "bundle-text:*": ["...", "@parcel/transformer-inline-string"],
    "data-url:*": ["...", "@parcel/transformer-inline-string"]
  },
  "optimizers": {
    "data-url:*": ["...", "@parcel/optimizer-data-url"]
  }
}
```

{% endsamplefile %}
{% endsample %}

You can create your own named pipelines to customize inlining however you’d like, reusing the above plugins or creating custom ones. See [Parcel configuration](/features/plugins/) for more details.

Another Parcel plugin that might be useful is `@parcel/transformer-inline`. Like `@parcel/transformer-inline-string`, it marks assets as inline, but the result is not encoded as a string. This means if the inline bundle contains code, it will be *executed* in the parent bundle rather than returning a string to the user. This could be useful if you have a custom plugin that wraps the bundle somehow and needs to decode it at runtime.

For example, maybe you’d like to inline a file as an [ArrayBuffer](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer), or some other custom encoding. That could be implemented using a custom Optimizer plugin, which post-processes the output of a bundle.

```javascript
import {Optimizer} from '@parcel/plugin';
import {blobToBuffer} from '@parcel/utils';

export default new Optimizer({
  async optimize({contents}) {
    let buffer = await blobToBuffer(contents);
    return {
      contents: `new Uint8Array(${JSON.stringify(Array.from(buffer))}).buffer`
    };
  }
});
```

Now you could define a named pipeline using your new plugin, and import compiled files as array buffers.

See the [Plugin system](/plugin-system/overview/) docs for more details on writing custom plugins, and the [Parcel Configuration](/features/plugins/) docs for more information about named pipelines.

## Inlining as a blob URL

You may want to inline the contents of a bundle as a [blob URL](https://developer.mozilla.org/en-US/docs/Web/API/URL/createObjectURL), which can be passed to many web APIs in the browser. The `@parcel/optimizer-blob-url` plugin can be used to do this, in combination `@parcel/transformer-inline`. A named pipeline for these is not included by default, so you'll need to create one in your `.parcelrc`.

{% sample %}
{% samplefile ".parcelrc" %}

```json
{
  "extends": "@parcel/config-default",
  "transformers": {
    "blob-url:*": ["...", "@parcel/transformer-inline"]
  },
  "optimizers": {
    "blob-url:*": ["...", "@parcel/optimizer-blob-url"]
  }
}
```

{% endsamplefile %}
{% endsample %}

## Inlining without transforming

In JavaScript, it’s possible to inline the contents of a file without running it through Parcel transformers first. This can be done using the `fs` Node module, which Parcel statically analyzes. It can be inlined as a string in a number of different encodings, or as a [Buffer](https://nodejs.org/api/buffer.html). See the [Node emulation](/features/node-emulation/) docs for more details.

```javascript
import fs from 'fs';

const sourceCode = fs.readFileSync(__dirname + '/foo.js', 'utf8');
```

In the above example, the `sourceCode` variable would be the contents of `foo.js` *without* being compiled, i.e. the original source code rather than the bundled result.

## Integration with other tools

Since bundle inlining is a Parcel-specific feature, you’ll need to configure other tools such as TypeScript or Flow to support it. See the [Configuring other tools](/features/dependency-resolution/#configuring-other-tools) section in the dependency resolution docs for details on how to do this.
