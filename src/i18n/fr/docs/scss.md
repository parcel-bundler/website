# SCSS

_Extensions supportées : `sass`, `scss`_

La compilation SCSS nécessite un module `sass` (une version JS `dart-sass`).

Pour l'installer avec npm :

```bash
npm install -D sass
```

Pour l'installer avec yarn :

```bash
yarn add -D sass
```

Une fois que vous avez installé `sass`, vous pouvez importer des fichiers SCSS à partir de fichiers JavaScript.

```javascript
import './custom.scss'
```

Vous pouvez également inclure directement le fichier SCSS dans un fichier HTML.

```html
<link rel="stylesheet" href="./style.scss" />
```

Les dépendances dans les fichiers SCSS peuvent être utilisées avec les instructions `@import`.

Si vous n'avez pas de module `sass` installé avant l'exécution de Parcel, Parcel l'installera automatiquement pour vous.

De plus, vous pouvez configurer la compilation sass avec Parcel en créant un fichier de configuration : .sassrc

Par exemple, vous pouvez contrôler le style de sortie du CSS généré en le spécifiant ainsi :

{
outputStyle: "nested",
}

**Remarques :** Vous pouvez aussi utiliser le module `node-sass` pour la compilation du SCSS. L'utilisation du module `node-sass` vous donnera une compilation plus rapide. Cependant, [une issue](https://github.com/parcel-bundler/parcel/issues/1836) a été reportée sur l'utilisation du module `node-sass` avec Parcel.
