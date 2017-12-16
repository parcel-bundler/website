# 🍰 Рецепты

## React

Сначала необходимо установить зависимости для React.

[Blog Post](http://blog.jakoblind.no/react-parcel/)

```
npm install --save react
npm install --save react-dom
npm install --save-dev parcel-bundler
npm install --save-dev babel-preset-env
npm install --save-dev babel-preset-react
```

<sub>Или, если у вас установлен менеджер пакетов Yarn</sub>

```
yarn add react
yarn add react-dom
yarn add --dev parcel-bundler
yarn add --dev babel-preset-env
yarn add --dev babel-preset-react
```

Затем убедитесь, что присутствует следующая конфигурация Babel.

```javascript
 // .babelrc
{
  "presets": ["env", "react"]
}
```

Добавьте скрипт запуска в `package.json`

```javascript
// package.json
"scripts": {
  "start": "parcel index.html"
}
```

## Preact

Сначала нам нужно установить зависимости для Preact.

```
npm install --save preact
npm install --save preact-compat
npm install --save-dev parcel-bundler
npm install --save-dev babel-preset-env
npm install --save-dev babel-preset-preact
```

<sub>Или, если у вас установлен менеджер пакетов Yarn</sub>

```
yarn add preact
yarn add preact-compat
yarn add --dev parcel-bundler
yarn add --dev babel-preset-env
yarn add --dev babel-preset-preact
```

Затем убедитесь, что присутствует следующая конфигурация Babel.

```javascript
// .babelrc
{
  "presets": ["env", "preact"]
}
```

Добавьте скрипт запуска в `package.json`

```javascript
// package.json
"scripts": {
  "start": "parcel index.html"
}
```
