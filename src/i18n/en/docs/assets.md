# 📦 Assets

Parcel is based around assets. An asset can represent any file, but Parcel has special support for certain types of assets like JavaScript, CSS, and HTML files. Parcel automatically analyzes the dependencies referenced in these files and includes them in the output bundle. Assets of similar types are grouped together into the same output bundle. If you import an asset of a different type (for example, if you imported a CSS file from JS), it starts a child bundle and leaves a reference to it in the parent. This will be illustrated in the following sections.

If you are unable to find a certain asset type in the docs it might be that the documentation is out of date. For the entire list of supported asset types see [parcel/src/Parser.js](https://github.com/parcel-bundler/parcel/blob/master/packages/core/parcel-bundler/src/Parser.js#L10).
For the actual list of Parsers see [parcel/src/assets/](https://github.com/parcel-bundler/parcel/tree/master/packages/core/parcel-bundler/src/assets).

For any asset type not supported by default you can check if a plugin already exists:

- [Yarn](https://yarnpkg.com/en/packages?q=parcel-plugin-&p=1)
- [npm](https://www.npmjs.com/search?q=parcel-plugin-)
- [awesome-parcel](https://github.com/parcel-bundler/awesome-parcel#plugins)

or [create your own](https://parceljs.org/plugins.html).
