---
layout: layout.njk
title: React Server Components
eleventyNavigation:
  key: recipes-rsc
  title: <img src="/assets/lang-icons/react.svg" alt=""/> React Server Components
  order: 4
---

React Server Components are a new type of component that renders ahead of time, on the server or at build time. Parcel v2.14.0 and newer supports React Server Components out of the box.

{% warning %}

**React Server Components support is currently in beta.** If you experience bugs, please report them [on GitHub](https://github.com/parcel-bundler/parcel/issues).

{% endwarning %}

## Examples

The [rsc-examples](https://github.com/parcel-bundler/rsc-examples) repo includes complete example apps built with React Server Components and Parcel.

## Server rendering

In a client-only React app, the entry point for your Parcel build is typically an HTML file. The output of the build might be uploaded to a static file server or CDN. However, if you want to respond to each request with dynamic content, there is an additional step where a server generates the HTML to send to the browser. In this case, the entry point for your Parcel build is the source code for your server instead of a static HTML file.

### Quick start

To scaffold a new server-rendered app with React Server Components and Parcel, run the following commands:

```bash
npm create parcel react-server my-rsc-app
cd my-rsc-app
npm start
```

Replace `npm` with `yarn` or `pnpm` to use your preferred package manager. See below for a deep dive.

### Create a server

First, install the necessary dependencies:

```bash
npm install react@canary react-dom@canary @parcel/rsc
```

{% note %}

**Note**: Server Components currently require the canary version of `react` and `react-dom`.

{% endnote %}

Next, create a server. You can use any Node.js libraries or frameworks to do this. In this example we'll use [Express](https://expressjs.com).

{% sample %}
{% samplefile "package.json" %}

```json
{
  "server": "dist/server.js",
  "targets": {
    "server": {
      "source": "src/server.js",
      "context": "react-server"
    }
  },
  "scripts": {
    "start": "parcel",
    "build": "parcel build"
  }
}
```

{% endsamplefile %}
{% samplefile "src/server.js" %}

```jsx
import express from 'express';
import {renderRequest} from '@parcel/rsc/node';
import {Page} from './Page';

// Create an Express app and serve the dist folder.
const app = express();
app.use('/client', express.static('dist/client'));

// Create a route for the home page.
app.get('/', async (req, res) => {
  await renderRequest(req, res, <Page />, {component: Page});
});

app.listen(3000);
```

{% endsamplefile %}
{% endsample %}

The `@parcel/rsc` library used above is a small wrapper around lower-level React APIs that render your app to HTML.

### Server entries

Now we need to implement the `Page` component rendered above. This is a React [server component](https://react.dev/reference/rsc/server-components). It _only_ runs on the server (not in the browser), and has full access to server resources like the file system or a database.

`"use server-entry"` is a Parcel-specific directive that marks a server component as the entry point of a page, creating a code splitting boundary. Any dependencies referenced by this page will be optimially bundled together, including client components, CSS, etc. Shared dependencies between pages, such as common libraries, will be automatically placed in a [shared bundle](/features/code-splitting/#shared-bundles).

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

Open [http://localhost:3000](http://localhost:3000) to see the rendered page.

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

With the above setup done, you can now import Client Components to add interactivity to the page. Client components are rendered to HTML on the server, and support React Hooks such as `useState` to update the UI on the client. Client components are marked using the standard React [`"use client"`](https://react.dev/reference/rsc/use-client) directive.

{% sample %}
{% samplefile "src/Counter.js" %}

```jsx/0
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

```jsx/4-6
import {About} from './About';

// ...

app.get('/about', async (req, res) => {
  await renderRequest(req, res, <About />, {component: About});
});
```

{% endsamplefile %}
{% samplefile "src/About.js" %}

```jsx
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

```jsx
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

The last step is "connecting" the client and server by making an HTTP request when an action is called. The `hydrate` function in `@parcel/rsc/client` accepts a `callServer` function as an option. When a server action is called on the client, it will go through `callServer`, which is responsible for making a request to the server.

{% sample %}
{% samplefile "src/client.js" %}

```js
"use client-entry";

import {hydrate, fetchRSC} from '@parcel/rsc/client';

let updateRoot = hydrate({
  // Setup a callback to perform server actions.
  // This sends a POST request to the server and updates the page.
  async callServer(id, args) {
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

```jsx
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

This setup can also be customized to change how you call the server, for example, adding authentication headers, or even using a different transport mechanism. You can add additional server actions by exporting async functions from a file with `"use server"`, and they will all go through `callServer`.

## Static rendering

Parcel supports pre-rendering React Server Components to fully static HTML at build time. For example, a marketing page or blog post is often static, and does not contain dynamic data personalized for the user. Pre-rendering allows these pages to be served directly from a CDN rather than requiring a server.

### Quick start

To set up a new project with fully static rendering, run the following commands:

```bash
npm create parcel react-static my-static-site
cd my-static-site
npm start
```

Replace `npm` with `yarn` or `pnpm` to use your preferred package manager. See below for a deep dive.

### Setup

Use the `"react-static"` target name to pre-render entries to static HTML.

{% sample %}
{% samplefile "package.json" %}

```json
{
  "targets": {
    "react-static": {
      "source": "pages/**/*.{js,tsx,mdx}",
      "context": "react-server"
    }
  }
}
```

{% endsamplefile %}
{% endsample %}

With this configuration, components in the `pages` directory will be rendered to HTML files in the `dist` directory. Statically rendered components receive a list of pages as a prop, which allows you to render a navigation list.

{% sample %}
{% samplefile "pages/index.tsx" %}

```tsx
import type {PageProps} from '@parcel/rsc';
import '../src/client';

export default function Index({pages, currentPage}: PageProps) {
  return (
    <html>
      <body>
        <nav>
          <ul>
            {pages.map(page => (
              <li key={page.url}>
                <a
                  href={page.url}
                  aria-current={page.url === currentPage.url ? 'page' : undefined}>
                  {page.name.replace('.html', '')}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </body>
    </html>
  );
}
```

{% endsamplefile %}
{% endsample %}

For each page, Parcel outputs two files:

1. A `.html` file, which is used when loading the page from scratch.
2. A `.rsc` file, which can be used to perform client side navigations. This speeds up subsequent navigations similar to a single page app.

To enable client side navigations, implement a `client.js` file similar to the [example above](#routing). In this case, replace `.html` with `.rsc` when fetching.

{% sample %}
{% samplefile "src/client.js" %}

```js/7
"use client-entry";

import {hydrate, fetchRSC} from '@parcel/rsc/client';

let updateRoot = hydrate();

async function navigate(pathname, push = false) {
  let root = await fetchRSC(pathname.replace('.html', '.rsc');
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

### MDX

[MDX](https://mdxjs.com/) is a variant of Markdown that compiles to JSX. Parcel supports MDX out of the box.

Static exports are available from MDX layouts via the `exports` property of each page in the `pages` and `currentPage` props. For example, you could export a `title` property for use in the `<title>` element, or when rendering a navigation list of all pages.

In addition, a `tableOfContents` property is also generated. This is a tree of all of the headings in the MDX file, which you can use to render a table of contents in an MDX layout.

{% sample %}
{% samplefile "pages/index.mdx" %}

```md
import Layout from '../src/MDXLayout';
export default Layout;

export const title = 'Static MDX';

# Hello, MDX!

This is a static MDX file.
```

{% endsamplefile %}
{% samplefile "src/MDXLayout.tsx" %}

```tsx
import type {ReactNode} from 'react';
import type {PageProps, TocNode} from '@parcel/rsc';
import './client';

interface LayoutProps extends PageProps {
  children: ReactNode
}

export default function Layout({children, pages, currentPage}: LayoutProps) {
  return (
    <html lang="en">
      <head>
        <title>{currentPage.exports!.title}</title>
      </head>
      <body>
        <main>{children}</main>
        <aside><Toc toc={currentPage.tableOfContents!} /></aside>
      </body>
    </html>
  );
}

function Toc({toc}: {toc: TocNode[]}) {
  return toc.length > 0 ? (
    <ul>
      {toc.map((page, i) => (
        <li key={i}>
          {page.title}
          <Toc toc={t.children} />
        </li>
      ))}
    </ul>
  ) : null;
}
```

{% endsamplefile %}
{% endsample %}

See Parcel's [MDX documentation](/languages/mdx/) for more details.

### Mixing static and dynamic

You can mix statically rendered pages with server rendered dynamic pages within the same app. This can be done by creating multiple targets.

{% sample %}
{% samplefile "package.json" %}

```json
{
  "server": "dist/server.js",
  "targets": {
    "server": {
      "source": "src/server.js",
      "context": "react-server"
    },
    "react-static": {
      "source": "pages/**/*.js",
      "distDir": "dist/static",
      "context": "react-server"
    }
  }
}
```

{% endsamplefile %}
{% endsample %}

With this configuration, Parcel will statically render components in the `pages` directory and output HTML files into `dist/static`.

Next, update your server to respond to requests for statically rendered pages. This example responds with a `.html` file when `text/html` is requested, and a `.rsc` file when `text/x-component` is requested (during client navigations).

{% sample %}
{% samplefile "src/server.js" %}

```js
import express from 'express';

const app = express();
app.use('/client', express.static('dist/client'));

// Respond to requests for statically rendered pages.
app.get('/*', (req, res, next) => {
  res.format({
    'text/html': () => sendFile(req.url + '.html', res, next),
    'text/x-component': () => sendFile(req.url + '.rsc', res, next),
    default: next
  });
});

function sendFile(path, res, next) {
  res.sendFile(path, {root: 'dist/static'}, err => {
    if (err) next();
  });
}

app.listen(3000);
```

{% endsamplefile %}
{% samplefile "pages/static.js" %}

```jsx
export default function StaticPage() {
  return (
    <html>
      <body>
        <p>This page is statically rendered at build time!</p>
      </body>
    </html>
  )
}
```

{% endsamplefile %}
{% endsample %}

Now [http://localhost:3000/static](http://localhost:3000/static) will display a statically rendered page.

## Client rendering

If you have an existing client-rendered React app, you can integrate React Server Components without rewriting the entire app. For example, a new feature could use React Server Components to dynamically render components based on data from a database while keeping client bundle sizes minimal.

### Setup targets

First, create two [targets](/features/targets/) in your `package.json`. The `client` target will point at your existing `index.html`. The `server` target will point at your new server.

{% sample %}
{% samplefile "package.json" %}

```json
{
  "client": "dist/index.html",
  "server": "dist/server.js",
  "targets": {
    "client": {
      "source": "src/index.html",
      "context": "react-client"
    },
    "server": {
      "source": "server/server.js",
      "context": "react-server"
    }
  },
  "scripts": {
    "start": "parcel",
    "build": "parcel build"
  }
}
```

{% endsamplefile %}
{% endsample %}

Parcel will build both the client and server together.

### Create a server

Next, create the server following the [steps above](#server-rendering). Since the initial app is client rendered, you only need to render an RSC payload not HTML, which can be done with the `renderRSC` function.

{% sample %}
{% samplefile "server/server.js" %}

```jsx
import express from 'express';
import {renderRSC} from '@parcel/rsc/node';

import {RSC} from './RSC';

const app = express();
app.get('/rsc', (req, res) => {
  // Render the server component to an RSC payload.
  // Since this app is initially client rendered, we don't need to SSR it to HTML.
  let stream = renderRSC(<RSC />);
  res.set('Content-Type', 'text/x-component');
  stream.pipe(res);
});

app.listen(3000);
```

{% endsamplefile %}
{% endsample %}

### Fetch RSC from client

On the client, fetch the RSC payload from the server and render it in a [Suspense](https://react.dev/reference/react/Suspense) boundary.

{% sample %}
{% samplefile "src/App.js" %}

```jsx
import {Suspense} from 'react';
import {fetchRSC} from '@parcel/rsc/client';

export function App() {
  return (
    <>
      <h1>Client rendered</h1>
      <Suspense fallback={<>Loading RSC</>}>
        <RSC />
      </Suspense>
    </>
  );
}

let request = null;

function RSC() {
  // Simple cache to make sure we only fetch once.
  request ??= fetchRSC('http://localhost:3000/rsc');
  return request;
}
```

{% endsamplefile %}
{% endsample %}
