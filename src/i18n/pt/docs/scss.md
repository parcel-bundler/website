# SCSS

_Extensões suportadas: `sass`, `scss`_

Compilação de SCSS requer o módulo `sass` (versão JS do `dart-sass`). Para instalá-lo com npm:

```bash
npm install -D sass
```

Uma vez que o `sass` esteja instalado, você pode importar seus arquivos SCSS em arquivos JavaScript.

```javascript
import './custom.scss'
```

Dependências nos arquivos SCSS podem ser utilizados com declarações `@import`.

Se você não tiver o módulo `sass` instalado antes de executar o Parcel, o Parcel se encarregará de instalá-lo automaticamente para você.

**Notas**: você também pode utilizar o módulo `node-sass` para compilar SCSS. O uso desse módulo lhe dará uma compilação mais rápida. No entanto, [um problema](https://github.com/parcel-bundler/parcel/issues/1836) foi reportado o módulo `node-sass` é utilizado em conjunto com o Parcel.