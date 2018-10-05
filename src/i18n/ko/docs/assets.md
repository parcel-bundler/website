# 📦 애셋

Parcel은 애셋(assets)을 기반으로 합니다. 애셋은 어떤 파일로든 표현될 수 있습니다만, Parcel은 JavaScript, CSS, 그리고 HTML 파일과 같은 특정 유형의 애셋을 특별 지원 합니다. Pacel은 이 파일들 안의 참조에서 자동으로 의존성을 분석하고 출력 번들에 포함시킵니다. 비슷한 유형의 애셋들은 같은 출력 번들로 함께 그룹화 합니다. 만약 다른 유형의 애셋을 임포트 했다면 (예를 들면, JS 파일에서 CSS 파일을 임포트 했다면), 자식 번들이 만들어지고 부모 번들에게 참조를 남깁니다. 후속 섹션에서 이에 대해 설명할 것입니다.

## JavaScript

웹 번들러에 있어 JavaScript는 가장 전통적인 파일 유형입니다. 파일 임포팅을 위해 Parcel은 CommonJS와 ES6 모듈 구문을 모두 지원합니다. 또한 비동기적인 모듈 로드를 위해 다이나믹 `import()` 함수 구문을 지원합니다. 이에 대해선 [코드 분할](code_splitting.html)섹션에서 다룰 것입니다.

```javascript
// CommonJS 구문으로 모듈 임포트
const dep = require('./path/to/dep');

// ES6 import 구문으로 모듈 임포트
import dep from './path/to/dep';
```

JavaScript 파일에 JavaScript가 아닌 애셋 또한 임포트 할 수 있습니다. CSS나 이미지 파일도 됩니다. 이런 파일들을 임포트 할 때, 다른 번들러들처럼 인라인화 되지 않습니다. 대신, 그 파일의 모든 의존 항목과 함께 별도의 번들(예로 CSS 파일)속에 위치하게 됩니다. [CSS Modules](https://github.com/css-modules/css-modules)을 사용할 시, 추출 된 클래스들은 JavaScript 번들에 위치합니다. 다른 애셋 유형은 출력 파일에 대한 URL을 JavaScript 번들에 내보냅니다. 이로써 그 파일들에 대한 참조를 코드안에 갖고 있게 됩니다.

```javascript
// CSS 파일 임포트
import './test.css';

// CSS modules로 CSS 파일 임포트
import classNames from './test.css';

// 이미지 파일의 URL을 임포트
import imageURL from './test.png';
```

만약 파일을 참조 URL이 아닌 인라인으로 JavaScript 번들에 포함시키고 싶다면, Node.js의 `fs.readFileSync` API를 사용하면 됩니다. 이 때 URL은 정적으로 분석 가능해야 합니다. 이 말인 즉, 그 안에 변수를 가질 수 없다는 뜻입니다. (단, `__dirname` 와 `__filename` 는 예외입니다.)

```javascript
import fs from 'fs';

// 내용을 문자열 값으로 읽습니다.
const string = fs.readFileSync(__dirname + '/test.txt', 'utf8');

// 내용을 버퍼로 읽습니다.
const buffer = fs.readFileSync(__dirname + '/test.png');
```

## CSS

CSS 애셋은 JavaScript나 HTML 파일로부터 임포트 될 수 있습니다. CSS애셋에는 `@import` 구문을 통해 참조되는 의존성과 `url()` 함수를 통해 참조되는 이미지, 폰트등이 포함될 수 있습니다. `@import`된 다른 CSS 파일은 동일한 CSS 번들에 인라인으로 포함됩니다. `url()`참조는 그것들의 출력 파일 이름으로 재작성 됩니다. 모든 파일 이름은 현재 CSS 파일과 관련 있어야 합니다.

```css
/* 다른 CSS 파일 임포트 */
@import './other.css';

.test {
  /* 이미지 파일 참조 */
  background: url('./images/background.png');
}
```

평범한 CSS 외에 LESS, SASS, Stylus 같은 다른 컴파일-투-CSS 언어 역시 지원하며 같은 방식으로 동작합니다.

## SCSS

SCSS를 컴파일 하기 위해서는 `sass` 모듈이 필요합니다. 다음 명령어로 설치해주세요.
```bash
npm install sass
```
`sass`를 설치했다면 이제 SCSS 파일을 JavaScript 파일에서 import 할 수 있습니다.
```javascript
import './custom.scss'
```

SCSS에서 `@import` 구문으로 포함된 의존성도 처리됩니다.


## HTML

HTML 애셋은 주로 Parcel 진입 파일로 사용됩니다. 그렇지만 JavaScript 파일에 의해서, 예로 다른 페이지로의 링크를 제공하기위해 참조 될 수도 있습니다. 스크립트, 스타일, 미디어, 그리고 다른 HTML 파일의 URL은 위에서 설명한것 처럼 추출되고 컴파일됩니다. 참조는 HTML 안에서 재작성 됨으로써 정확한 출력 파일로 연결 됩니다. 모든 파일 이름은 현재의 HTML 파일과 관련 있어야 합니다.

```html
<html>
<body>
  <!-- 이미지 파일 참조 -->
  <img src="./images/header.png">

  <a href="./other.html">다른 페이지로 연결</a>

  <!-- 자바스크립트 번들 임포트 -->
  <script src="./index.js"></script>
</body>
</html>
```
