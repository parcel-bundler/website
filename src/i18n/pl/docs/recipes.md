# 🍰 Przepisy

## React

Najpierw należy zainstalować zależności potrzebne dla React.

[Wpis na blogu](http://blog.jakoblind.no/react-parcel/)

```bash
npm install --save react
npm install --save react-dom
npm install --save-dev parcel-bundler
npm install --save-dev babel-preset-env
npm install --save-dev babel-preset-react
```

<sub>Lub, jeśli używasz Yarn:</sub>

```bash
yarn add react
yarn add react-dom
yarn add --dev parcel-bundler
yarn add --dev babel-preset-env
yarn add --dev babel-preset-react
```

Następnie upewnij się, że w projekcie znajduje się poniższa konfiguracja Babel:

```javascript
 // .babelrc
{
  "presets": ["env", "react"]
}
```

Dodaj skrypt startowy do `package.json`:

```javascript
// package.json
"scripts": {
  "start": "parcel index.html"
}
```

## Preact

Najpierw należy zainstalować zależności potrzebne dla Preact.

```bash
npm install --save preact
npm install --save preact-compat
npm install --save-dev parcel-bundler
npm install --save-dev babel-preset-env
npm install --save-dev babel-preset-preact
```

<sub>Lub, jeśli używasz Yarn:</sub>

```bash
yarn add preact
yarn add preact-compat
yarn add --dev parcel-bundler
yarn add --dev babel-preset-env
yarn add --dev babel-preset-preact
```

Następnie upewnij się, że w projekcie znajduje się poniższa konfiguracja Babel:

```javascript
// .babelrc
{
  "presets": ["env", "preact"]
}
```

Dodaj skrypt startowy do `package.json`:

```javascript
// package.json
"scripts": {
  "start": "parcel index.html"
}
```

## Vue

Najpierw należy zainstalować zależności potrzebne dla Vue:

```bash
npm install --save vue
npm install --save-dev parcel-bundler
```

<sub>Lub, jeśli używasz Yarn:</sub>

```bash
yarn add vue
yarn add --dev parcel-bundler
```

Dodaj skrypt startowy do `package.json`:

```javascript
// package.json
"scripts": {
  "start": "parcel index.html"
}
```
