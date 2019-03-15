# 🖥 CLI

## Comandos

### Servir

Inicia um servidor de desenvolvimento, que recriará automaticamente seu aplicativo ao alterar os arquivos e oferece suporte à [_hot module replacement_](hmr.html) para desenvolvimento rápido.

```bash
parcel index.html
```

Você também pode passar um [glob](https://github.com/isaacs/node-glob) ou uma lista de globs para múltiplos arquivos de entrada.

```bash
parcel one.html two.html
# OU
parcel *.html
# OU
parcel ./**/*.html
```

### Construir

Constrói os recursos uma vez, ele também habilita minificação e define a variável de ambiente `NODE_ENV=production`. Veja [Produção](production.html) para mais detalhes.

```bash
parcel build index.html
```

_NOTA:_ Para casos de uso especiais, é possível realizar um único build do ambiente de `development`, dessa forma:

```
NODE_ENV=development parcel build <entrypoint> --no-minify
```

Isto irá criar os mesmos bundles e então serví-los, mas não irá assistir ou servir os recursos.

### _Watch_

O comando `watch` é similar ao `server`, com a principal diferença sendo a de não iniciar um servidor.

```bash
parcel watch index.html
```

### Ajuda

Exibe todas as possíveis opções do cliente

```bash
parcel help
```

### Versão

Exibe o número de versão do Parcel

```bash
parcel --version
```

## Opções

### Diretório de Saída

Padrão: "dist"

Disponível em: `serve`, `watch`, `build`

```bash
parcel build entry.js --out-dir build/output
# ou
parcel build entry.js -d build/output
```

```base
root
- build
- - output
- - - entry.js
```

### Define a URL pública para servir

Padrão: "/"

Disponível em: `serve`, `watch`, `build`

```bash
parcel entry.js --public-url ./dist/
```

irá gerar:

```html
<link rel="stylesheet" type="text/css" href="/dist/entry.1a2b3c.css">
<!-- or -->
<script src="/dist/entry.e5f6g7.js"></script>
```

### Alvo

Padrão: browser

Disponível em: `serve`, `watch`, `build`

```bash
parcel build entry.js --target node
```

⚠️ Alvos `node` e `electron` não irá empacotar as `dependencies` do package.json (mas irá incluir as `devDependencies`). Este comportamento pode ser substituído utilziando a flag [--bundle-node-modules](#forçando-agrupamento-de-módulos-node) (veja abaixo).

Possíveis alvos: `node`, `browser`, `electron`

### Forçando agrupamento de módulos Node

Padrão: false

Disponível em: `serve`, `watch`, `build`

```bash
parcel build entry.js --target node --bundle-node-modules
```

Por padrão, as `dependencies` do package.json não são incluídas ao utilizar `--target node` ou `--target electron`. Esta flag irá adicioná-las para o pacote.

### Diretório de cache

Padrão: ".cache"

Disponível em: `serve`, `watch`, `build`

```bash
parcel build entry.js --cache-dir build/cache
```

### Porta

Padrão: 1234

Disponível em: `serve`

```bash
parcel serve entry.js --port 1111
```

### Alterar o nível de Log

Padrão: 3

Disponível em: `serve`, `watch`, `build`

```bash
parcel entry.js --log-level 1
```

| Nível | Efeito         |
| ----- | -------------- |
| 0     | Desabilitado   |
| 1     | Somente erros  |
| 2     | Erros e Avisos |
| 3     | Tudo           |
| 4     | Verboso (irá manter tudo logado com timestamps <br> e também irá logar requisições http realizadas ao servidor de desenvolvimento) |
| 5     | Debug (irá salvar tudo em um arquivo com timestamps) |

### Hostname HMR

Padrão: `location.hostname` da janela atual

Disponível em: `serve`, `watch`

```bash
parcel entry.js --hmr-hostname parceljs.org
```

### Porta HMR

Padrão: uma porta qualquer disponível

Disponível em: `serve`, `watch`

```bash
parcel entry.js --hmr-port 8080
```

### Nome do arquivo de saída

Padrão: nome original do arquivo

Disponível em: `serve`, `watch`, `build`

```bash
parcel build entry.js --out-file output.html
```

Isso altera o nome de arquivo de saída no _entrypoint_ do pacote

### Exibir um _report_ detalhado

Padrão: _report_ mínimo

Disponível em: `build`

```bash
parcel build entry.js --detailed-report
```

### Habilitar https

Padrão: https desabilitado

Disponível em: `serve`, `watch` (listen on HTTPS for HMR connections)

```bash
parcel build entry.js --https
```

⚠️ Esta _flag_ gera um certificado auto-assinado, você pode ter que configurar seu navegador para permitir certificados auto-assinado para localhost.

### Definir um certificado customizado

Padrão: https desabilitado

Disponível em: `serve`, `watch`

```bash
parcel entry.js --cert certificate.cert --key private.key
```

### Abrir no Navegador

Padrão: abrir no navegador desabilitado

Disponível em: `serve`

```bash
parcel entry.js --open
```

### Desabilitado source-maps

Padrão: source-maps habilitados

Disponível em: `serve`, `watch`, `build`

```bash
parcel build entry.js --no-source-maps
```

### Desabilitar hashing de conteúdo

Padrão: content-hash habilitado

Disponível em: `build`

```bash
parcel build entry.js --no-content-hash
```

### Desabilitar autoinstall

Padrão: autoinstall habilitado

Disponível em: `serve`, `watch`

```bash
parcel entry.js --no-autoinstall
```

### Desabilitar HMR

Padrão: HMR habilitado

Disponível em: `serve`, `watch`

```bash
parcel entry.js --no-hmr
```

### Desabilitar minificação

Padrão: minification habilitado

Disponível em: `build`

```bash
parcel build entry.js --no-minify
```

### Desabilitar o cache no sistema de arquivos

Padrão: cache habilitado

Disponível em: `serve`, `watch`, `build`

```bash
parcel build entry.js --no-cache
```

### Export módulos como UMD

Padrão: desabilitado

Disponível em: `serve`, `watch`, `build`

```bash
parcel serve entry.js --global myvariable
```

### Habilitar suporte experimental ao scope hoisting/tree shaking

Padrão: desabilitado

Disponível em: `build`

```bash
parcel build entry.js --experimental-scope-hoisting
```

Para obter mais informações, consulte a [sessão _Tree Shaking_](https://medium.com/@devongovett/parcel-v1-9-0-tree-shaking-2x-faster-watcher-and-more-87f2e1a70f79#4ed3) no post de Devon Govett no pacote 1,9.
