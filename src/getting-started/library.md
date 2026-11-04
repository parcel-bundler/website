---
layout: layout.njk
title: Building a library with Parcel
description: A getting started guide walking through how to setup a library with Parcel, including output of an ES module and CommonJS.
eleventyNavigation:
  key: getting-started-library
  title: 📔 Library
  order: 2
---

## Installation

Before we get started, you'll need to install Node and Yarn or npm, and create a directory for your project. Then, install Parcel using Yarn:

```shell
yarn add --dev parcel@next
```

Or when using npm run:

```shell
npm install --save-dev parcel@next
```

## Project setup

Now that Parcel is installed, let’s setup a `package.json` file for our library. We'll use the `exports` field to declare the output file of our build, and a `source` field within it to reference our source files. This will be consumed by other tools that use our library (e.g. bundlers or Node.js). See [Library targets](/features/targets/#library-targets) for more details.

{% sample %}
{% samplefile "package.json" %}

```json/3-6
{
  "name": "my-library",
  "version": "1.0.0",
  "exports": {
    "source": "./src/index.js",
    "default": "./dist/main.js"
  },
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

Now, our library exports a single function called `add`, which adds its two parameters together and returns the result. Since this is written in ES module syntax using the `export` keyword, Parcel will compile our code to a CommonJS module as expected by default for `.js` files in packages without `"type": "module"`.

To build our library, run `npx parcel build` within the project directory. Parcel will build your source code and output a JavaScript file in `dist/main.js` as referenced by the `exports` field.

## Package scripts

So far, we’ve been running the `parcel` CLI directly, but it can be useful to create some scripts in your `package.json` file to make this easier. We'll also setup a `watch` script which will watch your source files for changes and rebuild automatically so you don't need to run the `build` script manually in development as you make changes.

{% sample %}
{% samplefile "package.json" %}

```json/7-10
{
  "name": "my-library",
  "version": "1.0.0",
  "exports": {
    "source": "./src/index.js",
    "default": "./dist/main.js"
  },
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

Parcel accepts both CommonJS and ES modules as input, and can output one or more of these formats depending on what's declared in your `package.json`. To output both an ES module and a CommonJS module, use the `import` and `require` [conditions](https://nodejs.org/api/packages.html#conditional-exports) in the `exports` field.

{% sample %}
{% samplefile "package.json" %}

```json/5-6
{
  "name": "my-library",
  "version": "1.0.0",
  "exports": {
    "source": "./src/index.js",
    "import": "./dist/module.mjs",
    "require": "./dist/main.cjs"
  },
  "devDependencies": {
    "parcel": "latest"
  }
}
```

{% endsamplefile %}
{% endsample %}

Now Parcel will output `dist/main.cjs` as a CommonJS module, and `dist/module.mjs` as an ES module. Tools that consume your library will choose whichever of these they support.

The file extension indicates what type of module to output. The `.mjs` extension will produce an ES module, and the `.cjs` extension will produce a CommonJS module. Files with a `.js` extension produce a CommonJS module by default, or an ES module if the `"type": "module"` field is set in package.json. See the [Node.js docs](https://nodejs.org/api/packages.html#determining-module-system) for more details.

## Multiple entries

If your library has multiple entry points, each [subpath export](https://nodejs.org/api/packages.html#subpath-exports) can have its own `source` field.

{% sample %}
{% samplefile "package.json" %}

```json/4-11
{
  "name": "my-library",
  "version": "1.0.0",
  "exports": {
    ".": {
      "source": "./src/index.js",
      "default": "./dist/index.mjs"
    },
    "./utils": {
      "source": "./src/utils.js",
      "default": "./dist/utils.mjs"
    }
  },
  "devDependencies": {
    "parcel": "latest"
  }
}
```

{% endsamplefile %}
{% endsample %}

## TypeScript

Parcel also supports building libraries written in TypeScript. The `source` field can point to your entry `.ts` or `.tsx` file, and Parcel will output JavaScript into your targets automatically.

{% sample %}
{% samplefile "package.json" %}

```json/4
{
  "name": "my-library",
  "version": "1.0.0",
  "exports": {
    "source": "./src/index.ts",
    "import": "./dist/module.mjs",
    "require": "./dist/main.cjs"
  },
  "devDependencies": {
    "parcel": "latest"
  }
}
```

{% endsamplefile %}
{% endsample %}

## Dependencies and tree shaking

Parcel does not bundle packages listed in the `dependencies` or `peerDependencies` fields of your `package.json` into your library. These will be installed alongside your library by its consumers. Packages listed in `devDependencies` are bundled. This can be customized using the [`includeNodeModules`](/features/targets/#includenodemodules) option.

Rather than combining your whole library into a single file, Parcel outputs a separate file for each module in your library, preserving the structure of your source code. This improves tree shaking in end applications when you have many exports that may be used independently.

## Next steps

Now that you’ve set up your project, you're ready to learn about some more advanced features of Parcel. Check out the documentation about [Targets](/features/targets/), and see the Recipes and Languages sections for more in-depth guides using popular web frameworks and tools.
