# SCSS

_サポートしている拡張子: `sass`, `scss`_

SCSS のコンパイルには `sass` モジュール(`dart-sass` の JS 版) が必要です。npm でインストールします:

```bash
npm install -D sass
```

一度 `sass` をインストールすれば JavaScript ファイルから SCSS ファイルをインポートできます。

```javascript
import './custom.scss'
```

SCSS ファイルの依存関係は `@import` ステートメントで使用できます。

Parcel を動かす前に `sass` モジュールをインストールしていない場合、 Parcel は自動でインストールをします。

**メモ:** SCSS のコンパイルに `node-sass` モジュールを使うことも出来ます。`node-sass` モジュールを利用するとで、より高速なコンパイルが期待できます。ただし、Parcel で `node-sass` モジュールを使用すると[ある問題](https://github.com/parcel-bundler/parcel/issues/1836) が発生することが報告されています。
