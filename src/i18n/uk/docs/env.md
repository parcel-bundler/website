# 🌳 Змінні середовища

Parcel використовує [dotenv](https://github.com/motdotla/dotenv) щоб підтримувати змінні середовища завантаження з файлів `.env`.

Файли `.env` повинні зберігатися поряд з пакунком`package.json`, який містить вашу `parcel-bundler` залежність.

Parcel завантажує файли `.env` з цими конкретними іменами для таких значень`NODE_ENV`:

| коректна `.env` назва    | `NODE_ENV=\*` | `NODE_ENV=test` |
| ------------------------ | ------------- | --------------- |
| `.env`                   | ✔️            | ✔️              |
| `.env.local`             | ✔️            | ✖️              |
| `.env.${NODE_ENV}`       | ✔️            | ✔️              |
| `.env.${NODE_ENV}.local` | ✔️            | ✔️              |

Примітки:

- `NODE_ENV` за замовчуванням `development`.
- `.env.local` не завантажується, коли `NODE_ENV=test` з [tests should produce the same results for everyone](https://github.com/parcel-bundler/parcel/blob/28df546a2249b6aac1e529dd629f506ba6b0a4bb/src/utils/env.js#L9)
