---
layout: layout.njk
title: Building a library with Parcel
description: A getting started guide walking through how to setup a library with Parcel, including output of an ES module, CommonJS, and TypeScript definitions.
eleventyNavigation:
  key: getting-started-library
  title: 📔 Library
  order: 2
---

## Installation

Before we get started, you'll need to install Node and Yarn or npm, and create a directory for your project. Then, install Parcel using Yarn:

```shell
yarn add --dev parcel
```

Or when using npm run:

```shell
npm install --save-dev parcel
```

## Project setup

Now that Parcel is installed, let’s setup a `package.json` file for our library. We'll use the `source` field to reference our source files, and create a `main` [target](/features/targets/) as the output file of our build. This will be consumed by other tools that use our library (e.g. bundlers or Node.js).

{% sample %}
{% samplefile "package.json" %}

```json/3-4
{
  "name": "my-library",
  "version": "1.0.0",
  "source": "src/index.js",
  "main": "dist/main.js",
  "devDependencies": {
    "parcel": "latest"
  }
}
```

{% endsamplefile %}
{% endsample %}

The above example uses `src/index.js` as the source code for our library, so let's create that file next. In this example, we're using a JavaScript file, but we could also reference a TypeScript file or any other language that compiles to JavaScript here.

{% sample %}
{% samplefile "src/index.js" %}

```javascript
export function add(a, b) {
  return a + b;
}
```

{% endsamplefile %}
{% endsample %}

Now, our library exports a single function called `add`, which adds its two parameters together and returns the result. Since this is written in ES module syntax using the `export` keyword, Parcel will compile our code to a CommonJS module as expected by default in the `main` field.

To build our library, run `npx parcel build` within the project directory. Parcel will build your source code and output a JavaScript file in `dist/main.js` as referenced by the `main` field.

## Package scripts

So far, we’ve been running the `parcel` CLI directly, but it can be useful to create some scripts in your `package.json` file to make this easier. We'll also setup a `watch` script which will watch your source files for changes and rebuild automatically so you don't need to run the `build` script manually in development as you make changes.

{% sample %}
{% samplefile "package.json" %}

```json/5-8
{
  "name": "my-library",
  "version": "1.0.0",
  "source": "src/index.js",
  "main": "dist/main.js",
  "scripts": {
    "watch": "parcel watch",
    "build": "parcel build"
  },
  "devDependencies": {
    "parcel": "latest"
  }
}
```

{% endsamplefile %}
{% endsample %}

Now you can run `yarn build` to build your project for release and `yarn watch` in development.

## CommonJS and ES modules

Parcel accepts both CommonJS and ES modules as input, and can output one or more of these formats depending on what's declared in your `package.json`. To add an ES module target, add the `module` field to your `package.json`.

{% sample %}
{% samplefile "package.json" %}

```json/5
{
  "name": "my-library",
  "version": "1.0.0",
  "source": "src/index.js",
  "main": "dist/main.js",
  "module": "dist/module.js",
  "devDependencies": {
    "parcel": "latest"
  }
}
```

{% endsamplefile %}
{% endsample %}

Now Parcel will output `dist/main.js` as a CommonJS module, and `dist/module.js` as an ES module. Tools that consume your library will choose whichever of these they support.

You can also use the file extension to indicate what type of module to output. The `.mjs` extension will produce an ES module, and the `.cjs` extension will produce a CommonJS module. This overrides the default behavior of the `main` field. The `"type": "module"` field can also be set in package.json to treat the `main` field as an ES module as well. See the [Node.js docs](https://nodejs.org/dist/latest-v16.x/docs/api/packages.html#packages_determining_module_system) for more details.

## TypeScript

Parcel also supports building libraries written in TypeScript. The `source` field can point to your entry `.ts` or `.tsx` file, and Parcel will output JavaScript into your targets automatically. You can also use the `types` field in package.json to point to a `.d.ts` file, and Parcel will generate a typings file alongside the compiled JavaScript. This lets editors like VSCode provide autocomplete for users of your library.

{% sample %}
{% samplefile "package.json" %}

```json/6
{
  "name": "my-library",
  "version": "1.0.0",
  "source": "src/index.ts",
  "main": "dist/main.js",
  "module": "dist/module.js",
  "types": "dist/types.d.ts",
  "devDependencies": {
    "parcel": "latest"
  }
}
```

{% endsamplefile %}
{% endsample %}

Now Parcel will output a `dist/types.d.ts` file containing type definitions for our library in addition to the compiled code.

## Next steps

Now that you’ve set up your project, you're ready to learn about some more advanced features of Parcel. Check out the documentation about [Targets](/features/targets/), and see the Recipes and Languages sections for more in-depth guides using popular web frameworks and tools.
