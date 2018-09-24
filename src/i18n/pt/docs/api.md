# 📚 API

## Bundler

Ao invés do cliente, você pode utilizar a API para inicializar o *bundler*, para casos mais avançados (por exemplo, um processamento customizado após cada *build*).
Um exemplo com toda opção explicada:

```Javascript
const Bundler = require('parcel-bundler');
const Path = require('path');

// Localização do arquivo como único entrypoint:
const entryFiles = Path.join(__dirname, './index.html');

// Ou: múltiplos arquivos como globbing (também pode ser como .js)
// const entryFiles = './src/*.js';
// Ou: múltiplos arquivos em um array
// const entryFiles = ['./src/index.html', './some/other/directory/scripts.js'];

// Opções do bundler
const options = {
  outDir: './dist', // O diretório de saída para construir os arquivos, dist é o padrão.
  outFile: 'index.html', // O nome do arquivo de saída.
  publicUrl: './', // A URL onde o servidor será servido, dist é o padrão.
  watch: true, // whether to watch the files and rebuild them on change, defaults to process.env.NODE_ENV !== 'production'
  cache: true, // Habilita ou desabilita o cache, true é o padrão.
  cacheDir: '.cache', // O diretório de cache a ser utilizado, .cache é o padrão.
  contentHash: false, // Desabilita o hash de conteúdo de ser incluído no nome do arquivo.
  minify: false, // Minifica o arquivo, habilitado se process.env.NODE_ENV === 'production'.
  scopeHoist: false, // Torna ligado a flag de scope hoisting/tree shaking experimental, para pequenas builds de produção.
  target: 'browser', // browser/node/electron, browser é o padrão.
  https: { // Define um par costumizado de {chave, certificado}, use true para gerar um ou false para utilizar http.
    cert: './ssl/c.crt', // caminho para um certificado customizado.
    key: './ssl/k.key' // caminho para uma chave customizada.
  },
  logLevel: 3, // 3 = irá loggar tudo, 2 = irá loggar avisos e erros, 1 = irá loggar erros.
  hmr: true, // Habilita ou desabilita o HMR enquanto "watching" está ativo.
  hmrPort: 0, // A porta onde o socket HMR está rodando, o padrão é uma porta livre aleatória (0 no node.js resolve para uma porta livre).
  sourceMaps: true, // Habilita ou desabilita sourcemaps, habilitado é o padrão (não suportado em builds com arquivos minificados ainda).
  hmrHostname: '', // Um hostname para hot module reload, "" é o padrão.
  detailedReport: false // Exibe um report detalhado dos bundles, assets, tamanho de arquivos e tempos, false é o padrão, os reports são exibidos somente se o watch estiver desabilidado.
};

async function runBundle() {
  // Inicializa o bundler utilizando a localização do entrypoint e as configurações especificadas.
  const bundler = new Bundler(entryFiles, options);

  // Executa o bundler, isto retorna o bundle principal
  // Utiliza os eventos, se você estiver com o modo watch essa promise será disparada uma única vez e não a cada rebuild
  const bundle = await bundler.bundle();
}

runBundle();
```

### Eventos

Esta é a lista com todos os eventos do *bundler*:

* `bundled` será chamado uma única vez quando o Parcel terminar de construir **pela primeira vez** com sucesso, a instância do [bundle](#bundle) principal é passada para este callback.

```Javascript
const bundler = new Bundler(...);
bundler.on('bundled', (bundle) => {
  // o bundler contém todos os assets e bundles, veja a documentação para mais detalhes.
});
// Chame isto para iniciar o bundling.
bundler.bundle();
```

* `buildEnd` gerá chamado após cada build (aka **incluindo cada rebuild**), isto também emite se algum erro ocorreu.

```Javascript
const bundler = new Bundler(...);
bundler.on('buildEnd', () => {
  // Faz algo...
});
// Chame isto para iniciar o bundling.
bundler.bundle();
```

* `buildStart` será chamado no começo do primeiro build, o array `entryFiles` será passado para esse callback.

```Javascript
const bundler = new Bundler(...);
bundler.on('buildStart', entryPoints => {
  // Faz algo...
});
// Chame isto para iniciar o bundling.
bundler.bundle();
```

* `buildError` será chamado sempre que ocorrer um erro durante os builds, o objeto `Error` será passado para esse callback.

```Javascript
const bundler = new Bundler(...);
bundler.on('buildError', error => {
  // Faz algo...
});
// Chame isto para iniciar o bundling.
bundler.bundle();
```

### Bundle

Um `Bundle` é o que o Parcel utiliza para juntar todos os assets juntos, isto contém bundles filhos e irmão para que seja possível contruir a árvore de pacotes.

#### Propriedades

* `type`: Os tipos dos assets contidos (por exemplo: js, css, map, ...)
* `name`: O nome do bundle (gerado utilizando `Asset.generateBundleName()` de `entryAsset`)
* `parentBundle`: O bundle pai, é null em caso de ser o bundle de entrada
* `entryAsset`: O entrypoint do bundle, usado para gerar o nome e coletar os assets.
* `assets`: Um `Set` com todos os assets dentro do bundle
* `childBundles`: Um `Set` com todos os bundles filhos
* `siblingBundles`: Um `Set` com todos os bundles irmãos
* `siblingBundlesMap`: Um `Map<String(Type: js, css, map, ...), Bundle>` de todos os bundles irmãos
* `offsets`: Um `Map<Asset, number(linha dentro do bundle)>` de todas as localizações do assets dentro do bundle, utilizado para gerar os source maps

#### Árvore

O `Bundle` contém `parentBundle`, `childBundles` e `siblingBundles`, todas essas propriedades juntas cria um iterável rápido para percorrer a árvore do bundle.

Um exemplo muito básico de uma árvore de asset e gerando uma árvore de bundle.

##### Árvore de assets:

`index.html` requer `index.js` e `index.css`.

`index.js` requer `test.js` e `test.txt`

```Text
index.html
-- index.js
 |--- test.js
 |--- test.txt
-- index.css
```

##### Bundle Tree

`index.html` é utilizado como um asset de entrada para o bundle principal, este bundle principal cria dois bundles filhos, um para `index.js` e um para `index.css`, isto porque ambos são diferentes do tipo `html`.

`index.js` requer dois arquivos, `test.js` e `test.txt`.

`test.js` será adicionado aos assets do bundle `index.js`, e iste será do mesmo tipo que `index.js`

`test.txt` cria um novo bundle e será adicionado como filho do bundle `index.js` como sendo de um assetType diferente de `index.js`

`index.css` não tem requerimento e portanto só contém seu Asset de entrada.

Os bundles `index.css` e `index.js` são bundles irmãos um do outro e eles compartilham do mesmo pai.

```Text
index.html
-- index.js (inclui index.js e test.js)
 |--- test.txt (inclui test.txt)
-- index.css (inclui index.css)
```

### Middleware

Middleware pode ser utilizado como hoot dentro do servidor http (por exemplo, `express` ou `http` Node)

Um exemplo de uso de middleware do Parcel com o express:

```Javascript
const Bundler = require('parcel-bundler');
const app = require('express')();

const file = 'index.html'; // Passa um caminho absoluto para o entrypoint aqui
const options = {}; // Veja a sessão se opções da documentação da API, para as possibilidades.

 // Inicializa o bundler utilizando a localização do entrypoint e as configurações especificadas.
const bundler = new Bundler(file, options);

// Deixa o express usar o middleware do bundle, isto deixará o Parcel controlar cada requisição feita ao servidor do express
app.use(bundler.middleware());

// Escutando a porta 8080
app.listen(8080);
```
