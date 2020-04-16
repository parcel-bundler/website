---
layout: layout.njk
eleventyNavigation:
  key: React
  title: <img src="/assets/lang-icons/react.svg"/> React
  order: 5
---

Compared to Webpack, Parcel's paradigm is to use your HTML file as the entry point, not merely the main script:

{% sample "index.html" %}
{% samplefile "index.html" %}

```html
<div id="app"></div>
<script src="./index.js"></script>
```

{% endsamplefile %}
{% samplefile "index.js" %}

```jsx
import React from "react";
import ReactDom from "react-dom";

const App = () => <h1>Hello!</h1>;

ReactDom.render(document.getElementById("app"), <App />);
```

{% endsamplefile %}
{% endsample %}

## HMR (Fast Refresh)

Parcel has first-class support for _React Fast Refresh_ (which supersedes [react-hot-loader](https://github.com/gaearon/react-hot-loader), a userland plugin that botched HMR support onto React). It is (in most cases) able to retain state between reloads (even after an error).

For further information, take a look at the [official documentation](https://reactnative.dev/docs/fast-refresh).

#### Selected Limitations

##### State in class components is reset between reloads

With classe components slowly being deprecated, their state is not preserved.

##### Declaring a Default Export Using a Function Expression Isn't Recognized

{% sample %}
{% samplefile "Component.js" %}

```jsx
import React, { useState } from "react";

// Editing this component would reset `value` because the
// Fast Refresh Babel plugin cannot instrument this statement.
export default () => {
  const [value] = useState(Date.now());

  return <h1>Hello! {value}</h1>;
};
```

{% endsamplefile %}
{% samplefile "index.js" %}

```jsx
import React from "react";
import ReactDom from "react-dom";
import Component from "./Component.js";

const App = (
  <h1>
    <Component />
  </h1>
);

ReactDom.render(..., <App />);
```

{% endsamplefile %}
{% endsample %}

##### Exporting Values That Are Not Components Will Reset the State:

{% sample %}
{% samplefile "Component.js" %}

```jsx
import React, { useState } from "react";

const Component = () => {
  const [value] = useState(Date.now());

  // Editing this component would reset `value` ...
  return <h1>Hello! {value}</h1>;
};
export default Component;

// ... because of this other export.
export function utility() {
  return Date.now();
}
```

{% endsamplefile %}
{% samplefile "index.js" %}

```jsx
import React from "react";
import ReactDom from "react-dom";
import Component, { utility } from "./Component.js";

console.log(utility());

const App = (
  <h1>
    <Component />
  </h1>
);

ReactDom.render(..., <App />);
```

{% endsamplefile %}
{% endsample %}

##### Modifying the Asset That Calls Render Will Reset All State:

{% sample %}
{% samplefile "index.js" %}

```jsx
import React from "react";
import ReactDom from "react-dom";

console.log(utility());

// Understandably, modifying this will call `ReactDom.render` again.
const App = () => <h1>Hello!</h1>;

ReactDom.render(..., <App />);
```

{% endsamplefile %}
{% endsample %}
