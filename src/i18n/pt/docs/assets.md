# 📦 Recursos

Parcel é baseado em recursos. Um recurso pode ser qualquer arquivo, mas o Parcel tem suporte especial para alguns tipos de arquivos como JavaScript, CSS e HTML. O Parcel analisa automaticamente as dependências referenciadas nesses arquivos e os inclui no arquivo de saída. Tipos de recursos similares são agrupados no mesmo arquivo de saída. Se você importar um tipo de recurso diferente (por exemplo, se você importar um arquivo CSS a partir de um arquivo JS), ele inicia a construção de um segundo arquivo e adiciona uma referência no arquivo de saída principal. Isso será demonstrado nas próxima sessões.

Se você não conseguir encontrar um determinado tipo de recurso na documentação, pode ser que esta esteja desatualizada, para visualizar toda a lista de tipos de recursos suportados, consulte [parcel/src/Parser.js](https://github.com/parcel-bundler/parcel/blob/master/packages/core/parcel-bundler/src/Parser.js#L10).
Para visualizar a lista atual de conversores, consulte [parcel/src/assets/](https://github.com/parcel-bundler/parcel/tree/master/packages/core/parcel-bundler/src/assets).

Para qualquer tipo de arquivo não suportado por padrão, você pode verificar se já existe um plugin:

- [Yarn](https://yarnpkg.com/en/packages?q=parcel-plugin-&p=1)
- [npm](https://www.npmjs.com/search?q=parcel-plugin-)
- [awesome-parcel](https://github.com/parcel-bundler/awesome-parcel#plugins)

ou [crie o seu próprio plugin](https://parceljs.org/plugins.html).
