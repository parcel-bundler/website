# 🖥 CLI

## Команды

### Serve

Запускает сервер для разработки, который автоматически пересобирает приложение при изменении файлов и поддерживает [горячую замену модулей](hmr.html) для быстрой разработки.

```bash
parcel index.html
```

### Build

Собирает ресурсы за один раз, это также минифицирует их и устанавливает переменную окружения `NODE_ENV=production`.
См. [Работа в продакшене](production.html) для получения дополнительной информации.

```bash
parcel build index.html
```

### Watch

Команда `watch` похожа на `serve`, с основным отличием: она не запускает сервер.

```bash
parcel watch index.html
```

### Help

Отображает все возможные опции CLI

```bash
parcel help
```

### Version

Показывает номер версии Parcel

```bash
parcel --version
```

## Опции

### Каталог для выходных файлов

Значение по умолчанию: "dist"

Доступно для: `serve`, `watch`, `build`

```bash
parcel build entry.js --out-dir build/output
# or
parcel build entry.js -d build/output
```

```base
root
- build
- - output
- - - entry.js
```

### Установить общедоступный URL для сервера

Значение по умолчанию: [аналогично указанному в опции --out-dir](#output-directory)

Доступно для: `serve`, `watch`, `build`

```bash
parcel entry.js --public-url ./dist/
```

выведет

```html
<link rel="stylesheet" type="text/css" href="/dist/entry.1a2b3c.css">
<!-- или -->
<script src="/dist/entry.e5f6g7.js"></script>
```

### Цель

Значение по умолчанию: browser

Доступно для: `serve`, `watch`, `build`

```bash
parcel build entry.js --target node
```

Возможные цели: `node`, `browser`, `electron`

### Каталог кеширования

Значение по умолчанию: ".cache"

Доступно для: `serve`, `watch`, `build`

```bash
parcel build entry.js --cache-dir build/cache
```

### Порт

Значение по умолчанию: 1234

Доступно для: `serve`

```bash
parcel serve entry.js --port 1111
```

### Изменить уровень логирования

Значение по умолчанию: 3

Доступно для: `serve`, `watch`, `build`

```bash
parcel entry.js --log-level 1
```

| Уровень логирования | Эффект                                    |
| ------------------- | ----------------------------------------- |
| 0                   | Логирование отключено                     |
| 1                   | Логировать только ошибки                  |
| 2                   | Логировать только ошибки и предупреждения |
| 3                   | Логировать всё                            |

### Имя хоста для HMR

Значение по умолчанию: `location.hostname` текущего окна

Доступно для: `serve`, `watch`

```bash
parcel entry.js --hmr-hostname parceljs.org
```

### Порт для HMR

Значение по умолчанию: Случайный доступный порт

Доступно для: `serve`, `watch`

```bash
parcel entry.js --hmr-port 8080
```

### Выходное имя файла

Значение по умолчанию: исходное имя файла

Доступно для: `serve`, `watch`, `build`

```bash
parcel build entry.js --out-file output.html
```

Это изменяет имя выходого файла входной точки бандла

### Распечатать подробный отчёт

Значение по умолчанию: Минимальный отчёт

Доступно для: `build`

```bash
parcel build entry.js --detailed-report
```

### Включить https

Значение по умолчанию: https отключён

Доступно для: `serve`, `watch` (работает на HTTPS для подключений HMR)

```bash
parcel build entry.js --https
```

⚠️ Этот флаг генерирует самоподписанный сертификат, возможно, вам потребуется настроить ваш браузер, чтобы разрешить использование самоподписанных сертификатов для локального хоста.

### Установка пользовательского сертификата

Значение по умолчанию: https отключён

Доступно для: `serve`, `watch`

```bash
parcel entry.js --cert certificate.cert --key private.key
```

### Открытие в браузере

Значение по умолчанию: открытие отключено

Доступно для: `serve`

```bash
parcel entry.js --open
```

### Отключить создание source-maps

Значение по умолчанию: source-maps включены

Доступно для: `serve`, `watch`, `build`

```bash
parcel build entry.js --no-source-maps
```

### Отключение автоустановки

Значение по умолчанию: установка включена

Доступно для: `serve`, `watch`

```bash
parcel entry.js --no-autoinstall
```

### Отключение HMR

Значение по умолчанию: HMR включён

Доступно для: `serve`, `watch`

```bash
parcel entry.js --no-hmr
```

### Отключение минификации

Значение по умолчанию: минификация включена

Доступно для: `build`

```bash
parcel build entry.js --no-minify
```

### Отключить кеширование файловой системы

Значение по умолчанию: кеширование включено

Доступно для: `serve`, `watch`, `build`

```bash
parcel build entry.js --no-cache
```

### Сделать глобальными модули как UMD

Значение по умолчанию: отключено

Доступно для: `serve`, `watch`, `build`

```bash
parcel serve entry.js --global myvariable
```

### Включить поддержку подъёма области видимости/tree shaking

Значение по умолчанию: отключено

Доступно для: `build`

```bash
parcel serve entry.js --experimental-scope-hoisting
```

Для получения дополнительной информации смотрите [раздел Tree Shaking](https://medium.com/@devongovett/parcel-v1-9-0-tree-shaking-2x-faster-watcher-and-more-87f2e1a70f79#4ed3) в записи Девона Говетта (Devon Govett) про Parcel 1.9.
