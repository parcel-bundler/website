# ✂️ Code Splitting

Parcel soporta separación de código sin necesidad de configuración. Esto permite separar el código de tu aplicación en paquetes separados que pueden ser cargados bajo demanda, lo que significa paquetes iniciales de menor tamaño y tiempos de carga más rápido. A medida que el usuario navega por tu aplicación y los módulos son requeridos, Parcel automáticamente se encarga de cargar los demás paquetes bajo demanda.

La separación de código es controlada por la función dinámica [propuesta](https://github.com/tc39/proposal-dynamic-import) `import()`, que funciona como la declaración `import` o la función `require`, con la diferencia de que esta retorna un promesa. Esto significa que el módulo es cargado de forma asíncrona.

El siguiente ejemplo muestra como podrías usar las importaciones dinámicas para cargar una página de tu aplicación bajo demanda.

```javascript
// pages/about.js
export function render() {
  // Renderiza la página
}
```

```javascript
import('./pages/about').then(function(page) {
  // Renderiza la página
  page.render()
})
```

Como `import()` retorna una promesa, también puedes usar async/await. Probablemente necesites configurar Babel para transpilar la sintaxis hasta que este tenga un soporte más amplio en los navegadores.

```javascript
const page = await import('./pages/about')
// Renderiza la página
page.render()
```

Las importaciones dinámicas también se cargan de forma diferida en Parcel, por lo que puedes colocar todas tus llamadas `import()` en la parte de arriba de tu archivo y los paquetes hijos no serán cargados hasta que estos sean utilizados. El siguiente ejemplo muestra como podrías cargar páginas de forma diferida en tu aplicación dinámicamente.

```javascript
// Configuración de un map de nombres de páginas que serán importadas.
// Estas no serán cargadas hasta que sean utilizadas.
const pages = {
  about: import('./pages/about'),
  blog: import('./pages/blog')
}

async function renderPage(name) {
  // Carga de forma diferida la página solicitada.
  const page = await pages[name]
  return page.render()
}
```

**Nota:** Si deseas usar async/await en navegadores que no lo soportan nativamente, recuerda incluir `babel-polyfill` en tu aplicación o `babel-runtime` + `babel-plugin-transform-runtime` en las librerias).

```bash
yarn add babel-polyfill
```

```javascript
import 'babel-polyfill'
import './app'
```

Lee la documentación en [babel-polyfill](http://babeljs.io/docs/usage/polyfill) y [babel-runtime](http://babeljs.io/docs/plugins/transform-runtime).
