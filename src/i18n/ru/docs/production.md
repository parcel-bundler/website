# ✨ Работа в продакшене

Когда придет время выпустить ваше приложение в продакшен, используйте `production` режим.

```bash
parcel build entry.js
```

Это отключает режим просмотра и горячую замену модулей и ваше приложение будет построено только один раз и позволяет минимизировать все выходные бандлы для уменьшения размера файла. Минификаторы, используемые Parcel, это: [uglify-es](https://github.com/mishoo/UglifyJS2/tree/harmony) для JavaScript, [cssnano](http://cssnano.co) для CSS и [htmlnano](https://github.com/posthtml/htmlnano) для HTML.

Включение продакшен режима также устанавливает `NODE_ENV=production` для переменной среды. Большие библиотеки, такие как React, имеют только отладочные функции разработки, которые отключены, устанавливая эту переменную среды, что приводит к меньшим и быстрым сборкам для продакшена.

### Опции

#### Задайте выходную директорию

По-умолчанию: "dist"

```bash
parcel build entry.js --out-dir build/output
# или
parcel build entry.js -d build/output
```

```base
root
- build
- - output
- - - entry.js
```

#### Установите общедоступный URL-адрес

По-умолчанию: --out-dir option

```bash
parcel build entry.js --public-url ./
```

На выходе будет:

```html
<link rel="stylesheet" type="text/css" href="1a2b3c4d.css">
<!-- или -->
<script src="e5f6g7h8.js"></script>
```


#### Отключение минификации

По-умолчанию: включено

```
parcel build entry.js --no-minify
```

#### Отключение кэша файловой системы

По-умолчанию: включено

```bash
parcel build entry.js --no-cache
```
