# SCSS

_Supported extensions: `sass`, `scss`_

## Requirements

SCSS compilation needs `sass` (JS version of `dart-sass`) module. This will be installed automatically the first time you run parcel. It's also possible to install it manually before running parcel.

To install it with npm:

```bash
npm install -D sass
```

To install it with yarn:

```bash
yarn add -D sass
```

It's also strongly recommended to create a `.sassrc` file and add `node_modules` as include path to avoid an [issue](https://github.com/parcel-bundler/parcel/issues/39#issuecomment-443061650)

```
{
  "includePaths": ["node_modules"]
}
```

This file controls the sass compilation with Parcel. Another thing that can be configured is the output style of the generated CSS by specifying it like so:

```
{
  "includePaths": ["node_modules"],
  outputStyle: "nested",
}
```

## Usage

To use `sass` you can import SCSS files from JavaScript files.

```javascript
import './custom.scss'
```
You can also directly include the SCSS file in a HTML file. 

```html
<link rel="stylesheet" href="./style.scss">
```

Dependencies in the SCSS files can be used with the `@import` statements.

**Notes:** You can also use `node-sass` module for SCSS compilation. Using `node-sass` module will give you faster compilation. However, [an issue](https://github.com/parcel-bundler/parcel/issues/1836) has been reported using `node-sass` module with Parcel.

