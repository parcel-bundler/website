# 🍰 Рецепты

## React

Сначала необходимо установить зависимости для React.

[Запись в блоге](http://blog.jakoblind.no/react-parcel/)

```bash
npm install --save react
npm install --save react-dom
npm install --save-dev parcel-bundler
npm install --save-dev babel-preset-env
npm install --save-dev babel-preset-react
```

<sub>Или, если у вас установлен менеджер пакетов Yarn</sub>

```bash
yarn add react
yarn add react-dom
yarn add --dev parcel-bundler
yarn add --dev babel-preset-env
yarn add --dev babel-preset-react
```

Затем добавьте скрипт запуска в `package.json`

```javascript
// package.json
"scripts": {
  "start": "parcel index.html"
}
```

## Preact

Сначала нам нужно установить зависимости для Preact.

```bash
npm install --save preact
npm install --save-dev parcel-bundler
```

<sub>Или, если у вас установлен менеджер пакетов Yarn</sub>

```bash
yarn add preact
yarn add --dev parcel-bundler
```

Затем добавьте скрипт запуска в `package.json`

```javascript
// package.json
"scripts": {
  "start": "parcel index.html"
}
```

## Vue

Сначала нам нужно установить зависимости для Vue.

```bash
npm install --save vue
npm install --save-dev parcel-bundler
```

<sub>Или, если у вас установлен менеджер пакетов Yarn</sub>

```bash
yarn add vue
yarn add --dev parcel-bundler
```

Затем добавьте скрипт запуска в `package.json`

```javascript
// package.json
"scripts": {
  "start": "parcel index.html"
}
```
