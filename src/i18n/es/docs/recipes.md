# 🍰 Recetas

## React

Primero necesitas instalar las dependencias para React.

[Entrada en el blog](http://blog.jakoblind.no/react-parcel/)

```
npm install --save react
npm install --save react-dom
npm install --save-dev parcel-bundler
npm install --save-dev babel-preset-env
npm install --save-dev babel-preset-react
```

<sub>O, si opcionalmente tienes instalado Yarn como gestor de paquetes</sub>

```
yarn add react
yarn add react-dom
yarn add --dev parcel-bundler
yarn add --dev babel-preset-env
yarn add --dev babel-preset-react
```

Luego, asegúrate que la siguiente configuración de Babel esté presente.

```javascript
 // .babelrc
{
  "presets": ["env", "react"]
}
```

Agrega el script de inicio a `package.json`

```javascript
// package.json
"scripts": {
  "start": "parcel index.html"
}
```

## Preact

Primero necesitas instalar las dependencias para Preact.

```
npm install --save preact
npm install --save-dev parcel-bundler
```

<sub>O, si opcionalmente tienes instalado Yarn como gestor de paquetes</sub>

```
yarn add preact
yarn add --dev parcel-bundler
```

Agrega el script de inicio a `package.json`

```javascript
// package.json
"scripts": {
  "start": "parcel index.html"
}
```
