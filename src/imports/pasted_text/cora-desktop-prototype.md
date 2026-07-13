Crie um protótipo desktop para a plataforma Cora, seguindo o design system visual das telas existentes de Instalação e Recolha de Equipamentos.

Contexto:
Estamos adicionando um fluxo de criação manual de solicitação de recolha de coolers/equipamentos dentro da Cora. A tela atual de “Recolha de Equipamentos” já possui listagem, filtros, tabela, status, ações por linha e drawer lateral de detalhes/histórico. Precisamos adicionar um botão primário “Solicitar recolha” e criar as telas/modais do fluxo de solicitação e início da gestão de OS.

Estilo visual:
- Layout desktop, largura 1440px ou 1920px, com topbar branca, logo Cora no topo esquerdo, ícones no topo direito e avatar circular.
- Breadcrumb no topo da página.
- Títulos grandes em preto, subtítulos menores em cinza escuro.
- Área de conteúdo com fundo cinza claro.
- Cards brancos com sombra sutil ou borda leve.
- Tabelas com cabeçalho cinza, linhas alternadas branco/cinza claro.
- Botão primário laranja Cora, no mesmo padrão do botão “Criar solicitação” da tela de Instalação.
- Botões secundários brancos com borda.
- Chips de status: cinza para status neutro, amarelo para alerta/atraso, verde para produtivo/sucesso, vermelho para improdutivo/erro.
- Usar ícones simples no padrão Material/outline: filtro, download/cloud, olho, lápis, calendário, check, close.

Frames que devem ser criados:

FRAME 1 — Listagem de Recolha com botão novo
Criar uma tela chamada “Recolha de Equipamentos”.
Topo com breadcrumb:
Início > Equipamentos de Refrigeração > Recolha de Equipamentos.
Título: “Recolha de Equipamentos”.
Subtítulo: “Acompanhe aqui o andamento das solicitações de recolha”.
Adicionar no canto superior direito do cabeçalho um botão primário laranja com label “Solicitar recolha”.
Abaixo, manter área de filtros:
- Campo “Código do PDV” com placeholder “Informe o código do cliente”.
- Link/ação “Filtros avançados” com ícone de filtro.
- Ícone de exportar/download à direita.
Tabela com colunas:
Unidade, Ticket, Data de abertura, Código do PDV, Modalidade, Equipamento, Status, Data de atualização, Ações.
Popular com exemplos:
Paulínia / Campinas | C16799833 | 12/06/2026 | 95252 | Comodato | Cooler | Aguardando agendamento | 12/06/2026
Ribeirão Preto | C16799742 | 12/06/2026 | 66723 | Comodato | Cooler | Recolha agendada | 12/06/2026
CDD CONTAGEM | C16799446 | 12/06/2026 | 7556 | Comodato | Cooler | Recolha atrasada | 12/06/2026
Salvador | C16785701 | 11/06/2026 | 881 | Comodato | Cooler | Recolha improdutiva | 11/06/2026
Ações por linha: ícone de lápis/calendário, ícone de download, ícone de olho.
Interação: o botão “Solicitar recolha” leva ao FRAME 2.

FRAME 2 — Solicitação de recolha: estado inicial
Tela full page chamada “Solicitação de recolha”.
Breadcrumb:
Início > Equipamentos de Refrigeração > Recolha de Equipamentos > Solicitar recolha.
Título: “Solicitação de recolha”.
Subtítulo: “Preencha os dados para solicitar a recolha de um equipamento”.
Card “Dados para busca” com:
- Código do CDD * input com placeholder “Informe o código do CDD”
- Código do cliente/PDV * input com placeholder “Informe o código do cliente”
- Seção “Identificação do equipamento *”
- Radio option “Tenho o número de série”
- Input “Número de série” desabilitado até selecionar essa opção
- Radio option “Não tenho o número de série”
- Select “Tipo de equipamento” desabilitado até selecionar essa opção
- Botão secundário “Buscar dados”
Abaixo, cards vazios ou skeletons para “Dados do cliente” e “Dados do equipamento”.
Rodapé fixo com botões:
“Cancelar” e “Criar solicitação” desabilitado.
Interação: preencher/buscar leva ao FRAME 3.

