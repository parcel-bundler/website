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
| Any | point d'entrée          | ❌ |
| JavaScript | `<script>`       | ✅ |
| JavaScript | Import dynamique | ❌ |
| JavaScript | Service worker   | ❌ |
| HTML | iframe                 | ❌ |
| HTML | lien d'ancrage         | ❌ |
| Raw (Images, fichiers texte, ...) | Import/Require/... | ✅ |

Le hachage du fichier suit le modèle de dénomination suivant : `<nom du répertoire>-<hash>.<extension>`