# 📝 Tipos de archivos


Como se describe en la [Documentación de archivos](assets.html), Parcel representa cada archivo de entrada como un `Asset`. Los tipos de archivo se representan como clases que heredan de la clase base `Asset` e implementan la interfaz requerida para leer, analizar dependencias, transformar y generar código.

Debido a que Parcel procesa los activos en paralelo en múltiples núcleos de CPU, las transformaciones que pueden realizar los tipos de activos se limitan a las que operan en un solo archivo a la vez. Para transformaciones en varios archivos, se puede usar un [Packager](packagesrs.html) personalizado.

## Interfaz Asset

```javascript
const { Asset } = require("parcel-bundler");

class MyAsset extends Asset {
  type = "foo"; // Establece el tipo principal a devolver.

  parse(code) {
    // procesar el código a AST
    return ast;
  }

  pretransform() {
    // opcional. transformar antes de reunir las dependencias.
  }

  collectDependencies() {
    // analizar dependencies
    this.addDependency("my-dep");
  }

  transform() {
    // opcional. transformar después de reunir las dependencias.
  }

  generate() {
    // generación de código. puedes devolver multiples interpretaciones si es necesario.
    // los resultados son enviados a los empaquetadores apropiados para general el paquete final.
    return {
      foo: "my stuff here", // salida principal
      js: "some javascript" // interpretación alternativa para meter en el paquete JS si es necesario
    };
  }
}
```

## Registrando un tipo de archivo

Puede registrar su tipo de archivo con un empaquetador utilizando el método `addAssetType`. Acepta una extensión de archivo a registrar y la ruta a su módulo de Asset. Es una ruta en lugar de un objeto real, de modo que se puede pasar a otros procesos de trabajo.

```javascript
const Bundler = require("parcel-bundler");

let bundler = new Bundler("input.js");
bundler.addAssetType(".ext", require.resolve("./MyAsset"));
```
