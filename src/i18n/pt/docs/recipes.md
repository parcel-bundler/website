# 🍰 Receitas

## React

Primeiro instale as dependências do React.

[Blog Post](http://blog.jakoblind.no/react-parcel/)

```
npm install --save react
npm install --save react-dom
npm install --save-dev parcel-bundler
npm install --save-dev babel-preset-env
npm install --save-dev babel-preset-react
```

<sub>Caso você tenha o Yarn instalado</sub>

```
yarn add react
yarn add react-dom
yarn add --dev parcel-bundler
yarn add --dev babel-preset-env
yarn add --dev babel-preset-react
```

Em seguida, verifique se a configuração do Babel está presente.

```javascript
 // .babelrc
{
  "presets": ["env", "react"]
}
```

Adicione o script Start no `package.json`

```javascript
// package.json
"scripts": {
  "start": "parcel index.html"
}
```

## Preact

Primeiro instale as dependências do Preact.

```
npm install --save preact
npm install --save preact-compat
npm install --save-dev parcel-bundler
npm install --save-dev babel-preset-env
npm install --save-dev babel-preset-preact
```

<sub>Caso você tenha o Yarn instalado</sub>

```
yarn add preact
yarn add preact-compat
yarn add --dev parcel-bundler
yarn add --dev babel-preset-env
yarn add --dev babel-preset-preact
```

Em seguida, verifique se a configuração do Babel está presente.

```javascript
// .babelrc
{
  "presets": ["env", "preact"]
}
```

Adicione o script Start no `package.json`

```javascript
// package.json
"scripts": {
  "start": "parcel index.html"
}
```
