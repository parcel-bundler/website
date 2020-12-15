---
layout: layout.njk
eleventyNavigation:
  key: recipes-webext
  title: <img class="dark-invert" src="/assets/lang-icons/webext.svg" alt=""/> Web Extension
  order: 7
---

Web Extension development is enabled by `@parcel/config-webext`.

{% sample %}
{% samplefile ".parcelrc" %}

```json
{
  "extends": "@parcel/config-webext"
}
```

{% endsamplefile %}
{% endsample %}

Running Parcel on your [`manifest.json`](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/manifest.json) will automatically validate and bundle your web extension if you pass it as an entry.

## HMR

For the best experience, you'll also want to enable a few options:

- `sourceMap#inline` and `sourceMap#inlineSources`: Source maps don't work unless inlined in web extensions
- `--host localhost`: Needed for HMR to work properly in content scripts

{% sample %}
{% samplefile "package.json" %}

```json
{
  "targets": {
    "webext-dev": {
      "sourceMap": {
        "inline": true,
        "inlineSources": true
      }
    },
    "webext-prod": {}
  },
  "scripts": {
    "dev": "parcel src/manifest.json --host localhost --target webext-dev",
    "build": "parcel build src/manifest.json --target webext-prod"
  }
}
```

{% endsamplefile %}
{% endsample %}

Running `yarn run dev` or `npm run dev` will start the development server. HMR and source maps will work for background scripts, content scripts, the popup page, and the options page. To add the extension to your browser, research how to load an extension unpacked (for example, in Chrome, [click "Load Unpacked"](https://developer.chrome.com/extensions/getstarted#manifest)).

Running `yarn run build` or `npm run build` will give you the final web extension package, ready to be published. After zipping the output directory, you should be able to upload your file to your platform of choice, such as the Chrome Web Store.

## Special Considerations

In development mode, your background scripts will receive a message event with the content `{ __parcel_hmr_reload__: true }` whenever the page is reloaded. Parcel will use this automatically to refresh the extension when necessary, so you'll want to ensure any messages your background scripts receive do not have the `__parcel_hmr_reload__` property before handling them.

One unfortunate consequence of using web extensions is that importing CSS files from content scripts will not work properly. This may be revisited in the future, but for now you'll need to include whatever stylesheets you use in the [`css` property in `manifest.json`](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/manifest.json/content_scripts#css).
