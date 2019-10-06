# HTML

_Extensões suportadas: `htm`, `html`_

Arquivos HTML são frequentemente utilizados como ponto de entrada para o Parcel, mas também podem ser referenciados pelos arquivos JavaScript, por exemplo, para fornecer links para outras páginas. Os endereços dos scripts, estilos, mídias e outros arquivos HTML são extraídos e compilados como descrito acima. As referências são reescritas no HTML para que elas sejam referenciadas corretamente. Todos os nomes dos arquivos devem ser relativos ao arquivo HTML principal.

```html
<html>
<body>
  <!-- referenciando um arquivo de imagem -->
  <img src="./images/header.png">

  <a href="./other.html">Link para outra página</a>

  <!-- importando um pacote JavaScript -->
  <script src="./index.js"></script>
</body>
</html>
```

# PostHTML

[PostHTML](https://github.com/posthtml/posthtml) é uma ferramenta pra transformar HTML com plugins. Você pode configurar o PostHTML com o Parcel ao criar um arquivo de configuração com um desses nomes: `.posthtmlrc` (JSON), `.posthtmlrc.js`, or `posthtml.config.js`.

Instale plugins na sua aplicação:

```bash
yarn add posthtml-img-autosize
```

Então, crie o `.posthtmlrc`:

```json
{
  "plugins": {
    "posthtml-img-autosize": {
      "root": "./images"
    },
    "posthtml-modules": {
      "root": "./src"
    }
  }
}
```
Quando for importar módulos usando o `posthtml-modules`, ao começar caminhos com `/`, eles serão relativos a `./src`.

Plugins são especificados nas chaves do objeto `plugins`, e as opções são definidas usando os valores do objeto. Se não houver opções para um plugin, basta configurá-lo como `true` em vez disso.
