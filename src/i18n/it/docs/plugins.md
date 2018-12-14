# 🔌 Plugins

Parcel adotta un approccio leggermente diverso da molti altri strumenti, in quanto molti formati comuni sono inclusi già pronti senza la necessità di installare e configurare plugin aggiuntivi. Tuttavia, ci sono casi in cui si potrebbe voler estendere Parcel in modo non standard, e in questo caso si può ricorrere ai plugins. I plugin installati vengono rilevati e caricati automaticamente in base alle dipendenze di `package.json`.

Quando si aggiunge il supporto per un nuovo formato di file a Parcel, si dovrebbe prima considerare quanto sia diffuso e quanto ne sia standardizzata l'implementazione. Se è sufficientemente diffuso e standard, il formato dovrebbe probabilmente essere aggiunto al core di Parcel piuttosto che come plugin che gli utenti possano installare. In caso di dubbi, [GitHub](https://github.com/parcel-bundler/parcel/issues) è il posto giusto per discuterne.

## Plugin API

I plugin per Parcel sono molto semplici. Sono semplicemente moduli che esportano una singola funzione, che viene richiamata automaticamente da Parcel durante l'inizializzazione. La funzione riceve come input l'oggetto `Bundler` e può fare configurazioni come l'impostazione o l'aggiunta dei tipi di asset e dei Packagers.

```javascript
module.exports = function(bundler) {
  bundler.addAssetType('ext', require.resolve('./MioAsset'))
  bundler.addPackager('foo', require.resolve('./MioPackager'))
}
```

Puoi pubblicare questo pacchetto su npm usando il prefisso `parcel-plugin-``, e sarà automaticamente rilevato e caricato come descritto di seguito.

## Utilizzare i Plugins

Utilizzare i plugin in Parcel non potrebbe essere più semplice. Tutto quello che dovete fare è installarli e salvarli nel vostro `package.json`. I plugin dovrebbero essere nominati con il prefisso `parcel-plugin-`, ad esempio `parcel-plugin-foo`. Tutte le dipendenze elencate in `package.json` con questo prefisso verranno caricate automaticamente durante l'inizializzazione.
