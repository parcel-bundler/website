# 🔌 Plugins

Parcel adopte une approche légèrement différente de beaucoup d'autres outils dans la mesure où de nombreux formats courants sont inclus sans avoir besoin d'installer et de configurer des plugins supplémentaires. Cependant, il y a des cas où vous auriez besoin d'étendre Parcel d'une manière non standard, et pour ces cas, les plugins sont supportés. Les plugins installés sont automatiquement détectés et chargés en fonction des dépendances du `package.json`.

Lors de l'ajout du support pour un nouveau format de fichier à Parcel, vous devez d'abord considérer à quel point il est répandu et comment la mise en œuvre est standardisée. S'il est suffisamment répandu et standard, le format devra probablement être ajouté au cœur de Parcel au lieu d'un plugin que les utilisateurs devront installer. Si vous avez des doutes, [GitHub](https://github.com/parcel-bundler/parcel/issues) est le bon endroit pour en discuter.

## API du plugin

Les plugins de Parcel sont très simples. C'est simplement des modules qui exportent une seule fonction, qui est appelée automatiquement par Parcel lors de l'initialisation. La fonction reçoit en entrée l'objet `Bundler` et peut faire la configuration telle que l'enregistrement des types de ressource et des packagers.

```javascript
module.exports = function (bundler) {
  bundler.addAssetType('ext', require.resolve('./MonAsset'));
  bundler.addPackager('foo', require.resolve('./MonPackager'));
};
```

Publiez ce paquet sur npm en utilisant les préfixes `parcel-plugin-` ou `@votre-scope/parcel-plugin-` et il sera automatiquement détecté et chargé comme décrit ci-dessous.

## Utilisations des Plugins

L'utilisation de plugins dans Parcel ne pouvait pas être plus simple. Tout ce que vous avez à faire est de les installer et de les enregistrer dans votre `package.json`. Les plugins doivent être nommés avec les préfixes `parcel-plugin-` ou `@votre-scope/parcel-plugin-`, par exemple `parcel-plugin-foo` ou `@votre-scope/parcel-plugin-foo`. Toutes les dépendances répertoriées dans `package.json` avec ces préfixes seront automatiquement chargés lors de l'initialisation.
