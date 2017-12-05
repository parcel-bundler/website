# 📦 Packagers

In Parcel, a `Packager` combines multiple `Asset`s together into a final output bundle. This happens in the main process after all assets have been processed, and a bundle tree has been created. Packagers are registered based on output file type, and assets that have generated that output type are sent to that packager for production of the final output file.

## Packager Interface

```javascript
const {Packager} = require('parcel-bundler');

class MyPackager extends Packager {
  async start() {
    // optional. write file header if needed.
    await this.dest.write(header);
  }

  async addAsset(asset) {
    // required. write the asset to the output file.
    await this.dest.write(asset.generated.foo);
  }

  async end() {
    // optional. write file trailer if needed.
    await this.dest.end(trailer);
  }
}
```

## Registering a Packager

You can register your packager with a bundler using the `addPackager` method. It accepts a file type to register, and the path to your packager module.

```javascript
const Bundler = require('parcel-bundler');

let bundler = new Bundler('input.js');
bundler.addPackager('foo', require.resolve('./MyPackager'));
```
