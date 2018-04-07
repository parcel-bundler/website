# 🖥 커맨드 라인 인터페이스(CLI)

## 명령어

### Serve

Serve는 개발용 서버를 시작합니다. 앱이 수정되면 자동으로 다시 빌드하고, 빠른 개발을 위해 [핫 모듈 리플레이스먼트](hmr.html)를 지원합니다.

```bash
parcel index.html
```

### Build

Build는 애셋을 한 번 빌드합니다. 이 과정에서 코드 최소화(미니파이케이션)가 활성화되고 NODE_ENV 환경변수가 production으로 설정됩니다. [프로덕션](production.html)을 참조하세요.

```bash
parcel build index.html
```

### Watch

Watch는 Serve와 비슷하지만 서버를 시작하지 않는다는 점이 다릅니다.

```bash
parcel watch index.html
```

### Help

가능한 모든 CLI 옵션을 출력합니다.

```bash
parcel help
```

## 옵션

### 결과물 디렉토리

기본값: "dist"

같이 사용 가능한 명령어: `serve`, `watch`, `build`

```bash
parcel build entry.js --out-dir build/output
혹은
parcel build entry.js -d build/output
```

```base
root
- build
- - output
- - - entry.js
```

### 서빙될 public URL 설정

기본값: "/"

같이 사용 가능한 명령어: `serve`, `watch`, `build`

```bash
parcel build entry.js --public-url ./dist/
```

결과물은 다음과 같이 나옵니다.

```html
<link rel="stylesheet" type="text/css" href="/dist/entry.1a2b3c.css">
or
<script src="/dist/entry.e5f6g7.js"></script>
```

### 타겟

기본값: browser

같이 사용 가능한 명령어: `serve`, `watch`, `build`

```bash
parcel build entry.js --target node
```

가능한 타겟: node, browser and electron

### 로그 레벨 변경

기본값: 3

같이 사용 가능한 명령어: `serve`, `watch`, `build`

```bash
parcel build entry.js --log-level 1
```

| 로그 레벨 | 효과                       |
|---       |---                        |
| 0        | 로깅 비활성화               |
| 1        | 에러만 로그                 |
| 2        | 에러와 경고를 로그           |
| 3        | 모두 로깅                  |

### 핫 모듈 리플레이스먼트 호스트네임

기본값: 현재 창의 `location.hostname`

같이 사용 가능한 명령어: `serve`, `watch`

```bash
parcel build entry.js --hmr-hostname parceljs.org
```

### 핫 모듈 리플레이스먼트 포트

기본값: 사용 가능한 랜덤 포트

같이 사용 가능한 명령어: `serve`, `watch`

```bash
parcel build entry.js --hmr-port 8080
```

### 결과물 파일명

기본값: 원래 파일명

같이 사용 가능한 명령어: `serve`, `watch`, `build`

```bash
parcel build entry.js --out-file output.html
```

이 옵션은 진입점 번들의 결과 파일명을 바꿉니다.

### 상세 보고서를 출력

기본값: 간단한 보고서

같이 사용 가능한 명령어: `build`

```bash
parcel build entry.js --detailed-report
```

### 임의의 인증서 설정

기본값: 인증서 생성

같이 사용 가능한 명령어: `serve`

```bash
parcel build entry.js --cert certificate.cert --key private.key
```

### 브라우저에서 열기

기본값: 비활성

같이 사용 가능한 명령어: `serve`

```bash
parcel build entry.js --open
```

### 소스맵 비활성화

기본값: 소스맵 활성

같이 사용 가능한 명령어: `serve`, `watch`, `build`

```bash
parcel build entry.js --no-source-maps
```

### 자동설치 비활성화

기본값: 자동설치 활성

같이 사용 가능한 명령어: `serve`, `watch`

```bash
parcel build entry.js --no-autoinstall
```

### 핫 모듈 리플레이스먼트 비활성화

기본값: HMR 활성

같이 사용 가능한 명령어: `serve`, `watch`

```bash
parcel build entry.js --no-hmr
```

### 소스 최소화(미니파이케이션) 비활성화

기본값: 소스 최소화 활성

같이 사용 가능한 명령어: `build`

```bash
parcel build entry.js --no-minify
```

### 파일시스템 캐시 비활성화

기본값: 캐시 활성

같이 사용 가능한 명령어: `serve`, `watch`, `build`

```bash
parcel build entry.js --no-cache
```