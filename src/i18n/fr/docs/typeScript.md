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

## Lors de l'utilisation de React

Pour utiliser Typescript + React + JSX, vous avez besoin de :

1. utiliser l'extension `.tsx`
2. importer React correctement
3. utiliser une tsconfig avec une [option spéciale](https://www.typescriptlang.org/docs/handbook/jsx.html) `"jsx": "react"`

Exemple complet :

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

console.log('Coucou depuis tsx!')

ReactDOM.render(<p>Coucou</p>, document.getElementById('root'))
```

```json
// tsconfig.json
{
  "compilerOptions": {
    "jsx": "react"
  }
}
```

Consultez complétement cette discussion pour plus de détails : https://github.com/parcel-bundler/parcel/issues/1199
