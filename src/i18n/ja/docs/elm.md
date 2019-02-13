# Elm

_Supported extensions: `elm`_

[Elm](https://elm-lang.org/) is a functional language with an advanced type
system that ensures correctnes of your code and prevents confusing runtime
errors. With its focus on simplicity and speed, Elm is a great choice when it
comes to building webapps of all kinds. Parcel supports Elm right out of the box
without the need for any additional configuration.

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

import Browser
import Html exposing (h1, text)

main =
  h1 [] [ text "Hello, Elm!" ]
```

To learn more about Elm and its ecosystem of tools, see the official
[guide](https://guide.elm-lang.org/).
