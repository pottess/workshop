Complemente o protótipo desktop existente da plataforma Cora para o fluxo de impressão de documentos da Ordem de Serviço de Recolha.

Contexto:
Já existe uma tela de listagem de Recolha de Equipamentos com ações por linha. Também já existe um dropdown ancorado no ícone de download/impressão com o título “IMPRIMIR DOCUMENTOS” e duas opções:
1. Dados da OS
2. Comprovante de recolha

Não recriar o dropdown. Usar o dropdown já existente como ponto de partida do fluxo.

Objetivo:
Criar as telas e estados que aparecem depois que o usuário clica em “Dados da OS” ou “Comprovante de recolha”. O fluxo deve permitir visualizar o documento, imprimir e baixar PDF.

Regras importantes:
- A opção “Dados da OS” deve abrir a pré-visualização da Ordem de Serviço de Recolha.
- A opção “Comprovante de recolha” deve abrir a pré-visualização do comprovante que será entregue ao cliente.
- O comprovante de recolha depende da data de agendamento, pois essa data aparece no comprovante.
- Se a OS ainda não estiver agendada, ao clicar em “Comprovante de recolha”, exibir um alerta orientando o usuário a agendar a recolha antes de gerar o comprovante.
- Imprimir ou baixar documento não altera o status da OS.
- Registrar no histórico, quando aplicável, que o documento foi gerado, impresso ou baixado.

Estilo visual:
- Seguir o design system atual da Cora.
- Topbar branca com logo Cora.
- Fundo cinza claro.
- Documento em formato A4 branco centralizado.
- Tipografia limpa e hierarquia forte.
- Botão primário laranja Cora.
- Botões secundários brancos com borda.
- Ícones outline para imprimir, baixar, fechar e voltar.
- Manter o mesmo estilo de tabela, chips e dropdown já usados na tela atual.

Criar os seguintes frames:

FRAME 1 — Origem do fluxo: dropdown existente

Usar a tela atual de “Recolha de Equipamentos” com o dropdown já aberto.

Dropdown:
Título: “IMPRIMIR DOCUMENTOS”
Opções:
- Dados da OS
- Comprovante de recolha

A linha da tabela usada como exemplo deve estar em status “Recolha agendada” ou “Agendado”.

Dados da linha:
Unidade: CDD Campinas
Ticket: Cora-000123
OS: OSR-2026-000123
Data de abertura: 12/06/2026
Código do PDV: 95252
PDV: Fernando Lima
Modalidade: Comodato
Equipamento: Cooler
Status: Recolha agendada
Data agendada: 20/06/2026
Logística: Metalfrio

Interações:
- Clicar em “Dados da OS” leva ao FRAME 2.
- Clicar em “Comprovante de recolha” leva ao FRAME 3.

FRAME 2 — Pré-visualização: Dados da OS

Criar uma tela ou modal grande de pré-visualização de documento.

Layout:
Fundo cinza claro.
Documento A4 branco centralizado.
Barra superior fixa com:
- Título da página: “Pré-visualização do documento”
- Subtítulo: “Dados da OS”
- Botão secundário “Voltar”
- Botão secundário com ícone “Baixar PDF”
- Botão primário laranja com ícone “Imprimir”

Documento A4:

Cabeçalho:
Logo Cora no canto superior esquerdo.
Título central ou à esquerda:
“Ordem de Serviço de Recolha”

Subtítulo:
“Dados da OS”

No canto superior direito:
OS: OSR-2026-000123
Ticket: Cora-000123
Data de geração: 12/06/2026
Status: Recolha agendada

Seção 1 — Dados da operação
Exibir em duas colunas:
- Unidade: CDD Campinas
- Logística / fornecedor: Metalfrio
- Data agendada: 20/06/2026
- Período: Manhã
- Responsável pela rota: Equipe 03
- Prioridade: Média

Seção 2 — Dados do cliente / PDV
Exibir:
- Código do PDV: 95252
- PDV: Fernando Lima
- Contato: Ana Paula Gonçalves
- Telefone: (11) 90000-0000
- E-mail: ana.paula@email.com
- Endereço de recolha: Rua Magnólia, nº 12 - Bairro das Flores
- Cidade: Campinas
- Estado: SP
- CEP: 12345-000

Seção 3 — Dados do equipamento
Exibir:
- Equipamento: Cooler
- Modelo: Geladeira Brahma
- Marca: Brahma
- Voltagem: 220v
- Modalidade: Comodato
- Número de série: SN-2026-009812
- Etiqueta/RG: 2090594173528-9
- Contrato: C-203948

Seção 4 — Orientações para recolha
Texto:
“Antes da retirada, confirme se o equipamento está vazio, desligado e em condições seguras para transporte. Caso a recolha não possa ser realizada, registre o motivo da improdutividade na Cora.”

Seção 5 — Observações da rota
Texto exemplo:
“Entrar em contato com Ana Paula antes da visita. Acesso pela entrada lateral do estabelecimento.”

Rodapé do documento:
“Documento gerado pela Cora em 12/06/2026 às 13:27.”

Interações:
- Clicar em “Voltar” retorna ao FRAME 1.
- Clicar em “Baixar PDF” exibe toast de sucesso: “PDF gerado com sucesso.”
- Clicar em “Imprimir” exibe toast de sucesso: “Documento enviado para impressão.”

FRAME 3 — Pré-visualização: Comprovante de recolha

Criar uma tela ou modal grande de pré-visualização de documento.

Layout:
Fundo cinza claro.
Documento A4 branco centralizado.
Barra superior fixa com:
- Título da página: “Pré-visualização do documento”
- Subtítulo: “Comprovante de recolha”
- Botão secundário “Voltar”
- Botão secundário com ícone “Baixar PDF”
- Botão primário laranja com ícone “Imprimir comprovante”

