# 🛠 Cómo funciona

Parcel transforma un árbol de **recursos** en un árbol de **paquetes**. Otros empaquetadores están basados fundamentalmente en recursos JavaScript, con otros formatos añadidos - por ejemplo insertados inline como strings en archivos JS. Parcel es agnóstico con respecto a tipos de archivos - y funcionará con recursos de cualquier tipo en la forma que uno esperaría, sin necesidad de configurarlo. Hay tres pasos en el proceso de empaquetamiento de Parcel.

### 1. Construyendo el árbol de recursos

Parcel toma como entrada un único recurso de partida, que puede ser de cualquier tipo: un archivo JS, HTML, CSS, imágen, etc. Existen varios [tipos de recursos](asset_types.html) definidos en Parcel, cada uno de los cuales saben como manipular determinados tipos de archivos. Los recursos son analizados, sus dependencias extraídas, y luego transformadas a su forma compilada final. Esto genera un árbol de recursos.

### 2. Construyendo el árbol de paquetes

Una vez que el árbol de recursos fue construído, los recursos son ubicados en un árbol de paquetes. Se crea un paquete para el recurso de partida, y para cada `import()` dinámico se crean paquetes hijos, los cuales hacen que ocurra la separación de código.

Cuando se importan recursos de diferente tipo, se crean paquetes adyacentes, por ejemplo si se importa un archivo CSS desde JavaScript, este sería ubicado en un paquete adyacente al paquete correspondiente de JavaScript.

Si un recurso es requerido por más de un paquete, este se eleva hasta el nivel ancestro común más cercano en el árbol de paquetes, para garantizar que no se incluye más de una vez.

### 3. Empaquetado

Luego de que el árbol de paquetes es construído, cada paquete es procesado por un [empaquetador](packagers.html) específico al tipo de archivo, y este se encarga de escribir el paquete en cuestión hacia un archivo. Los empaquetadores saben como combinar el código de cada recurso juntándolos todos en el archivo final que es cargado por el navegador.
