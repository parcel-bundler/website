# 🐠 Трансформации

Хотя многие упаковщики требуют установки и настройки плагинов для трансформации ресурсов, Parcel поддерживает множество распространённых преобразований и транспиляторов из коробки. Вы можете преобразовывать JavaScript, используя [Babel](https://babeljs.io), CSS с помощью [PostCSS](http://postcss.org) и HTML через [PostHTML](https://github.com/posthtml/posthtml). Parcel автоматически запускает эти преобразования, когда находит конфигурационный файл (например, `.babelrc`, `.postcssrc`) в модуле.

Это даже работает для сторонних пакетов в `node_modules`: если файл конфигурации публикуется как часть пакета, преобразование автоматически включается только для этого модуля. Это ускоряет связывание (bundling), поскольку обрабатываются только модули, которые необходимо преобразовать. Это также означает, что вам не нужно вручную настраивать преобразования для включения и исключения определённых файлов, а также знать, как создаётся сторонний код для использования его в приложении.

## Babel

[Babel](https://babeljs.io) является популярным транспилером для JavaScript с большой экосистемой плагинов. Использование Babel с Parcel работает так же, как использование его отдельно или с другими упаковщиками.

Установка пресетов и плагинов в приложении:

```bash
yarn add @babel/preset-react
```

Затем создайте `.babelrc`:

```json
{
  "presets": ["@babel/preset-react"]
}
```

### Транспиляция babel'ем по умолчанию

Parcel транспилирует ваш код с пресетом `@babel/preset-env` по умолчанию, с его помощью каждый внутренний (локальные require'ы) и внешние (node_modules) будут транспилировны под указанный target.

## PostCSS

[PostCSS](http://postcss.org) - это инструмент для преобразования CSS с помощью плагинов, таких как [autoprefixer](https://github.com/postcss/autoprefixer), [cssnext](http://cssnext.io/) и [CSS Modules](https://github.com/css-modules/css-modules). Вы можете настроить PostCSS с помощью Parcel, создав конфигурационный файл, используя одно из следующих имен: `.postcssrc` (JSON), `.postcssrc.js` или `postcss.config.js`.

Установка плагинов в приложении:

```bash
yarn add postcss-modules autoprefixer
```

Затем создайте `.postcssrc`:

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

Плагины указываются в объекте `plugins` как ключи, а опции определяются с использованием значений объекта. Если для плагина нет параметров, просто установите вместо этого значение `true`.

Целевые (?) браузеры для Autoprefixer, cssnext и других подобных инструментов, указываются в файле `.browserslistrc`:

```
> 1%
last 2 versions
```

Модули CSS поддерживаются несколько иначе, используя верхний уровень ключей `modules`. Это связано с тем, что Parcel нуждается в специальной поддержке CSS-модулей, поскольку они экспортируют объект, который также будет включен в JavaScript бандл. Обратите внимание, что вам все равно необходимо установить `postcss-modules` в ваш проект.

## PostHTML

[PostHTML](https://github.com/posthtml/posthtml) - инструмент для преобразования HTML с помощью плагинов. Вы можете настроить PostHTML с помощью Parcel, создав конфигурационный файл, используя одно из следующих имен: `.posthtmlrc` (JSON), `.posthtmlrc.js` или `posthtml.config.js`.

Установка плагинов в приложении:

```bash
yarn add posthtml-img-autosize
```

Далее, создайте `.posthtmlrc`:

```json
{
  "plugins": {
    "posthtml-img-autosize": {
      "root": "./images"
    }
  }
}
```

Плагины указываются в объекте `plugins` в качестве ключей, а опции определяются с использованием значений объекта. Если для плагина нет параметров, просто установите вместо этого значение `true`.

## TypeScript

[TypeScript](https://www.typescriptlang.org/) - типизированное надмножество JavaScript, которое компилирует код до обычного JavaScript, который также поддерживает современные возможности ES2015+. Преобразование TypeScript работает без всякой дополнительной настройки.

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

[ReasonML](https://reasonml.github.io/) компилирует OCaml в JavaScript с помощью [BuckleScript](https://bucklescript.github.io). Вы можете использовать ReasonML, установив зависимости и создав `bsconfig.json`:

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

[ReasonReact](https://reasonml.github.io/reason-react/) - это привязка React для ReasonML. Вы также можете использовать её с Parcel:

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
