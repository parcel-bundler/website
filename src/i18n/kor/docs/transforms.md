# 🐠 변환

대부분의 번들러들이 애셋 변환(transform)을 위한 플러그인 설치와 설정(configuration)을 요구합니다. Parcel은 많은 수의 일반적인 변환과 트랜스파일러를 내장하여 지원합니다. [Babel](https://babeljs.io)을 사용하는 JavaScript, [PostCSS](http://postcss.org)을 사용하는 CSS, [PostHTML](https://github.com/posthtml/posthtml)을 사용하는 HTML을 변환할 수 있습니다. Parcel은 모듈 안에서 설정 파일(예: `.babelrc`, `.postcssrc`)을 발견했을 때 자동으로 이 변환을 실행합니다.

써드파티(third-party) `node_modules`에서도 작동합니다: 만약 설정 파일이 패키지의 일부로 만들어지면 그 변환은 해당 모듈에서만 자동으로 켜집니다. 이것이 번들링을 빠르게 해줍니다. 오직 변환에 필요한 모듈만이 가공되기 때문입니다. 이는 또한 어떤 파일을 포함하고 제외하기 위해 수동으로 변환을 구성할 필요가 없음을 뜻합니다. 애플리케이션에 써드파티 코드를 사용하기 위해 그것이 어떻게 빌드 되었는지 알 필요가 없음을 의미합니다.

## Babel

[Babel](https://babeljs.io)은 커다란 플러그인 환경을 갖춘 인기있는 JavaScript 트랜스파일러입니다. Parcel을 Babel과 함께 사용하는 것은 독립형으로 사용 할 때나 다른 번들러와 함께 사용할 때와 똑같은 방식으로 작동합니다.

플러그인과 프리셋을 앱에 설치 하세요:

```bash
yarn add babel-preset-env
```

그리고나서, `.babelrc`를 만듭니다:

```json
{
  "presets": ["env"]
}
```

## PostCSS

[PostCSS](http://postcss.org)는 plugin을 사용하여 CSS를 변환하는 도구입니다. [autoprefixer](https://github.com/postcss/autoprefixer), [cssnext](http://cssnext.io/), [CSS Modules](https://github.com/css-modules/css-modules)와 같이 말입니다. `.postcssrc` (JSON), `.postcssrc.js`, 또는 `postcss.config.js` 중 하나의 파일을 작성하여 Parcel로 PostCSS를 설정할 수 있습니다.

플러그인을 앱에 설치 하세요:

```bash
yarn add postcss-modules autoprefixer
```

그리고 `.postcssrc`를 만듭니다:

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

플러그인은 `plugins` 객체에 키로 지정되고 옵션은 객체의 값으로 정의 됩니다. 만약 플러그인에 옵션이 없다면, 대신 `true`로 설정하세요.

Autoprefixer, cssnext 그리고 다른 도구의 대상 브라우저는 `.browserslistrc`로 지정할 수 있습니다:

```
> 1%
last 2 versions
```

CSS Modules은 최상위 `modules` 키를 사용하여 약간 다른 방식으로 활성화 됩니다. CSS Modules은 JavaScript 번들에 포함될 객체를 내보내므로 Parcel로 하여금 특별한 지원을 필요로 하기 때문입니다. `postcss-modules`가 프로젝트 안에 설치되어야 함을 주의하세요.

## PostHTML

[PostHTML](https://github.com/posthtml/posthtml) 플러그인으로 HTML을 변환하기 위한 도구입니다. `.posthtmlrc` (JSON), `posthtmlrc.js`, `posthtml.config.js` 중 하나의 파일을 작성하여 Parcel에 PostHTML을 설정할 수 있습니다.

플러그인을 앱에 설치 하세요:

```bash
yarn add posthtml-img-autosize
```

그 후, `.posthtmlrc`을 작성하세요:

```json
{
  "plugins": {
    "posthtml-img-autosize": {
      "root": "./images"
    }
  }
}
```

플러그인은 `plugins` 객체에 키로 지정되고 옵션은 객체의 값으로 정의 됩니다. 만약 플러그인에 옵션이 없다면, 대신 `true`로 설정하세요.
