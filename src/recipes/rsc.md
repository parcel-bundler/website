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

## Install dependencies

```bash
npm install react@canary react-dom@canary @parcel/rsc
```

{% note %}

**Note**: Server Components currently require the canary version of `react` and `react-dom`.

{% endnote %}

## Client rendering

React Server Components can be integrated into an existing client-rendered SPA. For example, instead of returning JSON from an API server for a new feature, you can render Server Components. This can help reduce client bundle sizes by sending only the components needed to render the requested data, and omitting heavy non-interactive components (e.g. Markdown renderers) from the client bundle entirely.

### Setup targets

First, create two [targets](/features/targets/) in your `package.json`. The `client` target will point at your app's existing `index.html`. The `server` target will point at your server.

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

Next, create a server. You can use any Node.js libraries or frameworks to do this. In this example we'll use [Express](https://expressjs.com).

When the `/comments` route is requested, we'll render a Server Component to an RSC Payload, which is a serialized representation of the React component tree. You can think of this like JSON, but specialized for components.

{% sample %}
{% samplefile "server/server.js" %}

```jsx
import express from 'express';
import cors from 'cors';
import {renderRSC} from '@parcel/rsc/node';
import {Comments} from './Comments';

const app = express();
app.use(cors());

app.get('/comments', (req, res) => {
  // Render the server component to an RSC payload.
  let stream = renderRSC(<Comments />);
  res.set('Content-Type', 'text/x-component');
  stream.pipe(res);
});

app.listen(3000);
```

{% endsamplefile %}
{% endsample %}

The `@parcel/rsc` library used above is a small wrapper around lower-level React APIs.

### Server entries

