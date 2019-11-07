# SCSS

_지원하는 확장자: `sass`, `scss`_

SCSS 컴파일은 `sass` (`dart-sass`의 JS 버전) 모듈을 필요로 합니다.

npm으로 설치하기:

```bash
npm install -D sass
```

yarn으로 설치하기:

```bash
yarn add -D sass
```

`sass`가 설치되면, Javascript 파일에서 SCSS 파일을 임포트 할 수 있습니다.

```javascript
import './custom.scss'
```

SCSS 파일을 HTML 파일에 직접 포함시킬 수도 있습니다.

```html
<link rel="stylesheet" href="./style.scss">
```

SCSS 파일의 종속적인 파일은 `@import` 구문과 함께 사용할 수 있습니다.

Parcel을 실행하기 전에 `sass` 모듈이 설치되어 있지 않다면, Parcel은 자동으로 `sass` 모듈을 설치합니다.

또한, `.sassrc` 설정 파일을 작성하여 Parcel을 이용하여 sass 컴파일을 구성할 수 있습니다.

예를 들어, 생성된 CSS의 아웃풋 스타일을 다음과 같이 지정하여 제어할 수 있습니다.

```
{
  outputStyle: "nested",
}
```

**참고:** SCSS 컴파일을 위해서 `node-sass` 모듈을 사용 할 수도 있습니다. `node-sass` 모듈을 사용하면 컴파일 속도가 빨라집니다. 그러나, Parcel과 함께 `node-sass` 모듈을 사용하게 될때 [이슈](https://github.com/parcel-bundler/parcel/issues/1836)가 제기된 적이 있습니다.
