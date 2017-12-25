# 🚀 Primeiros Passos

Parcel é um agregador de aplicações web, diferenciado pela experiência do desenvolvedor. Ele oferece uma performance absurdamente rápida utilizando processamento multicore, sem a necessidade de configuração.

Primeiro, instale o Parcel usando Yarn ou npm:

Yarn:
```bash
yarn global add parcel-bundler
```

npm:
```bash
npm install -g parcel-bundler
```

Crie o arquivo package.json no diretório do seu projeto executando:

```bash
yarn init -y
```
ou
```bash
npm init -y
```

Parcel pode receber qualquer tipo de arquivo como ponto de entrada, embora um arquivo HTML ou JavaScript sejam as melhores opções para começar. Se você referenciar seu arquivo JavaScript principal dentro do seu arquivo HTML utilizando caminho relativo, o Parcel também processará esse arquivo para você e substituirá a referência no caminho do arquivo de saída.

Depois, crie os arquivos index.html e index.js.

```html
<html>
<body>
  <script src="./index.js"></script>
</body>
</html>
```

```javascript
console.log("olá mundo");
```

Parcel possui um servidor de desenvolvimento embutido, o qual irá reconstruir sua aplicação automaticamente à medida que você vá alterando os arquivos. Ele suporta [Substituição de Módulos à Quente](hmr.html) para acelerar o desenvolvimento. Apenas aponte à ele seu arquivo de entrada:

```bash
parcel index.html
```

Agora, abra seu navegador em http://localhost:1234/. Você também pode alterar a porta padrão utilizando a opção `-p <port number>`.

Utilize o servidor de desenvolvimento caso você não tenha seu próprio sevidor, ou sua aplicação será inteiramente renderizada no cliente. Caso você possua seu próprio servidor, você pode utilizar o Parcel em modo `watch`. Essa opção continua reconstruindo sua aplicação à medida que você vai alterando os arquivos e suporta Substituição de Módulos à Quente, mas não irá iniciar um servidor.

```bash
parcel watch index.html
```

Quando você estiver pronto para enviar sua aplicação para produção, o modo `build` desativa a opção `watch` e constrói seus arquivos uma única vez. Veja a seção [Produção](production.html) para mais detalhes.
