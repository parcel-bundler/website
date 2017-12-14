# 🛠 How It Works

Parcel transforms a tree of **assets** to a tree of **bundles**. Many other bundlers are fundamentally based around JavaScript assets, with other formats tacked on - e.g. inlined as strings into JS files. Parcel is file-type agnostic - it will work with any type of assets the way you'd expect, with no configuration. There are three steps to Parcel's bundling process.

### 1. Constructing the Asset Tree

Parcel takes as input a single entry asset, which could be any type: a JS file, HTML, CSS, image, etc. There are various [asset types](asset_types.html) defined in Parcel which know how to handle specific file types. The assets are parsed, their dependencies are  extracted, and they are transformed to their final compiled form. This creates a tree of assets.

### 2. Constructing the Bundle Tree

Once the asset tree has been constructed, the assets are placed into a bundle tree. A bundle is created for the entry asset, and child bundles are created for dynamic `import()`s, which cause code splitting to occur.

Sibling bundles are created when assets of a different type are imported, for example if you imported a CSS file from JavaScript, it would be placed into a sibling bundle to the corresponding JavaScript.

If an asset is required in more than one bundle, it is hoisted up to the nearest common ancestor in the bundle tree so it is not included more than once.

### 3. Packaging

After the bundle tree is constructed, each bundle is written to a file by a [packager](packagers.html) specific to the file type. The packagers know how to combine the code from each asset together into the final file that is loaded by a browser.
