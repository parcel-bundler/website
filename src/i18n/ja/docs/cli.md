# 🖥 CLI

## コマンド

### サーブ(Serve)

サーブは開発用サーバーを立ち上げます。ファイルの変更があると自動で再ビルドを行い、素早い開発のために[ホットモジュールリプレースメント](hmr.html)をサポートします。

```bash
parcel index.html
```

### ビルド(Build)

ビルドはアセットを一度だけビルドします、またコードの最小化と NODE_ENV を productionにセットします。[本番](production.html)

```bash
parcel build index.html
```

### ウォッチ(Watch)

ウォッチコマンドはサーブと似ていますが、サーバーを立ち上げないところが主に異なります。

```bash
parcel watch index.html
```

### ヘルプ(Help)

cliの全てのオプションを表示します

```bash
parcel help
```

## オプション

### 出力先ディレクトリ

デフォルト："dist"

次で利用可能：`serve`, `watch`, `build`

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

### サーブするパブリックURLを設定する

デフォルト："/"

次で利用可能：`serve`, `watch`, `build`

```bash
parcel entry.js --public-url ./dist/
```

は以下のように出力されます：

```html
<link rel="stylesheet" type="text/css" href="/dist/entry.1a2b3c.css">
or
<script src="/dist/entry.e5f6g7.js"></script>
```

### ターゲット

デフォルト：browser

次で利用可能：`serve`, `watch`, `build`

```bash
parcel build entry.js --target node
```

利用可能なターゲット: node, browser, electron

### ログレベルを変更する

デフォルト：3

次で利用可能：`serve`, `watch`, `build`

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

デフォルト：現在のウィンドウの`location.hostname`

次で利用可能：`serve`, `watch`

```bash
parcel entry.js --hmr-hostname parceljs.org
```

### HMR ポート

デフォルト： 利用可能なランダムなポート

次で利用可能：`serve`, `watch`

```bash
parcel entry.js --hmr-port 8080
```

### 出力ファイル名

デフォルト： オリジナルのファイル名

次で利用可能：`serve`, `watch`, `build`

```bash
parcel build entry.js --out-file output.html
```

これを設定すると、エントリーポイントバンドルの出力ファイル名を変更します

### 詳細なレポートを出力する

デフォルト：最小限のレポート

次で利用可能：`build`

```bash
parcel build entry.js --detailed-report
```

### httpsを有効にする

デフォルト：httpsは無効です

次で利用可能：`server`

```bash
parcel build entry.js --https
```

⚠️ このフラグは自己署名証明書を生成します。ブラウザの設定でlocalhostに対して、自己署名証明書を許可する必要があるかもしれません。

### 任意の証明書を設定する

デフォルト：httpsは無効

次で利用可能：`serve`

```bash
parcel entry.js --cert certificate.cert --key private.key
```

### ブラウザで開く

デフォルト：ブラウザは開きません

次で利用可能：`serve`

```bash
parcel entry.js --open
```

### ソースマップを無効にする

デフォルト：ソースマップは有効

次で利用可能：`serve`, `watch`, `build`

```bash
parcel build entry.js --no-source-maps
```

### 自動インストールを無効にする

デフォルト：自動インストールは有効

次で利用可能：`serve`, `watch`

```bash
parcel entry.js --no-autoinstall
```

### HMRを無効にする

デフォルト：HMRは有効です

次で利用可能：`serve`, `watch`

```bash
parcel entry.js --no-hmr
```

### 最小化を無効にする

デフォルト：最小化は有効です

次で利用可能：`build`

```bash
parcel build entry.js --no-minify
```

### ファイルシステムキャッシュを無効にする

デフォルト：キャッシュは有効です

次で利用可能：`serve`, `watch`, `build`

```bash
parcel build entry.js --no-cache
```