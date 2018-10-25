# 📝 애셋 유형

[애셋 문서](assets.html)에 기술했던 것처럼, Parcel 은 각 입력 파일을 `Asset`이라고 표현합니다. 애셋 유형(type)은 기본 `Asset` 클래스를 상속한 클래스로 표현됩니다. 애셋 유형은 구문 분석(parse), 종속성 분석, 변환과 코드 생성에 필요한 인터페이스를 구현합니다.

Parcel 은 다중 프로세서 코어로 애셋을 병렬 처리 하기 때문에 애셋 유형이 수행할 수 있는 변환은 한번에 하나의 파일 운용만으로 한정 되어 있습니다. 여러 파일 변환을 위해 사용자 정의 [패키저](packagers.html)를 쓸 수 있습니다.

## 애셋 인터페이스

```javascript
const { Asset } = require('parcel-bundler')

class MyAsset extends Asset {
  type = 'foo' // 주 출력 유형 설정

  async parse(code) {
    // AST에 코드 구문 분석
    return ast
  }

  async pretransform() {
    // 옵션. 의존성 수집 이전의 변환.
  }

  collectDependencies() {
    // 의존성 분석.
    this.addDependency('my-dep')
  }

  async transform() {
    // 옵션. 의존성 수집 이전의 변환.
  }

  async generate() {
    // 코드 생성. 필요하다면 다수의 표현(rendition)을 반환할 수 있음.
    // 결과물은 적절한 패키저로 전달되어 최종 번들을 생성.
    return [
      {
        type: 'foo',
        value: 'my stuff here' // 메인 출력
      },
      {
        type: 'js',
        value: 'some javascript', // 필요하다면 JS 번들에 배치할 대체 표현(rendition)
        sourceMap
      }
    ]
  }

  async postProcess(generated) {
    // 모든 코드 생성이 완료된 뒤 실행될 작업
    // 여러 애셋 타입을 합치는 등에 사용 가능
  }
}
```

## 애셋 유형 등록하기

`addAssetType` 메소드를 사용해 애셋 유형을 번들러에 등록할 수 있습니다. 이것은 등록할 파일 확장자와 애셋 유형 모듈의 경로를 받아들입니다. 실제 객체가 아닌 경로이기 때문에 워커 프로세스로 전달될 수 있습니다.

```javascript
const Bundler = require('parcel-bundler')

let bundler = new Bundler('input.js')
bundler.addAssetType('.ext', require.resolve('./MyAsset'))
```
