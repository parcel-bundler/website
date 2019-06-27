# TOML

_Extensions supportées : `toml`_
Vous pouvez importer les fichiers toml dans votre js de cette manière `import data from './filename.toml'`.

Exemple de structure de fichier :

```bash
.
├── package.json
└── src
    ├── data.toml
    └── index.js
```

```toml
# data.toml

hello = [
  "world",
  "computer"
]
```

```js
// index.js

import data from './data.toml'
console.log(data.hello[0])

// "world"
```
