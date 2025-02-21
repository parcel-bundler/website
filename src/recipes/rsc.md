---
layout: layout.njk
title: React Server Components
eleventyNavigation:
  key: recipes-rsc
  title: <img src="/assets/lang-icons/react.svg" alt=""/> React Server Components
  order: 4
---

React Server Components are a new type of React component that renders ahead of time, before bundling, in an environment separate from your client app or SSR server. Parcel v2.14.0 and newer supports React Server Components out of the box.

## Quick start

To quickly scaffold a new React Server Components app with Parcel, run the following commands:

```bash
npm create parcel react-server my-rsc-app
cd my-rsc-app
npm start
```

Replace `npm` with `yarn` or `pnpm` to use your preferred package manager. See below for a deep dive.

### Examples

The [rsc-examples](https://github.com/parcel-bundler/rsc-examples) repo includes complete example apps built with React Server Components and Parcel.

## Getting started

In a client-only React app, the entry point for your Parcel build is typically an HTML file. The output of the build might be uploaded to a static file server or CDN. However, if you want to respond to each request with dynamic content, there is an additional step where a server generates the HTML to send to the browser. In this case, the entry point for your Parcel build is the source code for your server instead of a static HTML file.

### Create a server

First, install the necessary dependencies:

```bash
npm install react react-dom @parcel/rsc
```

Next, create a server. You can use any Node.js libraries or frameworks to do this. In this example we'll use [Express](https://expressjs.com).

{% sample %}
{% samplefile "src/server.js" %}

```js
import express from 'express';
import {renderRequest} from '@parcel/rsc/node';
import {Page} from './Page';

// Create an Express app and serve the dist folder.
const app = express();
app.use(express.static('dist'));

// Create a route for the home page.
app.get('/', async (req, res) => {
  await renderRequest(req, res, <Page />, {component: Page});
});

app.listen(3000);
```

{% endsamplefile %}
{% endsample %}

The `@parcel/rsc` library used above is a small wrapper around some lower level React APIs that render your app to HTML.

### Server entries

Now we need to implement the `Page` component rendered above. This is a React [server component](https://react.dev/reference/rsc/server-components). It _only_ runs on the server (not in the browser), and has full access to server resources like the file system or a database.

`"use server-entry"` is a Parcel-specific directive that marks a server component as an entry point of a page, creating a code splitting boundary. Any dependencies referenced by this page will be optimially bundled together, including client components, CSS, etc. Shared dependencies between pages, such as common libraries, will be automatically placed in a [shared bundle](/features/code-splitting/#shared-bundles).

{% sample %}
{% samplefile "src/Page.js" %}

```jsx
"use server-entry";

export function Page() {
  return (
    <html>
      <head>
        <title>Parcel React Server App</title>
      </head>
      <body>
        <h1>Hello world!</h1>
      </body>
    </html>
  );
}
```

{% endsamplefile %}
{% endsample %}

At this point, the application should start when running `parcel src/server.js`, and render the above page when loading <a href="http://localhost:3000">http://localhost:3000</a>.

### Client entry

React Server Components seamlessly integrate client and server code in one unified component tree. But so far, our app only renders static HTML. To add interactivity, we first need to _hydrate_ the page in the browser.

To hydrate the page, create a new `src/client.js` file, and mark it as a client entry with the Parcel-specific `"use client-entry"` directive. This tells Parcel that it should run _only_ in the browser, and not on the server, and that it should run immediately on page load. The `@parcel/rsc/client` library can be used to hydrate the page, using data injected into the HTML by `@parcel/rsc/node` on the server.

{% sample %}
{% samplefile "src/client.js" %}

```js
"use client-entry";

import {hydrate} from '@parcel/rsc/client';

hydrate();
```

{% endsamplefile %}
{% endsample %}

Finally, import `client.js` from the Page component:

{% sample %}
{% samplefile "src/Page.js" %}

```jsx/2
"use server-entry";

import './client';

export function Page() {
  // ...
}
```

{% endsamplefile %}
{% endsample %}

Loading the page again should look the same as before, but now there should be a `<script>` tag loaded that hydrates the page.

### Client components

With the above setup done, you can now import and use Client Components to add interactivity to the page. Client components are marked using the standard React [`"use client"`](https://react.dev/reference/rsc/use-client) directive.

{% sample %}
{% samplefile "src/Counter.js" %}

```js/0
"use client";

import {useState} from "react";

export function Counter() {
  let [count, setCount] = useState(0);

  return (
    <button onClick={() => setCount(count + 1)}>Count: {count}</button>
  );
}
```

{% endsamplefile %}
{% samplefile "src/Page.js" %}

```jsx/2,9
"use server-entry";

import {Counter} from './Counter';

export function Page() {
  return (
    <html>
      <body>
        {/* ... */}
        <Counter />
      </body>
    </html>
  );
}
```

{% endsamplefile %}
{% endsample %}

### Routing

So far, we only have one page. To add another, create a new route in the server code, along with a new component to render.

{% sample %}
{% samplefile "src/server.js" %}

```js/4-6
import {About} from './About';

// ...

app.get('/about', async (req, res) => {
  await renderRequest(req, res, <About />, {component: About});
});
```

{% endsamplefile %}
{% samplefile "src/About.js" %}

```js
"use server-entry";

import './client';

export function Page() {
  return (
    <html>
      <head>
        <title>About</title>
      </head>
      <body>
        <h1>About</h1>
        <a href="/">Home</a>
      </body>
    </html>
  );
}
```

{% endsamplefile %}
{% endsample %}

Now you should be able to load <a href="http://localhost:3000/about">http://localhost:3000/about</a>.

However, you may notice that when clicking the "Home" link, the browser does a full page refresh. To improve the responsiveness of navigations, you can fetch a new RSC payload from the server and update the component tree in place instead.

`@parcel/rsc/client` includes a `fetchRSC` function, which is a small wrapper around the `fetch` API that returns a new React tree. Passing this to the `updateRoot` function returned by `hydrate` will update the page with the new content.

As a simple example, we can intercept the `click` event on links to trigger navigations. The browser `history.pushState` API can be used to update the browser's URL bar once the page is finished loading.

{% sample %}
{% samplefile "src/client.js" %}

```js
"use client-entry";

import {hydrate, fetchRSC} from '@parcel/rsc/client';

let updateRoot = hydrate();

async function navigate(pathname, push = false) {
  let root = await fetchRSC(pathname);
  updateRoot(root, () => {
    if (push) {
      history.pushState(null, '', pathname);
    }
  });
}

// Intercept link clicks to perform RSC navigation.
document.addEventListener('click', e => {
  let link = e.target.closest('a');
  if (link) {
    e.preventDefault();
    navigate(link.pathname, true);
  }
});

// When the user clicks the back button, navigate with RSC.
window.addEventListener('popstate', e => {
  navigate(location.pathname);
});
```

{% endsamplefile %}
{% endsample %}

### Server functions

React [Server Functions](https://react.dev/reference/rsc/server-functions) allow Client Components to call functions on the server, for example, updating a database or calling a backend service.

Server functions are marked with the standard React [`"use server"`](https://react.dev/reference/rsc/use-server) directive. Currently, Parcel supports `"use server"` at the top of a file, and not inline within a function.

Server functions can be imported from Client Components and called like normal functions, or passed to the `action` prop of a `<form>` element.

{% sample %}
{% samplefile "src/actions.js" %}

```js
"use server";

export function createAccount(formData) {
  let username = formData.get('username');
  let password = formData.get('password');
  // ...
}
```

{% endsamplefile %}
{% samplefile "src/CreateAccountForm.js" %}

```js
import {createAccount} from './actions';

export function CreateAccountForm() {
  return (
    <form action={createAccount}>
      <input name="username" />
      <input type="password" name="password" />
    </form>
  )
}
```

{% endsamplefile %}
{% endsample %}

The last step is "connecting" the client and server by making an HTTP request when an action is called. The `hydrate` function in `@parcel/rsc/client` accepts a `handleServerAction` function as an option. When a server action is called on the client, it will go through `handleServerAction`, which is responsible for making a request to the server.

{% sample %}
{% samplefile "src/client.js" %}

```js
"use client-entry";

import {hydrate, fetchRSC} from '@parcel/rsc/client';

let updateRoot = hydrate({
  // Setup a callback to perform server actions.
  // This sends a POST request to the server and updates the page.
  async handleServerAction(id, args) {
    let {result, root} = await fetchRSC('/', {
      method: 'POST',
      headers: {
        'rsc-action-id': id,
      },
      body: args,
    });
    updateRoot(root);
    return result;
  },
});

// ...
```

{% endsamplefile %}
{% endsample %}

On the server, we'll need to handle POST requests and call the original server function. This will read the id of the server action passed as an HTTP header, and call the associated action. Then it will re-render the requested page with any updated data, and return the function's result.

{% sample %}
{% samplefile "src/server.js" %}

```js
import {renderRequest, callAction} from '@parcel/rsc/node';

// ...

app.post('/', async (req, res) => {
  let id = req.get('rsc-action-id');
  let {result} = await callAction(req, id);
  let root = <Page />;
  if (id) {
    root = {result, root};
  }
  await renderRequest(req, res, root, {component: Page});
});
```

{% endsamplefile %}
{% endsample %}

This setup can also be customized to change how you call the server, for example, adding authentication headers, or even using a different transport mechanism entirely. Once the setup is complete, you can add additional server actions by exporting async functions from a file with `"use server"`, and they will all go through `handleServerAction`.
