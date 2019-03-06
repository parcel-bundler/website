# YAML

_Supported extensions: `yaml`, `yml`_
You can import yaml files into your js like this `import data from './filename.yaml'`.

Example file structure:
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
