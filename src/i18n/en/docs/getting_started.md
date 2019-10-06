# 🚀 Getting Started

Parcel is a web application bundler, differentiated by its developer experience. It offers blazing fast performance utilizing multicore processing, and requires zero configuration.

First install Parcel using Yarn or npm:

Yarn:

```bash
yarn global add parcel-bundler
```

npm:

```bash
npm install -g parcel-bundler
```

Create a package.json file in your project directory using:

```bash
yarn init -y
```

or

```bash
npm init -y
```

Parcel can take any type of file as an entry point, but an HTML or JavaScript file is a good place to start. If you link your main JavaScript file in the HTML using a relative path, Parcel will also process it for you, and replace the reference with a URL to the output file.

Next, create an index.html and index.js file.

```html
<html>
<body>
  <script src="./index.js"></script>
</body>
</html>
```
NB: Parcel converts JS assets to ES5, which won't run in in the context of a `<script type="module">` tag, so just use plain `<script>` tags with no `type` attribute in your source HTML.

```javascript
console.log('hello world')
```

Parcel has a development server built in, which will automatically rebuild your app as you change files and supports [hot module replacement](hmr.html) for fast development. Point it at your entry file:

```bash
parcel index.html
```

Now open http://localhost:1234/ in your browser. If hot module replacement isn't working you may need to [configure your editor](hmr.html#safe-write). You can also override the default port with the `-p <port number>` option.

Use the development server when you don't have your own server, or your app is entirely client rendered. If you do have your own server, you can run Parcel in `watch` mode instead. This still automatically rebuilds as files change and supports hot module replacement, but doesn't start a web server.

```bash
parcel watch index.html
```

You can also use [createapp.dev](https://createapp.dev/parcel) to create a Parcel project in the browser. Select the features you need such as React, Vue, Typescript and CSS, and you will see the project being generated in real-time. You can use this tool for learning how to set up a new project and you can also download the project as a ZIP-file and get started coding instantly.

## Multiple entry files

In case you have more than one entry file, let's say `index.html` and `about.html`, you have 2 ways to run the bundler:

Specifying the file names:

```bash
parcel index.html about.html
```

Use tokens and create a glob:

```bash
parcel *.html
```

_NOTE:_ In case you have a file structure like this:

```
- folder-1
-- index.html
- folder-2
-- index.html
```

Going to http://localhost:1234/folder-1/ won't work, instead you will need to explicitly point to the file http://localhost:1234/folder-1/index.html.

## Building for production

When you're ready to build for production, the `build` mode turns off watching and only builds once. See the [Production](production.html) section for more details.

## Adding parcel to your project

Sometimes it's not possible to install Parcel globally e.g. if you're building on someone else's build agent or you want to use a CI to build your project programmatically. In this case, you can install and run Parcel as a local package.

To install with Yarn:

```bash
yarn add parcel-bundler --dev
```

To install with NPM:

```bash
npm install parcel-bundler --save-dev
```

Then, add these tasks scripts to your project, by modifying your `package.json`:

```json
{
  "scripts": {
    "dev": "parcel <your entry file>",
    "build": "parcel build <your entry file>"
  }
}
```

Then, you will be able to run it:

```bash
# To run in development mode
yarn dev
# or
npm run dev

# To run in production mode
yarn build
# or
npm run build
```
