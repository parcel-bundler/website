# 📝 Asset Types

As described in the [Assets documentation](assets.html), Parcel represents each input file as an `Asset`. Asset types are represented as classes inheriting from the base `Asset` class and implementing the required interface to parse, analyze dependencies, transform, and code generate.

Because Parcel processes assets in parallel across multiple processor cores, the transforms that asset types can perform are limited to those that operate on a single file at a time. For transforms across multiple files, a custom [Packager](packagers.html) can be used.

## Asset Interface

```javascript
const {Asset} = require('parcel-bundler');

class MyAsset extends Asset {
  type = 'foo'; // set the main output type.

  async parse(code) {
    // parse code to an AST
    return ast;
  }

  async pretransform() {
    // optional. transform prior to collecting dependencies.
  }

  collectDependencies() {
    // analyze dependencies
    this.addDependency('my-dep');
  }

  async transform() {
    // optional. transform after collecting dependencies.
  }

  async generate() {
    // code generate. you can return multiple renditions if needed.
    // results are passed to the appropriate packagers to generate final bundles.
    return [
      {
        type: 'foo',
        value: 'my stuff here' // main output
      },
      {
        type: 'js',
        value: 'some javascript', // alternative rendition to be placed in JS bundle if needed
        sourceMap
      }
    ];
  }

  async postProcess(generated) {
    // Process after all code generating has been done
    // Can be used for combining multiple asset types
  }
}
```

## Registering an Asset Type

You can register your asset type with a bundler using the `addAssetType` method. It accepts a file extension to register, and the path to your asset type module. It is a path rather than the actual object so that it can be passed to worker processes.

```javascript
const Bundler = require('parcel-bundler');

let bundler = new Bundler('input.js');
bundler.addAssetType('.ext', require.resolve('./MyAsset'));
```
