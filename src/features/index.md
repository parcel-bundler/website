---
layout: layout.njk
override:eleventyNavigation:
  key: Features
  order: 2
---

{% sample "src/index.html" %}
{% samplefile %}

```
├── package.json
├── src
│   ├── index.html
│   └── index.ts
└── yarn.lock
```

{% endsamplefile %}
{% samplefile "src/index.html" %}

```html
<!DOCTYPE html>
<html>
  <body>
    <h1 id="greeting"></h1>
    <script src="./index.ts"></script>
  </body>
</html>
```

{% endsamplefile %}
{% samplefile "src/index.ts" %}

```ts
import React from "react";
import {render} from "react-dom";

const variable: string = "Hello, World!";

document.getElementById("greeting").innerHTML = variable;
```

{% endsamplefile %}
{% endsample %}
