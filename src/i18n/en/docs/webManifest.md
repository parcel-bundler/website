# WebManifest

_Supported extensions: `webmanifest`_

The [web app manifest](https://developer.mozilla.org/en-US/docs/Web/Manifest) provides information about a web application in a JSON text file, necessary for the web app to be downloaded and be presented to the user similarly to a native app (e.g., be installed on the homescreen of a device, providing users with quicker access and a richer experience). PWA manifests include its name, author, icon(s), version, description, and list of all the necessary resources (among other things).

## Usage

Import `manifest.webmanifest` directly in the `<head>` of your `index.html`

```html
<link rel="manifest" href="manifest.webmanifest" />
```
