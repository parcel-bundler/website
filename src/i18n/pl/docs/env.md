# 🌳 Zmienne środowiskowe

Parcel wykorzystuje [dotenv](https://github.com/motdotla/dotenv) by ładować zmienne środowiskowe z plików `.env`.

Pliki `.env` powinny znajdować się w tym samym miejscu co `package.json`, który zawiera zależność `parcel-bundler`.

Parcel ładuje pliki `.env` o tych konkretnych nazwach dla następujących wartości `NODE_ENV`:

| Prawidłowa nazwa pliku `.env` | `NODE_ENV=*` | `NODE_ENV=test` |
| ----------------------------- | ------------ | --------------- |
| `.env`                        | ✔️           | ✔️              |
| `.env.local`                  | ✔️           | ✖️              |
| `.env.${NODE_ENV}`            | ✔️           | ✔️              |
| `.env.${NODE_ENV}.local`      | ✔️           | ✔️              |

Warto zwrócić uwagę, że:

- Domyślna wartość `NODE_ENV` to `development`.
- `.env.local` nie jest ładowany, gdy `NODE_ENV=test` ponieważ [testy powinny zwrócić wszystkim takie same wyniki](https://github.com/parcel-bundler/parcel/blob/28df546a2249b6aac1e529dd629f506ba6b0a4bb/src/utils/env.js#L9)
- Czasem użycie nowego pliku `.env` może nie działać od razu. W tym wypadku spróbuj usunąć katalog `.cache/` .
- Bezpośredni dostęp do obiektu `process.env` [nie jest wspierany](https://github.com/parcel-bundler/parcel/issues/2299#issuecomment-439768971), ale odwołanie się do konkretnych zmiennych w tym obiekcie, np. `process.env.API_KEY`, zwróci oczekiwaną wartość.
