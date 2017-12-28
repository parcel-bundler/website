# 🚀 Empezar

Parcel es un empaquetador de aplicaciones web, el cual se diferencia por la experiencia ofrecida a los desarrolladores. Ofrece una performance ultra-rápido, utilizando procesamiento multinúcleo, y no requiere configuración.

Primero instale Parcel utilizando Yarn or npm:

Yarn:
```bash
yarn global add parcel-bundler
```

npm:
```bash
npm install -g parcel-bundler
```

Crear un archivo package.json en el directorio de su proyecto, usando:

```bash
yarn init -y
```
o
```bash
npm init -y
```

Parcel puede utilizar cualquier tipo de archivo como punto de entrada, pero un archivo HTML o JavaScript es un buen lugar para comenzar. Si enlaza su archivo JavaScript principal en el HTML usando rutas relativas, entonces Parcel lo procesara por usted, y reemplazara la referencia con una URL al archivo de salida.

A continuación, crear los archivos index.html y index.js.

```html
<html>
<body>
  <script src="./index.js"></script>
</body>
</html>
```

```javascript
console.log("hello world");
```

Parcel tiene un servidor de desarrollo embebido, el cual automáticamente reconstruye su aplicación cuando realiza cambios en los archivos, y soporta [Reemplazo de módulos en caliente](hmr.html) para desarrollar rápidamente. Solo debe indicar el archivo de entrada:

```bash
parcel index.html
```

Ahora, abra http://localhost:1234/ en su navegador. También puede reemplazar el puerto por defecto usando la opción `-p <port number>`.

Utilice el servidor de desarrollo cuando no tenga su propio servidor, o su aplicación sea completamente renderizada en el lado del cliente. Si no cuenta con su propio servidor, puede ejecutar Parcel en modo `watch`. Esto seguirá reconstruyendo la aplicación automáticamente cuando haga cambios en sus archivos y sigue soportando reemplazo de módulos en caliente, pero no inicia un servidor web.

```bash
parcel watch index.html
```

Cuando este listo para construir su aplicación para producción, el modo `build` deshabilita el modo `watch` y solo construye la aplicación una vez. Vea la sección [Producción](production.html) para más detalles.
