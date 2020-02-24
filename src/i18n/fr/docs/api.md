# 📚 API

## Bundler

Au lieu de l'outil en ligne de commande (CLI), vous pouvez également utiliser l'API pour initialiser un empaqueteur (bundler), pour des cas d'utilisation plus avancés (par exemple, un traitement personnalisé après chaque construction).
Un exemple de watch avec chaque option expliquée :

```Javascript
const Bundler = require('parcel-bundler');
const Path = require('path');

// Emplacement du fichier unique en point d'entrée :
const entryFiles = Path.join(__dirname, './index.html');
// OU : Plusieurs fichiers avec un glob (cela peut être aussi un .js)
// const entryFiles = './src/*.js';
// OU : Plusieurs fichiers dans un tableau
// const entryFiles = ['./src/index.html', './un/autre/repertoire/scripts.js'];

// Options de l'empaqueteur
const options = {
  outDir: './dist', // Le répertoire out pour mettre les fichiers construits, par défaut dist
  outFile: 'index.html', // Le nom du fichier en sortie
  publicUrl: '/', // L'URL du serveur, par défaut '/'
  watch: true, // Surveille les fichiers et les reconstruit lors d'un changement, par défaut pour process.env.NODE_ENV !== 'production'
  cache: true, // Active ou non la mise en cache, la valeur par défaut est true
  cacheDir: '.cache', // Le répertoire où le cache est placé, par défaut .cache
  contentHash: false, // Désactive l'inclusion du hachage de contenu sur le nom du fichier
  global: 'moduleName', // Expose sous ce nom des modules comme UMD, désactivé par défaut
  minify: false, // Minifie les fichiers, activé par défaut si process.env.NODE_ENV === 'production'
  scopeHoist: false, // Active le flag expérimental de scope hoisting/tree shaking, pour des paquets plus petits en production
  target: 'browser', // La cible de compilation : browser/node/electron, par défaut browser
  bundleNodeModules: false, // Les dépendances du package.json ne sont pas incluses lors de l'utilisation de l'option 'node' ou 'electron' avec l'option 'target' ci-dessus. Définissez le à true pour pouvoir les ajouter au paquet, false par défaut
  https: { // Définit une paire personnalisée {key, cert}, utilisez true pour en générer un ou false pour utiliser http
    cert: './ssl/c.crt', // Chemin vers le certificat personnalisé
    key: './ssl/k.key' // Chemin vers la clé personnalisée
  },
  logLevel: 3, // 5 = Tout consigner dans un fichier, 4 = Comme le 3, mais avec des horodatages et également enregistrer les requêtes http sur le serveur de développement, 3 = Consigner les informations, avertissements et erreurs, 2 = Consigner les avertissements et erreurs, 1 = Consigner les erreurs, 0 = Ne rien consigner
  hmr: true, // Active ou désactive le HMR lors de la surveillance (watch)
  hmrPort: 0, // Le port sur lequel la socket HMR (Hot Module Reload) fonctionne, par défaut à un port libre aléatoire (0 dans node.js se traduit en un port libre aléatoire)
  sourceMaps: true, // Active ou désactive les sourcemaps, par défaut activé (les constructions minifiées pour l'instant créent toujours des sourcemaps)
  hmrHostname: '', // Un nom d'hôte pour le rechargement de module à chaud, par défaut à ''
  detailedReport: false, // Afficher un rapport détaillé des paquets, ressources, tailles des fichiers et durées de build, par défaut à false, les rapports ne sont affichés que si le mode watch est désactivé
  autoInstall: true, // Active ou désactive l'installation auto des dépendances manquantes lors de l'empaquetage
};

(async function() {
  // Initialise un empaqueteur (bundler) en utilisant l'emplacement de l'entrée et les options fournies
  const bundler = new Bundler(entryFiles, options);

  // Démarre l'empaqueteur, cela renvoie le paquet principal
  // Utilisez les événements si vous êtes en mode watch, car cette Promise n'est résolue qu'une seule fois et non à chaque reconstruction
  const bundle = await bundler.bundle();
})();
```

