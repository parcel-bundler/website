# SCSS

_支援的副檔名：`sass` 及 `scss`_

編譯 SCSS 需要先安裝 `sass` 模組 (JS 版本的 `dart-sass`)

使用 npm 安裝：

```bash
npm install -D sass
```

使用 yarn 安裝：

```bash
yarn add -D sass
```

安裝 `sass` 後，你可以從 JavaScript 檔案中匯入 SCSS 檔案。

```javascript
import './custom.scss'
```

你也可以直接在 HTML 匯入 SCSS 檔案：

```html
<link rel="stylesheet" href="./style.scss">
```

你可以透過 `@import` 語法來使用 SCSS 中的相依檔案。

若你在執行前沒有自行安裝 `sass`，Parcel 將會自動為你安裝。此外，你可以用如 `.sassrc` 的設定檔來設定 SASS，舉例來說，若你想要控制輸出 CSS 的樣式，你可以這樣設定：

```
{ outputStyle: "nested", }
```

註：你也可以使用 `node-sass` 來提升 SCSS 編譯速度，但目前已有人[回報相關 issue](https://github.com/parcel-bundler/parcel/issues/1836)。
