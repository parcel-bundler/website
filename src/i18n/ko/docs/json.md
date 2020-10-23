# JSON

_지원되는 확장자: `json`, `json5`_

`import data from './filename.json'` 같이 json 파일을 js로 가져올 수 있습니다.

파일 구조 예시:
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