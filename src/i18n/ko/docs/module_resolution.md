# 📔 모듈 해석

Parcel 해석기는 수정된 버전의 [node_modules 해석](https://nodejs.org/api/modules.html#modules_all_together) 알고리즘을 구현합니다.

## 모듈 해석

표준 알고리즘 외에도, [Parcel에서 지원하는 애셋 유형](https://parceljs.org/assets.html)도 해석됩니다.

모듈 해석은 다음과 관련됩니다.:

- **entry root**: Parcel에 지정된 진입점(entry point)의 디렉토리 또는 여러 진입점이 지정된 공유 루트 (공통 상위 디렉토리)
- **package root**: `node_modules`에 가장 가까운 모듈의 루트 디렉토리

### 절대경로

`/foo`는 **entry root**의 상대적인 경로의 `foo`를 해석합니다.

### ~(틸드) 경로

`~/foo`는 **package root**의 상대적인 경로의 가장 가까운 경로를 해석합니다. 만약 모듈이 없다면, **entry root**에서 해석합니다.

### Glob 파일 경로

Glob 파일 경로는 여러 애셋을 묶어 한꺼번에 가져올 수 있는 와일드카드 임포트입니다. Glob은 일부 또는 모든 파일 (`/assets/*.png`)과 여러 디렉토리에 있는 파일 (`/assets/**/*`)과 일치할 수 있습니다.

다음은 png 파일의 디렉토리를 묶어 dist URL을 반환하는 예제입니다.

```javascript
import foo from "/assets/*.png";
// {
//   'file-1': '/file-1.8e73c985.png',
//   'file-2': '/file-1.8e73c985.png'
// }
```

### package.json의 `browser` 필드

만약 package에 [package.browser 필드](https://docs.npmjs.com/files/package.json#browser)가 존재하는 경우, Parcel은 package.main대신 이 항목을 사용합니다.

### 별칭 (Aliases)

별칭은 `package.json` 파일에 `alias` 필드를 통해 지원합니다.

다음 예제는 `react`를 `preact`로 별칭을 지정하고, `node_modules`에 없는 일부 로컬의 사용자 정의 모듈을 지정합니다.

```json
// package.json
{
  "name": "some-package",
  "devDependencies": {
    "parcel-bundler": "^1.7.0"
  },
  "alias": {
    "react": "preact-compat",
    "react-dom": "preact-compat",
    "local-module": "./custom/modules"
  }
}
```

일부는 Parcel에서 사용하고, 다른 일부는 서드파티 도구 또는 익스텐션에서 사용하는 것을 방지하기 위해서, 특수문자를 사용하지 마십시오. 예를 들면 다음과 같습니다.:

- `~`는 Parcel에서 [~ 경로](#~-tilde-paths)로 해석합니다.
- `@`는 npm organizations에서 사용됩니다.

별칭을 정의할때는 명시적으로 정의하는 것이 좋습니다. **파일 확장자를 지정** 하십시오. 지정하지 않는 경우, Parcel에서 이를 추측해야 합니다. 이에 대한 예제는 [JavaScript Named Exports](#javascript-named-exports)를 참고하십시오.

## 공통 이슈

### Javascript Named Exports

별칭을 매핑하는 것은 많은 애셋 타입에서 사적용되며, Javascript named exports에서 특별히 적용되지는 않습니다. JS named exports를 사용하려면 다음을 수행하십시오.:

```json
// package.json
{
  "name": "some-package",
  "alias": {
    "ipcRenderer": "./electron-ipc.js" // specify file extension
  }
}
```

그리고 별칭이 매핑된 파일을 다시 export 합니다.:

```js
// electron-ipc.js
module.exports = require('electron').ipcRenderer
```

### Flow에서 절대경로 또는 ~경로 해석

Flow에서 절대경로 또는 ~경로 해석을 사용하는 경우 [module.name_mapper](https://flow.org/en/docs/config/options/#toc-module-name-mapper-regex-string)기능을 사용해야 합니다.

다음과 같은 프로젝트 구성이 제공된다고 가정합니다.:

```
package.json
.flowconfig
src/
  index.html
  index.js
  components/
    apple.js
    banana.js
```

그리고 진입점은 `src/index.html` 이며, **entry root*는 `src/` 폴더입니다.

그러므로, 임포트를 정확하게 매핑하기 위해서는 다음과 같이 사용합니다.:

```javascript
// index.js
import Apple from '/components/apple'
```

`/components/apple`의 선행된 `/`를 `src/`로 바꾸기 위한 Flow 설정이 필요합니다. 결과적으로 `src/components/apple`이 됩니다.

`.flowconfig` 설정은 다음과 같이 대체합니다.

```ini
[options]
module.name_mapper='^\/\(.*\)$' -> '<PROJECT_ROOT>/src/\1'
```

`<PROJECT_ROOT>`는 `.flowconfig`의 위치를 나타내는 Flow의 특정 식별자 입니다.

참고: `module.name_mapper`는 여러 항목을 가질 수 있습니다. 이를 통해 [절대경로](module_resolution.html#absolute-paths) 또는 [~경로](module_resolution.html#~-tilde-paths)의 해석을 지원할 수 있습니다.

### Typescript 해석

Typescript에서는 `~` 모듈에 대한 내용이 명시되어야 합니다. 자세한 내용은 [TypeScript Module Resolution docs](https://www.typescriptlang.org/docs/handbook/module-resolution.html)을 참조하십시오.

```json
// tsconfig.json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "~*": ["./src/*"]
    }
  }
}
```

### 모노리포 해석

모노리포와 함께 권장되는 내용은 다음과 같습니다.:

권장 사용:

- 상대 경로를 사용하세요.
- root경로가 필요한 경우 `/`를 사용하세요

권장하지 않는 사용:

- 모노리포에서 `~`를 **사용하지 않는 것**을 권장합니다.

모노리포 사용자이고, 이러한 권장 사항에 기여하기 위해서는 예제와 함께 이슈를 제공해 주세요.
