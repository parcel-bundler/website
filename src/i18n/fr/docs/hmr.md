# 🔥 Remplacement de module à chaud

Le remplacement de module à chaud (Hot Module Replacement : HMR) améliore l'expérience de développement en mettant à jour automatiquement les modules dans le navigateur lors de l'exécution sans nécessiter une actualisation complète de la page. Cela signifie que l'état de l'application peut être conservé lorsque vous changez de petites choses. L'implémentation HMR de Parcel supporte à la fois les ressources JavaScript et CSS.

Depuis la version 1.12.0, l'implémentation par défaut a été modifiée pour actualiser complètement la page lorsque les fichiers sont modifiés. Vous pouvez choisir d'activer le HMR en ajoutant ce qui suit dans votre application. Cela ne s'appliquera que dans le mode développement, HMR est automatiquement désactivé lors de la construction en mode de production.

```javascript
if (module.hot) {
  module.hot.accept()
}
```

Lorsque vous enregistrez des fichiers, Parcel reconstruit les éléments modifiés et envoie une mise à jour contenant le nouveau code à tous les clients en cours d'exécution. Le nouveau code remplace alors l'ancienne version et il est réévalué avec tous les parents. Vous pouvez vous connecter à ce processus en utilisant l'API `module.hot`, qui peut notifier votre code quand un module est sur le point d'être éliminé, ou quand une nouvelle version arrive. Des projets comme [react-hot-loader](https://github.com/gaearon/react-hot-loader) peuvent aider pour ce processus et fonctionnent immédiatement avec Parcel.

Il y a deux méthodes à connaître : `module.hot.accept` et `module.hot.dispose`. Vous appelez `module.hot.accept` avec une fonction de rappel qui est exécutée lorsque ce module ou l'une de ses dépendances sont mis à jour. `module.hot.dispose` accepte une fonction de rappel qui est appelée lorsque ce module est sur le point d'être remplacé.

```javascript
if (module.hot) {
  module.hot.dispose(function() {
    // le module est sur le point d'être remplacé
  })

  module.hot.accept(function() {
    // le module ou l'une de ses dépendances vient d'être mis à jour
  })
}
```

## Dépendances installées automagiquement

Chaque fois que Parcel rencontre une dépendance qui correspond au schéma `node_module` et ne le trouve pas, Parcel tente d'installer cette dépendance en utilisant `yarn` ou `npm` selon la présence ou non d'un fichier `yarn.lock`. Cela évite au développeur de quitter Parcel ou d'avoir plusieurs fenêtres de terminal ouvertes.

Cela ne se produit qu'en _développement_ (en utilisant [`serve`](cli.md#serve) ou [`watch`](cli.md#watch)), par contre en production (en utilisant [`build`](cli.md#build)) autoinstall est désactivé pour empêcher les effets secondaires indésirables sur le déploiement.

Vous pouvez désactiver cette fonctionnalité en utilisant [`--no-autoinstall`](cli.md#désactiver-l'installation-automatique-de-dépendances).

## Safe Write

Certains éditeurs de texte et IDE ont une fonctionnalité appelée `safe write` qui évite la perte de données, en prenant une copie du fichier et en la renommant à l'enregistrement.

Lors de l'utilisation du Hot Module Reload (HMR), cette fonctionnalité bloque la détection automatique des mises à jour de fichiers. Pour désactiver `safe write` utilisez les options fournies ci-dessous :

- `Sublime Text 3` : ajoutez `atomic_save: "false"` à vos préférences utilisateur.
- `IntelliJ` : utilisez la recherche dans les préférences pour trouver "safe write" et désactivez-le.
- `Vim` : ajoutez `:set backupcopy=yes` à vos paramètres.
- `WebStorm` : décochez `Use "safe write"` dans Preferences > Appearance & Behavior > System Settings.
