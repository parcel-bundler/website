---
layout: layout.njk
eleventyNavigation:
  key: features-module-resolution
  title: 📔 Module Resolution
  order: 5
summary: How dependencies are resolved
---

The Parcel resolver implements a modified version of [the node_modules resolution](https://nodejs.org/api/modules.html#modules_all_together) algorithm.

- **root directory**: the directory of the entrypoint specified to Parcel, or the shared root (nearest common parent directory) when multiple entrypoints are specified.
- **project root**: the nearest directory from the root direct that contains a lockfile (`yarn.lock`, `package-lock.json`, `pnpm-lock.yaml`) or a VCS folder (`.git`, `.hg`)

### Absolute Paths

`/foo` resolves `foo` relative to the **project root**.

### Tilde Paths

`~/foo` resolves `foo` relative to nearest **`node_modules`** directory, the nearest directory with **`package.json`** or the project root - whichever comes first.

### package.json `browser` field

If a package includes a [package.browser field](https://docs.npmjs.com/files/package.json#browser) (and it is a string), Parcel will use this instead of the package.main entry.

If it is an object, it behaves just like [`aliases`](#aliases), but has a higher priority when [`target.context === "browser"`](/configuration/package-json/#context).

### Aliases

Aliases are supported through the `alias` field in `package.json`.

This example aliases `react` to `preact` and some local custom module that is not in `node_modules`.

They can also map to global variables expected to exist at runtime. This can be helpful for replacing a dependency with, for example, a version loaded from a CDN.

{% sample %}
{% samplefile "package.json" %}

```json/5-11
{
  "name": "some-package",
  "devDependencies": {
    "parcel-bundler": "^2.0.0-beta.1"
  },
  "alias": {
    "react": "preact/compat",
    "react-dom": "preact/compat",
    "local-module": "./custom/modules",
    "other-local-module": { "fileName": "./custom/other-module" },
    "lodash": { "global": "_" }
  }
}
```

{% endsamplefile %}
{% endsample %}

Avoid using any special characters in your aliases as some may be used by Parcel and others by 3rd party tools or extensions. For example:

- `~` is used by Parcel to resolve [tilde paths](#tilde-paths).
- `@` is used by npm to for packages by npm organizations.

We advise being explicit when defining your aliases, so please **specify file extensions**, otherwise Parcel will need to guess. See [JavaScript Named Exports](#javascript-named-exports) for an example of this.

Prefixing global aliases with `window` or `globalThis` (e.g. `window.jQuery`) could fail with multi-platform builds and is not recommended. Although file aliases can be `"path/to/file"` instead of `{ "fileName": "path/to/file" }`, globals must use the `{ "global": "name" }` format.

### Externals

Externals must be configured on a target-by-target basis with [`includeNodeModules`](/configuration/package-json#includenodemodules). Like globals, externals will not be bundled, but they will instead be imported at runtime.

{% sample %}
{% samplefile "package.json" %}

```json/3-5
{
  "targets": {
    "app": {
      "includeNodeModules": {
        "react": false
      }
    }
  }
}
```

{% endsamplefile %}
{% endsample %}

### Package entry fields

When scope hoisting is enabled, a bare specified (e.g. `lodash`) is resolved in this order (the first field that specified and points to any existing file):

- `package.json#source`
- `package.json#browser`
- `package.json#module`
- `package.json#main`
- `index.{js, json}`

Without scope hoisting however, `main` is preferred to `module` for better performance:

- `package.json#source`
- `package.json#browser`
- `package.json#main`
- `package.json#module`
- `index.{js, json}`

## Common issues

### Javascript Named Exports

Alias mappings apply to many asset types and do not specifically support mapping of JavaScript named exports. If you wish to map JS named exports you can re-export the named export within the aliased file:

{% sample %}
{% samplefile "package.json" %}

```json5/3
{
  name: "some-package",
  alias: {
    ipcRenderer: "./electron-ipc.js", // specify file extension
  },
}
```

{% endsamplefile %}
{% samplefile "electron-ipc.js" %}

```js
module.exports = require("electron").ipcRenderer;
```

{% endsamplefile %}
{% endsample %}

### Flow with Absolute or Tilde Resolution

When using absolute path or tilde path module resolution you must configure Flow using the [module.name_mapper](https://flow.org/en/docs/config/options/#toc-module-name-mapper-regex-string) feature.

Given a project with this structure and `src/index.html` as an entrypoint, the **entry root** is the `src/` folder.

```
├── package.json
├── .flowconfig
└── src/
    ├── index.html
    ├── index.js
    └── components/
        ├── apple.js
        └── banana.js
```

Therefore, to map this import correctly, Flow should replace the leading `/` in `'/components/apple'` with `src/`, resulting in `'src/components/apple'`. That is achieved by the following setting in your `.flowconfig`.

{% sample %}
{% samplefile "index.js" %}

```js
import Apple from "/components/apple";
```

{% endsamplefile %}
{% samplefile ".flowconfig" %}

```ini
[options]
module.name_mapper='^\/\(.*\)$' -> '<PROJECT_ROOT>/src/\1'
```

`<PROJECT_ROOT>` is a Flow specific identifier indicating the location of your `.flowconfig`.
{% endsamplefile %}
{% endsample %}

Note: `module.name_mapper` can have multiple entries. This enabled support for [absolute](#absolute-paths) or [tilde](#~-tilde-paths) Path Resolution in addition to [local module aliasing](#aliases) support.

### TypeScript ~ Resolution

TypeScript will need to know about your use of the `~` module resolution or alias mappings. Please refer to the [TypeScript Module Resolution docs](https://www.typescriptlang.org/docs/handbook/module-resolution.html) for further information.

{% sample %}
{% samplefile "tsconfig.json" %}

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "~*": ["./src/*"]
    }
  }
}
```

{% endsamplefile %}
{% endsample %}

### Monorepo Resolution

TODO?

These are the advised usages with monorepos at this time:

Advised usage:

- use relative paths.
- use `/` for a root path if a root is required.
- **avoid** `~` within monorepos.

If you're a monorepo user and would like to contribute to these recommendations, please provide example repos when opening issues to support the discussion.
