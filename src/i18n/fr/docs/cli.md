# 🖥 CLI

## Commandes

### Serve

Démarre un serveur de développement, qui reconstruira automatiquement votre application lorsque vous modifiez des fichiers et prend en charge [le remplacement de module à chaud](hmr.html) pour un développement plus rapide.

```bash
parcel index.html
```

Vous pouvez aussi passer un [glob](https://github.com/isaacs/node-glob) ou une liste de globs pour plusieurs points d'entrée.

```bash
parcel one.html two.html
# OU
parcel *.html
# OU
parcel ./**/*.html
```

### Build

Construit les ressources une seule fois, il active aussi la minification et définit la variable environnement `NODE_ENV=production`. Consultez [Production](production.html) pour plus de détails.

```bash
parcel build index.html
```

_REMARQUE :_ Pour des cas d'utilisation spéciaux, il est également possible d'effectuer une construction unique à partir de l'environnement `development`, comme ceci :

```
NODE_ENV=development parcel build <entrypoint> --no-minify
```

Il crée les mêmes paquets que `serve`, mais il ne surveille pas les ressources, ni les sert.

### Watch

La commande `watch` est similaire à `serve`, sauf que la commande `watch` ne démarre pas un serveur.

```bash
parcel watch index.html
```

### Help

Affiche toutes les options possibles de l'outil en ligne de commande (CLI).

```bash
parcel help
```

### Version

Affiche le numéro de version de Parcel

```bash
parcel --version
```

## Options

### Répertoire de sortie

Par défaut : "dist"

Disponible dans : `serve`, `watch`, `build`

```bash
parcel build entry.js --out-dir build/output
# ou
parcel build entry.js -d build/output
```

```base
root
- build
- - output
- - - entry.js
```

### Définir l'URL publique à appliquer

Par défaut : "/"

Disponible dans : `serve`, `watch`, `build`

```bash
parcel entry.js --public-url ./dist/
```

Cela produira :

```html
<link rel="stylesheet" type="text/css" href="dist/entry.1a2b3c.css" />
<!-- ou -->
<script src="dist/entry.e5f6g7.js"></script>
```

### La cible (target)

Par défaut : browser

Disponible dans : `serve`, `watch`, `build`

```bash
parcel build entry.js --target node
```

⚠️ `--target node` et `--target electron` n'ajoutent pas les `dependencies` du `package.json` au paquet (mais ajoutent bien les `devDependencies`). Ce comportement peut être modifié via le flag [--bundle-node-modules](#forcer-l'ajout-des-dépendances-node) (voir ci-dessous).

Les cibles possibles sont : `node`, `browser` et `electron`

### Forcer l'ajout des dépendances node

Par défaut : false

Disponible dans : `serve`, `watch`, `build`

```bash
parcel build entry.js --target node --bundle-node-modules
```

⚠️ Par défaut, les `dependencies` du `package.json` ne sont pas ajoutées au paquet lorsque les options `--target node` ou `--target electron` sont utilisées. `--bundle-node-modules` force leur ajout au paquet.

### Répertoire du cache

Par défaut : ".cache"

Disponible dans : `serve`, `watch`, `build`

```bash
parcel build entry.js --cache-dir build/cache
```

### Port

Par défaut : 1234

Disponible dans : `serve`

```bash
parcel serve entry.js --port 1111
```

### Changer le niveau de journalisation

Par défaut : 3

Disponible dans : `serve`, `watch`, `build`

```bash
parcel entry.js --log-level 1
```

| Loglevel | Effet                                                                                                   |
| -------- | ------------------------------------------------------------------------------------------------------- |
| 0        | Journal désactivé                                                                                       |
| 1        | Consigner uniquement les erreurs                                                                        |
| 2        | Consigner les erreurs et les avertissements                                                             |
| 3        | Consigner les erreurs, les avertissements et les infos                                                  |
| 4        | Verbose (garder tout dans un log avec l'horodatage <br/> et aussi les requêtes http sur le serveur dev) |
| 5        | Débogue (sauve tout dans un fichier avec l'horodatage)                                                  |

### Nom d'hôte du HMR

Par défaut : `location.hostname` du windows courant

Disponible dans : `serve`, `watch`

```bash
parcel entry.js --hmr-hostname parceljs.org
```

### Port du HMR

Par défaut : Un port disponible au hasard

Disponible dans : `serve`, `watch`

```bash
parcel entry.js --hmr-port 8080
```

### Nom de fichier en sortie

Par défaut : Nom du fichier original

Disponible dans : `serve`, `watch`, `build`

```bash
parcel build entry.js --out-file output.html
```

Cela modifie le nom du fichier de sortie du paquet

### Imprimer un rapport détaillé

Par défaut : rapport minimal, sinon un détail à 10

L'argument optionnel spécifie un détail du rapport.

Disponible dans : `build`

```bash
parcel build entry.js --detailed-report
parcel build entry.js --detailed-report 10
```

### Désactiver https

Par défaut : https désactivé

Disponible dans : `serve`, `watch` (écoute le HTTPS pour les connexions HMR)

```bash
parcel build entry.js --https
```

⚠️ Cet indicateur génère un certificat auto-signé. Vous devrez peut-être configurer votre navigateur pour autoriser les certificats auto-signés pour localhost.

### Définir un certificat personnalisé

Par défaut : https désactivé

Disponible dans : `serve`, `watch`

```bash
parcel entry.js --cert certificate.cert --key private.key
```

### Ouvrir dans le navigateur

Par défaut : ouverture désactivée

Disponible dans : `serve`

```bash
parcel entry.js --open
```

### Désactiver source-maps

Par défaut : source-maps activé

Disponible dans : `serve`, `watch`, `build`

```bash
parcel build entry.js --no-source-maps
```

### Désactiver le hachage du contenu

Par défaut : content-hash activé

Disponible dans : `build`

```bash
parcel build entry.js --no-content-hash
```

### Désactiver l'installation automatique de dépendances

Par défaut : autoinstall activé

Disponible dans : `serve`, `watch`

```bash
parcel entry.js --no-autoinstall
```

### Désactiver le HMR

Par défaut : HMR activé

Disponible dans : `serve`, `watch`

```bash
parcel entry.js --no-hmr
```

### Désactiver la minification

Par défaut : minification activée

Disponible dans : `build`

```bash
parcel build entry.js --no-minify
```

### Désactiver le cache du système de fichiers

Par défaut : cache activé

Disponible dans : `serve`, `watch`, `build`

```bash
parcel build entry.js --no-cache
```

### Exposer les modules en UMD

Par défaut : désactivé

Disponible dans : `serve`, `watch`, `build`

```bash
parcel serve entry.js --global myvariable
```

### Activer le support expérimental de scope hoisting/tree shaking

Par défaut : désactivé

Disponible dans : `build`

```bash
parcel build entry.js --experimental-scope-hoisting
```

Pour plus d'informations, consultez la [section Tree Shaking](https://medium.com/@devongovett/parcel-v1-9-0-tree-shaking-2x-faster-watcher-and-more-87f2e1a70f79#4ed3) de l'article de Devon Govett sur Parcel 1.9.
