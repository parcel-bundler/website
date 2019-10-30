# 🛠️ Débogage

Comme Parcel génère automatiquement des source maps par défaut, la configuration du débogage avec Parcel nécessite généralement un effort minimal.

## Chrome Developer Tools

En supposant que les source maps soient activées, aucune configuration supplémentaire n'est requise ici.

Par exemple, supposons que vous ayez une structure de dossier semblable à celle-ci :

```
├── package-lock.json
├── package.json
└── src
    ├── index.html
    └── index.ts
```

Où `index.ts` contient :

```Typescript
const variable: string = "Hello, World!";

document.getElementById("greeting").innerHTML = variable;
```

Et `index.html` contient :

```HTML
<!DOCTYPE html>
<html>
  <head>
    <title>Exemple de débogage Chrome</title>
  </head>
  <body>
    <h1 id="greeting"></h1>
    <script src="./index.ts"></script>
  </body>
</html>
```

(`package.json` n'a que `parcel-bundler` d'installé)

Avec cette configuration, vous pouvez exécuter `parcel src/index.html` et définir des points d'arrêt dans le code source, comme indiqué ci-dessous :

![Exemple de points d'arrêt dans Chrome](https://user-images.githubusercontent.com/30810402/67711207-dd519500-f997-11e9-987a-570d1ce677d4.png)

## Visual Studio Code

En supposant une structure de dossier/fichier similaire à celle présentée ci-dessus pour Chrome developer tools, le fichier `launch.json` peut être utilisé avec l'extension [Débogueur pour Chrome](https://marketplace.visualstudio.com/items?itemName=msjsdiag.debugger-for-chrome) :

```json
{
  // Utilisez IntelliSense pour en savoir plus sur les attributs possibles.
  // Passez le curseur de la souris sur les descriptions des attributs existants.
  // Pour plus d'informations, visitez : https://go.microsoft.com/fwlink/?linkid=830387
  "version": "0.2.0",
  "configurations": [
    {
      "type": "chrome",
      "request": "launch",
      "name": "Lance Chrome sur localhost",
      "url": "http://localhost:1234",
      "webRoot": "${workspaceFolder}",
      "breakOnLoad": true,
      "sourceMapPathOverrides": {
        "../*": "${webRoot}/*"
      }
    }
  ]
}
```

Ensuite, vous devrez démarrer le serveur de développement de Parcel avec votre point d’entrée, qui est ici `index.html` :

```
$ parcel src/index.html
```

La dernière étape consiste à démarrer le processus de débogage en cliquant sur la flèche verte dans le panneau de débogage. Vous devriez maintenant pouvoir définir des points d'arrêt dans votre code. Le résultat final ressemblera à ce qui suit :

![Exemple de débogage avec VSCode](https://user-images.githubusercontent.com/30810402/67711603-ad56c180-f998-11e9-8cee-637fe5537643.png)
