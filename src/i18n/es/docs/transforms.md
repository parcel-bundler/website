# 🐠 Transformaciones

Si bien muchos bundlers requieren que instales y configures plugins para transformar archivos, Parcel tiene soporte para muchas transformaciones y transpilers comunes de manera inmediata. Puede transformar JavaScript usando [Babel](https://babeljs.io), CSS usando [PostCSS](http://postcss.org), y HTML usando [PostHTML](https://github.com/posthtml/posthtml). Parcel ejecuta automáticamente estas transformaciones cuando encuentra un archivo de configuración (por ejemplo, `.babelrc`,`.postcssrc`) en un módulo.

Esto funciona incluso en `node_modules` de terceros: si un archivo de configuración se publica como parte del paquete, la transformación se activa automáticamente solo para ese módulo. Esto mantiene el build rápido ya que solo se procesan los módulos que necesitan transformarse. También significa que no necesita configurar manualmente las transformaciones para incluir y excluir determinados archivos, ni saber cómo se construye el código de terceros para usarlo en su aplicación.

## Babel

[Babel](https://babeljs.io) es un transpiler popular para JavaScript con un gran ecosistema de plugins. El uso de Babel con Parcel funciona de la misma manera que cuando se usa de manera independiente o con otros paquetes.

Instala presets y complementos en tu aplicación:

```bash
yarn add babel-preset-env
```

Luego, crea un `.babelrc`:

```json
{
  "presets": ["env"]
}
```

## PostCSS

[PostCSS](http://postcss.org) es una herramienta para transformar CSS con plugins, como [autoprefixer](https://github.com/postcss/autoprefixer), [cssnext](http://cssnext.io/), y [Módulos CSS](https://github.com/css-modules/css-modules). Puede configurar PostCSS con Parcel creando un archivo de configuración usando uno de estos nombres: `.postcssrc` (JSON),`.postcssrc.js`, o `postcss.config.js`.

Instala plugins en tu aplicación:

```bash
yarn add postcss-modules autoprefixer
```

Luego, crea un `.postcssrc`:

```json
{
  "modules": true,
  "plugins": {
    "autoprefixer": {
      "grid": true
    }
  }
}
```

Los plugins se especifican en el objeto `plugins` como claves, y las opciones se definen utilizando valores de objeto. Si no hay opciones para un plugin, simplemente configúrelo como `true`.

Los navegadores de destino para Autoprefixer, cssnext y otras herramientas se pueden especificar en el archivo `.browserslistrc`:

```
> 1%
last 2 versions
```

Los módulos CSS se habilitan de forma ligeramente diferente utilizando una clave `modules` de nivel superior. Esto se debe a que Parcel necesita un soporte especial para los módulos CSS, ya que también exportan un objeto para incluirlo en el paquete de JavaScript. Tenga en cuenta que aún necesita instalar `postcss-modules` en su proyecto.

## PostHTML

[PostHTML](https://github.com/posthtml/posthtml) es una herramienta para transformar HTML con complementos. Puede configurar PostHTML con Parcel creando un archivo de configuración usando uno de estos nombres: `.posthtmlrc`(JSON), `posthtmlrc.js`, o `posthtml.config.js`.

Instala plugins en tu aplicación:

```bash
yarn add posthtml-img-autosize
```

Después, crea un `.posthtmlrc`:

```json
{
  "plugins": {
    "posthtml-img-autosize": {
      "root": "./images"
    }
  }
}
```

Los plugins se especifican en el objeto `plugins` como claves, y las opciones se definen utilizando valores de objeto. Si no hay opciones para un plugins, simplemente configúrelo como `true`.

## TypeScript

[TypeScript](https://www.typescriptlang.org/) es un superconjunto de JavaScript tipeado que compila a JavaScript plano, también es compatible con las características modernas de ES2015. La transformación de TypeScript funciona por defecto sin ninguna configuración adicional.

```html
<!-- index.html -->
<html>
<body>
  <script src="./index.ts"></script>
</body>
</html>
```

```typescript
// index.ts
import message from "./message";
console.log(message);
```

```typescript
// message.ts
export default "Hola, mundo";
```
