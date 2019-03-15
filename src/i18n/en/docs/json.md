# JSON

_Supported extensions: `json`, `json5`_

You can import json files into your js like this `import data from './filename.json'`.

Example file structure:
```bash
.
├── package.json
└── src
    ├── data.json
    └── index.js
```

```json
{
  "hello": [
    "world",
    "computer"
  ]
}
```

```js
// index.js

import data from './data.json'
console.log(data.hello[0]);

// "world"
```
