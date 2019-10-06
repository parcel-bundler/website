# JSON

_支持扩展类型:`json`, `json5`_

在 js 中导入 json 文件：`import data from './filename.json'`。

例子：

```bash
.
├── package.json
└── src
    ├── data.json
    └── index.js
```

```json
{
  "hello": ["world", "computer"]
}
```

```js
// index.js

import data from './data.json'
console.log(data.hello[0])

// "world"
```
