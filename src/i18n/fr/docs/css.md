# CSS

_Extensions supportées : `css`, `pcss`, `postcss`_

Les ressources CSS peuvent être importées à partir d'un fichier JavaScript ou HTML :

```js
import './index.css'
```

```html
<link rel="stylesheet" type="text/css" href="index.css">
```

Les ressources CSS peuvent contenir des dépendances référencées par la syntaxe `@import` ainsi que des références à des images, des polices, etc. via la fonction `url()`. Les autres fichiers CSS, qui sont `@import`és, sont intégrés dans le même paquet CSS, et les références de `url()` sont réécrites en sortie dans leurs noms de fichiers. Tous les noms des fichiers doivent être relatifs au fichier CSS courant.

```css
/* Importe un autre fichier CSS */
@import './other.css';

.test {
  /* Référence un fichier image */
  background: url('./images/background.png');
}
```

En plus des simples CSS, d'autres langages compilés vers CSS comme LESS, SASS et Stylus sont également supportés, et fonctionnent de la même manière.

# PostCSS

[PostCSS](http://postcss.org) est un outil pour transformer du CSS avec des plugins, comme [autoprefixer](https://github.com/postcss/autoprefixer), [Preset Env](https://github.com/csstools/postcss-preset-env), et [CSS Modules](https://github.com/css-modules/css-modules). Vous pouvez configurer PostCSS avec Parcel en créant un fichier de configuration en utilisant l'un de ces noms : `.postcssrc` (JSON), `.postcssrc.js` ou `postcss.config.js`.

Installez les plugins dans votre application :

```bash
yarn add postcss-modules autoprefixer
```

Ensuite, créez un `.postcssrc`:

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

Les plugins sont spécifiés dans l'objet `plugins` en tant que clés et les options sont définies en utilisant des valeurs d'objet. S'il n'y a pas d'options pour un plugin, définissez-le simplement à `true`.

Les navigateurs ciblés pour Autoprefixer, cssnext et d'autres outils peuvent être spécifiés dans le fichier `.browserslistrc` :

```
> 1%
last 2 versions
```

Les modules CSS sont activés légèrement différemment en utilisant la clé `modules` du niveau supérieur. C'est parce que Parcel doit avoir un support spécial pour les modules CSS car ils exportent un objet à inclure dans le paquet JavaScript. Notez que vous devez toujours installer `postcss-modules` dans votre projet.

## Utilisation avec les bibliothèques CSS existantes

Pour que les modules CSS fonctionnent correctement avec les modules existants, ils doivent spécifier ce support dans leur propre `.postcssrc`.

## Mise en place de la config de minification de cssnano

Parcel ajoute [cssnano](http://cssnano.co) à postcss afin de minifier le css pour la construction en production. La configuration personnalisée peut être définie en créant le fichier `cssnano.config.js` :

```js
module.exports = {
  preset: [
    'default',
    {
      calc: false,
      discardComments: {
        removeAll: true
      }
    }
  ]
}
```
