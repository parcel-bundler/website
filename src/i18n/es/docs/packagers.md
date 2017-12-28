# 📦 Packagers

En Parcel, un `Packager` combina multiples `recursos` en un paquete final. Esto ocurre en el proceso principal despues de que todos los recursos han sido procesados, y un árbol de contenedores ha sido creado. Los Packagers son registrados en base a un tipo de archivo de salida, y los recursos que generaron ese tipo de salida son enviados a ese packager para producir el archivo de salida final.

## Interfaz de Packager

```javascript
const {Packager} = require('parcel-bundler');

class MyPackager extends Packager {
  async start() {
    // optional. write file header if needed.
    await this.dest.write(header);
  }

  async addAsset(asset) {
    // required. write the asset to the output file.
    await this.dest.write(asset.generated.foo);
  }

  async end() {
    // optional. write file trailer if needed.
    await this.dest.end(trailer);
  }
}
```

## Registro de un Packager

Puedes registrar tu packager con un empaquetador usando el método `addPackager`. Este método acepta un tipo de archivo a registrar, y la ruta a tu módulo packager.

```javascript
const Bundler = require('parcel-bundler');

let bundler = new Bundler('input.js');
bundler.addPackager('foo', require.resolve('./MyPackager'));
```
