# ✨ Production

Quand vient le temps d'empaqueter votre application pour la production, vous pouvez utiliser le mode de production de Parcel.

```bash
parcel build entry.js
```

## Optimisations

Cela désactive le mode watch et le remplacement de module à chaud, de sorte qu'il ne sera construit qu'une seule fois. Cela permet également de minifier tous les paquets en sortie pour réduire la taille du fichier. Les minifieurs utilisés par Parcel sont [terser](https://github.com/fabiosantoscode/terser) pour JavaScript, [cssnano](http://cssnano.co) pour CSS et [htmlnano](https://github.com/posthtml/htmlnano) pour HTML.

L'activation du mode production définit également la variable d'environnement `NODE_ENV=production`. Les grandes bibliothèques comme React ont des fonctionnalités de débogage uniquement pour le développement qui sont désactivés en définissant cette variable d'environnement, ce qui se traduit par des constructions plus petites et plus rapides pour la production.

## Stratégie de nommage des fichiers

Pour permettre à votre cdn de définir des règles de mise en cache très agressives, afin d'avoir une performance et une efficacité optimale, Parcel hache les noms de fichier de la plupart des bundles (selon si le bundle doit avoir un nom lisible/mémorisable ou non, principalement pour le référencement).

Parcel suit le tableau suivant, lorsqu’il s’agit de nommer des bundles. (Les points d'entrée ne sont jamais hachés)

| Type de bundle | Type | Contenu haché |
| ---:| --- |:---:|:---:|
| Tous | point d'entrée         | ❌ |
| JavaScript | `<script>`       | ✅ |
| JavaScript | Import dynamique | ❌ |
| JavaScript | Service worker   | ❌ |
| HTML | iframe                 | ❌ |
| HTML | lien d'ancrage         | ❌ |
| Brut (Images, fichiers texte, ...) | Import/Require/... | ✅ |

Le hachage du fichier suit le modèle de dénomination suivant : `<nom du répertoire>-<hash>.<extension>`

## Les pièges du multiplateforme

Afin d'optimiser les performances de construction de la production, Parcel essayera de déterminer le nombre de processeurs disponibles sur la machine qui exécute la commande build pour distribuer le travail en conséquence. Pour ce faire, Parcel s'appuie sur la bibliothèque [physical-cpu-count](https://www.npmjs.com/package/physical-cpu-count).

Cela suppose que vous ayez le programme [`lscpu`](http://manpages.courier-mta.org/htmlman1/lscpu.1.html) disponible sur votre système.

## Utilisation d'un CI

Si vous souhaitez intégrer Parcel à votre système d'intégration continue (par exemple Travis ou Circle CI), vous devrez peut-être installer Parcel en tant que dépendance locale.

Les instructions se [trouvent ici](getting_started.html#ajout-de-parcel-à-vos-projets).
