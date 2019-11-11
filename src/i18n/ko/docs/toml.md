# TOML

_지원하는 확장자: `toml`_

`import data from './파일이름.toml'` 같이 toml 파일을 js로 가져올 수 있습니다.

파일 구조 예시:

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

// "world
```
