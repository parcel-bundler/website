# TypeScript

_Supported extensions: `ts`, `tsx`_

[TypeScript](https://www.typescriptlang.org/) is a typed superset of JavaScript that compiles down to plain JavaScript, which also supports modern ES2015+ features. Transforming TypeScript works out of the box without any additional configuration.

Parcel performs no type checking. You can use `tsc --noEmit` to have typescript check your files.

```html
<!-- index.html -->
<html>
<body>
  <script src="./index.ts"></script>
</body>
</html>
```

```typescript
// index.ts
import message from './message'
console.log(message)
```

```typescript
// message.ts
export default 'Hello, world'
```

## When using React

To use Typescript + React + JSX, you need to:

1. use the `.tsx` extension
2. properly require React
3. use a tsconfig with a [special option](https://www.typescriptlang.org/docs/handbook/jsx.html) `"jsx": "react"`

Full example:

```html
<!-- index.html -->
<html>
<body>
  <div id="root"></div>
  <script src="./index.tsx"></script>
</body>
</html>
```

```typescript
// index.tsx
import React from 'react'
import ReactDOM from 'react-dom'

console.log('Hello from tsx!')

ReactDOM.render(
  <p>Hello</p>,
  document.getElementById('root'),
)
```

```json
// tsconfig.json
{
  "compilerOptions": {
    "jsx": "react"
  }
}
```

See [this full thread](https://github.com/parcel-bundler/parcel/issues/1199) for more details.

## baseURL and paths

Parcel does not use the `baseUrl` or `paths` directives in `tsconfig.json`. You can instead use Parcel's `~` module loading convention. Tell typescript about it like so:

```json
// tsconfig.json
// assuming your ts sources are in ./src/
{
  "compilerOptions": {
    "baseUrl": "./src",
    "paths": {
      "~*": ["./*"]
    },
  },
  "include": ["src/**/*"]
}
```

See [this gist](https://gist.github.com/croaky/e3394e78d419475efc79c1e418c243ed) for a full example.

## Module API types

To interact with Parcel's Module API (e.g. when setting up [Hot Module Replacement](https://parceljs.org/hmr.html)), make sure to install the `@types/parcel-env` package.
