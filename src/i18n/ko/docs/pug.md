# Pug

_지원하는 확장자: `jade`, `pug`_

퍼그 설정은 쉽습니다. 원하는 파일 구조를 가질 수 있으며, 참고 사항으로 몇가지 간단한 예제만 제공하겠습니다.

## 예제 1 - index.pug

아래 파일 구조를 가정해 보겠습니다.

```bash
.
├── package.json
└── src
    └── index.pug
```

Parcel 커맨드를 통해 실행할 수 있습니다.: `parcel src/index.pug`

## 예제 2 - index.pug, index.js와 style.css

아래 파일 구조를 가정해 보겠습니다.

```bash
.
├── package.json
└── src
    ├── index.js
    ├── index.pug
    └── style.css
```

index.pug 내부에서 스타일시트와 js를 연결하십시오.

```pug
// index.pug

doctype html
html(lang="")
  head
    // ...
    link(rel="stylesheet", href="index.css")
  body
    h1 Hello

    script(src="index.js")
```

Stylus, Sass, LESS를 사용하는 경우에도 동일한 방식으로 연결합니다. 원하는 경우 스타일 관련 파일을 js 파일로 직접 임포트 할 수 있습니다.

Parcel 커맨드를 통해 실행합니다.: `parcel src/index.pug`

## 예제 3 - locals 객체와 함께 사용

아래 파일 구조를 가정해 보겠습니다.

```bash
.
├── package.json
└── src
    ├── index.pug
    └── pug.config.js
```

`pug.config.js` 파일에서 로컬 객체를 내보내야 합니다. `pub.config.js` 파일은 `index.pug` 파일이 있는 디렉토리 또는 `package.json` 파일이 있는 디렉토리안에 위치해 있어야 합니다. `pug.config.js` 파일을 js 파일에 명식적으로 가져올 필요는 없습니다. 이 방법은 pug 템플릿에 `locals` 객체를 사용할 수 있는 **유일한 방법** 입니다.

```js
// pug.config.js

module.exports = {
  locals: {
    hello: "world"
  }
};
```

```pug
// index.pug

doctype html
html(lang="")
  head
    // ...
  body
    h1 #{hello}
```

다시한번 parcel 커맨드를 실행합니다.: `parcel src/index.pug`

### locals 오브젝트를 수정한 후 parcel의 취소 혹은 재실행

로컬 객체의 변경 사항은 즉시 확인할 수 없습니다. 로컬 객체를 업데이트하면, 터미널에서 parcel 프로세스를 취소하고, `pacel src/index.pug`를 다시 시작해야 합니다.

### 자동 오류 감지

또한, `locals` 설정을 사용하는 경우 pug의 보간 설정에 존재하지 않는 속성을 사용하면 오류가 발생하지 않습니다. 따라서, 만약 `h1 #{thing}`을 작성했고 locals 객체에 `thing` 속성이 없다면, Parcel은 충돌하지 않거나 오류를 출력하지 않을 것이며, 브라우저에는 빈 결과만 출력될 것입니다. 따라서, 이러한 사항을 주의하십시오. 그렇지 않다면 보간된 요소가 작동하지 않을 것입니다.

### 세개의 파일 이름지정 옵션만 사용

`pug.config.js` 대신 `.pugrc` 또는 `.pugrc.js` 파일을 사용할 수 있습니다. 이는 로컬 설정을 하는데 필요한 3가지 유형만 존재합니다.

### `pug.config.js` 파일에서 import문을 사용할 수 없습니다.

만약 `pug.config.js` 파일에서 다른 파일을 임포트 하시려면, require 문법만 사용해야 합니다.

아래 예시는 정상적으로 동작할 것입니다.

```js
// pug.config.js

const data = require("./data.js");

module.exports = {
  locals: {
    d: data
  }
};

```

아래 예시는 작동하지 않습니다.

```js
import data from "./data.js";

module.exports = {
  locals: {
    d: data
  }
};
```

## package.json 파일에 스크립트 포함하기

```json
"scripts": {
  "dev": "parcel src/index.pug",
  "devopen": "parcel src/index.pug --open 'google chrome'",
  "build": "parcel build src/index.pug"
}
```

브라우저에서 프로젝트를 열기위해서 `npm run dev` 또는 `npm run devopen`을 입력합니다. 그 후 `npm run build`를 사용하여 pug 프로젝트를 빌드 할 수 있습니다.
