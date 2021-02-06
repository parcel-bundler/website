# TypeScript

_サポートしている拡張子: `ts`, `tsx`_

[TypeScript](https://www.typescriptlang.org/) はプレーンな JavaScript にコンパイルされた JavaScript の型のスーパーセットであり、最新の ES2015+ 機能もサポートしています。TypeScript の変換は、追加の設定なしですぐに動作します。

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

## React を使う場合

Typescript + React + JSX を使うためには:

1. `.tsx` 拡張子を使う
2. React を正しく require する
3. tsconfig に[特別なオプション](https://www.typescriptlang.org/docs/handbook/jsx.html) `"jsx": "react"` を設定して使う

完全な例:

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

詳細はこのスレッドをご参照ください: https://github.com/parcel-bundler/parcel/issues/1199
