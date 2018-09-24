# 🌳 Variáveis de Ambiente

Parcel faz uso do [dotenv](https://github.com/motdotla/dotenv) para suportar o carregamento de variáveis de ambiente de arquivos `.env`.

Arquivos `.env` devem ser armazenados junto com o `package.json` que contém sua dependência para o `parcel-bundler`.

Parcel carrega arquivos `.env` com esses nomes especificos para os valores de `NODE_ENV` seguintes:

| Nome de arquivos `.env` válidos   | `NODE_ENV=\*` | `NODE_ENV=test` |
| --------------------------------- | ------------- | --------------- |
| `.env`                            | ✔️           | ✔️              |
| `.env.local`                      | ✔️           | ✖️              |
| `.env.${NODE_ENV}`                | ✔️           | ✔️              |
| `.env.${NODE_ENV}.local`          | ✔️           | ✔️              |

Notavelmente:

- `NODE_ENV` padrão para `development`.
- `.env.local` não é carregado quando `NODE_ENV=test` desde que [os testes devem produzir os mesmos resultados para todos](https://github.com/parcel-bundler/parcel/blob/28df546a2249b6aac1e529dd629f506ba6b0a4bb/src/utils/env.js#L9)
