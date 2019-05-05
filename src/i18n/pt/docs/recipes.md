# 🍰 Receitas

## React

Primeiro instale as dependências do React.

[Blog Post](http://blog.jakoblind.no/react-parcel/)

```bash
npm install --save react
npm install --save react-dom
npm install --save-dev parcel-bundler
```

<sub>Ou se você tiver opcionalmente o gerenciador de pacotes Yarn instalado</sub>

```bash
yarn add react
yarn add react-dom
yarn add --dev parcel-bundler
```

Adicione o script de inicialização ao `package.json`

```javascript
// package.json
"scripts": {
  "start": "parcel index.html"
}
```

## Preact

Primeiro instale as dependências do Preact.

```bash
npm install --save preact
npm install --save-dev parcel-bundler
```

<sub>Ou se você tiver opcionalmente o gerenciador de pacotes Yarn instalado</sub>

```bash
yarn add preact
yarn add --dev parcel-bundler
```

Adicione o script de inicialização ao `package.json`

```javascript
// package.json
"scripts": {
  "start": "parcel index.html"
}
```

## Vue

Primeiro, nós precisamos instalar as dependências para o Vue.

```bash
npm install --save vue
npm install --save-dev parcel-bundler
```

<sub>Ou se você tiver opcionalmente o gerenciador de pacotes Yarn instalado</sub>

```bash
yarn add vue
yarn add --dev parcel-bundler
```

Adicione o script de inicialização ao `package.json`

```javascript
// package.json
"scripts": {
  "start": "parcel index.html"
}
```

## Typescript

Primeiro, nós temos que adicionar o Parcel e Typescript ao nosso projeto.

```bash
npm install --save-dev typescript
npm install --save-dev parcel-bundler
```

<sub>Ou se você tiver opcionalmente o gerenciador de pacotes Yarn instalado</sub>

```bash
yarn add typescript --dev
yarn add --dev parcel-bundler
```

### Compilando a partir do index.html

Adicione o script de inicialização ao `package.json`

```javascript
// package.json
"scripts": {
  "start": "parcel index.html"
}
```

E então, no seu arquivo `index.html`, simplesmente referencie o seu arquivo `.ts`.

```html
<!-- index.html -->
<!DOCTYPE html>
<html lang="en">
<head>
</head>
<body>
    <!-- Aqui 👇 -->
    <script src="./myTypescriptFile.ts"></script>
</body>
</html>
```

Feito!

### Compilando o arquivo `.ts` diretamente

Adicione o script de inicialização ao `package.json`

```javascript
// package.json
"scripts": {
  "start": "parcel myTypescriptFile.ts"
}
```

Feito! 😄 O arquivo `.js` compilado pode ser encontrado dentro do diretório de distribuição.
