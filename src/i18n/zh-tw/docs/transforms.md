# 🐠 轉換

市面上許多打包工具在轉換資源前都需要安裝並設定外掛，Parcel 則是原生支援了眾多轉換及轉譯器。你可以使用 [Babel](https://babeljs.io) 轉換 JavaScript；使用 [PostCSS](http://postcss.org) 轉換 CSS 及使用 [PostHTML](https://github.com/posthtml/posthtml) 來轉換 HTML。

Parcel 會自動搜尋模組內的設定檔，如 `.babelrc` 和 `.postcssrc`，並自動執行這些轉換，甚至還能轉換 `node_modules` 中的三方套件：若套件中有設定檔的話，Parcel 將會針對此套件進行轉換。

由於 Parcel 每次僅會打包需要被轉換的套件，因此可大幅提升打包速度，這也意味著你不需要親自包含或排除那些需要被轉換的檔案，你也不需要了解三方的程式碼是如何被編譯的。
