# SCSS

_支援的副檔名：`sass` 及 `scss`_

編譯 SCSS 需要先使用 npm 安裝 `sass` 模組 (JS 版本的 `dart-sass`)：

```bash
npm install sass
```

安裝 `sass` 後，你可以從 JavaScript 檔案中匯入 SCSS 檔案。

```javascript
import './custom.scss'
```

SCSS 中的相依檔案可透過 `@import` 語法使用。
