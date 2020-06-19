---
layout: layout.njk
eleventyNavigation:
  title: 🌐 Generic Webapp
  order: 1
---

TODO

- differential serving
- browserslist

The Parcel CLI is built into the main `parcel` package. While you can install
it globally and run it, it is much better to install it locally into your
project as a dev dependency.

```bash
yarn add --dev parcel@next
```

You should also add some "scripts" to your `package.json` to run it easier.

Now you can run `yarn start` to spin up a development server and `yarn build` to bundle your project for production.

{% sample "parcel src/index.html", "column" %}
{% samplefile "package.json" %}

```json
{
  "name": "my-project",
  "scripts": {
    "start": "parcel src/index.html",
    "build": "parcel build src/index.html"
  },
  "devDependencies": {
    "parcel": "next"
  }
}
```

{% endsamplefile %}
{% samplefile "src/index.html" %}

```html
<!DOCTYPE html>
<html>
  <body>
    <div id="root"></div>
    <script src="./index.ts"></script>
  </body>
</html>
```

{% endsamplefile %}
{% samplefile "src/index.ts" %}

```tsx
import React from "react";
import { render } from "react-dom";

render(<h1>Hello World</h1>, document.getElementById("root"));
```

{% endsamplefile %}
{% endsample %}
