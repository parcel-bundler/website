# 📔 Resolução de Módulo

Parcel (v.1.7.0 e superior) suporta estratégias de múltilplas resoluções de módulo fora da caixa, para que você não tenha que lidar com caminhos relativos infinitos `../../`.

Termos Notáveis:

- **raiz do projeto**: o diretório do _entrypoint_ especificado para o Parcel, ou a raiz compartilhada (diretório pai em comum) quando múltiplos _entrypoints_ são especificados.
- **raiz do pacote**: o diretório mais próximo da raiz do pacote em `node_modules`.

## Caminhos Absolutos

`/foo` irá resolver `foo` relativo à **raiz do projeto**.

## ~ Caminhos com til

`~/foo` irá resolver `foo` em relação à **raiz do pacote** mais próxima ou, se não for encontrada, a **raiz do projeto**.

## Acrônimos

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

## Outras Condições

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
