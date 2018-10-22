# 🛠 Come Funziona

Parcel trasforma un tree di **assets** in un tree di **bundles**. Molti altri bundler sono fondamentalmente basati su risorse JavaScript, con altri formati affrontati - ad esempio alternate come stringhe in file JS. Parcel è agnostico di tipo file: funziona con qualsiasi tipo di assets nel modo che ci si aspetterebbe, senza alcuna configurazione necessaria. Il processo di bundling di Parcel si articola in tre fasi.

### 1. Costruzione dell'Asset Tree

Il pacchetto prende come input un singolo asset, che può essere di qualsiasi tipo: un file JS, HTML, CSS, immagine, ecc. Ci sono vari [Tipi di Assets](asset_types.html) definiti in Parcel che sanno come gestire specifici tipi di file. Gli asset sono analizzati, le loro dipendenze sono estratte e trasformate nel rispettivo modulo compilabile finale. In questo modo si crea una struttura ad albero degli assets.

### 2. Costruzione del Bundle Tree

Una volta che l'Asset Tree è stato costruito, gli asset sono inseriti in un Bundle Tree. Un bundle viene creato per l'entry asset, e i bundle figli sono creati per "import()` dinamici, per permettere il Code Splitting.

I bundle fratelli vengono creati quando vengono importate risorse di tipo diverso, per esempio se si importa un file CSS da JavaScript, questo viene inserito in un bundle fratello nel corrispondente JavaScript.

Se una risorsa è richiesta in più di un bundle, viene spostata fino all'antenato comune (nodo) più vicino nell'albero dei Bundle, pertanto non viene inclusa più di una volta.

### 3. Packaging

Dopo che un Bundle Tree viene costruito, ogni bundle viene scritto in un file da un [packager](packagers.html) specifico per quel tipo di file. I Packagers sanno come compilare il codice di ogni asset insieme nel file di output finale che verrà creato e caricato dal browser.
