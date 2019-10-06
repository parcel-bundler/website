# TOML

_Supported extensions: `toml`_
You can import toml files into your js like this `import data from './filename.toml'`.

Example file structure:
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
console.log(data.hello[0]);

// "world"
```
