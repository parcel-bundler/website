# 📔 Resolução de Módulo

O resolvedor do Parcel implementa uma versão modificada do algoritmo de [resolução do node_modules](https://nodejs.org/api/modules.html#modules_all_together).

## Resolução de Módulo

Além do algorimo padrão, todos os [tipos de recursos suportados pelo Parcel](https://parceljs.org/assets.html) são resolvidos também.

A resolução de módulo pode ser relativa a:

- **raiz do projeto**: o diretório do *entrypoint* especificado para o Parcel, ou a raiz compartilhada (diretório pai em comum) quando múltiplos _entrypoints_ são especificados.
- **raiz do pacote**: o diretório mais próximo da raiz do pacote em `node_modules`.

### Caminhos Absolutos

`/foo` irá resolver `foo` relativo à **raiz do projeto**.

### ~ Caminhos com til

`~/foo` irá resolver `foo` em relação à **raiz do pacote** mais próxima ou, se não for encontrada, a **raiz do projeto**.

### Caminho de arquivos Glob

Globs são importações curingas que agrupam vários recursos de uma só vez. Globs podem combinar alguns ou todos os arquivos (`/assets/*.png`), bem como arquivos em vários diretórios (`/assets/**/*`)

Este exemplo empacota um diretório de arquivos png e retorna as URLs de produção.

```javascript
import foo from "/assets/*.png";
// {
//   'file-1': '/file-1.8e73c985.png',
//   'file-2': '/file-1.8e73c985.png'
// }
```

### Campo `browser` no package.json

Se um pacote incluir o [campo `package.browser`](https://docs.npmjs.com/files/package.json#browser), o Parcel irá utilizá-lo ao invés da entrada `package.main`.

### Acrônimos

Os acrônimos são suportados através do campo `alias` no `package.json`.

Este exemplo utiliza `react` como `preact` e outros módulos locais que não estão em `node_modules`.

```json
// package.json
{
  "name": "some-package",
  "devDependencies": {
    "parcel-bundler": "^1.7.0"
  },
  "alias": {
    "react": "preact-compat",
    "react-dom": "preact-compat",
    "local-module": "./custom/modules"
  }
}
```

Evite utilizar quaisquer caracteres especiais em seus acrônimos, alguns podem ser usados pelo Parcel e outros por ferramentas de terceiros ou extensões. Por exemplo:

- `~` usado pelo Parcel para resolver [caminhos com til](#~-caminhos-com-til).
- `@` usado pelo npm para resolver organizações npm.

Recomendamos ser explícito ao definir seus acrônimos, então por favor **especifique extensões**, caso contrário o Parcel terá de adivinhar. Consulte [exportações denominadas com Javascript](#exportações-denominadas-com-javascript) para um exemplo disso.

## Problemas comuns

### Exportações denominadas com Javascript

Os mapeamentos de acrônimos se aplicam a muitos tipos de recursos e não oferecem suporte especificamente ao mapeamento de exportações denominadas com Javascript. Se você deseja mapear js chamado _exports_ você pode fazer isso:

```json
// package.json
{
  "name": "some-package",
  "alias": {
    "ipcRenderer": "./electron-ipc.js" // especificando a extensão do arquivo
  }
}
```

e re-exportando a exportação nomeada dentro do arquivo com acrônimo:

```js
// electron-ipc.js
module.exports = require('electron').ipcRenderer
```

### Flow via Resolução Absoluta ou Til

Flow precisará saber sobre a resolução de módulos para o uso de caminhos absolutos ou caminhos til. Utilizando o recurso [module.name_mapper](https://flow.org/en/docs/config/options/#toc-module-name-mapper-regex-string) do Flow, nós podemos:

> Especificar uma expressão regular para corresponder aos nomes dos módulos, bem como um padrão de substituição

Dado um projeto com essa estrutura:

```
package.json
.flowconfig
src/
  index.html
  index.js
  components/
    apple.js
    banana.js
```

E `src/index.html` como um *entrypoint*, a **raíz do projeto** (*project root*) é o diretório `src/`.

Portanto, para mapear essa importação corretamente:

```javascript
// index.js
import Apple from '/components/apple'
// na verdade queremos que o Flux procure:
// import Apple from 'src/components/apple';
```

nós podemos usar essa configuração no arquivo `.flowconfig` para mapear o caminho absoluto (o direcionamento de `/`) para `src/`:

```ini
[options]
module.name_mapper='^\/\(.*\)$' -> '<PROJECT_ROOT>/src/\1'
```

Nota: `module.name_mapper` pode ter várias entradas se você desejar suportar acrônimo de módulo local.

### Resolução ~ TypeScript

TypeScript terá de saber sobre o seu uso da resolução de módulo com `~` ou mapeamentos de acrônimos. Por favor, consulte a [documentação de resolução do módulo do TypeScript](https://www.typescriptlang.org/docs/handbook/module-resolution.html) para mais informações.

```json
// tsconfig.json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "~*": ["./src/*"]
    }
  }
}
```

### Resolução _Monorepo_

Estes são os usos aconselhados com _monorepos_ até o momento:

Uso recomendado:

- use caminhos relativos.
- use `/` para o caminho raíz, se a raíz for requerida.

Uso não recomentado:

- **evite** utilizar `~` com _monorepos_.

Se você é um usuário _monorepo_ e gostaria de contribuir com essas recomendações, por favor, forneça repositórios de exemplo ao abrir _issues_ para apoiar a discussão.
