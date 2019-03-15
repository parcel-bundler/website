# CSS

_Extensões suportadas: `css`, `pcss`, `postcss`_

Recursos CSS podem ser importados de um arquivo Javascript ou HTML:

```js
import './index.css';
```

```html
<link rel="stylesheet" type="text/css" href="index.css">
```

Recursos CSS podem conter dependências referenciadas pela sintaxe `@import`, bem como referências a imagens, fontes, etc. através da função `url()`. Outros arquivos CSS que são `@import`ados de forma _inline_ no mesmo pacote CSS e referenciadas com `url()` serão reescritas em seus nomes de arquivos de saída. Todos os nomes de arquivos devem ser relativos ao arquivo CSS atual.

```css
/* Importando outro arquivo CSS */
@import './other.css';

.test {
  /* Referenciando um arquivo de imagem */
  background: url('./images/background.png');
}
```

Além de CSS simples, outras linguagens que compilam para CSS como LESS, SASS e Stylus também são suportadas, e funcionam da mesma maneira.

## PostCSS

[PostCSS](http://postcss.org) é uma ferramenta pra transformar CSS com plugins, como o [autoprefixer](https://github.com/postcss/autoprefixer), [Preset Env](https://github.com/csstools/postcss-preset-env), e [CSS Modules](https://github.com/css-modules/css-modules). Você pode configurar o PostCSS com o Parcel ao criar um arquivo de configuração com um desses nomes: `.postcssrc` (JSON), `.postcssrc.js`, ou `postcss.config.js`.

Instale plugins na sua aplicação:

```bash
yarn add postcss-modules autoprefixer
```

Então, crie o `.postcssrc`:

```json
{
  "modules": true,
  "plugins": {
    "autoprefixer": {
      "grid": true
    }
  }
}
```

Plugins são especificados nas chaves do objeto `plugins`, e as opções são definidas usando os valores do objeto. Se não houver opções para um plugin, basta configurá-lo como `true` em vez disso.

Navegadores de destino para Autoprefixer, cssnext e outras ferramentas podem ser especificadas no arquivo `.browserslistrc`:

```
> 1%
last 2 versions
```

Os módulos CSS são ativados de forma ligeiramente diferente usando a chave `módulos` no nível superior. Isso é porque Parcel precisa ter suporte especial para módulos CSS, uma vez que é exportado um objeto a ser incluído no pacote JavaScript também. Note que você ainda precisa instalar o `postcss-modules` em seu projeto.

### Uso com bibliotecas CSS existentes

Para que os módulos CSS funcionem corretamente com os módulos existentes, eles precisam especificar esse suporte em seus próprios `.postcssrc`.

### Definindo a configuração de Minificação do cssnano

Parcel adiciona o [cssnano](http://cssnano.co) ao postcss para minificar o css em _build_ de produção, onde configurações customizadas podem ser definidas ao criar o arquivo `cssnano.config.js`:

```js
module.exports = {
  preset: [
    'default',
    {
      calc: false,
      discardComments: {
        removeAll: true
      }
    }
  ]
}
```
