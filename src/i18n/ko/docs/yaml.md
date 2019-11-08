# YAML

_지원하는 확장자: `yaml`, yml`_

`import data from './파일이름.yml'`을 이용하여 js 파일내에 yaml 파일을 임포트 할 수 있습니다.

파일구조 예시:

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
