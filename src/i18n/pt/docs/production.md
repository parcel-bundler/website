# ✨ Produção

Quando chegar a hora de enviar sua aplicação para produção, você pode usar o modo de produção do Parcel.

```bash
parcel build entry.js
```

## Otimizações

Isso desabilita o `watch` e o `hmr` para que o código só seja compilado uma vez. Ele também habilita o minifier para todos os arquivos de saída para reduzir o tamanho dos arquivos. Os minifiers utilizados pelo Parcel são [terser](https://github.com/fabiosantoscode/terser) para JavaScript, [cssnano](http://cssnano.co) para CSS e [htmlnano](https://github.com/posthtml/htmlnano) para HTML.

Ativando o modo de produção também define a variável de ambiente `NODE_ENV=production`. As bibliotecas mais conhecidas, como React, possuem recursos de depuração apenas para desenvolvimento, que são desativados ao definir esta variável de ambiente, o que resulta em compilações menores e mais rápidas para produção.

Para aproveitar o mesmo tipo de recursos de depuração somente de desenvolvimento, certifique-se de que a [opção `dead_code` do teaser](https://github.com/terser-js/terser#compress-options) esteja habilitada (está por padrão) e encapsula qualquer depuração somente de desenvolvimento em uma verificação condicional assim:

```js
if (process.env.NODE_ENV === 'development') { // Ou, `process.env.NODE_ENV !== 'production'`
  // Irá executar somente em desenvolvimento e ignorado do build de produção.
}
```

## Estratégia de nomeação de arquivos

Para permitir a configuração de regras de cache muito agressivas para o seu CDN, para o melhor desempenho e eficiência, o Parcel faz hashes dos nomes dos arquivos da maioria dos bundles (se o bundle deve ter um nome legível/lembrável ou não, principalmente para SEO).

O Parcel segue a tabela a seguir, quando se trata de nomear os pacotes (entrypoints nunca são em hasheados).

|                        Tipo de Bundle | Tipo               | Conteúdo hasheado |
| ------------------------------------: | ------------------ | :----------------: |
|                              Qualquer | Entrypoint         |         ❌         |
|                            JavaScript | `<script>`         |         ✅        |
|                            JavaScript | Dynamic import     |         ❌         |
|                            JavaScript | Service worker     |         ❌         |
|                                  HTML | iframe             |         ❌         |
|                                  HTML | anchor link        |         ❌         |
| Raw (Imagens, arquivos de texto, ...) | Import/Require/... |         ✅        |

O hash do arquivo segue o seguinte padrão de nomeação: `<nome do diretório>-<hash>.<extensão>`.

## Armadilhas cross platform

Em um esforço para otimizar o desempenho de compilação de produção, o Parcel tentará determinar o número de CPUs disponíveis na máquina que executa o comando de compilação para que ele possa distribuir o trabalho de acordo. Para isso, a Parcel conta com o módulo [physical-cpu-count](https://www.npmjs.com/package/physical-cpu-count).

Esteja ciente que este módulo supõe que você tem o programa [`lscpu`](http://manpages.courier-mta.org/htmlman1/lscpu.1.html) disponível no seu sistema.

## Usando um CI

Se você deseja integrar o Parcel no seu sistema de integração contínua (por exemplo, Travis ou Circle CI), talvez seja necessário instalar o Parcel como uma dependência local.

As instruções podem ser [encontradas aqui](getting_started.html#adicionando-parcel-ao-seu-projeto).
