# 🐠 Conversões

Enquanto muitos empacotadores exigem que você instale e configure plugins para converter arquivos, o Parcel tem suporte de fábrica para a maioria dos conversores e transpiladores. Você pode converter JavaScript utilizando [Babel](https://babeljs.io), CSS utilizando [PostCSS](http://postcss.org), e HTML utilizando [PostHTML](https://github.com/posthtml/posthtml). Parcel utilizará esses conversores automaticamente se ele encontrar um arquivo de configuração em um módulo (por exemplo, `.babelrc` e `.postcssrc`).

Isso funciona mesmo em módulos externos (`node_modules`): se um arquivo de configuração é publicado como parte da distribuição do pacote, a conversão é feita automaticamente apenas para aquele módulo. Isso mantém o empacotamento rápido, já que apenas os módulos que precisam ser convertidos são processados. Isso também significa que você não precisa configurar manualmente as conversões para incluir e excluir determinados arquivos, ou saber como o código de outra pessoa foi criado para usá-lo em sua aplicação.

## Babel

[Babel](https://babeljs.io) é o conversor de JavaScript mais popular que conta com um grande ecossistema de plugins. Usar o Babel com o Parcel funciona da mesma maneira que utilizá-lo sozinho ou com outros empacotadores.

Instale as predefinições e plugins na sua aplicação:

```bash
yarn add @babel/preset-env
```

Crie o arquivo `.babelrc`:

```json
{
  "presets": [
    "@babel/preset-env"
  ]
}
```

### Conversões padrões do Babel

Parcel transpila o seu código com `@babel/preset-env` por padrão, isto é para transpilar cada modulo interno (*local requires*) e externo (*node_modules*) para coincidir com destino definido.

Para o alvo `browser` é utilizado o [browserslist](https://github.com/browserslist/browserslist), o *browserlist* alvo pode ser definido no `package.json` (`engines.browsers` ou `browserslist`) ou usando um arquivo de configuração (`browserslist` ou `.browserslistrc`).

O alvo padrão do *browserlist* é: `> 0.25%` (Significando, suportar cada navegador que tenha 0,25% ou mais da quantidade total de usuários ativos da web)

Para o alvo `node`, Parcel utiliza o `engines.node` definido no `package.json`, este padrão para *node 8*.

## PostCSS

[PostCSS](http://postcss.org) é uma ferramenta para conveter CSS com o auxílio de plugins como [autoprefixer](https://github.com/postcss/autoprefixer), [cssnext](http://cssnext.io/), e [CSS Modules](https://github.com/css-modules/css-modules). Você pode configurar o PostCSS com o Parcel criando um arquivo de configuração com um desses nomes: `.postcssrc` (JSON), `.postcssrc.js` ou `postcss.config.js`.

Instale os plugins na sua aplicação:

```bash
yarn add postcss-modules autoprefixer
```

Crie o arquivo `.postcssrc`:

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

Os plugins são especificados no objeto `plugins` como chaves e as opções são definidas usando valores. Se um plugin não possuir opções, apenas configure o seu valor para `true`.

As configurações de browser para o Autoprefixer, cssnext e outras ferramentas podem ser especificadas no arquivo `.browserslistrc`:

```
> 1%
last 2 versions
```

Os CSS Modules são habilitados de uma forma um pouco diferente usando a chave de "módulos" de um nível superior. Isso ocorre porque o Parcel precisa ter um suporte especial para os CSS Modules, uma vez que eles exportam um objeto a ser incluído no pacote JavaScript também. Observe que você ainda precisa instalar `postcss-modules` em seu projeto.

### Uso com bibliotecas CSS existentes

Para que os módulos CSS funcionem adequadamente com os módulos existentes, eles precisam especificar esse suporte em seus próprios `.postcssrc`.

### Definindo condiguração de minificação do cssnano

Parcel adiciona o [cssnano](http://cssnano.co) ao postcss a fim de minificar o CSS no *build* de produção, onde a configuração personalizada pode ser definida através da criação de arquivo `cssnano.config.js`:

```js
module.exports = {
  preset: ['default', {
    calc: false,
    discardComments: {
      removeAll: true,
    }
  }]
};
```

## PostHTML

[PostHTML](https://github.com/posthtml/posthtml) é uma ferramenta para converter HTML com o auxílio de plugins. Você pode configurar o PostHTML com Parcel criando um arquivo de configuração usando um desses nomes: `.posthtmlrc` (JSON), `posthtmlrc.js` ou `posthtml.config.js`.

Instale os plugins na sua aplicação:

```bash
yarn add posthtml-img-autosize
```

Crie o arquivo `.posthtmlrc`:

```json
{
  "plugins": {
    "posthtml-img-autosize": {
      "root": "./images"
    }
  }
}
```

Os plugins são especificados no objeto `plugins` como chaves e as opções são definidas usando valores. Se um plugin não possuir opções, apenas configure o seu valor para `true`.

## TypeScript

[TypeScript](https://www.typescriptlang.org/) é um superconjunto de JavaScript tipado que compila para JavaScript simples, que também suporta características mordernas do ES2015+. Conversões TypeScripe funcionam *out of the box*, sem a necessidade de nenhuma configuração adicional.

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

[ReasonML](https://reasonml.github.io/) compila OCaml para JavaScript com a ajuda do [BuckleScript](https://bucklescript.github.io).  Você pode utilizar ReasonML ao instalar as dependências e criar o arquivo `bsconfig.json`:

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
<!doctype html>
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

[ReasonReact](https://reasonml.github.io/reason-react/) é um *bind* React para ReasonML. Você pode usar em conjunto com o Parcel também:

```bash
$ yarn add react react-dom reason-react
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

```diff
<!-- index.html -->
<html>
<body>
+  <div id="app"></div>
  <script src="./src/index.re"></script>
</body>
</html>
```

```reason
/* src/Greeting.re */

let component = ReasonReact.statelessComponent("Greeting");

let make = (~name, _children) => {
  ...component,
  render: _self => <div> (ReasonReact.string("Hello! " ++ name)) </div>,
};
```

```reason
/* src/index.re */

ReactDOMRe.renderToElementWithId(<Greeting name="Parcel" />, "app");
```
