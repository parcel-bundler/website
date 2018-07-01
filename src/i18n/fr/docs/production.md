# ✨ Production

Quand vient le temps d'empaqueter votre application pour la production, vous pouvez utiliser le mode de production de Parcel.

```bash
parcel build entry.js
```

Cela désactive le mode watch et le remplacement de module à chaud, de sorte qu'il ne sera construit qu'une seule fois. Cela permet également de minifier tous les paquets en sortie pour réduire la taille du fichier. Les minifieurs utilisés par Parcel sont [terser](https://github.com/fabiosantoscode/terser) pour JavaScript, [cssnano](http://cssnano.co) pour CSS et [htmlnano](https://github.com/posthtml/htmlnano) pour HTML.

L'activation du mode production définit également la variable d'environnement `NODE_ENV=production`. Les grandes bibliothèques comme React ont des fonctionnalités de débogage uniquement pour le développement qui sont désactivés en définissant cette variable d'environnement, ce qui se traduit par des constructions plus petites et plus rapides pour la production.