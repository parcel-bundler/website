# 🚀 Commencer

Parcel est un empaqueteur d'application web, qui se différencie par son expérience de développeur. Il offre des performances ultra-rapides grâce au traitement multicœur et ne nécessite aucune configuration.

Veuillez d'abord installer Parcel en utilisant Yarn ou npm :

Yarn :
```bash
yarn global add parcel-bundler
```

npm :
```bash
npm install -g parcel-bundler
```

Créez un fichier package.json dans le répertoire de votre projet en utilisant :

```bash
yarn init -y
```
ou
```bash
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

Maintenant ouvrez http://localhost:1234/ dans votre navigateur. Vous pouvez également remplacer le port par défaut avec l'option `-p <numéro de port>`.

Utilisez le serveur de développement lorsque vous n'avez pas votre propre serveur ou si votre application est entièrement rendue par le client. Si vous avez votre propre serveur, vous pouvez exécuter à la place Parcel en mode `watch`. Cela permet de reconstruire automatiquement lorsque les fichiers changent et ça prend en charge le remplacement de module à chaud, mais ça ne démarre pas un serveur Web.

```bash
parcel watch index.html
```

Lorsque vous êtes prêt à construire pour la production, le mode `build` arrête de scruter les modifications et construit qu'une seule fois. Consultez la section [Production](production.html) pour plus de détails.
