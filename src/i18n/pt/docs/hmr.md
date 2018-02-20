# 🔥 Hot Module Replacement

O Hot Module Replacement (HMR) melhora a experiência de desenvolvimento atualizando automaticamente os módulos no navegador em tempo de execução sem precisar de uma atualização inteira da página. Isso significa que o estado do aplicativo pode ser mantido enquanto você muda pequenas coisas. A implementação do HMR do Parcel suporta arquivos de JavaScript e CSS de fábrica. O HMR é automaticamente desativado quando se utiliza o Parcel em modo de produção.

À medida que você salva arquivos, o Parcel reconstrói o que mudou e envia uma atualização para todos os clientes em execução que contenham o novo código. O novo código substitui a versão antiga e é analisado junto com todos os outros. Você pode se conectar a este processo usando a API `module.hot`, que pode notificar seu código quando um módulo está prestes a ser descartado ou quando uma nova versão entrar. Projetos como [react-hot-loader](https://github.com/gaearon/react-hot-loader) podem auxiliar nesse processo e trabalhar integrado com o Parcel.

Existem dois métodos que você precisa conhecer: `module.hot.accept` e `module.hot.dispose`. Você chama `module.hot.accept` com um callback que é executado quando esse módulo ou qualquer uma das suas dependências são atualizadas. `module.hot.dispose` aceita um callback que é chamado quando esse módulo está prestes a ser substituído.

```javascript
if (module.hot) {
  module.hot.dispose(function () {
    // Módulo que está prestes a ser substituído
  });

  module.hot.accept(function () {
    // Módulo ou uma de suas dependências que acabaram de ser atualizados
  });
}
```
