# HTML

_Extensions supportées : `htm`, `html`_

Une ressource HTML est souvent le fichier d'entrée que vous fournissez à Parcel, mais elle peut aussi être référencée dans des fichiers JavaScript, par exemple pour fournir des liens vers d'autres pages. Les URL des scripts, des styles, des médias et des autres fichiers HTML sont extraites et compilées comme décrit ci-dessus. Les références sont réécrites dans le code HTML afin qu'elles soient liées aux bons fichiers en sortie. Tous les noms de fichiers doivent être relatifs au fichier HTML courant.

```html
<html>
<body>
  <!-- référence un fichier image -->
  <img src="./images/header.png">

  <a href="./other.html">Lien vers une autre page</a>

  <!-- importe un paquet JavaScript -->
  <script src="./index.js"></script>
</body>
</html>
```

## Importation de ressources non compilés

L'ajout de liens vers des fichiers que Parcel peut compiler (par exemple, JavaScript, TypeScript, SCSS, etc.) au format HTML est pris en charge. Parcel traitera automatiquement le fichier et mettra à jour le lien pour qu'il pointe vers la ressource compilé.

```html
<html>
  <head>
    <!-- inclure un fichier SCSS -->
    <link rel="stylesheet" href="./my-styles/style.scss">
  </head>
</html>
```

# PostHTML

[PostHTML](https://github.com/posthtml/posthtml) est un outil pour transformer du HTML avec des plugins. Vous pouvez configurer PostHTML avec Parcel en créant un fichier de configuration en utilisant l'un de ces noms : `.posthtmlrc` (JSON), `.posthtmlrc.js` ou `posthtml.config.js`.

Installez des plugins dans votre application :

```bash
yarn add posthtml-img-autosize
```

Ensuite, créez un `.posthtmlrc`:

```json
{
  "plugins": {
    "posthtml-img-autosize": {
      "root": "./images"
    }
  }
}
```

Les plugins sont spécifiés dans l'objet `plugins` en tant que clés, et les options sont définies en utilisant des valeurs d'objets. S'il n'y a pas d'options pour un plugin, définissez-le simplement à `true`.
