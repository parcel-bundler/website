# SCSS

_Supported extensions: `sass`, `scss`_

SCSS compilation needs `sass` (JS version of `dart-sass`) module. 

To install it with npm:

```bash
npm install -D sass
```

To install it with yarn:

```bash
yarn add -D sass
```

Once you have `sass` installed you can import SCSS files from JavaScript files.

```javascript
import './custom.scss'
```
You can also directly include the SCSS file in a HTML file. 

```html
<link rel="stylesheet" href="./style.scss">
```

Dependencies in the SCSS files can be used with the `@import` statements.

If you don't have `sass` module installed before running Parcel, Parcel will install it automatically for you.

Addtionally, you can configure sass compilation with Parcel by creating a configuration file such as: .sassrc

For instance, you can control the output style of the generated CSS by specifying it like so:

{
  outputStyle: "nested",
}


**Notes:** You can also use `node-sass` module for SCSS compilation. Using `node-sass` module will give you faster compilation. However, [an issue](https://github.com/parcel-bundler/parcel/issues/1836) has been reported using `node-sass` module with Parcel.

