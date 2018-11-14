# 🐠 Transforms

While many bundlers require you to install and configure plugins to transform assets, Parcel has support for many common transforms and transpilers built in out of the box. You can transform JavaScript using [Babel](https://babeljs.io), CSS using [PostCSS](http://postcss.org), and HTML using [PostHTML](https://github.com/posthtml/posthtml). Parcel automatically runs these transforms when it finds a configuration file (e.g. `.babelrc`, `.postcssrc`) in a module. (In addition to any transforms specified in `.babelrc`, Parcel always uses Babel on all modules to compile modern JavaScript into a form supported by browsers. See the [JavaScript/Default Babel Transforms](javascript.html#default-babel-transforms) section for more information.)

## Third-Party Modules

Configuration files (such as `.babelrc`) will not be applied to files inside third-party `node_modules` by default. However, if the module's directory is symlinked (as is common in some monorepo conventions) and the module's `package.json` has the `source` field set, then configuration files inside the module's directory will be respected. Here are the types of values supported by the `source` field:

* Treat all files as source code, don't change the resolution

```json
{
  "main": "foo.js",
  "source": true
}
```

* When compiling from source, use bar.js as the entry point

```json
{
  "main": "foo.js",
  "source": "bar.js"
}
```

* When compiling from source, alias specific files

```json
{
  "main": "foo.js",
  "source": {
    "./foo.js": "./bar.js",
    "./baz.js": "./yay.js"
  }
}
```

* When compiling from source, alias using glob patterns

```json
{
  "main": "foo.js",
  "source": {
    "./lib/**": "./src/$1"
  }
}
```

The last example allows you to replace your entire lib directory with src so import 'my-module/lib/test.js' would resolve to 'my-module/src/test.js'. You could also use a top-level catch-all pattern like `"**": "./src/$1"` for packages like lodash that have many files in the root to replace (e.g. lodash/cloneDeep with lodash/src/cloneDeep).
