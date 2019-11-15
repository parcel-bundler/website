# 🛠️ 디버깅

Parcel은 기본적으로 소스맵을 자동으로 생성하기 때문에, Parcel을 이용하여 디버깅을 설정하면 대부분의 영역을 최소한의 노력으로 디버깅 할 수 있습니다.

## 크롬 개발자 도구

소스맵이 가능하면, 부가적인 설정이 필요없습니다.

예를 들면, 다음과 같은 폴더 구성이 있다고 가정합니다.

```
├── package-lock.json
├── package.json
└── src
    ├── index.html
    └── index.ts
```

`index.ts`는 다음을 포함합니다.

```Typescript
const variable: string = "Hello, World!";

document.getElementById("greeting").innerHTML = variable;
```

그리고 `index.html`은 다음을 포함합니다.

```html
<!DOCTYPE html>
<html>
  <head>
    <title>Chrome Debugging Example</title>
  </head>
  <body>
    <h1 id="greeting"></h1>
    <script src="./index.ts"></script>
  </body>
</html>
```

(`package.json`에는 `parcel-bundler`만 설치되어 있습니다.)

이 설정으로, `parcel src/index.html`을 설정하고, 소스코드에서 breakpoint를 설정할 수 있습니다.

![크롬 Breakpoint 예시](https://user-images.githubusercontent.com/30810402/67711207-dd519500-f997-11e9-987a-570d1ce677d4.png)

## Visual Studio code

Chrome 개발자 도구 설정과 유사한 폴더 및 파일 구성을 가정하면, `launch.json`을 [Debugger for Chrome](https://marketplace.visualstudio.com/items?itemName=msjsdiag.debugger-for-chrome) 과 함께 사용할 수 있습니다.

```json
{
  // 가능한 속성을 사용하기 위해 인텔리센스를 사용합니다.
  // 기존 속성을 사용하려면 마우스를 속성 위에 올립니다.
  // 더 많은 정보를 보시려면 https://go.microsoft.com/fwlink/?linkid=830387 을 살펴보십시오
  "version": "0.2.0",
  "configurations": [
    {
      "type": "chrome",
      "request": "launch",
      "name": "Launch Chrome against localhost",
      "url": "http://localhost:1234",
      "webRoot": "${workspaceFolder}",
      "breakOnLoad": true,
      "sourceMapPathOverrides": {
        "../*": "${webRoot}/*"
      }
    }
  ]
}
```

설정한 다음, `index.html`을 진입점 (엔트리 포인트)로 설정하여 Parcel 개발 서버를 실행합니다.

```
$ parcel src/index.html
```

마지막 단계는 디버그 패널에서 녹색 화살표를 클릭하여 디버깅 프로세스를 실행시키는 것입니다. 이제 코드에서 breakpoint를 설정할 수 있습니다. 최종 결과는 다음과 유사합니다.

![VSCode 디버깅 예시](https://user-images.githubusercontent.com/30810402/67711603-ad56c180-f998-11e9-8cee-637fe5537643.png)
