---
layout: layout.njk
eleventyNavigation:
  key: languages-elm
  title: <img src="/assets/lang-icons/elm.svg" alt=""/> Elm
  order: 9
---

You can import [Elm](https://elm-lang.org/) files like any another Javascript files.

The npm package `elm` needs to be manually installed beforehand. You'll also need a `elm.json` configuration file (run `yarn elm init -y` to get started and modify it if neccessary).

{% sample null, "column" %}
{% samplefile "index.html" %}

```html
<!DOCTYPE html>
<div id="root"></div>
<script src="index.js"></script>
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

## Time-travelling debuggger

Elm's debug mode is automatically enabled when not building for production (so it's disabled with `parcel build`). You can set the environment variable `PARCEL_ELM_NO_DEBUG=1` to disable it even in development.
