# 🚀 Getting Started

Parcel es un empaquetador de aplicaciones web, diferenciado por la experiencia de su desarrollador. Ofrece un rendimiento increíblemente rápido utilizando el procesamiento multinúcleo y no requiere configuración.

Primero instale el paquete usando yarn o npm:

Yarn:

```bash
yarn global add parcel-bundler
```

npm:

```bash
npm install -g parcel-bundler
```

Cree un archivo package.json en su directorio de proyecto usando:

```bash
yarn init -y
```

or

```bash
npm init -y
```

Parcel puede tomar cualquier tipo de archivo como punto de entrada, pero un archivo HTML o JavaScript es un buen lugar para comenzar. Si vincula su archivo JavaScript principal en el HTML utilizando una ruta relativa, Parcel también lo procesará y reemplazará la referencia con una URL al archivo de salida.

A continuación, cree un archivo `index.html` y un archivo `index.js`.

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

Parcel tiene un servidor de desarrollo integrado, que reconstruirá automáticamente su aplicación a medida que cambia los archivos y es compatible con [hot module replacement](hmr.html) para un desarrollo rápido. Simplemente apúntalo a tu archivo de entrada:

```bash
parcel index.html
```

Ahora abra http://localhost:1234/ en su navegador. También puede cambiar el puerto por defecto con la opción `-p <número de puerto>`.

Utilice el servidor de desarrollo cuando no tenga su propio servidor o su aplicación esté completamente renderizada en el cliente. Si tiene su propio servidor, puede ejecutar Parcel en modo `watch`. Esto hace que aún se reconstruya automáticamente a medida que los archivos cambian y es compatible con hot module replacement, pero no inicia un servidor web.

```bash
parcel watch index.html
```

Cuando esté listo para generar un paquete para producción, el modo `build` desactiva HMR y solo genera el paquete una vez. Consulte la sección [Producción](producción.html) para obtener más detalles.
