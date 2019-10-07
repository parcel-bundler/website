# Pug

_Extensions supportées : `jade`, `pug`_

La mise en place du Pug est facile. Vous pouvez avoir la structure de fichier que vous voulez, nous ne fournissons plusieurs exemples simples comme point de référence.

## Exemple 1 - index.pug uniquement

Supposons cette structure de fichier :

```bash
.
├── package.json
└── src
    └── index.pug
```

Nous pouvons obtenir l'exécution en utilisant cette commande de Parcel : `parcel src/index.pug`.

## Exemple 2 - index.pug, index.js et style.css

Supposons cette structure de fichier :

```bash
.
├── package.json
└── src
    ├── index.js
    ├── index.pug
    └── style.css
```

Dans index.pug, connectez simplement votre feuille de style et votre js comme d’habitude.

```pug
// index.pug

doctype html
html(lang="")
  head
    // ...
    link(rel="stylesheet", href="index.css")
  body
    h1 Hello

    script(src="index.js")
```

Si vous utilisiez Stylus, Sass ou LESS, vous les liés toujours de la même manière. Vous pouvez importer votre fichier de style directement dans votre fichier JS si vous préférez.

Nous pouvons obtenir l'exécution en utilisant cette même commande de Parcel : `parcel src/index.pug`.

## Exemple 3 - Pug avec locals

Supposons cette structure de fichier :

```bash
.
├── package.json
└── src
    ├── index.pug
    └── pug.config.js
```

Nous avons besoin d'exporter un objet `locals` à partir d'un fichier `pug.config.js`. Le fichier `pug.config.js` doit se trouver dans le répertoire contenant le fichier `index.pug` OU dans le répertoire contenant le fichier `package.json`. Le fichier `pug.config.js` n'a pas besoin d'être explicitement importé dans un fichier js. C’**EST** le seul moyen de rendre un objet `locals` disponible pour vos templates Pug.

```js
// pug.config.js

module.exports = {
  locals: {
    hello: 'world'
  }
}
```

```pug
// index.pug

doctype html
html(lang="")
  head
    // ...
  body
    h1 #{hello}
```

Encore une fois, nous pouvons obtenir l'exécution en utilisant cette commande de Parcel : `parcel src/index.pug`.

### Annuler et réexécuter le colis après la mise à jour de l'objet locals

Vous ne pourrez pas voir les modifications apportées à la volée à l'objet `locals`. Si vous mettez à jour votre objet `locals`, vous devez annuler le processus Parcel dans votre terminal et relancer `parcel src/index.pug`.

### Attention aux erreurs silencieuses

De plus, sachez que si vous utilisez cette configuration `locals`, vous ne recevrez pas d’erreur si vous utilisez une propriété qui n’existe pas pour l’interpolation dans votre Pug. Ainsi, si nous écrivons `h1 #{thing}` et qu'il n'y avait aucune propriété `thing` dans `locals`, Parcel ne plantera pas, ni ne signalera une erreur. Il n'y aura qu'un résultat vide dans le navigateur. Veillez donc à ne pas vous tromper, sinon vous risquez de ne pas savoir qu'un élément interpolé ne fonctionne pas.

### Les trois options de dénomination du fichier

Vous pouvez utiliser un fichier `.pugrc` ou `.pugrc.js` à la place de `pug.config.js`. Mais ce sont les 3 seules variantes qui fonctionneront pour la mise en place de `locals`.

### Impossible d'utiliser les instructions import dans le fichier `pug.config.js`

Si vous souhaitez importer d'autres fichiers dans le fichier `pug.config.js`, vous devez utiliser des instructions `require`.

Ceci fonctionnera :

```js
// pug.config.js

const data = require('./data.js')

module.exports = {
  locals: {
    d: data
  }
}
```

Ceci NE fonctionnera PAS :

```js
import data from './data.js'

module.exports = {
  locals: {
    d: data
  }
}
```

## Ajouter un script à package.json

```json
"scripts": {
    "dev": "parcel src/index.pug",
    "devopen": "parcel src/index.pug --open 'google chrome'",
    "build": "parcel build src/index.pug"
  },
```

Nous pouvons utiliser `npm run dev` ou `npm run devopen` pour que le projet s'ouvre dans le navigateur. Nous pouvons ensuite construire le projet avec `npm run build`.
