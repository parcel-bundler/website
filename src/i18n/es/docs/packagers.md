# 📦 Empaquetadores

En Parcel, un `Packager` combina multiples `Asset`s en un paquete de salida final. Esto ocurre en el proceso principal después de que todos los recursos han sido procesados, y un árbol de paquetes ha sido creado. Los `packagers` son registrados en base a un tipo de archivo de salida, y los recursos que generaron ese tipo de salida son enviados a ese packager para la producción del archivo de salida final.

## Interfaz de Packager

```javascript
const { Packager } = require('parcel-bundler')

class MyPackager extends Packager {
  async start() {
    // opcional. escribir cabeceras de archivo si es necesario.
    await this.dest.write(header)
  }

  async addAsset(asset) {
    // requerido. escribir el recurso al archivo de salida.
    await this.dest.write(asset.generated.foo)
  }

  async end() {
    // opcional. escribir el trailer del archivo si es necesario.
    await this.dest.end(trailer)
  }
}
```

## Registro de un Packager

Puedes registrar tu packager con un empaquetador usando el método `addPackager`. Este método acepta un tipo de archivo a registrar, y la ruta a tu módulo packager.

```javascript
const Bundler = require('parcel-bundler')

let bundler = new Bundler('input.js')
bundler.addPackager('foo', require.resolve('./MyPackager'))
```
