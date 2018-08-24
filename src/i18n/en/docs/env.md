# 🌳 Environment Variables

Parcel uses [dotenv](https://github.com/motdotla/dotenv) to support loading environment variables from `.env` files.

`.env` files are to be stored alongside the `package.json` that contains your `parcel-bundler` dependency.

Parcel loads `.env` files with following names:

| valid `.env` filenames   | `NODE_ENV=\*` | `NODE_ENV=test` |
| ------------------------ | ------------- | --------------- |
| `.env`                   | ✔️            | ✔️              |
| `.env.local`             | ✔️            | ✖️              |
| `.env.${NODE_ENV}`       | ✔️            | ✔️              |
| `.env.${NODE_ENV}.local` | ✔️            | ✔️              |

Notably:

- `NODE_ENV` defaults to `development`.
- `.env.local` is not loaded when `NODE_ENV=test` since [tests should produce the same results for everyone](https://github.com/parcel-bundler/parcel/blob/28df546a2249b6aac1e529dd629f506ba6b0a4bb/src/utils/env.js#L9)
