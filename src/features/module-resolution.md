---
layout: layout.njk
eleventyNavigation:
  key: Module Resolution
  title: 📔 Module Resolution
  order: 4
summary: How dependencies are resolved
---

The Parcel resolver implements a modified version of [the node_modules resolution](https://nodejs.org/api/modules.html#modules_all_together) algorithm.

Module resolution can be relative to the:

TODO:

- **entry root**: the directory of the entrypoint specified to Parcel, or the shared root (common parent directory) when multiple entrypoints are specified.
- **project root**: the directory of the nearest module root in `node_modules`.

### Absolute Paths

TODO:
`/foo` resolves `foo` relative to the **entry root**.

### ~ Tilde Paths

TODO:
`~/foo` resolves `foo` relative to the nearest **package root** or, if not found, the **entry root**.

### package.json `browser` field

If a package includes a [package.browser field](https://docs.npmjs.com/files/package.json#browser) (and it is a string), Parcel will use this instead of the package.main entry.

If it is an object, it behaves just like [`aliases`](#aliases), but has a higher priority when `target.context === "browser"`.

### Aliases

Aliases are supported through the `alias` field in `package.json`.

This example aliases `react` to `preact` and some local custom module that is not in `node_modules`.

{% sample %}
{% samplefile "package.json" %}

```json
{
  "name": "some-package",
  "devDependencies": {
    "parcel-bundler": "^1.7.0"
  },
  "alias": {
    "react": "preact-compat",
    "react-dom": "preact-compat",
    "local-module": "./custom/modules"
  }
}
```

{% endsamplefile %}
{% endsample %}

Avoid using any special characters in your aliases as some may be used by Parcel and others by 3rd party tools or extensions. For example:

- `~` used by Parcel to resolve [tilde paths](#~-tilde-paths).
- `@` used by npm to resolve npm organizations.

We advise being explicit when defining your aliases, so please **specify file extensions**, otherwise Parcel will need to guess. See [JavaScript Named Exports](#javascript-named-exports) for an example of this.

## Common issues

### Javascript Named Exports

Alias mappings apply to many asset types and do not specifically support mapping of JavaScript named exports. If you wish to map JS named exports you can re-export the named export within the aliased file:

{% sample %}
{% samplefile "package.json" %}

```json
{
  "name": "some-package",
  "alias": {
    "ipcRenderer": "./electron-ipc.js" // specify file extension
  }
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

Given a project with this structure:

```
package.json
.flowconfig
src/
  index.html
  index.js
  components/
    apple.js
    banana.js
```

And `src/index.html` as an entrypoint, the **entry root** is the `src/` folder.

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

{% endsamplefile %}
{% endsample %}

(`<PROJECT_ROOT>` is a Flow specific identifier indicating the location of your `.flowconfig`.)

NB: `module.name_mapper` can have multiple entries. This allows support for [Absolute](#absolute-paths) or [Tilde](#~-tilde-paths) Path Resolution in addition to [local module aliasing](#aliases) support.

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

These are the advised usages with monorepos at this time:

Advised usage:

- use relative paths.
- use `/` for a root path if a root is required.

Unadvised usage:

- **avoid** `~` use within monorepos.

If you're a monorepo user and would like to contribute to these recommendations, please provide example repos when opening issues to support the discussion.
Terms
