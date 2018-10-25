# 📝 Types de ressources

Comme décrit dans la [documentation des ressources](assets.html), Parcel représente chaque fichier en entrée comme un `Asset`. Les types de ressources sont représentés comme des classes héritant de la classe de base `Asset` et implémentant l’interface requise pour analyser, décortiquer les dépendances, transformer et générer le code.

Comme Parcel traite les ressources en parallèle sur plusieurs cœurs de processeurs, les transformations que les types de ressource peuvent effectuer sont limitées à celles qui fonctionnent sur un seul fichier à la fois. Pour les transformations sur plusieurs fichiers, un [Packager](packagers.html) personnalisé peut être utilisé.

## Interface de Asset

```javascript
const {Asset} = require('parcel-bundler');

class MyAsset extends Asset {
  type = 'foo'; // définit le type de sortie principal.

  async parse(code) {
    // analyse le code d'un AST
    return ast;
  }

  async pretransform() {
    // optionnel, transforme avant de collecter les dépendances.
  }

  collectDependencies() {
    // analyse les dépendances
    this.addDependency('my-dep');
  }

  async transform() {
    // optionnel, transforme après avoir collecté les dépendances.
  }

  async generate() {
    // génère le code : vous pouvez retourner plusieurs rendus si nécessaire.
    // Les résultats sont transmis aux packagers appropriés pour générer les paquets finals.
    return [
      {
        type: 'foo',
        value: 'mes trucs ici' // sortie principale
      },
      {
        type: 'js',
        value: 'du javascript' // rendu alternatif à placer dans le paquet JS si nécessaire
        sourceMap
      }
    ];
  }

  async postProcess(generated) {
    // Processus après la génération de tout le code
    // Peut être utilisé pour combiner plusieurs types de ressource
  }
}

module.exports = MyAsset
```

## Enregistrement d'un type d'Asset

Vous pouvez enregistrer votre type de ressource avec un empaqueteur (bundler) en utilisant la méthode `addAssetType`. Elle accepte une extension de fichier à enregistrer et le chemin d'accès à votre module de type de ressource. C'est un chemin plutôt que l'objet réel afin qu'il puisse être transmis aux processus de travail.

```javascript
const Bundler = require('parcel-bundler')

let bundler = new Bundler('input.js')
bundler.addAssetType('.ext', require.resolve('./MonAsset'))
```
