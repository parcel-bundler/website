# 📚 API

## 번들러

보다 복잡한 사용을 위해(가령 매 빌드 후 임의의 프로세싱을 해야한다던가) CLI 대신 API 를 이용해서 번들러를 초기화 할 수 있습니다.
모든 옵션이 설명된 아래 예시를 보세요.

```js
const Bundler = require('parcel-bundler')
const Path = require('path')

// 진입점 파일 위치
const file = Path.join(__dirname, './index.html')

// 번들러 옵션
const options = {
  outDir: './dist', // 빌드 결과물이 저장될 디렉토리. 기본값은 dist
  outFile: 'index.html', // 결과물의 파일명
  publicUrl: './', // 서버상의 위치. 기본값은 '/'
  watch: true, // 파일 변경을 감지해서 변경시 다시 빌드할지 여부. 기본값은 process.env.NODE_ENV !== 'production'
  cache: true, // 캐시를 활성화할지 여부. 기본값은 true
  cacheDir: '.cache', // 캐시를 저장할 디렉토리. 기본값은 .cache
  minify: false, // 파일 미니파이케이션. process.env.NODE_ENV === 'production'면 활성화됨.
  target: 'browser', // browser/node/electron, 기본값은 browser
  https: false, // 파일을 https로 서빙할지 http로 할지 여부. 기본값은 false
  logLevel: 3, // 3 = 모든것을 로깅, 2 = 경고와 에러를 로깅, 1 = 에러만 로깅
  hmrPort: 0, // HMR 소켓이 돌아갈 포트번호. 기본값은 무작위의 빈 포트 (node.js에서 0은 무작위의 빈 포트로 배정됨)
  sourceMaps: true, // 소스맵을 활성화할지 여부. 기본값은 활성화 (아직 미니파이드 빌드에선 지원되지 않음)
  hmrHostname: '', // 빠른 모듈 교체를 위한 hostname.기본값은 ''
  detailedReport: false // 번들, 애셋, 파일 크기, 빌드 시간을 담은 상세한 리포트를 출력. 기본값은 false. 리포트는 오직 watch가 비활성일때만 출력됨
}

async function runBundle() {
  // 진입점 위치와 옵션을 제공해서 번들러를 초기화
  const bundler = new Bundler(file, options)

  // 번들러를 실행함. 이것은 메인 번들을 반환함.
  // watch 모드를 사용할 경우 이 promise는 매 빌드마다 호출하는게 아니라 딱 한 번만 호출하고 이벤트를 사용할 것
  const bundle = await bundler.bundle()
}

runBundle()
```

### 이벤트

모든 번들러 이벤트 목록입니다.

- `bundled` 이벤트는 **처음 한 번만**, Parcel 이 성공적으로 번들링을 마친 후 발생되어, 메인 [번들](#번들)을 callback 에 전달합니다.

```js
const bundler = new Bundler(...);
bundler.on('bundled', (bundler) => {
  // bundler는 모든 애셋과 번들을 포함합니다. 자세한건 문서를 참조하세요.
});
// 어디선가 bundler.bundle() 를 호출함
```

- `buildEnd` 이벤트는 **재빌드를 포함한** 빌드 후 매번 발생됩니다. 에러가 발생한 경우에도 발생합니다.

```js
const bundler = new Bundler(...);
bundler.on('buildEnd', () => {
  // Do something...
});
// 어디선가 bundler.bundle() 를 호출함
```

### 번들

`Bundle`은 Parcel 이 애셋을 함께 번들링하기 위해 사용하며, 번들 트리를 빌드하기 위해 자식, 형제 번들을 포함합니다.

#### 속성들

- `type`: 애셋의 종류 (e.g. js, css, map, ...)
- `name`: 번들의 이름 (`entryAsset`의 `Asset.generateBundleName()`로 생성)
- `parentBundle`: 부모 번들. 진입점 번들일 경우 null
- `entryAsset`: 번들의 진입점. name 의 생성 및 애셋 수집에 사용.
- `assets`: 번들 안에 있는 모든 애셋의 집합(`Set`)
- `childBundles`: 모든 자식 번들의 `Set`
- `siblingBundles`: 모든 형제 번들의 `Set`
- `siblingBundlesMap`: 모든 형제 번들의 `Map<String(Type: js, css, map, ...), Bundle>`
- `offsets`: 번들 안의 애셋 속의 모든 위치의 `Map<Asset, number(bundle 안의 줄 번호)>`. 정확한 소스맵 생성을 위해 사용됨

#### Tree

`Bundle`은 `parentBundle`, `childBundles`, `siblingBundles`을 포함하고, 이 모든 속성은 빠르게 번들트리를 순회하여 만들어집니다.

매우 기본적인 애셋 트리로 번들 트리를 생성합니다.

##### 애셋 트리

`index.html`는 `index.js`와 `index.css`를 필요로 합니다.

`index.js`는 `test.js`와 `test.txt`를 필요로 합니다.

```Text
index.html
-- index.js
 |--- test.js
 |--- test.txt
-- index.css
```

##### 번들 트리:

`index.html`은 메인 번들을 위해 진입 애셋으로 사용됩니다. 이 메인 번들은 `index.js`과 `index.css` 2 개의 자식 번들을 만듭니다. 둘 다 `html`과 다른 타입이기 때문입니다.

`index.js`는 `test.js`, `test.txt` 두 파일을 필요로 합니다.

`test.js`은 `index.js` 번들의 애셋으로 추가됩니다. `index.js`와 같은 에샛 타입이기 때문입니다.

`test.txt`는 `index.js`와 다른 애셋 타입이기 때문에 이를 위해 새 번들이 생성되고, 해당 번들은 `index.js` 번들의 자식으로 추가됩니다.

`index.css`는 다른 의존성이 없고, 엔트리 애셋에서만 쓰입니다.

`index.css`와 `index.js` 번들은 같은 부모를 가지므로 서로의 형제 번들 입니다.

```Text
index.html
-- index.js (index.js와 test.js를 포함)
 |--- test.txt (test.txt를 포함)
-- index.css (index.css를 포함)
```

### Middleware

미들웨어는 http 서버의 훅으로 사용될 수 있습니다. (예를 들어 `express`나 node `http`).

Parcel 미들웨어를 express 와 사용하는 예제입니다.

```js
const Bundler = require('parcel-bundler')
const app = require('express')()

const file = 'index.html' // 엔트리 포인트로 쓰일 절대경로를 적습니다
const options = {} // 가능한 옵션은 API 문서를 참조하세요

// 파일과 옵션을 사용해 번들러를 초기화합니다
const bundler = new Bundler(file, options)

// express가 번들러 미들웨어를 사용할 수 있게 합니다. 그러면 express server를 거치는 매 요청을 Parcel이 처리할 것입니다.
app.use(bundler.middleware())

// 8080포트로 listen을 시작합니다.
app.listen(8080)
```
