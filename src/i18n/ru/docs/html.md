# HTML

_Поддерживаемые расширения: `htm`, `html`_

Ресурсы HTML часто являются входными файлами, которые вы предоставляете в Parcel, но на них также могут ссылаться файлы JavaScript, например размещая ссылки на другие страницы. URL скриптов, стилей, медиа и других HTML файлов извлекаются и компилируются, как описано выше. Ссылки переписываются в HTML, чтобы они ссылались на правильные файлы. Все имена файлов должны быть относительно текущего файла HTML.

```html
<html>
  <body>
    <!-- ссылка на изображение -->
    <img src="./images/header.png" />

    <a href="./other.html">Link to another page</a>

    <!-- импорт JavaScript пакета -->
    <script src="./index.js"></script>
  </body>
</html>
```

## Импорт HTML в JavaScript

Импорт HTML в JavaScript не включает статические HTML строки, но файлы HTML будут динамически извлекаться с помощью [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API). Для достижения поддержки Internet Explorer 11 и более старых браузеров необходимо использовать полифилы для `Promise` и `fetch`.

## Импорт некомпилированных ресурсов

Поддерживается добавление ссылок на файлы, которые Parcel может компилировать (например JavaScript, TypeScript, SCSS, и т.д.) в HTML. Parcel автоматически обработает файлы и обновит ссылку, чтобы указать на скомпилированные ресурсы.

```html
<html>
  <head>
    <!-- включает SCSS файл -->
    <link rel="stylesheet" href="./my-styles/style.scss" />
  </head>
</html>
```

# PostHTML

[PostHTML](https://github.com/posthtml/posthtml) - это инструмент для преобразования HTML с помощью плагинов. Вы можете конфигурировать PostHTML с Parcel, создав файл конфигураций с одним из следующих имен: `.posthtmlrc` (JSON), `.posthtmlrc.js`, or `posthtml.config.js`

Установите плагины в вашем приложении:

```bash
yarn add posthtml-img-autosize
```

Затем создайте `.posthtmlrc`:

```json
{
  "plugins": {
    "posthtml-img-autosize": {
      "root": "./images"
    },
    "posthtml-modules": {
      "root": "./src"
    }
  }
}
```

Плагины указываются в объекте `plugins` как ключи, а параметры определяются как значение объекта. Если для плагина нет опций просто используйте `true`.

При импорте модулей с использованием `posthtml-modules`, если вы начинаете пусть с `/` они станут относительно `./src`.

# htmlnano

Parcel автоматически обрабатывает все HTML ресурсы с помощью [htmlnano](https://github.com/posthtml/htmlnano), когда включена минификация. htmlnano может быть настроен в соответствии с его документацией с помощью `.htmlnanorc` (JSON) или `.htmlnanorc.js` файла, например:

```json
{
  "removeComments": false
}
```
