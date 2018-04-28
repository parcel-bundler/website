# 📦 Ressources

Parcel est basé sur des ressources. Une ressource peut être n'importe quel fichier, mais Parcel a un support spécial pour certains types de ressource comme les fichiers JavaScript, CSS et HTML. Parcel analyse automatiquement les dépendances référencées dans ces fichiers et les inclut dans le paquet en sortie. Les ressources de types similaires sont regroupées dans le même paquet en sortie. Si vous importez une ressource d'un type différent (par exemple, si vous avez importé un fichier CSS depuis un JS), il commence par un paquet enfant et laisse une référence dans le parent. Ceci sera illustré dans les sections suivantes.

## JavaScript

Le type de fichier le plus traditionnel pour les paquets web, c'est le JavaScript. Parcel prend en charge la syntaxe du module CommonJS et l'ES6 pour l'importation de fichiers. Il prend également en charge la syntaxe de la fonction dynamique `import()` pour charger les modules de manière asynchrone, qui est expliquée dans la section [Découpage du code](code_splitting.html).

```javascript
// Importe un module en utilisant la syntaxe CommonJS
const dep = require('./path/to/dep');

// Importe un module à l'aide de la syntaxe d'importation ES6
import dep from './path/to/dep';
```

Vous pouvez également importer des éléments non JavaScript à partir d'un fichier JavaScript, par exemple du CSS ou même un fichier image. Lorsque vous importez l'un de ces fichiers, il n'est pas intégré comme dans d'autres empaqueteurs. Au lieu de cela, Parcel le place dans un paquet séparé (par exemple un fichier CSS) avec toutes ses dépendances. Lors de l'utilisation des [Modules CSS](https://github.com/css-modules/css-modules), les classes exportées sont placées dans le paquet JavaScript. Les autres types de ressource exportent une URL vers le fichier de sortie dans le paquet JavaScript afin que vous puissiez les référencer dans votre code.

```javascript
// Importe un fichier CSS
import './test.css';

// Importe un fichier CSS avec Modules CSS
import classNames from './test.css';

// Importe l'URL d'un fichier image
import imageURL from './test.png';
```

Si vous souhaitez insérer un fichier dans le bundle JavaScript au lieu de le référencer par une URL, vous pouvez utiliser l'API `fs.readFileSync` de Node.js pour le faire. L'URL doit être analysable statiquement, ce qui signifie qu'elle ne peut contenir aucune variable (autre que `__dirname` et `__filename`).

```javascript
import fs from 'fs';

// Lit le contenu comme un String
const string = fs.readFileSync(__dirname + '/test.txt', 'utf8');

// Lit le contenu comme un Buffer
const buffer = fs.readFileSync(__dirname + '/test.png');
```

## CSS

Les ressources CSS peuvent être importées à partir d'un fichier JavaScript ou HTML et elles peuvent contenir des dépendances référencées par la syntaxe `@import` ainsi que des références à des images, des polices, etc. via la fonction `url()`. Les autres fichiers CSS, qui sont `@import`és, sont intégrés dans le même paquet CSS, et les références de `url()` sont réécrites en sortie dans leurs noms de fichiers. Tous les noms des fichiers doivent être relatifs au fichier CSS courant.

```css
/* Importe un autre fichier CSS */
@import './other.css';

.test {
  /* Référence un fichier image */
  background: url('./images/background.png');
}
```

En plus des simples CSS, d'autres langages compilés vers CSS comme LESS, SASS et Stylus sont également supportés, et fonctionnent de la même manière.

## SCSS
La compilation SCSS nécessite un module `node-sass`. Pour l'installer avec npm :
```bash
npm install node-sass
```
Une fois que vous avez installé `node-sass`, vous pouvez importer des fichiers SCSS à partir de fichiers JavaScript.
```javascript
import './custom.scss'
```
Les dépendances dans les fichiers SCSS peuvent être utilisées avec les instructions `@import`.

## HTML

Une ressource HTML est souvent le fichier d'entrée que vous fournissez à Parcel, mais il peut aussi être référencé par des fichiers JavaScript, par exemple pour fournir des liens vers d'autres pages. Les URL des scripts, des styles, des médias et des autres fichiers HTML sont extraites et compilées comme décrit ci-dessus. Les références sont réécrites dans le code HTML afin qu'elles soient liées aux bons fichiers de sortie. Tous les noms de fichiers doivent être relatifs au fichier HTML courant.

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
