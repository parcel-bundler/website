# Javascript

_지원되는 확장자: `js`, `jsx`, `es6`, `jsm`, `mjs`_

웹 번들러에서 가장 전통적인 파일 타입은 Javascript 입니다. Parcel은 CommonJS 와 ES6 파일 임포트를 모두 지원합니다. Parcel은 또한 비동기 로드를 위한 다이나믹 임포트 (`import()`)를 지원하며, [코드분할](code_splitting.html) 섹션에서 확인하실 수 있습니다. 다이나믹 임포트는 URL을 통한 모듈 임포트도 지원합니다.

```javascript
// CommonJS문법을 이용한 모듈 임포트
const dep = require('./path/to/dep')

// ES6 문법을 이용한 모듈 임포트
import dep from './path/to/dep'

// URL을 이용한 모듈 임포트 (예를들면, CDN), 다이나믹 임포트를 사용
import('https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.11/lodash.min.js').then(() => {
  console.log(_.VERSION);
});
```

Javascript 파일안에서 CSS, HTML 또는 이미지파일까지 javascript가 아닌 애셋을 임포트할 수 있습니다. 이파일 중 하나를 임포트하게 되면, 다른 번들러에서는 임포트가 포함되지 않습니다. 대신, 모든 종속파일과 함께 별도의 번들로 위치하게 됩니다. (예: CSS 파일) [CSS 모듈](https://github.com/css-modules/css-modules)을 사용하면, 내보낸 클래스가 Javascript 번들에 배치됩니다. 다른 애셋 유형은 URL을 Javascript 파일 번들내 출력 파일로 내보내므로, 코드에서 이를 참조할 수 있습니다.

```javascript
// CSS 파일을 임포트 합니다.
import './test.css'

// CSS 파일을 CSS 모듈로 임포트 합니다.
import classNames from './test.css'

// 이미지 파일로 URL을 임포트합니다.
import imageURL from './test.png'

// HTML 파일로 임포트 합니다.
import('./some.html')
// 또는:
import html from './some.html'
// 또는:
require('./some.html')
```

만약 URL로 파일을 참조하는 대신, Javascript 번들에 파일을 인라인으로 위치하려면, Node.js의 `fs.readFileSync` API를 사용하면 됩니다. URL은 정적으로 분석할 수 있어야 하므로, `__dirname` 및 `__filename` 이외의 변수를 가질 수 없습니다.

```javascript
import fs from 'fs'

// 콘텐츠를 String 형태로 읽습니다.
const string = fs.readFileSync(__dirname + '/test.txt', 'utf8')

// 콘텐츠를 Buffer 형태로 읽습니다.
const buffer = fs.readFileSync(__dirname + '/test.png')

// Buffer 형태의 콘텐츠를 이미지로 변환합니다.
;<img src={`data:image/png;base64,${buffer.toString('base64')}`} />
```

## JSX 문법내 이미지

아래는 JSX내에서 사용하기 위해 이미지 파일을 임포트 하는 방법입니다.

```javascript
// 이미지 파일을 임포트 합니다.
import megaMan from "./images/mega-man.png";

// JSX
<img src={megaMan} title="Mega Man" alt="Mega Man" />

// JSX (w/ custom path)
<img src={`/dist${megaMan}`} title="Mega Man" alt="Mega Man" />
```

## Babel

[Babel](https://babeljs.io)은 대규모 플러그인 에코시스템을 갖춘 인기있는 Javascript 변환 플러그인입니다. Pacel과 함께 Babel을 사용하면 독립적으로 또는 다른 번들러와 함께 사용하는 것과 같은 방식으로 작동합니다.

당신의 어플리케이션에 프리셋과 플러그인을 설치합니다.

이후, `.babelrc` 파일을 생성합니다.

```json
{
  "presets": ["@babel/preset-react"]
}
```

`package.json` 내에 `babel` 설정을 추가할 수 있습니다.

```json
"babel": {
  "presets": ["@babel/preset-react"]
}
```

참고: `package.json`이 `.babelrc` 보다 우선적으로 작동합니다.

## 기본 바벨 변환내용

Parcel은 정의 된 대상과 일치할 수 있도록 기본적으로 `@babel/preset-env`을 사용하여 코드(모든 내부 모듈)를 변환합니다.

`browser` 대상의 경우 [browserslist](https://github.com/browserslist/browserslist)를 사용하며, 대상 브라우저 목록은 `package.json` (`engines.browsers` 또는 `browserslist`) 또는 구성파일 (`browserslist` 또는 `.browserslistrc`)에서 정의할 수 있습니다.

browserslist 대상의 기본값은 `>0.25%` 입니다. (즉, 활성화된 총 웹사용자 수의 0.25% 이상인 모든 브라우저를 지원한다는 의미입니다.)

`node` 대상인 경우, Parcel은 `package.json`에 정의된 `engines.node`를 사용하며 기본값은 _node8_ 입니다.
