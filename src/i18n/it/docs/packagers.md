# 📦 Packagers

In Parcel, un `Packager` combina multipli `Assets` insieme in un bundle di output finale. Questo succede nel processo principale dopo che tutti gli asset sono stati processati, e un Albero dei Bundle é stato creato. I Packagers sono registrati sulla base del tipo di file, e gli assets che hanno generato quel tipo di output sono inviati al packagers per la creazione del file finale di output.

## Interfaccia del Packager

```javascript
const { Packager } = require('parcel-bundler')

class MioPackager extends Packager {
  async start() {
    // facoltativo. scrive il file header se richiesto.
    await this.dest.write(header)
  }

  async addAsset(asset) {
    // obbligatorio. scrive l'asset nel file output
    await this.dest.write(asset.generated.foo)
  }

  async end() {
    // facoltativo. scrive il file trailer se richiesto.
    await this.dest.end(trailer)
  }
}
```

## Impostare un Packager

Puoi impostare il tuo packager con un bundler usando il metodo `addPackager`. Accetta un tipo di file da impostare, e il percorso al tuo modulo packager.

```javascript
const Bundler = require('parcel-bundler')

let bundler = new Bundler('input.js')
bundler.addPackager('foo', require.resolve('./MioPackager'))
```
