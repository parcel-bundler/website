# 🍰 Recetas

## React

Primero instala las dependencias para React.

[Blog Post](http://blog.jakoblind.no/react-parcel/)

```
npm install --save react
npm install --save react-dom
npm install --save-dev parcel-bundler
npm install --save-dev babel-preset-env
npm install --save-dev babel-preset-react
```

<sub>O si tienes instalado Yarn</sub>

```
yarn add react
yarn add react-dom
yarn add --dev parcel-bundler
yarn add --dev babel-preset-env
yarn add --dev babel-preset-react
```

Luego asegúrese de que la siguiente configuración de Babel esté presente.

```javascript
 // .babelrc
{
  "presets": ["env", "react"]
}
```

Agregue el script de inicio a `package.json`

```javascript
// package.json
"scripts": {
  "start": "parcel index.html"
}
```

## Preact

Primero tenemos que instalar las dependencias para Preact.

```
npm install --save preact
npm install --save preact-compat
npm install --save-dev parcel-bundler
npm install --save-dev babel-preset-env
npm install --save-dev babel-preset-preact
```

<sub>O si tienes instalado Yarn</sub>

```
yarn add preact
yarn add preact-compat
yarn add --dev parcel-bundler
yarn add --dev babel-preset-env
yarn add --dev babel-preset-preact
```

Luego asegúrese de que la siguiente configuración de Babel esté presente.

```javascript
// .babelrc
{
  "presets": ["env", "preact"]
}
```

Add Start script to `package.json`

```javascript
// package.json
"scripts": {
  "start": "parcel index.html"
}
```
