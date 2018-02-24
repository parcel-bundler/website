# 🐠 Conversões

Enquanto muitos empacotadores exigem que você instale e configure plugins para converter arquivos, o Parcel tem suporte de fábrica para a maioria dos conversores e transpiladores. Você pode converter JavaScript utilizando [Babel](https://babeljs.io), CSS utilizando [PostCSS](http://postcss.org), e HTML utilizando [PostHTML](https://github.com/posthtml/posthtml). Parcel utilizará esses conversores automaticamente se ele encontrar um arquivo de configuração em um módulo (por exemplo, `.babelrc` e `.postcssrc`).

Isso funciona mesmo em módulos externos (`node_modules`): se um arquivo de configuração é publicado como parte da distribuição do pacote, a conversão é feita automaticamente apenas para aquele módulo. Isso mantém o empacotamento rápido, já que apenas os módulos que precisam ser convertidos são processados. Isso também significa que você não precisa configurar manualmente as conversões para incluir e excluir determinados arquivos, ou saber como o código de outra pessoa foi criado para usá-lo em sua aplicação.

## Babel

[Babel](https://babeljs.io) é o conversor de JavaScript mais popular que conta com um grande ecossistema de plugins. Usar o Babel com o Parcel funciona da mesma maneira que utilizá-lo sozinho ou com outros empacotadores.

Instale as predefinições e plugins na sua aplicação:

```bash
yarn add babel-preset-env
```

Crie o arquivo `.babelrc`:

```json
{
  "presets": ["env"]
}
```

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

## PostHTML

[PostHTML](https://github.com/posthtml/posthtml) é uma ferramenta para converter HTML com o auxílio de plugins. Você pode configurar o PostHTML com Parcel criando um arquivo de configuração usando um desses nomes: `.posthtmlrc` (JSON),` posthtmlrc.js` ou `posthtml.config.js`.

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
