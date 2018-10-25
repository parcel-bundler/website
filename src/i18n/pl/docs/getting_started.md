# 🚀 Wprowadzenie

Parcel to program tworzący pakiety do stron sieci web, wyróżniający się dzięki doświadczeniu jego deweloperów. Oferuje oszałamiającą szybkość dzięki procesowaniu na wielu rdzeniach procesora i nie wymaga żadnej konfiguracji.

Zainstaluj Parcel za pomocą Yarn lub npm:

Yarn:

```bash
yarn global add parcel-bundler
```

npm:

```bash
npm install -g parcel-bundler
```

Utwórz plik package.json w folderze projeku używając:

```bash
yarn init -y
```

or

```bash
npm init -y
```

Parcel może użyć dowolnego pliku jako plik wejściowy, ale dobrym pomysłem jest zacząć od pliku HTML lub JavaScript. Jeśli zalinkujesz główny plik JavaScript w HTML za pomocą relatywnej ścieżki, Parcel przetworzy ją za Ciebie i zamieni odwołanie na URL do pliku wyjściowego.

Następnie utwórz pliki index.html i index.js.

```html
<html>
<body>
  <script src="./index.js"></script>
</body>
</html>
```

```javascript
console.log('hello world')
```

Parcel ma wbudowany serwer deweloperski, który automatycznie przebudowuje aplikację po dokonaniu zmiany w pliku i wspiera [hot module replacement](hmr.html) aby przyspieszyć tworzenie oprogramowania. Po prostu podaj mu twój plik wejściowy:

```bash
parcel index.html
```

Teraz otwórz http://localhost:1234/ w swojej przeglądarce. Możesz również nadpisać domyślny port za pomocą opcji `-p <numer portu>`.

Używaj serwera deweloperskiego jeśli nie masz własnego serwera, lub jeśli aplikacja renderowana jest w całości po stronie klienta. Jeśli masz swój serwer, możesz zamiast tego uruchomić Parcel w trybie `watch`. W tym trybie Parcel też automatycznie przebudowuje aplikację po dokonaniu zmiany w pliku i wspiera hot module replacement, ale nie uruchamia serwera web.

```bash
parcel watch index.html
```

Kiedy zdecydujesz się zbudować stronę produkcyjnie, tryb `build` jednorazowo buduje aplikację. Przeczytaj sekcję [Produkcja](production.html), aby dowiedzieć się więcej.
