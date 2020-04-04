# 🚀 Primeiros Passos

Parcel é um empacotador de aplicações web, diferenciado pela experiência do desenvolvedor. Ele oferece uma performance extremamente rápida utilizando processamento multicore, sem a necessidade de configuração.

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
console.log('Olá, mundo!')
```

Parcel possui um servidor de desenvolvimento embutido, o qual irá reconstruir sua aplicação automaticamente à medida que você vai alterando os arquivos. Ele suporta [Hot Module Replacement](hmr.html) para acelerar o desenvolvimento. Apenas aponte a ele seu arquivo de entrada:

```bash
parcel index.html
```

Agora, abra seu navegador em http://localhost:1234/. Você também pode alterar a porta padrão utilizando a opção `-p <port number>`.

Utilize o servidor de desenvolvimento caso você não tenha seu próprio servidor, ou sua aplicação será inteiramente renderizada no cliente. Caso você possua seu próprio servidor, você pode utilizar o Parcel em modo `watch`. Essa opção continua reconstruindo sua aplicação à medida que você vai alterando os arquivos e suporta Hot Module Replacement, mas não irá iniciar um servidor.

```bash
parcel watch index.html
```

## Múltiplos arquivos de entrada

No caso de você ter mais de um arquivo de entrada, vamos dizer `index.html` e `about.html`, você tem duas maneiras de executar o bundler:

Especificando os nomes dos arquivos:

```bash
parcel index.html about.html
```

Utilizando tokens e criando um glob:

```bash
parcel *.html
```

_NOTA:_ No caso de você possuir uma estrutura de arquivos como esta:

```
- diretorio-1
-- index.html
- diretorio-2
-- index.html
```

Acessar http://localhost:1234/diretorio-1/ não irá funcionar, você terá que apontar explicitamente para o arquivo http://localhost:1234/diretorio-1/index.html.

## Construindo para Produção

Quando você estiver pronto para enviar sua aplicação para produção, o modo `build` desativa a opção `watch` e constrói seus arquivos uma única vez. Veja a seção [Produção](production.html) para mais detalhes.

## Adicionando Parcel ao seu projeto

Às vezes, não é possível instalar o Parcel globalmente, por exemplo, se você estiver construindo no agente de compilação de outra pessoa ou quiser usar um CI para criar seu projeto programaticamente. Nesse caso, você pode instalar e executar o Parcel como um pacote local.

Para instalar com Yarn:

```bash
yarn add parcel-bundler --dev
```

Para instalar com NPM:

```bash
npm install parcel-bundler --save-dev
```

Então, adicione esses scripts de tarefas para o seu projeto, modificando o seu `package.json`:

```json
{
  "scripts": {
    "dev": "parcel <your entry file>",
    "build": "parcel build <your entry file>"
  }
}
```

Então, você será capaz de executá-lo:

```bash
# Para executar em modo de desenvolvimento
yarn dev
# ou
npm run dev

# Para executar em modo de produção
yarn build
# ou
npm run build
```
