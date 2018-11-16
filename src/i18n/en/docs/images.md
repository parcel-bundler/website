# Images

_Supported extensions: `images`_

## Image Paths in JSX

In order to reference an image path in JSX with Parcel you must require or import the asset. This way parcel can reference the dynamically generated file name.

```js
// Import the image asset
import megaMan from "./images/mega-man.png";

// JSX
<img src={megaMan} title="Mega Man" alt="Mega Man" />

// JSX (w/ custom path)
<img src={`/dist${megaMan}`} title="Mega Man" alt="Mega Man" />
```
