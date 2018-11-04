# SCSS

_Supported extensions: `sass`, `scss`_

SCSS compilation needs `sass` (JS version of `dart-sass`) module. To install it with npm:

```bash
npm install -D sass
```

Once you have `sass` installed you can import SCSS files from JavaScript files.

```javascript
import './custom.scss'
```

Dependencies in the SCSS files can be used with the `@import` statements.

If you don't have `sass` module installed before running Parcel, Parcel will install it automatically for you.

**Notes:** You can also use `node-sass` module for SCSS compilation. Using `node-sass` module will give you faster compilation. However, [an issue](https://github.com/parcel-bundler/parcel/issues/1836) has been reported using `node-sass` module with Parcel.
