# 🍰 레시피

## React

먼저 React 를 위해 다음 의존성들을 설치합니다.

[Blog Post](http://blog.jakoblind.no/react-parcel/)

```bash
npm install --save react
npm install --save react-dom
npm install --save-dev parcel-bundler
```

<sub>혹시 yarn 패키지 매니저를 사용하신다면 다음의 명령어로 설치할 수 있습니다.</sub>

```bash
yarn add react
yarn add react-dom
yarn add --dev parcel-bundler
```

그리고 시작 스크립트를 `package.json`에 지정해주세요.

```javascript
// package.json
"scripts": {
  "start": "parcel index.html"
}
```

## Preact

먼저 Preact 를 위해 다음 의존성들을 설치합니다.

```bash
npm install --save preact
npm install --save-dev parcel-bundler
```

<sub>혹시 yarn 패키지 매니저를 사용하신다면 다음의 명령어로 설치할 수 있습니다.</sub>

```bash
yarn add preact
yarn add --dev parcel-bundler
```

그리고 시작 스크립트를 `package.json`에 지정해주세요.

```javascript
// package.json
"scripts": {
  "start": "parcel index.html"
}
```

## Vue

먼저, Vue 를 사용하기 위해 의존성을 설치합니다.

```bash
npm install --save vue
npm install --save-dev parcel-bundler
```

<sub>혹시 yarn 패키지 매니저를 사용하신다면 다음의 명령어로 설치할 수 있습니다.</sub>

```bash
yarn add vue
yarn add --dev parcel-bundler
```

`package.json`에 시작 스크립트를 작성해주세요.

```javascript
// package.json
"scripts": {
  "start": "parcel index.html"
}
```