FRAME 3 — Solicitação de recolha: dados encontrados e editáveis
Mesma tela do FRAME 2, agora com dados preenchidos.
Card “Dados para busca” preenchido:
Código do CDD: “CDD Campinas”
Código do cliente/PDV: “95252”
Identificação: radio “Tenho o número de série” selecionado
Número de série: “SN-2026-009812”
Card “Dados do cliente”:
- PDV: “95252 - Fernando Lima”
- Contato: “Ana Paula Gonçalves”
- E-mail: “ana.paula@email.com”
- Telefone: “(11) 90000-0000”
- Endereço de recolha: “Rua Magnólia, nº 12 - Bairro das Flores”
- Cidade: “Campinas”
- Estado: “SP”
- CEP: “12345-000”
- Campo “Referência / observações para recolha”
Adicionar helper: “As alterações feitas aqui serão usadas apenas nesta solicitação de recolha.”
Todos os campos de contato e endereço devem parecer editáveis.
Card “Dados do equipamento”:
- Tipo: “Cooler”
- Modelo: “Geladeira Brahma”
- Marca: “Brahma”
- Voltagem: “220v”
- Número de série: “SN-2026-009812”
- Etiqueta/RG: “2090594173528-9”
- Modalidade: “Comodato”
- Contrato: “C-203948”
Card “Observações”:
Textarea “Adicione instruções para a logística, se necessário”.
Rodapé fixo:
“Cancelar” e botão primário “Criar solicitação” habilitado.
Interação: clicar em “Criar solicitação” abre o modal do FRAME 5.

FRAME 4 — Solicitação de recolha: fluxo sem número de série
Criar variação da tela de solicitação.
No card “Dados para busca”, selecionar o radio “Não tenho o número de série”.
Campo obrigatório “Tipo de equipamento” preenchido com “Cooler”.
Exibir um aviso informativo:
“Informe o tipo de equipamento para seguir sem número de série.”
No card “Dados do equipamento”, mostrar chip “Serial não informado” e campos:
Tipo: Cooler
Modelo: Geladeira Brahma
Marca: Brahma
Voltagem: 220v
Modalidade: Comodato
Adicionar uma pequena tabela “Equipamentos associados ao PDV” com seleção por radio quando houver mais de um equipamento:
Modelo | Tipo | Marca | Voltagem | Etiqueta/RG
Rodapé com “Cancelar” e “Criar solicitação” habilitado após seleção/preenchimento.

FRAME 5 — Modal de confirmação
Sobre a tela do FRAME 3, criar overlay escuro e modal central.
Título: “Confirmar solicitação de recolha?”
Texto: “Confira os dados antes de criar a solicitação.”
Resumo:
CDD: CDD Campinas
PDV: 95252 - Fernando Lima
Equipamento: Cooler - Geladeira Brahma
Número de série: SN-2026-009812
Endereço de recolha: Rua Magnólia, nº 12 - Bairro das Flores, Campinas - SP
Contato: Ana Paula Gonçalves - (11) 90000-0000
Botões:
“Cancelar” e botão primário “Confirmar solicitação”.
Interação: confirmar leva ao FRAME 6.

FRAME 6 — Listagem após sucesso
Voltar para a listagem de Recolha.
Exibir toast verde no canto superior direito:
“Solicitação de recolha criada com sucesso.”
Adicionar nova linha no topo da tabela:
Unidade: CDD Campinas
Ticket: Cora-000123
Data de abertura: 12/06/2026
Código do PDV: 95252
Modalidade: Comodato
Equipamento: Cooler
Status: chip cinza “Aguardando agendamento”
Data de atualização: 12/06/2026
Ações: agendar, imprimir, visualizar.
Interação: clicar no olho abre o FRAME 7.

