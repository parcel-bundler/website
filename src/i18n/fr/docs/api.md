# 📚 API

## Bundler

Au lieu du cli, vous pouvez également utiliser l'API pour initialiser un paquet (bundler), pour des cas d'utilisation plus avancés (par exemple, un traitement personnalisé après chaque construction).
Un exemple de watch avec chaque option expliquée :
```Javascript
const Bundler = require('parcel-bundler');
const Path = require('path');

// Emplacement du fichier d'entrée
const file = Path.join(__dirname, './index.html');

// Options du paquet
const options = {
  outDir: './dist', // Le répertoire out pour mettre les fichiers de construction, par défaut dist
  outFile: 'index.html', // Le nom du fichier de sortie
  publicUrl: './', // L'URL du serveur, par défaut à dist
  watch: true, // pour regarder les fichiers et les reconstruire si changement, par défaut pour process.env.NODE_ENV !== 'production'
  cache: true, // Activé ou désactivé la mise en cache, la valeur par défaut est true
  cacheDir: '.cache', // Le répertoire où le cache est placé, par défaut .cache
  minify: false, // Minifie les fichiers, activé si process.env.NODE_ENV === 'production'
  target: 'browser', // browser/node/electron, par défaut browser
  https: false, // Les fichiers du serveur sur https ou http, par défaut à false
  logLevel: 3, // 3 = Tout consigner, 2 = Consigner les erreurs et les avertissements, 1 = Consigner uniquement les erreurs
  hmrPort: 0, // Le port sur lequel la socket hmr fonctionne, par défaut à un port libre aléatoire (0 dans node.js se traduit en un port libre aléatoire)
  sourceMaps: true, // Active ou désactive sourcemaps, par défaut activé (pas encore pris en charge dans les versions minifiées)
  hmrHostname: '', // Un nom d'hôte pour le rechargement de module à chaud, par défaut à ''
  detailedReport: false // Affichee un rapport détaillé des paquets, des ressources, des tailles des fichhiers et des durées, par défaut à false, les rapports ne sont affichés que si le mode watch est désactivée
};

// Initialise un paquet (bundler) en utilisant l'emplacement de l'entrée et les options fournies
const bundler = new Bundler(file, options);

// Exécute le paquet, cela renvoie le paquet principal
// Utilise les événements si vous utilisez le mode watch car cette promesse ne se déclenchera qu'une fois et pas pour chaque reconstruction
const bundle = await bundler.bundle();
```

### Événements

Ceci est une liste de tous les événements d'un paquet

* `bundled` est appelé une fois, Parcel a terminé avec succès l'empaquetage, le [bundle](#bundle) principal est passé à la fonction de rappel
```Javascript
const bundle = new Bundler(...);
bundle.on('bundled', (bundle) => {
  // bundle contient tous les ressources et les paquets, voir la documentation pour plus de détails.
});
```

* `buildEnd` est appelé après chaque construction, cela est également émis si une erreur s'est produite
```Javascript
const bundle = new Bundler(...);
bundle.on('buildEnd', () => {
  // Faire quelque chose...
});
```

### Bundle

Un `Bundle` est ce que Parcel utilise pour regrouper les paquets, ce qui inclut également les paquets enfants et frères pour pouvoir créer une arborescence.

#### Propriétés

* `type`: Le type de ressource qu'il contient (par exemple js, css, map, ...)
* `name`: Le nom du paquet (généré en utilisant `Asset.generateBundleName()` de `entryAsset`)
* `parentBundle`: Le paquet parent, à null dans le cas du paquet d'entrée
* `entryAsset`: Le point d"entrée du paquet, utilisé pour générer le nom et rassembler des ressources.
* `assets`: Un `Set` de toutes les ressources à l'intérieur du paquet
* `childBundles`: Un `Set` de tous les paquets enfants
* `siblingBundles`: Un `Set` de tous les paquets frères
* `siblingBundlesMap`: Un `Map<String(Type: js, css, map, ...), Bundle>` de tous les paquets frères
* `offsets`: Un `Map<Asset, number(line number inside the bundle)>` de tous les emplacements des ressources à l'intérieur, utilisé pour générer des sources maps précises

#### Arborescence

Le `Bundle` contient un `parentBundle`, un `childBundles` et un `siblingBundles`, toutes ces propriétés créent ensemble une arborescence du paquet rapide à itérer.


Un exemple très basique d'une arborescence de ressource et la génération de l'arborescence du paquet

##### Arborescence de ressource :

`index.html` a besoin de `index.js` et `index.css`.

`index.js` a besoin de `test.js` et `test.txt`

```Text
index.html
-- index.js
 |--- test.js
 |--- test.txt
-- index.css
```

##### Arborescence du paquet :

`index.html` est utilisé comme ressource d'entrée pour le paquet principal, ce paquet principal crée deux paquets enfants un pour `index.js` et un autre pour `index.css`, car ils sont tous les deux différents du type `html`.

`index.js` a besoin de deux fichiers, `test.js` et `test.txt`.

`test.js` est ajouté aux ressources du paquet `index.js`, car il est du même type que `index.js`

`test.txt` crée un nouveau paquet et est ajouté comme enfant du paquet `index.js`, car son type est différent de `index.js`

`index.css` n'a pas de besoin et ne contient donc que son entrée.

Les paquets `index.css` et `index.js` sont des paquets frères l'un de l'autre car ils partagent le même parent.

```Text
index.html
-- index.js (inclus index.js et test.js)
 |--- test.txt (inclus test.txt)
-- index.css (inclus index.css)
```

### Middleware

Le middleware peut être utilisé pour se connecter à un serveur http (par exemple `express` ou `http` de node).

Un exemple d'utilisation du middleware de Parcel avec express
```Javascript
const Bundler = require('parcel-bundler');
const app = require('express')();

// Initialise un nouveau bundler en utilisant un fichier et des options (pour les options et le fichier, voir la documentation du bundler)
const bundler = new Bundler(file, options);

// express utilise le middelware de bundler, cela permettra à Parcel de gérer chaque requête sur votre serveur express
app.use(bundler.middleware());

// Ecoute du port 8080
app.listen(8080);
```
