# 🛠 Como Funciona

O Parcel converte uma árvore de **recursos** em uma árvore de **pacotes**. Várias outras ferramentas de empacotamento de código são baseadas em arquivos de JavaScript, com outros formatos abordados - por exemplo, adicionadas como strings em arquivos JS. O Parcel é agnóstico a tipos de arquivo: ele funcionará com qualquer tipo de arquivos da maneira que você gostaria, sem configuração. Há três etapas para o processo de empacotamento no Parcel.

### 1. Construção da Árvore de Recursos

Parcel aceita um único recurso como entrada, que pode ser qualquer tipo: um arquivo JS, HTML, CSS, imagem, etc. Existem vários [Tipos de Recursos](asset_types.html) definidos no Parcel que sabem como lidar com tipos de arquivos específicos. Os recursos são analisados, suas dependências são extraídas e são convertidos em sua forma compilada final. Isso cria uma árvore de recursos.

### 2. Construção da Árvore de Pacotes

Uma vez que a árvore de recursos foi construída, esses recursos são colocados em uma árvore de pacotes. Um pacote é criado para o recurso de entrada e os pacotes secundários são criados para serem utilizados com `import()`s, que causam a separação do código.

Os pacotes semelhantes são criados quando os ativos de um tipo diferente são importados, por exemplo, se você importou um arquivo CSS do JavaScript, ele seria colocado em um pacote semelhante para o JavaScript correspondente.

Se um recurso for exigido em mais de um pacote, ele será levado até o pacote comum mais próximo na árvore do pacote, com isso ele não será incluído mais de uma vez.

### 3. Empacotamento

Depois que a árvore do pacote é construída, cada pacote é criado em um arquivo por um [Empacotador](packagers.html) específico para o tipo de arquivo. Os empacotadores sabem como combinar o código de cada recurso em conjunto no arquivo final que é carregado por um navegador.
