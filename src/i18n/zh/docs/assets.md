# 📦 资源(Assets)

Parcel 是基于资源的，资源可以代表任意文件，并且 Parcel 对 JavaScript，CSS，HTML 文件有更多的支持。 Parcel 会自动地分析这些文件和包中引用的依赖。相同类型的资源会被组合到同一捆绑包中。如果导入其他类型的资源（例如：你在 JS 文件中导入 CSS 文件），Parcel 会启动子捆绑包，并在父捆绑包中保留对它的引用。这一点将在以下部分进行说明。

如果你无法在文档中找到特定的资源类型，那么文档可能已经过期。支持资源类型的完整列表，请参见[parcel/src/Parser.js](https://github.com/parcel-bundler/parcel/blob/master/packages/core/parcel-bundler/src/Parser.js#L10)。相关实际的语法分析器列表，请参见[parcel/src/assets/](https://github.com/parcel-bundler/parcel/tree/master/packages/core/parcel-bundler/src/assets)

对于默认情况下不支持的任何资源类型，你可以检查插件是否已存在：

- [Yarn](https://yarnpkg.com/en/packages?q=parcel-plugin-&p=1)
- [npm](https://www.npmjs.com/search?q=parcel-plugin-)
- [awesome-parcel](https://github.com/parcel-bundler/awesome-parcel#plugins)

或 [create your own](https://parceljs.org/plugins.html).
