# 🔌 外掛

可於[此處](https://www.npmjs.com/search?q=keywords:parcel-plugin)查詢 npm 上的所有外掛。

Parcel 與大多數的打包工具不同，它以內建支援多種常見格式，無需額外安裝及設定其他外掛。然而，有些情況下你可能會需要擴充 Parcel 的功能，這時你就會需要外掛。Parcel 會自動偵測及載入 `package.json` 中所安裝的套件。

在你開發新檔案格式的支援時應先考慮兩點：此格式是廣泛通用的嗎？以及此實作方式是否標準化？若兩者皆是的話，則此格式支援應被加進 Parcel 核心而不是另外開發外掛。
若你對此有任何疑問的話，可在 [GitHub](https://github.com/parcel-bundler/parcel/issues) 與大家討論。

## 外掛 API

Parcel 的外掛相當簡單，在模組內匯出一個函式即可。Parcel 在初始化時會呼叫此函式，並傳入一個 `Bundler` 物件，此物件可用來註冊資源類型或是 Packager。

```javascript
module.exports = function(bundler) {
  bundler.addAssetType('ext', require.resolve('./MyAsset'))
  bundler.addPackager('foo', require.resolve('./MyPackager'))
}
```

命名套件時應使用 `parcel-plugin-` 或 `@your-scope/parcel-plugin-` 這兩個前綴，發布至 npm 後，套件將會自動以下述方式被偵測及載入。

## 使用外掛

在 Parcel 中使用外掛再簡單不過了，只要安裝並儲存於 `package.json` 即可。所有外掛命名時都應使用 `parcel-plugin-` 或 `@your-scope/parcel-plugin-` 這兩個前綴，例如： `parcel-plugin-foo` 或 `@your-scope/parcel-plugin-foo`。任何在 `package.json` 中含有這兩個前綴的套件都會在 Parcel 初始化時被自動載入。
