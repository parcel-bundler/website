# 🐠 Conversioni

Mentre molti bundlers richiedono l'installazione di plugins per convertire o processare i tuoi asset, Parcel supporta nativamente molti preprocessori e transpilers. Puoi processare JavaScript usando [Babel](https://babeljs.io), CSS usando [PostCSS](http://postcss.org), and HTML usando [PostHTML](https://github.com/posthtml/posthtml). Parcel attiverà automaticamente queste conversioni se troverà un file di configurazione (es. `.babelrc`, `.postcssrc`) in un modulo.

Questo processo funziona anche in `node_modules` di terze parti: se un file di configurazione viene pubblicato come parte del bundle, la conversione viene attivata automaticamente solo per quel modulo. In questo modo il processo di bundling continua ad essere veloce, poiché vengono elaborati solo i moduli che devono essere convertiti. Significa anche che non è necessario configurare manualmente le conversioni per includere ed escludere determinati file, o conoscere come codice di terze parti è stato costruito al fine di usarlo nella propria applicazione.

## Babel

[Babel](https://babeljs.io) è un famoso transpiler per JavaScript, con un grosso ecosistema di plugins. Usare Babel con Parcel funziona esattamente come se si stesse usando da solo o con altri bundlers.

Installa i preset e i plugins nella tua app:

```bash
yarn add @babel/preset-env
```

Poi, crea un file `.babelrc`:

```json
{
  "presets": ["@babel/preset-env"]
}
```

## PostCSS

[PostCSS](http://postcss.org) é un tool per convertire il CSS con dei plugins, come [autoprefixer](https://github.com/postcss/autoprefixer), [Preset Env](https://github.com/csstools/postcss-preset-env), e [CSS Modules](https://github.com/css-modules/css-modules). Puoi configurare PostCSS con Parcel creando un file di configurazione con uno di questi nomi: `.postcssrc` (JSON), `.postcssrc.js`, o `postcss.config.js`.

Installa i plugins nella tua app:

```bash
yarn add postcss-modules autoprefixer
```

Poi, crea un file `.postcssrc`:

```json
{
  "modules": true,
  "plugins": {
    "autoprefixer": {
      "grid": true
    }
  }
}
```

I plugin sono specificati nell'oggetto "plugin" come chiavi e le opzioni sono definite utilizzando i valori dell'oggetto. Se non ci sono opzioni per un plugin, basta impostarlo su "true".

I browser di destinazione per Autoprefixer, cssnext e altri strumenti possono essere specificati nel file `.browserslistrc`:

```
> 1%
last 2 versions
```

I moduli CSS sono abilitati in modo leggermente diverso usando la chiave top level `modules`. Questo perché Parcel ha bisogno di avere un supporto speciale per i CSS Modules, dato che questo tool esporta un oggetto da includere nel bundle JavaScript. Si noti che è ancora necessario installare "postcss-modules" nel progetto.

### Utilizzo con librerie CSS esistenti

Affinché i CSS Modules funzionino correttamente con i file esistenti, è necessario specificare questo supporto nel proprio `.postcssrc`.

## PostHTML

[PostHTML](https://github.com/posthtml/posthtml) è un tool per convertire i file HTML con dei plugins. Puoi configurare PostHTML con Parcel creando un file di configurazione con questi nomi: `.posthtmlrc` (JSON), `.posthtmlrc.js`, o `posthtml.config.js`.

Installa i plugins nella tua app:

```bash
yarn add posthtml-img-autosize
```

Poi, crea un file `.posthtmlrc`:

```json
{
  "plugins": {
    "posthtml-img-autosize": {
      "root": "./images"
    }
  }
}
```

I Plugins sono specificati nell'oggetto `plugins` come chiavi, e le opzioni sono definite utilizzando i valori dell'oggetto. Se non ci sono opzioni per un plugin, settatelo semplicemente `true`.

## TypeScript

[TypeScript](https://www.typescriptlang.org/) è un superset di JavaScript che si compila in Javascript classico che supporta anche le feature delle versioni ES2015+. La Conversione di TypeScript funziona nativamente senza necessirà di configurazioni aggiuntive.

```html
<!-- index.html -->
<html>
  <body>
    <script src="./index.ts"></script>
  </body>
</html>
```

```typescript
// index.ts
import message from './message'
console.log(message)
```

```typescript
// message.ts
export default 'Ciao, Mondo'
```

## ReasonML/BuckleScript

[ReasonML](https://reasonml.github.io/) compila OCaml in JavaScript con l'aiuto di [BuckleScript](https://bucklescript.github.io). Puoi utilizzare ReasonML installando le sue dipendenze e creando un file `bsconfig.json`:

```bash
$ yarn add bs-platform --dev
```

```json
// bsconfig.json
// da https://github.com/BuckleScript/bucklescript/blob/master/jscomp/bsb/templates/basic-reason/bsconfig.json

{
  "name": "blabla",
  "sources": {
    "dir": "src",
    "subdirs": true
  },
  "package-specs": {
    "module": "commonjs",
    "in-source": true
  },
  "suffix": ".bs.js",
  "bs-dependencies": [],
  "warnings": {
    "error": "+101"
  },
  "namespace": true,
  "refmt": 3
}
```

```html
<!-- index.html -->
<html>
  <body>
    <script src="./src/index.re"></script>
  </body>
</html>
```

```reason
/* src/index.re */
print_endline("Ciao Mondo");
```

### ReasonReact

[ReasonReact](https://reasonml.github.io/reason-react/) é un Binding di React per ReasonML. Puoi utilizzarlo anche con Parcel:

```bash
$ yarn add react react-dom reason-react
```

```html
<!-- index.html -->
<html>
  <body>
    <script src="./src/index.re"></script>
  </body>
</html>
```

```diff
// bsconfig.json

{
  "name": "blabla",
+ "reason": {
+   "react-jsx": 2
+ },
  "sources": {
    "dir": "src",
    "subdirs": true
  },
  "package-specs": {
    "module": "commonjs",
    "in-source": true
  },
  "suffix": ".bs.js",
  "bs-dependencies": [
+   "reason-react"
  ],
  "warnings": {
    "error": "+101"
  },
  "namespace": true,
  "refmt": 3
}
```

```html
<!-- index.html -->
<html>
  <body>
    <div id="app"></div>
    <script src="./src/index.re"></script>
  </body>
</html>
```

```reason
/* src/Greeting.re */

let component = ReasonReact.statelessComponent("Saluta");

let make = (~name, _children) => {
  ...component,
  render: _self =>
    <div>
      {ReasonReact.stringToElement("Ciao! " ++ name)}
    </div>
};
```

```reason
/* src/index.re */

ReactDOMRe.renderToElementWithId(<Saluta name="Parcel" />, "app");
```
