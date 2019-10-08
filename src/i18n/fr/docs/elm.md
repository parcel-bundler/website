# Elm

_Extensions supportées : `elm`_

[Elm](https://elm-lang.org/) est un langage fonctionnel doté d'un système de
type avancé qui garantit la correction de votre code et évite les erreurs
d'exécution. Avec son souci de la simplicité et de la rapidité, Elm est un
excellent choix pour créer des applications Web de toutes sortes. Parcel inclus la
prise en charge Elm sans aucune configuration supplémentaire.

Pour commencer créez les trois fichiers suivants dans un répertoire :

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

Lancez `parcel index.html` et c'est joué !

Pour en savoir plus sur Elm et son écosystème d’outils, consultez le
[guide](https://guide.elm-lang.org/) du site officiel.
