# WebAssembly

_Extensions supportées : `wasm`_

[WebAssembly](https://webassembly.org) est une technologie émergente, mais qui aura un impact énorme sur le Web dans un avenir proche. Maintenant pris en charge par tous les principaux navigateurs web, ainsi que Node, WebAssembly permettra une diversité de langages sur le Web, et pas seulement ceux pouvant transpiler du JavaScript.

Les langages de bas niveau comme le C et Rust peuvent être compilés en WebAssembly, qui est un format binaire pour des fichiers moins volumineux et une exécution plus rapide. Des performances proches de celles du niveau natif peuvent être obtenues avec du code compilé en WebAssembly, souvent beaucoup plus rapide qu'un code JavaScript équivalent. Il est probable que nous verrons des bibliothèques JavaScript qui commenceront à tirer parti de WebAssembly pour les sections critiques d'exécution du code dans un proche avenir.

Parcel le fait **très facilement** pour débuter avec WebAssembly. En supposant que vous avez déjà un fichier `.wasm` (voir la section suivante pour un moyen encore plus facile !), vous pouvez comme d'habitude simplement importer. Les importations synchrones et asynchrones sont prises en charge.

```js
// import synchrone
import { add } from './add.wasm'
console.log(add(2, 3))
// import asynchrone
const { add } = await import('./add.wasm')
console.log(add(2, 3))
```

Lors de l'importation synchrone d'un fichier `.wasm`, Parcel génère automatiquement du code supplémentaire pour précharger le fichier avant l'exécution de votre paquet JavaScript. Cela signifie que le fichier WebAssembly binaire n’est pas inséré dans votre code JavaScript en tant que chaîne, mais qu’il est utilisé comme un fichier binaire distinct comme vous vous en doutiez. De cette manière, votre code fonctionne toujours de manière synchrone, mais Parcel prend en charge le chargement des dépendances pour vous.

Tout cela est possible grâce au support interne de Parcel pour les [chargeurs de paquet](https://github.com/parcel-bundler/parcel/pull/565), qui sont des modules d’exécution qui savent comment charger de manière asynchrone un format de fichier particulier. Dans les versions précédentes, il existait des chargeurs de paquet codés en dur pour JavaScript et CSS, qui permettaient la prise en charge de l'importation dynamique. Dans Parcel v1.5.0, c’est **complètement pluggable**. Vous pouvez définir vos propres chargeurs de paquets dans des plugins ! Cela permettra à l'avenir de nombreuses fonctionnalités intéressantes pour les formats binaires personnalisés tels que les modèles binaires de Glimmer, etc. Super excité de voir ce que cela permet !
