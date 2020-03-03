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

Nota: Parcel convierte los archivos JS a ES5, los cuales no funcionarán dentro de la etiqueta 
`<script type="module">` así que simplemente usa la etiqueta `<script>` sin el atributo type en tu código HTML.

```javascript
console.log('hola mundo')
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

Tu también puedes usar [createapp.dev](https://createapp.dev/parcel) para crear un proyecto de Parcel en el navegador. Selecciona las tecnologías que quieras como por ejemplo React, Vue, TypeScript y CSS, y verás el proyecto generarse en vivo. También puedes usar esta herramientas para aprender a como montar un proyecto y además puedes descargar el proyecto como un archivo ZIP y empezar a programar al momento.

## Múltiples archivos de entrada

En caso de que tengas más de un archivo de entrada, digamos `index.html` y `about.html`, tu tienes dos maneras que ejecutar el empaquetador:

Especificamos los nombres de archivo:

```bash
parcel index.html about.html
```

También puedes crear un glob:

```bash
parcel *.html
```

_NOTA:_ En case de que tengas una estrucutura de archivos como esta:

```
- folder-1
-- index.html
- folder-2
-- index.html
```

Yendo a http://localhost:1234/folder-1/ no funcionará, en cambio tendrás que apuntar explícitamente al archivo http://localhost:1234/folder-1/index.html.

## Construyendo para producción

Cuando estés listo para construir para producción, el modo `build` para de ver los cambios y entonces solo empaqueta una vez. Mira la sección [Producción](production.html) para más detalles. 

## Añadiendo parcel a tu proyecto

A veces nos es posible instalar Parcel globalmente, por ejemplo, si estás construyendo el paquete de otra pesona o simplemente quieres usar una CI para construir tu paquete de manera programada. En este caso, puedes instalar y usar Parcel como un paquete local.

Para instalar con Yarn:

```bash
yarn add parcel-bundler --dev
```

Para instalar con NPM:

```bash
npm install parcel-bundler --save-dev
```

Luego, añade estos scripts a tu proyecto modificando tu `package.json`:

```json
{
  "scripts": {
    "dev": "parcel <your entry file>",
    "build": "parcel build <your entry file>"
  }
}
```

Entonces, podrás ejecutarlo:

```bash
# Para ejecutarlo en modo de desarrollo 
yarn dev
# o
npm run dev

# Para ejecutarlo en modo de producción
yarn build
# o
npm run build
```

