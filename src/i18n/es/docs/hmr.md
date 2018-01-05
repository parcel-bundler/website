# 🔥 Hot Module Replacement

Hot Module Replacement (HMR) mejora la experiencia de desarrollo al actualizar automáticamente los módulos en el navegador en tiempo de ejecución sin necesidad de actualizar toda la página. Esto significa que el estado de la aplicación se puede conservar a medida que cambia cosas pequeñas. La implementación HMR de Parcel admite archivos de JavaScript y CSS de forma inmediata. HMR se deshabilita automáticamente cuando se genera un paquete en modo de producción.

A medida que guarda los archivos, Parcel reconstruye lo que fue cambiado y envía una actualización a cualquier cliente en ejecución que contenga el nuevo código. El nuevo código reemplaza a la versión anterior y se vuelve a ejecutar junto con todos los padres. Puede escuchar este evento usando la API `module.hot`, que notificará a su código cuando un módulo está a punto de ser eliminado, o cuando aparece una nueva versión. Proyectos como [react-hot-loader](https://github.com/gaearon/react-hot-loader) puede ayudar con este proceso y a trabajar de manera inmediata con Parcel.

Hay dos métodos que debería conocer: `module.hot.accept` y `module.hot.dispose`. Llama a `module.hot.accept` con una función callback que se ejecuta cuando ese módulo o cualquiera de sus dependencias se actualizan. `module.hot.dispose` acepta una callback que se invoca cuando ese módulo está a punto de ser reemplazado.

```javascript
if (module.hot) {
  module.hot.dispose(function() {
    // el módulo está a punto de ser reemplazado
  });

  module.hot.accept(function() {
    // el módulo o alguna de sus dependencias acaba de ser actualizada
  });
}
```
