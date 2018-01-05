# ✂️ Code Splitting

Parcel admite code splitting por defecto. Esto le permite dividir el código de la aplicación en paquetes separados que se pueden cargar según necesidad, lo que significa tamaños de paquete inicial más pequeños y tiempos de carga más rápidos. A medida que el usuario navega por su aplicación y se requieren módulos, Parcel se encarga automáticamente de cargar los paquetes secundarios necesarios.

La división de código se controla mediante el uso de la función dinámica `import()` [propuesta de sintaxis](https://github.com/tc39/proposal-dynamic-import), que funciona como la declaración `import` normal o la función `require`, pero devuelve una promesa. Esto significa que el módulo se carga de forma asíncrona.

El siguiente ejemplo muestra cómo puede usar las importaciones dinámicas para cargar una subpágina de su aplicación bajo demanda.

```javascript
// pages/about.js
export function render() {
  // Renderiza la página
}
```

```javascript
import("./pages/about").then(function(page) {
  // Renderiza la página
  page.render();
});
```

Como `import()` devuelve una Promesa, también puede usar la sintaxis async/await. Sin embargo, es probable que necesite configurar Babel para transpilar la sintaxis, hasta que sea más ampliamente compatible con los navegadores.

```javascript
const page = await import('./pages/about');
// Renderiza la página
page.render();
```

Las importaciones dinámicas también se cargan de forma perezosa en Parcel, por lo que puede seguir colocando todas sus llamadas `import()` en la parte superior de su archivo y los paquetes secundarios no se cargarán hasta que se utilicen. El siguiente ejemplo muestra cómo puede cargar las subpáginas de una aplicación de forma dinámica.

```javascript
// Configurar un mapa de nombres de página para las importaciones dinámicas.
// Estos no son cargados hasta que no son necesarios.
const pages = {
  about: import("./pages/about"),
  blog: import("./pages/blog")
};

async function renderPage(name) {
  // Cargue la página solicitada cuando sea necesaria.
  const page = await pages[name];
  return page.render();
}
```

**Nota:** Si desea utilizar async/await en los navegadores que no lo admiten de forma nativa, recuerde incluir `babel-polyfill` en su aplicación o `babel-runtime` + `babel-plugin-transform-runtime` en las librerias).

```bash
yarn add babel-polyfill
```

```javascript
import "babel-polyfill";
import "./app";
```

Lea la documentación en [babel-polyfill](http://babeljs.io/docs/usage/polyfill) y [babel-runtime](http://babeljs.io/docs/plugins/transform-runtime).
