# :notebook_with_decorative_cover: Module Resolution

Parcel (v1.7.0 and above) supports multiple module resolution strategies out of the box so you don't have to deal with endless relative paths `../../`.

## Absolute Paths

`/foo` will resolve `foo` relative to the **project root** (top-level `package.json`)

## ~ Tilde Paths

`~/foo` will resolve `foo` relative to the nearest **package root** in `node_modules` or the **project root** if not in `node_modules`.

## Aliasing

Aliases are supported through the `alias` field in `package.json`.

This example aliases `react` to `preact` and some local custom module that is not in `node_modules`.

```json
// package.json
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

Avoid using `~` in your aliases as it is already used by parcel as mentioned earlier.

## Other Conditions

### JavaScript Named Exports

Alias mappings apply to many asset types and does not specifically support mapping of JavaScript named exports. If you wish to map JS named exports you can do this:

```json
// package.json
{
  "name": "some-package",
  "alias": {
    "ipcRenderer": "./electron-ipc.js"
  }
}
```

```js
// electron-ipc.js
module.exports = require("electron").ipcRenderer;
```

### TypeScript

TypeScript will need to know about your use of the `~` module resolution or alias mappings. Please refer to the [TypeScript Module Resolution docs](https://www.typescriptlang.org/docs/handbook/module-resolution.html) for further information.

```json
//tsconfig.json
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "~*": ["./src/*"]
    },
```

### Monorepo Resolution

TODO: answer this - https://github.com/parcel-bundler/parcel/pull/850#issuecomment-372105317