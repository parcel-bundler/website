# 🍰 Рецепти

## React

Спочатку необхідно встановити залежності для React.

[Запис в блозі](http://blog.jakoblind.no/react-parcel/)

```Bash
npm install --save react
npm install --save react-dom
npm install --save-dev parcel-bundler
npm install --save-dev babel-preset-env
npm install --save-dev babel-preset-react
```

<sub>Або, якщо у вас встановлений менеджер пакетів Yarn</sub>

```Bash
yarn add react
yarn add react-dom
yarn add --dev parcel-bundler
yarn add --dev babel-preset-env
yarn add --dev babel-preset-react
```

Потім додайте скрипт запуску в `package.json`

```Javascript
// package.json
"Scripts": {
  "Start": "parcel index.html"
}
```

## Preact

Спочатку нам потрібно встановити залежності для Preact.

```Bash
npm install --save preact
npm install --save-dev parcel-bundler
```

<sub> Або, якщо у вас встановлений менеджер пакетів Yarn </sub>

```Bash
yarn add preact
yarn add --dev parcel-bundler
```

Потім додайте скрипт запуску в `package.json`

```Javascript
// package.json
"Scripts": {
  "Start": "parcel index.html"
}
```

## Vue

Спочатку нам потрібно встановити залежності для Vue.

```Bash
npm install --save vue
npm install --save-dev parcel-bundler
```

<sub> Або, якщо у вас встановлений менеджер пакетів Yarn </sub>

```Bash
yarn add vue
yarn add --dev parcel-bundler
```

Потім додайте скрипт запуску в `package.json`

```Javascript
// package.json
"Scripts": {
  "Start": "parcel index.html"
}
```
