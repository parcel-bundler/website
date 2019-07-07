# TypeScript

_支援的副檔名`ts` 及 `tsx`_

[TypeScript](https://www.typescriptlang.org/) 是個強型別語法的 JavaScript 超集合，其可支援 ES2015+ 的功能並可編譯成一般的 JavaScript。Parcel 已內建 TypeScript 的轉換，完全無需設定。

Parcel 不會執行 type check，你可以使用 `tsc --noEmit` 讓 TypeScript 檢查你的檔案。

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

## 當你使用 React 時

若要使用 TypeScript + React + JSX，你需要：

1. 使用 `.tsx` 副檔名
2. 正確地引用 React
3. 在 tsconfig 中使用[特殊選項](https://www.typescriptlang.org/docs/handbook/jsx.html) `"jsx": "react"`

完整範例：
```html
<!-- index.html -->
<html>
<body>
  <div id="root"></div>
  <script src="./index.tsx"></script>
</body>
</html>
```

```tsx
// index.tsx
import React from 'react'
import ReactDOM from 'react-dom'

console.log('Hello from tsx!')

ReactDOM.render(
	<p>Hello</p>,
	document.getElementById('root'),
)
```

```js
// .tsconfig
{
  "compilerOptions": {
    "jsx": "react"
  }
}
```

詳情請見此討論串：https://github.com/parcel-bundler/parcel/issues/1199

## baseURL 和 paths

Parcel 不會使用 `tsconfig.json` 中的 `baseUrl` 和 `paths` 指令，你可以用 Parcel 的 `~` 模型載入方式取而代之：

```js
// tsconfig.json
// 假設你的 ts 原始碼位於 ./src/
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

完整範例請見[此 gist](https://gist.github.com/croaky/e3394e78d419475efc79c1e418c243ed)。

