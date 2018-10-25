# Javascript

_Extensões suportadas: `js`, `jsx`, `es6`, `jsm`, `mjs`_

O tipo de arquivo mais utilizado pelos empacotadores é o JavaScript. Parcel suporta tanto CommonJS como módulos ES6 para importar os arquivos. Ele também suporta a função `import()` para carregar os módulos de forma assíncrona, o qual será discutido na sessão [separação do código](code_splitting.html).

```javascript
// Importar um módulo utilizando sintaxe CommonJS
const dep = require('./path/to/dep')

// Importar um módulo utilizando sintaxe ES6
import dep from './path/to/dep'
```

Você também pode importar outros tipos de recursos que não sejam arquivos JavaScript, como um arquivo CSS ou mesmo uma imagem. Quando você importar um desses tipos de arquivos, eles não serão incluídos no arquivo principal assim como é feito com os outros empacotadores. Na verdade, eles serão adicionados em arquivos separados (por exemplo, um arquivo CSS) junto com suas dependências. Quando você utilizar [CSS Modules](https://github.com/css-modules/css-modules), as classes exportadas são adicionadas no arquivo de saída JavaScript. Outros tipos de recursos exportam a referência no arquivo de saída JavaScript para que você possa referenciar no seu código.

```javascript
// Importando um arquivo CSS
import './test.css'

// Importando um arquivo CSS com CSS modules
import classNames from './test.css'

// Importando a URL de um arquivo de imagem
import imageURL from './test.png'

// Import um arquivo HTML
import('./some.html')
// ou:
import html from './some.html'
// ou:
require('./some.html')
```

Caso você queira adicionar um arquivo dentro do arquivo de saída JavaScript, ao invés de referenciar o endereço, você pode utilizar a API `fs.readFileSync` do Node.js para fazer isso. O endereço precisa ser estaticamente analisado, ou seja, ele não pode conter variáveis (diferente de `__dirname` e `__filename`).

```javascript
import fs from 'fs'

// Lendo o conteúdo como uma string
const string = fs.readFileSync(__dirname + '/test.txt', 'utf8')

// Lendo o coteúdo como um Buffer
const buffer = fs.readFileSync(__dirname + '/test.png')

// Convertendo o conteúdo do Buffer em uma imagem
;<img src={`data:image/png;base64,${buffer.toString('base64')}`} />
```

# Babel

[Babel](https://babeljs.io) é o conversor de JavaScript mais popular que conta com um grande ecossistema de plugins. Usar o Babel com o Parcel funciona da mesma maneira que utilizá-lo sozinho ou com outros empacotadores.

Instale as predefinições e plugins na sua aplicação:

```bash
yarn add @babel/preset-env
```

Crie o arquivo `.babelrc`:

```json
{
  "presets": ["@babel/preset-env"]
}
```

## Conversões padrões do Babel

Parcel transpila o seu código com `@babel/preset-env` por padrão, isto é para transpilar cada modulo interno (_local requires_) e externo (_node_modules_) para coincidir com destino definido.

Para o alvo `browser` é utilizado o [browserslist](https://github.com/browserslist/browserslist), o _browserlist_ alvo pode ser definido no `package.json` (`engines.browsers` ou `browserslist`) ou usando um arquivo de configuração (`browserslist` ou `.browserslistrc`).

O alvo padrão do _browserlist_ é: `> 0.25%` (Significando, suportar cada navegador que tenha 0,25% ou mais da quantidade total de usuários ativos da web)

Para o alvo `node`, Parcel utiliza o `engines.node` definido no `package.json`, este padrão para _node 8_.
