# SCSS

_Extensões suportadas: `sass`, `scss`_

Compilação de SCSS requer o módulo `sass` (versão JS do `dart-sass`). 

Para instalá-lo com npm:

```bash
npm install -D sass
```

Para instalá-lo com yarn:

```bash
yarn add -D sass
```

Uma vez que o `sass` esteja instalado, você pode importar seus arquivos SCSS em arquivos JavaScript.

```javascript
import './custom.scss'
```

Você também pode incluir o arquivo SCSS diretamente em um arquivo HTML

```html
<link rel="stylesheet" href="./style.scss">
```

Dependências nos arquivos SCSS podem ser utilizados com declarações `@import`.

Se você não tiver o módulo `sass` instalado antes de executar o Parcel, o Parcel se encarregará de instalá-lo automaticamente para você.

Adicionalmente, você pode configurar a compilação do sass com Parcel criando um arquivo de configuração como: .sassrc

Por exemplo, você pode controlar o estilo do CSS gerado ao especificar desta forma:

{ outputStyle: "nested", }

**Notas**: você também pode utilizar o módulo `node-sass` para compilar SCSS. O uso desse módulo lhe dará uma compilação mais rápida. No entanto, [um problema](https://github.com/parcel-bundler/parcel/issues/1836) foi reportado o módulo `node-sass` é utilizado em conjunto com o Parcel.
