# 🔌 Complementos

Parcel adopta un enfoque ligeramente diferente al de muchas otras herramientas, ya que muchos formatos comunes están incluidos por defecto sin la necesidad de instalar y configurar complementos adicionales. Sin embargo, hay casos en los que es posible que desee extender Parcel de una manera no estándar, y para esos momentos, los complementos son compatibles. Los complementos instalados se detectan y cargan automáticamente en función de las dependencias en el archivo `package.json`.

Al agregar soporte para un nuevo formato de archivo, primero debes considerar qué tan extendido está y qué tan estandarizada es la implementación. Si está lo suficientemente extendido y estándar, el formato probablemente debería agregarse al núcleo de Parcel en lugar de ser un complemento que los usuarios necesitan para instalar. Si tienes alguna duda, [GitHub](https://github.com/parcel-bundler/parcel/issues) es el lugar adecuado para debatir.

## API de Complementos

Los complementos de parcel son muy simples. Son módulos que exportan una sola función, que Parcel llama automáticamente durante la inicialización. La función recibe como entrada el objeto `Bundler`, y puede hacer configuraciones tales como el registro de tipos de activos y empaquetadores.

```javascript
module.exports = function(bundler) {
  bundler.addAssetType('ext', require.resolve('./MiActivo'))
  bundler.addPackager('foo', require.resolve('./MiEmpaquetador'))
}
```

Publica este paquete en npm usando el prefijo `parcel-plugin-`, y se detectará y cargará automáticamente como se describe a continuación.

## Usando Complementos

Usar complementos en Parcel no podría ser más simple. Todo lo que necesitas hacer es instalarlos y guardarlos en su `package.json`. Los complementos deben nombrarse con el prefijo `parcel-plugin-`, por ejemplo `parcel-plugin-foo`. Cualquier dependencia enumerada en `package.json` con este prefijo se cargará automáticamente durante la inicialización.
