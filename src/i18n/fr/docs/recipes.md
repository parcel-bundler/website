# 🍰 Recettes

## React

D'abord nous avons besoin d'installer les dépendances pour React.

[Article du blog](http://blog.jakoblind.no/react-parcel/)

```bash
npm install --save react
npm install --save react-dom
npm install --save-dev parcel-bundler
```

<sub>Ou si vous avez installé le gestionnaire de paquets Yarn</sub>

```bash
yarn add react
yarn add react-dom
yarn add --dev parcel-bundler
```

Ajoutez un script de démarrage à `package.json`

```javascript
// package.json
"scripts": {
  "start": "parcel index.html"
}
```

## Preact

D'abord vous avez besoin d'installer les dépendances pour Preact.

```bash
npm install --save preact
npm install --save-dev parcel-bundler
```

<sub>Ou si vous avez installé le gestionnaire de paquets Yarn</sub>

```bash
yarn add preact
yarn add --dev parcel-bundler
```

Ajoutez un script de démarrage à `package.json`

```javascript
// package.json
"scripts": {
  "start": "parcel index.html"
}
```

## Vue

D'abord vous avez besoin d'installer les dépendances pour Vue.

```bash
npm install --save vue
npm install --save-dev parcel-bundler
```

<sub>Ou si vous avez installé le gestionnaire de paquets Yarn</sub>

```bash
yarn add vue
yarn add --dev parcel-bundler
```

Ajoutez un script de démarrage à `package.json`

```javascript
// package.json
"scripts": {
  "start": "parcel index.html"
}
```

## TypeScript

D'abord installez les dépendances pour TypeScript

```bash
npm install --save-dev typescript
npm install --save-dev parcel-bundler
```

<sub>Ou si vous avez installé le gestionnaire de paquets Yarn</sub>

```bash
yarn add typescript --dev
yarn add --dev parcel-bundler
```

### Utiliser directement un fichier typescript depuis index.html

Ensuite, ajoutez le script `start` de démarrage au `package.json`

```javascript
// package.json
"scripts": {
  "start": "parcel index.html"
}
```

Puis, dans votre fichier `index.html`, importez directement le fichier `.ts`.

```html
<!-- index.html -->
<!DOCTYPE html>
<html lang="en">
  <head>
  </head>
  <body>
    <!-- Ici 👇 -->
    <script src="./myTypescriptFile.ts"></script>
  </body>
</html>
```

C'est tout !

### Compiler directement le fichier `.ts`

Ajoutez le script `start` de démarrage au `package.json`

```javascript
// package.json
"scripts": {
  "start": "parcel myTypescriptFile.ts"
}
```

Fini ! 😄 Le fichier `.js` compilé se trouve dans dossier `dist`.

## Bootstrap + FontAwesome

Nous devons d’abord installer les dépendances pour Bootstrap et FontAwesome.

```bash
npm install bootstrap jquery popper.js
npm install --save-dev parcel-bundler @fortawesome/fontawesome-free
```

<sub>Ou si vous avez le gestionnaire de package Yarn installé</sub>

```bash
yarn add bootstrap jquery popper.js
yarn add --dev parcel-bundler @fortawesome/fontawesome-free
```

Ajoutez un script Start dans le `package.json`

```javascript
// package.json
"scripts": {
  "start": "parcel index.html"
}
```

### Importer Bootstrap avec des styles précompilés

Créez un fichier JavaScript qui servira de point d'entrée pour votre application et importez les dépendances nécessaires.

```javascript
// main.js
import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.css' // Import precompiled Bootstrap css
import '@fortawesome/fontawesome-free/css/all.css'
```

Ensuite, dans votre fichier `index.html`, ajoutez une référence à votre point d'entrée JavaScript.

```html
<!-- index.html -->
<!DOCTYPE html>
<html lang="en">
  <head>
  </head>
  <body>
    <!-- Ici 👇 -->
    <script src="./main.js"></script>
  </body>
</html>
```

C'est fait !

### Personnaliser les styles Bootstrap

Si vous souhaitez personnaliser les styles Bootstrap au lieu d'importer le css précompilé, créez un fichier `.scss` comme point d'entrée et incluez les styles source de Bootstrap.

```scss
// main.scss
@import '~bootstrap/scss/bootstrap';
```

Puis, créez un fichier JavaScript qui servira de point d'entrée pour votre application et importez les dépendances nécessaires.

```javascript
// main.js
import 'bootstrap'
import '@fortawesome/fontawesome-free/css/all.css'
import './main.scss' // Import our scss file
```

Ensuite, dans votre fichier `index.html`, ajoutez une référence à votre point d'entrée JavaScript.

```html
<!-- index.html -->
<!DOCTYPE html>
<html lang="en">
  <head>
  </head>
  <body>
    <!-- Ici 👇 -->
    <script src="./main.js"></script>
  </body>
</html>
```

C'est fait !

## Svelte

Nous devons d’abord installer les dépendances pour Svelte.

[Article du blog](https://dev.to/alexparra/basic-svelte-app-with-parcel-30i5)

```bash
npm install --save-dev svelte
npm install --save-dev parcel-plugin-svelte
npm install --save-dev parcel-bundler
```

<sub>Ou si vous avez le gestionnaire de paquets Yarn installé</sub>

```bash
yarn add --dev svelte
yarn add --dev parcel-plugin-svelte
yarn add --dev parcel-bundler
```

### Compiler à partir de index.html

Ajoutez le script `start` au `package.json`

```javascript
// package.json
"scripts": {
  "start": "parcel src/index.html"
}
```

Ensuite, dans votre fichier `index.html`, ajoutez une référence à votre point d’entrée JavaScript.

```html
<!-- .src/index.html -->
<!DOCTYPE html>
<html lang="en">
<head>
  <title>Mon App Svelte</title>
</head>
<body>
    <!-- Ici 👇 -->
    <script src="./src/main.js"></script>
</body>
</html>
```

C'est fait !
