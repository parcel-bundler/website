# Elm

_支援的副檔名： `elm`_

[Elm](https://elm-lang.org/) 是個函數語言，其先進的類型系統可確保你的程式碼正確無誤及避免執行時的錯誤。Elm 專注於簡化及速度，因此是你打造 web app 時的優質選擇。

Parcel 預設就支援 Elm，完全無需額外設定。

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

更多關於 Elm 與工具生態圈的訊息，請見[官方說明](https://guide.elm-lang.org/)。
