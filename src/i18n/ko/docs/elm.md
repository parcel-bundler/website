# Elm

_지원하는 확장자: `elm`_

[Elm](https://elm-lang.org/)은 코드의 정확성을 보장하고, 혼란스러운 런타임 오류를 방지하는 고급 타입 시스템을 갖춘 함수형 언어입니다. 단순성과 속도에 중점을 둔 Elm은 모든 종류의 웹앱을 구축할 때 훌륭한 선택입니다. Parcel은 추가 구성없이 Elm을 즉시 지원합니다.

```html
<!-- index.html -->

<html>
  <body>
    <main></main>
    <script src="./index.js"></script>
  </body>
</html>
```

```javascript
// index.js

import { Elm } from './Main.elm'

Elm.Main.init({
  node: document.querySelector('main')
})
```

```elm
-- Main.elm
module Main exposing (main)

import Browser
import Html exposing (h1, text)

main =
  h1 [] [ text "Hello, Elm!" ]
```

Elm과 Elm의 에코시스템 툴들을 확인하시려면, [공식 가이드](https://guide.elm-lang.org/)를 참조하십시오.