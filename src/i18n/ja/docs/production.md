# ✨ Production

本番用にアプリケーションをバンドルするときがきたら、Parcel の本番モードを使用できます。

```bash
parcel build entry.js
```

## 最適化

これにより、watch mode と hot Module replacement が無効になるため、一度だけビルドされます。また、すべての出力バンドルの圧縮ツールを有効にして、ファイルサイズを削減します。Parcel では、JavaScript に [terser](https://github.com/fabiosantoscode/terser), CSS に [cssnano](http://cssnano.co), HTML に [htmlnano](https://github.com/posthtml/htmlnano) を圧縮ツールとして使用しています。

本番モードを有効にすると、本番環境変数 `NODE_ENV=production` も設定されます。React のような大きなライブラリには、この環境変数を設定することで無効にされる開発時専用のデバッグ機能があります。結果、本番環境でのビルドは小さく高速になります。

同じ種類の開発時専用デバッグ機能を利用するには、[terser の `dead_code` オプション](https://github.com/terser-js/terser#compress-options) が（デフォルトで）オンになっていることを確認して 、開発専用デバッグを次のような条件付きチェックでラップします。

```js
if (process.env.NODE_ENV === 'development') {
  // Or, `process.env.NODE_ENV !== 'production'`
  // Only runs in development and will be stripped from production build.
}
```

## ファイル名ストラテジー

パフォーマンスと効率を最適化し、cdn へ積極的にキャッシュルールを設定できるように、Parcel はほとんどのバンドルのファイル名をハッシュします（主に SEO の場合、バンドルに読み取り可能/記憶可能な名前を付けるかどうかに応じて）。

バンドルの命名に関して、Parcel は次の表に準じています。 （エントリポイントはハッシュされません）

|                   Bundle Type | Type               | Content hashed |
| ----------------------------: | ------------------ | :------------: |
|                           Any | Entrypoint         |       ❌       |
|                    JavaScript | `<script>`         |       ✅       |
|                    JavaScript | Dynamic import     |       ❌       |
|                    JavaScript | Service worker     |       ❌       |
|                          HTML | iframe             |       ❌       |
|                          HTML | anchor link        |       ❌       |
| Raw (Images, text files, ...) | Import/Require/... |       ✅       |

ファイルハッシュは、次の命名パターンに準じています。: `<directory name>-<hash>.<extension>`

## クロスプラットフォームの落とし穴

本番ビルドのパフォーマンスを最適化するために、Parcel はビルドコマンドを実行しているマシンで使用可能な CPU の数を決定し、それに応じて作業を分散できるようにします。そのために、Parcel は [physical-cpu-count](https://www.npmjs.com/package/physical-cpu-count) ライブラリに依存しています。

このモジュールは、あなたのシステムで [`lscpu`](http://manpages.courier-mta.org/htmlman1/lscpu.1.html) プログラムが利用可能であることを前提としていることに注意してください。

## CI を使用する

Parcel を継続的インテグレーションシステム（例. Travis や Circle CI など）に統合する場合は、ローカルの依存関係として Parcel をインストールする必要があるかもしれません。

手順は[こちら](getting_started.html#adding-parcel-to-your-project)にあります。
