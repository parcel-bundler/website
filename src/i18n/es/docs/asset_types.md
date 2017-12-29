# 📝 Tipos de Recursos

Como se describe en la [documentación de Recursos](assets.html), Parcel representa cada archivo de entrada como un `Asset`. Los tipos de Recursos se representan como clases que heredan de la clase base `Asset` e implementan la interfaz requerida para procesar, analizar dependencias, transformar y generar código.

Debido a que Parcel procesa los recursos en paralelo en múltiples núcleos de procesador, las transformaciones que pueden realizar los tipos de recursos están limitadas a las que operan en un solo archivo a la vez. Para transformaciones en varios archivos se puede usar un [Empaquetador](packagers.html) personalizado.

## Interfaz de Recursos

```javascript
const {Asset} = require('parcel-bundler');

class MyAsset extends Asset {
  type = 'foo'; //establecer el tipo de salida principal

  parse(code) {
    // procesar el codigo a AST
    return ast;
  }

  pretransform() {
    // opcional. transformar antes de recolectar dependencias.
  }

  collectDependencies() {
    // analyzar dependencias
    this.addDependency('my-dep');
  }

  transform() {
    // opcional. transformar despues de recolectar dependencias.
  }

  generate() {
    // generar codigo. Puedes devolver varias representaciones si lo necesitas.
    // los resultados son enviados al empaquetador apropiado para generar los paquetes finales.
    return {
      foo: 'my stuff here', // salida principal
      js: 'some javascript' // representacion alternativa para ser colocada en el paquete de JS si es necesario.
    };
  }
}
```

## Registrando un tipo de Recurso

Puedes registrar tus tipos de recursos con un paquete usando el método `addAssetType`. Este acepta una extensión de archivo, y la ruta a tu modulo de tipo de recurso. Esta es una ruta en lugar del objeto real para que pueda ser enviado a procesos paralelos de trabajo.

```javascript
const Bundler = require('parcel-bundler');

let bundler = new Bundler('input.js');
bundler.addAssetType('.ext', require.resolve('./MyAsset'));
```
