# YAML

_支持扩展类型: `yaml`, `yml`_

导入 yaml 文件到你的 js `import data from './filename.yaml'`。

例子：

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
console.log(data.hello[0])

// "world"
```
