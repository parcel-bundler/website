---
layout: layout.njk
title: Node Emulation
eleventyNavigation:
  key: features-node-emulation
  title: 🐢 Node Emulation
  order: 8
---

Parcel includes several features that emulate the Node.js API. This allows many modules on npm that were originally written for Node to also work in the browser. In addition, many browser modules have also adopted Node.js-based APIs for things like environment variables.

## Environment Variables

Parcel supports inlining environment variables in JavaScript. This can be used to determine the build environment (e.g. development, staging, production), inject API keys, etc.

To access an environment variable, read the corresponding property from the `process.env` object.

```js
if (process.env.NODE_ENV === 'development') {
  console.log('Happy developing!');
}
```

You can also use destructuring syntax to access multiple properties at once.

```js
let {NODE_ENV, API_TOKEN} = process.env;
```

Accessing `process.env` in any non-static ways (e.g. dynamic property lookups) is not supported.

### `NODE_ENV`

The `NODE_ENV` environment variable is automatically set by Parcel depending on the mode. When running `parcel build`, `NODE_ENV` is set to `production` by default, otherwise it is set to `development`. This can be overridden by setting `NODE_ENV` yourself (e.g. in your shell).

### `.env` files

Parcel supports loading environment variables defined in `.env` files in your project root. This supports `NAME=value` pairs separated by newlines. Lines starting with `#` are treated as comments. See [dotenv](https://github.com/motdotla/dotenv) for more details.

{% sample %}
{% samplefile ".env" %}

```ini
APP_NAME=test
API_KEY=12345
```

{% endsamplefile %}
{% endsample %}

In addition to `.env`, environment-specific overrides such as `.env.production` and `.env.development` can also be created. These are applied based on the `NODE_ENV` environment variable (including when automatically set by Parcel). Any variables that are not set in environment-specific overrides fall back to the values defined in the base `.env` file.

The `.env.local` file is also supported for local overrides of environment variables, however, it is not used when `NODE_ENV=test` so that tests produce the same result for everyone. This is also supported for environment-specific overrides, such as `.env.production.local`.

## Polyfilling & Excluding Builtin Node Modules

When your code, or more likely a dependency, imports builtin Node modules such as `crypto`, `fs` or `process`, Parcel will automatically use one of the following polyfills. If no polyfill is available, then an empty module will be used instead. You can also use [aliases](/features/dependency-resolution/#aliases) to override these.

| native module | npm replacement            | native module  | npm replacement      |
| ------------- | -------------------------- | -------------- | -------------------- |
| assert        | `assert`                   | process        | `process/browser.js` |
| buffer        | `buffer`                   | punycode       | `punycode`           |
| console       | `console-browserify`       | querystring    | `querystring-es3`    |
| constants     | `constants-browserify`     | stream         | `stream-browserify`    |
| crypto        | `crypto-browserify`        | string_decoder | `string_decoder`     |
| domain        | `domain-browser`           | sys            | `util/util.js`       |
| events        | `events`                   | timers         | `timers-browserify`  |
| http          | `stream-http`              | tty            | `tty-browserify`     |
| https         | `https-browserify`         | url            | `url`                |
| os            | `os-browserify/browser.js` | util           | `util/util.js`       |
| path          | `path-browserify`          | vm             | `vm-browserify`      |
| zlib          | `browserify-zlib`          |

## Inlining fs.readFileSync

Calls to `fs.readFileSync` are replaced with the file's contents if the filepath is statically determinable and inside the project root.

- `fs.readFileSync(__dirname + "/file", "utf8")` – the contents of the file as a string. The "utf8", "utf-8", "hex", and "base64" encodings are supported.
- `fs.readFileSync(__dirname + "/file")` – a [Buffer](https://nodejs.org/dist/latest-v16.x/docs/api/buffer.html) object. Note that the Buffer polyfill is quite large so this may be undesired.

The `__dirname` and `__filename` variables can be used in the filename argument. String concatenation via the `+` operator and the `path.join` function may be used. Other functions, variables, or dynamic computations are not supported. Computed paths should always be absolute, and not rely on the current working directory.

{% sample %}
{% samplefile "index.js" %}

```js/3
import fs from "fs";
import path from "path";

const data = fs.readFileSync(path.join(__dirname, "data.json"), "utf8");
console.log(data);
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

## Disabling These Features

Inlining of [environment variables](#environment-variables) and [`readFileSync` calls](#inlining-fs.readfilesync) can be disabled by creating a `@parcel/transformer-js` key in `package.json`.

{% sample %}
{% samplefile "package.json" %}

```json5
{
  "name": "my-project",
  "dependencies": {
    ...
  },
  "@parcel/transformer-js": {
    "inlineFS": false,
    "inlineEnvironment": false
  }
}
```

{% endsamplefile %}
{% endsample %}

`inlineEnvironment` can also be an array of glob strings, which allows you to filter the allowed environment variables. This is a good idea to ensure security, since third party code in node_modules can also read environment variables.

```json5
{
  "name": "my-project",
  "dependencies": {
    ...
  },
  "@parcel/transformer-js": {
    "inlineEnvironment": ["SENTRY_*"]
  }
}
```
