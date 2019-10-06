# TOML

_支援的副檔名：`toml`_

你可以像這樣在 JavaScript 中匯入 toml 檔案：

`import data from './filename.toml'`

範例檔案架構：

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
