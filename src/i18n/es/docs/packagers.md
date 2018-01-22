# 📦 Empaquetadores

En Parcel, un empaquetador combina múltiples archivos juntos en un paquete de salida final. Esto sucede en el proceso principal después de que se hayan procesado todos los archivos y se haya creado un árbol de paquetes. Los empaquetadores se registran en función del tipo de archivo de salida que se envían a ese empaquetador para la producción del archivo final de salida.

## Interfaz Packager

```javascript
const { Packager } = require("parcel-bundler");

class MyPackager extends Packager {
  async start() {
    // optional. escribe una cabecera de archivo si es necesario.
    await this.dest.write(header);
  }

  async addAsset(asset) {
    // required. escribe el archivo original en el archivo final.
    await this.dest.write(asset.generated.foo);
  }

  async end() {
    // optional. escribe el trailer del archivo si es necesario.
    await this.dest.end(trailer);
  }
}
```

## Registrando un empaquetador

Puede registrar su empaquetador con un utilizando el método `addPackager`. Acepta un tipo de archivo para registrarse y la ruta a su empaquetador.

```javascript
const Bundler = require("parcel-bundler");

let bundler = new Bundler("input.js");
bundler.addPackager("foo", require.resolve("./MyPackager"));
```
