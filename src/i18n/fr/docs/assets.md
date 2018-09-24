# 📦 Ressources

Parcel est basé sur des ressources. Une ressource peut être n'importe quel fichier, mais Parcel a un support spécial pour certains types de ressources comme les fichiers JavaScript, CSS et HTML. Parcel analyse automatiquement les dépendances référencées dans ces fichiers et les inclut dans le paquet en sortie. Les ressources de types similaires sont regroupées dans le même paquet en sortie. Si vous importez une ressource d'un type différent (par exemple, si vous avez importé un fichier CSS depuis un JS), il commence par créer un paquet enfant et laisse une référence dans le parent. Ceci sera illustré dans les sections suivantes.

## JavaScript

Le type de fichier le plus traditionnel pour les empaqueteurs web, c'est le JavaScript. Parcel prend en charge la syntaxe CommonJS et les modules ES6 pour l'importation de fichiers. Il prend également en charge la syntaxe de la fonction dynamique `import()` pour charger les modules de manière asynchrone, qui est expliquée dans la section [Découpage du code](code_splitting.html).

```javascript
// Importe un module en utilisant la syntaxe CommonJS
const dep = require('./path/to/dep');

// Importe un module ES6
import dep from './path/to/dep';
```

Vous pouvez également importer des éléments non JavaScript à partir d'un fichier JavaScript, par exemple du CSS ou même un fichier image. Lorsque vous importez l'un de ces fichiers, il n'est pas intégré comme dans d'autres empaqueteurs. Au lieu de cela, Parcel le place dans un paquet séparé (par exemple un fichier CSS) avec toutes ses dépendances. Lors de l'utilisation des [Modules CSS](https://github.com/css-modules/css-modules), les classes exportées sont placées dans le paquet JavaScript. Les autres types de ressources exportent une URL vers le fichier en sortie dans le paquet JavaScript afin que vous puissiez les référencer dans votre code.

```javascript
// Importe un fichier CSS
import './test.css';

// Importe un fichier CSS avec Modules CSS
import classNames from './test.css';

// Importe l'URL d'un fichier image
import imageURL from './test.png';
```

Si vous souhaitez insérer un fichier dans le bundle JavaScript au lieu de le référencer par une URL, vous pouvez utiliser l'API `fs.readFileSync` de Node.js à cet effet. L'URL doit pouvoir être analysée statiquement, ce qui signifie qu'elle ne peut contenir aucune variable (autre que `__dirname` et `__filename`).

```javascript
import fs from 'fs';

// Lit le contenu comme un String
const string = fs.readFileSync(__dirname + '/test.txt', 'utf8');

// Lit le contenu comme un Buffer
const buffer = fs.readFileSync(__dirname + '/test.png');

// Convertit le contenu du buffer en image
<img  src={`data:image/png;base64,${buffer.toString('base64')}`}/>
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
La compilation SCSS nécessite un module `sass`. Pour l'installer avec npm :
```bash
npm install sass
```
Une fois que vous avez installé `sass`, vous pouvez importer des fichiers SCSS à partir de fichiers JavaScript.
```javascript
import './custom.scss'
```
Les dépendances dans les fichiers SCSS peuvent être utilisées avec les instructions `@import`.

## HTML

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

## Ressources prises en charge par défaut

| Type de ressources             | Extension(s) associée(s)         |
| ------------------------------ | -------------------------------- |
| JavaScript                     | `js`, `jsx`, `es6`, `jsm`, `mjs` |
| ReasonML                       | `ml`,`re`                        |
| TypeScript                     | `ts`, `tsx`                      |
| CoffeeScript                   | `coffee`                         |
| Vue                            | `vue`                            |
| JSON                           | `json`, `json5`                  |
| YAML                           | `yaml`, `yml`                    |
| TOML                           | `toml`                           |
| GraphQL                        | `gql`, `graphql`                 |
| CSS                            | `css`, `pcss`, `postcss`         |
| Stylus                         | `stylus`                         |
| LESS                           | `less`                           |
| SASS                           | `sass`, `scss`                   |
| HTML                           | `htm`, `html`                    |
| Rust                           | `rs`                             |
| WebManifest                    | `webmanifest`                    |
| OpenGL Shading Language (GLSL) | `glsl`, `vert`, `frag`           |
| Pug                            | `jade`, `pug`                    |

<sub>\* Pour les types de ressources actuellement pris en charge, la documentation peut devenir obsolète, consultez [parcel/src/Parser.js](https://github.com/parcel-bundler/parcel/blob/28df546a2249b6aac1e529dd629f506ba6b0a4bb/src/Parser.js#L10). Pour la liste actuelle des parsers, consultez [parcel/src/assets/](https://github.com/parcel-bundler/parcel/tree/master/src/assets).</sub>

Pour tout type de ressources non pris en charge par défaut, vous pouvez vérifier si un plugin existe déjà :

- [Yarn](https://yarnpkg.com/en/packages?q=parcel-plugin-&p=1)
- [npm](https://www.npmjs.com/search?q=parcel-plugin-)
- [awesome-parcel](https://github.com/parcel-bundler/awesome-parcel#plugins)

ou [créez le votre](https://parceljs.org/plugins.html).
