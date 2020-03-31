# 🌳 環境変数

Parcel は [dotenv](https://github.com/motdotla/dotenv) を使って、 `.env` ファイルからの環境変数読み込みをサポートしています。

`.env`ファイルは、 `parcel-bundler` の依存関係を含む `package.json` のそばに保存します。

Parcel は、以下の `NODE_ENV` 値に対して特定の名前の `.env` ファイルをロードします。

| 有効な `.env` ファイル名 | `NODE_ENV=*` | `NODE_ENV=test` |
| ------------------------ | ------------ | --------------- |
| `.env`                   | ✔️           | ✔️              |
| `.env.local`             | ✔️           | ✖️              |
| `.env.${NODE_ENV}`       | ✔️           | ✔️              |
| `.env.${NODE_ENV}.local` | ✔️           | ✔️              |

注意すべきこと:

- `NODE_ENV` のデフォルトは `development` です。
- [テストは全員に対して同じ結果を生成する必要があるため](https://github.com/parcel-bundler/parcel/blob/28df546a2249b6aac1e529dd629f506ba6b0a4bb/src/utils/env.js#L9)、 `NODE_ENV=test` のとき、 `.env.local` は読み込まれません。
- 新しい .env ファイルがすぐに動作しないことがあります。 その場合 .cache/ ディレクトリを削除してみてください。
- `process.env`オブジェクトへの直接アクセスは[サポートされていません](https://github.com/parcel-bundler/parcel/issues/2299#issuecomment-439768971)。ですが、`process.env.API_KEY` のような特定の変数にアクセスし、期待する値を提供します。
- Node.js global に組み込まれている `process` を使用します。つまり、 `import process from "process"` を実行しないでください。動作しません。 TypeScript を使用する場合、コンパイルするために `@types/node` をインストールする必要があるでしょう。
