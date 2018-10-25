# 🚀 Come Iniziare

Parcel è un bundle di applicazioni web, che si differenzia per la sua developer experience (DX). Offre prestazioni incredibili e veloci utilizzando elaborazione multicore e non richiede configurazioni.

Per prima cosa installa Parcel usando Yarn o npm:

Yarn:

```bash
yarn global add parcel-bundler
```

npm:

```bash
npm install -g parcel-bundler
```

Creare un file package.json nella cartella del progetto:

```bash
yarn init -y
```

or

```bash
npm init -y
```

Parcel può prendere qualsiasi tipo di file come entry point, di solito un file HTML o JavaScript è un ottimo punto di partenza. Se si collega un file JavaScript all'HTML usando un percorso relativo, Parcel lo elaborerà e sostituirà il riferimento con un URL al file di output.

Successivamente, creare un file index.html e index.js.

```html
<html>
<body>
  <script src="./index.js"></script>
</body>
</html>
```

```javascript
console.log('hello world')
```

Parcel possiede nativamente un proprio server di sviluppo, che automaticamente ricostruisce la tua app man mano che cambi i file e supporta l'[hot module replacement](hmr.html) per consentire uno sviluppo rapido. Fai puntare il processo semplicemente al tuo entry point:

```bash
parcel index.html
```

Ora apri http://localhost:1234/ nel tuo browser. Puoi anche modificare la porta di default utilizzando l'opzione `-p <port number>`.

Usa il server di sviluppo quando non hai un tuo server, o la tua applicazione è interamente resa lato client. Se si dispone di un proprio server, è possibile eseguire Parcel in modalità "watch". Questa modalità traccia automaticamente il cambiamento dei file e supporta l'hot module replacement, ma non avvia un web server.

```bash
parcel watch index.html
```

Quando sei soddisfatto puoi creare una build di Produzione. Questa modalità disattiva il "watch" ed effettua una build soltanto. Vedi la sezione [Produzione](production.html) per ulteriori informazioni.
