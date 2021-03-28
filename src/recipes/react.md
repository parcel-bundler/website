---
layout: layout.njk
eleventyNavigation:
  key: recipes-react
  title: <img src="/assets/lang-icons/react.svg" alt=""/> React
  order: 3
---

Compared to Webpack, Parcel's paradigm is to use your HTML file as the entry point, not merely the main script:

{% sample "parcel index.html" %}
{% samplefile "index.html" %}

```html
<!DOCTYPE html>
<div id="app"></div>
<script src="./index.js"></script>
```

{% endsamplefile %}
{% samplefile "index.js" %}

```jsx
import React from "react";
import ReactDom from "react-dom";

const App = () => <h1>Hello!</h1>;

ReactDom.render(<App />, document.getElementById("app"));
```

{% endsamplefile %}
{% endsample %}

## HMR (Fast Refresh)

Parcel has first-class support for _React Fast Refresh_ (which supersedes [react-hot-loader](https://github.com/gaearon/react-hot-loader), a userland plugin that botched HMR support onto React). It is (in most cases) able to retain state between reloads (even after an error).

For further information, take a look at the [official documentation](https://reactnative.dev/docs/fast-refresh).

#### Selected Limitations

##### State in class components is reset between reloads

With class components slowly being deprecated, their state will not be preserved.

##### Declaring a Default Export Using a Function Expression Isn't Recognized

Editing this component would reset `value` because the Fast Refresh Babel plugin cannot instrument the default export declaration.

{% sample %}
{% samplefile "Component.js" %}

```jsx/2
import React, { useState } from "react";

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

const App = () => (
  <h1>
    <Component />
  </h1>
);

ReactDom.render(<App />, ...);
```

{% endsamplefile %}
{% endsample %}

[See also Dan Abramov's tweet](https://twitter.com/dan_abramov/status/1255229440860262400)

##### Exporting Values That Are Not Components Will Reset the State:

Editing `Component` would reset the `value` state, because of the other non-component export.

{% sample %}
{% samplefile "Component.js" %}

```jsx/5,9
import React, { useState } from "react";

const Component = () => {
  const [value] = useState(Date.now());

  return <h1>Hello! {value}</h1>;
};
export default Component;

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

const App = () => (
  <h1>
    <Component />
  </h1>
);

ReactDom.render(<App />, ...);
```

{% endsamplefile %}
{% endsample %}

##### Modifying the Asset That Calls Render Will Reset All State:

Understandably, modifying `App` will call `ReactDom.render` again:

{% sample %}
{% samplefile "index.js" %}

```jsx/3,5
import React from "react";
import ReactDom from "react-dom";

const App = () => <h1>Hello!</h1>;

ReactDom.render(<App />, ...);
```

{% endsamplefile %}
{% endsample %}

(The HMR functionality is provided by `@parcel/transformer-react-refresh-babel`, `@parcel/transformer-react-refresh-wrap` and `@parcel/runtime-react-refresh`.)
