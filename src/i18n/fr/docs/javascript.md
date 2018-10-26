# Javascript

_Extensions supportées : `js`, `jsx`, `es6`, `jsm`, `mjs`_

Le type de fichier le plus traditionnel pour les empaqueteurs web, c'est le JavaScript. Parcel prend en charge la syntaxe CommonJS et les modules ES6 pour l'importation de fichiers. Il prend également en charge la syntaxe de la fonction dynamique `import()` pour charger les modules de manière asynchrone, qui est expliquée dans la section [Découpage du code](code_splitting.html).

```javascript
// Importe un module en utilisant la syntaxe CommonJS
const dep = require('./path/to/dep')

// Importe un module ES6
import dep from './path/to/dep'
```

Vous pouvez également importer des éléments non JavaScript à partir d'un fichier JavaScript, par exemple du CSS, du HTML ou même un fichier image. Lorsque vous importez l'un de ces fichiers, il n'est pas intégré comme dans d'autres empaqueteurs. Au lieu de cela, Parcel le place dans un paquet séparé (par exemple un fichier CSS) avec toutes ses dépendances. Lors de l'utilisation des [Modules CSS](https://github.com/css-modules/css-modules), les classes exportées sont placées dans le paquet JavaScript. Les autres types de ressources exportent une URL vers le fichier en sortie dans le paquet JavaScript afin que vous puissiez les référencer dans votre code.

```javascript
// Importe un fichier CSS
import './test.css'

// Importe un fichier CSS avec Modules CSS
import classNames from './test.css'

// Importe l'URL d'un fichier image
import imageURL from './test.png'

// Importe un fichier HTML
import('./some.html')
// ou :
import html from './some.html'
// ou :
require('./some.html')
```

Si vous souhaitez insérer un fichier dans le paquet JavaScript au lieu de le référencer par une URL, vous pouvez utiliser l'API `fs.readFileSync` de Node.js à cet effet. L'URL doit pouvoir être analysée statiquement, ce qui signifie qu'elle ne peut contenir aucune variable (autre que `__dirname` et `__filename`).

```javascript
import fs from 'fs'

// Lit le contenu comme un String
const string = fs.readFileSync(__dirname + '/test.txt', 'utf8')

// Lit le contenu comme un Buffer
const buffer = fs.readFileSync(__dirname + '/test.png')

// Convertit le contenu du buffer en image
;<img src={`data:image/png;base64,${buffer.toString('base64')}`} />
```

# Babel

[Babel](https://babeljs.io) est un transpileur populaire pour JavaScript, avec un grand écosystème de plugin. L'utilisation de Babel avec Parcel fonctionne de la même manière que l'utilisation autonome ou avec d'autres empaqueteurs.

Installez les presets et les plugins dans votre application :

```bash
yarn add @babel/preset-react
```

Ensuite, créez un `.babelrc`:

```json
{
  "presets": ["@babel/preset-react"]
}
```

## Transformations babel par défaut

Parcel transpile par défaut votre code avec `@babel/preset-env`, ceci transpile chaque module interne (requires locaux) et externe (node_modules) pour correspondre à la cible définie.

Pour la cible `browser`, il utilise [browserslist](https://github.com/browserslist/browserslist), la browserlist cible peut être définie dans le fichier `package.json` (`engines.browsers` ou `browserslist`) ou en utilisant un fichier de configuration (`browserslist` ou `.browserslistrc`).

Par défaut, la browserlist cible est à : `> 0,25%` (ce qui signifie que tous les navigateurs ayant 0,25% ou plus du nombre total d'utilisateurs Web actifs sont pris en charge)

Pour la cible `node`, Parcel utilise le `engines.node` défini dans `package.json`, la valeur par défaut est _node 8_.
