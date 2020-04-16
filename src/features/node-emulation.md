---
layout: layout.njk
eleventyNavigation:
  key: Node Emulation
  title: 🐢 Node Emulation
  order: 5
summary: Some features that ultimately emulate Node.js's API
---

## 🌳 Environment Variables

Parcel uses [dotenv](https://github.com/motdotla/dotenv) to support loading environment variables from `.env` files.

`.env` files are to be stored alongside the `package.json` that contains your `parcel-bundler` dependency.

Parcel loads `.env` files with these specific names for the following `NODE_ENV` values:

| valid `.env` filenames   | `NODE_ENV=*` | `NODE_ENV=test` |
| ------------------------ | ------------ | --------------- |
| `.env`                   | ✔️           | ✔️              |
| `.env.local`             | ✔️           | ✖️              |
| `.env.${NODE_ENV}`       | ✔️           | ✔️              |
| `.env.${NODE_ENV}.local` | ✔️           | ✔️              |

Notably:

- `NODE_ENV` defaults to `development`.
- `.env.local` is not loaded when `NODE_ENV=test` since [tests should produce the same results for everyone](https://github.com/parcel-bundler/parcel/blob/28df546a2249b6aac1e529dd629f506ba6b0a4bb/src/utils/env.js#L9)
- Sometimes introducing a new .env file will not work immediately. Try deleting the .cache/ directory in this case.
- Accessing the `process.env` object directly is [not supported](https://github.com/parcel-bundler/parcel/issues/2299#issuecomment-439768971), but accessing specific variables on it like `process.env.API_KEY` will provide the expected value.
- Use the built-in `process` Node.js global, i.e. don't do `import process from "process"`, because it will not work. If you use TypeScript, you probably want to install `@types/node` for it to compile.

## 🕳️ Polyfilling & Exluding Builtin Node Modules

When (or more likely a dependency) importing packages such as `crypto`, `fs` or `process`, Parcel will either automatically use one of the listed polyfills and otherwise exclude that module. You can use [the `alises` field in your `package.json`](/getting-started/module-resolution/#aliases)

| native module | npm replacement            | native module  | npm replacement      |
| ------------- | -------------------------- | -------------- | -------------------- |
| assert        | `assert`                   | process        | `process/browser.js` |
| buffer        | `buffer`                   | punycode       | `punycode`           |
| console       | `console-browserify`       | querystring    | `querystring-es3`    |
| constants     | `constants-browserify`     | stream         | `readable-stream`    |
| crypto        | `crypto-browserify`        | string_decoder | `string_decoder`     |
| domain        | `domain-browser`           | sys            | `util/util.js`       |
| events        | `events`                   | timers         | `timers-browserify`  |
| http          | `stream-http`              | tty            | `tty-browserify`     |
| https         | `https-browserify`         | url            | `url`                |
| os            | `os-browserify/browser.js` | util           | `util/util.js`       |
| path          | `path-browserify`          | vm             | `vm-browserify`      |
| zlib          | `browserify-zlib`          |

## 📄 Inlining fs.readFileSync

Calls to `fs.readFileSync` are replaced with the file's contents if the filepath is statically determinable

- `fs.readFileSync(..., "utf8")`: with the contants as string with (or any other valid encoding)
- `fs.readFileSync(...)`: a Buffer object (e.g. `Buffer.from(....)` together with the an potentionally necessary polyfill)

{% sample "build index.js" %}
{% samplefile "index.js" %}

```js
import fs from "fs";
import path from "path";

const data = fs.readFileSync(path.join(__dirname, "data.json"), "utf8");
console.log("data");
```

{% endsamplefile %}
{% samplefile "data.json" %}

```json
{
  "foo": "bar"
}
```

{% endsamplefile %}
{% endsample %}
