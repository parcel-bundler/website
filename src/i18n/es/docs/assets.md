# 📦 Assets

Parcel se basa en archivos. Parcel tiene soporte especial para ciertos tipos de activos como archivos JavaScript, CSS y HTML. Parcel analiza automáticamente las dependencias a las que se hace referencia en estos archivos y las incluye en el paquete de salida. Los archivos de tipos similares se agrupan en el mismo paquete de salida. Si importa un archivo de un tipo diferente (por ejemplo, si importó un archivo CSS desde JS), inicia un paquete secundario y deja una referencia en el padre. Esto se ilustrará en las siguientes secciones.

## JavaScript

El tipo de archivo más tradicional para los empaquetadores web es JavaScript. Parcel admite la sintaxis del módulo CommonJS y ES6 para importar archivos. También admite la sintaxis de la función dinámica `import()` para cargar módulos de forma asíncrona, lo cual se trata en la sección [Code Splitting](code_splitting.html).

```javascript
// Importar un módulo usando sintaxis CommonJS
const dep = require("./path/to/dep");

// Importar un módulo usando sintaxis ES6 Imports
import dep from "./path/to/dep";
```

También puede importar elementos que no sean de JavaScript desde un archivo JavaScript, p.e. CSS o incluso un archivo de imagen. Cuando importa uno de estos archivos, no se inyecta 'inline' como en otros bundlers. En cambio, se coloca en un paquete separado (por ejemplo, un archivo CSS) junto con todas sus dependencias. Al usar [Módulos CSS](https://github.com/css-modules/css-modules), las clases exportadas se colocan en el paquete de JavaScript. Otros tipos de activos exportan una URL al archivo de salida en el paquete de JavaScript para que pueda hacer referencia a ellos en su código.

```javascript
// Importar un archivo CSS
import "./test.css";

// Importar un archivo CSS con módulos CSS
import classNames from "./test.css";

// Importar una URL a una imágen
import imageURL from "./test.png";
```

Si desea insertar un archivo 'inline' en el paquete de JavaScript en lugar de referenciarlo por URL, puede usar la API Node.js `fs.readFileSync` para hacerlo. La URL debe ser analizable estáticamente, lo que significa que no puede tener ninguna variable (que no sea `__dirname` y`__filename`).

```javascript
import fs from "fs";

// Leer el contenido como un string
const string = fs.readFileSync(__dirname + "/test.txt", "utf8");

// Leer el contenido como un Buffer
const buffer = fs.readFileSync(__dirname + "/test.png");
```

## CSS

Los activos CSS se pueden importar desde un archivo JavaScript o HTML, y pueden contener dependencias referenciadas por la sintaxis `@import`, así como referencias a imágenes, fuentes, etc. a través de la función`url()`. Otros archivos CSS que están `@import`ados serán insertados en el mismo paquete de CSS, y las referencias`url()`se reescriben en sus nombres de archivo de salida. Todos los nombres de archivo deben ser relativos al archivo CSS actual.

```css
/* Importar otro archivo CSS */
@import "./other.css";

.test {
  /* Referenciar un archivo de imágen */
  background: url("./images/background.png");
}
```

Además del CSS plano, también se admiten otros lenguajes de compilación a CSS como LESS, SASS y Stylus, y funcionan de la misma manera.

## SCSS

La compilación SCSS necesita el módulo `node-sass`. Para instalarlo con npm:

```
npm install node-sass
```

Una vez que haya instalado `node-sass`, puede importar archivos SCSS desde archivos JavaScript.

```
import './custom.scss'
```

Las dependencias en los archivos SCSS se pueden usar con las sentencias `@import`.

## HTML

Los archivos HTML suelen ser el archivo de entrada que proporciona a Parcel, pero también pueden ser referenciados por archivos JavaScript, p.e. para proporcionar enlaces a otras páginas. Las URL de los scripts, estilos, medios y otros archivos HTML se extraen y compilan como se describió anteriormente. Las referencias se reescriben en el HTML para que se vinculen a los archivos de salida correctos. Todos los nombres de archivo deben ser relativos al archivo HTML actual.

```html
<html>
<body>
  <!-- Referencia un archivo de imágen -->
  <img src="./images/header.png">

  <a href="./other.html">Enlace a otra página</a>

  <!-- Importa un paquete Javascript -->
  <script src="./index.js"></script>
</body>
</html>
```
