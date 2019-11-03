# CSS

_지원하는 확장자: `css`, `pcss`, `postcss`_

CSS 애셋들은 JavaScript 또는 HTML 파일에 임포트 될 수 있습니다.

```js
import './index.css';
```

```html
<link rel="stylesheet" type="text/css" href="index.css">
```

CSS 애셋은 `url()` 함수를 통해 이미지, 폰트등을 참조할 뿐만 아니라, `@import` 문법으로 참조되는 의존성들을 포함할 수 있습니다. `@import`된 다른 CSS 파일은 동일한 CSS 번들에 인라인 되고, `url()` 참조는 출력되는 파일 이름으로 다시 작성됩니다. 모든 파일 이름은 현재 CSS 파일을 기준으로 해야합니다.

```css
/* 다른 CSS 파일을 임포트 합니다. */
@import './other.css';

.test {
  /* 이미지 파일을 참조합니다. */
  background: url('./images/background.png');
}
```

일반적인 CSS 외에도, LESS, SASS 및 Stylus와 같은 CSS로 컴파일되는 다른 언어들도 지원되며, CSS와 동일한 방식으로 작동됩니다.

### PostCSS

[PostCSS](http://postcss.org)는 [autoprefixer](https://github.com/postcss/autoprefixer), [Preset Env](https://github.com/csstools/postcss-preset-env), 그리고 [CSS Modules](https://github.com/css-modules/css-modules)와 같은 플러그인으로 CSS를 변환하는 도구입니다. `.postcssrc` (JSON), `.postcssrc.js` 또는 `postcss.config.js` 중 하나를 사용한 구성파일을 작성하여 Parcel을 이용해 PostCSS를 구성할 수 있습니다.

어플리케이션에 플러그인을 설치합니다.

```bash
yarn add postcss-modules autoprefixer
```

그리고, `.postcssrc` 파일을 만듭니다.

```json
{
  "modules": true,
  "plugins": {
    "autoprefixer": {
      "grid": true
    }
  }
}
```

플러그인은 `plugins` 객체의 키로 지정될 수 있으며, 옵션은 객체의 값을 사용하여 정의할 수 있습니다. 플러그인에 대한 옵션이 없다면, `true`로 대신 설정합니다.

Autoprefixer, cssnext 및 기타 도구의 대상 브라우저는 `.browserslistrc` 파일에서 지정 할 수 있습니다.

```
> 1%
last 2 versions
```

CSS 모듈은 최상위의 `modules` 키를 사용하여 약간 다르게 활성화 됩니다. Parcel은 JavaScript 번들에 포함될 객체를 내보내기 때문에 CSS 모듈을 특별한 방법으로 지원해야 하기 때문입니다. 참고로 여전히 프로젝트에 `postcss-modules`를 설치해야 합니다.

### 기존의 CSS 라이브러리와 함께 사용하기

CSS 모듈이 기존의 모듈과 같이 올바르게 작동하기 위해서, 기존 모듈의 자체 `.postcssrc`지원을 특정해서 지정해야 합니다.

### cssnano 최소화 설정 구성하기

Parcel은 프로덕션 빌드과정에서 `cssnano.config.js` 파일을 생성하여 커스텀 구성을 설정할 수 있는 프로덕션 빌드에서 CSS를 최소화 하기 위해 [cssnano](http://cssnano.co)를 postcss에 추가합니다.

```js
module.exports = {
  preset: [
    'default',
    {
      calc: false,
      discardComments: {
        removeAll: true
      }
    }
  ]
}
```
