# ✨ Produção

Quando chegar a hora de enviar sua aplicação para produção, você pode usar o modo de produção do Parcel.

```bash
parcel build entry.js
```

Isso desabilita o `watch` e o `hmr` para que o código só seja compilado uma vez. Ele também habilita o minifier para todos os arquivos de saída para reduzir o tamanho dos arquivos. Os minifiers utilizados pelo Parcel são [terser](https://github.com/fabiosantoscode/terser) para JavaScript, [cssnano](http://cssnano.co) para CSS e [htmlnano](https://github.com/posthtml/htmlnano) para HTML.

Ativando o modo de produção também define a variável de ambiente `NODE_ENV=production`. As bibliotecas mais conhecidas, como React, possuem recursos de depuração apenas para desenvolvimento, que são desativados ao definir esta variável de ambiente, o que resulta em compilações menores e mais rápidas para produção.

### Opções

#### Definir o diretório de saída

Padrão: "dist"

```bash
parcel build entry.js --out-dir build/output
ou
parcel build entry.js -d build/output
```

```base
root
- build
- - output
- - - entry.js
```

#### Definir o endereço público para servir os arquivos

Padrão: --out-dir option

```bash
parcel build entry.js --public-url ./
```

Será convertido para:

```html
<link rel="stylesheet" type="text/css" href="1a2b3c4d.css">
ou
<script src="e5f6g7h8.js"></script>
```

#### Desabilitar a minificação

Padrão: minificação habilitada

```bash
parcel build entry.js --no-minify
```

#### Desabilitar o cache do sistema de arquivos

Padrão: cache habilitado

```bash
parcel build entry.js --no-cache
```
