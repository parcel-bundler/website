# ✨ Producción

Cuando llegue el momento de empaquetar tu aplicación para producción, puedes usar el modo producción de Parcel

```bash
parcel build entry.js
```

Esto deshabilita el modo `watch` y el reemplazo de módulos en caliente, por lo tanto solo se construirá la aplicación una vez. Además, se habilita el minificador para todas las salidas empaquetadas, lo que reduce el tamaño de los archivos. Los minificadores usados por Parcel son [terser](https://github.com/fabiosantoscode/terser) para JavaScript, [cssnano](http://cssnano.co) para CSS, and [htmlnano](https://github.com/posthtml/htmlnano) para HTML.

La habilitación del modo producción también configura la variable de entorno `NODE_ENV=production`. Librerías grandes como React contienen características para depuración que son deshabilitadas al configurar esta variable de entorno, lo que resulta en una construcción más pequeña y rápida para producción.

### Opciones

#### Configurar el directorio de salida

Por defecto: "dist"

```bash
parcel build entry.js --out-dir build/output
o
parcel build entry.js -d build/output
```

```base
root
- build
- - output
- - - entry.js
```

#### Configurar la URL publica en la cual servir

Por defecto: "/"

```bash
parcel build entry.js --public-url ./
```

salida:

```html
<link rel="stylesheet" type="text/css" href="1a2b3c4d.css">
or
<script src="e5f6g7h8.js"></script>
```

#### Deshabilitar la minificacion

Por defecto: minificación habilitada

```bash
parcel build entry.js --no-minify
```

#### Deshabilitar el cache de sistema de archivos

Por defecto: cache habilitado

```bash
parcel build entry.js --no-cache
```
