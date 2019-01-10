# 📔 Résolution de module

Le résolveur de Parcel implémente une version modifiée de l'algorithme de [résolution des node_modules](https://nodejs.org/api/modules.html#modules_all_together).

## Résolution de module

En plus de l'algorithme standard, tous les [types de ressources supportés par Parcel](assets.html) sont aussi résolus.

La résolution de module peut être relative à la :

- **racine de l'entrée** : le répertoire du point d'entrée spécifié à Parcel ou la racine partagée (répertoire parent commun) lorsque plusieurs points d'entrée sont spécifiés.
- **racine du package** : le répertoire racine du module le plus proche dans `node_modules`.

### Chemins absolus

`/foo` résout `foo` relatif à la **racine de l'entrée**.

### Chemins du tilde ~

`~/foo` résout `foo` relatif à la **racine du package** le plus proche ou, s'il ne trouve pas, à la **racine de l'entrée**.

### Chemins de fichiers glob

Les globs sont des importations génériques qui regroupent plusieurs ressources à la fois. Les globs peuvent correspondre à tout ou une partie des fichiers (`/assets/*.png`), ainsi qu'aux fichiers de plusieurs répertoires (`/assets/**/*`).

Cet exemple regroupe un répertoire de fichiers png et renvoie l’URL dist.

```
import foo from "/assets/*.png";
// {
//   'file-1': '/file-1.8e73c985.png',
//   'file-2': '/file-1.8e73c985.png'
// }
```

### Le champs `browser` de package.json

Si un package inclut un [champs package.browser](https://docs.npmjs.com/files/package.json#browser), Parcel l'utilisera à la place de l'entrée package.main.

### Alias

Les alias sont supportés via le champ `alias` dans `package.json`.

Ces exemples d'alias `react` vers `preact` et d'un module local personnalisé qui ne sont pas dans `node_modules`.

```json
// package.json
{
  "name": "some-package",
  "devDependencies": {
    "parcel-bundler": "^1.7.0"
  },
  "alias": {
    "react": "preact-compat",
    "react-dom": "preact-compat",
    "local-module": "./custom/modules"
  }
}
```

Évitez d'utiliser des caractères spéciaux dans vos alias, car certains peuvent être utilisés par Parcel et d'autres par des outils ou des extensions tiers. Par exemple :

- `~` utilisé par Parcel pour résoudre les [chemins du tilde](#chemins-du-tilde-~).
- `@` utilisé par npm pour résoudre les organisations de npm.

Nous vous conseillons d'être explicite lors de la définition de vos alias, veuillez donc **spécifier les extensions de fichier**, sinon Parcel devra le deviner. Consultez [Export nommés de JavaScript](#export-nommés-de-javascript) pour voir un exemple.

## Problèmes communs

### Export nommés de JavaScript

Les cartographies d'alias s'appliquent à de nombreux types d'actifs, mais ne prennent pas spécifiquement en charge la cartographie des exports nommées de JavaScript. Si vous souhaitez cartographier les exports nommées JS, vous pouvez le faire ainsi :

```json
// package.json
{
  "name": "some-package",
  "alias": {
    "ipcRenderer": "./electron-ipc.js" // specifiez une extension de fichier
  }
}
```

et réexporter l'export nommé dans le fichier aliasé :

```js
// electron-ipc.js
module.exports = require('electron').ipcRenderer
```

### Flow avec la résolution de chemin absolu et tilde

Lorsque vous utilisez la résolution de module de chemin absolu ou tilde, vous devez configurer Flow à l'aide de [module.name_mapper](https://flow.org/en/docs/config/options/#toc-module-name-mapper-regex-string).

Soit un projet avec cette structure :

```
package.json
.flowconfig
src/
  index.html
  index.js
  components/
    apple.js
    banana.js
```

Où `src/index.html` est le point d'entrée, notre **racine de l'entrée** est le répertoire `src/`.

Donc cela mappe correctement les éléments suivants :

```javascript
// index.js
import Apple from '/components/apple'
```

Nous avons besoin que Flow remplace le chemin actuel `/` en `'/components/apple'` avec `src/`, cela se traduit en `'src/components/apple'`.

Le paramètre suivant dans notre `.flowconfig` réalise ce remplacement :

```
[options]
module.name_mapper='^\/\(.*\)$' -> '<PROJECT_ROOT>/src/\1'
```

Où `<PROJECT_ROOT>` est un identifiant spécifique à Flow indiquant l'emplacement de notre `.flowconfig`.

REMARQUE : `module.name_mapper` peut avoir plusieurs entrées. Cela permet de prendre en charge la résolution du chemin [Absolu](module_resolution.html#chemins-absolus) ou [Tilde](module_resolution.html#chemins-du-tilde-~) en plus du support de l'[alias du module local](module_resolution.html#alias).

### Résolution TypeScript ~

TypeScript devra connaître votre utilisation de la résolution de module `~` ou les cartographies d'alias. Veuillez vous reporter à la documentation de [TypeScript Module Resolution docs](https://www.typescriptlang.org/docs/handbook/module-resolution.html) pour plus d'informations.

```json
// tsconfig.json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "~*": ["./src/*"]
    }
  }
}
```

### Résolution Monorepo

Ce sont en ce moment les utilisations conseillées avec des monorepos :

Utilisation conseillée :

- utilisez les chemins relatifs.
- utilisez `/` pour un chemin racine si une racine est requise.

Utilisation déconseillée :

- **évitez** l'utilisation de `~` dans les monorepos.

Si vous êtes un utilisateur de monorepo et que vous souhaitez contribuer à ces recommandations, veuillez fournir des exemples de repos lors de l'ouverture d'issue pour aider la discussion.
