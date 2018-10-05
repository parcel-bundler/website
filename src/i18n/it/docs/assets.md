# 📦 Assets

Parcel ruota attorno al concetto di Assets. Un Asset può rappresentare qualsiasi file, ma Parcel ha un supporto speciale per alcuni tipi di Assets come i file JavaScript, CSS e HTML. Parcel analizza automaticamente le dipendenze a cui si fa riferimento in questi file e le include nel bundle di output. Gli Assets di tipo simile sono raggruppati nello stesso pacchetto di produzione. Se si importa un asset di tipo diverso (per esempio, se si importa un file CSS da un JS), viene avviato un bundle figlio e viene lasciato un riferimento ad esso nel genitore. Tutto questo processo sarà illustrato nelle sezioni seguenti.

## JavaScript

Il tipo di file più tradizionale per i web bundlers é JavaScript. Parcel supporta sia la sintassi CommonJS che ES6 quando si tratta di importare i files. Supporta anche la funzione di `import()` dinamica per caricare i moduli in modo asincrono, funzionalità che è discussa nella sezione [Code Splitting](code_splitting.html).

```javascript
// Importa un modulo utilizzando la sintassi CommonJS
const dep = require('./percorso/al/file');

// Importa un modulo utilizzando la sintassi ES6
import dep from './percorso/al/file';
```

È anche possibile importare risorse non JavaScript da un file JavaScript, ad esempio CSS o anche un file immagine. Quando si importa uno di questi file, non è incluso come in altri bundle. Invece, è posizionato in un bundle separato (per esempio un file CSS) insieme a tutte le sue dipendenze. Quando si utilizza la tecnica dei [CSS Modules](https://github.com/css-modules/css-modules), le classi esportate vengono posizionate nel bundle JavaScript. Altri tipi di risorse esportano un URL nel file di output nel bundle JavaScript in modo da poterlo consultare nel proprio codice.

```javascript
// Importa un file CSS
import './test.css';

// Importa un file CSS utilizzando CSS Modules
import classNames from './test.css';

// Importa un'immagine da un URL
import imageURL from './test.png';
```

Se si desidera includere un file nel bundle JavaScript al posto di referenziarlo tramite un URL, si può utilizzare l'API di Node.js `fs.readFileSync`. L'URL dovrà essere analizzabile staticamente, cioé non potrà avere nessuna variable al suo interno, (oltre che `__dirname` e `__filename`).

```javascript
import fs from 'fs';

// Legge i contenuti come una stringa
const string = fs.readFileSync(__dirname + '/test.txt', 'utf8');

// Legge i contenuti come un Buffer
const buffer = fs.readFileSync(__dirname + '/test.png');
```

## CSS

Gli assets CSS possono essere importati da un file JavaScript o da un file HTML, e possono contenere le dipendenze richiamate dalla sintassi '@import' così come ogni riferimento ad immagini, fonts, eccetera richiamati tramite 'url()'. Gli altri file CSS che sono `@import` saranno inclusi nel medesimo bundle, e i riferimenti agli `url()` saranno riscritti in modo da puntare ai rispettivi files. Tutti i nomi dei file dovrebbero essere richiamati in modo realtivo rispetto al file CSS.

```css
/* Importa un file CSS */
@import './altro.css';

.test {
  /* Riferimento ad un file immagine */
  background: url('./images/background.png');
}
```

Oltre ai semplici CSS, sono supportati e funzionano allo stesso modo anche altri linguaggi compile-to-CSS come LESS, SASS e Stylus.

## SCSS
La compilazione SCSS richiede il modulo `sass`. Per installarlo via npm:
```bash
npm install sass
```
Una volta installato `sass`, puoi importare i file SCSS da un file JavaScript.
```javascript
import './custom.scss'
```
Le dipendenze nel file SCSS possono essere utilizzate tramite la funzione `@import`

## HTML

Le risorse HTML sono spesso il file di input che fornite a Parcel, ma possono anche essere referenziate da file JavaScript, ad esempio per fornire collegamenti ad altre pagine. Gli URL di script, stili, supporti e altri file HTML vengono estratti e compilati come descritto in precedenza. I riferimenti vengono riscritti nell'HTML in modo che si colleghino ai file di output corretti. Tutti i nomi dei file devono essere relativi al file HTML corrente.

```html
<html>
<body>
  <!-- Riferimento ad un file immagine -->
  <img src="./images/header.png">

  <a href="./altrapagina.html">Link ad un'altra pagina</a>

  <!-- Importa un bundle JavaScript -->
  <script src="./index.js"></script>
</body>
</html>
```
