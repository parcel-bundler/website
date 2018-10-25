# 🚀 시작하기

Parcel`[파설, /parsəl/]`은 개발 경험에서 차이를 느낄수 있는 웹 애플리케이션 번들러 입니다. 멀티코어 프로세싱으로 불꽃 튀게 빠른 성능을 제공하고 그 어떤 설정도 요구하지 않습니다.

먼저 Yarn 이나 npm 으로 Parcel 을 설치하세요.

Yarn:

```bash
yarn global add parcel-bundler
```

npm:

```bash
npm install -g parcel-bundler
```

그 다음, package.json 파일을 프로젝트 디렉토리에 만드세요.

```bash
yarn init -y
```

또는

```bash
npm init -y
```

Parcel 은 어떤 유형의 파일이라도 진입점으로 취할 수 있지만 HTML 이나 JavaScript 파일이 좋습니다. 만약 HTML 파일 내에 상대경로로 메인 JavaScript 파일을 연결 했다면, Parcel 은 이 또한 처리 할 것이고, 출력 파일로의 URL 참조를 교체할 겁니다.

그럼, index.html 과 index.js 파일을 만들어 봅시다.

```html
<html>
<body>
  <script src="./index.js"></script>
</body>
</html>
```

```javascript
console.log('hello world')
```

Parcel 은 파일 변화를 자동으로 다시 빌드(rebuild) 하고 [빠른 모듈 교체](hmr.html)를 지원하는 내장 개발용 서버가 있어 빠른 개발이 가능해 집니다. 그저 진입 파일을 지정하면 됩니다:

```bash
parcel index.html
```

이제 브라우저에서 http://localhost:1234/ 에 접속하세요. 만약 빠른 모듈 교체가 동작하지 않는다면 [에디터 설정을 변경](hmr.html#safe-write)하셔야 합니다. 기본 포트번호를 `-p <port number>` 옵션으로 덮어 쓸 수도 있습니다.

본인 소유의 서버가 없거나 완전히 클라이언트에서만 렌더되는 앱이라면 개발용 서버를 사용하세요. 만약 본인 소유의 서버가 있다면 `watch` 모드로 Parcel 을 구동할 수 있습니다. 이 역시 파일 변화를 자동 리빌드(rebuild) 하고 빠른 모듈 교체를 지원합니다. 그러나 웹 서버를 시동시키지는 않습니다.

```bash
parcel watch index.html
```

프로덕션을 위한 빌드를 할 준비가 되었다면, `build` 모드로 감시 기능을 끄고 한 번만 빌드 합니다. [프로덕션](production.html) 섹션에서 보다 자세한 사항들을 확인해 보세요.
