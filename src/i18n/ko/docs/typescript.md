# Typescript

_지원되는 확장자: `ts`, `tsx`_

[TypeScript](https://www.typescriptlang.org/)는 일반 JavaScript로 컴파일되는 Javascript의 타입화된 슈퍼셋으로써, 최신 ES2015 이상의 기능을 지원합니다. Typescript 변환은 추가 구성없이 즉시 구성할 수 있습니다.

Parcel은 타입 검사를 수행하지 않습니다. `tsc --noEmit`을 사용하여 TypeScript가 파일을 검사하도록 설정 할 수 있습니다.

```html
<!-- index.html -->
<html>
<body>
  <script src="./index.ts"></script>
</body>
</html>
```

```typescript
// index.ts
import message from './message'
console.log(message)
```

```typescript
// message.ts
export default 'Hello, world'
```

## React를 사용할때

Typescript + React + JSX를 사용하기 위해서, 다음과 같은 설정이 필요합니다.

1. `.tsx` 확장자를 가진 파일을 사용해야 합니다.
2. React를 임포트 해야 합니다.
3. [특별한 옵션](https://www.typescriptlang.org/docs/handbook/jsx.html)을 tsconfig에 적용해야 합니다. ("jsx": "react")

전체 예시입니다:

```html
<html>
<body>
  <div id="root"></div>
  <script src="./index.tsx"></script>
</body>
</html>
```

```typescript
// index.tsx
import React from 'react'
import ReactDOM from 'react-dom'

console.log('Hello from tsx!')

ReactDOM.render(
  <p>Hello</p>,
  document.getElementById('root'),
)
```

```json
{
  "compilerOptions": {
    "jsx": "react"
  }
}
```

상세 내용은 [전체 쓰레드](https://github.com/parcel-bundler/parcel/issues/1199)에서 확인하실 수 있습니다.

## baseUrl과 경로

Parcel은 `tsconfig.json`에서 `baseUrl` 또는 `paths` 옵션을 사용하지 않습니다. 대신 Parcel의 `~` 모듈 로딩 규칙을 사용할 수 있습니다. 다음과 같이 Typescript에 설정합니다.

```json
// tsconfig.json
// ts 소스가 ./src 에 있다고 가정합니다.
{
  "compilerOptions": {
    "baseUrl": "./src",
    "paths": {
      "~*": ["./*"]
    },
  },
  "include": ["src/**/*"]
}
```

전체 예시는 [gist](https://gist.github.com/croaky/e3394e78d419475efc79c1e418c243ed)를 참조하세요.