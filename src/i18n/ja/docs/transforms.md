# 🐠 変換

多くのバンドラーがアセットを変換するのにプラグインのインストールと設定を必要としますが、Parcel は多くの一般的な変換とトランスパイラを設定不要で使うことができます。JavaScript へは[Babel](https://babeljs.io)を、CSS へは[PostCSS](http://postcss.org)を、HTML へは[PostHTML](https://github.com/posthtml/posthtml)を使って変換することができます。Parcel はこれらの変換を、モジュールに設定ファイル(例:`.babelrc`, `.postcssrc`)があれば自動的に行います。(`.babelrc`で指定された変換に加えて、Parcel は常に最新の JavaScript をブラウザがサポートする形に変換するために Babel を使います。詳しくは [JavaScript/Babel のデフォルト変換](javascript.html#default-babel-transforms) を参照してください。)

## サードパーティ製のモジュール

`.babelrc`のような設定ファイルは、デフォルトではサードパーティの`node_modules`に対しては適用されません。しかしながら、モジュールのディレクトリに対してシンボリックリンクが張られていて(いくつかの monorepo 規則では一般的)、モジュールの`package.json`が`source`のフィールドセットを持つ場合には、モジュールに書かれている設定が尊重されます。以下は`source`フィールドでサポートされている値です。

- すべてのファイルをソースコードとして扱い、ソースの解決方法を変えない

```json
{
  "main": "foo.js",
  "source": true
}
```

- ソースからコンパイルする際に、bar.js をエントリーポイントとする

```json
{
  "main": "foo.js",
  "source": "bar.js"
}
```

- ソースからコンパイルする際に、特定のファイルにエイリアスを設定する

```json
{
  "main": "foo.js",
  "source": {
    "./foo.js": "./bar.js",
    "./baz.js": "./yay.js"
  }
}
```

- ソースからコンパイルする際に、glob パターンを使用してエイリアスを設定する

```json
{
  "main": "foo.js",
  "source": {
    "./lib/**": "./src/$1"
  }
}
```

最後の例は、すべての lib ディレクトリを src に置き換えることができます、つまり 'my-module/lib/test.js' は 'my-module/src/test.js' に解決されます。また、lodash のように、ルートにたくさんの置換対象のファイルがある場合には、`"**": "./src/$1"`のように、トップレベルですべてをキャッチするパターンを使うこともできます。(例:lodash/cloneDeep から lodash/src/cloneDeep)
