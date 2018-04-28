# 🐠 Transformations

Alors que de nombreux empaqueteurs vous demandent d'installer et de configurer des plugins pour transformer les ressources, Parcel a un support prêt à l'emploi pour de nombreuses transformations et transpileurs. Vous pouvez transformer du JavaScript en utilisant [Babel](https://babeljs.io), du CSS à l'aide de [PostCSS](http://postcss.org) et du HTML en utilisant [PostHTML](https://github.com/posthtml/posthtml). Parcel exécute automatiquement ces transformations lorsqu'il trouve un fichier de configuration (par exemple `.babelrc`, `.postcssrc`) dans un module.

Cela fonctionne même dans des `node_modules` tiers : si un fichier de configuration est publié comme une partie du package, la transformation est automatiquement activée pour ce module uniquement. Cela permet de maintenir un empaquetage rapide puisque seuls les modules devant être transformés sont traités. Cela signifie également que vous n'avez pas besoin de configurer manuellement les transformations pour inclure et exclure certains fichiers ou savoir comment un code tiers est construit pour l'utiliser dans votre application.

## Babel

[Babel](https://babeljs.io) est un transpileur populaire pour JavaScript, avec un grand écosystème de plugin. L'utilisation de Babel avec Parcel fonctionne de la même manière que l'utilisation autonome ou avec d'autres empaqueteurs.

Installez les presets et les plugins dans votre application :

```bash
yarn add babel-preset-env
```

Ensuite, créez un `.babelrc`:

```json
{
  "presets": ["env"]
}
```

## PostCSS

[PostCSS](http://postcss.org) est un outil pour transformer du CSS avec des plugins, comme [autoprefixer](https://github.com/postcss/autoprefixer), [cssnext](http://cssnext.io/), et [CSS Modules](https://github.com/css-modules/css-modules). Vous pouvez configurer PostCSS avec Parcel en créant un fichier de configuration en utilisant l'un de ces noms : `.postcssrc` (JSON), `.postcssrc.js` ou `postcss.config.js`.

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

### Utilisation avec les bibliothèques CSS existantes

Pour que les modules CSS fonctionnent correctement avec les modules existants, ils doivent spécifier ce support dans leur propre `.postcssrc`.

## PostHTML

[PostHTML](https://github.com/posthtml/posthtml) est un outil pour transformer du HTML avec des plugins. Vous pouvez configurer PostHTML avec Parcel en créant un fichier de configuration en utilisant l'un de ces noms : `.posthtmlrc` (JSON), `posthtmlrc.js` ou `posthtml.config.js`.

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

## TypeScript

[TypeScript](https://www.typescriptlang.org/) est un sur-ensemble typé du JavaScript qui compile en JavaScript simple, qui prend également en charge les fonctionnalités modernes ES2015+. La transformation TypeScript fonctionne sans aucune configuration supplémentaire.

```html
<!-- index.html -->
<html>
<body>
  <script src="./index.ts"></script>
</body>
</html>
```

```typescript
// index.ts
import message from "./message";
console.log(message);
```

```typescript
// message.ts
export default "Hello, world";
```

## ReasonML/BuckleScript

[ReasonML](https://reasonml.github.io/) compile du OCaml en JavaScript à l'aide de [BuckleScript](https://bucklescript.github.io). Vous pouvez utiliser ReasonML en installant des dépendances et en créant `bsconfig.json` :
```bash
$ yarn add bs-platform --dev
```

```json
// bsconfig.json
// from https://github.com/BuckleScript/bucklescript/blob/master/jscomp/bsb/templates/basic-reason/bsconfig.json

{
  "name": "whatever",
  "sources": {
    "dir": "src",
    "subdirs": true
  },
  "package-specs": {
    "module": "commonjs",
    "in-source": true
  },
  "suffix": ".bs.js",
  "bs-dependencies": [
  ],
  "warnings": {
    "error": "+101"
  },
  "namespace": true,
  "refmt": 3
}
```

```html
<!-- index.html -->
<html>
<body>
  <script src="./src/index.re"></script>
</body>
</html>
```

```reason
/* src/index.re */
print_endline("Hello World");
```

### ReasonReact

[ReasonReact](https://reasonml.github.io/reason-react/) est une liaison de React pour ReasonML. Vous pouvez l'utiliser aussi avec Parcel :

```bash
$ yarn add react react-dom reason-react
```

```html
<!-- index.html -->
<html>
<body>
  <script src="./src/index.re"></script>
</body>
</html>
```

```diff
// bsconfig.json

{
  "name": "whatever",
+ "reason": {
+   "react-jsx": 2
+ },
  "sources": {
    "dir": "src",
    "subdirs": true
  },
  "package-specs": {
    "module": "commonjs",
    "in-source": true
  },
  "suffix": ".bs.js",
  "bs-dependencies": [
+   "reason-react"
  ],
  "warnings": {
    "error": "+101"
  },
  "namespace": true,
  "refmt": 3
}
```

```html
<!-- index.html -->
<html>
<body>
  <div id="app"></div>
  <script src="./src/index.re"></script>
</body>
</html>
```

```reason
/* src/Greeting.re */ 

let component = ReasonReact.statelessComponent("Greeting");

let make = (~name, _children) => {
  ...component,
  render: _self =>
    <div>
      {ReasonReact.stringToElement("Hello! " ++ name)}
    </div>
};
```

```reason
/* src/index.re */

ReactDOMRe.renderToElementWithId(<Greeting name="Parcel" />, "app");
```
