# 🍰 Recetas

## React

Primero se necesita instalar las dependencias para React.

[Entrada en el blog](http://blog.jakoblind.no/react-parcel/)

```
npm install --save react
npm install --save react-dom
npm install --save-dev parcel-bundler
npm install --save-dev babel-preset-env
npm install --save-dev babel-preset-react
```

<sub>O, si opcionalmente tiene instalado Yarn como gestor de paquetes</sub>

```
yarn add react
yarn add react-dom
yarn add --dev parcel-bundler
yarn add --dev babel-preset-env
yarn add --dev babel-preset-react
```

Luego, asegúrese que la siguiente configuración de Babel esté presente.

```javascript
 // .babelrc
{
  "presets": ["env", "react"]
}
```

Agregue el script de Inicio a `package.json`

```javascript
// package.json
"scripts": {
  "start": "parcel index.html"
}
```

## Preact

Primero se necesita instalar las dependencias para Preact.

```
npm install --save preact
npm install --save preact-compat
npm install --save-dev parcel-bundler
npm install --save-dev babel-preset-env
npm install --save-dev babel-preset-preact
```

<sub>O, si opcionalmente tiene instalado Yarn como gestor de paquetes</sub>

```
yarn add preact
yarn add preact-compat
yarn add --dev parcel-bundler
yarn add --dev babel-preset-env
yarn add --dev babel-preset-preact
```

Luego, asegúrese que la siguiente configuración de Babel esté presente.

```javascript
// .babelrc
{
  "presets": ["env", "preact"]
}
```

Agregue el script de Inicio a `package.json`

```javascript
// package.json
"scripts": {
  "start": "parcel index.html"
}
```
