# 🌳 Variables d'environnement

Parcel utilise [dotenv](https://github.com/motdotla/dotenv) pour charger les variables d'environnement depuis les fichiers `.env`.

Les fichiers `.env` doivent être placés au même endroit que le `package.json` qui contient votre dépendance `parcel-bundler`.

Parcel charge les fichiers `.env` avec ces noms spécifiques pour les valeurs de `NODE_ENV` suivantes :

| Nom de fichier `.env` valide | `NODE_ENV=\*` | `NODE_ENV=test` |
| ---------------------------- | ------------- | --------------- |
| `.env`                       | ✔️            | ✔️              |
| `.env.local`                 | ✔️            | ✖️              |
| `.env.${NODE_ENV}`           | ✔️            | ✔️              |
| `.env.${NODE_ENV}.local`     | ✔️            | ✔️              |

Notamment :

- `NODE_ENV` est par défaut à `development`.
- `.env.local` n'est pas chargé quand `NODE_ENV=test` car [les tests doivent produire les mêmes résultats pour tout le monde](https://github.com/parcel-bundler/parcel/blob/28df546a2249b6aac1e529dd629f506ba6b0a4bb/src/utils/env.js#L9)
