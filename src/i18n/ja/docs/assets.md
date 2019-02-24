# 📦 Assets

Parcel はアセットに基づいています。アセットは様々なファイルのことを表しますが、JavaScript、CSS、HTML など特定の種類のアセットについては特別なサポートがあります。Parcel はこれらのファイルから、参照されている依存を自動で解析して出力するバンドルに含めます。同じような種類のアセットはグループ化され、同じバンドルにまとめられます。異なる種類のアセットをインポートすると（例: CSS ファイルを JS ファイルからインポートした場合）、子バンドルが作成され、親バンドルへの参照が残されます。これについては、別のセクションで説明します。

もしドキュメントに特定の種類のアセットが見つからない場合は、ドキュメントが古い可能性があります。サポートされているアセットの種類のリストは[parcel/src/Parser.js](https://github.com/parcel-bundler/parcel/blob/master/packages/core/parcel-bundler/src/Parser.js#L10)で確認できます。
パーサーのリストは[parcel/src/assets/](https://github.com/parcel-bundler/parcel/tree/master/packages/core/parcel-bundler/src/assets)で確認できます。

デフォルトでサポートされていない種類のアセットについては、以下のリンクからサポートするプラグインがあるか探すことができます。

- [Yarn](https://yarnpkg.com/en/packages?q=parcel-plugin-&p=1)
- [npm](https://www.npmjs.com/search?q=parcel-plugin-)
- [awesome-parcel](https://github.com/parcel-bundler/awesome-parcel#plugins)

または [自分でプラグインを作ることもできます](https://parceljs.org/plugins.html)。
