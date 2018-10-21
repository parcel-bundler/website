# TypeScript

*Extensões suportadas: `ts`, `tsx`*

[TypeScript](https://www.typescriptlang.org/) é um superconjunto de JavaScript tipado que compila para JavaScript simples, que também suporta características mordernas do ES2015+. Conversões TypeScripe funcionam *out of the box*, sem a necessidade de nenhuma configuração adicional.

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
import message from "./message";
console.log(message);
```

```typescript
// message.ts
export default "Hello, world";
```
