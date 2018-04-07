# ✨ 프로덕션

제품화를 위해 애플리케이션을 번들할 때가 왔다면, Parcel의 프로덕션(production) 모드를 사용하세요.

```bash
parcel build entry.js
```

번들이 작성될 출력 디렉토리를 바꾸기 위해 `--out-dir [directory]`를 넘겨 줄 수 있습니다. (기본값은 `dist`입니다.)

```bash
parcel build entry.js --out-dir build/output
# 또는 -d 단축 표현
parcel build entry.js -d build/output
```

감시(watch) 모드와 핫 모듈 리플레이스먼트가 비활성화 되기 때문에 한 번 만 빌드 됩니다. 또한 출력 번들의 용량을 줄이기 위한 미니파이어(minifier)가 활성화 됩니다. Parcel은 JavaScript를 위해 [uglify-es](https://github.com/mishoo/UglifyJS2/tree/harmony), CSS를 위해 [cssnano](http://cssnano.co), HTML을 위해 [htmlnano](https://github.com/posthtml/htmlnano)를 미니파이어로 사용합니다.

프로덕션 모드 활성화는 또한 환경 변수를 `NODE_ENV=production`로 설정합니다. React와 같은 큰 라이브러리는 이 환경 변수를 설정함으로써 비활성화 되는 개발 전용 디버깅 요소가 있어 보다 작게 보다 빠르게 제품 빌드를 할 수 있습니다.
