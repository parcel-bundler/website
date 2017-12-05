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

```javascript
console.log("hello world");
```

Parcel has a development server built in, which will automatically rebuild your app as you change files and supports [hot module replacement](hmr.html) for fast development. Just point it at your entry file:

```bash
parcel index.html
```

Now open http://localhost:1234/ in your browser. You can also override the default port with the `-p <port number>` option.

Use the development server when you don't have your own server, or your app is entirely client rendered. If you do have your own server, you can run Parcel in `watch` mode instead. This still automatically rebuilds as files change and supports hot module replacement, but doesn't start a web server.

```bash
parcel watch index.html
```

When you're ready to build for production, the `build` mode turns off watching and only builds once. See the [Production](production.html) section for more details.
