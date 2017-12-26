# 🔌 Plugins

Parcel consiste em uma abordagem um pouco diferente de outras ferramentas semelhantes, onde muitos formatos comuns são incluídos de fábrica sem a necessidade de instalar e configurar plugins adicionais. No entanto, existem casos em que você queira estender o Parcel de uma maneira não convencional, e por esses motivos o Parcel tem suporte a plugins. Os plugins instalados são automaticamente detectados e carregados com base nas dependências do arquivo `package.json`.

Ao adicionar suporte para um novo formato de arquivo para o Parcel, você deve primeiro considerar o quão generalizado é e como é padronizada a implementação desse novo formato. Se for bem difundido e padronizado, o formato provavelmente deve ser adicionado ao núcleo do Parcel e não como um plugin que os usuários precisam instalar. Se tiver dúvidas, o [GitHub](https://github.com/parcel-bundler/parcel/issues) é o lugar ideal para discutir sobre isso.

## Plugin API

Os plugins do Parcel são muito simples. Eles são simplesmente módulos que exportam uma única função, que é chamada pelo Parcel automaticamente durante a inicialização. A função recebe como entrada o objeto `Bundler` e pode realizar configurações, como registrar tipos de recursos e packagers.

```javascript
module.exports = function (bundler) {
  bundler.addAssetType('ext', require.resolve('./MyAsset'));
  bundler.addPackager('foo', require.resolve('./MyPackager'));
};
```

Publique este pacote no npm usando o prefixo `parcel-plugin-` e ele será automaticamente detectado e carregado conforme descrito abaixo.

## Usando Plugins

Usar plugins no Parcel não poderia ser mais simples. Tudo o que você precisa fazer é instalá-los e salvá-los no arquivo `package.json`. Os nomes do plugins devem começar com o prefixo `parcel-plugin-`, por exemplo `parcel-plugin-foo`. Todas as dependências listadas no arquivo `package.json` com este prefixo serão carregadas automaticamente durante a inicialização.
