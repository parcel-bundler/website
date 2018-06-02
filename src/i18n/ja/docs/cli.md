# 🖥 CLI

## コマンド

### Serve

Serveは開発用サーバーを立ち上げます。ファイルの変更があると自動で再ビルドを行い、素早い開発のために[ホットモジュールリプレースメント](hmr.html)をサポートしています。

```bash
parcel index.html
```

### Build

Buildは一度だけアセットをビルドし、コードの最小化とNODE_ENVをproductionにセットします。[本番](production.html)

```bash
parcel build index.html
```

### Watch

WatchはServeと似ていますが、主な違いはサーバーを起動しないところです。

```bash
parcel watch index.html
```

### Help

全てのCLIオプションを表示します。

```bash
parcel help
```

## オプション

### 出力先ディレクトリ

デフォルト： "dist"

次で利用可能： `serve`, `watch`, `build`

```bash
parcel build entry.js --out-dir build/output
or
parcel build entry.js -d build/output
```

```base
root
- build
- - output
- - - entry.js
```

### ServeするパブリックURLを設定する

デフォルト： "/"

次で利用可能： `serve`, `watch`, `build`

```bash
parcel entry.js --public-url ./dist/
```

は以下のように出力されます。

```html
<link rel="stylesheet" type="text/css" href="/dist/entry.1a2b3c.css">
or
<script src="/dist/entry.e5f6g7.js"></script>
```

### ターゲット

デフォルト： browser

次で利用可能： `serve`, `watch`, `build`

```bash
parcel build entry.js --target node
```

利用可能なターゲット: node, browser, electron

### ログレベルを変更する

デフォルト： 3

次で利用可能： `serve`, `watch`, `build`

```bash
parcel entry.js --log-level 1
```

| ログレベル | 効果             |
|---       |---               |
| 0        | ログを無効化します  |
| 1        | エラーのみ         |
| 2        | エラーと警告のみ    |
| 3        | 全て              |

### HMR ホスト名

デフォルト： 現在のウィンドウの`location.hostname`

次で利用可能： `serve`, `watch`

```bash
parcel entry.js --hmr-hostname parceljs.org
```

### HMRポート

デフォルト： 利用可能なランダムなポート

次で利用可能： `serve`, `watch`

```bash
parcel entry.js --hmr-port 8080
```

### 出力ファイル名

デフォルト： オリジナルのファイル名

次で利用可能： `serve`, `watch`, `build`

```bash
parcel build entry.js --out-file output.html
```

これによって、エントリーポイントバンドルの出力ファイル名が変更されます。

### 詳細なレポートを出力する

デフォルト： 最小限のレポート

次で利用可能： `build`

```bash
parcel build entry.js --detailed-report
```

### httpsを有効にする

デフォルト： 無効

次で利用可能： `serve`

```bash
parcel build entry.js --https
```

⚠️ このフラグは自己署名証明書を生成します。ブラウザの設定でlocalhostに対して、自己署名証明書を許可する必要がある可能性があります。

### 任意の証明書を設定する

デフォルト： 無効

次で利用可能： `serve`

```bash
parcel entry.js --cert certificate.cert --key private.key
```

### ブラウザで開く

デフォルト： ブラウザは開きません

次で利用可能： `serve`

```bash
parcel entry.js --open
```

### ソースマップを無効にする

デフォルト： 有効

次で利用可能： `serve`, `watch`, `build`

```bash
parcel build entry.js --no-source-maps
```

### 自動インストールを無効にする

デフォルト： 有効

次で利用可能： `serve`, `watch`

```bash
parcel entry.js --no-autoinstall
```

### HMRを無効にする

デフォルト： 有効

次で利用可能： `serve`, `watch`

```bash
parcel entry.js --no-hmr
```

### 最小化を無効にする

デフォルト： 有効

次で利用可能： `build`

```bash
parcel build entry.js --no-minify
```

### ファイルシステムキャッシュを無効にする

デフォルト： 有効

次で利用可能： `serve`, `watch`, `build`

```bash
parcel build entry.js --no-cache
```