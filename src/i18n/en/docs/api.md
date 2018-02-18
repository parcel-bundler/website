# 📚 API

## Bundler

Instead of the cli you can also use the API to initialise a bundler, for more advanced use-cases (e.g. custom processing after every build).
A watch example with every option explained:
```Javascript
const Bundler = require('parcel-bundler');
const Path = require('path');

// Entrypoint file location
const file = Path.join(__dirname, './index.html');

// Bundler options
const options = {
  production: false, // build or watch, defaults to process.env.NODE_ENV === 'production'
  outDir: './dist', // The out directory to put the build files in, defaults to dist
  outFile: 'index.html', // The name of the outputFile
  publicUrl: './', // The url to server on, defaults to dist
  watch: true, // whether to watch the files and rebuild them on change, defaults to !production
  cache: true, // Enabled or disables caching, defaults to true
  cacheDir: '.cache', // The directory cache gets put in, defaults to .cache
  minify: false, // Minify files, defaults to minifying if production is true
  target: 'browser', // browser/node/electron, defaults to 
  https: false, // Server files over https or http, defaults to browser
  logLevel: 3, // 3 = log everything, 2 = log warnings & errors, 1 = log errors
  hmrPort: 0, // The port the hmr socket runs on, defaults to a random free port (0 in node.js resolves to a random free port)
  sourceMaps: true, // Enable or disable sourcemaps, defaults to enabled (not supported in production builds yet)
  hmrHostname: '', // A hostname for hot module reload, default to ''
  detailedReport: false // Prints a detailed report of the bundles, assets, filesizes and times, defaults to false, reports are only printed if watch is disabled
};

// Initialises a bundler using the entrypoint location and options provided
const bundler = new Bundler(file, options);

// Run the bundler, this returns the main bundle
// Use the events if you're using watch mode as this promise will only trigger once and not for every rebuild
const bundle = await bundler.bundle();
```

### Events

This is a list of all bundler events

`bundled` gets called once parcel has succesfully finished bundling, it has the main [bundle](#bundle) as a parameter

```Javascript
const bundle = new Bundler(...);
bundle.on('bundled', (bundle) => {
  // bundle contains all assets and bundles, see documentation for details
});
```

`buildEnd` gets called after each build, this also emits if an error accured

```Javascript
const bundle = new Bundler(...);
bundle.on('buildEnd', () => {

});
```

### Bundle

A `Bundle` is what parcel uses to bundle assets together, this also contains child and sibling bundles to be able to build a bundle tree.

#### Properties

* `type`: The type of assets it contains (e.g. js, css, map, ...)
* `name`: The name of the bundle (generated using `Asset.generateBundleName()` of `entryAsset`)
* `parentBundle`: The parent bundle, is null in case of the entry bundle
* `entryAsset`: The entryPoint of the bundle, used for generating the name and gathering assets.
* `assets`: A `Set` of all assets inside the bundle
* `childBundles`: A `Set` of all child bundles
* `siblingBundles`: A `Set` of all sibling bundles
* `siblingBundlesMap`: A `Map<String(Type: js, css, map, ...), Bundle>` of all sibling bundles
* `offsets`: A `Map<Asset, number(line number inside the bundle)>` of all the locations of the assets inside the bundle, used to generate accurate source maps

#### Tree

The `Bundle` contains `parentBundle`, `childBundles` and `siblingBundles`, all these properties together create a fast to iterate bundle tree.


A very basic example of an asset tree and it's generated bundle Tree

Asset tree:

`index.html` requires `index.js` and `index.css`.

`index.js` requires `test.js` and `test.txt`

```Text
index.html
-- index.js
 |--- test.js
 |--- test.txt
-- index.css
```

Bundle Tree:

`index.html` gets used as an entry asset for the main bundle, this main bundle creates two child bundles one for `index.js` and one for `index.css` this because they both are different from the `html` type.

`index.js` requires two files, `test.js` and `test.txt`.

`test.js` gets added to the assets of the `index.js` bundle, as it is of the same type as `index.js`

`test.txt` creates a new bundle and gets added as a child of the `index.js` bundle as it is a different assetType than `index.js`

`index.css` has no requires and therefore only contains it's entry Asset

```Text
index.html
-- index.js (includes index.js and test.js)
 |--- test.txt (includes test.txt)
-- index.css (includes index.css)
```

### Middleware

Middleware can be used to hook into a http server (e.g. `express` or node `http`).

An example of using the parcel middleware with express
```Javascript
const Bundler = require('parcel-bundler');
const app = require('express')();

// Initialise a new bundler using a file and options (for options and file see the bundler documentation)
const bundler = new Bundler(file, options);

// Let express use the bundler middleware, this will let parcel handle every request over your express server
app.use(bundler.middleware());

// Listen on port 8080
app.listen(8080);
```