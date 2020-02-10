# 🌳 環境變數

Parcel 使用 [dotenv](https://github.com/motdotla/dotenv) 來支援 `.env` 檔案中的環境變數。

`.env` 檔案應被儲存於與 `package.json`（含有 `parcel-bundler` 的那個檔案）相同的目錄中。

Parcel 根據下表的 `NODE_ENV` 值來載入對應的 `.env` 檔案：

| 合法的 `.env` 檔名       | `NODE_ENV=*`  | `NODE_ENV=test`  |
| ------------------------ | ------------- | ---------------  |
| `.env`                   | ✔️            | ✔️              |
| `.env.local`             | ✔️            | ✖️              |
| `.env.${NODE_ENV}`       | ✔️            | ✔️              |
| `.env.${NODE_ENV}.local` | ✔️            | ✔️              |

注意事項：

- `NODE_ENV` 預設為 `development`。
- 當 `NODE_ENV=test` 並不會載入 `.env.local`，因[測試應產生相同的結果](https://github.com/parcel-bundler/parcel/blob/28df546a2249b6aac1e529dd629f506ba6b0a4bb/src/utils/env.js#L9)。
- 有時新的 .env 檔案並不會立即生效，這時可嘗試刪除 .cache/ 目錄。
- 你可使用如 `process.env.API_KEY` 的方式來存取環境變數，但[不支援直接存取 `process.env`](https://github.com/parcel-bundler/parcel/issues/2299#issuecomment-439768971) 物件。
- 僅使用 Node.js 內建的全域變數 `process`，舉例來說，不要使用 `import process from process`，它不會有作用。如果你使用 Typescript，你可能需要安裝 `@types/node` 才能編譯。
