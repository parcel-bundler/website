# 🛠 Cómo funciona

Parcel transforma un árbol de **archivos** en un árbol de **paquetes**. Muchos otros bundlers se basan fundamentalmente en archivos de JavaScript, con otros formatos añadidos, p.e. inline en archivos JS. Parcel es independiente del tipo de archivo; funcionará con cualquier tipo de archivo como se espera, sin configuración. Hay tres pasos para el proceso de construcción de Parcel.

### 1. Construyendo el arbol de ficheros

Parcel toma como entrada un único archivo de entrada, que puede ser de cualquier tipo: un archivo JS, HTML, CSS, imagen, etc. Hay varios [tipos de archivos](tipos_activos.html) definidos en Parcel que él sabe cómo manejar. Los archivos se analizan, se extraen sus dependencias y se transforman en su forma compilada final. Esto crea un árbol de archivos.

### 2. Construyendo el arbol de paquetes

Una vez que se ha construido el árbol de archivos, los archivos se colocan en un árbol de paquetes. Se crea un paquete para el archivo de entrada, y los paquetes secundarios se crean para `import()` dinámicos, lo que provoca la división del código.

Los paquetes hermanos se crean cuando se importan archivos de un tipo diferente, por ejemplo, si importó un archivo CSS desde JavaScript, se colocaría en un paquete hermano con el JavaScript correspondiente.

Si se requiere un archivo en más de un paquete, este se eleva hasta el antecesor común más cercano en el árbol del paquete, por lo que no se incluye más de una vez.

### 3. Empaquetando

Después de construir el árbol de paquetes, cada paquete se escribe en un archivo por un [packager](packagesrs.html) específico para el tipo de archivo. Los empaquetadores saben cómo combinar el código de cada archivo en el archivo final que carga un navegador.
