# 🔥 Reemplazo de Módulos en Caliente

El Reemplazo de Módulos en Caliente (HMR por sus siglas en inglés) mejora la experiencia de desarrollo al actualizar automáticamente los módulos en el navegador en tiempo de ejecución sin necesidad de actualizar toda la página. Esto significa que el estado de la aplicación se puede conservar a medida que cambian cosas pequeñas. La implementación HMR de Parcel soporta tanto archivos JavaScript como CSS sin necesidad de configuración. La funcionalidad HMR es automáticamente deshabilitada cuando se empaqueta la aplicación para un entorno de produción.

Mientras guardas los archivos, Parcel recontruye lo que haya cambiado y envía una actualización a cualquier cliente en ejecución que contenga el código a actualizar. El nuevo código reemplaza la versión antigua, y es re-evaluado con todas sus dependencias. Puedes engancharte a este evento usando el API `module.hot`, el cual puede notificar a tu código cuando un módulo está a punto de ser eliminado, o cuando viene una nueva versión. Proyectos como [react-hot-loader](https://github.com/gaearon/react-hot-loader) ayudan con este proceso, y funcionan sin necesidad de configuración con Parcel.

Hay dos métodos que se deben conocer: `module.hot.accept` y `module.hot.dispose`. El método `module.hot.accept` necesita una función de retorno que será llamada cuando ese módulo o alguna de sus dependencias hayan sido actualizados. Por otro lado `module.hot.dispose` también necesita una función de retorno que será llamada cuando el módulo esté a punto de ser reemplazado.

```javascript
if (module.hot) {
  module.hot.dispose(function() {
    // El módulo está a punto de ser reemplazado
  })

  module.hot.accept(function() {
    // El módulo o alguna de sus dependencias ya fueron actualizadas.
  })
}
```
