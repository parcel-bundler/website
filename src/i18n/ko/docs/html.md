# HTML

_지원되는 확장자: `htm`, `html`_

HTML 애셋은 종종 Parcel에서 제공하는 엔트리 파일이지만, Javascript 파일에서 또한 참조할 수도 있습니다. (예를들면, 다른페이지에 대한 링크를 제공하기 위해서 사용됩니다.) 스크립트, 스타일, 미디어 또는 다른 HTML 파일을 위한 URL은 앞에서 설명한대로 추출 및 컴파일 됩니다. 이러한 참조들은 출력하는 파일에 올바르게 링크되도록 HTML로 다시 작성됩니다. 모든 파일이름은 현재 HTML 파일을 기준으로 관계되어야 합니다.

```html
<html>
<body>
  <!-- 이미지 파일 참조 -->
  <img src="./images/header.png">

  <a href="./other.html">Link to another page</a>

  <!-- JavaScript 참조 -->
  <script src="./index.js"></script>
</body>
</html>
```

## Javascript에서 HTML 임포트하기

Javascript에서 HTML을 가져올 때는 HTML 문자열이 정적으로 포함되지 않지만, [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)를 사용하여 HTML 파일을 동적으로 가져옵니다. Internet Explorer 11 및 이전 버전의 브라우저를 지원하려면, `Promise` 및 `fetch` 폴리필이 제공되어야 합니다.

## 컴파일안된 애셋을 임포트하기

Parcel이 HTML로 컴파일 할 수 있는 파일(예: JavaScript, TypeScript, SCSS)에 대한 링크 추가가 지원됩니다. Parcel은 자동으로 파일을 처리하고 컴파일된 애셋을 가리키도록 링크를 업데이트합니다.

```html
<html>
  <head>
    <!-- SCSS 파일을 포함하기 -->
    <link rel="stylesheet" href="./my-styles/style.scss">
  </head>
</html>
```

