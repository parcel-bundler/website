# Elm

_支持扩展类型:`elm`_

[Elm](https://elm-lang.org/) 是一个具有高级类型系统功能的语言，避免各种错误混淆，确保可以正确地发现运行时错误。它注重快速和易用，构建各种类型的 webapp 是一个很好的选择。Parcel 支持开箱配置 Elm。

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

了解更多关于 Elm 和它的工具生态系统，查看[官方指导](https://guide.elm-lang.org/)。
