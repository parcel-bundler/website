# TypeScript

_Extensões suportadas: `ts`, `tsx`_

[TypeScript](https://www.typescriptlang.org/) é um superconjunto de JavaScript tipado que compila para JavaScript simples, que também suporta características mordernas do ES2015+. Conversões TypeScript funcionam _out of the box_, sem a necessidade de nenhuma configuração adicional.

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

## Quando utilizado com React

Para utilizar Typescript + React + JSX, você precisa

1. utilizar a extensão `.tsx`
2. requerer o React corretamente
3. usar tsconfig com uma [opção especial](https://www.typescriptlang.org/docs/handbook/jsx.html) `"jsx": "react"`

Exemplo completo:

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

Veja [este tópico completo](https://github.com/parcel-bundler/parcel/issues/1199) para maiores detalhes.
