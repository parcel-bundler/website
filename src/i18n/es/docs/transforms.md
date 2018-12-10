# 🐠 Transformaciones

Si bien muchos empaquetadores requieren que instales y configures plugins para transformar recursos, Parcel tiene soporte para muchas transformaciones y transpiladores comunes, sin necesidad de instalar ni configurar nada adicional. Puedes transformar JavaScript utilizando [Babel](https://babeljs.io), CSS utilizando [PostCSS](http://postcss.org), y HTML utilizando [PostHTML](https://github.com/posthtml/posthtml). Parcel ejecuta estas transformaciones de manera automática cuando encuentra el archivo de configuración correspondiente (por ejemplo `.babelrc`, `.postcssrc`) en un módulo.

Esto funciona incluso en módulos de terceros dentro de la carpeta `node_modules`: si un archivo de configuración es publicado como parte de un paquete, la transformación correspondiente es habilitada automáticamente, sólo para ese módulo. Esto hace que el empaquetado sea rápido, puesto que sólo se procesan los módulos que necesitan ser transformados. También significa que tú no necesitas configurar manualmente las transformaciones para que incluyan o excluyan determinados archivos, ni necesitas saber cómo está conformado el código de terceros para poder utilizarlo en tu aplicación.

## Babel

[Babel](https://babeljs.io) es un transpilador popular para JavaScript, con un amplio ecosistema de plugins. Usar Babel con Parcel funciona de la misma manera que al usarlo por sí mismo o con otros empaquetadores.

Instala los presets y plugins en tu app:

```bash
yarn add @babel/preset-env
```

Luego, crea un archivo `.babelrc`:

```json
{
  "presets": ["@babel/preset-env"]
}
```

## PostCSS

[PostCSS](http://postcss.org) es una herramienta para transformar CSS con plugins, como [autoprefixer](https://github.com/postcss/autoprefixer), [Preset Env](https://github.com/csstools/postcss-preset-env), y [CSS Modules](https://github.com/css-modules/css-modules). Puedes configurar PostCSS para ser usado con Parcel, creando un archivo de configuración usando uno de estos nombres: `.postcssrc` (JSON), `.postcssrc.js`, o `postcss.config.js`.

Instala los plugins que necesites en tu app:

```bash
yarn add postcss-modules autoprefixer
```

Luego, crea un archivo `.postcssrc`:

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

Los plugins deben ser declarados en el objeto `plugins` como llaves, y las opciones correspondientes son especificadas usando un objeto como valor de esa llave. Si no hay opciones que especificar para un plugin, simplemente usa `true` como valor.

En el archivo `.browserslistrc` puedes especificar qué navegadores soporta tu app. Esta información es utilizada por Autoprefixer, cssnext y otras herramientas.

```
> 1%
last 2 versions
```

Para habilitar el uso de [CSS Modules](https://github.com/css-modules/css-modules) el procedimiento es ligeramente diferente, usando la llave `modules` en el primer nivel, en lugar de dentro de `plugins`. Esto es debido a que Parcel trata los "CSS Modules" de manera especial, puesto que estos exportan un objeto que debe ser incluido en el paquete de JavaScript. Además necesitas instalar `postcss-modules` en tu proyecto.

## PostHTML

[PostHTML](https://github.com/posthtml/posthtml) es una herramienta para transformar HTML con plugins. Puedes configurar PostHTML con Parcel creando un archivo de configuración usando uno de esos nombres: `.posthtmlrc` (JSON), `.posthtmlrc.js`, o `posthtml.config.js`.

Instala los plugins que necesites en tu app:

```bash
yarn add posthtml-img-autosize
```

Luego, crea un archivo `.posthtmlrc`:

```json
{
  "plugins": {
    "posthtml-img-autosize": {
      "root": "./images"
    }
  }
}
```

Los plugins deben ser declarados en el objeto `plugins` como llaves, y las opciones correspondientes son especificadas usando un objeto como valor de esa llave. Si no hay opciones que especificar para un plugin, simplemente usa `true` como valor.

## TypeScript

[TypeScript](https://www.typescriptlang.org/) es un superconjunto de JavaScript que añade información de tipos de datos, y que compila a JavaScript simple, y también soporta todas las funcionalidades y sintáxis de ES2015+. Transformar TypeScript funciona sin necesidad de configurar ni instalar nada adicional.

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
import message from './message'
console.log(message)
```

```typescript
// message.ts
export default 'Hello, world'
```
