---
layout: layout.njk
eleventyNavigation:
  key: getting-started-webapp
  title: 🌐 Generic Webapp
  order: 1
---

## Installing the Parcel CLI

The Parcel CLI is built into the main `parcel` package.

While you can install and run Parcel globally, it is much better to install it locally into your project as a dev dependency. To do this navigate to the project in the terminal and run the install command listed below.

To install the cli run the following command:

```bash
yarn add -D parcel@next
```

Or when using NPM run:

```bash
npm install -D parcel@next
```

## Setting up the Project

### Example Project

To make running parcel easier, you should add some `scripts` to your `package.json`, these are a kind of shortcut to a usually longer command. Below we're gonna suggest some minimal Parcel commands to get you started.

Common names for these scripts are `start` for starting the development environment and `build` for building a production version of your application. We will be using these naming conventions in the example below.

To run the development environment in this minimal example you can run `yarn run start` or `npm run start`.

To create a production build in this minimal example you can run `yarn run build` or `npm run build`.

{% sample "parcel src/index.html", "column" %}
{% samplefile "package.json" %}

```json
{
  "name": "my-project",
  "scripts": {
    "start": "parcel serve ./src/index.html",
    "build": "parcel build src/index.html"
  },
  "devDependencies": {
    "parcel": "next"
  }
}
```

{% endsamplefile %}
{% samplefile "src/index.html" %}

```html
<!DOCTYPE html>
<html>
  <body>
    <div id="root"></div>
    <script src="./index.ts"></script>
  </body>
</html>
```

{% endsamplefile %}
{% samplefile "src/index.ts" %}

```tsx
import React from "react";
import { render } from "react-dom";

render(<h1>Hello World</h1>, document.getElementById("root"));
```

{% endsamplefile %}
{% endsample %}

### Parcel commands explained

In the above example you can see two commands, the development command `parcel serve ./src/index.html` and `parcel build ./src/index.html` for creating production builds.

#### Development command

The development command `parcel serve ./src/index.html` starts up a small development server for serving your JS, HTML, CSS and any other assets as the name of the command implies.

Besides the hosting of these assets, we also start a [Hot Module Reload](/features/hmr/) server which is a websocket that listens to build events and reloads a script, style or your entire page depending on what changed (If you are using React we even have [React Fast Refresh](</recipes/react/#hmr-(fast-refresh)>) built in). This is super useful as you no longer have to manually wait for the build completes and manually refresh the page, although you can still do this if you want by adding the `--no-hmr` flag to the command.

This command also ensures all used libraries and frameworks are building in development mode, meaning you will get additional debug information if they provide any. This means we set the `process.env.NODE_ENV` variable to `development` as well as not doing any minification and generating source-maps.

#### Production build command

The production build command `parcel build ./src/index.html` does exactly with it says it does, which is building your application into small production ready bundles.

This command creates production ready bundles that contain very little to no unused and development code, ensuring your end-user gets fast load times. We achieve this by telling frameworks and libraries we're building for production by setting the `process.env.NODE_ENV` variable to `production`.

We also run a minifier over most assets to ensure code is as minimal as it can and do [scope-hoisting](/features/scope-hoisting/) on all the JavaScript bundles to ensure no unused code ends up in the JavaScript bundles.

These bundles are also named in such a way that any non-html assets can be cached safely in a cdn for a very long time without any user ever having an incorrect or outdated bundle as the name includes a hash of the final bundle content.

## Browserslist

By default Parcel uses the following browserslist config: [`> 0.25%`](https://browserl.ist/?q=%3E+0.25%25) this will be a good default for most applications.

However it is always a good idea to create a custom browserslist config to ensure it always matches your user-base.

### Why configure browserslist

Having a custom browserslist ensures you are in full control of which browsers your application supports, for example you need to support IE 11, than you can define: [`>0.25%, ie 11`](https://browserl.ist/?q=%3E0.25%25%2C+ie+11). This will ensure IE 11 will always work regardless of the market percentage it will have in the future.

On the other side it is also useful for reducing bundle size as supporting a lot and outdated browsers results in a lot of polyfills, for example if you don't need to support IE 11 or Opera Mini you can use [`>0.25%, not ie 11, not op_mini all`](https://browserl.ist/?q=%3E+0.25%25%2C+not+ie+11%2C+not+op_mini+all) which should in turn reduce bundle size.

### How to configure browserslist

To configure a browserslist you can take a couple approaches, you can define it in your `package.json` file under the `browserslist` key or in a seperate configuration file: `browserslist` or `.browserslistrc`.

You can find more information you can have a look at the [browserslist repo](https://github.com/browserslist/browserslist)

You can also have a look at our configuration section, [targets](/getting-started/configuration/#targets) for a more in depth look at all the options for configuring the browsers you're targetting.

## Differential Serving

Parcel also supports differential serving, which means you can serve a different bundle to modern browsers as you do to old browsers. This results in faster load time for newer browsers as the bundle size will be a lot smaller, you actually don't have to do any config to make this work.

Currently this is just esmodule for modern browsers and commonjs following your browserslist for legacy browsers.

You don't have to add any config to make this work, the only thing you have to do is add a script tag to your html file. Parcel automatically takes care of the browser target by subtracting all browsers from your defined browserslist that do not support esmodules.

To utilise this you need to have two script tags in your html one for `module` and one for older browsers also called `nomodule`.

Example:

```
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>HTML Example</title>
    <!-- This script tag will get a reference to the bundle with targetting your defined browser target -->
    <script nomodule src="./index.js"></script>
    <!-- This script tag will get a reference to the esmodule bundle -->
    <script type="module" src="./index.js"></script>
  </head>
  <body>
    <h1>Hello world</h1>
  </body>
</html>
```
