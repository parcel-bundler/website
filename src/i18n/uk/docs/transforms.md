# 🐠 Трансформації

Хоча багато пакувальників вимагають установки і налаштування плагінів для трансформації ресурсів, Parcel підтримує безліч поширених перетворень і транспіляторів з коробки. Ви можете перетворювати JavaScript, використовуючи [Babel](https://babeljs.io), CSS за допомогою [PostCSS](http://postcss.org) і HTML через [PostHTML](https://github.com/posthtml/posthtml). Parcel автоматично запускає ці перетворення, коли знаходить конфігураційний файл (наприклад, `.babelrc`,`.postcssrc`) в модулі.

Це навіть працює для сторонніх пакетів в `node_modules`: якщо файл конфігурації публікується як частина пакету, перетворення автоматично включається тільки для цього модуля. Це прискорює зв'язування (bundling), оскільки обробляються тільки модулі, які необхідно перетворити. Це також означає, що вам не потрібно вручну налаштовувати перетворення для включення і виключення певних файлів, а також знати, як створюється сторонній код для використання його в додатку.

## Babel

[Babel](https://babeljs.io) є популярним транспілятором для JavaScript з великою екосистемою плагінів. Використання Babel з Parcel працює так само, як використання його окремо або з іншими пакувальниками.

Установка пресетів і плагінів в додатку:

```bash
yarn add babel-preset-env
```

Потім створіть `.babelrc`:

```json
{
  "presets": ["env"]
}
```

## PostCSS

[PostCSS](http://postcss.org) - це інструмент для перетворення CSS за допомогою плагінів, таких як [autoprefixer](https://github.com/postcss/autoprefixer), [cssnext](http://cssnext.io/) і [CSS Modules](https://github.com/css-modules/css-modules). Ви можете налаштувати PostCSS за допомогою Parcel, створивши конфігураційний файл, використовуючи одне з наступних імен: `.postcssrc` (JSON),`.postcssrc.js` або `postcss.config.js`.

Установка плагінів в додатку:

```bash
yarn add postcss-modules autoprefixer
```

Потім створіть `.postcssrc`:

```json
{
  "modules": true,
  "plugins": {
    "autoprefixer": {
      "grid": true
    }
  }
}
```

Модулі вказуються в об'єкті `plugins` як ключі, а опції визначаються з використанням значень об'єкта. Якщо для плагіна немає параметрів, просто встановіть замість цього значення `true`.

Цільові (?) Браузери для Autoprefixer, cssnext і інших подібних інструментів, вказуються у файлі `.browserslistrc`:

```
> 1%
last 2 versions
```

Модулі CSS підтримуються трохи інакше, використовуючи верхній рівень ключів `modules`. Це пов'язано з тим, що Parcel потребує спеціальної підтримки CSS-модулів, оскільки вони експортують об'єкт, який також буде включений в JavaScript бандл. Зверніть увагу, що вам все одно необхідно встановити `postcss-modules` в ваш проект.

## PostHTML

[PostHTML](https://github.com/posthtml/posthtml) - інструмент для перетворення HTML за допомогою плагінів. Ви можете налаштувати PostHTML за допомогою Parcel, створивши конфігураційний файл, використовуючи одне з наступних імен: `.posthtmlrc` (JSON),`.posthtmlrc.js` або `posthtml.config.js`.

Установка плагінів в додатку:

```bash
yarn add posthtml-img-autosize
```

Потім створіть `.posthtmlrc`:

```json
{
  "plugins": {
    "posthtml-img-autosize": {
      "root": "./images"
    }
  }
}
```

Модулі вказуються в об'єкті `plugins` в якості ключів, а опції визначаються з використанням значень об'єкта. Якщо для плагіна немає параметрів, просто встановіть замість цього значення `true`.

## TypeScript

[TypeScript](https://www.typescriptlang.org/) - збірна надмножина JavaScript, яке компілює код до звичайного JavaScript, який також підтримує сучасні можливості ES2015+. Перетворення TypeScript працює без будь-яких додаткових налаштувань.

```html
<!-- index.html -->
<html>
<body>
  <script src="./index.ts"></script>
</body>
</html>
```

```typescript
// index.ts
import message from './message'
console.log(message)
```

```typescript
// message.ts
export default 'Hello, world'
```

## ReasonML/BuckleScript

[ReasonML](https://reasonml.github.io/) компілює OCaml в JavaScript за допомогою [BuckleScript](https://bucklescript.github.io). Ви можете використовувати ReasonML, встановивши залежності і створивши `bsconfig.json`:

```bash
$ yarn add bs-platform --dev
```

```json
// bsconfig.json
// из https://github.com/BuckleScript/bucklescript/blob/master/jscomp/bsb/templates/basic-reason/bsconfig.json

{
  "name": "whatever",
  "sources": {
    "dir": "src",
    "subdirs": true
  },
  "package-specs": {
    "module": "commonjs",
    "in-source": true
  },
  "suffix": ".bs.js",
  "bs-dependencies": [],
  "warnings": {
    "error": "+101"
  },
  "namespace": true,
  "refmt": 3
}
```

```html
<!-- index.html -->
<html>
<body>
  <script src="./src/index.re"></script>
</body>
</html>
```

```reason
/* src/index.re */
print_endline("Hello World");
```

### ReasonReact

[ReasonReact](https://reasonml.github.io/reason-react/) - це прив'язка React для ReasonML. Ви також можете використовувати її з Parcel:

```bash
$ yarn add react react-dom reason-react
```

```diff
// bsconfig.json

{
  "name": "whatever",
+ "reason": {
+   "react-jsx": 2
+ },
  "sources": {
    "dir": "src",
    "subdirs": true
  },
  "package-specs": {
    "module": "commonjs",
    "in-source": true
  },
  "suffix": ".bs.js",
  "bs-dependencies": [
+   "reason-react"
  ],
  "warnings": {
    "error": "+101"
  },
  "namespace": true,
  "refmt": 3
}
```

```diff
<!-- index.html -->
<html>
<body>
+  <div id="app"></div>
  <script src="./src/index.re"></script>
</body>
</html>
```

```reason
/* src/Greeting.re */

let component = ReasonReact.statelessComponent("Greeting");

let make = (~name, _children) => {
  ...component,
  render: _self => <div> (ReasonReact.string("Hello! " ++ name)) </div>,
};
```

```reason
/* src/index.re */

ReactDOMRe.renderToElementWithId(<Greeting name="Parcel" />, "app");
```
