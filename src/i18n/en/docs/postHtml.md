# PostHTML

[PostHTML](https://github.com/posthtml/posthtml) is a tool for transforming HTML with plugins. You can configure PostHTML with Parcel by creating a configuration file using one of these names: `.posthtmlrc` (JSON), `posthtmlrc.js`, or `posthtml.config.js`.

Install plugins in your app:

```bash
yarn add posthtml-img-autosize
```

Then, create a `.posthtmlrc`:

```json
{
  "plugins": {
    "posthtml-img-autosize": {
      "root": "./images"
    }
  }
}
```

Plugins are specified in the `plugins` object as keys, and options are defined using object values. If there are no options for a plugin, just set it to `true` instead.