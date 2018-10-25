# WebAssembly

_Extensões suportadas: `wasm`_

[WebAssembly](https://webassembly.org) é uma tecnologia emergente, mas que terá um impacto enorme na Web em um futuro próximo. Agora apoiado por todos os principais navegadores da Web, bem como Node, WebAssembly permitirá uma diversidade de linguagens na Web, e não apenas aquelas que podem transpilar para JavaScript.

Linguagens de baixo nível como C e Rust podem compilar para WebAssembly, que é um formato binário para arquivos de tamanhos menores e tempo de execução mais rápido. O desempenho próximo do nível nativo pode ser obtido com o código compilado do WebAssembly, muitas vezes muito mais rápido que o JavaScript equivalente. É provável que vejamos bibliotecas JavaScript começando a aproveitar WebAssembly para sessões de desempenho crítico de código em um futuro próximo.

Parcel torna **extremamente fácil** começar com WebAssembly. Supondo que você já tem um arquivo `.wasm` (veja na próxima sessão uma maneira ainda mais fácil!), você pode apenas importar como de costume. As importações síncronas e assíncronas são suportadas.

```js
// importação síncrona
import { add } from './add.wasm'
console.log(add(2, 3))
// importação assíncrona
const { add } = await import('./add.wasm')
console.log(add(2, 3))
```

Ao importar sincronicamente um arquivo `.wasm`, o Parcel gera automaticamente código extra para pré-carregar o arquivo antes de executar seu pacote JavaScript. Isso significa que o arquivo WebAssembly binário não é embutido em seu JavaScript como uma seqüência de caracteres, mas realmente servido como um arquivo binário separado como você esperaria. Desta forma, o seu código ainda funciona sincronicamente, mas Parcel cuida de carregar dependências para você.

Tudo isso é habilitado pelo suporte interno do Parcel para [carregadores de pacotes](https://github.com/parcel-bundler/parcel/pull/565), que são módulos de tempo de execução que sabem como carregar um formato de arquivo específico de forma assíncrona. Em versões anteriores, haviam carregadores de pacotes codificados para JavaScript e CSS, que habilitaram o suporte dinâmico de importação. No Parcel v1.5.0, isso é **completamente plugável** — você pode definir seus próprios carregadores de pacotes em plugins! Isso permitirá que muita funcionalidade legal no futuro para formatos binários personalizados como modelos binários de Glimmer, etc. Super animado para ver o que isso permite!
