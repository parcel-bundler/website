# 📚 API

## Bundler

Instead of the CLI you can also use the API to initialise a bundler, for more advanced use-cases (e.g. custom processing after every build).
A watch example with every option explained:

```Javascript
const Bundler = require('parcel-bundler');
const Path = require('path');

// Single entrypoint file location:
const entryFiles = Path.join(__dirname, './index.html');
// OR: Multiple files with globbing (can also be .js)
// const entryFiles = './src/*.js';
// OR: Multiple files in an array
// const entryFiles = ['./src/index.html', './some/other/directory/scripts.js'];

// Bundler options
const options = {
  outDir: './dist', // The out directory to put the build files in, defaults to dist
  outFile: 'index.html', // The name of the outputFile
  publicUrl: '/', // The url to serve on, defaults to '/'
  watch: true, // Whether to watch the files and rebuild them on change, defaults to process.env.NODE_ENV !== 'production'
  cache: true, // Enabled or disables caching, defaults to true
  cacheDir: '.cache', // The directory cache gets put in, defaults to .cache
  contentHash: false, // Disable content hash from being included on the filename
  global: 'moduleName', // Expose modules as UMD under this name, disabled by default
  minify: false, // Minify files, enabled if process.env.NODE_ENV === 'production'
  scopeHoist: false, // Turn on experimental scope hoisting/tree shaking flag, for smaller production bundles
  target: 'browser', // Browser/node/electron, defaults to browser
  bundleNodeModules: false, // By default, package.json dependencies are not included when using 'node' or 'electron' with 'target' option above. Set to true to adds them to the bundle, false by default
  https: { // Define a custom {key, cert} pair, use true to generate one or false to use http
    cert: './ssl/c.crt', // Path to custom certificate
    key: './ssl/k.key' // Path to custom key
  },
  logLevel: 3, // 5 = save everything to a file, 4 = like 3, but with timestamps and additionally log http requests to dev server, 3 = log info, warnings & errors, 2 = log warnings & errors, 1 = log errors, 0 = log nothing
  hmr: true, // Enable or disable HMR while watching
  hmrPort: 0, // The port the HMR socket runs on, defaults to a random free port (0 in node.js resolves to a random free port)
  sourceMaps: true, // Enable or disable sourcemaps, defaults to enabled (minified builds currently always create sourcemaps)
  hmrHostname: '', // A hostname for hot module reload, default to ''
  detailedReport: false, // Prints a detailed report of the bundles, assets, filesizes and times, defaults to false, reports are only printed if watch is disabled
  autoInstall: true, // Enable or disable auto install of missing dependencies found during bundling
};

(async function() {
  // Initializes a bundler using the entrypoint location and options provided
  const bundler = new Bundler(entryFiles, options);

  // Run the bundler, this returns the main bundle
  // Use the events if you're using watch mode as this promise will only trigger once and not for every rebuild
  const bundle = await bundler.bundle();
})();
```

If you want to use/start the built-in development server of Parcel you can use `bundler.serve()`. This calls `bundler.bundle()` and starts a simple http (or https) server. `serve()` takes in 3 arguments (they are all optional), first one is port, second one is https (this can either be an object `{cert,key}` pointing to the location of key and cert file or `true` to generate a key) and the third one is the host.

### Events

This is a list of all bundler events

- `bundled` gets called once Parcel has successfully finished bundling, the main [bundle](#bundle) instance gets passed to the callback

```Javascript
const bundler = new Bundler(...);
bundler.on('bundled', (bundle) => {
  // bundler contains all assets and bundles, see documentation for details
});
// Call this to start bundling
bundler.bundle();
```

- `buildEnd` gets called after each build (aka **including every rebuild**), this also emits if an error occurred

```Javascript
const bundler = new Bundler(...);
bundler.on('buildEnd', () => {
  // Do something...
});
// Call this to start bundling
bundler.bundle();
```

- `buildStart` gets called at the start of the first build, the `entryFiles` Array gets passed to the callback

```Javascript
const bundler = new Bundler(...);
bundler.on('buildStart', entryPoints => {
  // Do something...
});
// Call this to start bundling
bundler.bundle();
```

- `buildError` gets called every time an error occurs during builds, the `Error` Object gets passed to the callback

```Javascript
const bundler = new Bundler(...);
bundler.on('buildError', error => {
  // Do something...
});
// Call this to start bundling
bundler.bundle();
```

### Bundle

A `Bundle` is what Parcel uses to bundle assets together, this also contains child and sibling bundles to be able to build a bundle tree.

#### Properties

- `type`: The type of assets it contains (e.g. js, css, map, ...)
- `name`: The name of the bundle (generated using `Asset.generateBundleName()` of `entryAsset`)
- `parentBundle`: The parent bundle, is null in case of the entry bundle
- `entryAsset`: The entryPoint of the bundle, used for generating the name and gathering assets.
- `assets`: A `Set` of all assets inside the bundle
- `childBundles`: A `Set` of all child bundles
- `siblingBundles`: A `Set` of all sibling bundles
- `siblingBundlesMap`: A `Map<String(Type: js, css, map, ...), Bundle>` of all sibling bundles
- `offsets`: A `Map<Asset, number(line number inside the bundle)>` of all the locations of the assets inside the bundle, used to generate accurate source maps

#### Tree

The `Bundle` contains a `parentBundle`, `childBundles` and `siblingBundles`, all these properties together create a fast to iterate bundle tree.

A very basic example of an asset tree and it's generated bundle Tree

##### Asset tree:

`index.html` requires `index.js` and `index.css`.

`index.js` requires `test.js` and `test.txt`

```Text
index.html
├── index.js
│   ├── test.js
│   └── test.txt
└── index.css
```

##### Bundle Tree:

`index.html` gets used as an entry asset for the main bundle, this main bundle creates two child bundles one for `index.js` and one for `index.css` this because they both are different from the `html` type.

`index.js` requires two files, `test.js` and `test.txt`.

`test.js` gets added to the assets of the `index.js` bundle, as it is of the same type as `index.js`

`test.txt` creates a new bundle and gets added as a child of the `index.js` bundle as it is a different assetType than `index.js`

`index.css` has no requires and therefore only contains it's entry Asset.

`index.css` and `index.js` bundles are siblingBundles of each other as they share the same parent.

```Text
index.html
├── index.js ········ (includes index.js and test.js)
│   └── test.txt ···· (includes test.txt)
└── index.css ······· (includes index.css)
```

### Middleware

Middleware can be used to hook into an http server (e.g. `express` or node `http`).

An example of using the Parcel middleware with express

```Javascript
const Bundler = require('parcel-bundler');
const app = require('express')();

const file = 'index.html'; // Pass an absolute path to the entrypoint here
const options = {}; // See options section of api docs, for the possibilities

// Initialize a new bundler using a file and options
const bundler = new Bundler(file, options);

// Let express use the bundler middleware, this will let Parcel handle every request over your express server
app.use(bundler.middleware());

// Listen on port 8080
app.listen(8080);
```
