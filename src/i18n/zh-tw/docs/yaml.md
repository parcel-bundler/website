# YAML

_支援的副檔名：`yaml` 及 `yml`_

你可以像匯入 JS 一樣來匯入 yaml 檔案，如： `import data from './filename.yaml'`。

檔案結構範例：

```bash
.
├── package.json
└── src
    ├── data.yaml
    └── index.js
```

```yaml
# data.yaml

hello:
  - world
  - computer
```

```js
// index.js

import data from './data.yaml'
console.log(data.hello[0]);

// "world"
```
