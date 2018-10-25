# 🔥 Hot Module Replacement

O Hot Module Replacement (HMR) melhora a experiência de desenvolvimento atualizando automaticamente os módulos no navegador em tempo de execução sem precisar de uma atualização inteira da página. Isso significa que o estado do aplicativo pode ser mantido enquanto você muda pequenas coisas. A implementação do HMR do Parcel suporta arquivos de JavaScript e CSS de fábrica. O HMR é automaticamente desativado quando se utiliza o Parcel em modo de produção.

À medida que você salva arquivos, o Parcel reconstrói o que mudou e envia uma atualização para todos os clientes em execução que contenham o novo código. O novo código substitui a versão antiga e é analisado junto com todos os outros. Você pode se conectar a este processo usando a API `module.hot`, que pode notificar seu código quando um módulo está prestes a ser descartado ou quando uma nova versão entrar. Projetos como [react-hot-loader](https://github.com/gaearon/react-hot-loader) podem auxiliar nesse processo e trabalhar integrado com o Parcel.

Existem dois métodos que você precisa conhecer: `module.hot.accept` e `module.hot.dispose`. Você chama `module.hot.accept` com um callback que é executado quando esse módulo ou qualquer uma das suas dependências são atualizadas. `module.hot.dispose` aceita um callback que é chamado quando esse módulo está prestes a ser substituído.

```javascript
if (module.hot) {
  module.hot.dispose(function() {
    // Módulo que está prestes a ser substituído
  })

  module.hot.accept(function() {
    // Módulo ou uma de suas dependências que acabaram de ser atualizados
  })
}
```

## Dependências automagicamente instaladas

Sempre que o Parcel vê uma dependência que se encaixa o padrão `node_module` e não pode encontrá-la, tenta-se instalar essa dependência usando `yarn` ou `npm` dependendo se encontrar um arquivo `yarn.lock` ou não. Isso evita que o desenvolvedor tenha que sair do pacote ou ter várias janelas de terminal abertas.

Isto ocorre somente em _development_ (utilizando [`serve`](cli.md#serve) ou [`watch`](cli.md#watch)), no entanto, em produção (utilizando [`build`](cli.md#build)) a instalação automática é desabilitada para evitar efeitos colaterais indesejados na implantação.

Você pode desabilitar este recurso utilizando [`--no-autoinstall`](cli.md#disable-autoinstall).

## Safe Write

Alguns editores de texto e IDE têm um recurso chamado `safe write`, isto basicamente impede a perda de dados, criando uma cópia do arquivo e o renomeando quando salvo.

Quando o recurso _Hot Module Reload (HMR)_ é utilizado, é bloqueada a detecção automatica de mudanças em arquivos, para desabilitar o `safe write` utilize uma das opções fornecidas abaixo:

- `Sublime Text 3` adicione `atomic_save: "false"` às suas preferências de usuário.
- `IntelliJ` use a pesquisa nas preferências para encontrar "safe write" e desativá-lo.
- `Vim` adicione `:set backupcopy=yes` em suas configurações.
- `WebStorm` desmarque `Use "safe write"` em Preferências > Aparência & Comportamento > Configurações do Sistema (_Preferences > Appearance & Behavior > System Settings_).
