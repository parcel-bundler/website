---
layout: layout.njk
eleventyNavigation:
  key: languages-svg
  title: <img src="/assets/lang-icons/svg.svg" alt=""/> SVG
  order: 9
---

SVG assets can be used as images, icons or as a more flexible alternative to html for certain types of interface elements. In this documentation page we're mainly gonna go over using it as a more static asset and how you can import and optimize them using Parcel.

## Importing SVG

You can import an SVG file in Parcel using either a URL or as a React component, other use-cases can be supported by writing a custom `.parcelrc` file or using a third-party plugin.

### Importing as a URL

To import an SVG as a URL you can use the by default supported `url:` pipeline, by doing something as follows:

{% sample %}
{% samplefile "App.jsx" %}

```jsx
import iconUrl from "url:./icon.svg";

export const App = () => <img src={iconUrl} />;
```

{% endsamplefile %}
{% endsample %}

### Importing as a React component

To import an SVG as a React component, you have to install the parcel plugin `@parcel/transformer-svg-react`, create a `.parcelrc` file and add the `@parcel/transformer-svg-react` plugin to it so Parcel runs SVG imports through this transformer. This plugin uses `svgr` under the hood to transform the files from svg to valid react components, for more details on how this works you can have a look at [their documentation](https://react-svgr.com/)

After setting up the configuration correctly you should be able to import any SVG file as a react component as demonstrated in the example below.

{% sample %}
{% samplefile ".parcelrc" %}

```json
{
  "extends": "@parcel/config-default",
  "transformers": {
    "*.svg": ["@parcel/transformer-svg-react"]
  }
}
```

{% endsamplefile %}

{% samplefile "App.jsx" %}

```jsx
import Icon from "./icon.svg";

export const App = () => <Icon />;
```

{% endsamplefile %}
{% endsample %}

## Optimizing SVG

To optimize SVG files we have developed an official Parcel plugin that is included in the default config `@parcel/config-default`, named `@parcel/optimizer-svgo`, so any imported SVG will get optimized by default.

If you'd like to configure how the svgo optimizer handles your SVG files you can create a configuration file named: `svgo.config.json` or `svgo.config.js` (be aware that using a javascript configuration will disable some caching functionality, it's recommended to use the json version)

To see all the available configuration options for svgo you can have a look at the official svgo documentation here: [https://github.com/svg/svgo#configuration](https://github.com/svg/svgo#configuration)
