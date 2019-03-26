# Pug

_Extensões suportadas: `jade`, `pug`_

Preparar o Pug é fácil. Você pode ter qualquer estrutura de arquivo, aqui é fornecido vários exemplos simples como um ponto de referência.

## Exemplo 1 - Apenas index.pug

Vamos assumir esta estrutura de arquivos:

```bash
.
├── package.json
└── src
    └── index.pug
```

Nós podemos ter isso em execução utilizando este comando do Parcel: `parcel src/index.pug`.

## Exemplo 2 - index.pug, index.js and style.css

Vamos assumir esta estrutura de arquivos:

```bash
.
├── package.json
└── src
    ├── index.js
    ├── index.pug
    └── style.css
```

Dentro do index.pug, apenas carregue as folhas de estilos e o JS como de costume.

```pug
// index.pug

doctype html
html(lang="")
  head
    // ...
    link(rel="stylesheet", href="index.css")
  body
    h1 Hello

    script(src="index.js")
```

Se estiver utilizando Stylys, Sass ou LESS, você pode executar da mesma forma. Se preferir, você pode importar seu arquivo de estilo diretamente em seu arquivo JS.

Nós podemos ter isso em execução utilizando este comando do Parcel: `parcel src/index.pug`.

## Exemplo 3 - Pug with locals

Vamos assumir esta estrutura de arquivos:

```bash
.
├── package.json
└── src
    ├── index.pug
    └── pug.config.js
```

Nós precisamos exportar um objeto `locals` de um arquivo `pug.config.js`. O arquivo `pug.config.js` precisa estar no diretório do arquivo `index.pug` OU, em um diretório contendndo o arquivo `package.json`. O arquivo `pug.config.js` não precisa ser importado dentro de um arquivo js explicitamente. Esta **É** única maneira de ter um objeto `locals` disponível para seus templates Pug.

```js
// pug.config.js

module.exports = {
  locals: {
    hello: "world"
  }
};
```

```pug
// index.pug

doctype html
html(lang="")
  head
    // ...
  body
    h1 #{hello}
```

Nós podemos ter isso em execução utilizando este comando do Parcel: `parcel src/index.pug`.

### Cancelar e executar novamente o pacote após a atualização de objetos locais

Você não será capaz de ver as alterações feitas no seu objeto `locals` em tempo real. Se você atualizar o seu objeto `locals`, você precisará cancelar o processo do Parcel em seu terminal e executar novamente `parcel src/index.pug`.

### Veja nossos erros silenciosos

Além disso, entenda que se você usar essa instalação locals, você não receberá um erro se você usar uma propriedade que não existe para interpolação no seu Pug. Assim, se escrevemos `h1 #{thing}` e não havia nenhuma propriedade `thing` em locals, então o Parcel não vai falhar, nem relatar um erro. Você só será deixado com um resultado vazio no navegador. Portanto, tenha cuidado para obter esse direito, ou você pode não saber que um elemento interpolado não está funcionando.

### Apenas três opções de nomeação de arquivo

Você pode usar um arquivo `.pugrc` ou `.pugrc.js` em vez de `pug.config.js`. Mas estas são as únicas 3 variações que funcionarão para a criação de locals.

### Não é possível usar instruções de importação no arquivo `pug.config.js`

Se você quiser importar outros arquivos para o arquivo `pug.config.js` você deve usar instruções require.

Isto irá funcionar:

```js
// pug.config.js

const data = require("./data.js");

module.exports = {
  locals: {
    d: data
  }
};

```

Isto NÃO irá funcionar:

```js
import data from "./data.js";

module.exports = {
  locals: {
    d: data
  }
};
```

## Adicionando um script ao package.json

```json
"scripts": {
    "dev": "parcel src/index.pug",
    "devopen": "parcel src/index.pug --open 'google chrome'",
    "build": "parcel build src/index.pug"
  },
```

Nós podemos executar `npm run dev` ou `npm run devopen` para ter o projeto aberto no navegador. Nós podemos construir o projeto para produção com  `npm run build`.
