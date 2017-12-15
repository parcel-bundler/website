# 🍰 레시피

## React

먼저 React를 위해 다음 의존성들을 설치합니다.

[Blog Post](http://blog.jakoblind.no/react-parcel/)

```
npm install --save react
npm install --save react-dom
npm install --save-dev parcel-bundler
npm install --save-dev babel-preset-env
npm install --save-dev babel-preset-react
```

<sub>혹시 yarn 패키지 매니저를 사용하신다면 다음의 명령어로 설치할 수 있습니다.</sub>

```
yarn add react
yarn add react-dom
yarn add --dev parcel-bundler
yarn add --dev babel-preset-env
yarn add --dev babel-preset-react
```

그리고 다음과 같이 babel 설정 파일을 만들어주세요.

```javascript
 // .babelrc
{
  "presets": ["env", "react"]
}
```

그리고 시작 스크립트를 `package.json`에 지정해주세요.

```javascript
// package.json
"scripts": {
  "start": "parcel index.html"
}
```

## Preact

먼저 Preact를 위해 다음 의존성들을 설치합니다.

```
npm install --save preact
npm install --save preact-compat
npm install --save-dev parcel-bundler
npm install --save-dev babel-preset-env
npm install --save-dev babel-preset-preact
```

<sub>혹시 yarn 패키지 매니저를 사용하신다면 다음의 명령어로 설치할 수 있습니다.</sub>

```
yarn add preact
yarn add preact-compat
yarn add --dev parcel-bundler
yarn add --dev babel-preset-env
yarn add --dev babel-preset-preact
```

그리고 다음과 같이 babel 설정 파일을 만들어주세요.

```javascript
// .babelrc
{
  "presets": ["env", "preact"]
}
```

그리고 시작 스크립트를 `package.json`에 지정해주세요.

```javascript
// package.json
"scripts": {
  "start": "parcel index.html"
}
```
