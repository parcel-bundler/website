# ✨ Produkcja

Kiedy przyjdzie czas na zbudowanie paczek aplikacji w wersji produkcyjnej, możesz użyć trybu produkcyjnego w Parcel.

```bash
parcel build entry.js
```

Tryb produkcyjny wyłącza tryb `watch` i hot module replacement, a więc kod zostanie zbudowany tylko raz. Tryb ten włącza również minifier dla wszystkich paczek wyjściowych, aby zredukować rozmiary plików. Minifiery używane przez Parcel to [terser](https://github.com/fabiosantoscode/terser) dla JavaScript, [cssnano](http://cssnano.co) dla CSS, oraz [htmlnano](https://github.com/posthtml/htmlnano) dla HTML.

Włączenie trybu produkcyjnego ustawia także zmienną systemową `NODE_ENV=production`. Duże biblioteki, takie jak React, mają specjalne funkcje przeznaczone wyłącznie do debuggingu i są wyłączane poprzez ustawienie tej zmiennej systemowej, co powoduje redukcję rozmiaru plików wyjściowych i szybszy proces budowania.

### Opcje

#### Ustawienie folderu wyjściowego

Domyślny: "dist"

```bash
parcel build entry.js --out-dir build/output
lub
parcel build entry.js -d build/output
```

```base
root
- build
- - output
- - - entry.js
```

#### Ustawienie publicznego URL, na którym aplikacja będzie serwowana

Domyślny: --out-dir option

```bash
parcel build entry.js --public-url ./
```

spowoduje:

```html
<link rel="stylesheet" type="text/css" href="1a2b3c4d.css">
lub
<script src="e5f6g7h8.js"></script>
```

#### Wyłączanie minifikacji

Domyślnie: minifikacja włączona

```bash
parcel build entry.js --no-minify
```

#### Wyłączanie pamięci podręcznej zapisywanej na dysku

Domyślnie: pamięć podręczna włączona

```bash
parcel build entry.js --no-cache
```
