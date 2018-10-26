# 📦 Packagers

Dans Parcel, un `Packager` combine plusieurs `Asset` ensemble dans un paquet final en sortie. Cela se produit dans le processus principal après que toutes les ressources ont été traitées et qu'une arborescence du paquet a été créé. Les packagers sont enregistrés en fonction du type de fichier de sortie et les ressources générées par ce type de sortie sont envoyées à ce packager pour la production finale du fichier en sortie.

## Packager Interface

```javascript
const { Packager } = require('parcel-bundler')

class MyPackager extends Packager {
  async start() {
    // optionnel. Ecrit l'entête du fichier si besoin.
    await this.dest.write(header)
  }

  async addAsset(asset) {
    // obligatoire. Ecrit la ressource dans le fichier de sortie.
    await this.dest.write(asset.generated.foo)
  }

  async end() {
    // optionnel. Ecrit la fin du fichier si besoin.
    await this.dest.end(trailer)
  }
}

module.exports = MyPackager
```

## Enregistrement d'un packager

Vous pouvez enregistrer votre packager avec un empaqueteur (bundler) en utilisant la méthode `addPackager`. Il accepte un type de fichier pour s'enregistrer et le chemin vers votre module packager.

```javascript
const Bundler = require('parcel-bundler')

let bundler = new Bundler('input.js')
bundler.addPackager('foo', require.resolve('./MonPackager'))
```
