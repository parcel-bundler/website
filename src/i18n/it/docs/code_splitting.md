# ✂️ Code Splitting

Parcel supporta il Code Splitting nativamente, senza configurazioni aggiuntive. Ciò consente di dividere il codice dell'applicazione in bundle separati che possono essere caricati su richiesta, il che significa dimensioni iniziali del bundle più piccole e tempi di caricamento più rapidi. Mentre l'utente naviga all'interno dell'applicazione e sono richiesti dei moduli, Parcel si occupa automaticamente di caricare i pacchetti "figli" su richiesta.

Il code splitting é controllato dall'uso della funzione dinamica `import()` [Proposal dynamic import](https://github.com/tc39/proposal-dynamic-import), che funziona come la normale dichiarazione `import` o funzione `require`, ma restituisce una promise. Ciò significa che il modulo viene caricato in modo asincrono.

L'esempio seguente mostra come è possibile utilizzare le importazioni dinamiche per caricare una sotto-pagina dell'applicazione su richiesta.

```javascript
// pagine/about.js
export function render() {
  // Render della pagina
}
```

```javascript
import('./pagine/info').then(function(page) {
  // Render della pagina
  page.render()
})
```

Poiché "import()` restituisce una promise, si può anche usare la sintassi asinc/await. Probabilmente è necessario configurare Babel per convertire la sintassi, fino a quando non sarà più ampiamente supportata dai browser.

```javascript
const page = await import('./pages/about')
// Render della pagina
page.render()
```

Anche le importazioni dinamiche sono gestite in lazy loading in Parcel, così puoi ancora inserire tutte le tue chiamate "import()` nella parte superiore del file e i bundle figli non saranno caricati fino a quando non saranno usati. L'esempio seguente mostra come si possono caricare in modalità lazy loading dinamica le sottopagine di un'applicazione.

```javascript
// Impostare una mappa dei nomi delle pagine per le importazioni dinamiche.
// Questi non vengono caricati fino a quando non vengono utilizzati.
const pages = {
  about: import('./pagine/info'),
  blog: import('./pagine/blog')
}

async function renderPage(name) {
  // Lazy load della pagina richiesta
  const page = await pages[name]
  return page.render()
}
```

**Nota:** Se vuoi usare asinc/await in browser che non lo supportano nativamente, ricorda di includere 'babel-polyfill' nella tua app o 'babel-runtime' + 'babel-plugin-transform-runtime' nelle librerie).

```bash
yarn add babel-polyfill
```

```javascript
import 'babel-polyfill'
import './app'
```

Leggi la documentazione su [babel-polyfill](http://babeljs.io/docs/usage/polyfill) e [babel-runtime](http://babeljs.io/docs/plugins/transform-runtime).
