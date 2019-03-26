# Elm

_Extensões suportadas: `elm`_

[Elm](https://elm-lang.org/) é uma linguagem funcional com um sistema de tipos avançados que garantem a correção do seu código e evita erros confusos em tempo de execução. Com o seu foco na simplicidade e velocidade, Elm é uma ótima opção quando se trata de construção de webapps de todos os tipos. O Parcel tem suporte nativo ao Elm sem a necessidade de nenhuma configuração adicional.

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

Para saber mais sobre o Elm e seu ecossistema de ferramentas, consulte o [guia oficial](https://guide.elm-lang.org/).
