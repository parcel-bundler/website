# 📦 Recursos

Parcel é baseado em recursos. Um recurso pode ser qualquer arquivo, mas o Parcel tem suporte especial para alguns tipos de arquivos como JavaScript, CSS e HTML. O Parcel analisa automaticamente as dependências referenciadas nesses arquivos e os inclui no arquivo de saída. Tipos de recursos similares são agrupados no mesmo arquivo de saída. Se você importar um tipo de recurso diferente (por exemplo, se você importar um arquivo CSS a partir de um arquivo JS), ele inicia a construção de um segundo arquivo e adiciona uma referência no arquivo de saída principal. Isso será demonstrado nas próxima sessões.

## JavaScript

O tipo de arquivo mais utilizado pelos empacotadores é o JavaScript. Parcel suporta tanto CommonJS como módulos ES6 para importar os arquivos. Ele também suporta a função `import()` para carregar os módulos de forma assíncrona, o qual será discutido na sessão [separação do código](code_splitting.html).

```javascript
// Importar um módulo utilizando CommonJS
const dep = require('./path/to/dep');

// Importar um módulo utilizando ES6
import dep from './path/to/dep';
```

Você também pode importar outros tipos de recursos que não sejam arquivos JavaScript, como um arquivo CSS ou mesmo uma imagem. Quando você importar um desses tipos de arquivos, eles não serão incluídos no arquivo principal assim como é feito com os outros empacotadores. Na verdade, eles serão adicionados em arquivos separados (por exemplo, um arquivo CSS) junto com suas dependências. Quando você utilizar [CSS Modules](https://github.com/css-modules/css-modules), as classes exportadas são adicionadas no arquivo de saída JavaScript. Outros tipos de recursos exportam a referência no arquivo de saída JavaScript para que você possa referenciar no seu código.

```javascript
// Importar um arquivo CSS
import './test.css';

// Importar um arquivo CSS com CSS modules
import classNames from './test.css';

// Importar o endereço de uma imagem
import imageURL from './test.png';
```

Caso você queira adicionar um arquivo dentro do arquivo de saída JavaScript, ao invés de referenciar o endereço, você pode utilizar a API `fs.readFileSync` do Node.js para fazer isso. O endereço precisa ser estaticamente analisado, ou seja, ele não pode conter variáveis (diferente de `__dirname` e `__filename`).

```javascript
import fs from 'fs';

// Ler o conteúdo como uma string
const string = fs.readFileSync(__dirname + '/test.txt', 'utf8');

// Ler o coteúdo como um Buffer
const buffer = fs.readFileSync(__dirname + '/test.png');
```

## CSS

Os arquivos CSS podem ser importados a partir de um arquivo JavaScript ou HTML e podem conter referências de dependências utilizando `@import` assim como referências para imagens, fontes e etc, através da função `url()`. Outros arquivos CSS que forem importados utilizando `import()` serão adicionados no mesmo arquivo, e referências utilizando `url()` serão reescritas em seus respectivos nomes. Todos os nomes de arquivos precisam ser relativos ao arquivo CSS principal.

```css
/* Importar outro arquivo CSS */
@import './other.css';

.test {
  /* Referenciar um arquivo de imagem */
  background: url('./images/background.png');
}
```

Além de somente CSS, outras linguagens que transpilam para ele, como LESS, SASS e Stylus, também são suportadas e funcionam da mesma maneira.

## SCSS

Para utilizar SCSS é necessário utilizar o módulo `sass`. Para instalar, utilize o npm:

```bash
npm install sass
```

Assim que você tiver o `sass` instalado, você já pode importar os arquivos SCSS no seu arquivo JavaScript.

```javascript
import './custom.scss'
```

As dependências nos arquivos SCSS podem utilizar `@import()`.

## HTML

Arquivos HTML são frequentemente utilizados como ponto de entrada para o Parcel, mas também podem ser referenciados pelos arquivos JavaScript, por exemplo, para fornecer links para outras páginas. Os endereços dos scripts, estilos, mídias e outros arquivos HTML são extraídos e compilados como descrito acima. As referências são reescritas no HTML para que elas sejam referenciadas corretamente. Todos os nomes dos arquivos devem ser relativos ao arquivo HTML principal.

```html
<html>
<body>
  <!-- Referenciar uma imagem -->
  <img src="./images/header.png">

  <a href="./other.html">Link para outra página</a>

  <!-- Importar o arquivo de saída JavaScript -->
  <script src="./index.js"></script>
</body>
</html>
```

## Recursos suportados por Padrão

| Tipo de Recurso                | Extensões Associadas             |
| ------------------------------ | -------------------------------- |
| JavaScript                     | `js`, `jsx`, `es6`, `jsm`, `mjs` |
| ReasonML                       | `ml`,`re`                        |
| TypeScript                     | `ts`, `tsx`                      |
| CoffeeScript                   | `coffee`                         |
| Vue                            | `vue`                            |
| JSON                           | `json`, `json5`                  |
| YAML                           | `yaml`, `yml`                    |
| TOML                           | `toml`                           |
| GraphQL                        | `gql`, `graphql`                 |
| CSS                            | `css`, `pcss`, `postcss`         |
| Stylus                         | `stylus`                         |
| LESS                           | `less`                           |
| SASS                           | `sass`, `scss`                   |
| HTML                           | `htm`, `html`                    |
| Rust                           | `rs`                             |
| WebManifest                    | `webmanifest`                    |
| OpenGL Shading Language (GLSL) | `glsl`, `vert`, `frag`           |
| Pug                            | `jade`, `pug`                    |

<sub>\* A documentação pode ficar desatualizada algumas vezes, para ver os tipos de recursos suportados atualmente veja [parcel/src/Parser.js](https://github.com/parcel-bundler/parcel/blob/28df546a2249b6aac1e529dd629f506ba6b0a4bb/src/Parser.js#L10). Para a lista atual de <i>parsers</i> veja [parcel/src/assets/](https://github.com/parcel-bundler/parcel/tree/master/src/assets).</sub>

Para qualquer tipo de recurso não suportado por padrão, você pode verificar se já existe plugins disponíveis:

- [Yarn](https://yarnpkg.com/en/packages?q=parcel-plugin-&p=1)
- [npm](https://www.npmjs.com/search?q=parcel-plugin-)
- [awesome-parcel](https://github.com/parcel-bundler/awesome-parcel#plugins)

ou [criar o seu próprio plugin](https://parceljs.org/plugins.html).