# 📦 Empacotadores

No Parcel, um `Packager` combina múltiplos `Asset`s juntos em um pacote de saída final. Isso acontece no processo principal depois que todos os recursos foram processados ​​e a árvore de pacotes foi criada. Os `packagers` são registrados com base no tipo de arquivo de saída, e os recursos que geraram esse tipo de saída são enviados para esse pacote para a produção do arquivo de saída final.

## Interface Packager

```javascript
const { Packager } = require('parcel-bundler')

class MyPackager extends Packager {
  async start() {
    // opcional. escreve no cabeçalho do arquivo, caso necessário.
    await this.dest.write(header)
  }

  async addAsset(asset) {
    // obrigatório. escreve o recurso no arquivo de saída.
    await this.dest.write(asset.generated.foo)
  }

  async end() {
    // opcional. escreve o trailer do arquivo, caso necessário.
    await this.dest.end(trailer)
  }
}

module.exports = MyPackager
```

## Registrando um Packager

Você pode registrar seu Packager com um bundler usando o método `addPackager`. Ele aceita um tipo de arquivo para se registrar e o caminho para seu módulo de pacote.

```javascript
const Bundler = require('parcel-bundler')

let bundler = new Bundler('input.js')
bundler.addPackager('foo', require.resolve('./MyPackager'))
```
