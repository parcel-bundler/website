# ✂️ 코드 분할

Parcel은 일체의 설정 없이(zero configuration) 코드 분할(splitting)을 지원합니다. 애플리케이션 코드를 필요할 때에 로드할 수 있는 각각의 번들로 분할 할 수 있습니다. 이로 인해 초기 번들이 더 작아지고 로드 시간이 더 빨리지게 됩니다. 사용자가 애플리케이션을 탐색하다 모듈이 필요해지면, Parcel이 자동으로 필요한 하위 번들을 처리합니다.

코드 분할은 다이나믹 `import()` 함수 [구문 제안](https://github.com/tc39/proposal-dynamic-import)으로 제어합니다. 이 함수는 보통의 `import`나 `require`함수처럼 움직이지만 프로미스(Promise)를 반환합니다. 이것은 모듈이 비동기적으로 로드됨을 의미합니다.

아래 예제는 다이나믹 임포트로 애플리케이션 요구에 따라 어떻게 서브페이지를 로드하는지 보여줍니다.

```javascript
import('./pages/about').then(function (page) {
  // 페이지 렌더
  page.default();
});
```

`import()`가 프로미스를 반환하기 때문에 async/await 구문을 사용할 수 있습니다. 더 많은 브라우저가 이를 지원하기 전 까지는 Babel을 구성하여 구문을 변환할 필요가 있을 겁니다.

```javascript
const page = await import('./pages/about');
// 페이지 렌더
page.default();
```

다이나믹 임포트는 Pacel에서 지연 로드 됩니다. 따라서 모든 `import()` 호출을 파일 최상위에 놓고 하위 번들이 사용되기 전까지 로드되지 않게 할 수 있습니다. 아래 예제는 애플리케이션 서브페이지가 동적으로 지연 로드되는 방식을 보여줍니다.

```javascript
// 다이나믹 임포트 할 페이지 이름을 준비.
// 사용되기 전까지 로드 되지 않음.
const pages = {
  about: import('./pages/about'),
  blog: import('./pages/blog')
};

async function renderPage(name) {
  // 요청 페이지 로드 지연
  const page = await pages[name];
  return page.default();
}
```

**주의:** 만약 브라우저에서 async/await를 사용하고 싶다면, `babel-polyfill`을 앱에 포함시키거나 `babel-runtime` + `babel-plugin-transform-runtime`이 라이브러리에 있어야 합니다. 그냥 사용하려고 하지 마세요.

```bash
yarn add babel-polyfill
```

```javascript
import "babel-polyfill";
import "./app";
```

[babel-polyfill](http://babeljs.io/docs/usage/polyfill)와 [babel-runtime](http://babeljs.io/docs/plugins/transform-runtime)를 읽어보세요.
