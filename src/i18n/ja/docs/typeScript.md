# TypeScript

_Supported extensions: `ts`, `tsx`_

[TypeScript](https://www.typescriptlang.org/) is a typed superset of JavaScript that compiles down to plain JavaScript, which also supports modern ES2015+ features. Transforming TypeScript works out of the box without any additional configuration.

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

ReactDOM.render(<p>Hello</p>, document.getElementById('root'))
```

```json
// tsconfig.json
{
  "compilerOptions": {
    "jsx": "react"
  }
}
```

See this full thread for more details: https://github.com/parcel-bundler/parcel/issues/1199
