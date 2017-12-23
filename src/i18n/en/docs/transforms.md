# 🐠 Transforms

While many bundlers require you to install and configure plugins to transform assets, Parcel has support for many common transforms and transpilers built in out of the box. You can transform JavaScript using [Babel](https://babeljs.io), CSS using [PostCSS](http://postcss.org), and HTML using [PostHTML](https://github.com/posthtml/posthtml). Parcel automatically runs these transforms when it finds a configuration file (e.g. `.babelrc`, `.postcssrc`) in a module.

This even works in third-party `node_modules`: if a configuration file is published as part of the package, the transform is automatically turned on for that module only. This keeps bundling fast since only modules that need to be transformed are processed. It also means that you don't need to manually configure the transforms to include and exclude certain files, or know how third party code is built in order to use it in your application.

## Babel

[Babel](https://babeljs.io) is a popular transpiler for JavaScript, with a large plugin ecosystem. Using Babel with Parcel works the same way as using it standalone or with other bundlers.

Install presets and plugins in your app:

```bash
yarn add babel-preset-env
```

Then, create a `.babelrc`:

```json
{
  "presets": ["env"]
}
```

## PostCSS

[PostCSS](http://postcss.org) is a tool for transforming CSS with plugins, like [autoprefixer](https://github.com/postcss/autoprefixer), [cssnext](http://cssnext.io/), and [CSS Modules](https://github.com/css-modules/css-modules). You can configure PostCSS with Parcel by creating a configuration file using one of these names: `.postcssrc` (JSON), `.postcssrc.js`, or `postcss.config.js`.

Install plugins in your app:

```bash
yarn add postcss-modules autoprefixer
```

Then, create a `.postcssrc`:

```json
{
  "modules": true,
  "plugins": {
    "autoprefixer": {
      "grid": true
    }
  }
}
```

Plugins are specified in the `plugins` object as keys, and options are defined using object values. If there are no options for a plugin, just set it to `true` instead.

Target browsers for Autoprefixer, cssnext and other tools can be specified in `.browserslistrc` file:

```
> 1%
last 2 versions
```

CSS Modules are enabled slightly differently using the a top-level `modules` key. This is because Parcel needs to have special support for CSS Modules since they export an object to be included in the JavaScript bundle as well. Note that you still need to install `postcss-modules` in your project.

## PostHTML

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

## TypeScript
[TypeScript](https://www.typescriptlang.org/) is a typed superset of JavaScript that compiles down to plain JavaScript, which also supports modern ES2015+ features. Transforming TypeScript works out of the box without any additional configuration.

```html
<!-- index.html -->
<html>
<body>
  <script src="./index.ts"></script>
</body>
</html>
```
```typescript
// index.ts
import message from "./message";
console.log(message);
```
```typescript
// message.ts
export default "Hello, world";
```
