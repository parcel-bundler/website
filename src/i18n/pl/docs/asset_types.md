# 📝 Typy Zasobów

Tak jak opisano w [dokumentacji dot. Zasobów](assets.html), Parcel reprezentuje każdy plik wejściowy jako `Asset`. Typy zasobów są reprezentowane jako klasy dziedziczące z bazowej klasy `Asset` i implementujące wymagane interfejsy do parsowania, analizy zależności, transformowania i generowania kodu.

Ponieważ Parcel przetwarza zasoby równolegle na wielu rdzeniach procesora, typy zasobów mogą dokonywać jedynie takich transformacji, które dokonywane są na jednym pliku jednocześnie. Dla transformacji na wielu plikach może zostać użyty niestandardowy [Program pakujący](packagers.html).

## Interfejs Zasobu

```javascript
const { Asset } = require('parcel-bundler')

class MyAsset extends Asset {
  type = 'foo' // zdefiniuj typ wyniku

  parse(code) {
    // parsuj kod do AST
    return ast
  }

  pretransform() {
    // opcjonalne. transformacje dokonywane przed zebraniem informacji o zależnościach.
  }

  collectDependencies() {
    // zbierz informacje o zależnościach
    this.addDependency('my-dep')
  }

  transform() {
    // opcjonalne. transformacje dokonywane po zebraniu informacji o zależnościach.
  }

  generate() {
    // generuj kod. możesz zwrócić wiele wyników jeśli jest to konieczne.
    // wyniki są przekazywane do stosownych programów pakujących w celu wygenerowania finalnej paczki.
    return {
      foo: 'my stuff here', // główny wynik
      js: 'some javascript' // dodatkowy wynik do umieszczenia w paczce JS, jeśli to konieczne
    }
  }
}
```

## Rejestrowanie Typu Zasobu

Możesz zarejestrować swój typ zasobu w programie pakującym używając metody `addAssetType`. Akceptuje on rozszerzenie pliku do zarejestrowania i ścieżkę do modułu typu zasobu. Używana jest ścieżka zamiast faktycznego obiektu modułu dlatego, aby mogła być ona przekazana do procesów wątków usługowch.

```javascript
const Bundler = require('parcel-bundler')

let bundler = new Bundler('input.js')
bundler.addAssetType('.ext', require.resolve('./MyAsset'))
```
