# ✨ Producción

Cuando llega el momento de empaquetar su aplicación para producción, puede usar el modo de producción de Parcel.

```bash
parcel build entry.js
```

Esto desactiva el modo `watch` y el `hot module replacement`, por lo que solo se compilará una vez. También permite que el minificador de todos los paquetes de salida reduzca el tamaño del archivo. Los minificadores utilizados por Parcel son [uglify-es](https://github.com/mishoo/UglifyJS2/tree/harmony) para JavaScript, [cssnano](http://cssnano.co) para CSS y [htmlnano](https://github.com/posthtml/htmlnano) para HTML.

La habilitación del modo de producción también establece la variable de entorno `NODE_ENV=production`. Las bibliotecas grandes como React tienen características de depuración que se desactivan configurando esta variable de entorno, lo que da como resultado compilaciones más pequeñas y más rápidas para la producción.

### Opciones

#### Establecer el directorio de salida

Default: "dist"

```bash
parcel build entry.js --out-dir build/output
or
parcel build entry.js -d build/output
```

```base
root
- build
- - output
- - - entry.js
```

#### Establezca la URL pública donde servir

Por defecto: opción --out-dir

```bash
parcel build entry.js --public-url ./
```

will output:

```html
<link rel="stylesheet" type="text/css" href="1a2b3c4d.css">
or
<script src="e5f6g7h8.js"></script>
```

#### Desabilitar minificación

Por defecto: minificación habilitada

```
parcel build entry.js --no-minify
```

#### Desactivar la caché del sistema de ficheros

Por defecto: caché habilitada

```bash
parcel build entry.js --no-cache
```
