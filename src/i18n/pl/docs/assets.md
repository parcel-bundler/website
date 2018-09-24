# 📦 Zasoby

Parcel zbudowany jest wokół zasobów. Zasób może reprezentować dowolny plik, ale Parcel posiada specjalne wsparcie dla pewnych typów zasobów, takich jak JavaScript, CSS i plików HTML. Parcel automatycznie analizuje typy zależności wymienionych w tych plikach i dodaje je do wyjściowej paczki. Zasoby o podobnych typach są grupowane do wspólnych wyjściowych paczek. Jeśli zaimportujesz zasób innego typu (np. plik CSS z pliku JS), rozpocznie on tworzenie paczki potomnej i zostawi odwołanie do niej w paczce macierzystej. Zostanie to zilustrowane w sekcjach poniżej.

## JavaScript

Najbardziej tradycyjnym typem pliku dla programów tworzących pakiety jest JavaScript. Parcel wspiera zarówno składnię CommonJS, jak i modułów ES6 do celu importowania plików. Wspiera również dynamiczną składnię `import()` do asychronicznego wczytywania modułów, co szerzej opisane jest w sekcji [Dzielenie Kodu](code_splitting.html).

```javascript
// Importuj moduł z użyciem składni CommonJS
const dep = require('./path/to/dep');

// Importuj moduł z użyciem składni modułów ES6
import dep from './path/to/dep';
```

Możesz również importować zasoby nie-JavaScriptowe z pliku JavaScript, np. pliki CSS lub obrazy. Kiedy importujesz taki plik, nie jest on wstawiany w kod, jak ma to miejsce w innych programach tworzących pakiety. Zamiast tego, taki zasób umieszczany jest w osobnej paczce (np. w pliku CSS) razem z wszystkimi jego zależnościami. W [modułach CSS](https://github.com/css-modules/css-modules), eksportowane klasy są umieszczane w paczce JavaScript. Inne typy zasobów eksportują URL do pliku wyjściowego w paczce JavaScript, by odwołanie do niego mogło zostać wstawione w kod.

```javascript
// Importuj plik CSS
import './test.css';

// Importuj plik CSS z modułami CSS
import classNames from './test.css';

// Importuj URL pliku obrazu
import imageURL from './test.png';
```

Jeśli chcesz wstawić plik w kod w paczce wyjściowej JavaScript zamiast odwołania do niego poprzez URL, możesz użyć API `fs.readFileSync` z Node.js. URL-e muszą być możliwe do statycznej analizy, dlatego nie mogą posiadać żadnych zmiennych (oprócz `__dirname` i `__filename`).

```javascript
import fs from 'fs';

// Przeczytaj zawartość pliku jako string
const string = fs.readFileSync(__dirname + '/test.txt', 'utf8');

// Przeczytaj zawartość pliku jako Buffer
const buffer = fs.readFileSync(__dirname + '/test.png');
```

## CSS

Zasoby CSS mogą być importowane z pliku JavaScript lub pliku HTML. Mogą zawierać zależności zdefiniowane za pomocą składni `@import`, jak również odwołania do obrazów, fontów itd. za pomocą funkcji `url()`. Inne pliki CSS `@import`owane do zasobu są wstawiane w kod tej samej paczki wyjściowej CSS, a odwołania `url()` są przepisywane tak, aby zawierały ścieżki do plików wyjściowych. Wszystkie ścieżki powinny być relatywne do pliku CSS.

```css
/* Importuj inny plik CSS */
@import './other.css';

.test {
  /* Odwołanie do pliku obrazu */
  background: url('./images/background.png');
}
```

Oprócz czystego CSS, inne języki kompilowalne do CSS jak LESS, SASS i Stylus są także wspierane i działają w identyczny sposób.

## SCSS

Kompilacja SCSS wymaga modułu `sass`. By zainstalować go za pomocą npm, wykonaj:

```bash
npm install sass
```

Kiedy `sass` będzie zainstalowany, możesz importować pliki SCSS z plików JavaScript.

```javascript
import './custom.scss'
```

Zależności w plikach SCSS mogą być definiowane za pomocą składni `@import`.

## HTML

Zasoby HTML są często plikami wejściowymi które są podawane do Parcel, ale mogą być także odwołaniami w plikach JavaScript, np. do tworzenia linków do innych stron. URL-e do skryptów, styli, mediów i innych plików HTML są ekstraktowane i komplilowane tak jak opisano powyżej. Odwołania są przepisywane w HTML tak, aby zawierały ścieżki do plików wyjściowych. Wszystkie ścieżki powinny być relatywne do pliku HTML.

```html
<html>
<body>
  <!-- odwołanie do pliku obrazu -->
  <img src="./images/header.png">

  <a href="./other.html">Link do innej strony</a>

  <!-- importuj paczkę JavaScript -->
  <script src="./index.js"></script>
</body>
</html>
```
