Evolua esta tela de “Dados do equipamento”, etapa 3 de 3 do fluxo de recolha, mantendo integralmente o design system existente: modal em tela cheia, fundo cinza claro, cards brancos com borda sutil e cantos arredondados, tipografia, espaçamentos, barra de progresso laranja, botões e tabela exatamente no padrão atual.

Contexto de negócio:
Em alguns casos, o cliente não possui o equipamento associado corretamente em seu cadastro, por falhas históricas de base. Mesmo sem o equipamento aparecer na lista de “Equipamentos associados ao PDV”, o usuário precisa conseguir informar manualmente qual equipamento será recolhido e concluir a solicitação sem travar a operação.

Objetivo de UX:
Criar um caminho claro, seguro e de baixa fricção para recolher um equipamento não listado, sem confundir esse fluxo com o cadastro oficial de ativos. O registro manual deve ficar explicitamente identificado como “equipamento informado manualmente” para rastreabilidade e validação posterior.

Ajustes na tela atual:

1. Manter a lista de equipamentos associados ao PDV como primeira opção
- Preservar a tabela atual com seleção por radio button.
- Manter o equipamento selecionado com fundo suave em tom amarelo/laranja, como já existe.
- Não alterar a hierarquia atual de informações: modelo, tipo, marca, voltagem e etiqueta/RG.

2. Incluir uma alternativa clara abaixo da tabela
- Abaixo da tabela de equipamentos associados, incluir uma área discreta e bem integrada ao card.
- Texto principal: “O equipamento que será recolhido não está na lista?”
- Texto de apoio: “Informe os dados manualmente para seguir com a solicitação.”
- Adicionar um botão secundário ou link de ação com ícone de “+”:
  “Informar equipamento manualmente”
- Esse componente deve ter aparência leve, sem competir visualmente com a seleção de equipamentos já associados.

3. Ao clicar em “Informar equipamento manualmente”
- Exibir um card expansível logo abaixo da tabela, sem navegar para outra página ou abrir um modal dentro do modal.
- O card deve ter título: “Equipamento informado manualmente”
- Exibir um badge informativo: “Não associado ao cadastro do cliente”
- Adicionar uma mensagem curta de contexto:
  “Use esta opção apenas quando o equipamento não estiver disponível na lista de itens associados ao PDV.”

4. Campos do formulário manual
Organizar os campos em uma grade de duas colunas, seguindo o padrão visual da tela:

Campos obrigatórios:
- Tipo do equipamento
  Exemplo: Cooler, Freezer, Chopeira, Expositor
- Marca
- Modelo

Campos opcionais:
- Voltagem
- Etiqueta / RG
- Número de série
- Observações

Regras:
- Caso o usuário informe Etiqueta / RG ou Número de série, mostrar uma validação visual de “identificador informado”.
- Caso nenhum identificador seja preenchido, manter um badge neutro semelhante ao existente: “Serial não informado”.
- Exibir campo de observações com placeholder:
  “Ex.: equipamento identificado visualmente no ponto de venda, sem etiqueta legível.”
- Não exigir RG, etiqueta ou número de série para permitir o avanço.
- Usar dropdowns pesquisáveis para Tipo, Marca e Modelo quando houver opções disponíveis.
- Permitir preenchimento livre de Modelo quando não houver correspondência no catálogo.

5. Comportamento de seleção
- Quando o usuário iniciar o preenchimento manual, desmarcar automaticamente qualquer equipamento selecionado na tabela.
- Quando o usuário selecionar novamente um equipamento da tabela, recolher ou limpar o formulário manual para evitar duplicidade.
- Garantir que apenas uma opção possa estar ativa por vez:
  a) um equipamento associado selecionado; ou
  b) um equipamento informado manualmente.

6. Estado de confirmação
Após preencher os campos obrigatórios, mostrar uma prévia compacta do equipamento manual logo abaixo do formulário, no mesmo padrão visual da tabela:
- Badge: “Informado manualmente”
- Modelo
- Tipo
- Marca
- Voltagem, se preenchida
- Etiqueta / RG ou “Serial não informado”

A prévia deve deixar evidente que o item não foi encontrado no cadastro original, mas foi registrado para recolha.

7. CTA final
- Manter os botões fixos no rodapé: “Voltar”, “Cancelar” e “Criar solicitação”.
- O botão “Criar solicitação” só deve ficar habilitado quando:
  - houver um equipamento associado selecionado; ou
  - os campos obrigatórios do equipamento manual estiverem preenchidos.
- Ao criar a solicitação com equipamento manual, incluir uma indicação de auditoria no resumo posterior:
  “Equipamento inserido manualmente por [nome do usuário] em [data e hora]”.

8. Estados e validações
Criar os seguintes estados no protótipo:
- Estado padrão: lista de equipamentos associados e CTA para informar manualmente.
- Estado de formulário manual aberto.
- Estado de erro: campos obrigatórios não preenchidos.
- Estado com equipamento manual preenchido e pronto para criação.
- Estado em que há RG ou serial informado.
- Estado em que não há RG ou serial, usando o badge “Serial não informado”.

Princípios de UX:
- Não tratar o equipamento manual como um novo cadastro definitivo de ativo.
- Não bloquear a recolha por inconsistência de cadastro histórico.
- Dar visibilidade ao risco e à origem manual do dado, sem criar burocracia excessiva.
- Priorizar clareza operacional, rastreabilidade e rapidez para equipes de campo.
- Manter a tela limpa, com o formulário manual aparecendo apenas quando necessário.