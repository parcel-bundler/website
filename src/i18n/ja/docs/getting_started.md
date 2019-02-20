# 🚀 はじめに

Parcel は、開発者の経験によって生まれた Web アプリケーションバンドラです。設定不要で、マルチコア処理を利用した驚異的な高速パフォーマンスを提供します。

まずは yarn または npm で Parcel をインストールしましょう。

Yarn:

```bash
yarn global add parcel-bundler
```

npm:

```bash
npm install -g parcel-bundler
```

プロジェクトルートに以下のコマンドを使って package.json を作成しましょう。

```bash
yarn init -y
```

または

```bash
npm init -y
```

Parcel はどんな種類のファイルでもエントリーポイントとして扱うことができますが、HTML または JavaScript ファイルから始めるのがよいでしょう。HTML ファイルから相対パスでメインとなる JavaScript ファイルをリンクすると、Parcel はそれを処理し、参照を出力したファイルの URL に置き換えます。

次に、index.html と index.js ファイルを作成しましょう。

```html
<html>
  <body>
    <script src="./index.js"></script>
  </body>
</html>
```

```javascript
console.log('hello world')
```

Parcel には開発用サーバーが組み込まれており、ファイルを変更した際に自動的にアプリケーションを再ビルドします。 また、開発を効率的にするため[ホットモジュールリプレイスメント](hmr.html)をサポートしています。次のようにエントリーファイルを指定してみましょう。

```bash
parcel index.html
```

では、ブラウザで http://localhost:1234/ を開いてみましょう。もし、ホットモジュールリプレイスメントが動いていない場合は[エディタの設定を編集](hmr.html#safe-write)する必要があるかもしれません。 `-p <ポート番号>` オプションを使うことでデフォルトのポート番号を上書きすることができます。

自分でサーバーを持っていない場合、あるいはアプリケーションがすべてクライアントでレンダリングされる場合には、Parcel の開発用サーバを使いましょう。自分でサーバーを持っている場合には、代わりに Parcel を `watch` モードで実行することができます。ファイルが変更されると自動で再ビルドを行い、ホットモジュールリプレースメントをサポートしますが、Web サーバーは起動しません。

```bash
parcel watch index.html
```

### 複数のエントリーファイル

万が一、あなたが複数のエントリーファイルを持っている、たとえば `index.html` と `about.html` があるとした場合にはバンドラーを起動するために 2 種類の方法があります。

ファイル名を指定する方法

```bash
parcel index.html about.html
```

トークンを使って glob を作る方法

```bash
parcel *.html
```

_NOTE:_ もしこのようなファイル構造をしている場合

```
- folder-1
-- index.html
- folder-2
-- index.html
```

http://localhost:1234/folder-1/ を開いてもうまくいきません。http://localhost:1234/folder-1/index.html のように、ファイル名を正確に指定する必要があります。

### 本番用にビルドする

本番用のビルドを行うときは、 `build` モードがファイルの監視を無効にして、一度だけビルドを行います。 詳細は[本番](production.html)を参照してください。

### Parcel をプロジェクトに追加する

時には Parcel をグローバルインストールできないこともあるでしょう。（例：他人のマシンや CI を使ってプロジェクトを自動でビルドしたいとき）こういう場合には、ローカルパッケージとして Parcel をインストールすることができます。

yarn でインストールする方法

```bash
yarn add parcel-bundler --dev
```

npm でインストールする方法

```bash
npm install parcel-bundler --save-dev
```

それから、プロジェクトの `package.json` にこれらのタスクスクリプトを追加します。

```json
{
  "scripts": {
    "dev": "parcel <your entry file>",
    "build": "parcel build <your entry file>"
  }
}
```

すると、以下のように実行することができるようになります

```bash
# 開発モードで起動する
yarn dev
#または
npm run dev

# 本番モードでビルドする
yarn build
#または
npm run build
```
