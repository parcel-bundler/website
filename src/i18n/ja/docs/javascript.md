# JavaScript

_サポートしている拡張子: `js`, `jsx`, `es6`, `jsm`, `mjs`_

Web バンドラの最も伝統的なファイルの種類は JavaScript です。Parcel はファイルをインポートするために CommonJS と ES6 モジュール構文の両方をサポートしています。また、モジュールを非同期に読み込むための動的な `import()`（ダイナミックインポート）関数構文もサポートしており、[コード分割](code_splitting.html) のセクションでも言及しています。ダイナミックインポートは URL からモジュールをインポートすることも可能です。

```javascript
// CommonJS の構文を使ってモジュールをインポート
const dep = require('./path/to/dep')

// ES6 の構文を使ってモジュールをインポート
import dep from './path/to/dep'

// ダイナミックインポートを使って、URL (CDN など) からモジュールをインポート
import('https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.11/lodash.min.js').then(() => {
  console.log(_.VERSION)
})
```

JavaScript 以外のアセット、例えば CSS や HTML、または画像ファイルでさえも JavaScript ファイルからインポートできます。これらのファイルをインポートすると、その他のバンドラのようにインライン化はされません。その代わりに、すべての依存関係とセットで別々のバンドル（CSS ファイルなど）置き換えられます。[CSS モジュール](https://github.com/css-modules/css-modules)を使うのであれば、エクスポートされたクラスは JavaScript 内にバンドルされます。他のアセットタイプは、JavaScript バンドル内の出力ファイルへの URL をエクスポートするので、コード内でそれらを参照できます。

```javascript
// CSS ファイルをインポート
import './test.css'

// CSS ファイルを CSS モジュールとしてインポート
import classNames from './test.css'

// 画像ファイルを URL としてインポート
import imageURL from './test.png'

// HTML ファイルをインポート
import('./some.html')
// または:
import html from './some.html'
// または:
require('./some.html')
```

URL でファイルを参照するのではなく JavaScript バンドルにファイルをインライン化したい場合、Node.js の `fs.readFileSync` API を使うことで実現可能です。URL は静的に解析可能でなければなりません。つまり、その中に変数（`__dirname` と `filename` 以外）を入れてはいけないということを意味します。

```javascript
import fs from 'fs'

// コンテンツを文字列として読み込む
const string = fs.readFileSync(__dirname + '/test.txt', 'utf8')

// コンテンツを Buffer として読み込む
const buffer = fs.readFileSync(__dirname + '/test.png')

// Buffer コンテンツを画像に変換
;<img src={`data:image/png;base64,${buffer.toString('base64')}`} />
```

### JSX 内の画像

以下は、画像ファイルを JSX 内で使うためのインポート方法の例です。

```js
// 画像ファイルを読み込む
import megaMan from "./images/mega-man.png";

// JSX
<img src={megaMan} title="Mega Man" alt="Mega Man" />

// JSX (w/ custom path)
<img src={`/dist${megaMan}`} title="Mega Man" alt="Mega Man" />
```

# Babel

[Babel](https://babeljs.io) は大きなプラグインのエコシステムを持ち、よく使われる JavaScript のトランスパイラです。Parcel と一緒に Babel を使用すると、スタンドアロンまたは他のバンドラと同じように動作します。

アプリにプリセットとプラグインをインストール:

```shell
yarn add @babel/preset-react
```

そして、`.babelrc` を作成:

```json
{
  "presets": ["@babel/preset-react"]
}
```

`package.json` に `babel` の設定を記述することもできます

```json
"babel": {
  "presets": ["@babel/preset-react"]
}
```

注意: `package.json` の設定は `.babelrc` よりも優先されます。

## デフォルトの Babel の変換

Parcel はデフォルトで `@babel/preset-env` を用いてコードをトランスパイルします。これは、定義されたターゲットにマッチするように内部（ローカルの require）と外部 （node_modules）の両方のモジュールを全てトランスパイルします。

`browser` のターゲットでは [browserslist](https://github.com/browserslist/browserslist) を利用しますが、browserlist のターゲットは `package.json`（`engines.browsers` または `browserslist`）で定義するか、設定ファイル（`browserslist` または `.browserslistrc`）を使用します。

browserlist のターゲットのデフォルト値: `> 0.25%` (アクティブな web ユーザの総量の 0.25% 以上の全てのブラウザをサポートすることを意味します)

`node` のターゲットについて、Parcel は `package.json` で定義された `engines.node`、デフォルトでは _node 8_ を利用します。

# Flow

[Flow](https://flow.org/) は JavaScript の静的な型チェックツールとして人気があります。Parcel と一緒に Flow を使用するには、シンプルに `js` ファイルの最初の行に `// @flow` を配置するだけです。

Parcel は、コンパイルされた出力結果から Flow の型を取り除くために必要な Babel の設定を自動的にインストールするので、[エディタとの統合](https://flow.org/en/docs/editors/) または `.flowconfig` を用いて [絶対パスのモジュール解決](module_resolution.html#flow-with-absolute-or-tilde-resolution) をサポートすること以外は何も心配する必要はありません。
