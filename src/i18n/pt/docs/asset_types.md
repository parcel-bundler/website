# 📝 Tipos de Recursos

Conforme descrito na [documentação dos Recursos](assets.html), o Parcel identifica cada arquivo de entrada como um `Asset` (Interface). Os tipos de recursos são representados como classes que herdam da classe básica 'Asset` e implementam a interface necessária para analisar dependências, converter e gerar código.

Como o Parcel processa recursos em paralelo através de vários núcleos do processador, as conversões que os tipos de recursos podem executar são limitadas às que operam em um único arquivo de cada vez. Para conversões em vários arquivos, um [Empacotador](packagers.html) personalizado pode ser utilizado.

## Interface Asset

```javascript
const { Asset } = require('parcel-bundler')

class MyAsset extends Asset {
  type = 'foo' // define o tipo de saída principal.

  async parse(code) {
    // analisar o código em um AST
    return ast
  }

  async pretransform() {
    // opcional. converte antes de coletar as dependências
  }

  collectDependencies() {
    // analisa as dependências
    this.addDependency('my-dep')
  }

  async transform() {
    // opcional. converte após coletar as dependências.
  }

  async generate() {
    // geração do código. você pode retornar múltiplas interpretações, caso necessário.
    // os resultados são passados para os empacotadores apropriados para gerar o pacote final.
    return [
      {
        type: 'foo',
        value: 'my stuff here' // saída principal
      },
      {
        type: 'js',
        value: 'some javascript', // rendição alternativa a ser colocada no pacote JS, caso necessário
        sourceMap
      }
    ]
  }

  async postProcess(generated) {
    // Processo após toda a geração de código estar concluída
    // Pode ser utilizada para combinar múltiplos tipos de recursos
  }
}

module.exports = MyAsset
```

## Registrando um Tipo de Recurso

Você pode registrar seu tipo de recurso com um empacotador usando o método `addAssetType`. Ele aceita uma extensão de arquivo para se registrar e o caminho para seu módulo do tipo de recurso. É apenas um caminho e não o objeto real, para que ele possa ser enviado para os processos.

```javascript
const Bundler = require('parcel-bundler')

let bundler = new Bundler('input.js')
bundler.addAssetType('.ext', require.resolve('./MyAsset'))
```
