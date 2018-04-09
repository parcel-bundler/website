# 🛠 Comment ça marche

Parcel transforme un arborescence de **ressources** en un arborescence de **paquets**. La plupart des autres empaqueteurs sont fondamentalement basés sur les ressources JavaScript, avec d'autres formats intégrés à l'intérieur - par exemple intégrés en tant que Strings dans les fichiers JS. Parcel est agnostique du type de fichier - il fonctionnera avec n'importe quel type de ressource que vous souhaitez, sans configuration. Le processus d'empaquetage de Parcel comporte trois étapes.

### 1. Construction de l'arborescence des ressources

Parcel prend en entrée un seul élément ressource, qui peut être de n'importe quel type : un fichier JS, HTML, CSS, image, etc. Il y a plusieurs [types de ressources](asset_types.html) définis dans Parcel et il sait comment gérer les types de fichiers spécifiques. Les ressources sont analysés, leurs dépendances sont extraites et elles sont transformées en leur forme finale compilée. Cela crée une arborescence des ressources.

### 2. Construction de l'arborescence des paquets

Une fois que l'arborescence des ressources a été construite, les ressources sont placées dans une arborescence de paquet. Un paquet est créé pour l'élément en entrée et les paquets enfants sont créés pour les `import()` dynamiques, ce qui provoque le découpage du code.

Les paquets d'une fratrie sont créés lorsque les ressources d'un type différent sont importées, par exemple, si vous avez importé un fichier CSS à partir du JavaScript, il sera placé dans un paquet frère au JavaScript correspondant.

Si une ressource est requise dans plusieurs paquets, elle est remontée à l'ancêtre commun le plus proche dans l'arborescence des paquets ainsi elle n'est incluse qu'une fois.

### 3. Empaquetage

Après la construction de l'arborescence des paquets, chaque paquet est écrit dans un fichier par un [packager](packagers.html) spécifique au type de fichier. Les packagers savent comment combiner le code de chaque ressource dans le fichier final chargé par un navigateur.
