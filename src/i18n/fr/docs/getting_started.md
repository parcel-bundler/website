# 🚀 Commencer

Parcel est un empaqueteur d'application web, qui se différencie par son expérience de développement. Il offre des performances ultra-rapides grâce au traitement multicœur et ne nécessite aucune configuration.

Commencez par installer Parcel en utilisant Yarn ou npm :

```bash
# Yarn
yarn global add parcel-bundler

# npm
npm install -g parcel-bundler
```

Créez un fichier package.json dans le répertoire de votre projet en utilisant :

```bash
# Yarn
yarn init -y

# npm
npm init -y
```

Parcel peut prendre n'importe quel type de fichier comme point d'entrée, mais un fichier HTML ou JavaScript est un bon point de départ. Si vous liez votre fichier JavaScript principal dans le code HTML en utilisant un chemin relatif, Parcel le traitera également pour vous et remplacera la référence par une URL dans le fichier en sortie.

Ensuite, créez un fichier index.html et index.js.

```html
<html>
<body>
  <script src="./index.js"></script>
</body>
</html>
```

```javascript
console.log("hello world");
```

Parcel a un serveur de développement intégré, qui reconstruira automatiquement votre application lorsque vous modifiez des fichiers et il prend en charge un [module de remplacement à chaud](hmr.html) pour un développement plus rapide. Il suffit de le faire pointer sur votre fichier d'entrée :

```bash
parcel index.html
```

Maintenant ouvrez http://localhost:1234/ dans votre navigateur. Si le remplacement de module à chaud ne fonctionne pas, vous devez peut-être [configurer votre éditeur](hmr.html#safe-write). Vous pouvez également remplacer le port par défaut avec l'option `-p <numéro de port>`.

Utilisez le serveur de développement lorsque vous n'avez pas votre propre serveur ou si votre application est entièrement exécutée côté client. Si vous avez votre propre serveur, vous pouvez lancer Parcel en mode `watch` à la place. Cela permet de reconstruire automatiquement lorsque les fichiers changent et de prendre en charge le remplacement de module à chaud, mais ne démarre pas un serveur Web.

```bash
parcel watch index.html
```

### Plusieurs fichiers comme point d'entrée

Si vous avez plusieurs fichiers comme point d'entrée, disons `index.html` et `about.html`, vous avez deux façons d'exécuter l'empaqueteur :

En spécifiant les noms des fichiers :
```bash
parcel index.html about.html
```

Utilisez des tokens et créez un glob :
```bash
parcel *.html
```

*REMARQUE :* Si vous avez une structure de fichier comme celle-ci :
```
- répertoire-1
-- index.html
- répertoire-2
-- index.html
```

La recherche vers http://localhost:1234/folder-1/ ne fonctionnera pas, à la place, vous devez indiquer explicitement le fichier http://localhost:1234/folder-1/index.html.

### Construction pour la production

Lorsque vous êtes prêt à construire les fichiers finals utilisés pour la production, le mode `build` arrête de scruter les modifications et ne construit qu'une seule fois. Consultez la section [Production](production.html) pour plus de détails.