Si vous souhaitez utiliser/démarrer le serveur de développement intégré de Parcel, vous pouvez utiliser `bundler.serve()`. Ceci appelle `bundler.bundle()` et lance un simple serveur http (ou https). `serve()` prend 3 arguments (ils sont tous facultatifs), la première est le port, le deuxième est https (il peut s'agir d'un objet `{cert,key}` pointant vers l'emplacement du fichier de key et cert ou `true` pour générer une clé) et le troisième est l'hôte (host).

### Événements

Ceci est une liste de tous les événements d'un empaqueteur

- `bundled` est appelé une seule fois lorsque Parcel a terminé avec succès l'empaquetage. L'instance du [bundle](#bundle) principal est passé à la fonction de rappel

```Javascript
const bundler = new Bundler(...);
bundler.on('bundled', (bundle) => {
  // bundler contient toutes les ressources et tous les paquets, voir la documentation pour plus de détails.
});
// Appelez ceci pour commencer l'empaquetage
bundler.bundle();
```

- `buildEnd` est appelé après chaque construction (**c'est aussi le cas pour chaque reconstruction**), cela est également émis si une erreur s'est produite

```Javascript
const bundler = new Bundler(...);
bundler.on('buildEnd', () => {
  // Faire quelque chose...
});
// Appelez ceci pour commencer l'empaquetage
bundler.bundle();
```

- `buildStart` est appelé au début de la première construction, le tableau `entryFiles` est passé à la fonction de rappel

```Javascript
const bundler = new Bundler(...);
bundler.on('buildStart', entryPoints => {
  // Faire quelque chose...
});
// Appelez ceci pour commencer l'empaquetage
bundler.bundle();
```

- `buildError` est appelé chaque fois qu'une erreur se produit pendant les constructions, l'objet `Error` est passé à la fonction de rappel

```Javascript
const bundler = new Bundler(...);
bundler.on('buildError', error => {
  // Faire quelque chose...
});
// Appelez ceci pour commencer l'empaquetage
bundler.bundle();
```

### Bundle

Un paquet (`Bundle`) est ce que Parcel utilise pour regrouper les ressources ensemble. Il contient également les paquets enfants et frères afin de former une arborescence.

#### Propriétés

- `type`: Le type de ressource qu'il contient (par exemple js, css, map, ...)
- `name`: Le nom du paquet (généré en utilisant `Asset.generateBundleName()` de `entryAsset`)
- `parentBundle`: Le paquet parent, à null dans le cas du paquet d'entrée
- `entryAsset`: Le point d'entrée du paquet, utilisé pour générer le nom et rassembler des ressources.
- `assets`: Un `Set` de toutes les ressources à l'intérieur du paquet
- `childBundles`: Un `Set` de tous les paquets enfants
- `siblingBundles`: Un `Set` de tous les paquets frères
- `siblingBundlesMap`: Un `Map<String(Type: js, css, map, ...), Bundle>` de tous les paquets frères
- `offsets`: Un `Map<Asset, number(line number inside the bundle)>` de tous les emplacements des ressources à l'intérieur, utilisé pour générer des sourcemaps précises

#### Arborescence

Le `Bundle` contient un `parentBundle`, des `childBundles` et des `siblingBundles`, toutes ces propriétés créent ensemble une arborescence de paquets pouvant être parcourue rapidement.

Un exemple très basique d'une arborescence de ressource et l'arborescence de paquets générée

##### Arborescence de ressources :

`index.html` a besoin de `index.js` et `index.css`.

`index.js` a besoin de `test.js` et `test.txt`

```Text
index.html
├── index.js
│   ├── test.js
│   └── test.txt
└── index.css
```

##### Arborescence de paquets :

`index.html` est utilisé comme ressource d'entrée pour le paquet principal. Ce paquet principal crée deux paquets enfants : un pour `index.js` et un autre pour `index.css`; car ils sont tous les deux différents du type `html`.

`index.js` a besoin de deux fichiers, `test.js` et `test.txt`.

`test.js` est ajouté aux ressources du paquet `index.js`, car il est du même type que `index.js`

`test.txt` crée un nouveau paquet et est ajouté comme enfant du paquet `index.js`, car son type est différent de `index.js`

`index.css` n'a pas de dépendances et ne contient donc que sa propre entrée.

Les paquets `index.css` et `index.js` sont des paquets frères car ils partagent le même parent.

```Text
index.html
├── index.js ········ (inclut index.js et test.js)
│   └── test.txt ···· (inclut test.txt)
└── index.css ······· (inclut index.css)
```

### Middleware

Le middleware peut être utilisé pour se connecter à un serveur HTTP (par exemple `express` ou `http` de node).

Un exemple d'utilisation du middleware de Parcel avec express

```Javascript
const Bundler = require('parcel-bundler');
const app = require('express')();

const file = 'index.html'; // Passe ici un chemin absolu vers le point d'entrée
const options = {}; // Voir la section des options de la doc de l'api, pour les possibilités

// Initialise un nouveau bundler en utilisant un fichier et des options
const bundler = new Bundler(file, options);

// Permet à express d'utiliser le middelware de bundler, cela permettra à Parcel de gérer chaque requête sur votre serveur express
app.use(bundler.middleware());

// Écoute du port 8080
app.listen(8080);
```
