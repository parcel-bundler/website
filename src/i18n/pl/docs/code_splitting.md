# ✂️ Dzielenie Kodu

Parcel od razu wspiera dzielenie kodu bez żadnej konfiguracji. To pozwala na dzielenie kodu aplikacji na osobne paczki, które mogą być wczytywane na żądanie. To oznacza mniejszy rozmiar paczki początkowej i szybsze wczytywanie się aplikacji. W miarę jak użytkownik porusza się po aplikacji i kolejne moduły stają się potrzebne, Parcel automatycznie zajmie się wczytaniem paczek potomnych.

Dzielenie kodu może być kontrolowane poprzez użycie [proponowanej składni](https://github.com/tc39/proposal-dynamic-import) `import()`, która działa tak jak zwykły `import` czy funkcja `require`, ale zwraca Promise. To oznacza, że moduły są ładowane asynchronicznie.

Poniższy przykład pokazuje jak można używać dynamicznego importowania, aby wczytać podstronę aplikacji na żądanie.

```javascript
// pages/about.js
export function render() {
  // Renderuj stronę
}
```

```javascript
import('./pages/about').then(function(page) {
  // Renderuj stronę
  page.render()
})
```

Ponieważ `import()` zwraca Promise, możesz również użyć składni async/await. Prawdopodobnie wymagana będzie konfiguracja Babel, by transpilować składnię, dopóki szersze wsparcie przez przeglądarki nie zostanie zapewnione.

```javascript
const page = await import('./pages/about')
// Renderuj stronę
page.render()
```

Dynamiczne importy są w Parcel również wczytywane z opóźnieniem, dlatego możesz dalej umieszczać wszystkie swoje `import()`y na górze pliku, a paczki potomne i tak nie będą wczytane do czasu ich użycia. Poniższy przykład ilustruje, jak można wczytywać podstrony aplikacji z opóźnieniem.

```javascript
// Zdefiniuj mapę nazw stron do dynamicznych importów.
// Nie zostaną one załadowane do czasu ich użycia.
const pages = {
  about: import('./pages/about'),
  blog: import('./pages/blog')
}

async function renderPage(name) {
  // Wczytaj żądaną stronę z opóźnieniem.
  const page = await pages[name]
  return page.render()
}
```

**Uwaga:**: Jeśli chcesz użyć składni async/await w przeglądarkach, które nie wspierają jej natywnie, pamiętaj o załączeniu `babel-polyfill` w swojej aplikacji lub `babel-runtime` + `babel-plugin-transform-runtime` in bibliotekach.

```bash
yarn add babel-polyfill
```

```javascript
import 'babel-polyfill'
import './app'
```

Przeczytaj dokumentację na temat [babel-polyfill](http://babeljs.io/docs/usage/polyfill) i [babel-runtime](http://babeljs.io/docs/plugins/transform-runtime).
