# 🔌 플러그인

Parcel 은 대부분의 도구들과는 조금 다른 접근 방식을 취하고 있습니다. 추가적인 플러그인 설치나 설정 없이 다양한 일반적인 포맷을 즉시 지원할 수 있도록 포함하고 있습니다. 그러나 표준적이지 않은 방법으로 Parcel 을 확장하고 싶은 경우가 있을것이며, 그런 경우를 위해 플러그인이 지원됩니다. 설치된 플러그인은 `package.json` 의존성(dependencies)을 기반으로 자동 감지되고 로드됩니다.

새로운 파일 포맷에 대한 지원을 추가하는 경우 먼저 그것이 얼마나 널리 퍼져 있는지, 얼마나 표준적으로 구현되어 있는지를 고려해야 합니다. 만약 해당 포맷이 충분히 널리 퍼져있고 표준적이라면, 사용자가 설치해야 되는 플러그인 보다는 Parcel 코어에 추가되어야 합니다. 의문점이 있다면 [GitHub](https://github.com/parcel-bundler/parcel/issues)에서 논의해 주세요.

## 플러그인 API

Parcel 플러그인은 매우 단순합니다. Parcel 플러그인은 쉽게 말해 초기화 중 Parcel 에 의해 자동으로 호출되는 단일 함수를 내보내는(export) 모듈입니다. 이 함수는 `Bundler` 객체를 입력으로 받고 애셋 유형과 패키저 등록과 같은 설정(configuration)을 수행할 수 있습니다.

```javascript
module.exports = function(bundler) {
  bundler.addAssetType('ext', require.resolve('./MyAsset'))
  bundler.addPackager('foo', require.resolve('./MyPackager'))
}
```

이 패키지를 `parcel-plugin-`접두어를 붙여 npm 에 발행하면, 이 아래에서 설명하는바 대로 자동으로 감지되고 로드 됩니다.

## 플러그인 사용

Parcel 플러그인 사용은 더 이상 쉬울 수가 없을만큼 쉽습니다. 그저 패키지를 설치하여 `package.json`에 저장만 하면 됩니다. 플러그인은 `parcel-plugin-` 접두어를 써서 이름지어야 합니다. 예를 들면, `parcel-plugin-foo` 같이요. 어떤 의존 요소라도 이 접두어로 `package.json`에 리스트되어 있으면 초기화중에 자동으로 로드 됩니다.
