---
layout: layout.njk
override:eleventyNavigation:
  key: "Getting Started"
  title: "🚀 Getting Started"
  order: 1
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
    <div id="root"></div>
    <script src="./index.ts"></script>
  </body>
</html>
```

{% endsamplefile %}
{% samplefile "src/index.ts" %}

```tsx
import React from "react";
import {render} from "react-dom";

render(<h1>Hello World</h1>, document.getElementById("root"));
```

{% endsamplefile %}
{% endsample %}