Documento A4:

Cabeçalho:
Logo Cora no canto superior esquerdo.
Título:
“Comprovante de Recolha de Equipamento”

No canto superior direito:
OS: OSR-2026-000123
Ticket: Cora-000123
Data agendada da recolha: 20/06/2026

Seção 1 — Dados da recolha
Exibir:
- Unidade: CDD Campinas
- Logística / fornecedor: Metalfrio
- Responsável pela rota: Equipe 03
- Data agendada: 20/06/2026
- Período: Manhã

Seção 2 — Dados do cliente / PDV
Exibir:
- Código do PDV: 95252
- PDV: Fernando Lima
- Contato: Ana Paula Gonçalves
- Telefone: (11) 90000-0000
- Endereço de recolha: Rua Magnólia, nº 12 - Bairro das Flores, Campinas - SP
- CEP: 12345-000

Seção 3 — Dados do equipamento
Exibir:
- Equipamento: Cooler
- Modelo: Geladeira Brahma
- Marca: Brahma
- Voltagem: 220v
- Número de série: SN-2026-009812
- Etiqueta/RG: 2090594173528-9
- Modalidade: Comodato

Seção 4 — Declaração de recolha
Texto:
“Declaro que o equipamento descrito neste comprovante foi recolhido pela operação logística responsável na data informada.”

Seção 5 — Conferência do equipamento
Criar checkboxes para preenchimento manual:
- Equipamento vazio
- Equipamento desligado
- Equipamento retirado do local
- Equipamento sem avarias aparentes
- Equipamento com avarias aparentes

Campo:
“Observações sobre o estado do equipamento”
Linha ou área em branco para preenchimento manual.

Seção 6 — Assinaturas
Criar campos com linhas para assinatura:

Responsável pelo PDV:
- Nome
- Documento
- Assinatura
- Data

Responsável pela recolha:
- Nome
- Documento ou matrícula
- Assinatura
- Data

Rodapé do documento:
“Documento gerado pela Cora em 12/06/2026 às 13:27.”

Interações:
- Clicar em “Voltar” retorna ao FRAME 1.
- Clicar em “Baixar PDF” exibe toast: “Comprovante gerado com sucesso.”
- Clicar em “Imprimir comprovante” exibe toast: “Comprovante enviado para impressão.”

FRAME 4 — Alerta: comprovante indisponível sem agendamento

Criar uma variação para quando o usuário clicar em “Comprovante de recolha” em uma OS com status “Aguardando agendamento”.

Sobre a listagem, exibir modal central pequeno.

Título:
“Agende a recolha para gerar o comprovante”

Texto:
“O comprovante de recolha precisa da data agendada para ser gerado. Agende a recolha antes de imprimir este documento.”

Resumo:
- OS: OSR-2026-000123
- Ticket: Cora-000123
- PDV: 95252 - Fernando Lima
- Status: Aguardando agendamento

Botões:
- “Cancelar”
- Botão primário “Agendar recolha”

Interação:
- Clicar em “Cancelar” fecha o modal.
- Clicar em “Agendar recolha” abre o modal de agendamento já existente ou cria um placeholder de modal com os campos:
  - Data da recolha
  - Período / horário
  - Responsável pela rota
  - Observações

FRAME 5 — Estado de erro ao gerar documento

Criar toast ou snackbar de erro para falha na geração do PDF ou impressão.

Toast vermelho:
“Não foi possível gerar o documento. Tente novamente mais tarde.”

Criar duas variações:
1. Erro ao baixar PDF.
2. Erro ao imprimir.

FRAME 6 — Estado de template não configurado

Criar variação para quando o template do comprovante não estiver configurado no backoffice.

Ao clicar em “Comprovante de recolha”, exibir modal de alerta.

Título:
“Template de comprovante não configurado”

Texto:
“O comprovante de recolha ainda não está disponível para esta operação. Configure o template no backoffice para permitir a impressão.”

Resumo:
- Operação: CDD Campinas
- Documento: Comprovante de recolha
- Status: Pendente de configuração

Botões:
- “Fechar”

FRAME 7 — Histórico após impressão

Criar variação do drawer lateral “Detalhes da Recolha” na aba “Histórico”.

Adicionar evento no topo da timeline:
Data: 12/06/2026
Hora: 13:32
Status/evento: “Documento impresso”
Descrição: “Dados da OS impressos por 123456@ambev.com.br.”

Criar outro evento como variação:
Data: 12/06/2026
Hora: 13:34
Status/evento: “Comprovante impresso”
Descrição: “Comprovante de recolha impresso por 123456@ambev.com.br.”

Importante:
Esses eventos não alteram o status principal da OS. A OS continua como “Recolha agendada”, “Aguardando recolha” ou o status correspondente.

Conexões do protótipo:
- FRAME 1 / opção “Dados da OS” → FRAME 2
- FRAME 1 / opção “Comprovante de recolha” com OS agendada → FRAME 3
- FRAME 1 / opção “Comprovante de recolha” sem agendamento → FRAME 4
- FRAME 2 / “Baixar PDF” → toast de sucesso
- FRAME 2 / “Imprimir” → toast de sucesso
- FRAME 3 / “Baixar PDF” → toast de sucesso
- FRAME 3 / “Imprimir comprovante” → toast de sucesso
- FRAME 2 ou 3 / erro → FRAME 5
- FRAME 1 / comprovante sem template → FRAME 6
- Após impressão → FRAME 7

Resultado esperado:
Um complemento navegável para o dropdown já criado, mostrando o comportamento das opções “Dados da OS” e “Comprovante de recolha”, com pré-visualização em formato A4, ações de baixar PDF, imprimir, estados de erro, bloqueio por falta de agendamento e histórico de impressão.