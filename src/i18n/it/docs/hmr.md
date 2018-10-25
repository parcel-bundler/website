# 🔥 Hot Module Replacement

Hot Module Replacement (HMR) migliora l'esperienza di sviluppo aggiornando automaticamente i moduli nel browser durante l'esecuzione senza bisogno di un intero aggiornamento della pagina. Questo significa che lo stato dell'applicazione può essere mantenuto quando si implementano piccoli cambiamenti nel codice. L'implementazione HMR di Parcel supporta sia JavaScript che CSS. L'HMR viene disattivato automaticamente quando si esegue il bundle in modalità di produzione.

Quando si salvano i file, Parcel ricostruisce ciò che è cambiato e invia un aggiornamento a tutti i client in esecuzione contenenti il nuovo codice. Il nuovo codice sostituisce la vecchia versione e viene rivalutato insieme a tutti i genitori. Potete agganciarvi a questo processo usando l'API `module.hot`, che può notificare il vostro codice quando un modulo sta per essere scartato, o quando arriva una nuova versione. Progetti come [react-hot-loader](https://github.com/gaearon/react-hot-loader) possono essere d'aiuto in questo processo, e funzionano da subito con Parcel.

Ci sono due metodi da conoscere: `module.hot.accept` e `module.hot.dispose`. Si invoca `module.hot.accept` con una funzione di richiamo che viene eseguita quando il modulo o una delle sue dipendenze vengono aggiornati. Il `module.hot.dispose` accetta una callback che viene chiamata quando il modulo sta per essere sostituito.

```javascript
if (module.hot) {
  module.hot.dispose(function() {
    // il modulo sta per essere sostituito
  })

  module.hot.accept(function() {
    // il modulo o una delle sue dipendenze è stato appena aggiornato
  })
}
```

## Safe Write

Alcuni editor di testo e IDE hanno una funzione chiamata "safe write" che previene la perdita di dati, prendendo una copia del file e rinominandola una volta salvata.

Quando si utilizza Hot Module Reload (HMR) questa funzione blocca il rilevamento automatico degli aggiornamenti dei file, per disabilitare il "safe write" utilizzare le opzioni fornite di seguito:

- `Sublime Text 3` aggiungere atomic_save: "false" alle tue impostazioni utente.
- `IntelliJ` usa la ricerca nelle impostazioni per trovare "safe write" e disabilitarlo.
- `Vim` aggiungere :set backupcopy=yes alle tue impostazioni utente.
- `WebStorm` disattiva Usa "safe write" in Preferences > Appearance & Behavior > System Settings.
