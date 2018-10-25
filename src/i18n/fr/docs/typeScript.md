# TypeScript

_Extensions supportées : `ts`, `tsx`_

[TypeScript](https://www.typescriptlang.org/) est un sur-ensemble typé du JavaScript qui compile en JavaScript simple, qui prend également en charge les fonctionnalités modernes ES2015+. La transformation TypeScript fonctionne sans aucune configuration supplémentaire.

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
