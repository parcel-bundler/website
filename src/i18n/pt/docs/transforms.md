# 🐠 Conversões

Enquanto muitos empacotadores exigem que você instale e configure plugins para a conversão de arquivos, o Parcel tem suporte nativo para a maioria dos conversores e transpiladores. Você poderá converter Javascript utilizando o [Babel](https://babeljs.io), CSS utilizando o [PostCSS](http://postcss.org) e HTML utilizando o [PostHTML](https://github.com/posthtml/posthtml). O Parcel irá utilizar esses conversores automaticamente se for encontrado um arquivo de configuração (por exemplo, `.babelrc`, `.postcssrc`) em um módulo. Além de quaisquer conversões especificadas no arquivo `.babelrc`, o Parcel sempre irá utilizar o Babel em todos os módulos para compilar Javascript moderno em um formato suportado pelos navegadores. Consulte a sessão [JavaScript/Default Babel Transforms](javascript.html#conversoes-padroes-do-babel) para maiores informações.

## Módulos de Terceiros

Arquivos de configurações (como o `.babelrc`) não serão aplicados aos arquivos de terceiros dentro de `node_modules` por padrão. Porém, se o diretório do módulo for um symlink (como é comum em algumas convenções monorepo) e o módulo `package.json` possuir o campo `source` definido, então os arquivos de configurações dentro do diretório do módulo serão respeitados. Aqui estão os tipos de valores suportados pelo campo `source`:

* Trata todos os arquivos como código-fonte, não altera a resolução

```json
{
  "main": "foo.js",
  "source": true
}
```

* Quando compilado a partir da fonte, utiliza bar.js como ponto de entrada

```json
{
  "main": "foo.js",
  "source": "bar.js"
}
```

* Quando compilador a partir da fonte, utiliza alias para arquivos específicos

```json
{
  "main": "foo.js",
  "source": {
    "./foo.js": "./bar.js",
    "./baz.js": "./yay.js"
  }
}
```

* Quando compilador a partir da fonte, utiliza padrões glob como alias

```json
{
  "main": "foo.js",
  "source": {
    "./lib/**": "./src/$1"
  }
}
```

O último exemplo permite que você substitua todo o diretório lib com src, então importar 'my-module/lib/test.js será resolvido para 'my-module/src/test.js'. Você também pode utilizar um padrão catch-all de nível superior como `"**": "./src/$1"` para pacotes como lodash que tem muitos arquivos na raiz para serem substituídos (por exemplo, lodash/cloneDeep com lodash/src/cloneDeep).
