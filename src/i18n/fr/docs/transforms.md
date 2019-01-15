# 🐠 Transformations

Alors que de nombreux empaqueteurs vous demandent d'installer et de configurer des plugins pour transformer les ressources, Parcel a un support prêt à l'emploi pour de nombreuses transformations et transpileurs. Vous pouvez transformer du JavaScript en utilisant [Babel](https://babeljs.io), du CSS à l'aide de [PostCSS](http://postcss.org) et du HTML en utilisant [PostHTML](https://github.com/posthtml/posthtml). Parcel exécute automatiquement ces transformations lorsqu'il trouve un fichier de configuration (par exemple `.babelrc`, `.postcssrc`) dans un module. (En plus de toutes les transformations spécifiées dans `.babelrc`, Parcel utilise toujours Babel sur tous les modules compilés en JavaScript moderne pour qu'ils soient pris en charge par tous les navigateurs. Consultez la section [JavaScript/Default Babel Transforms](javascript.html#transformations-babel-par-défaut) pour plus d'informations.)

## Modules tiers

Les fichiers de configuration (comme `.babelrc`) ne s’appliqueront pas par défaut aux fichiers à l'intérieur des `node_modules` tiers. Cependant, si le répertoire du module est lié symboliquement (comme cela est courant dans certaines conventions monorepo) et le `package.json` du module a le champ `source` défini, alors les fichiers de configuration à l’intérieur du répertoire du module seront respectés. Voici les types de valeurs supportées par le champ `source` :

- Traite tous les fichiers dans le code source, ne change pas la résolution

```json
{
  "main": "foo.js",
  "source": true
}
```

- Lors de la compilation du source, il utilise bar.js comme point d'entrée

```json
{
  "main": "foo.js",
  "source": "bar.js"
}
```

- Lors de la compilation du source, il utilise les fichiers spécifiés

```json
{
  "main": "foo.js",
  "source": {
    "./foo.js": "./bar.js",
    "./baz.js": "./yay.js"
  }
}
```

- Lors de la compilation du source, il utilise les modèles glob

```json
{
  "main": "foo.js",
  "source": {
    "./lib/**": "./src/$1"
  }
}
```

Le dernier exemple vous permet de remplacer l'intégralité de votre répertoire lib par src afin que l'importation de 'my-module/lib/test.js' soit résolue en 'my-module/src/test.js'. Vous pouvez également utiliser un modèle de niveau supérieur fourre-tout comme `"**": "./src/$1"` pour les packages comme lodash qui ont beaucoup de fichiers à remplacer à la racine (par exemple lodash/cloneDeep par lodash/src/cloneDeep).
