# 📦 資源

Parcel 以資源 (Asset) 為基礎，任何類型的檔案都能是資源，而 Parcel 對某些類型的檔案有著特殊的支援，像是 JavaScript、CSS 及 HTML 檔案等，Parcel 會自動分析這些檔案的相依檔案，並於輸出的 bundle 中引入它們。

Parcel 會將相似類型的資源將輸出至同一 bundle 中，但若你匯入不同類型的資源，舉例來說，在 JS 中匯入 CSS 檔案，Parcel 則會建立一個子 bundle，並於父 bundle 中留下參考點，相關細節將於「資源類型」中說明。

如果你在本文件中找不到某樣資源類型，那可能只是因為文件未更新，即時的支援類型清單請見：[parcel/src/Parser.js](https://github.com/parcel-bundler/parcel/blob/master/packages/core/parcel-bundler/src/Parser.js#L10)

實際的 parser 清單請見： [parcel/src/assets/](https://github.com/parcel-bundler/parcel/tree/master/packages/core/parcel-bundler/src/assets)

你可以在下列這些地方搜尋那些沒有預設支援的資源類型：

- [Yarn](https://yarnpkg.com/en/packages?q=parcel-plugin-&p=1)
- [npm](https://www.npmjs.com/search?q=parcel-plugin-)
- [awesome-parcel](https://github.com/parcel-bundler/awesome-parcel#plugins)

或者 [建立你自己的外掛](https://parceljs.org/plugins.html)。
