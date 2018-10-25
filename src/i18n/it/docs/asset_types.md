# 📝 Tipi di Asset

Come descritto nella [Documentazione degli Assets](assets.html), Parcel rappresenta ogni file come un `Asset`. I Tipi di Asset sono rappresentati come classi che ereditano da una classe base `Asset` e implementano l'interfaccia richiesta per effettuare il parse, analizzare le dipendenze, convertire, trasformare e generare il codice.

Parcel elabora le risorse in parallelo su più core di elaborazione e le trasformazioni che i tipi di risorse possono eseguire sono limitate a quelle che operano su un singolo file alla volta. Per utilizzare la conversione su più file, è possibile utilizzare un [Packager](packagers.html) personalizzato.

## Interfaccia degli Asset

```javascript
const { Asset } = require('parcel-bundler')

class MyAsset extends Asset {
  type = 'foo' // imposta il tipo principale di output.

  async parse(code) {
    // Parsing del codice su un AST
    return ast
  }

  async pretransform() {
    // facoltativo. converti prima di collezionare le dipendenze.
  }

  collectDependencies() {
    // analizza le dipendenze
    this.addDependency('my-dep')
  }

  async transform() {
    // facoltativo. trasforma dopo aver collezionato le dipendenze.
  }

  async generate() {
    // genera il codice. è possibile effettuare più esecuzioni, se necessario.
    // vengono passati agli appositi packagers per generare i bundle finali.
    return [
      {
        type: 'foo',
        value: 'my stuff here' // output principale
      },
      {
        type: 'js',
        value: 'some javascript', // esecuzione alternativa, da collocare in un bundle JS se necessario
        sourceMap
      }
    ]
  }

  async postProcess(generated) {
    // Processa dopo aver generato tutto il codice
    // Può essere utilizzato per combinare più tipi di Assets
  }
}
```

## Crea un Tipo di Asset

Si può impostare il proprio tipo di Asset con un bundle usando il metodo "addAssetType". Accetta un'estensione di file per la creazione e il percorso del modulo del tipo di Asset. È in forma di percorso, invece che puntare all'oggetto reale, in modo che possa essere passato ai worker process.

```javascript
const Bundler = require('parcel-bundler')

let bundler = new Bundler('input.js')
bundler.addAssetType('.ext', require.resolve('./MioAsset'))
```
