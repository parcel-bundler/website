# 🖥 CLI

## Comandi

### Serve

Serve inizializza il server di sviluppo, che effettuerà una rebuild della tua app automaticamente ogni volta che cambi qualche file, e supporta l'[hot module replacement](hmr.html) per uno sviluppo più rapido.

```bash
parcel index.html
```

### Build

Build crea gli asset una volta, abilita la minificazione e imposta la variable NODE_ENV per la [Produzione](production.html).

```bash
parcel build index.html
```

### Watch

Il comando watch è simile a serve, con la differenza che non inizializza il server di sviluppo.

```bash
parcel watch index.html
```

### Help

Mostra tutte le possibili opzioni

```bash
parcel help
```

## Opzioni

### Directory di Output

Default: "dist"

Disponibile in: `serve`, `watch`, `build`

```bash
parcel build entry.js --out-dir build/output
or
parcel build entry.js -d build/output
```

```base
root
- build
- - output
- - - entry.js
```

### Imposta l'URL pubblico sul quale creare l'app

Default: "/"

Available in: `serve`, `watch`, `build`

```bash
parcel build entry.js --public-url ./dist/
```

produrrà:

```html
<link rel="stylesheet" type="text/css" href="/dist/entry.1a2b3c.css">
oppure
<script src="/dist/entry.e5f6g7.js"></script>
```

### Target

Default: browser

Disponibile in: `serve`, `watch`, `build`

```bash
parcel build entry.js --target node
```

Possibili target: node, browser e electron

### Change Log level

Default: 3

Disponibile in: `serve`, `watch`, `build`

```bash
parcel build entry.js --log-level 1
```

| Loglevel | Effetto             |
| -------- | ------------------- |
| 0        | Logging disattivo   |
| 1        | Log solo errori     |
| 2        | Log errori e avvisi |
| 3        | Log di tutto        |

### HMR Hostname

Default: `location.hostname` della finestra corrente

Disponibile in: `serve`, `watch`

```bash
parcel build entry.js --hmr-hostname parceljs.org
```

### Porta HMR

Default: Una porta casuale libera

Disponibile in: `serve`, `watch`

```bash
parcel build entry.js --hmr-port 8080
```

### Nome del file di Output

Default: Nome del file originale

Disponibile in: `serve`, `watch`, `build`

```bash
parcel build entry.js --out-file output.html
```

Questo cambia il nome del file di output del bundle entrypoint

### Produzione di un report dettagliato

Default: Report minimale

Disponibile in: `build`

```bash
parcel build entry.js --detailed-report
```

### Imposta un certificato personalizzato

Default: Genera un certificato

Disponibile in: `serve`

```bash
parcel build entry.js --cert certificate.cert --key private.key
```

### Apri nel browser

Default: apertura disattivata

Disponibile in: `serve`

```bash
parcel build entry.js --open
```

### Disabilita source-maps

Default: source-maps abilitate

Disponibile in: `serve`, `watch`, `build`

```bash
parcel build entry.js --no-source-maps
```

### Disabilita autoinstallazione

Default: autoinstallazione abilitata

Disponibile in: `serve`, `watch`

```bash
parcel build entry.js --no-autoinstall
```

### Disabilita HMR

Default: HMR abilitato

Disponibile in: `serve`, `watch`

```bash
parcel build entry.js --no-hmr
```

### Disabilita minificazione

Default: minificazione abilitata

Disponibile in: `build`

```bash
parcel build entry.js --no-minify
```

### Disabilita la cache del filesystem

Default: cache abilitata

Disponibile in: `serve`, `watch`, `build`

```bash
parcel build entry.js --no-cache
```