Now we need to implement the `Comments` component rendered above. This is a React [Server Component](https://react.dev/reference/rsc/server-components). It _only_ runs on the server (not in the browser), and has full access to server resources like the file system or a database.

`"use server-entry"` is a Parcel-specific directive that marks a server component as the entry point of a page or route, creating a code splitting boundary. Any dependencies referenced by this route will be optimally bundled together, including client components, CSS, etc. Shared dependencies between pages, such as common libraries, will be automatically placed in a [shared bundle](/features/code-splitting/#shared-bundles).

{% sample %}
{% samplefile "server/Comments.js" %}

```jsx
"use server-entry";

export async function Comments() {
  // Load data from a database...
  let comments = await db.getComments();

  return comments.map(comment => (
    <article key={comment.id}>
      <p>Posted by: {comment.user}</p>
      {renderMarkdown(comment.body)}
    </article>
  ));
}
```

{% endsamplefile %}
{% endsample %}

In this example, we load comments from a database and render each comment to a React component tree. Rendering Markdown on the server means we don't need to load a large parsing library in the browser.

### Fetch RSC from the client

To load Server Components on the client, fetch the RSC Payload from the server and render it in a [Suspense](https://react.dev/reference/react/Suspense) boundary. `@parcel/rsc` includes a small `fetch` wrapper to make this easy.

{% sample %}
{% samplefile "src/App.js" %}

```jsx/7-9,18
import {Suspense} from 'react';
import {fetchRSC} from '@parcel/rsc/client';

export function App() {
  return (
    <>
      <h1>Client rendered</h1>
      <Suspense fallback={<>Loading comments...</>}>
        <Comments />
      </Suspense>
    </>
  );
}

let request = null;

function Comments() {
  // Simple cache to make sure we only fetch once.
  request ??= fetchRSC('http://localhost:3000/comments');
  return request;
}
```

{% endsamplefile %}
{% endsample %}

### Client components

Server Components can import Client Components to add interactivity, using React Hooks such as `useState` to update the UI. Client components are marked using the standard React [`"use client"`](https://react.dev/reference/rsc/use-client) directive. This example adds a like button to each comment.

{% sample %}
{% samplefile "server/LikeButton.js" %}

```jsx/0
"use client";

import {useState} from "react";

export function LikeButton({likes = 0}) {
  let [count, setCount] = useState(likes);

  return (
    <button onClick={() => setCount(count + 1)}>{count} likes</button>
  );
}
```

{% endsamplefile %}
{% samplefile "server/Comments.js" %}

```jsx/2,11
"use server-entry";

import {LikeButton} from './LikeButton';

export async function Comments() {
  // ...

  return comments.map(comment => (
    <article key={comment.id}>
      <p>Posted by: {comment.user}</p>
      {renderMarkdown(comment.body)}
      <LikeButton likes={comment.likes} />
    </article>
  ));
}
```

{% endsamplefile %}
{% endsample %}

### Code splitting

Server Components allow the server to tell the client what resources will be needed to render the RSC Payload. This includes both Client Components and resources like CSS. Instead of loading all possible Client Components to render any kind of data up front, or loading additional components on demand after fetching the data, Server Components enable resources to load _in parallel_ with the data.

Code splitting works the same way in Server Components as in Client Components. Use [React.lazy](https://react.dev/reference/react/lazy) with dynamic `import()` to load components on demand. Since this happens on the server, the client will start loading the necessary resources in parallel with the data.

This example renders different components depending whether it is a text, image, or video comment. Only the resources needed to render the comment types in the response will be loaded.

{% sample %}
{% samplefile "server/Comment.js" %}

```jsx
import {lazy} from 'react';

const TextComment = lazy(() => import('./TextComment'));
const ImageComment = lazy(() => import('./ImageComment'));
const VideoComment = lazy(() => import('./VideoComment'));

function Comment({comment}) {
  switch (comment.type) {
    case 'text':
      return <TextComment comment={comment} />;
    case 'image':
      return <ImageComment comment={comment} />;
    case 'video':
      return <VideoComment comment={comment} />;
  }
}
```

{% endsamplefile %}
{% endsample %}

### Server functions

React [Server Functions](https://react.dev/reference/rsc/server-functions) allow Client Components to call functions on the server, for example, updating a database or calling a backend service.

Server functions are marked with the standard React [`"use server"`](https://react.dev/reference/rsc/use-server) directive. Currently, Parcel supports `"use server"` at the top of a file, and not inline within a function.

Server functions can be imported from Client Components and called like normal functions, or passed to the `action` prop of a `<form>` element.

In this example, we'll update the `LikeButton` component to store the like count in a database.

{% sample %}
{% samplefile "server/actions.js" %}

```js/0
"use server";

export async function likeComment(id) {
  let newLikeCount = await db.incrementLikeCount(id);
  return newLikeCount;
}
```

{% endsamplefile %}
{% samplefile "server/LikeButton.js" %}

```jsx/3,8-11
"use client";

import {useState, startTransition} from "react";
import {likeComment} from './actions';

export function LikeButton({id, likes = 0}) {
  let [count, setCount] = useState(likes);
  let onClick = () => {
    startTransition(async () => {
      let newLikeCount = await likeComment(id);
      setCount(newLikeCount);
    });
  };

  return (
    <button onClick={onClick}>{count} likes</button>
  );
}
```

{% endsamplefile %}
{% endsample %}

The last step is "connecting" the client and server by making an HTTP request when an action is called.  The `setServerCallback` function in `@parcel/rsc/client` defines a function to be called when a Server Function is called from the client. Each Server Function has an id generated by Parcel, and arguments that it was called with. These should be sent as part of an HTTP request to the server.

This setup needs to be done once, and then all additional Server Functions will be handled the same way.

{% sample %}
{% samplefile "src/App.js" %}

```js
import {setServerCallback, fetchRSC} from '@parcel/rsc/client';

// ...

// Setup a callback to perform server actions.
// This sends a POST request to the server and updates the page.
setServerCallback(async (id, args) => {
  let result = await fetchRSC('/action', {
    method: 'POST',
    headers: {
      'rsc-action-id': id,
    },
    body: args,
  });
  return result;
});
```

{% endsamplefile %}
{% endsample %}

On the server, we'll need to handle POST requests and call the original server function. This will read the id of the server action passed as an HTTP header, and call the associated action. It will respond with the function's result, serialized as an RSC payload.

{% sample %}
{% samplefile "server/server.js" %}

```jsx
import {renderRSC, callAction} from '@parcel/rsc/node';

// ...

app.post('/action', async (req, res) => {
  let id = req.get('rsc-action-id');
  let {result} = await callAction(req, id);
  let stream = renderRSC(result);
  res.set('Content-Type', 'text/x-component');
  stream.pipe(res);
});
```

{% endsamplefile %}
{% endsample %}

Now, when a user clicks the like button, the server will be called to update the database, and the client will re-render with the updated like count.

This setup can also be customized to change how you call the server, for example, adding authentication headers, or even using a different transport mechanism. You can add additional server actions by exporting async functions from a file with `"use server"`, and they will all go through the same server callback.

## Server rendering

In a client-rendered React app, the entry point for your Parcel build is typically an HTML file. The output of the build might be uploaded to a static file server or CDN. After the HTML and JavaScript loads, you might request data from an API server and render it with components on the client. In the process of rendering the data, you might dynamically load additional components or data. This is a performance problem called a _network waterfall_.

React Server Components can optimize network waterfalls by rendering to HTML as part of the initial request. This avoids additional API requests to load data, and allows components needed to render the data to be loaded in parallel instead of in series.

When using server rendering, the entry point for your Parcel build is the source code for your server instead of a static HTML file.

### Quick start

To scaffold a new server-rendered app with React Server Components and Parcel, run the following commands:

```bash
npm create parcel react-server my-rsc-app
cd my-rsc-app
npm start
```

Replace `npm` with `yarn` or `pnpm` to use your preferred package manager. See below for a deep dive.

### Create a server

You can use any Node.js libraries or frameworks to create your server. In this example we'll use [Express](https://expressjs.com). This is similar to the [example above](#create-a-server) but uses `renderRequest` from `@parcel/rsc` instead of `renderRSC`. This renders HTML instead of an RSC Payload. The [server entry](#server-entries) renders the root `<html>` element for the page.

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

Start the development server with `npm start`, and open [http://localhost:3000](http://localhost:3000) to see the rendered page.

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

Finally, import `client.js` from the Page component, along with any Client Components:

{% sample %}
{% samplefile "src/Page.js" %}

```jsx/2,10
"use server-entry";

import './client';
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
{% endsample %}

The page now loads a `<script>` including the `Counter` component, which updates client state on click.

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

export function About() {
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

However, you may notice that when clicking the "Home" link, the browser does a full page refresh. To improve the responsiveness of navigation, you can fetch a new RSC payload from the server and update the component tree in place instead.

`@parcel/rsc/client` includes a `fetchRSC` function, which is a small wrapper around the `fetch` API that returns a new React tree. Passing this to the `updateRoot` function returned by `hydrate` will update the page with the new content.

As a simple example, we can intercept the `click` event on links to trigger client side navigation. The browser `history.pushState` API can be used to update the browser's URL bar once the page is finished loading.

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

{% note %}

This example re-renders the entire page during client navigation. In a real app, it might be beneficial to load only the part of the page that changed (e.g. excluding common parts such as a sidebar). Router libraries with support for nested routes make this easier.

{% endnote %}

### Server functions

In a server-rendered app, React Server Functions work similarly to the [example above](#server-functions). The `hydrate` function in `@parcel/rsc/client` accepts a `callServer` function as an option, which is responsible for making a request to the server.

The server may also want to re-render the page when a Server Function is called. In this example, it returns the new page alongside the function's return value. The client updates the page accordingly.

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
2. A `.rsc` file, which can be used to perform client side navigation. This speeds up subsequent navigation similar to a single page app.

To enable client side navigations, implement a `client.js` file similar to the [example above](#routing). In this case, replace `.html` with `.rsc` when fetching.

{% sample %}
{% samplefile "src/client.js" %}

```js/7
"use client-entry";

import {hydrate, fetchRSC} from '@parcel/rsc/client';

let updateRoot = hydrate();

async function navigate(pathname, push = false) {
  let root = await fetchRSC(pathname.replace('.html', '.rsc'));
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
  );
}
```

{% endsamplefile %}
{% endsample %}

Now [http://localhost:3000/static](http://localhost:3000/static) will display a statically rendered page.

When deploying, you could also upload the `dist/client` and `dist/static` directories to a CDN, and deploy the `dist/server` directory to a server.
