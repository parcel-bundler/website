# 📦 アセット

Parcelはアセットに基づいています。アセットは様々なファイルのことを表しますが、ParcelはJavaScript、CSS、HTMLなどの特定のタイプのアセットを特にサポートしています。Parcelはこれらのファイルから参照されている依存を自動で解析して出力するバンドルに含めます。類似のタイプのアセットはグループ化され、同じバンドルにまとめられます。異なるタイプのアセットをインポートすると（例: CSSファイルをJSファイルからインポートした場合）、子バンドルが作成され、親バンドルへの参照が残されます。これについては、次の項目で説明します。

## JavaScript

Webバンドルの最も一般的なファイルタイプはJavaScriptです。Parcelは、ファイルをインポートするためのCommonJSとES6の両方のモジュール構文をサポートしています。
また、モジュールを非同期にロードするための動的な`import（）`関数構文もサポートしています。これについては、[コード分割](code_splitting.html)の項目で説明しています。

```javascript
// CommonJS構文を使ったモジュールのインポート
const dep = require('./path/to/dep');

// ES6 import構文を使ったモジュールのインポート
import dep from './path/to/dep';
```

JavaScript以外のアセットをJavaScriptファイルからインポートすることもできます（例： CSS、または画像ファイル）。これらのファイルのいずれかをインポートする時、他のバンドルのようにインライン化されません。
代わりに、すべての依存関係とともに別のバンドル（例: CSSファイル）に配置されます。[CSS Modules](https://github.com/css-modules/css-modules)を使用する場合、エクスポートされたクラスはJavaScriptバンドルに配置されます。他のアセットタイプはJavaScriptバンドル内の出力ファイルにURLをエクスポートし、コード内でそれらを参照できます。

```javascript
// CSSファイルをインポートする
import './test.css';

// CSSファイルをCSS modulesでインポートする
import classNames from './test.css';

// 画像ファイルへのURLをインポートする
import imageURL from './test.png';
```

ファイルをURLで参照するのではなく、JavaScriptバンドルにインライン展開するには、Node.js`fs.readFileSync`APIを使用します。 URLは静的に解析可能でなければなりません。つまり、`__dirname`や` __filename`以外の変数を使うことはできません。

```javascript
import fs from 'fs';

// コンテンツを文字列として読み込む
const string = fs.readFileSync(__dirname + '/test.txt', 'utf8');

// コンテンツをバッファとして読み込む
const buffer = fs.readFileSync(__dirname + '/test.png');
```

## CSS

CSSアセットは、JavaScriptやHTMLファイルからインポートすることができ、`@import`構文で参照される依存関係や`url()`関数による画像、フォントなどへの参照を含むことができます。`@import`された他のCSSファイルは同じCSSバンドルにインライン展開され、`url()`参照は出力ファイル名に書き換えられます。すべてのファイル名は、そのCSSファイルとの相対的なものでなければなりません。

```css
/* 別のCSSファイルを読み込む */
@import './other.css';

.test {
  /* 画像ファイルを参照する */
  background: url('./images/background.png');
}
```

普通のCSSに加えて、LESS、SASS、およびStylusのようなコンパイルしてCSSにするような言語もサポートされており、同じように動作します。

## SCSS
SCSSコンパイルには、`node-sass`モジュールが必要です。 npmでインストールするには:
```bash
npm install node-sass
```
`node-sass`をインストールすると、JavaScriptファイルからSCSSファイルをインポートできます。
```javascript
import './custom.scss'
```
SCSSファイルの依存関係は`@import`記法を使うことができます。

## HTML
HTMLアセットは多くの場合、Parcelに提供するためのエントリファイルですが、JavaScriptファイルなどで参照することもできます。(例： 他のページへのリンクを与える場合）上記のように、スクリプト、スタイル、メディア、その他のHTMLファイルへのURLが抽出され、コンパイルされます。これらの参照は、正しい出力ファイルにリンクするようにHTMLに書き換えられます。すべてのファイル名は、そのHTMLファイルと相対的でなければなりません。

```html
<html>
<body>
  <!-- 画像ファイルを参照する -->
  <img src="./images/header.png">

  <a href="./other.html">他のページへのリンク</a>

  <!-- JavaScriptバンドルをインポートする -->
  <script src="./index.js"></script>
</body>
</html>
```
