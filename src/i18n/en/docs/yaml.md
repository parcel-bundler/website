# YAML

_Supported extensions: `yaml`, `yml`_
You can import yaml files into your js like this `const data = require("filename.yaml");`.

```yaml
# data.yaml

hello:
  - world
  - computer
```

```js
// index.js

const data = require("data.yaml");
console.log(data.hello[0]);
```
