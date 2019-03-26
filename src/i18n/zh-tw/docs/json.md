# JSON

_支援的副檔名：`json` 及 `json5`_

你可以像匯入 JS 一樣來匯入 json 檔案，如： `import data from './filename.json'`。

檔案結構範例：

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
