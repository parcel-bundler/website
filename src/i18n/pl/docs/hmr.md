# 🔥 Hot Module Replacement

Hot Module Replacement (HMR) usprawnia proces tworzenia oprogramowania dzięki automatycznej aktualizacji modułów w przeglądarce "na gorąco", bez konieczności odświeżania strony. Oznacza to, że stan aplikacji może zostać zachowany podczas dokonywania drobnych zmian. Implementacja HMR w Parcel od razu wspiera zasoby zarówno JavaScript jak i CSS. HMR jest automatycznie wyłączany w czasie pakowania w trybie produkcyjnym.

Po zapisaniu pliku, Parcel przebudowuje zmmiany i wysyła aktualizację do wszystkich włączonych klientów zawierającą nowy kod. Nowy kod zastępuje starą jego wersję i jest ponownie ewaluowany wraz z jego modułami macierzystymi. Możliwe jest wpięcie się do tego procesu używając API `module.hot`, które powiadamia kod za każdym razem kiedy zostanie on usunięty, lub kiedy nadejdzie nowa jego wersja. Projekty takie jak [react-hot-loader](https://github.com/gaearon/react-hot-loader) mogą pomóc w tym procesie i działają od razu z Parcel.

Są dwie metody o których powinno się wiedzieć: `module.hot.accept` i `module.hot.dispose`. `module.hot.accept` wywołuje się z funkcją zwrotną która wywoływana jest w momencie, kiedy moduł lub którakolwiek z jego zależności zostanie aktualizowana. `module.hot.dispose` akceptuje funkcję zwrotną, która wywoływana jest tuż przed tym, jak moduł zostanie zastąpiony.

```javascript
if (module.hot) {
  module.hot.dispose(function() {
    // moduł zaraz zostanie zastąpiony
  })

  module.hot.accept(function() {
    // moduł lub którakolwiek z jego zależności został właśnie zaktualizowany
  })
}
```
