# 🔥 핫 모듈 리플레이스먼트

핫 모듈 리플레이스먼트(Hot Module Replacement)(이하 HMR)는 런타임에 페이지 새로고침 없이 모듈을 자동으로 갱신하므로 개발 경험을 향상시킵니다. 작은 변화에 따라 애플리케이션 상태를 계속 유지할 수 있습니다. Parcel HMR은 JavaScript와 CSS 애셋 모두를 지원합니다. 프로덕션 모드에서 HMR은 자동으로 비활성화 됩니다.

파일을 저장하면 Parcel은 변한 부분을 다시 빌드하고 이에 영향을 받는 모든 실행중인 클라이언트에 새 코드를 보냅니다. 그 후 새 코드는 이전 버전과 교체되고 모든 부모가 함께 다시 평가 됩니다. 이 과정 중 `module.hot` API를 사용해 훅(hook)을 걸수 있습니다. 이를 통해 모듈이 버려질 때, 또는 새 버전이 들어올 때 코드에 알려줄 수 있습니다. [react-hot-loader](https://github.com/gaearon/react-hot-loader)같은 프로젝트는 이 과정에 도움이 되며, Parcel에 바로 쓸 수 있습니다.

`module.hot.accept` 와 `module.hot.dispose` 두 메소드를 알아 두세요. `module.hot.accept`를 이 모듈이나 이 모듈의 다른 의존 사항이 갱신될 때 실행되는 콜백과 함께 호출합니다. `module.hot.dispose`는 이 모듈이 교체될 때 호출되는 콜백을 받아들입니다.

```javascript
if (module.hot) {
  module.hot.dispose(function () {
    // 모듈이 곧 폐기 됨
  });

  module.hot.accept(function () {
    // 모듈이나 모듈의 의존 사항이 곧 갱신 됨
  });
}
```
