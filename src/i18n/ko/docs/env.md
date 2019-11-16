# 🌳 환경 변수

Parcel은 `.env` 파일에서 환경 변수 로드를 지원하기 위해 [dotenv](https://github.com/motdotla/dotenv)를 사용합니다.

`.env` 파일은 `parcel-bundler`의 의존성을 포함하는 `package.json`과 함께 저장됩니다.

Parcel은 다음 `NODE_ENV`값에 대해 다음과 같은 특정한 이름으로 `.env` 파일을 로드합니다.

| 유효한 `.env` 파일이름   | `NODE_ENV=*` | `NODE_ENV=test` |
| ------------------------ | ------------- | --------------- |
| `.env`                   | ✔️            | ✔️              |
| `.env.local`             | ✔️            | ✖️              |
| `.env.${NODE_ENV}`       | ✔️            | ✔️              |
| `.env.${NODE_ENV}.local` | ✔️            | ✔️              |

참고:

- `NODE_ENV`의 기본값은 `development` 입니다.
- [테스트는 모든 경우에 대해 동일해야 하므로](https://github.com/parcel-bundler/parcel/blob/28df546a2249b6aac1e529dd629f506ba6b0a4bb/src/utils/env.js#L9), `NODE_ENV=test`인 경우 `env.local`이 로드되지 않습니다.
- 때로는 새로운 .env 파일을 작성해도 즉시 작동되지 않을때가 있습니다. 이러한 경우 .cache/ 디렉토리를 삭제합니다.
- `process.env` 객체에 직접 접근하는 것은 [허용되지 않지만,](https://github.com/parcel-bundler/parcel/issues/2299#issuecomment-439768971) `process.env.API_KEY`와 같은 특정 변수에는 예상되는 값을 제공하여 접근이 가능합니다. 
