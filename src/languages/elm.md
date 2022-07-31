---
layout: layout.njk
title: Elm
eleventyNavigation:
  key: languages-elm
  title: <img src="/assets/lang-icons/elm.svg" alt=""/> Elm
  order: 10
---

You can import [Elm](https://elm-lang.org/) files like any another JavaScript files.

The npm package `elm` needs to be manually installed beforehand. You'll also need a `elm.json` configuration file (run `yarn elm init` to get started and modify it if necessary).

{% sample null, "column" %}
{% samplefile "index.html" %}

```html
<!DOCTYPE html>
<div id="root"></div>
<script type="module" src="index.js"></script>
```

{% endsamplefile %}

{% samplefile "index.js" %}

```js
import { Elm } from "./Main.elm";

Elm.Main.init({ node: document.getElementById("root") });
```

{% endsamplefile %}

{% samplefile "Main.elm" %}

```elm
module Main exposing (..)

import Browser
import Html exposing (Html, button, div, text)
import Html.Events exposing (onClick)

main =
  Browser.sandbox { init = init, update = update, view = view }

type alias Model = Int

init : Model
init =
  0

type Msg = Increment | Decrement

update : Msg -> Model -> Model
update msg model =
  case msg of
    Increment ->
      model + 1

    Decrement ->
      model - 1


view : Model -> Html Msg
view model =
  div []
    [ button [ onClick Decrement ] [ text "-" ]
    , div [] [ text (String.fromInt model) ]
    , button [ onClick Increment ] [ text "+" ]
    ]
```

{% endsamplefile %}

{% endsample %}

## Compiling multiple files into a single JS output

You can use the `with` query param to compile multiple Elm sources into the same bundle. This can help you keep the bundle size smaller, because things like the runtime and common code are shared.

{% sample null, "column" %}
{% samplefile "index.js" %}

```js
import { Elm } from "./Main.elm?with=./MainB.elm&with=./MainC.elm";

Elm.Main.init({ node: document.getElementById("root") });
Elm.MainB.init({ node: document.getElementById("rootB") });
Elm.MainC.init({ node: document.getElementById("rootC") });
```

{% endsamplefile %}
{% endsample %}

This will do the equivalent of this command:

```
elm make Main.elm MainB.elm MainC.elm
```

The `with` param can be used multiple times to include multiple extra Elm programs.

Beware of 2 things:

1. **Path base:** The paths given in the `with` param values are relative to the directory of the first file in the `import` statement (in this case `Main.elm`), NOT relative to the JS file that contains the `import` statement.
2. **Unintentional Duplication:** If you import an import line with `with` params in multiple JS files but the query string is not exactly the same, parcel will treat it as a different asset and duplicate the content.

To avoid those pitfalls when making heavy use of `with` params (i.e. importing some combination in more than one place), it's recommended to use something like [this third-party resolver package](https://www.npmjs.com/package/parcel-resolver-elm-bundle) which allows specifying some shorthands for commonly used Elm file combinations.

## Time-travelling debugger

Elm's debug mode is automatically enabled when not building for production (it is disabled automatically with `parcel build`). You can set the environment variable `PARCEL_ELM_NO_DEBUG=1` to disable it even in development mode.
