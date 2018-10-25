# ✨ Produzione

Quando si tratta di preparare l'applicazione per il server di Produzione, è possibile utilizzare la modalità di Produzione di Parcel.

```bash
parcel build entry.js
```

disabilita la modalità watch e l'hot module replacement in modo che si possa creare una sola volta la build. Consente inoltre di minificare tutti i bundle di output di ridurre le dimensioni del file. I minificatori utilizzati da Parcel sono [terser](https://github.com/fabiosantoscode/terser) per JavaScript, [cssnano](http://cssnano.co) per CSS e [htmlnano](https://github.com/posthtml/htmlnano) per HTML.

L'abilitazione della modalità di Produzione imposta anche la variabile d'ambiente `NODE_ENV=production`. Le grandi librerie come React hanno solo funzioni di debug per lo sviluppo che sono disabilitate impostando questa variabile d'ambiente, il che si traduce in build più piccoli e veloci per la Produzione.