FRAME 7 — Drawer lateral “Detalhes da Recolha”
Usar o padrão atual de drawer lateral à direita.
Fundo da listagem desfocado.
Drawer com título “Detalhes da Recolha” e botão X.
Tabs: “Detalhes” e “Histórico”.
Na tab Detalhes, mostrar:
Ticket: Cora-000123
PDV: FERNANDO LIMA
CDD: CDD Campinas
Status: Aguardando agendamento
Modelo: Geladeira Brahma
Equipamento: Cooler
Número de série: SN-2026-009812
Etiqueta/RG: 2090594173528-9
Modalidade: Comodato
Logística: -
Contato: Ana Paula Gonçalves
Telefone: (11) 90000-0000
Endereço de recolha: Rua Magnólia, nº 12 - Bairro das Flores, Campinas - SP
Na tab Histórico, criar timeline:
12/06/2026 13:27 — Aguardando agendamento — Solicitação criada via Cora por 123456@ambev.com.br
12/06/2026 13:27 — Processando — Solicitação registrada
Usar linha vertical e chips de status no mesmo estilo do histórico atual.

FRAME 8 — Modal “Agendar recolha”
Abrir a partir do ícone de calendário/lápis em uma linha com status “Aguardando agendamento”.
Overlay + modal central.
Título: “Agendar recolha”
Texto: “Defina a data de recolha que será exibida no comprovante.”
Campos:
Data da recolha *
Período / horário *
Logística / fornecedor *
Observações para a rota
Botões:
“Cancelar” e botão primário “Confirmar agendamento”.
Após confirmar, mostrar toast:
“Recolha agendada com sucesso.”
Status da linha vira “Recolha agendada”.

FRAME 9 — Menu “Imprimir documentos”
A partir do ícone de download, mostrar dropdown pequeno ancorado no ícone:
Título: “Imprimir documentos”
Opções:
“Dados da OS”
“Comprovante de recolha”
Usar ícones de documento/download.

FRAME 10 — Modal “Finalizar recolha — produtiva”
Abrir a partir de ação “Finalizar” em uma linha com status “Recolha agendada”.
Modal:
Título “Finalizar recolha”
Texto “Informe o resultado da tentativa de recolha.”
Radio cards:
- Recolha produtiva — “O equipamento foi recolhido.”
- Recolha improdutiva — “O equipamento não foi recolhido.”
Selecionar “Recolha produtiva”.
Mostrar campo obrigatório:
Evidência *
Upload com texto “Selecione o arquivo ou arraste aqui”
Mostrar campo “Estado do equipamento” com select:
Disponível, Em manutenção, Sucata, Bloqueado, A validar
Observação pequena: “Campo a validar com negócio.”
Botões:
“Cancelar” e botão primário “Finalizar recolha”.
Após finalizar, status vira chip verde “Recolha produtiva”.

FRAME 11 — Modal “Finalizar recolha — improdutiva”
Variação do modal do FRAME 10.
Selecionar “Recolha improdutiva”.
Mostrar campo obrigatório “Motivo *” com select contendo:
Cliente se recusa a devolver o equipamento
Estabelecimento fechado
Equipamento não encontrado
Cliente não encontrado
Equipamento não estava em condições para recolha
Cliente solicitou reagendamento
Campo solicitou reagendamento
Outro
Campo “Observações”
Botões:
“Cancelar” e botão primário “Finalizar recolha”.
Após finalizar, status vira chip vermelho “Recolha improdutiva”.

FRAME 12 — Estado de recolha atrasada
Criar uma variação da listagem com uma linha em status “Recolha atrasada” com chip amarelo/alerta.
Na linha, disponibilizar ações:
Reagendar
Finalizar
Visualizar
Adicionar tooltip no chip:
“A data agendada já passou. Reagende ou finalize a recolha.”