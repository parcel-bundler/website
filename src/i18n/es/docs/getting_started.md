# 🚀 Empezar

Parcel es un empaquetador de aplicaciones web, que se diferencia por la experiencia ofrecida a los desarrolladores. Ofrece un rendimiento ultra-rápido, utilizando procesamiento multinúcleo, y no requiere configuración.

Primero instala Parcel utilizando Yarn or npm:

Yarn:
```bash
yarn global add parcel-bundler
```

npm:
```bash
npm install -g parcel-bundler
```

Crea un archivo package.json en el directorio de su proyecto, usando:

```bash
yarn init -y
```
o
```bash
npm init -y
```

Parcel puede utilizar cualquier tipo de archivo como punto de entrada, pero un archivo HTML o JavaScript es un buen lugar para comenzar. Si enlazas tu archivo JavaScript principal en el HTML usando rutas relativas, entonces Parcel lo procesará por ti, y reemplazará la referencia con una URL al archivo de salida.

A continuación, crea los archivos index.html y index.js.

```html
<html>
<body>
  <script src="./index.js"></script>
</body>
</html>
```

```javascript
console.log("hola mundo");
```

Parcel tiene un servidor de desarrollo embebido, el cual automáticamente reconstruye su aplicación cuando realiza cambios en los archivos, y soporta [reemplazo de módulos en caliente](hmr.html) para desarrollar rápidamente. Solo debes indicar el archivo de entrada:

```bash
parcel index.html
```

Ahora, abre http://localhost:1234/ en su navegador. También puedes reemplazar el puerto por defecto usando la opción `-p <port number>`.

Utiliza el servidor de desarrollo cuando no tengas tu propio servidor, o tu aplicación sea completamente renderizada en el lado del cliente. Si cuentas con tu propio servidor, puedes ejecutar Parcel en modo `watch`. Este modo seguirá reconstruyendo la aplicación automáticamente cuando hagas cambios en tus archivos y seguirá soportando reemplazo de módulos en caliente, pero no iniciará un servidor web.

```bash
parcel watch index.html
```

Cuando estes listo para construir tu aplicación para producción, el modo `build` deshabilita el modo `watch` y solo construye la aplicación una vez. Ve la sección [Producción](production.html) para más detalles.
