# 🚀 Commencer

Parcel est un empaqueteur d'application web, qui se différencie par son expérience de développement. Il offre des performances ultra-rapides grâce au traitement multicœur et ne nécessite aucune configuration.

Commencez par installer Parcel en utilisant Yarn ou npm :

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
REMARQUE : Parcel convertit les ressources JS en ES5, elles ne s'exécuteront pas dans le contexte d'une balise avec `<script type="module">`, donc utilisez simplement des balises `<script>` simples sans attribut `type` dans votre source HTML.

```javascript
console.log('hello world')
```

Parcel a un serveur de développement intégré, qui reconstruira automatiquement votre application lorsque vous modifiez des fichiers et il prend en charge un [module de remplacement à chaud](hmr.html) pour un développement plus rapide. Faites-le pointer sur votre fichier d'entrée :

```bash
parcel index.html
```

Maintenant ouvrez http://localhost:1234/ dans votre navigateur. Si le remplacement de module à chaud ne fonctionne pas, vous devez peut-être [configurer votre éditeur](hmr.html#safe-write). Vous pouvez également remplacer le port par défaut avec l'option `-p <numéro de port>`.

Utilisez le serveur de développement lorsque vous n'avez pas votre propre serveur ou si votre application est entièrement exécutée côté client. Si vous avez votre propre serveur, vous pouvez lancer Parcel en mode `watch` à la place. Cela permet de reconstruire automatiquement lorsque les fichiers changent et de prendre en charge le remplacement de module à chaud, mais ne démarre pas un serveur Web.

```bash
parcel watch index.html
```

Vous pouvez aussi utiliser [createapp.dev](https://createapp.dev/parcel) pour créer un projet Parcel dans le navigateur. Sélectionnez les fonctionnalités dont vous avez besoin, telles que React, Vue, Typescript et CSS, et le projet sera généré en temps réel. Vous pouvez utiliser cet outil pour apprendre à configurer un nouveau projet. Vous pouvez également télécharger le projet sous forme de fichier ZIP et commencer à coder immédiatement.

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

_REMARQUE :_ Si vous avez une structure de fichier comme celle-ci :

```
- répertoire-1
-- index.html
- répertoire-2
-- index.html
```

La recherche vers http://localhost:1234/répertoire-1/ ne fonctionnera pas, à la place, vous devez indiquer explicitement le fichier http://localhost:1234/répertoire-1/index.html.

### Construction pour la production

Lorsque vous êtes prêt à construire les fichiers finaux utilisés pour la production, le mode `build` arrête de scruter les modifications et ne construit qu'une seule fois. Consultez la section [Production](production.html) pour plus de détails.

### Ajout de Parcel à vos projets

Parfois, il n'est pas possible d'installer Parcel globalement, par exemple si vous utilisez l'agent de génération de quelqu'un d'autre ou si vous souhaitez utiliser un CI pour générer votre projet par programme. Dans ce cas, vous pouvez installer et exécuter Parcel en tant que package local.

Pour l'installer avec Yarn :

```bash
yarn add parcel-bundler --dev
```

Pour l'installer avec NPM:

```bash
npm install parcel-bundler --save-dev
```

Ajoutez ensuite ces scripts de tâches à votre projet, en modifiant votre `package.json`:

```json
{
  "scripts": {
    "dev": "parcel <votre fichier d entrée>",
    "build": "parcel build <votre fichier d entrée>"
  }
}
```

Ensuite, vous pourrez les exécuter:

```bash
# Pour exécuter en mode développment
yarn dev
#ou
npm run dev

# Pour exécuter en mode production
yarn build
#ou
npm run build
```
