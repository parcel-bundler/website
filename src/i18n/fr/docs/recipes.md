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
npm install --save preact-compat
npm install --save-dev parcel-bundler
npm install --save-dev babel-preset-preact
```

<sub>Ou si vous avez installé le gestionnaire de paquets Yarn</sub>

```bash
yarn add preact
yarn add preact-compat
yarn add --dev parcel-bundler
yarn add --dev babel-preset-preact
```

Ensuite, assurez-vous que la configuration Babel suivante est présente.

```javascript
// .babelrc
{
  "presets": [
    "preact"
 ]
}
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
