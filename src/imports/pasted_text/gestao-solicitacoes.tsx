Evolua a tela existente de “Gestão de solicitações” para que ela se torne a central operacional de acompanhamento das Ordens de Serviço de equipamentos.

Use a tela atual como base visual e preserve rigorosamente o design system da Cora: header, menu global lateral, breadcrumb, tipografia, filtros, tabela, paginação, badges de status, ícones e espaçamentos.

IMPORTANTE:
- Não inventar um novo menu interno, card lateral ou navegação paralela.
- Manter apenas o menu global nativo da Cora.
- O menu global deve permanecer recolhido por default e expandir apenas quando o usuário clicar no botão de menu do header.
- Quando o menu estiver expandido, “Gestão de Ativos” deve estar aberto e “Gestão de Solicitações” deve aparecer como item ativo.
- Não alterar a estrutura geral do header nem substituir o padrão visual do sistema.

## Objetivo da tela

Hoje a tela está orientada apenas para solicitações de instalação.

Transformar a tela em uma gestão única de OS para:
1. Instalação de equipamentos
2. Recolha de equipamentos

A página deve permitir que o usuário acompanhe, filtre e consulte solicitações dos dois fluxos sem confundir os tipos de operação.

A Baixa de equipamentos não deve aparecer nesta tela, pois é um fluxo separado de controle patrimonial e contábil.

## Título e descrição

Manter o título:

“Gestão de solicitações”

Atualizar o texto de apoio para:

“Acompanhe e gerencie as solicitações de instalação e recolha de equipamentos.”

Manter o breadcrumb:

“Início > Equipamentos de Refrigeração > Gestão de solicitações”

## Estrutura da página

Preservar a estrutura atual:

- Breadcrumb
- Título e subtítulo
- Área de filtros
- Tabela de solicitações
- Paginação
- Ações por linha

Não criar dashboard com cards de métricas nesta primeira versão.
A tela deve continuar objetiva, operacional e orientada à consulta de OS.

## Filtros

Manter o campo obrigatório de “Operações”.

Adicionar um filtro principal visível ao lado ou logo abaixo dele:

“Tipo de solicitação”
Opções:
- Todas
- Instalação
- Recolha

O estado padrão deve ser “Todas”.

Manter o acesso a “Filtros avançados”, mas atualizar o painel lateral para incluir:

- Operação
- Tipo de solicitação
- Código do PDV
- Ticket / número da OS
- Equipamento
- Status
- Período de solicitação
- Modalidade
- Solicitante, se houver essa informação disponível

Não deixar todos os filtros expostos permanentemente na tela principal. A tela deve seguir o padrão atual: filtro principal mais filtros avançados em painel lateral.

## Tabela de solicitações

Atualizar a tabela para comportar instalação e recolha com clareza.

Usar as seguintes colunas, nesta ordem:

1. Operação
2. PDV
3. Tipo de solicitação
4. Ticket / OS
5. Equipamento(s)
6. Criação
7. Status
8. Última atualização
9. Ações

### Regras das colunas

Operação:
- Exibir unidade operacional, como “CDD Sapucaia do Sul”.
- Manter o estilo atual de link ou texto clicável, caso já exista.

PDV:
- Exibir código e nome resumido do ponto de venda.
- Exemplo: “10034 · Sapucaia do Sul”.
- Aplicar truncamento com tooltip quando o nome for longo.

Tipo de solicitação:
- Criar uma identificação visual clara, mas discreta.
- Usar um pequeno ícone e texto.
- “Instalação” com ícone de entrada/instalação.
- “Recolha” com ícone de caminhão ou retirada.
- Não usar chips grandes ou cores fortes.
- O objetivo é permitir leitura rápida da natureza da OS.

Ticket / OS:
- Manter a numeração atual, por exemplo: “Z510233”.
- Deve funcionar visualmente como identificador principal da solicitação.

Equipamento(s):
- Exibir uma descrição resumida do item ou a quantidade.
- Exemplos:
  - “1 Cooler”
  - “2 equipamentos”
  - “Cooler + Freezer”
- Quando a recolha envolver um item inserido manualmente, exibir um badge compacto e neutro:
  “Informado manualmente”
- Esse badge deve ser secundário e nunca competir visualmente com o status da OS.

Criação:
- Exibir data no padrão atual.

Status:
- Manter os badges de status no padrão Cora.
- Status devem continuar sendo o principal sinal de acompanhamento da OS.

Para instalação, preservar estados já existentes:
- Aguardando reserva
- Instalação produtiva
- Instalação improdutiva
- Encerrada

Adicionar estados para recolha:
- Aguardando recolha
- Recolha em andamento
- Recolhido
- Recolha cancelada
- Encerrada

Usar cores semânticas discretas:
- Cinza para estados neutros ou pendentes.
- Amarelo ou laranja suave para atenção ou andamento.
- Verde para concluído.
- Vermelho suave apenas para falha, cancelamento ou improdutividade.

Última atualização:
- Mostrar a data mais recente de movimentação da OS.

Ações:
- Manter o ícone de visualização já utilizado na plataforma.
- Não exibir ícones de edição, exclusão ou ações destrutivas como padrão.
- A ação principal é consultar os detalhes da OS.

## Organização visual da lista

Exibir uma lista mista de Instalações e Recolhas para demonstrar a nova capacidade da tela.

Criar dados de exemplo realistas, por exemplo:

- Instalação | Cooler | Instalação produtiva
- Recolha | 2 equipamentos | Aguardando recolha
- Recolha | Freezer Skol 300L | Recolha em andamento
- Instalação | Chopeira | Aguardando reserva
- Recolha | Cooler | Recolhido
- Instalação | Ice Machine | Encerrada

Garantir que o usuário consiga diferenciar facilmente os fluxos apenas observando as colunas “Tipo de solicitação” e “Status”.

## Detalhe da OS

Ao clicar no ícone de visualização, abrir uma página ou drawer lateral de detalhes da OS.

A tela de detalhes deve apresentar:

- Número do ticket / OS
- Tipo de solicitação
- Operação
- PDV
- Modalidade
- Equipamentos envolvidos
- Status atual
- Histórico da solicitação
- Data de criação
- Última atualização
- Solicitante, quando houver

Para recolhas:
- Mostrar claramente se o equipamento foi selecionado do cadastro do PDV ou informado manualmente.
- Quando for manual, apresentar:
  - Badge: “Equipamento informado manualmente”
  - Tipo
  - Marca
  - Modelo
  - Voltagem, se preenchida
  - Etiqueta / RG ou “Serial não informado”
  - Observações registradas na solicitação

Não transformar esse detalhe em fluxo de baixa. O detalhe da OS deve tratar apenas da execução e do acompanhamento operacional da instalação ou recolha.

## Estado ativo no menu global

No menu global expandido:
- “Gestão de Ativos” deve estar expandido.
- “Gestão de Solicitações” deve estar ativo.
- O item ativo deve seguir o padrão Cora:
  - marcador vertical laranja na borda esquerda
  - fundo muito suave em tom de laranja claro
  - texto em peso semibold
  - sem card, sem pill e sem botão preenchido

## Resultado esperado

A tela final deve parecer uma evolução nativa da Gestão de Solicitações já existente na Cora.

Ela precisa funcionar como uma fila operacional única para instalação e recolha, com clareza de tipo, status, equipamento envolvido e rastreabilidade dos itens preenchidos manualmente.