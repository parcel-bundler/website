# 📚 API

## Bundler

Invece di utilizzare la CLI, si può anche usare l'API per inizializzare un bundle, per i casi d'uso più avanzati (per esempio l'elaborazione personalizzata dopo ogni build).

Un esempio di "watch" con ogni opzione descritta:

```Javascript
const Bundler = require('parcel-bundler');
const Path = require('path');

// Definizione del file entry-point
const file = Path.join(__dirname, './index.html');

// Opzioni del Bundler
const options = {
  outDir: './dist', // La directory nella quale posizionare l'output del bundle, di default "dist"
  outFile: 'index.html', // Il nome dell' outputFile
  publicUrl: '/', // L'url del server, di default '/'
  watch: true, // Se effettuare o meno il watch dei file, di default la configurazione é process.env.NODE_ENV !== 'production'
  cache: true, // Attiva o disattiva la cache, di default true
  cacheDir: '.cache', // La directory nella quale la cache é salvata, di default é .cache
  minify: false, // Minifica i files, abilitata se process.env.NODE_ENV === 'production'
  target: 'browser', // browser/node/electron, di default é browser
  https: false, // Protocollo del server: https o http, di default é false
  logLevel: 3, // 3 = tutti i log, 2 = log di avvisi & errori, 1 = log degli errori
  hmrPort: 0, // La porta sulla quale gira l'hmr, di default é una porta casuale libera (0 in node.js restituisce una porta casuale libera)
  sourceMaps: true, // Attiva o disattiva le sourcemaps, di default é attivata (non sono ancora supportate nelle build minificate)
  hmrHostname: '', // Un hostname per l'hot module reload, di default é ''
  detailedReport: false // Restituisce un report dettagliato dei bundles, assets, dimensione dei file e timestamps, di default é false, i report vengono generati solo se il watch é disattivato
};

// Inizializza un bundle utilizzando la posizione dell'entry point e le opzioni fornite
const bundler = new Bundler(file, options);

// Esegue il bundle, questo restituisce il bundle principale
// Utilizza gli eventi se stai usando la modalità watch, perché questa promise si eseguirà solo una volta e non per ogni rebuild.
const bundle = await bundler.bundle();
```

### Events

Questo è un elenco di tutti gli eventi del bundler

- `bundled` viene richiamato una volta che Parcel ha terminato con successo il bundling, il [bundle](#bundle) principale viene passato come callback

```Javascript
const bundler = new Bundler(...);
bundler.on('bundled', (bundler) => {
  // contiene tutte le risorse e i bundler, vedi la documentazione ulteriori informazioni
});
```

- `buildEnd` viene chiamato dopo ogni compilazione, restituendo un alert anche se si è verificato un errore

```Javascript
const bundler = new Bundler(...);
bundler.on('buildEnd', () => {
  // Fai qualcosa...
});
```

### Bundle

Un "bundle" è ciò che Parcel usa per raggruppare le risorse, questo contiene anche bundle figli e fratelli per essere in grado di costruire un Albero dei bundle.

#### Proprietà

- `type`: Il tipo di assets che contiene (e.g. js, css, map, ...)
- `name`: Il nome del bundle (generato usando `Asset.generateBundleName()` di `entryAsset`)
- `parentBundle`: Il bundle genitore, é null nel caso non ne abbia
- `entryAsset`: L' entryPoint del bundle, usato per generarne il nome e collezionare gli assets
- `assets`: Un `Set` di tutti gli assets nel bundle
- `childBundles`: Un `Set` di tutti i bundle figli
- `siblingBundles`: Un `Set` di tutti i bundle fratelli
- `siblingBundlesMap`: Un `Map<String(Tipo: js, css, map, ...), Bundle>` di tutti i bundle figli
- `offsets`: Un `Map<Asset, numero(numero di linea nel bundle)>` di tutte le posizioni degli assets nel bundle, usato per generare sourcemaps accurate.

#### Tree

Il `Bundle` contiene un `parentBundle`, `childBunddles` e `siblingBundles`, tutte queste proprietà insieme costituiscono un modo veloce per iterare il Bundle Tree.

Un esempio molto semplice di un Asset Tree e di un Bundle Tree generato:

##### Asset Tree:

`index.html` richiede `index.js` e `index.css`.

`index.js` richiede `test.js` e `test.txt`

```Text
index.html
-- index.js
 |--- test.js
 |--- test.txt
-- index.css
```

##### Bundle Tree:

`index.html` viene usato come asset di entrata per il bundle principale, questo bundle principale crea due bundle figli uno per `index.js` e uno per `index.css` questo perché entrambi sono diversi dal tipo `html`.

`index.js` richiede due files, `test.js` e `test.txt`.

`test.js` viene aggiunto agli assets del bundle `index.js`, in quanto è dello stesso tipo di `index.js``.

`test.txt` crea un nuovo bundle e viene aggiunto come un figlio del bundle `index.js` in quanto è un assetType diverso da `index.js`.

`index.css` non ha requires e quindi contiene solo i suoi assets.

`index.css` e `index.js` sono bundles che sono anche siblingBundles tra di loro, quindi condividono lo stesso genitore.

```Text
index.html
-- index.js (include index.js e test.js)
 |--- test.txt (include test.txt)
-- index.css (include index.css)
```

### Middleware

Middleware può essere usato per agganciarsi a un server http (ad esempio `express` o un nodo `http`).

Un esempio di utilizzo di Parcel middleware con express:

```Javascript
const Bundler = require('parcel-bundler');
const app = require('express')();

// Inizializzare un nuovo bundle usando un file e le opzioni (per le opzioni e il file vedere la documentazione del bundle)
const bundler = new Bundler(file, options);

// Lasciate che express utilizzi il middleware bundler, questo permetterà di gestire ogni richiesta di Parcel sul vostro server express
app.use(bundler.middleware());

// Inizializza il listen sulla porta 8080
app.listen(8080);
```
