# 🌳 Переменные окружения

Parcel использует [dotenv](https://github.com/motdotla/dotenv) для поддержки загрузки переменных окружения из `.env` файлов.

`.env` файлы должны располагаться рядом с `package.json` содержащим `parcel-bundler` зависимость.

Parcel загружает `.env` файлы с конкретными именами для следующих значений `NODE_ENV`:

| допустимые `.env` имена  | `NODE_ENV=*` | `NODE_ENV=test` |
| ------------------------ | ------------ | --------------- |
| `.env`                   | ✔️           | ✔️              |
| `.env.local`             | ✔️           | ✖️              |
| `.env.${NODE_ENV}`       | ✔️           | ✔️              |
| `.env.${NODE_ENV}.local` | ✔️           | ✔️              |

Примечание:

- `NODE_ENV` по умолчанию `development`.
- `.env.local` не загружается, когда `NODE_ENV=test` так как [тесты должны давать одинаковые результаты для всех](https://github.com/parcel-bundler/parcel/blob/28df546a2249b6aac1e529dd629f506ba6b0a4bb/src/utils/env.js#L9).
- Иногда добавление нового .env файла может не работать сразу. В таком случае попробуйте удалить .cache/ директорию.
- Доступ к `process.env` объекту напрямую [не поддерживается](https://github.com/parcel-bundler/parcel/issues/2299#issuecomment-439768971), но доступ к конкретным переменным, например `process.env.API_KEY`, вернет ожидаемое значение.
