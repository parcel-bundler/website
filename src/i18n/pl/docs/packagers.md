# 📦 Programy Pakujące

W Parcel, `Program pakujący` łączy wiele `Zasobów` do finalnej paczki wyjściowej. To staje się w głównym procesie w momencie, kiedy wszystkie zasoby zostaną przetworzone, a drzewo paczek zostanie skonstruowane. Programy pakujące są rejestrowane na podstawie typu pliku wyjściowego, a zasoby które wygenerowały tego rodzaju kod wyjściowy są wysyłane do programu pakującego celem utworzenia finalnego pliku wyjściowego.

## Interfejs Programu Pakującego

```javascript
const { Packager } = require('parcel-bundler')

class MyPackager extends Packager {
  async start() {
    // opcjonalne. zapisz nagłówek pliku jeśli to konieczne.
    await this.dest.write(header)
  }

  async addAsset(asset) {
    // wymagane. zapisz zasób do pliku wyjściowego.
    await this.dest.write(asset.generated.foo)
  }

  async end() {
    // opcjonalne. zapisz końcówkę pliku jeśli to konieczne.
    await this.dest.end(trailer)
  }
}
```

## Rejestrowanie Programu Pakującego

Możesz zarejestrować swój program pakujący w Parcel za pomocą metody `addPackager`. Przyjmuje ona typ pliku do rejestracji i ścieżkę do modułu programu pakującego.

```javascript
const Bundler = require('parcel-bundler')

let bundler = new Bundler('input.js')
bundler.addPackager('foo', require.resolve('./MyPackager'))
```
