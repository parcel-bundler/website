# 📦 Recursos

Parcel está basado en recursos. Un recurso puede ser cualquier archivo, sin embargo, parcel tiene soporte especial para algunos tipos de archivos como JavaScript, CSS, y HTML. Parcel analiza automáticamente las dependencias a las que se hace referencia en estos archivos y los incluye en el paquete de salida. Recursos similares son agrupados en un mismo paquete de salida. Si importas un tipo de recurso diferente (por ejemplo, si importas un archivo CSS a partir de un archivo JS), empieza la construcción de un segundo archivo y añade una referencia al paquete de salida principal. Esto será demostrado en las próximas secciones.

## JavaScript

El tipo de archivo más común en los empaquetadores web es JavaScript. Parcel soporta tanto CommonJS como módulos en ES6 para importar archivos. También soporta la funcion `import()` para cargar los módulos de manera asíncrona, lo cual se muestra en detalle en la sección [Separación de Código](code_splitting.html).

```javascript
// importa un módulo utilizando CommonJS
const dep = require('./path/to/dep');

// importa un módulo utilizando ES6
import dep from './path/to/dep';
```

También puedes importar otros tipos de recursos que no sean JavaScript desde un archivo JavaScript como por ejemplo CSS o incluso una imagen. Cuando importas alguno de estos tipos de archivos, estos no serán insertados inline como sucede con otros empaquetadores. En vez de eso, este se colocará en un paquete diferente (por ejemplo un archivo CSS) junto con todas sus dependencias. Cuando se usa [CSS Modules](https://github.com/css-modules/css-modules), las clases exportadas serán añadidas al paquete de salida JavaScript. Otros tipos de recursos exportan una URL al paquete de salida JavaScript para que puedas referenciarlo en tu código.

```javascript
// Importa un archivo CSS
import './test.css';

// Importa un archivo CSS con CSS modules
import classNames from './test.css';

// Importa la URL de una imagen
import imageURL from './test.png';
```

Si quieres insertar inline un archivo dentro de un paquete de salida JavaScript, en vez de referenciarlo por su URL, puedes usar el API `fs.readFileSync` de Node.js. La URL debe ser analizada estáticamente, quiere decir, que no pueden contener otras variables (a parte de `__dirname` y `__filename`).

```javascript
import fs from 'fs';

// Lee el contenido como un string
const string = fs.readFileSync(__dirname + '/test.txt', 'utf8');

// Lee el contenido como un Buffer
const buffer = fs.readFileSync(__dirname + '/test.png');
```

## CSS

Los archivos CSS pueden ser importados a partir de un archivo JavaScript o HTML, y pueden tener referencias de dependencias utilizando  `@import` así también como referencias a imágenes, fuentes, etc, a través de la función `url()`. Otros archivos CSS que fueron importados utilizando `@import` son insertados inline en el mismo paquete CSS, y las referencias usando `url()` son reescritas con sus respectivos nombres. Todos los nombres de los archivos deben ser relativos al archivo CSS actual.

```css
/* Importa otro archivo CSS */
@import './other.css';

.test {
  /* Referencia una imagen */
  background: url('./images/background.png');
}
```

A parte de archivos CSS planos, otros lenguajes que compilan a CSS como LESS, SASS, y Stylus son también soportados, y funcionan de la misma manera.

## SCSS
Para compilar SCSS es necesario el módulo `sass`. Puedes instalarlo usando npm:
```
npm install sass
```
Una vez que tengas `sass` instalado puedes importar tus archivos SCSS desde archivos JavaScript.
```
import './custom.scss'
```
Puedes añadir dependencias a los archivos SCSS usando `@import`.

## HTML

Los archivos HTML son frecuentemente utilizados como punto de entrada para Parcel, pero también pueden ser referenciados en archivos JavaScript, por ejemplo: para proporcionar enlaces a otras páginas. URL a scripts, estilos, multimedia, y otros archivos HTML son extraídos y compilados como se describe arriba. Las referencias son reescritas en el HTML para que sean vinculadas correctamente. Todos los nombres de archivos deben ser relativos al archivo HTML actual.

```html
<html>
<body>
  <!-- referencia a una imagen -->
  <img src="./images/header.png">

  <a href="./other.html">Enlace a otra página</a>

  <!-- Importa un paquete JavaScript -->
  <script src="./index.js"></script>
</body>
</html>
```
