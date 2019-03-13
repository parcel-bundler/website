# ✂️ Separação do Código

Parcel suporta separação do código sem nenhuma configuração, de fábrica. Isso permite que você divida o código da sua aplicação em arquivos separados, que podem ser carregados sob demanda, o que significa tamanhos de arquivos iniciais menores e tempos de carregamento mais rápidos. À medida que o usuário navega em sua aplicação e os módulos são carregados, o Parcel automaticamente se encarrega de carregar os demais módulos sob demanda.

A separação do código é controlada pelo uso da função dinâmica `import ()` [syntax proposal](https://github.com/tc39/proposal-dynamic-import), que funciona como a declaração de `import` ou a função `require`, mas retorna uma Promise. Isso significa que o módulo é carregado de forma assíncrona.

## Utilizando imports dinâmicos

O exemplo a seguir mostra como você pode usar as importações dinâmicas para carregar outra página da sua aplicação sob demanda.

```javascript
// pages/about.js
export function render() {
  // Renderizar a página
}
```

```javascript
import('./pages/about').then(function(page) {
  // Renderizar a página
  page.render()
})
```

## Imports dinâmicos com async/await

Como `import ()` retorna uma Promise, você também pode usar async/await. Provavelmente você precisará configurar o Babel para converter a sintaxe até que ela seja suportada por todos os navegadores.

```javascript
const page = await import('./pages/about')
// Renderizar a página
page.render()
```

As importações dinâmicas também são carregadas sob demanda no Parcel, assim você ainda pode colocar todas as suas chamadas `import()` no topo do seu arquivo e os pacotes secundários não serão carregados até serem utilizados. O exemplo a seguir mostra como você poderia carregar outras páginas da sua aplicação de forma dinâmica.

```javascript
// Configure um array de nomes de páginas para serem importadas
// Essas páginas não serão carregadas até que sejam utilizadas
const pages = {
  about: import('./pages/about'),
  blog: import('./pages/blog')
}

async function renderPage(name) {
  // Carregue a página sob demanda quando ela for requisitada
  const page = await pages[name]
  return page.render()
}
```

**Nota:** Se você quiser utilizar async/await em navegadores que não têm suporte nativo, lembre-se de incluir `babel-polyfill` em sua aplicação ou `babel-runtime` + `babel-plugin-transform-runtime` nas bibliotecas).

```bash
yarn add babel-polyfill
```

```javascript
import 'babel-polyfill'
import './app'
```

Leia a documentação em [babel-polyfill](http://babeljs.io/docs/usage/polyfill) e [babel-runtime](http://babeljs.io/docs/plugins/transform-runtime).

## Resolução do Bundle

O Parcel infere a localização dos bundles automaticamente. Isto é feito pelo módulo [bundle-url](https://github.com/parcel-bundler/parcel/blob/master/packages/core/parcel-bundler/src/builtins/bundle-url.js) e utiliza o rastreamento de pilha para determinar o caminho onde o pacote inicial foi carregado.

Isso significa que você não precisa configurar onde os bundles devem ser carregados, mas também significa que você deve servir os bundles do mesmo local.

O pacote resolve atualmente pacotes nos seguintes protocolos: `http`, `https`, `file`, `ftp`, `chrome-extension` e `moz-extension`.
