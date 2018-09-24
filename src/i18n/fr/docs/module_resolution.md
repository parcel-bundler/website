# 📔 Résolution de module

Parcel (v1.7.0 et versions ultérieures) prend en charge plusieurs stratégies de résolution de module prêtes à l'emploi, ce qui vous évite de devoir gérer des chemins relatifs sans fin, par exemple `../../`.

Termes notable :

- **racine du projet** : le répertoire du point d'entrée spécifié à Parcel ou la racine partagée (répertoire parent commun) lorsque plusieurs points d'entrée sont spécifiés.
- **racine du package** : le répertoire racine du module le plus proche dans `node_modules`.

## Chemins absolus

`/foo` résoudra `foo` relatif à la **racine du projet**.

## Chemins du tilde ~

`~/foo` résoudra `foo` relatif à la **racine du package** le plus proche ou, s'il ne trouve pas, à la **racine du projet**.

## Alias

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

## Autres conditions

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
module.exports = require("electron").ipcRenderer;
```

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

Ce sont  en ce moment les utilisations conseillées avec des monorepos :

Utilisation conseillée :

- utilisez les chemins relatifs.
- utilisez `/` pour un chemin racine si une racine est requise.

Utilisation déconseillée :

- **évitez** l'utilisation de `~` dans les monorepos.

Si vous êtes un utilisateur de monorepo et que vous souhaitez contribuer à ces recommandations, veuillez fournir des exemples de repos lors de l'ouverture d'issue pour aider la discussion.
