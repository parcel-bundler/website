# TypeScript

_支援的副檔名`ts` 及 `tsx`_

[TypeScript](https://www.typescriptlang.org/) 是個強型別語法的 JavaScript 超集合，其可支援 ES2015+ 的功能並可編譯成一般的 JavaScript。

Parcel 已內建 TypeScript 的轉換，完全無需設定。

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
