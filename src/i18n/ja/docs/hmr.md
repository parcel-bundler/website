# 🔥 ホットモジュールリプレースメント

ホットモジュールリプレースメント（HMR）は、ページ全体をリフレッシュすることなく、実行時にブラウザのモジュールを自動的に更新することで開発体験を向上させます。つまり、小さなものを変更してもアプリケーションの状態は保持されます。
ParcelのHMR実装は、JavaScriptとCSSアセットの両方をサポートしています。 HMRは、本番モードでバンドルすると自動的に無効になります。

ファイルを保存すると、Parcelは変更された内容を再構築し、実行中のクライアントに新しいコードを含む更新を送信します。新しいコードは古いコードを置き換え、全ての親と一緒に再評価されます。このプロセスには、`module.hot`APIを使用することができます。このAPIは、モジュールが破棄されようとしているとき、または新しいバージョンが入ったときにあなたのコードに通知することができます。[react-hot-loader](https://github.com/gaearon/react-hot-loader)は、このプロセスに役立ち、Parcelですぐに使うことができます。

知っておくべきメソッドが2つあります。 `module.hot.accept` と `module.hot.dispose`です。 コールバックとともに`module.hot.accept`を呼ぶと、そのモジュールやそのモジュールの依存関係が更新されたときにコールバックが呼ばれます。`module.hot.dispose`はそのモジュールが置き換えられようとしているときに呼ばれます。

```javascript
if (module.hot) {
  module.hot.dispose(function () {
    // モジュールが置き換えられるときに呼ばれます
  });

  module.hot.accept(function () {
    // モジュールまたはその依存関係が更新されるときに呼ばれます
  });
}
```

## 安全な書き込み（Safe write）
テキストエディタやIDEの中には、`safe write`と呼ばれる機能があります。これは、ファイルのコピーを取って保存したときに名前を変更することで、データの損失を防ぐことができます。

ホットモジュールリロード（HMR）を使用する場合、この機能はファイル更新の自動検出をブロックします。 `safe write`を無効にするために以下のオプションを使用します：

* `Sublime Text 3` ユーザー設定に atomic_save: "false" を追加してください。
* `IntelliJ` 設定で "safe write" と検索して、出てきた項目を無効化してください。
* `Vim` 設定に :set backupcopy=yes を追加してください。
* `WebStorm` Preferences > Appearance & Behavior > System Settings 中の"safe write"のチェックを外してください。
