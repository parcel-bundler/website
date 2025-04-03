---
layout: layout.njk
title: Web Extension
eleventyNavigation:
  key: recipes-webext
  title: <img class="dark-invert" src="/assets/lang-icons/webext.svg" alt=""/> Web Extension
  order: 7
---

[Web Extensions](https://developer.chrome.com/docs/extensions/) are a set of APIs for building browser extensions that work across many browsers. Parcel supports building Web Extensions using `@parcel/config-webextension`.

## Getting started

First, install `@parcel/config-webextension` into your project:

```shell
yarn add @parcel/config-webextension --dev
```

Next, you'll need a [manifest.json](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/manifest.json) file, which will be the entry point of your extension. See [this guide](https://developer.chrome.com/docs/extensions/mv3/getstarted/) for details on how to set it up. Both Manifest V2 and V3 are supported. You can use [TypeScript](/languages/typescript), [Vue](/languages/vue), and any other languages supported by Parcel within your web extension code.

{% sample %}
{% samplefile "manifest.json" %}

```json
{
  "manifest_version": 3,
  "name": "Sample Web Extension",
  "version": "0.0.1",
  "background": {
    "service_worker": "background.ts",
    "type": "module"
  },
  "content_scripts": [
    {
      "matches": ["*://github.com/parcel-bundler/*"],
      "js": ["parcel-content-script.ts"]
    }
  ]
}
```

{% endsamplefile %}
{% endsample %}

To build your extension, run Parcel using your `manifest.json` as an entry, and `@parcel/config-webextension` as the config:

```shell
parcel build manifest.json --config @parcel/config-webextension
```

{% warning %}

With the default Web Extension config, the manifest has to be called `manifest.json` (and cannot be just any file with a `json` extension).

{% endwarning %}

You can also create a `.parcelrc` file in your project extending `@parcel/config-webextension`. This way you don't need to pass the `--config` option to the Parcel CLI every time.

{% sample %}
{% samplefile ".parcelrc" %}

```json
{
  "extends": "@parcel/config-webextension"
}
```

{% endsamplefile %}
{% endsample %}

To make Parcel treat some other file as a manifest apart from `manifest.json`, add a few more lines to the `.parcelrc`:

{% sample %}
{% samplefile ".parcelrc" %}

```json
{
  "extends": "@parcel/config-webextension",
  "transformers": {
    "some-other-manifest.json": ["@parcel/transformer-webextension"]
  },
  "packagers": {
    "some-other-manifest.json": "@parcel/packager-webextension"
  }
}
```

{% endsamplefile %}
{% endsample %}

## HMR

Due to [restrictions on Content Security Policy](https://developer.chrome.com/docs/extensions/mv3/intro/mv3-migration/#content-security-policy) in MV3, HMR is not supported, but updating your code will cause the extension to reload. For MV2, HMR is fully supported by default. Reloading pages with content scripts will reload the extension in both versions.

For the best developer experience, use `--host localhost` for development builds (this is sometimes necessary for content script reloading). You can copy the following configuration:

{% sample %}
{% samplefile "package.json" %}

```json
{
  "scripts": {
    "start": "parcel watch src/manifest.json --host localhost --config @parcel/config-webextension",
    "build": "parcel build src/manifest.json --config @parcel/config-webextension"
  }
}
```

{% endsamplefile %}
{% endsample %}

Running `yarn start` or `npm start` will start the development server. Source maps and HMR will work for background scripts, the popup page, and the options page. For MV2, HMR will usually also work on content scripts.

To add the extension to your browser, load Parcel's output folder unpacked. For example, in Chrome, [click "Load Unpacked"](https://developer.chrome.com/extensions/getstarted#manifest) in the `chrome://extensions` page and select `path/to/project/dist`.

Running `yarn build` or `npm run build` will give you the final web extension package, ready to be published. After zipping the output directory, you should be able to upload your file to your platform of choice, such as the Chrome Web Store.

## Special Considerations

### Unexpected messages

In development mode, your background scripts will receive a message event with the content `{ __parcel_hmr_reload__: true }` whenever a content script page is reloaded. Parcel will use this automatically to refresh the extension when necessary. Therefore, you'll want to ensure any messages your background scripts receive do not have the `__parcel_hmr_reload__` property before handling them.

### Styling

Any styles imported in a content script will be injected into the `css` property of that content script and will thus apply to the entire page. Usually this is what you want, but if not you can always use [CSS modules](/languages/css#css-modules) to prevent the styles from applying to the original site.

Additionally, content script CSS resolves links to the site they are injected into, so you won't be able to reference local assets. You should [inline your bundles](</languages/css#url()>) to resolve this issue.

{% sample %}
{% samplefile "content-script.css" %}

```css
.my-class {
  /* Equivalent to: https://injected-site.com/custom-bg.png */
  /* This is probably not what you want! */
  background-image: url(./custom-bg.png);
}

.my-other-class {
  /* This will use the local file custom-bg.png */
  background-image: url(data-url:./custom-bg.png);
}
```

{% endsamplefile %}
{% endsample %}

Lastly, hot reload may not work when adding or removing CSS linked from inside an `import()` in content scripts, while synchronous `import` has no such issues. This is a known limitation and will be fixed in a future version.

### `web_accessible_resources`

Any resources you use in a content script will automatically be added into `web_accessible_resources`, so you don't usually need to specify anything in `web_accessible_resources` at all. For example, the following content script will work without issues:

{% sample %}
{% samplefile "content-script.js" %}

```js
import myImage from "url:./image.png";

const injectedImage = document.createElement("img");
injectedImage.src = myImage;
document.body.appendChild(injectedImage);
```

{% endsamplefile %}
{% endsample %}

However, if you actually want resources from your extension to be accessible from other extensions or websites, you can specify file paths or globs within `web_accessible_resources`. Note that Parcel treats entries in `web_accessible_resources` like Unix globs (as in, `examples/*.png` will retrieve every PNG in the examples folder, and `examples/**.png` will do it recursively). This is different from the globbing in Chrome, which is always recursive.
