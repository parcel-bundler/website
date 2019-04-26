# JavaScript

_Extensions supportées : `js`, `jsx`, `es6`, `jsm`, `mjs`_

Le type de fichier le plus traditionnel pour les empaqueteurs web, c'est le JavaScript. Parcel prend en charge la syntaxe CommonJS et les modules ES6 pour l'importation de fichiers. Il prend également en charge la syntaxe de la fonction dynamique `import()` pour charger les modules de manière asynchrone, qui est expliquée dans la section [Découpage du code](code_splitting.html). Les importations dynamiques peuvent également importer des modules à partir d'URL.

```javascript
// Importe un module en utilisant la syntaxe CommonJS
const dep = require('./path/to/dep')

// Importe un module ES6
import dep from './path/to/dep'

// Importe un module depuis une URL (par exemple CDN) et utilisant l'importation dynamique
import('https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.11/lodash.min.js').then(() => {
  console.log(_.VERSION)
})
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

### Images dans JSX

Vous trouverez ci-dessous un exemple d’importation d’un fichier image à utiliser dans JSX.

```js
// Importe le fichier image
import megaMan from "./images/mega-man.png";

// JSX
<img src={megaMan} title="Mega Man" alt="Mega Man" />

// JSX (avec un chemin personnalisé)
<img src={`/dist${megaMan}`} title="Mega Man" alt="Mega Man" />
```

# Babel

[Babel](https://babeljs.io) est un transpileur populaire pour JavaScript, avec un grand écosystème de plugin. L'utilisation de Babel avec Parcel fonctionne de la même manière que l'utilisation autonome ou avec d'autres empaqueteurs.

Installez les presets et les plugins dans votre application :

```shell
yarn add --dev @babel/preset-react
```

Ensuite, créez un `.babelrc`:

```json
{
  "presets": ["@babel/preset-react"]
}
```

Vous pouvez aussi mettre la config de `babel` dans le `package.json`

```json
"babel": {
  "presets": ["@babel/preset-react"]
}
```

REMARQUE : `package.json` est prioritaire sur `.babelrc`.

## Transformations Babel par défaut

Parcel transpile par défaut votre code (chaque module interne) avec `@babel/preset-env` pour correspondre à la cible définie.

Pour la cible `browser`, il utilise [browserslist](https://github.com/browserslist/browserslist), la browserlist cible peut être définie dans le fichier `package.json` (`engines.browsers` ou `browserslist`) ou en utilisant un fichier de configuration (`browserslist` ou `.browserslistrc`).

Par défaut, la browserlist cible est à : `> 0,25%` (ce qui signifie que tous les navigateurs ayant 0,25% ou plus du nombre total d'utilisateurs Web actifs sont pris en charge)

Pour la cible `node`, Parcel utilise le `engines.node` défini dans `package.json`, la valeur par défaut est _node 8_.

# Flow

[Flow](https://flow.org/) est un vérificateur populaire de type statique pour JavaScript. L'utilisation de Flow avec Parcel est aussi simple que de placer `// @flow` comme première ligne de vos fichiers `js`.

Parcel installera automatiquement la configuration Babel requise pour séparer les types de Flow de la sortie compilée. Vous n'avez donc rien à craindre à l'exception des [intégrations de l'éditeur](https://flow.org/en/docs/editors/) ou de la prise en charge du [module de résolution des chemins absolus](module_resolution.html#flow-avec-la-résolution-de-chemin-absolu-et-tilde) avec `.flowconfig`.
