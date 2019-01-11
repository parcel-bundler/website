# ✂️ Découpage du code

Parcel prend en charge le découpage de code sans aucune configuration. Cela vous permet de diviser le code de votre application en plusieurs paquets pouvant être chargés à la demande, ce qui signifie des paquets initiaux plus petits et des temps de chargement plus rapides. Au fur et à mesure que l'utilisateur navigue dans votre application et que des modules sont nécessaires, Parcel s'occupe de charger automatiquement les paquets enfant à la demande.

Le découpage du code est contrôlé par l'utilisation de la fonction dynamique `import()` décrite par la [proposition de syntaxe](https://github.com/tc39/proposal-dynamic-import), qui fonctionne comme l'instruction normale `import` ou la fonction `require`, mais retourne une promesse. Cela signifie que le module est chargé de manière asynchrone.

## Utilisation des importations dynamiques

L'exemple suivant montre comment utiliser les importations dynamiques pour charger une sous-page de votre application à la demande.

```javascript
// pages/about.js
export function render() {
  // Donne le rendu de la page
}
```

```javascript
import('./pages/about').then(function(page) {
  // Donne le rendu de la page
  page.render()
})
```

## Importations dynamiques avec async/await

Comme `import()` renvoie une promesse, vous pouvez aussi utiliser la syntaxe async/await. Vous aurez probablement besoin de configurer Babel pour transpiler la syntaxe, pour qu'elle soit supportée par la plupart des navigateurs.

```javascript
const page = await import('./pages/about')
// Donne le rendu de la page
page.render()
```

Les importations dynamiques sont également chargées à la volée dans Parcel, donc vous pouvez toujours mettre tous vos appels `import()` en haut de votre fichier et les paquets enfants ne seront pas chargés tant qu'ils ne seront pas utilisés. L'exemple suivant montre comment charger à la volée des sous-pages d'une application.

```javascript
// Configure une map des noms de page pour les importations dynamiques.
// Celles-ci ne sont pas chargées tant qu'elles ne seront pas utilisées
const pages = {
  about: import('./pages/about'),
  blog: import('./pages/blog')
}

async function renderPage(name) {
  // Charge à la volée la page demandée.
  const page = await pages[name]
  return page.render()
}
```

**Remarque :** Si vous souhaitez utiliser async/await dans les navigateurs qui ne le supportent pas nativement, n'oubliez pas d'inclure `babel-polyfill` dans votre application ou `babel-runtime` + `babel-plugin-transform-runtime` en bibliothèques.

```bash
yarn add babel-polyfill
```

```javascript
import 'babel-polyfill'
import './app'
```

Consultez les docs sur [babel-polyfill](http://babeljs.io/docs/usage/polyfill) et [babel-runtime](http://babeljs.io/docs/plugins/transform-runtime).

## Résolution de paquet

Parcel déduit automatiquement l'emplacement des paquets. Ceci est fait dans le module [bundle-url](https://github.com/parcel-bundler/parcel/blob/master/packages/core/parcel-bundler/src/builtins/bundle-url.js) et utilise la stack trace pour déterminer le chemin où le paquet initial a été chargé.

Cela signifie que vous n'avez pas besoin de configurer l'emplacement de chargement des paquets, mais vous devez également les fournir à partir du même emplacement.

Actuellement, Parcel résout les paquets des protocoles suivants : `http`, `https`, `file`, `ftp`, `chrome-extension` et `moz-extension`.
