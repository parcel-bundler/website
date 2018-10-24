# 📦 Ressources

Parcel est basé sur des ressources. Une ressource peut être n'importe quel fichier, mais Parcel a un support spécial pour certains types de ressources comme les fichiers JavaScript, CSS et HTML. Parcel analyse automatiquement les dépendances référencées dans ces fichiers et les inclut dans le paquet en sortie. Les ressources de types similaires sont regroupées dans le même paquet en sortie. Si vous importez une ressource d'un type différent (par exemple, si vous avez importé un fichier CSS depuis un JS), il commence par créer un paquet enfant et laisse une référence dans le parent. Ceci sera illustré dans les sections suivantes.

Si vous ne parvenez pas à trouver un certain type de ressource dans la documentation, il est possible que la documentation soit obsolète. Pour la liste complète des types de ressource prise en charge, consultez [parcel/src/Parser.js](https://github.com/parcel-bundler/parcel/blob/master/packages/core/parcel-bundler/src/Parser.js#L10).
Pour la liste actuelle des analyseurs, consultez [parcel/src/assets/](https://github.com/parcel-bundler/parcel/tree/master/packages/core/parcel-bundler/src/assets).

Pour tout type de ressources non pris en charge par défaut, vous pouvez vérifier si un plugin existe déjà :

- [Yarn](https://yarnpkg.com/en/packages?q=parcel-plugin-&p=1)
- [npm](https://www.npmjs.com/search?q=parcel-plugin-)
- [awesome-parcel](https://github.com/parcel-bundler/awesome-parcel#plugins)

ou [créez le votre](https://parceljs.org/plugins.html).
