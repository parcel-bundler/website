# 🖥 CLI

## Commands

### Serve

開発サーバーを起動します。ファイルを変更するとアプリが自動的に再構築され、迅速な開発のために [hot module replacement](hmr.html) がサポートされます。

```bash
parcel index.html
```

また、複数のエントリポイントに対して [glob](https://github.com/isaacs/node-glob) または glob のリストを渡すこともできます。

```bash
parcel one.html two.html
# OR
parcel *.html
# OR
parcel ./**/*.html
```

### Build

アセットを一度ビルドします。また、ミニファイを有効にし、 `NODE_ENV = production`環境変数を設定します。 詳細については [Production](production.html) を参照してください。

```bash
parcel build index.html
```

_NOTE:_ 特別なユースケースでは、次のように `development` 環境から単一のビルドを実行することもできます。

```
NODE_ENV=development parcel build <entrypoint> --no-minify
```

`serve` と同じバンドルを作成しますが、アセットの監視や配信は行いません。

### Watch

`watch`コマンドは `serve` に似ていますが、主な違いはサーバーを起動しないことです。

```bash
parcel watch index.html
```

### Help

利用可能なすべての cli オプションを表示します

```bash
parcel help
```

### Version

Parcel のバージョン番号を表示します

```bash
parcel --version
```

## Options

### 出力ディレクトリ

デフォルト: "dist"

利用可能: `serve`, `watch`, `build`

```bash
parcel build entry.js --out-dir build/output
# or
parcel build entry.js -d build/output
```

```base
root
- build
- - output
- - - entry.js
```

### 公開する URL を設定する

デフォルト: "/"

利用可能: `serve`, `watch`, `build`

```bash
parcel entry.js --public-url ./dist/
```

出力:

```html
<link rel="stylesheet" type="text/css" href="dist/entry.1a2b3c.css" />
<!-- or -->
<script src="dist/entry.e5f6g7.js"></script>
```

### Target

デフォルト: browser

利用可能: `serve`, `watch`, `build`

```bash
parcel build entry.js --target node
```

⚠️ 対象が `node` と `electron` の場合、 package.json の `dependencies` はバンドルしません。 この動作は [--bundle-node-modules](#node-modules-の強制バンドル) フラグを使って上書きできます（以下を参照）。

可能なターゲット: `node`, `browser`, `electron`

### node modules の強制バンドル

デフォルト: false

可能なターゲット: `serve`, `watch`, `build`

```bash
parcel build entry.js --target node --bundle-node-modules
```

デフォルトでは、 `--target node` または `--target electron` を使用する場合、package.json の `dependencies` は含まれません。 このフラグはそれらをバンドルに追加します。

### キャッシュディレクトリ

デフォルト: ".cache"

利用可能: `serve`, `watch`, `build`

```bash
parcel build entry.js --cache-dir build/cache
```

### ホスト

デフォルト: localhost

利用可能: `serve`

```bash
parcel serve entry.js --host local.myhost.co.uk
```

### ポート

デフォルト: 1234

利用可能: `serve`

```bash
parcel serve entry.js --port 1111
```

### ログレベルの変更

デフォルト: 3

利用可能: `serve`, `watch`, `build`

```bash
parcel entry.js --log-level 1
```

| Loglevel | Effect                                                                                                   |
| -------- | -------------------------------------------------------------------------------------------------------- |
| 0        | ログは無効                                                                                               |
| 1        | エラーのみを記録する                                                                                     |
| 2        | エラーと警告だけ記録する                                                                                 |
| 3        | エラー、警告、情報を記録する                                                                             |
| 4        | Verbose （タイムスタンプを使用してすべてをログを記録<br>し、http リクエストを dev サーバーに記録します） |
| 5        | debug （すべてをタイムスタンプ付きのファイルに保存）                                                     |

### HMR ホスト名

デフォルト: 現在のウィンドウの `location.hostname`

利用可能: `serve`, `watch`

```bash
parcel entry.js --hmr-hostname parceljs.org
```

### HMR ポート

デフォルト: 利用可能なランダムなポート

利用可能: `serve`, `watch`

```bash
parcel entry.js --hmr-port 8080
```

### 出力ファイル名

デフォルト: 元のファイル名

利用可能: `serve`, `watch`, `build`

```bash
parcel build entry.js --out-file output.html
```

これにより、エントリポイントバンドルの出力ファイル名が変更されます

### 詳細レポートを表示する

デフォルト: 最小のレポート、あるいは深さ 10

オプションの引数は、表示の深さを指定します。

利用可能: `build`

```bash
parcel build entry.js --detailed-report
parcel build entry.js --detailed-report 10
```

### https を有効化

デフォルト: https は無効

利用可能: `serve`, `watch` (HMR 接続を HTTPS で待ち受ける)

```bash
parcel build entry.js --https
```

⚠️ このフラグは自己署名証明書を生成します。localhost の自己署名証明書を許可するようにブラウザーを構成する必要がある場合があります。

### カスタム証明書を設定する

デフォルト: https は無効

利用可能: `serve`, `watch`

```bash
parcel entry.js --cert certificate.cert --key private.key
```

### ブラウザを開く

デフォルト: open は無効

利用可能: `serve`

```bash
parcel entry.js --open
```

### source-maps を無効にする

デフォルト: source-maps は有効

利用可能: `serve`, `watch`, `build`

```bash
parcel build entry.js --no-source-maps
```

### コンテンツハッシュを無効にする

デフォルト:コンテンツハッシュは有効

利用可能: `build`

```bash
parcel build entry.js --no-content-hash
```

### 自動インストールを無効にする

デフォルト: 自動インストールは有効

利用可能: `serve`, `watch`

```bash
parcel entry.js --no-autoinstall
```

### HMR を無効にする

デフォルト: HMR は有効

利用可能: `serve`, `watch`

```bash
parcel entry.js --no-hmr
```

### minification を無効にする

デフォルト: minification は有効

利用可能: `build`

```bash
parcel build entry.js --no-minify
```

### ファイルシステムキャッシュを無効にする

デフォルト: キャッシュは有効

利用可能: `serve`, `watch`, `build`

```bash
parcel build entry.js --no-cache
```

### モジュールを UMD として公開する

デフォルト: 無効

利用可能: `serve`, `watch`, `build`

```bash
parcel serve entry.js --global myvariable
```

### 実験的な scope hoisting/tree shaking サポートを有効にする

デフォルト: 無効

利用可能: `build`

```bash
parcel build entry.js --experimental-scope-hoisting
```

詳細については、 Parcel 1.9 に関する Devon Govett の記事 [Tree Shaking section](https://medium.com/@devongovett/parcel-v1-9-0-tree-shaking-2x-faster-watcher-and-more-87f2e1a70f79#4ed3) を参照してください。
