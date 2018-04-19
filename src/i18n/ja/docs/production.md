# ✨ 本番

本番用にアプリケーションをバンドルするときは、Parcelのプロダクションモードを使用できます。

```bash
parcel build entry.js
```


これはウォッチモードとホットモジュールリプレースメントを無効にするので、1度しかビルドされません。また、ミニファイアが有効になりすべての出力バンドルのファイルサイズを縮小できます。Parcelで使用されるミニファイアは、JavaScriptの場合は[uglify-es](https://github.com/mishoo/UglifyJS2/tree/harmony)、CSSの場合は[cssnano](http://cssnano.co)、HTMLの場合は[htmlnano](https://github.com/posthtml/htmlnano)です。

プロダクションモードを有効にすると、`NODE_ENV = production`環境変数も設定されます。 Reactのような大規模なライブラリには、この環境変数を設定することによって無効にされる開発専用のデバッグ機能があり、その結果、本番用のビルドがより小さくて速くなります。