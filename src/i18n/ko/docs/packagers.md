# 📦 패키저

Parcel 에선 `패키저`가 다수의 `애셋`을 하나의 최종 출력 번들로 결합시킵니다. 이것은 모든 애셋이 처리되고, 하나의 번들 트리가 만들어 진 후 주 과정 중에 발생합니다. 패키저는 출력 파일 유형을 기반으로 등록되고, 해당 출력 타입을 생성한 애셋은 최종 출력 파일의 제품화를 위해 패키저로 보내집니다.

## 패키저 인터페이스

```javascript
const { Packager } = require('parcel-bundler')

class MyPackager extends Packager {
  async start() {
    // 옵션. 필요하다면 파일 헤더 작성.
    await this.dest.write(header)
  }

  async addAsset(asset) {
    // 필수. 출력 파일에 애셋 작성.
    await this.dest.write(asset.generated.foo)
  }

  async end() {
    // 옵션. 필요하다면 파일 트레일러 작성.
    await this.dest.end(trailer)
  }
}
```

## 패키저 등록하기

`addPackager` 메소드를 사용하여 번들러에 패키저를 등록할 수 있습니다. 이 메소드는 등록하려는 파일 유형과 패키저 모듈의 경로를 받아들입니다.

```javascript
const Bundler = require('parcel-bundler')

let bundler = new Bundler('input.js')
bundler.addPackager('foo', require.resolve('./MyPackager'))
```
