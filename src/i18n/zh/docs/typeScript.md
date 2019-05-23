# TypeScript

_支持扩展类型: `ts`, `tsx`_

[TypeScript](https://www.typescriptlang.org/)是 JavaScript 类型化的超集，可以编译成原始的 JavaScript，支持现代的 ES2015+特性。转换 TypeScript 是开箱即用的不需要额外的配置。

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

## React 中使用

要使用：Typescript + React + JSX，你需要：

1. 使用`.tsx`后缀
2. 正确的引用 React
3. 在 tsconfig 中使用[特殊配置](https://www.typescriptlang.org/docs/handbook/jsx.html)`"jsx": "react"`

完整的例子：

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

查看 [更多的细节](https://github.com/parcel-bundler/parcel/issues/1199)。
