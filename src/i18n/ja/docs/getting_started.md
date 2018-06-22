# 🚀 はじめに

Parcelは、開発者の経験によって生まれたWebアプリケーションバンドラです。設定不要で、マルチコア処理を利用した驚異的な高速パフォーマンスを提供します。

まずはYarnまたはnpmでParcelをインストールしましょう。

Yarn:
```bash
yarn global add parcel-bundler
```

npm:
```bash
npm install -g parcel-bundler
```

あなたのプロジェクトディレクトリに以下のコマンドを使ってpackage.jsonを作成しましょう。

```bash
yarn init -y
```
または
```bash
npm init -y
```

Parcelはどんな種類のファイルでもエントリーポイントとして扱うことができますが、HTMLまたはJavaScriptファイルから始めるのに適しています。
HTMLファイルから相対パスでメインとなるJavaScriptファイルをリンクすると、Parcelはそれを処理し、参照を出力ファイルのURLに置き換えます。

次に、index.htmlとindex.jsファイルを作成しましょう。

```html
<html>
<body>
  <script src="./index.js"></script>
</body>
</html>
```

```javascript
console.log("hello world");
```

Parcelには開発用サーバーが組み込まれており、ファイルを変更した際に自動的にアプリケーションを再ビルドします。 また、開発を効率的にするため[ホットモジュールリプレイスメント](hmr.html)をサポートしています。
次のようにエントリーファイルを指定してみましょう。

```bash
parcel index.html
```

では、ブラウザで http://localhost:1234/ を開いてみましょう。 `-p <ポート番号>` オプションを使うことでデフォルトのポート番号を上書きすることができます。

自分でサーバーを持っていない場合、あるいはあなたのアプリケーションがすべてクライアントで動く場合には開発用サーバを使いましょう。
自分でサーバーを持っている場合には、代わりにParcelを `watch` モードで実行することができます。
ファイルが変更されると自動で再ビルドを行い、ホットモジュールリプレースメントをサポートしますが、Webサーバーは起動しません。

```bash
parcel watch index.html
```

本番用のビルドを行う準備ができたら、 `build` でモードファイルの監視を無効にして、一度だけビルドします。 詳細は[本番](production.html)を参照してください。
