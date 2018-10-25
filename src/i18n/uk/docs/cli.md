# 🖥 CLI

## Команди

### Serve

Запускає сервер для розробки, який автоматично збирає заново додаток при зміні файлів і підтримує [гарячу заміну модулів](hmr.html) для швидкої розробки.

```Bash
parcel index.html
```

### Build

Збирає ресурси за один раз, це також мініфікує їх і встановлює змінну оточення `NODE_ENV = production`.
Див. [Робота в продакшені](production.html) для отримання додаткової інформації.

```Bash
parcel build index.html
```

### Watch

Команда `watch` схожа на`serve`, з основною відмінністю: вона не запускає сервер.

```Bash
parcel watch index.html
```

### Help

Відображає всі можливі опції CLI

```Bash
parcel help
```

### Version

Показує номер версії Parcel

```Bash
parcel --version
```

## Опції

### Каталог для вихідних файлів

Значення за замовчуванням: "dist"

Доступно для: `serve`,`watch`, `build`

```Bash
parcel build entry.js --out-dir build/output
#або
parcel build entry.js -d build/output
```

```Base
root
- build
- - output
- - - entry.js
```

### Встановити загальнодоступний URL для сервера

Значення за замовчуванням: [аналогічно зазначеному в опції --out-dir](#output-directory)

Доступно для: `serve`,`watch`, `build`

```Bash
parcel entry.js --public-url ./dist/
```

виведе

```Html
<link rel = "stylesheet" type = "text/css" href = "/dist/entry.1a2b3c.css">
<!--або-->
<script src = "/dist/entry.e5f6g7.js"></script>
```

### Мета

Значення за замовчуванням: browser

Доступно для: `serve`,`watch`, `build`

```Bash
parcel build entry.js --target node
```

Можливі цілі: `node`,`browser`, `electron`

### Каталог кешування

Значення за замовчуванням: ".cache"

Доступно для: `serve`,`watch`, `build`

```Bash
parcel build entry.js --cache-dir build/cache
```

### Порт

Значення за замовчуванням: 1234

Доступно для: `serve`

```Bash
parcel serve entry.js --port 1111
```

### Змінити рівень логування

Значення за замовчуванням: 3

Доступно для: `serve`,`watch`, `build`

```Bash
parcel entry.js --log-level 1
```

| Рівень логування | Ефект                                  |
| ---------------- | -------------------------------------- |
| 0                | Логування відключено                   |
| 1                | Логувати тільки помилки                |
| 2                | Логувати тільки помилки і попередження |
| 3                | Логувати все                           |

### Ім'я хоста для HMR

Значення за замовчуванням: `location.hostname` поточного вікна

Доступно для: `serve`,`watch`

```Bash
parcel entry.js --hmr-hostname parceljs.org
```

### Порт для HMR

Значення за замовчуванням: Випадковий доступний порт

Доступно для: `serve`,`watch`

```Bash
parcel entry.js --hmr-port 8080
```

### Вихідне ім'я файлу

Значення за замовчуванням: вихідне ім'я файлу

Доступно для: `serve`,`watch`, `build`

```Bash
parcel build entry.js --out-file output.html
```

Це змінює ім'я вихідного файлу вхідної точки бандла

### Роздрукувати детальний звіт

Значення за замовчуванням: Мінімальний звіт

Доступно для: `build`

```Bash
parcel build entry.js --detailed-report
```

### Включити https

Значення за замовчуванням: https відключений

Доступно для: `serve`,`watch` (працює на HTTPS для підключень HMR)

```Bash
parcel build entry.js --https
```

⚠️ Цей прапор генерує самоподпісанний сертифікат, можливо, вам буде потрібно налаштувати ваш браузер, щоб дозволити використання самопідписаного сертифікату для локального хоста.

### Установка користувальницького сертифіката

Значення за замовчуванням: https відключений

Доступно для: `serve`,`watch`

```Bash
parcel entry.js --cert certificate.cert --key private.key
```

### Відкриття в браузері

Значення за замовчуванням: відкриття відключено

Доступно для: `serve`

```Bash
parcel entry.js --open
```

### Відключити створення source-maps

Значення за замовчуванням: source-maps включені

Доступно для: `serve`,`watch`, `build`

```Bash
parcel build entry.js --no-source-maps
```

### Відключення автоустановки

Значення за замовчуванням: установка включена

Доступно для: `serve`,`watch`

```Bash
parcel entry.js --no-autoinstall
```

### Відключення HMR

Значення за замовчуванням: HMR включений

Доступно для: `serve`,`watch`

```Bash
parcel entry.js --no-hmr
```

### Відключення мініфікаціі

Значення за замовчуванням: мініфікація включена

Доступно для: `build`

```Bash
parcel build entry.js --no-minify
```

### Відключити кешування файлової системи

Значення за замовчуванням: кешування включено

Доступно для: `serve`,`watch`, `build`

```Bash
parcel build entry.js --no-cache
```

### Зробити глобальними модулі як UMD

Значення за замовчуванням: відключено

Доступно для: `serve`,`watch`, `build`

```Bash
parcel serve entry.js --global myvariable
```

### Включити підтримку підйому області видимості / tree shaking

Значення за замовчуванням: відключено

Доступно для: `build`

```Bash
parcel serve entry.js --experimental-scope-hoisting
```

Для отримання додаткової інформації дивіться [розділ Tree Shaking](https://medium.com/@devongovett/parcel-v1-9-0-tree-shaking-2x-faster-watcher-and-more-87f2e1a70f79#4ed3) в записі Девона Говетта (Devon Govett) про Parcel 1.9.
