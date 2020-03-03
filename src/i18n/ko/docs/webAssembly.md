# WebAssembly

_지원하는 확장자: `wasm`_

[WebAssembly](https://webassembly.org)는 새로운 기술이지만 가까운 장래에 웹에 큰 영향을 미칠 기술입니다. 이제 Node 뿐만 아니라 모든 주요 웹 브라우저에서 지원되는 WebAssembly는 Javascript 언어로 변환할 수 있을 뿐만 아니라 웹에서 다양한 언어를 사용할 수 있게 합니다.

C와 Rust같이 로우레벨의 작은 파일 크기와 빠른 런타임을 가진 로우레벨의 언어는 WebAssembly로 컴파일 할 수 있습니다. WebAssembly로 컴파일된 코드를 사용하면 거의 동등한 수준의 성능을 얻을 수 있을 뿐만 아니라 종종 동등한 Javascript보다 훨씬 빠릅니다. 가까운 시일 내에 Javascript 라이브러리가 성능이 중요한 코드 섹션을 위해서 WebAssembly를 사용하기 시작 할 것입니다.

Parcel을 사용하면 WebAssembly를 **무지 쉽게** 시작할 수 있습니다. 이미 `.wasm` 파일이 있다고 가정하면 (다음 섹션에서 더 쉬운 방법을 참조하세요!) 평소처럼 임포트 할 수 있으며, 동기 및 비동기 임포트가 모두 지원됩니다.

```js
// 동기 임포트
import { add } from './add.wasm'
console.log(add(2, 3))
// 비동기 임포트
const { add } = await import('./add.wasm')
console.log(add(2, 3))
```

`.wasm` 파일을 동기적으로 가져올때 Parcel은 Javascript 번들을 실행하기 전에 파일을 미리 로드하기 위한 추가 코드를 자동으로 생성합니다. 이는 바이너리 WebAssembly 파일이 Javascript에 문자열로 인라인되어 실행되진 않지만 실제로 별도의 바이너리 파일로 제공될 수 있음을 의미합니다. 이런 방식으로 코드는 여전히 동기식으로 작동되지만 Parcel은 디펜던시 로딩을 먼저 처리합니다.

특정 파일 형식을 비동기로 로드하는 방법을 알고 있는 런타임 모듈인 [번들 로더](https://github.com/parcel-bundler/parcel/pull/565)에 대한 Parcel의 내부적인 지원을 통해 가능합니다. 이전 버전에는 동적 임포트를 지원하는 하드코딩된 Javascript와 CSS 번들 로더가 있었습니다. Parcel 1.5.0 버전에서는 완전하게 **플러그인 기능**으로 분리되어 플러그인에서 고유한 번들 로더를 정의할 수 있습니다! 이렇게 하면 Glimmer의 바이너리 템플릿 등과 같은 사용자가 지정하는 바이너리 형식에 대한 멋진 기능이 많이 제공될 것입니다.
