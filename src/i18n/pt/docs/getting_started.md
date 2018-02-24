# 🚀 Primeiros Passos

Parcel é um empacotador de aplicações web, diferenciado pela experiência do desenvolvedor. Ele oferece uma performance extremamente rápida utilizando processamento multicore, sem a necessidade de configuração.

Primeiro, certifique-se de usar [Node 6.0.0 ou superior] (https://nodejs.org). Precisa executar várias versões do Node? Use [nvm] (https://github.com/creationix/nvm) ou [n] (https://github.com/tj/n).

Depois, instale o Parcel usando Yarn ou npm:

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

Parcel pode receber qualquer tipo de arquivo como ponto de entrada, embora um arquivo HTML ou JavaScript seja a melhor opção para começar. Se você referenciar seu arquivo JavaScript principal dentro do seu arquivo HTML utilizando caminho relativo, o Parcel também processará esse arquivo para você e substituirá a referência no caminho do arquivo de saída.

Depois, crie os arquivos index.html e index.js.

```html
<html>
<body>
  <script src="./index.js"></script>
</body>
</html>
```

```javascript
console.log("Olá, mundo!");
```

Parcel possui um servidor de desenvolvimento embutido, o qual irá reconstruir sua aplicação automaticamente à medida que você vai alterando os arquivos. Ele suporta [Hot Module Replacement](hmr.html) para acelerar o desenvolvimento. Apenas aponte a ele seu arquivo de entrada:

```bash
parcel index.html
```

Agora, abra seu navegador em http://localhost:1234/. Você também pode alterar a porta padrão utilizando a opção `-p <port number>`.

Utilize o servidor de desenvolvimento caso você não tenha seu próprio sevidor, ou sua aplicação será inteiramente renderizada no cliente. Caso você possua seu próprio servidor, você pode utilizar o Parcel em modo `watch`. Essa opção continua reconstruindo sua aplicação à medida que você vai alterando os arquivos e suporta Hot Module Replacement, mas não irá iniciar um servidor.

```bash
parcel watch index.html
```

Quando você estiver pronto para enviar sua aplicação para produção, o modo `build` desativa a opção `watch` e constrói seus arquivos uma única vez. Veja a seção [Produção](production.html) para mais detalhes.
