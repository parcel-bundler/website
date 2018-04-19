# 🐠 変換

他のバンドラではアセットを変換するために、プラグインのインストールと設定が必要ですが、Parcelはいくつもの一般的な変換やトランスパイラがすぐに使えます。JavaScriptの変換には[Babel](https://babeljs.io)を、CSSの変換には[PostCSS](http://postcss.org)を、HTMLの変換には[PostHTML](https://github.com/posthtml/posthtml)を使うことができますPParcelは、モジュール内に設定ファイル（例えば `.babelrc`、`.postcssrc`）が見つかると自動的にこれらの変換を実行します。

これらはサードパーティの`node_modules`でも動作します：構成ファイルがパッケージの一部として公開されている場合、そのモジュールの変換だけが自動的にオンになります。これにより、変換が必要なモジュールだけが処理されるため、バンドル処理が高速になります。また、特定のファイルを含めるか除外するように変換を手動で設定する必要も、アプリケーションで使用するためにサードパーティのコードがどのように組み込まれているかを知る必要もありません。

## Babel

[Babel](https://babeljs.io)は大きなプラグインエコシステムを備えた、JavaScriptでは有名なトランスパイラです。ParcelでBabelを使うのは、単体で使うときやスタンドアロンまたは他のバンドラでの使うときと同じです。

アプリにプリセットとプラグインをインストールします：

```bash
yarn add babel-preset-env
```

それから、`.babelrc`を作成します：

```json
{
  "presets": ["env"]
}
```

## PostCSS

[PostCSS](http://postcss.org)はCSSを[autoprefixer](https://github.com/postcss/autoprefixer)、[cssnext](http://cssnext.io/)や[CSS Modules](https://github.com/css-modules/css-modules)のようなプラグインを使ってCSSを変換するツールです。ParcelでPostCSSを設定するには、 `.postcssrc`（JSON）、`.postcssrc.js`、または `postcss.config.js`のいずれかの名前の設定ファイルを作成します。

アプリにプラグインをインストールします：

```bash
yarn add postcss-modules autoprefixer
```

それから、`.postcssrc`を作成します：

```json
{
  "modules": true,
  "plugins": {
    "autoprefixer": {
      "grid": true
    }
  }
}
```


プラグインは`plugins`オブジェクトでキーとして指定され、オプションはオブジェクトの値を使って定義されます。プラグインのオプションがない場合は、代わりに `true`に設定してください。


Autoprefixer、cssnext、およびその他のツールのターゲットブラウザは `.browserslistrc`ファイルで指定できます：

```
> 1%
last 2 versions
```

CSSモジュールは他と少し異なり、トップレベルに`modules`キーを使用して有効になります。これは、ParcelがJavaScriptバンドルにも含まれるオブジェクトをエクスポートすることで、ParcelがCSSモジュールを特別にサポートする必要があるためです。また、プロジェクトに `postcss-modules`をインストールする必要があることに注意してください。

### 既存のCSSライブラリでの使用

CSSモジュールが既存のモジュールで適切に動作するためには、このサポートをそれぞれの`.postcssrc`で指定する必要があります。

## PostHTML

[PostHTML](https://github.com/posthtml/posthtml)はプラグインでHTMLを変換するためのツールです。これらの名前のいずれかを使用して設定ファイルを作成することで、ParcelでPostHTMLを設定できます。：`.posthtmlrc` (JSON), `posthtmlrc.js`, または `posthtml.config.js`.

アプリにプラグインをインストールします：

```bash
yarn add posthtml-img-autosize
```

それから、`.posthtmlrc`を作成します：

```json
{
  "plugins": {
    "posthtml-img-autosize": {
      "root": "./images"
    }
  }
}
```

プラグインは`plugins`オブジェクトでキーとして指定され、オプションはオブジェクトの値を使って定義されます。プラグインのオプションがない場合は、代わりに `true`に設定してください。

## TypeScript

[TypeScript](https://www.typescriptlang.org/)は最新のES2015以降の機能をサポートし、プレーンなJavaScriptにコンパイルを行うJavaScriptの型付きスーパーセットです。 TypeScriptの変換は、追加の設定を行うことなくそのまま実行できます。

```html
<!-- index.html -->
<html>
<body>
  <script src="./index.ts"></script>
</body>
</html>
```

```typescript
// index.ts
import message from "./message";
console.log(message);
```

```typescript
// message.ts
export default "Hello, world";
```

## ReasonML/BuckleScript

[ReasonML](https://reasonml.github.io/)は、OCamlを[BuckleScript](https://bucklescript.github.io)の助けを借りてJavaScriptにコンパイルします。依存関係をインストールし、 `bsconfig.json`を作成することで、ReasonMLを使用することができます：

```bash
$ yarn add bs-platform --dev
```

```json
// bsconfig.json
// from https://github.com/BuckleScript/bucklescript/blob/master/jscomp/bsb/templates/basic-reason/bsconfig.json

{
  "name": "whatever",
  "sources": {
    "dir": "src",
    "subdirs": true
  },
  "package-specs": {
    "module": "commonjs",
    "in-source": true
  },
  "suffix": ".bs.js",
  "bs-dependencies": [
  ],
  "warnings": {
    "error": "+101"
  },
  "namespace": true,
  "refmt": 3
}
```

```html
<!-- index.html -->
<html>
<body>
  <script src="./src/index.re"></script>
</body>
</html>
```

```reason
/* src/index.re */
print_endline("Hello World");
```

### ReasonReact

[ReasonReact](https://reasonml.github.io/reason-react/)は、ReasonMLのReactバインディングです。Parcelでも使うことができます：

```bash
$ yarn add react react-dom reason-react
```

```html
<!-- index.html -->
<html>
<body>
  <script src="./src/index.re"></script>
</body>
</html>
```

```diff
// bsconfig.json

{
  "name": "whatever",
+ "reason": {
+   "react-jsx": 2
+ },
  "sources": {
    "dir": "src",
    "subdirs": true
  },
  "package-specs": {
    "module": "commonjs",
    "in-source": true
  },
  "suffix": ".bs.js",
  "bs-dependencies": [
+   "reason-react"
  ],
  "warnings": {
    "error": "+101"
  },
  "namespace": true,
  "refmt": 3
}
```

```html
<!-- index.html -->
<html>
<body>
  <div id="app"></div>
  <script src="./src/index.re"></script>
</body>
</html>
```

```reason
/* src/Greeting.re */ 

let component = ReasonReact.statelessComponent("Greeting");

let make = (~name, _children) => {
  ...component,
  render: _self =>
    <div>
      {ReasonReact.stringToElement("Hello! " ++ name)}
    </div>
};
```

```reason
/* src/index.re */

ReactDOMRe.renderToElementWithId(<Greeting name="Parcel" />, "app");
```
