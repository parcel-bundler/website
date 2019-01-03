# CSS

_支援的副檔名：`css`、`pcss` 及 `postcss`_

CSS 資源可於 JavaScript 或 HTML 檔案中被匯入：

```js
import './index.css';
```
```html
<link rel="stylesheet" type="text/css" href="index.css">
```

CSS 資源也能透過 `@import` 語法引用相依檔案，或用 `url()` 匯入影像、字型檔等等的檔案。

其他透過 `@import` 引用的 CSS 檔案將會被插入於同一個 CSS bundle 裡，而使用 `url()` 引入的檔案則會被改寫為實際檔案輸出路徑。

所有檔名都必須使用相對於目前 CSS 檔案的路徑。

```css
/* 匯入另一個 CSS 檔 */
@import './other.css';

.test {
  /* 引用一張圖檔 */
  background: url('./images/background.png');
}
```

除了純 CSS 以外，Parcel 也支援其他編譯至 CSS 的語言如 LESS、SASS 及 Stylus 等。它們的執行方式與純 CSS 相同。

# PostCSS

[PostCSS](http://postcss.org) 是款可以轉換 CSS 的外掛，它有如 [autoprefixer](https://github.com/postcss/autoprefixer)、[Preset Env](https://github.com/csstools/postcss-preset-env) 和 [CSS Modules](https://github.com/css-modules/css-modules) 等等的外掛。

若要在 Parcel 中使用 PostCSS，你需要建立下列其中一個設定檔：`.postcssrc` (JSON)、`.postcssrc.js` 或 `postcss.config.js`。

在你的 app 中安裝外掛：

```bash
yarn add postcss-modules autoprefixer
```

接著建立 `.postcssrc`：

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

使用外掛時需於 `plugins` 內新增一個屬性，外掛選項則為此屬性的值，並以物件形式設定。若外掛無需設定，將屬性值設定為 `true` 即可。

針對 Autoprefixer、cssnext 及其他工具的支援瀏覽器可在 `.browserslistrc` 中設定：

```
> 1%
last 2 versions
```

在指定最外層的 `modules` 時，CSS 模組啟用方式稍有不同。因 CSS 模組會匯出一個需要被引入在 JavaScript bundle 中的物件，Parcel 需要對此特別處理。
需要注意的是，你仍須在專案中安裝 `postcss-modules`。

## 使用現有的 CSS 函式庫

為使現有的 CSS 模組可以正常運作，需要特別在它們的 `.postcssrc` 指定支援程度。

## 設定 cssnano CSS 壓縮

Parcel 會將 [cssnano](http://cssnano.co) 加入至 PostCSS 以便在正式編譯中對 CSS 進行壓縮。若需設定 cssnano 可以建立 `cssnano.config.js` 檔案：

```js
module.exports = {
  preset: [
    'default',
    {
      calc: false,
      discardComments: {
        removeAll: true
      }
    }
  ]
}
```
