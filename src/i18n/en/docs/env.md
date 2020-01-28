# 🌳 Environment Variables

Parcel uses [dotenv](https://github.com/motdotla/dotenv) to support loading environment variables from `.env` files.

`.env` files are to be stored alongside the `package.json` that contains your `parcel-bundler` dependency.

Parcel loads `.env` files with these specific names for the following `NODE_ENV` values:

| valid `.env` filenames   | `NODE_ENV=*` | `NODE_ENV=test` |
| ------------------------ | ------------- | --------------- |
| `.env`                   | ✔️            | ✔️              |
| `.env.local`             | ✔️            | ✖️              |
| `.env.${NODE_ENV}`       | ✔️            | ✔️              |
| `.env.${NODE_ENV}.local` | ✔️            | ✔️              |

Notably:

- `NODE_ENV` defaults to `development`.
- `.env.local` is not loaded when `NODE_ENV=test` since [tests should produce the same results for everyone](https://github.com/parcel-bundler/parcel/blob/28df546a2249b6aac1e529dd629f506ba6b0a4bb/src/utils/env.js#L9)
- Sometimes introducing a new .env file will not work immediately. Try deleting the .cache/ directory in this case.
- Accessing the `process.env` object directly is [not supported](https://github.com/parcel-bundler/parcel/issues/2299#issuecomment-439768971), but accessing specific variables on it like `process.env.API_KEY` will provide the expected value.
- Use the built-in `process` Node.js global, i.e. don't do `import process from "process"`, because it will not work. If you use TypeScript, you probably want to install `@types/node` for it to compile.
