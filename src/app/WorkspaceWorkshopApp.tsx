import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  BarChart3,
  Check,
  CheckCircle2,
  ClipboardList,
  Database,
  Download,
  FileJson,
  FileText,
  FileSpreadsheet,
  FlaskConical,
  HelpCircle,
  Layers3,
  Mail,
  MessageSquarePlus,
  Pencil,
  Plus,
  Send,
  Settings2,
  ThumbsUp,
  Timer,
  Trash2,
  UserCircle,
  Users,
  X,
} from "lucide-react";
import { ActionModalProvider, useActionModal } from "./components/ActionModal";
import { ProcessFlowDiagram, type ProcessFlowStep } from "./components/ProcessFlowDiagram";

type View = "room" | "stages" | "hypotheses" | "prioritization" | "plans" | "summary" | "facilitation";
type Activity = "fluxo" | "reforma" | "kdd" | "dados" | "hipoteses" | "priorizacao" | "plano" | "resumo";
type RoundStatus = "aberta" | "encerrada" | "em consolidação";
type Level = "Baixo" | "Médio" | "Alto";
type ParticipantStatus = "presente" | "ausente" | "facilitador" | "apoio";
type ContributionStatus = "nova" | "em análise" | "validada" | "incorporada" | "descartada" | "duplicada" | "fora do escopo" | "pendente de validação";
type ContributionType = "ajuste de fluxo" | "dor" | "regra de negócio" | "necessidade" | "pergunta" | "dúvida" | "impacto de Reforma Tributária" | "sugestão de KDD" | "hipótese" | "ofensor" | "comentário" | "voto" | "pendência";
type HypothesisStatus = "Sugerida" | "Prioritária" | "Para depois" | "Fora do escopo" | "Precisa validar";
type PlanStatus = "Não iniciado" | "Em construção" | "Pronto para revisão" | "Validado" | "Pendente de responsável" | "Com pendência";
type PlanStepStatus = "Não iniciado" | "Em andamento" | "Concluído" | "Com pendência";
type OffenderType = "Processo" | "Sistema" | "Dados" | "Sistema / Dados" | "Dados / Processo" | "Processo / Dados" | "Dados / Governança" | "Regra de negócio" | "Regra de negócio / Sistema" | "Regra de negócio / Dados" | "Fiscal" | "Integração" | "Integração / Sistema" | "Sistema / Integração" | "Governança" | "Governança / Sistema" | "Governança / Auditoria" | "Processo / Governança" | "Sistema / Operação" | "Responsabilidade" | "Operação" | "Prazo";

interface Participant {
  id: string;
  name: string;
  role: string;
  area: string;
  workshopRole: string;
  status: ParticipantStatus;
  createdAt: string;
}

interface WorkItem {
  id: string;
  title?: string;
  text: string;
  description?: string;
  area: string;
  roles?: string[];
  tools?: string | string[];
  systems?: string[];
  doubts?: string[];
  dependencies?: string[];
  origin?: string;
  note?: string;
  order?: number;
  createdBy?: string;
  createdAt?: string;
  updatedAt?: string;
  impact: Level;
  status: "em validação" | "em revisão" | "em aberto" | "validado" | "ajustar" | "discordância" | "dúvida" | "pendência" | "fora de escopo" | "transformado em hipótese";
  comments: string[];
}

interface Hypothesis {
  id: string;
  stageId: string;
  sourceId?: string;
  text: string;
  expectedResult: string;
  evidence: string;
  area: string;
  impactProcess: Level;
  financialRisk: Level;
  fiscalRisk: Level;
  painFrequency: Level;
  technicalDependency: Level;
  effort: Level;
  urgency: Level;
  clarity: Level;
  priorityStatus: HypothesisStatus;
  votes: Record<string, number>;
  createdBy?: string;
  createdAt?: string;
}

interface Offender {
  id: string;
  stageId: string;
  hypothesisId: string;
  type: OffenderType;
  content: string;
  cause: string;
  impact: Level;
  responsibleArea: string;
  status?: "Sugerido" | "Validado" | "Descartado";
  origin?: string;
  createdBy?: string;
  createdAt?: string;
}

interface PlanActionRow {
  id: string;
  action: string;
  owner: string;
  deadline: string;
  input: string;
  output: string;
  notes: string;
}

interface PlanRisk {
  id: string;
  risk: string;
  type: string;
  impact: Level;
  mitigation: string;
}

interface PlanPremise {
  id: string;
  premise: string;
  area: string;
  evidence: string;
  status: "Não validada" | "Em validação" | "Validada" | "Quebrada";
}

interface PlanMetricItem {
  id: string;
  name: string;
  description: string;
  source: string;
  baseline: string;
  target: string;
  frequency: string;
  owner: string;
}

interface ActionPlan {
  id: string;
  stageId: string;
  hypothesisId: string;
  action: string;
  experiment: string;
  scope: string;
  areas: string;
  dataNeeded: string;
  impactedSystem: string;
  owner: string;
  support: string;
  deadline: string;
  successMetric: string;
  invalidationCriteria: string;
  risks: string;
  dependencies: string;
  nextStep: string;
  status: PlanStatus;
  priorityImpact?: string;
  priorityEffort?: string;
  priorityFinancialRisk?: string;
  priorityUrgency?: string;
  priorityTechnicalDependency?: string;
  priorityReason?: string;
  priorityMatrix?: string;
  planStep?: number;
  planStepStatuses?: Record<string, PlanStepStatus>;
  actionRows?: PlanActionRow[];
  riskItems?: PlanRisk[];
  premiseItems?: PlanPremise[];
  metricItems?: PlanMetricItem[];
  stopConditions?: string[];
  earlyStop?: string;
  alertSignal?: string;
  invalidationDecision?: string;
  decisionOwner?: string;
}

interface Stage {
  id: string;
  name: string;
  order: number;
  status: "aguardando" | "em validação" | "validada" | "com ajustes" | "com pendências" | "pulada temporariamente";
  description?: string;
  origin?: string;
  preworkVersion?: string;
  objective: string;
  flow: WorkItem[];
  taxImpact: {
    answer: string;
    expectedImpact: string;
    obligation: string;
    existingPain: string;
    validator: string;
    dependency: string;
    status: "não avaliado" | "validado" | "pendência fiscal" | "dependência técnica";
  };
  kdd: { draft: string; final: string; suggestions: string[]; comments: string[]; status: "em validação" | "em revisão" | "validado" | "pendente" };
  kpis: { status: string; message: string; items: string[] };
  kpiItems?: WorkItem[];
  pains: WorkItem[];
  rules: WorkItem[];
  needs: WorkItem[];
  openQuestions: WorkItem[];
  hypotheses: Hypothesis[];
  offenders: Offender[];
  plans: ActionPlan[];
  pending: string[];
}

interface Contribution {
  id: string;
  authorId: string;
  author: string;
  authorRole: string;
  authorProfile: "Participante" | "Facilitadora";
  area: string;
  createdAt: string;
  stageId: string;
  activity: Activity;
  type: ContributionType;
  content: string;
  status: ContributionStatus;
  impact?: Level;
  relatedItemId?: string;
}

interface WorkshopState {
  activeView: View;
  activeStageId: string;
  viewingStageId: string;
  activeActivity: Activity;
  viewingActivity: Activity | "";
  roundStatus: RoundStatus;
  roundMinutes: number;
  highlightedItemId: string;
  currentParticipantId: string;
  participants: Participant[];
  stages: Stage[];
  contributions: Contribution[];
  persistence: "localStorage" | "supabase";
  datasetVersion: string;
}

const STORAGE_KEY = "workspace-workshop-acordos-collab-v2";
const WORKSHOP_DATASET_VERSION = "2026-07-14-workshop-clean-db-v2";
const LAST_PARTICIPANT_KEY = `${STORAGE_KEY}:last-participant`;
const areas = ["Comercial", "Financeiro", "Fiscal", "Produto", "Tecnologia", "Dados", "CSC", "Jurídico / Compliance", "Outra"];
const levels: Level[] = ["Baixo", "Médio", "Alto"];
const activities: Activity[] = ["fluxo", "reforma", "kdd", "hipoteses", "priorizacao", "plano", "resumo"];
const validationActivities: Activity[] = ["fluxo", "reforma", "kdd", "hipoteses"];
const activityLabels: Record<Activity, string> = {
  fluxo: "Validar fluxo",
  reforma: "Reforma Tributária",
  kdd: "Validar KDD",
  dados: "Dados-base",
  hipoteses: "Hipóteses e ofensores",
  priorizacao: "Priorização",
  plano: "Plano de ação",
  resumo: "Resumo final",
};
const activityShortLabels: Record<Activity, string> = {
  fluxo: "Validar fluxo",
  reforma: "Reforma Tributária",
  kdd: "Validar KDD",
  dados: "Dados-base",
  hipoteses: "Hipóteses e ofensores",
  priorizacao: "Priorização",
  plano: "Plano de ação",
  resumo: "Resumo final",
};
const contributionTypes: ContributionType[] = ["ajuste de fluxo", "dor", "regra de negócio", "necessidade", "pergunta", "impacto de Reforma Tributária", "sugestão de KDD", "hipótese", "ofensor", "comentário", "voto", "pendência"];
const offenderTypes: OffenderType[] = ["Processo", "Sistema", "Dados", "Sistema / Dados", "Dados / Processo", "Processo / Dados", "Dados / Governança", "Regra de negócio", "Regra de negócio / Sistema", "Regra de negócio / Dados", "Fiscal", "Integração", "Integração / Sistema", "Sistema / Integração", "Governança", "Governança / Sistema", "Governança / Auditoria", "Processo / Governança", "Sistema / Operação", "Responsabilidade", "Operação", "Prazo"];
const hypothesisStatuses: HypothesisStatus[] = ["Sugerida", "Prioritária", "Para depois", "Fora do escopo", "Precisa validar"];
const taxAnswers = ["Sim", "Não", "Não sabemos ainda"];
const PREWORK_ORIGIN = "Pré-work ETAPA 1";
const PREWORK_STAGE_ONE_VERSION = "2026-07-12-etapa-1-lucid-flow";
const PREWORK_STAGE_TWO_ORIGIN = "Pré-work ETAPA 2";
const PREWORK_STAGE_TWO_VERSION = "2026-07-13-etapa-2-prework";
const PREWORK_STAGE_THREE_ORIGIN = "Pré-work ETAPA 3";
const PREWORK_STAGE_THREE_VERSION = "2026-07-13-etapa-3-prework";
const PREWORK_STAGE_FOUR_ORIGIN = "Pré-work ETAPA 4";
const PREWORK_STAGE_FOUR_VERSION = "2026-07-13-etapa-4-prework";
const PREWORK_STAGE_FIVE_ORIGIN = "Pré-work ETAPA 5";
const PREWORK_STAGE_FIVE_VERSION = "2026-07-13-etapa-5-prework";
const PREWORK_STAGE_SIX_ORIGIN = "Pré-work ETAPA 6";
const PREWORK_STAGE_SIX_VERSION = "2026-07-13-etapa-6-prework";
const score: Record<Level, number> = { Baixo: 1, Médio: 2, Alto: 3 };
const statusStyle: Record<string, string> = {
  aberta: "bg-[#E1F5E8] text-[#146B35]",
  encerrada: "bg-[#EAEAEA] text-[#2D2A26]",
  "em consolidação": "bg-[#FFF4CC] text-[#6F5400]",
  presente: "bg-[#E1F5E8] text-[#146B35]",
  ausente: "bg-[#EAEAEA] text-[#54504A]",
  facilitador: "bg-[#FFF4CC] text-[#6F5400]",
  apoio: "bg-[#E7F0FF] text-[#184B9B]",
  aguardando: "bg-[#EAEAEA] text-[#2D2A26]",
  "em validação": "bg-[#FFF4CC] text-[#6F5400]",
  "em aberto": "bg-[#E7F0FF] text-[#184B9B]",
  validada: "bg-[#E1F5E8] text-[#146B35]",
  validado: "bg-[#E1F5E8] text-[#146B35]",
  "com ajustes": "bg-[#FFF0D6] text-[#8A4B00]",
  "com pendências": "bg-[#FDE8E8] text-[#9B1C1C]",
  "pulada temporariamente": "bg-[#E7F0FF] text-[#184B9B]",
  nova: "bg-[#E7F0FF] text-[#184B9B]",
  "em análise": "bg-[#FFF4CC] text-[#6F5400]",
  incorporada: "bg-[#E1F5E8] text-[#146B35]",
  descartada: "bg-[#EAEAEA] text-[#54504A]",
  duplicada: "bg-[#EAEAEA] text-[#54504A]",
  "fora do escopo": "bg-[#EAEAEA] text-[#54504A]",
  "pendente de validação": "bg-[#FDE8E8] text-[#9B1C1C]",
  pendência: "bg-[#FDE8E8] text-[#9B1C1C]",
  "em revisão": "bg-[#FFF4CC] text-[#6F5400]",
  Sugerida: "bg-[#EFE9FF] text-[#5A2FAE]",
  Sugerido: "bg-[#EFE9FF] text-[#5A2FAE]",
  "Não avaliado": "bg-[#FDE8E8] text-[#9B1C1C]",
  ajustar: "bg-[#FFF0D6] text-[#8A4B00]",
  discordância: "bg-[#FDE8E8] text-[#9B1C1C]",
  dúvida: "bg-[#E7F0FF] text-[#184B9B]",
  "transformado em hipótese": "bg-[#EFE9FF] text-[#5A2FAE]",
  Prioritária: "bg-[#E1F5E8] text-[#146B35]",
  "Para depois": "bg-[#E7F0FF] text-[#184B9B]",
  "Fora do escopo": "bg-[#EAEAEA] text-[#54504A]",
  "Precisa validar": "bg-[#FFF4CC] text-[#6F5400]",
  "Não iniciado": "bg-[#EAEAEA] text-[#2D2A26]",
  "Em construção": "bg-[#FFF4CC] text-[#6F5400]",
  "Pronto para revisão": "bg-[#E7F0FF] text-[#184B9B]",
  Validado: "bg-[#E1F5E8] text-[#146B35]",
  "Pendente de responsável": "bg-[#FDE8E8] text-[#9B1C1C]",
  "Com pendência": "bg-[#FDE8E8] text-[#9B1C1C]",
  "Em andamento": "bg-[#FFF4CC] text-[#6F5400]",
  Concluído: "bg-[#E1F5E8] text-[#146B35]",
};

function id(prefix: string) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}
function now() {
  return new Date().toISOString();
}
function item(idValue: string, text: string, area: string, impact: Level = "Médio", status: WorkItem["status"] = "em revisão"): WorkItem {
  return { id: idValue, text, area, impact, status, comments: [] };
}
function preworkItem(
  idValue: string,
  title: string,
  text: string,
  area: string,
  impact: Level = "Alto",
  extra: Partial<WorkItem> = {},
): WorkItem {
  return { id: idValue, title, text, area, impact, status: "em validação", origin: PREWORK_ORIGIN, comments: [], ...extra };
}
function blankTax(): Stage["taxImpact"] {
  return { answer: "", expectedImpact: "", obligation: "", existingPain: "", validator: "", dependency: "", status: "não avaliado" };
}
function hypothesis(stageId: string, sourceId: string, sourceText: string, area: string): Hypothesis {
  return {
    id: id("hyp"),
    stageId,
    sourceId,
    text: `Se padronizarmos o tratamento de "${sourceText}", então reduziremos retrabalho, porque a evidência aparece como dor recorrente do processo.`,
    expectedResult: "Reduzir retrabalho e acelerar decisão",
    evidence: sourceText,
    area,
    impactProcess: "Alto",
    financialRisk: "Médio",
    fiscalRisk: "Médio",
    painFrequency: "Alto",
    technicalDependency: "Médio",
    effort: "Médio",
    urgency: "Médio",
    clarity: "Médio",
    priorityStatus: "Precisa validar",
    votes: {},
  };
}

const stageOnePrework: Stage = {
  id: "etapa-1",
  name: "Desdobramento da verba",
  order: 1,
  status: "em validação",
  description: "Validar como a verba sai do orçamento macro e vira critério executável por canal, regional e cliente.",
  origin: PREWORK_ORIGIN,
  preworkVersion: PREWORK_STAGE_ONE_VERSION,
  objective: "Garantir que o desdobramento da verba seja compreendido, padronizado, auditável e aderente às regras de divisão, alavancas e complexidade dos acordos.",
  flow: [
    preworkItem("e1-f1", "Planejamento anual", "Desdobramento da verba que vem do board, definida no ano anterior.", "PPM AC", "Alto", { roles: ["PPM AC"], tools: ["Outlook", "Excel"] }),
    preworkItem("e1-f2", "Planejamento mensal", "LE (last estimated) definido - Setembro.", "PPM AC", "Alto", { roles: ["PPM AC"] }),
    preworkItem("e1-f3", "Negociação", "Negociação das alavancas com as redes. Planejamento / Divisão da verba.", "KAM nacional, KAM regional", "Alto", { roles: ["KAM nacional", "KAM regional"] }),
    preworkItem("e1-f4", "Repasse", "Repasse da divisão da verba para time Contábil separado entre NBZs e VBZs.", "PPM AC, Financeiro CSC", "Alto", { roles: ["PPM AC", "Financeiro CSC"] }),
    preworkItem("e1-f5", "Cadastro verba", "Consolidação e inserção manual da verba no portal VMV por NBZ e VBZ.", "VMV", "Alto", { systems: ["VMV"] }),
  ],
  taxImpact: { answer: "Não avaliado", expectedImpact: "", obligation: "", existingPain: "", validator: "", dependency: "", status: "não avaliado" },
  kdd: {
    draft: "O desdobramento de verba deve ser padronizado, auditável, com regras claras de divisão e aderente à complexidade dos acordos e alavancas.",
    final: "",
    suggestions: [],
    comments: [],
    status: "em validação",
  },
  kpis: { status: "", message: "Não informado no pré-work.", items: [] },
  pains: [
    preworkItem("e1-d1", "Formatos inconsistentes", "Cada KAM usa um formato para gestão, gerando inconsistência e necessidade de separar manualmente verbas AC e Regional.", "Comercial / PPM", "Alto"),
    preworkItem("e1-d2", "Ajustes duplicados de sazonalidade e sobra de recurso", "Ajustes de sazonalidade e “sobra recurso” aparecem duplicados no processo.", "Comercial / Financeiro", "Alto"),
    preworkItem("e1-d3", "Dependência de planilhas para repasse NBZ/VBZ", "O repasse entre NBZ e VBZ depende de planilhas, aumentando risco de erro e retrabalho.", "Financeiro / CSC", "Alto"),
    preworkItem("e1-d4", "Falta de edição sistêmica e trilha de auditoria", "Não há edição dentro de sistema nem controle de alavanca com trilha de auditoria.", "Produto / Tecnologia / Governança", "Alto"),
    preworkItem("e1-d5", "Falta de suporte nativo para trade e múltiplas metas", "O processo não tem suporte nativo a acordos de trade e múltiplas metas.", "Comercial / Produto", "Alto"),
  ],
  rules: [
    preworkItem("e1-r1", "Verba provisionada corretamente", "A verba deve ser provisionada corretamente para evitar desvios.", "Financeiro", "Alto"),
    preworkItem("e1-r2", "Verba associada à alavanca", "A verba deve estar associada a uma alavanca.", "Comercial / Financeiro", "Alto"),
    preworkItem("e1-r3", "Acordo assinado para gerar DGE", "O acordo precisa ser assinado para gerar DGE.", "Financeiro / Jurídico / Comercial", "Alto"),
    preworkItem("e1-r4", "Não editar acordo após lançamento", "Não é permitido editar acordos após lançamento.", "Comercial / Produto / Governança", "Alto"),
    preworkItem("e1-r5", "Assinatura fora do prazo gera retrabalho", "Assinatura fora do prazo gera retrabalho.", "Comercial / Financeiro", "Médio"),
  ],
  needs: [
    preworkItem("e1-n1", "Edição sistêmica controlada", "Permitir edição dentro de sistema, com controle de alavanca e trilha de auditoria.", "Produto / Tecnologia / Governança", "Alto"),
    preworkItem("e1-n2", "Suporte a acordos de trade e múltiplas metas", "Ter suporte nativo a acordos de trade e múltiplas metas.", "Produto / Comercial", "Alto"),
  ],
  openQuestions: [],
  hypotheses: [],
  offenders: [],
  plans: [],
  pending: [],
};

const stageTwoPrework: Stage = {
  id: "etapa-2",
  name: "Cadastro de Acordos",
  order: 2,
  status: "aguardando",
  description: "Validar como os acordos são cadastrados, revisados, enviados para Bees Link e criados no GPRO.",
  origin: PREWORK_STAGE_TWO_ORIGIN,
  preworkVersion: PREWORK_STAGE_TWO_VERSION,
  objective: "Garantir que o cadastro de acordos seja centralizado, simples, rastreável, com edição controlada e suporte às diferentes alavancas e tipos de acordo.",
  flow: [
    preworkItem("e2-f1", "Cadastro do acordo GPRO", "KAMs, GCs, APRs cadastram acordos no GPRO via alavanca outros.", "KAM nacional, KAM regional, GC, APR", "Alto", { origin: PREWORK_STAGE_TWO_ORIGIN, roles: ["KAM nacional", "KAM regional", "GC", "APR"], systems: ["GPRO"], note: "Caminho direto GPRO" }),
    preworkItem("e2-f2", "Cadastro do acordo planilha Bees", "KAMs preenchem planilha padrão do Bees e enviam para o time de DI.", "KAM nacional, KAM regional, GC, APR", "Alto", { origin: PREWORK_STAGE_TWO_ORIGIN, roles: ["KAM nacional", "KAM regional", "GC", "APR"], tools: ["Excel"] }),
    preworkItem("e2-f3", "Revisão Dados", "Time de DI revisa planilha com informações fornecidas por cada KAM.", "Time DI", "Alto", { origin: PREWORK_STAGE_TWO_ORIGIN, roles: ["Time DI"], tools: ["Excel"] }),
    preworkItem("e2-f4", "Envio dos acordos Lake", "Time de DI faz a carga das informações diretamente no data lake para gerar acordos.", "Time DI", "Alto", { origin: PREWORK_STAGE_TWO_ORIGIN, roles: ["Time DI"], systems: ["Data Lake"] }),
    preworkItem("e2-f5", "Envio para o GPRO", "Acordos são criados no GPRO com ‘autor bees’.", "GPRO", "Alto", { origin: PREWORK_STAGE_TWO_ORIGIN, systems: ["GPRO"], note: "Envio automático dos acordos para GPRO" }),
    preworkItem("e2-f6", "Envio Bees Link", "Envio dos acordos para o Bees Link, onde as redes têm visibilidade das alavancas.", "Bees Link", "Alto", { origin: PREWORK_STAGE_TWO_ORIGIN, systems: ["Bees Link"], note: "Envio automático dos acordos para Bees Link" }),
  ],
  taxImpact: { answer: "Não avaliado", expectedImpact: "", obligation: "", existingPain: "", validator: "", dependency: "", status: "não avaliado" },
  kdd: {
    draft: "O cadastro de acordos deve ser centralizado, simples, com edição controlada e suporte às diferentes alavancas e tipos de acordo.",
    final: "",
    suggestions: [],
    comments: [],
    status: "em validação",
  },
  kpis: { status: "", message: "Não informado no pré-work.", items: [] },
  pains: [
    preworkItem("e2-d1", "Falta de visibilidade de recursos e interfaces amigáveis", "Falta de visibilidade de recursos e interfaces amigáveis.", "Produto / Tecnologia / Comercial", "Alto", { origin: PREWORK_STAGE_TWO_ORIGIN }),
    preworkItem("e2-d2", "Dependência grande de Excel", "Dependência de Excel muito grande, com vários campos para preencher.", "Comercial / Dados / DI", "Alto", { origin: PREWORK_STAGE_TWO_ORIGIN }),
    preworkItem("e2-d3", "Sem edição pós-lançamento", "Sem edição pós-lançamento, especialmente relacionada a assinante.", "Comercial / Produto / Governança", "Alto", { origin: PREWORK_STAGE_TWO_ORIGIN }),
    preworkItem("e2-d4", "Interface do GPRO não amigável", "Interface do GPRO não é amigável. Usabilidade ruim.", "Produto / Tecnologia / Comercial", "Alto", { origin: PREWORK_STAGE_TWO_ORIGIN }),
    preworkItem("e2-d5", "Planilha de DI passível de erro", "O processo com a planilha de DI é passível de erro porque são muitas informações passando pela mão de muitas pessoas.", "Dados / DI / Comercial", "Alto", { origin: PREWORK_STAGE_TWO_ORIGIN }),
    preworkItem("e2-d6", "Fluxo GPRO pouco utilizado por burocracia", "O fluxo do GPRO não é mais utilizado por conta da burocracia.", "Comercial / Produto / Tecnologia", "Alto", { origin: PREWORK_STAGE_TWO_ORIGIN }),
    preworkItem("e2-d7", "Farol de assinatura pouco utilizado", "Farol de assinatura não é mais tão utilizado.", "Comercial / Governança / Produto", "Médio", { origin: PREWORK_STAGE_TWO_ORIGIN }),
    preworkItem("e2-d8", "Suporte parcial a trade", "Suporte parcial a trade. Não é possível anexar arquivos, gerando risco de perda de arquivos.", "Comercial / Produto / Tecnologia", "Alto", { origin: PREWORK_STAGE_TWO_ORIGIN }),
    preworkItem("e2-d9", "Falta de evidência estruturada para auditorias qualitativas", "Falta de evidência estruturada para auditorias qualitativas.", "Comercial / Governança / Auditoria", "Alto", { origin: PREWORK_STAGE_TWO_ORIGIN }),
  ],
  rules: [
    preworkItem("e2-r1", "Cadastro no início do mês de vigência", "Acordos devem ser cadastrados no início do mês de vigência.", "Comercial / Financeiro / Governança", "Alto", { origin: PREWORK_STAGE_TWO_ORIGIN }),
    preworkItem("e2-r2", "Vínculo entre acordos das redes e acordos Ambev", "Acordos enviados pelas redes devem estar vinculados aos acordos Ambev.", "Comercial / Governança / Sistemas", "Alto", { origin: PREWORK_STAGE_TWO_ORIGIN }),
  ],
  needs: [
    preworkItem("e2-n1", "Módulo único de cadastro", "Criar módulo único de cadastro, com edição controlada e suporte a trade.", "Produto / Tecnologia / Comercial", "Alto", { origin: PREWORK_STAGE_TWO_ORIGIN }),
  ],
  openQuestions: [],
  hypotheses: [],
  offenders: [],
  plans: [],
  pending: [],
};

const stageThreePrework: Stage = {
  id: "etapa-3",
  name: "Apuração de Acordos",
  order: 3,
  status: "aguardando",
  description: "Validar como os acordos são apurados, quais caminhos são manuais ou automáticos, quais fontes são usadas e como o resultado avança para o GPRO.",
  origin: PREWORK_STAGE_THREE_ORIGIN,
  preworkVersion: PREWORK_STAGE_THREE_VERSION,
  objective: "Garantir que a apuração de acordos seja padronizada, rastreável e confiável, com critérios claros para definir quando a apuração será manual, automática ou híbrida.",
  flow: [
    preworkItem("e3-f1", "Apuração", "Apuração manual dos acordos cadastrados via GPRO na planilha.", "KAM nacional, KAM regional", "Alto", { origin: PREWORK_STAGE_THREE_ORIGIN, roles: ["KAM nacional", "KAM regional"], tools: ["Planilha"], note: "Apuração manual" }),
    preworkItem("e3-f2", "Apuração", "Apuração automática dos acordos via Bees Link.", "Time DI", "Alto", { origin: PREWORK_STAGE_THREE_ORIGIN, roles: ["Time DI"], systems: ["Bees Link"], note: "Apuração automática via Bees Link" }),
    preworkItem("e3-f3", "Envio Apuração", "Bees Link envia para o GPRO a apuração dos acordos para gerar pagamentos.", "Bees Link / GPRO", "Alto", { origin: PREWORK_STAGE_THREE_ORIGIN, systems: ["Bees Link", "GPRO"] }),
  ],
  taxImpact: { answer: "Não avaliado", expectedImpact: "", obligation: "", existingPain: "", validator: "", dependency: "", status: "não avaliado" },
  kdd: {
    draft: "A apuração de acordos deve ser padronizada, rastreável e confiável, com fontes oficiais e critérios claros por tipo de alavanca para definir quando será automática, manual ou híbrida, permitindo revisão controlada do resultado antes do avanço no fluxo.",
    final: "",
    suggestions: [],
    comments: [],
    status: "em validação",
  },
  kpis: { status: "", message: "Não informado no pré-work.", items: [] },
  pains: [
    preworkItem("e3-d1", "Dependência de planilhas e consolidação manual", "Apuração ainda depende muito de planilhas e consolidação manual, principalmente para acordos cadastrados via GPRO ou para alavancas que não são totalmente automatizadas.", "Comercial / Dados / DI", "Alto", { origin: PREWORK_STAGE_THREE_ORIGIN }),
    preworkItem("e3-d2", "Baixa confiança na qualidade dos dados", "Baixa confiança na qualidade dos dados, o que faz com que nem todos os acordos sejam enviados ao Bees Link para acompanhamento pela rede. O KAM pode optar por não expor as metas porque não confia totalmente nos números apresentados.", "Comercial / Dados / Bees Link", "Alto", { origin: PREWORK_STAGE_THREE_ORIGIN }),
    preworkItem("e3-d3", "Automação parcial da apuração", "Automação parcial da apuração: apesar de existir potencial de automação ponta a ponta, apenas 33% do valor total das apurações estava sendo feito de forma automatizada no material levantado.", "Dados / DI / Produto / Tecnologia", "Alto", { origin: PREWORK_STAGE_THREE_ORIGIN }),
    preworkItem("e3-d4", "Divergências no cálculo da apuração", "Divergências no cálculo da apuração, como casos em que devoluções de pedidos ou faturamento negativo são interpretados incorretamente como meta batida.", "Dados / Financeiro / Comercial", "Alto", { origin: PREWORK_STAGE_THREE_ORIGIN }),
    preworkItem("e3-d5", "Alavancas qualitativas ainda dependem de validação manual", "Alavancas qualitativas, trade e Yes/No ainda dependem de validação manual, com apoio de KAM, GEO, rede, auditoria externa, imagem ou BI.", "Comercial / Dados / Auditoria / Trade", "Alto", { origin: PREWORK_STAGE_THREE_ORIGIN }),
    preworkItem("e3-d6", "Variação operacional entre KAMs", "Variação operacional entre KAMs, com uso completo do fluxo automatizado, uso combinado entre automático e manual, e uso direto do GPRO.", "Comercial / Operação / Governança", "Alto", { origin: PREWORK_STAGE_THREE_ORIGIN }),
    preworkItem("e3-d7", "Dificuldade de correção no GPRO", "Dificuldade de correção no GPRO quando a apuração vem do Bees, já que foram relatados valores que não fazem sentido e não podem ser corrigidos diretamente no GPRO.", "Produto / Tecnologia / GPRO / Bees Link", "Alto", { origin: PREWORK_STAGE_THREE_ORIGIN }),
    preworkItem("e3-d8", "Apuração reprovada não pode ser reenviada", "Apuração reprovada não pode ser reenviada, o que cria risco operacional quando há erro ou necessidade de ajuste após reprovação.", "GPRO / Governança / Operação", "Alto", { origin: PREWORK_STAGE_THREE_ORIGIN }),
  ],
  rules: [
    preworkItem("e3-r1", "Apuração pode seguir caminho manual ou automático", "A apuração pode seguir dois caminhos principais: manual, para acordos cadastrados via GPRO e tratados em planilha; automática, para acordos apurados via Bees Link, com envio posterior ao GPRO para geração de pagamento.", "Comercial / Dados / GPRO / Bees Link", "Alto", { origin: PREWORK_STAGE_THREE_ORIGIN }),
    preworkItem("e3-r2", "Apuração automática por tipo de alavanca", "A apuração automática é aplicável principalmente para alavancas de volume, faturamento e market share, usando dados de performance capturados pelo Bees e bases internas.", "Dados / DI / Comercial", "Alto", { origin: PREWORK_STAGE_THREE_ORIGIN }),
  ],
  needs: [
    preworkItem("e3-n1", "Critérios claros para tipo de apuração", "Definir critérios claros para quando a apuração deve ser automática, manual ou híbrida, evitando que cada KAM opere de um jeito.", "Produto / Dados / Comercial / Governança", "Alto", { origin: PREWORK_STAGE_THREE_ORIGIN }),
  ],
  openQuestions: [],
  hypotheses: [],
  offenders: [],
  plans: [],
  pending: [],
};

const stageFourPrework: Stage = {
  id: "etapa-4",
  name: "Aprovação de Acordos",
  order: 4,
  status: "aguardando",
  description: "Validar como os acordos são consolidados, ajustados e aprovados/reprovados no GPRO a partir das planilhas.",
  origin: PREWORK_STAGE_FOUR_ORIGIN,
  preworkVersion: PREWORK_STAGE_FOUR_VERSION,
  objective: "Validar o fluxo de aprovação de acordos, considerando a dependência de planilhas, os ajustes realizados entre KAM e PPM e a aprovação/reprovação no GPRO.",
  flow: [
    preworkItem("e4-f1", "Consolidação", "KAMs enviam para o PPM a planilha consolidada de acordos de cada rede para aprovação.", "KAM nacional, KAM regional", "Médio", { origin: PREWORK_STAGE_FOUR_ORIGIN, roles: ["KAM nacional", "KAM regional"], tools: ["Excel"], status: "em validação" }),
    preworkItem("e4-f2", "Ajuste", "Quando necessário o PPM solicita ajustes para o KAM realizar.", "KAM nacional, KAM regional", "Médio", { origin: PREWORK_STAGE_FOUR_ORIGIN, roles: ["KAM nacional", "KAM regional"], tools: ["Excel"], systems: ["GPRO"], status: "em validação" }),
    preworkItem("e4-f3", "Aprovação", "PPM aprova e/ou reprova os acordos no GPRO de acordo com as informações das planilhas.", "PPM AC", "Médio", { origin: PREWORK_STAGE_FOUR_ORIGIN, roles: ["PPM AC"], tools: ["Excel"], systems: ["GPRO"], status: "em validação" }),
  ],
  taxImpact: { answer: "Não avaliado", expectedImpact: "", obligation: "", existingPain: "", validator: "", dependency: "", status: "não avaliado" },
  kdd: {
    draft: "A aprovação de acordos deve ser padronizada, governada, rastreável e mensurável, com critérios claros para aprovar, ajustar, reprovar ou reenviar acordos, permitindo identificar padrões de erro e melhorar continuamente o processo.",
    final: "",
    suggestions: [],
    comments: [],
    status: "em validação",
  },
  kpis: { status: "", message: "Não informado no pré-work.", items: [] },
  pains: [
    preworkItem("e4-d1", "Aprovação depende de planilha consolidada", "Aprovação depende de planilha consolidada enviada pelo KAM ao PPM, o que mantém o processo fora de um fluxo único e rastreável.", "Não informado no pré-work", "Médio", { origin: PREWORK_STAGE_FOUR_ORIGIN, status: "em validação" }),
    preworkItem("e4-d2", "Ajustes podem acontecer na planilha ou no GPRO", "Ajustes podem acontecer tanto na planilha quanto no GPRO, criando risco de divergência entre o valor/condição aprovado e a informação registrada no sistema.", "Não informado no pré-work", "Médio", { origin: PREWORK_STAGE_FOUR_ORIGIN, status: "em validação" }),
    preworkItem("e4-d3", "Aprovação/reprovação depende de conferência manual", "O PPM aprova ou reprova no GPRO com base nas informações das planilhas, reforçando dependência de conferência manual e risco de inconsistência entre fontes.", "Não informado no pré-work", "Médio", { origin: PREWORK_STAGE_FOUR_ORIGIN, status: "em validação" }),
  ],
  rules: [],
  needs: [],
  openQuestions: [],
  hypotheses: [],
  offenders: [],
  plans: [],
  pending: [],
};

const stageFivePrework: Stage = {
  id: "etapa-5",
  name: "Assinatura de Acordos",
  order: 5,
  status: "aguardando",
  description: "Validar como os acordos aprovados são enviados para assinatura, assinados pelas partes e retornam ao GPRO para avançar para pagamento.",
  origin: PREWORK_STAGE_FIVE_ORIGIN,
  preworkVersion: PREWORK_STAGE_FIVE_VERSION,
  objective: "Validar o fluxo de assinatura de acordos, considerando envio automático para Docusing, envio aos assinantes, retorno do acordo assinado ao GPRO, papéis envolvidos, prazos, notificações e tratamento de exceções.",
  flow: [
    preworkItem("e5-f1", "Envio para Docusing", "GPRO envia automaticamente os acordos aprovados para a Docusing e o status muda para ‘Aguardando assinatura’.", "Não informado no pré-work", "Médio", { origin: PREWORK_STAGE_FIVE_ORIGIN, systems: ["GPRO", "Docusing"], status: "em validação" }),
    preworkItem("e5-f2", "Envio para assinatura", "Docusing envia e-mail com os acordos para todos os assinantes.", "Não informado no pré-work", "Médio", { origin: PREWORK_STAGE_FIVE_ORIGIN, tools: ["E-mail"], systems: ["Docusing"], status: "em validação" }),
    preworkItem("e5-f3", "Assinatura", "Após todas as partes assinarem a Docusing retorna o acordo assinado para o GPRO e o status muda para Aguardando pagamento.", "KAM nacional, KAM regional, Representante da Rede", "Médio", { origin: PREWORK_STAGE_FIVE_ORIGIN, roles: ["KAM nacional", "KAM regional", "Representante da Rede"], systems: ["Docusing", "GPRO"], status: "em validação" }),
  ],
  taxImpact: { answer: "Não avaliado", expectedImpact: "", obligation: "", existingPain: "", validator: "", dependency: "", status: "não avaliado" },
  kdd: {
    draft: "A assinatura de acordos deve estar estruturada e alinhada à ferramenta de assinatura, com papéis claros, status consistentes, prazos definidos, notificações adequadas e tratamento de exceções, garantindo rastreabilidade e fluidez até o avanço para pagamento.",
    final: "",
    suggestions: [],
    comments: [],
    status: "em validação",
  },
  kpis: { status: "", message: "Não informado no pré-work.", items: [] },
  pains: [],
  rules: [
    preworkItem("e5-r1", "Todos os representantes cadastrados no GPRO precisam assinar", "No GPRO todo mundo que está cadastrado como representante precisa assinar obrigatoriamente.", "GPRO", "Médio", { origin: PREWORK_STAGE_FIVE_ORIGIN, status: "em validação" }),
    preworkItem("e5-r2", "Cora permite diferenciar papéis de assinatura", "Na Cora isso já foi resolvido, tendo como cadastrar assinante Ambev, representante Ambev, parceiro, partes interessadas.", "Cora", "Médio", { origin: PREWORK_STAGE_FIVE_ORIGIN, status: "em validação" }),
  ],
  needs: [
    preworkItem("e5-n1", "Gestão de Assinaturas no GPRO", "Gestão de Assinaturas no GPRO.", "GPRO", "Médio", { origin: PREWORK_STAGE_FIVE_ORIGIN, status: "em validação" }),
    preworkItem("e5-n2", "Workflow de aprovação/assinatura com notificações automáticas na Cora", "Workflow de aprovação/assinatura com notificações automáticas na Cora.", "Cora", "Médio", { origin: PREWORK_STAGE_FIVE_ORIGIN, status: "em validação" }),
  ],
  openQuestions: [
    preworkItem("e5-q1", "Prazo máximo para assinatura", "Qual é o prazo máximo para assinar? O que acontece com o acordo se estourar o prazo?", "Não informado no pré-work", "Médio", { origin: PREWORK_STAGE_FIVE_ORIGIN, status: "em validação" }),
  ],
  hypotheses: [],
  offenders: [],
  plans: [],
  pending: [],
};

const stageSixPrework: Stage = {
  id: "etapa-6",
  name: "Pagamento de Acordos",
  order: 6,
  status: "aguardando",
  description: "Validar como ocorre a geração da ordem de pagamento, geração da verba, confirmação de pagamento e ajustes de verba.",
  origin: PREWORK_STAGE_SIX_ORIGIN,
  preworkVersion: PREWORK_STAGE_SIX_VERSION,
  objective: "Validar o processo de pagamento de acordos, considerando geração de CC/DG, geração de verba, integrações, confirmação de pagamento, ajustes de provisão, erros operacionais e rastreabilidade ponta a ponta.",
  flow: [
    preworkItem("e6-f1", "Geração ordem de pagamento", "GPRO gera CC/DG do acordo.", "Não informado no pré-work", "Médio", { origin: PREWORK_STAGE_SIX_ORIGIN, systems: ["GPRO"], status: "em validação" }),
    preworkItem("e6-f2", "Geração ordem de pagamento", "Geração dos itens dos CCs e rateio do valor entre eles com base no volume de venda dos produtos.", "Não informado no pré-work", "Médio", { origin: PREWORK_STAGE_SIX_ORIGIN, status: "em validação" }),
    preworkItem("e6-f3", "Geração da verba", "Geração dos itens dos CCs e rateio do valor entre eles com base no volume de venda dos produtos.", "PPM AC", "Médio", { origin: PREWORK_STAGE_SIX_ORIGIN, roles: ["PPM AC"], status: "em validação" }),
    preworkItem("e6-f4", "Confirmação de pagamento", "Baixar relatório de DGs/CCs no GPRO e comparar com pagamentos, confirmando que DGs/CCs emitidas foram efetivamente pagas.", "Não informado no pré-work", "Médio", { origin: PREWORK_STAGE_SIX_ORIGIN, systems: ["GPRO"], status: "em validação" }),
    preworkItem("e6-f5", "Ajustes de verba", "Ajustar provisões e planejar reforços conforme execução, reduzindo CR (contas a receber) e preparando próximos ciclos.", "Não informado no pré-work", "Médio", { origin: PREWORK_STAGE_SIX_ORIGIN, status: "em validação" }),
  ],
  taxImpact: { answer: "Não avaliado", expectedImpact: "", obligation: "", existingPain: "", validator: "", dependency: "", status: "não avaliado" },
  kdd: {
    draft: "O pagamento de acordos deve ser rastreável, monitorável e governado de ponta a ponta, com regras claras para geração de documentos, integração, liquidação, abatimento, conciliação, tratamento de erros e conclusão do processo.",
    final: "",
    suggestions: [],
    comments: [],
    status: "em validação",
  },
  kpis: { status: "", message: "Não informado no pré-work.", items: [] },
  pains: [
    preworkItem("e6-d1", "Erro na geração de verba, CC ou DG", "Erro na geração da verba, CC ou DG impede o avanço para pagamento.", "Não informado no pré-work", "Médio", { origin: PREWORK_STAGE_SIX_ORIGIN, status: "em validação" }),
    preworkItem("e6-d2", "DG/documento SAP não gerado apesar do GPRO aparentar estar correto", "O sistema pode indicar que todas as etapas foram concluídas, mas a DG/documento SAP não é gerado. Nesse cenário, o time só percebe o problema na hora de lançar para o CR do cliente, porque não existe verba gerada apesar de o GPRO aparentar estar correto.", "GPRO / SAP", "Médio", { origin: PREWORK_STAGE_SIX_ORIGIN, status: "em validação" }),
    preworkItem("e6-d3", "Divergência sobre consumo de verba quando DG não é gerada", "Há divergência sobre consumo de verba quando a DG não é gerada. Quando esse erro acontece, pode haver discussão com o PPM porque o pacote aparece como consumido, mas a verba não está disponível para seguir.", "PPM / Financeiro", "Médio", { origin: PREWORK_STAGE_SIX_ORIGIN, status: "em validação" }),
    preworkItem("e6-d4", "SLA de tratativa longo", "SLA de tratativa longo para uma etapa com janela curta.", "Não informado no pré-work", "Médio", { origin: PREWORK_STAGE_SIX_ORIGIN, status: "em validação" }),
    preworkItem("e6-d5", "Falta de travas em informações obrigatórias", "Falta de travas em informações obrigatórias. Exemplo: acordos sem número do contrato podem passar na provisão automática, indicando necessidade de validações mínimas antes da geração.", "GPRO / Governança", "Médio", { origin: PREWORK_STAGE_SIX_ORIGIN, status: "em validação" }),
    preworkItem("e6-d6", "Dificuldade em ajustar de-para de acordos antigos", "Dificuldade em ajustar de-para de acordos antigos, com erro ao salvar e necessidade de gestão por fora.", "Não informado no pré-work", "Médio", { origin: PREWORK_STAGE_SIX_ORIGIN, status: "em validação" }),
    preworkItem("e6-d7", "Relatórios pouco flexíveis no GPRO", "Relatórios pouco flexíveis no GPRO. Foi necessário criar um ‘robozinho’ porque o GPRO exige geração por mês e regional, sem permitir puxar períodos contínuos com vários meses e regionais.", "GPRO / Dados", "Médio", { origin: PREWORK_STAGE_SIX_ORIGIN, status: "em validação" }),
    preworkItem("e6-d8", "Falta de informações necessárias para análise financeira", "Falta de informações necessárias para análise e execução financeira.", "Financeiro", "Médio", { origin: PREWORK_STAGE_SIX_ORIGIN, status: "em validação" }),
    preworkItem("e6-d9", "Dispersão alta no processo de provisão/pagamento", "Dispersão alta no processo de provisão/pagamento. Foi citado um cenário de 30% de dispersão, com meta desejada abaixo de 5%.", "Financeiro", "Médio", { origin: PREWORK_STAGE_SIX_ORIGIN, status: "em validação" }),
    preworkItem("e6-d10", "Cadeia longa de sistemas e integrações", "O pagamento depende de uma cadeia longa de sistemas e integrações, passando por GPRO, VMV, SAP S4, SAP ECC, 2W, Portal SN e serviços legados, o que aumenta risco de falha e dificulta rastreabilidade ponta a ponta.", "GPRO / VMV / SAP S4 / SAP ECC / 2W / Portal SN / Serviços legados", "Médio", { origin: PREWORK_STAGE_SIX_ORIGIN, status: "em validação" }),
  ],
  rules: [],
  needs: [],
  openQuestions: [
    preworkItem("e6-q1", "DAG, CC e DG", "O que é DAG e o que é CC (Condition Contract) e DG? Qual é a diferença de cada uma delas? Quem gera esse código?", "Não informado no pré-work", "Médio", { origin: PREWORK_STAGE_SIX_ORIGIN, status: "em validação" }),
    preworkItem("e6-q2", "Acordos acima de X reais", "Quais são os processos para quando um acordo é acima de X reais? É necessário anexar alguma coisa?", "Não informado no pré-work", "Médio", { origin: PREWORK_STAGE_SIX_ORIGIN, status: "em validação" }),
    preworkItem("e6-q3", "Entrada do CSC no processo", "Em que etapas o time do CSC é incluído no processo?", "CSC", "Médio", { origin: PREWORK_STAGE_SIX_ORIGIN, status: "em validação" }),
  ],
  hypotheses: [],
  offenders: [],
  plans: [],
  pending: [],
};

function cleanPreworkStage(stage: Stage): Stage {
  const shouldKeepOpenQuestions = ["etapa-5", "etapa-6"].includes(stage.id);
  return {
    ...stage,
    status: "aguardando",
    taxImpact: blankTax(),
    kpis: stage.kpis.items.length ? stage.kpis : { status: "", message: "Não informado no pré-work.", items: [] },
    kpiItems: [],
    openQuestions: shouldKeepOpenQuestions ? stage.openQuestions : [],
    hypotheses: [],
    offenders: [],
    plans: [],
    pending: [],
  };
}

const seedStages: Stage[] = [
  cleanPreworkStage(stageOnePrework),
  cleanPreworkStage(stageTwoPrework),
  cleanPreworkStage(stageThreePrework),
  cleanPreworkStage(stageFourPrework),
  cleanPreworkStage(stageFivePrework),
  cleanPreworkStage(stageSixPrework),
];

function seedStageById(stageId: string) {
  return seedStages.find((stage) => stage.id === stageId);
}

const SUPABASE_SNAPSHOT_TABLE = "workshop_snapshots";
const SUPABASE_WORKSHOP_ID = "workshop-acordos-2026-h2";

function supabaseEnabled() {
  return Boolean(supabaseConfig());
}

function supabaseConfig() {
  const env = import.meta.env as Record<string, string | undefined>;
  const url = env.VITE_SUPABASE_URL;
  const key = env.VITE_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return { url: url.replace(/\/$/, ""), key, workshopId: env.VITE_SUPABASE_WORKSHOP_ID || SUPABASE_WORKSHOP_ID };
}

function supabaseHeaders(key: string, prefer?: string) {
  return {
    apikey: key,
    Authorization: `Bearer ${key}`,
    "Content-Type": "application/json",
    ...(prefer ? { Prefer: prefer } : {}),
  };
}

async function loadSupabaseState(): Promise<WorkshopState | null> {
  const config = supabaseConfig();
  if (!config) return null;
  try {
    const params = new URLSearchParams({ id: `eq.${config.workshopId}`, select: "state", limit: "1" });
    const response = await fetch(`${config.url}/rest/v1/${SUPABASE_SNAPSHOT_TABLE}?${params.toString()}`, { headers: supabaseHeaders(config.key) });
    if (!response.ok) return null;
    const rows = await response.json() as Array<{ state?: WorkshopState }>;
    return rows[0]?.state ?? null;
  } catch {
    return null;
  }
}

async function syncSupabase(state: WorkshopState) {
  const config = supabaseConfig();
  if (!config) return;
  try {
    await fetch(`${config.url}/rest/v1/${SUPABASE_SNAPSHOT_TABLE}?on_conflict=id`, {
      method: "POST",
      headers: supabaseHeaders(config.key, "resolution=merge-duplicates,return=minimal"),
      body: JSON.stringify([{ id: config.workshopId, state: { ...state, persistence: "supabase" }, updated_at: now() }]),
    });
  } catch {
    // Mantém o fallback local sem interromper a facilitação.
  }
}

function initialState(): WorkshopState {
  return {
    activeView: "room",
    activeStageId: "etapa-1",
    viewingStageId: "",
    activeActivity: "fluxo",
    viewingActivity: "",
    roundStatus: "aberta",
    roundMinutes: 15,
    highlightedItemId: "",
    currentParticipantId: "",
    participants: [],
    stages: seedStages,
    contributions: [],
    persistence: supabaseEnabled() ? "supabase" : "localStorage",
    datasetVersion: WORKSHOP_DATASET_VERSION,
  };
}

function withStageDefaults(stage: Stage): Stage {
  return {
    ...stage,
    kpis: stage.kpis ?? { status: "", message: "", items: [] },
    kpiItems: stage.kpiItems ?? [],
    openQuestions: stage.openQuestions ?? [],
    flow: stage.flow ?? [],
    pains: stage.pains ?? [],
    rules: stage.rules ?? [],
    needs: stage.needs ?? [],
    hypotheses: stage.hypotheses ?? [],
    offenders: stage.offenders ?? [],
    plans: stage.plans ?? [],
    pending: stage.pending ?? [],
  };
}

function hydrateWorkshopState(state: WorkshopState): WorkshopState {
  if (state.datasetVersion !== WORKSHOP_DATASET_VERSION) return initialState();
  const hasCurrentStageOnePrework = state.stages.some((stage) => stage.id === "etapa-1" && stage.preworkVersion === PREWORK_STAGE_ONE_VERSION);
  const hasCurrentStageTwoPrework = state.stages.some((stage) => stage.id === "etapa-2" && stage.preworkVersion === PREWORK_STAGE_TWO_VERSION);
  const hasCurrentStageThreePrework = state.stages.some((stage) => stage.id === "etapa-3" && stage.preworkVersion === PREWORK_STAGE_THREE_VERSION);
  const hasCurrentStageFourPrework = state.stages.some((stage) => stage.id === "etapa-4" && stage.preworkVersion === PREWORK_STAGE_FOUR_VERSION);
  const hasCurrentStageFivePrework = state.stages.some((stage) => stage.id === "etapa-5" && stage.preworkVersion === PREWORK_STAGE_FIVE_VERSION);
  const hasCurrentStageSixPrework = state.stages.some((stage) => stage.id === "etapa-6" && stage.preworkVersion === PREWORK_STAGE_SIX_VERSION);
  const stages = state.stages.map((stage) => {
    if (stage.id === "etapa-1" && !hasCurrentStageOnePrework) return seedStageById("etapa-1") ?? stage;
    if (stage.id === "etapa-2" && !hasCurrentStageTwoPrework) return seedStageById("etapa-2") ?? stage;
    if (stage.id === "etapa-3" && !hasCurrentStageThreePrework) return seedStageById("etapa-3") ?? stage;
    if (stage.id === "etapa-4" && !hasCurrentStageFourPrework) return seedStageById("etapa-4") ?? stage;
    if (stage.id === "etapa-5" && !hasCurrentStageFivePrework) return seedStageById("etapa-5") ?? stage;
    if (stage.id === "etapa-6" && !hasCurrentStageSixPrework) return seedStageById("etapa-6") ?? stage;
    return withStageDefaults(stage);
  });
  const hasStageOne = stages.some((stage) => stage.id === "etapa-1");
  const withStageOne = hasStageOne ? stages : [seedStageById("etapa-1") ?? stageOnePrework, ...stages];
  const hasStageTwo = withStageOne.some((stage) => stage.id === "etapa-2");
  const withStageTwo = hasStageTwo ? withStageOne : [withStageOne[0], seedStageById("etapa-2") ?? stageTwoPrework, ...withStageOne.slice(1)];
  const hasStageThree = withStageTwo.some((stage) => stage.id === "etapa-3");
  const withStageThree = hasStageThree ? withStageTwo : [withStageTwo[0], withStageTwo[1], seedStageById("etapa-3") ?? stageThreePrework, ...withStageTwo.slice(2)];
  const hasStageFour = withStageThree.some((stage) => stage.id === "etapa-4");
  const withStageFour = hasStageFour ? withStageThree : [withStageThree[0], withStageThree[1], withStageThree[2], seedStageById("etapa-4") ?? stageFourPrework, ...withStageThree.slice(3)];
  const hasStageFive = withStageFour.some((stage) => stage.id === "etapa-5");
  const withStageFive = hasStageFive ? withStageFour : [withStageFour[0], withStageFour[1], withStageFour[2], withStageFour[3], seedStageById("etapa-5") ?? stageFivePrework, ...withStageFour.slice(4)];
  const hasStageSix = withStageFive.some((stage) => stage.id === "etapa-6");
  const hydratedStages = hasStageSix ? withStageFive : [withStageFive[0], withStageFive[1], withStageFive[2], withStageFive[3], withStageFive[4], seedStageById("etapa-6") ?? stageSixPrework, ...withStageFive.slice(5)];
  const hasCurrentPrework = hasCurrentStageOnePrework && hasCurrentStageTwoPrework && hasCurrentStageThreePrework && hasCurrentStageFourPrework && hasCurrentStageFivePrework && hasCurrentStageSixPrework;

  return {
    ...state,
    activeStageId: hasCurrentPrework ? state.activeStageId : "etapa-1",
    viewingStageId: state.viewingStageId && hydratedStages.some((stage) => stage.id === state.viewingStageId) ? state.viewingStageId : "",
    activeActivity: hasCurrentPrework && validationActivities.includes(state.activeActivity) ? state.activeActivity : "fluxo",
    viewingActivity: state.viewingActivity && validationActivities.includes(state.viewingActivity) ? state.viewingActivity : "",
    stages: hydratedStages,
    persistence: supabaseEnabled() ? "supabase" : "localStorage",
    datasetVersion: WORKSHOP_DATASET_VERSION,
  };
}

function useWorkshopState() {
  const [state, setState] = useState<WorkshopState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? hydrateWorkshopState({ ...initialState(), ...JSON.parse(saved) }) : initialState();
    } catch {
      return initialState();
    }
  });
  const [supabaseHydrated, setSupabaseHydrated] = useState(!supabaseEnabled());
  useEffect(() => {
    if (!supabaseEnabled()) return;
    let cancelled = false;
    void loadSupabaseState().then((remoteState) => {
      if (cancelled) return;
      if (remoteState) setState(hydrateWorkshopState({ ...initialState(), ...remoteState, persistence: "supabase" }));
    }).finally(() => {
      if (!cancelled) setSupabaseHydrated(true);
    });
    return () => { cancelled = true; };
  }, []);
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    if (!supabaseEnabled() || !supabaseHydrated) return;
    const timeout = window.setTimeout(() => void syncSupabase(state), 650);
    return () => window.clearTimeout(timeout);
  }, [state, supabaseHydrated]);
  const updateStage = (stageId: string, fn: (stage: Stage) => Stage) => {
    setState((current) => ({ ...current, stages: current.stages.map((s) => (s.id === stageId ? normalizeStage(fn(s)) : s)) }));
  };
  return { state, setState, updateStage };
}

function normalizeStage(stage: Stage): Stage {
  const hasPending = stage.pending.length > 0 || stage.taxImpact.status.includes("pendência") || [...stage.pains, ...stage.rules, ...stage.needs, ...stage.flow, ...stage.openQuestions].some((i) => ["ajustar", "discordância", "dúvida"].includes(i.status));
  const flowReviewed = stage.flow.every((i) => i.status === "validado" || i.status === "pendência");
  const reviewed = flowReviewed && stage.taxImpact.status !== "não avaliado" && !["em revisão", "em validação"].includes(stage.kdd.status);
  return { ...stage, status: reviewed ? (hasPending ? "com pendências" : "validada") : hasPending ? "com ajustes" : stage.status };
}

function validationMissing(stage: Stage) {
  const flowReviewed = stage.flow.every((i) => i.status === "validado" || i.status === "pendência");
  const taxResolved = stage.taxImpact.status !== "não avaliado" || stage.pending.some((p) => p.includes("Reforma Tributária"));
  const hypothesesResolved = stage.hypotheses.length > 0 || stage.offenders.length > 0 || stage.pending.some((p) => p.includes("sem hipótese"));
  return [
    !flowReviewed && "Confirmar todos os blocos do fluxo ou marcar pendência.",
    !taxResolved && "Avaliar Reforma Tributária ou registrar pendência obrigatória.",
    ["em validação", "em revisão"].includes(stage.kdd.status) && "Validar ou ajustar o KDD preliminar.",
    !hypothesesResolved && "Criar hipóteses/ofensores ou marcar que não há hipótese no momento.",
  ].filter(Boolean) as string[];
}

function currentParticipant(state: WorkshopState) {
  return state.participants.find((p) => p.id === state.currentParticipantId);
}
function activeStage(state: WorkshopState) {
  return state.stages.find((s) => s.id === state.activeStageId) ?? state.stages[0];
}
function visibleStage(state: WorkshopState) {
  const participant = currentParticipant(state);
  if (participant?.status === "facilitador") return activeStage(state);
  return state.stages.find((s) => s.id === state.viewingStageId) ?? activeStage(state);
}
function visibleActivity(state: WorkshopState) {
  const participant = currentParticipant(state);
  if (participant?.status === "facilitador") return state.activeActivity;
  return state.viewingActivity || state.activeActivity;
}
function allItems(stage: Stage) {
  return [...stage.pains, ...stage.rules, ...stage.needs, ...(stage.kpiItems ?? []), ...stage.openQuestions];
}
function shortStageName(stage: Stage) {
  return stage.name.replace(" de Acordos", "").replace(" da verba", "");
}
function stageIndex(state: WorkshopState) {
  return Math.max(0, state.stages.findIndex((s) => s.id === state.activeStageId));
}
function activityIndex(activity: Activity) {
  const index = validationActivities.indexOf(activity);
  return index >= 0 ? index : 0;
}
function isActivityComplete(stage: Stage, activity: Activity) {
  if (activity === "fluxo") return stage.flow.every((i) => i.status === "validado" || i.status === "pendência");
  if (activity === "reforma") return stage.taxImpact.status !== "não avaliado" || stage.pending.some((p) => p.includes("Reforma Tributária"));
  if (activity === "kdd") return stage.kdd.status === "validado";
  if (activity === "dados") return allItems(stage).some((i) => i.status !== "em validação" && i.status !== "em revisão");
  if (activity === "hipoteses") return stage.hypotheses.length > 0 || stage.offenders.length > 0 || stage.pending.some((p) => p.includes("sem hipótese"));
  return false;
}
function hasActivityPending(stage: Stage, activity: Activity) {
  if (activity === "fluxo") return stage.flow.some((i) => ["pendência", "dúvida", "ajustar", "discordância"].includes(i.status));
  if (activity === "reforma") return stage.taxImpact.status === "não avaliado" || stage.pending.some((p) => p.includes("Reforma Tributária"));
  if (activity === "kdd") return stage.kdd.status !== "validado";
  if (activity === "dados") return allItems(stage).some((i) => ["em validação", "em revisão", "dúvida", "ajustar", "discordância"].includes(i.status));
  if (activity === "hipoteses") return !isActivityComplete(stage, activity);
  return false;
}
function activityStatus(stage: Stage, activity: Activity, activeActivity: Activity) {
  if (isActivityComplete(stage, activity)) return "Concluída";
  if (activity === activeActivity) return hasActivityPending(stage, activity) ? "Com pendência" : "Em andamento";
  if (hasActivityPending(stage, activity)) return "Com pendência";
  return "Pendente";
}
function stageProgress(stage: Stage) {
  return validationActivities.filter((activity) => isActivityComplete(stage, activity)).length;
}
function stageChecklist(stage: Stage) {
  return [
    { label: "Fluxo revisado", done: isActivityComplete(stage, "fluxo") },
    { label: "Reforma Tributária avaliada", done: isActivityComplete(stage, "reforma") },
    { label: "KDD validado", done: isActivityComplete(stage, "kdd") },
    { label: "Hipóteses/ofensores criados", done: isActivityComplete(stage, "hipoteses") },
  ];
}
function nextValidationActivity(activity: Activity) {
  const index = activityIndex(activity);
  return validationActivities[Math.min(index + 1, validationActivities.length - 1)];
}
function previousValidationActivity(activity: Activity) {
  const index = activityIndex(activity);
  return validationActivities[Math.max(index - 1, 0)];
}
function instruction(activity: Activity, stage: Stage) {
  const map: Record<Activity, string> = {
    fluxo: `Revise o fluxo da etapa ${stage.name}. Confirme se os passos fazem sentido, sugira ajustes ou marque dúvidas.`,
    reforma: "Informe se a Reforma Tributária impacta esta etapa e registre o que precisa ser validado.",
    kdd: "Revise o KDD preliminar. Sugira ajustes antes da validação.",
    dados: "Analise dores, regras e necessidades usadas como base. Valide, ajuste ou discorde.",
    hipoteses: "Crie hipóteses e ofensores a partir dos dados discutidos.",
    priorizacao: "Vote ou pontue hipóteses da etapa ativa usando os critérios combinados.",
    plano: "Construa planos de ação para hipóteses priorizadas.",
    resumo: "Acompanhe a consolidação final do que foi produzido por todos.",
  };
  return map[activity];
}
function expected(activity: Activity) {
  const map: Record<Activity, string> = {
    fluxo: "Comentar, validar ou sugerir ajuste",
    reforma: "Responder impacto fiscal/regulatório",
    kdd: "Revisar, editar e validar KDD",
    dados: "Validar, ajustar, discordar ou transformar em hipótese",
    hipoteses: "Criar hipótese ou ofensor",
    priorizacao: "Votar e pontuar critérios",
    plano: "Completar plano de ação",
    resumo: "Revisar consolidação",
  };
  return map[activity];
}
function priorityScore(h: Hypothesis) {
  return score[h.impactProcess] * 3 + score[h.financialRisk] * 2 + score[h.fiscalRisk] * 2 + score[h.painFrequency] * 2 + score[h.urgency] * 2 + score[h.clarity] - score[h.technicalDependency] - score[h.effort] + Object.values(h.votes ?? {}).reduce((a, b) => a + b, 0);
}
function planCompleteness(p: ActionPlan) {
  const fields = [
    p.action,
    p.experiment,
    p.scope,
    p.areas,
    p.dataNeeded,
    p.impactedSystem,
    p.owner,
    p.deadline,
    p.successMetric,
    p.invalidationCriteria,
    p.priorityMatrix,
    p.priorityReason,
    (p.actionRows ?? []).length ? "ações" : "",
    (p.riskItems ?? []).length ? "riscos" : "",
    (p.premiseItems ?? []).length ? "premissas" : "",
    (p.metricItems ?? []).length ? "métricas" : "",
  ];
  return Math.round((fields.filter(Boolean).length / fields.length) * 100);
}
function Badge({ children, tone }: { children: string; tone?: string }) {
  return <span className={`inline-flex min-h-7 items-center rounded-full px-3 py-1 text-xs font-bold ${tone ?? statusStyle[children] ?? "bg-[#EAEAEA] text-[#2D2A26]"}`}>{children}</span>;
}
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="grid gap-1 text-sm font-bold text-[#2D2A26]"><span>{label}</span>{children}</label>;
}
function inputClass(disabled?: boolean) {
  return `min-h-10 rounded-md border border-[#D8D8D8] bg-white px-3 py-2 text-sm font-normal text-[#2D2A26] outline-none transition focus:border-[#FFC629] focus:ring-2 focus:ring-[#FFC629]/20 ${disabled ? "cursor-not-allowed opacity-60" : ""}`;
}
function textareaClass(disabled?: boolean) {
  return `${inputClass(disabled)} min-h-24 resize-y`;
}
function PrimaryButton({ children, onClick, disabled }: { children: React.ReactNode; onClick: () => void; disabled?: boolean }) {
  return <button type="button" onClick={onClick} disabled={disabled} className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-[#FFC629] px-4 text-sm font-bold text-[#2D2A26] transition hover:bg-[#FFD65E] disabled:cursor-not-allowed disabled:opacity-50">{children}</button>;
}
function SecondaryButton({ children, onClick, disabled }: { children: React.ReactNode; onClick: () => void; disabled?: boolean }) {
  return <button type="button" onClick={onClick} disabled={disabled} className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-[#D8D8D8] bg-white px-4 text-sm font-bold text-[#2D2A26] transition hover:border-[#2D2A26] disabled:cursor-not-allowed disabled:opacity-50">{children}</button>;
}
function MiniButton({ children, onClick, active, disabled }: { children: React.ReactNode; onClick: () => void; active?: boolean; disabled?: boolean }) {
  return <button type="button" onClick={onClick} disabled={disabled} className={`inline-flex min-h-8 items-center justify-center gap-1 rounded-md px-3 py-1 text-xs font-bold transition disabled:cursor-not-allowed disabled:opacity-50 ${active ? "bg-[#2D2A26] text-white" : "border border-[#D8D8D8] bg-white text-[#2D2A26] hover:border-[#2D2A26]"}`}>{children}</button>;
}

type EntryDraft = { name: string; role: string; area: string; profile: "Participante" | "Facilitadora" };
const defaultEntryDraft: EntryDraft = { name: "", role: "", area: "Comercial", profile: "Participante" };
function participantMatchKey(data: Pick<Participant, "name" | "area" | "workshopRole">) {
  return [data.name, data.area, data.workshopRole].map((value) => value.trim().toLowerCase()).join("|");
}
function savedEntryDraft(): EntryDraft {
  try {
    const saved = localStorage.getItem(LAST_PARTICIPANT_KEY);
    if (!saved) return defaultEntryDraft;
    const parsed = JSON.parse(saved) as Partial<EntryDraft>;
    const profile = parsed.profile === "Facilitadora" ? "Facilitadora" : "Participante";
    return { ...defaultEntryDraft, ...parsed, profile, area: parsed.area && areas.includes(parsed.area) ? parsed.area : defaultEntryDraft.area };
  } catch {
    return defaultEntryDraft;
  }
}

function EntryScreen({ setState }: { setState: React.Dispatch<React.SetStateAction<WorkshopState>> }) {
  const [draft, setDraft] = useState<EntryDraft>(() => savedEntryDraft());
  const enter = () => {
    if (!draft.name.trim()) return;
    const cleanDraft: EntryDraft = { name: draft.name.trim(), role: draft.role.trim(), area: draft.area, profile: draft.profile };
    try {
      localStorage.setItem(LAST_PARTICIPANT_KEY, JSON.stringify(cleanDraft));
    } catch {
      // Se o navegador bloquear storage, o usuário ainda consegue entrar normalmente.
    }
    const participant: Participant = { id: id("participant"), name: cleanDraft.name, role: cleanDraft.role, area: cleanDraft.area, workshopRole: cleanDraft.profile, status: cleanDraft.profile === "Facilitadora" ? "facilitador" : "presente", createdAt: now() };
    setState((s) => {
      const matchKey = participantMatchKey(participant);
      const existing = s.participants.find((p) => participantMatchKey(p) === matchKey);
      if (existing) {
        return {
          ...s,
          currentParticipantId: existing.id,
          activeView: "room",
          participants: s.participants.map((p) => (p.id === existing.id ? { ...p, role: participant.role, status: participant.status } : p)),
        };
      }
      return { ...s, currentParticipantId: participant.id, activeView: "room", participants: [participant, ...s.participants] };
    });
  };
  return (
    <main className="min-h-screen bg-[#F6F6F4] p-5 text-[#2D2A26]">
      <section className="mx-auto grid min-h-[calc(100vh-40px)] max-w-[1120px] items-center gap-6 lg:grid-cols-[1fr_440px]">
        <div>
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#D8D8D8] bg-white px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] text-[#756F68]"><Layers3 size={14} />Sala de Trabalho do Workshop</div>
          <h1 className="max-w-3xl text-5xl font-bold leading-tight">Workshop de Acordos</h1>
          <p className="mt-4 max-w-2xl text-lg leading-8 text-[#5B5650]">Entre na sala colaborativa para revisar etapas, contribuir, votar, validar decisões e construir planos de ação com o grupo.</p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2"><Metric value="6" label="etapas" /><Metric value="colaborativo" label="uso simultâneo" /></div>
        </div>
        <div className="rounded-lg border border-[#D8D8D8] bg-white p-5 shadow-sm">
          <h2 className="text-2xl font-bold">Entrar na sala</h2>
          <div className="mt-5 grid gap-3">
            <Field label="Nome"><input className={inputClass()} value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} /></Field>
            <Field label="Cargo"><input className={inputClass()} value={draft.role} onChange={(e) => setDraft({ ...draft, role: e.target.value })} placeholder="Ex.: KAM" /></Field>
            <Field label="Área"><select className={inputClass()} value={draft.area} onChange={(e) => setDraft({ ...draft, area: e.target.value })}>{areas.map((a) => <option key={a}>{a}</option>)}</select></Field>
            <Field label="Perfil de acesso"><select className={inputClass()} value={draft.profile} onChange={(e) => setDraft({ ...draft, profile: e.target.value as "Participante" | "Facilitadora" })}><option>Participante</option><option>Facilitadora</option></select></Field>
            <PrimaryButton disabled={!draft.name.trim()} onClick={enter}><Send size={17} />Entrar na sala</PrimaryButton>
            <p className="text-xs font-bold text-[#756F68]">Dados lembrados neste navegador para o próximo acesso.</p>
          </div>
        </div>
      </section>
    </main>
  );
}

function workshopStartedKey(participantId: string) {
  return `${STORAGE_KEY}:started:${participantId}`;
}

function WorkshopOpening({ state, setState, onStart }: { state: WorkshopState; setState: React.Dispatch<React.SetStateAction<WorkshopState>>; onStart: () => void }) {
  const openModal = useActionModal();
  const participant = currentParticipant(state);
  const agenda = [
    { day: "Dia 1", title: "Alinhamento e validação inicial", items: ["Boas-vindas", "Apresentação dos participantes", "Validação dos fluxos", "Reforma Tributária", "Validação dos KDDs"] },
    { day: "Dia 2", title: "Hipóteses e priorização", items: ["Continuação da validação das etapas", "Criação de hipóteses", "Identificação de ofensores", "Priorização por etapa"] },
    { day: "Dia 3", title: "Planos de ação", items: ["Construção dos planos", "Riscos e premissas", "Métricas", "Critérios de invalidação", "Consolidação final"] },
  ];
  const outcomes = ["KDDs validados", "hipóteses priorizadas", "ofensores identificados", "planos de ação estruturados", "próximos passos definidos"];
  const showDynamics = () => openModal({
    title: "Resumo da dinâmica",
    message: "Cada etapa será revisada em sequência. Participantes contribuem com dores, dúvidas, hipóteses e ofensores. A facilitadora conduz a validação, consolida decisões e avança a jornada do workshop.",
    confirmLabel: "Entendi",
    onSubmit: () => undefined,
  });
  return (
    <main className="min-h-screen bg-[#F6F6F4] p-5 text-[#2D2A26]">
      <section className="mx-auto flex min-h-[calc(100vh-40px)] max-w-[1240px] flex-col justify-center gap-6">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="grid h-12 w-12 place-items-center rounded-lg bg-[#2D2A26] text-[#FFC629] shadow-sm"><Layers3 size={28} /></span>
            <div>
              <h1 className="text-3xl font-bold leading-tight">Workshop de Acordos</h1>
              <p className="mt-1 text-sm font-bold uppercase tracking-[0.16em] text-[#756F68]">Validação de processo, KDDs, hipóteses e planos de ação</p>
            </div>
          </div>
          <button type="button" onClick={() => setState((s) => ({ ...s, currentParticipantId: "" }))} className="inline-flex h-10 items-center rounded-md border border-[#D8D8D8] bg-white px-4 text-sm font-bold text-[#2D2A26] hover:border-[#2D2A26]">Sair</button>
        </header>

        <section className="grid gap-6 rounded-xl border border-[#D8D8D8] bg-white p-6 shadow-sm lg:grid-cols-[1.05fr_0.95fr]">
          <div className="flex flex-col justify-between gap-6">
            <div>
              <Badge tone="bg-[#FFF4CC] text-[#6F5400]">{participant?.status === "facilitador" ? "Facilitadora" : "Participante"}</Badge>
              <h2 className="mt-5 max-w-3xl text-5xl font-bold leading-tight">Bem-vinda à sala de trabalho da semana</h2>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-[#5B5650]">Vamos revisar o processo de Acordos ponta a ponta, validar decisões importantes, identificar impactos da Reforma Tributária, criar hipóteses e construir planos de ação.</p>
            </div>
            <div className="grid gap-3 rounded-lg bg-[#FFF9E3] p-4 sm:grid-cols-5">
              {outcomes.map((outcome) => <div key={outcome} className="rounded-md bg-white px-3 py-3 text-sm font-bold leading-5 shadow-sm">{outcome}</div>)}
            </div>
            <div className="flex flex-wrap gap-3">
              <button type="button" onClick={onStart} className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-[#FFC629] px-6 text-base font-bold text-[#2D2A26] shadow-sm transition hover:bg-[#FFD65E]"><CheckCircle2 size={20} />Começar</button>
              <button type="button" onClick={showDynamics} className="inline-flex h-12 items-center justify-center rounded-md border border-[#D8D8D8] bg-white px-5 text-base font-bold text-[#2D2A26] transition hover:border-[#2D2A26]">Ver resumo da dinâmica</button>
            </div>
          </div>

          <div className="grid gap-3">
            {agenda.map((day, index) => (
              <article key={day.day} className="rounded-lg border border-[#D8D8D8] bg-[#FAFAF9] p-4">
                <div className="flex items-start gap-3">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#2D2A26] text-sm font-bold text-[#FFC629]">{index + 1}</span>
                  <div>
                    <h3 className="text-lg font-bold">{day.day} · {day.title}</h3>
                    <div className="mt-3 flex flex-wrap gap-2">{day.items.map((itemValue) => <span key={itemValue} className="rounded-full bg-white px-3 py-1.5 text-xs font-bold text-[#54504A] shadow-sm">{itemValue}</span>)}</div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}

function AppShell({ state, setState, children }: { state: WorkshopState; setState: React.Dispatch<React.SetStateAction<WorkshopState>>; children: React.ReactNode }) {
  const p = currentParticipant(state)!;
  const stage = activeStage(state);
  const currentStagePosition = stageIndex(state) + 1;
  const currentActivityPosition = activityIndex(state.activeActivity) + 1;
  const validatedStages = state.stages.filter((s) => s.status === "validada" || s.status === "com pendências").length;
  const nav: { key: View; label: string }[] = [
    { key: "room", label: "Sala do Workshop" },
    { key: "stages", label: "Etapas" },
    { key: "hypotheses", label: "Hipóteses" },
    { key: "prioritization", label: "Priorização" },
    { key: "plans", label: "Planos de ação" },
    { key: "summary", label: "Resumo" },
  ];
  return (
    <div className="min-h-screen bg-[#F6F6F4] text-[#2D2A26]">
      <header className="sticky top-0 z-40 border-b border-[#D8D8D8] bg-white/95 backdrop-blur">
        <div className="mx-auto flex min-h-12 max-w-[1480px] flex-wrap items-center justify-between gap-2 px-4 py-1.5">
          <div className="flex items-center gap-2.5"><span className="grid h-8 w-8 place-items-center rounded-md bg-[#2D2A26] text-[#FFC629]"><Layers3 size={18} /></span><div><span className="block text-sm font-bold leading-tight">Workshop de Acordos</span><span className="block text-[10px] font-bold uppercase tracking-[0.1em] text-[#756F68]">{p.name} · {p.area} · {p.status === "facilitador" ? "Facilitadora" : "Participante"}</span></div></div>
          <div className="flex flex-wrap items-center gap-2"><Badge tone="bg-[#EAEAEA] text-[#2D2A26]">Validação</Badge><Badge>{`${currentStagePosition}/6 ${stage.name}`}</Badge><Badge tone="bg-[#FFF4CC] text-[#6F5400]">{`${currentActivityPosition}/${validationActivities.length} ${activityShortLabels[state.activeActivity] ?? activityLabels[state.activeActivity]}`}</Badge><Badge tone="bg-[#E1F5E8] text-[#146B35]">{`${validatedStages}/6`}</Badge><SecondaryButton onClick={() => setState((s) => ({ ...s, currentParticipantId: "", activeView: "room" }))}>Sair</SecondaryButton></div>
        </div>
      </header>
      <nav className="border-b border-[#D8D8D8] bg-white"><div className="mx-auto flex max-w-[1480px] gap-2 overflow-x-auto px-4 py-1.5">{nav.map((n) => <MiniButton key={n.key} active={state.activeView === n.key} onClick={() => setState((s) => ({ ...s, activeView: n.key }))}>{n.label}</MiniButton>)}{p.status === "facilitador" && <MiniButton active={state.activeView === "facilitation"} onClick={() => setState((s) => ({ ...s, activeView: "facilitation" }))}><Settings2 size={14} />Facilitação</MiniButton>}</div></nav>
      <main className="mx-auto max-w-[1480px] px-3 py-3">{children}</main>
    </div>
  );
}

function Metric({ value, label }: { value: string; label: string }) {
  return <div className="rounded-lg border border-[#D8D8D8] bg-white p-4 shadow-sm"><div className="text-xl font-bold">{value}</div><div className="mt-1 text-xs font-bold uppercase tracking-[0.12em] text-[#756F68]">{label}</div></div>;
}
function SectionTitle({ title, subtitle }: { title: string; subtitle: string }) {
  return <div><h2 className="text-xl font-bold">{title}</h2><p className="mt-1 text-sm leading-6 text-[#5B5650]">{subtitle}</p></div>;
}
function EmptyState({ text }: { text: string }) {
  return <div className="rounded-lg border border-dashed border-[#CFCFCF] bg-white p-8 text-center text-sm font-semibold text-[#756F68]">{text}</div>;
}
function NowPanel({ state }: { state: WorkshopState }) {
  const stage = visibleStage(state);
  const activity = visibleActivity(state);
  return <section className="rounded-lg border border-[#D8D8D8] bg-[#FFF9E3] px-3 py-2 shadow-sm"><div className="flex flex-wrap items-center justify-between gap-2"><div className="flex min-w-0 flex-wrap items-center gap-2"><span className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#756F68]">Agora</span><h1 className="text-xl font-bold leading-tight">{activityLabels[activity]}</h1><Badge tone="bg-white text-[#54504A]">{stage.name}</Badge></div><div className="flex flex-wrap items-center gap-2"><Badge>{state.roundStatus}</Badge><span className="inline-flex h-7 items-center gap-1.5 rounded-full bg-white px-2.5 text-xs font-bold text-[#6F5400]"><Timer size={14} />{state.roundMinutes} min</span><Badge tone="bg-white text-[#2D2A26]">Ação: {expected(activity)}</Badge></div></div></section>;
}

function ValidationNavigator({ state, setState, updateStage }: { state: WorkshopState; setState: React.Dispatch<React.SetStateAction<WorkshopState>>; updateStage: (stageId: string, fn: (stage: Stage) => Stage) => void }) {
  const participant = currentParticipant(state);
  const canControl = participant?.status === "facilitador";
  const officialStage = activeStage(state);
  const stage = canControl ? officialStage : visibleStage(state);
  const activity = canControl ? state.activeActivity : visibleActivity(state);
  const currentStageIndex = Math.max(0, state.stages.findIndex((s) => s.id === stage.id));
  const nextStage = state.stages[currentStageIndex + 1];
  const done = stageProgress(stage);

  const goActivity = (next: Activity) => setState((s) => canControl ? ({ ...s, activeActivity: next, activeView: "room" }) : ({ ...s, viewingActivity: next, activeView: "room" }));
  const goStage = (stageId: string) => setState((s) => canControl ? ({ ...s, activeStageId: stageId, viewingStageId: "", viewingActivity: "", activeActivity: "fluxo", activeView: "room" }) : ({ ...s, viewingStageId: stageId, viewingActivity: "fluxo", activeView: "room" }));
  const finishStage = () => {
    const pending = validationMissing(stage);
    updateStage(stage.id, (s) => ({ ...s, status: pending.length ? "com pendências" : "validada" }));
    if (nextStage) setState((s) => ({ ...s, activeStageId: nextStage.id, activeActivity: "fluxo", activeView: "room" }));
  };

  return (
    <section className="grid gap-2 rounded-lg border border-[#D8D8D8] bg-white px-3 py-2 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2"><span className="text-sm font-bold">Etapas</span><Badge tone="bg-[#F6F6F4] text-[#54504A]">{done}/{validationActivities.length} atividades</Badge></div>
        {!canControl && <SecondaryButton onClick={() => setState((s) => ({ ...s, activeView: "stages" }))}>Ver etapas</SecondaryButton>}
      </div>
      <div className="overflow-x-auto">
        <div className="flex min-w-[860px] border-b border-[#EAEAEA]">
          {state.stages.map((s, index) => <button key={s.id} type="button" onClick={() => goStage(s.id)} className={`flex min-h-9 flex-1 items-center justify-center gap-2 border-b-2 px-2 text-sm transition ${s.id === stage.id ? "border-[#2D2A26] bg-[#FFF9E3] font-bold" : s.id === officialStage.id ? "border-[#FFC629] bg-[#FFFDF2]" : s.status === "validada" ? "border-transparent text-[#146B35]" : s.status === "com ajustes" || s.status === "com pendências" ? "border-transparent text-[#9A6B00]" : "border-transparent text-[#756F68]"}`}><span className="grid h-5 w-5 place-items-center rounded-full bg-[#2D2A26] text-[10px] font-bold text-[#FFC629]">{index + 1}</span><span className="truncate">{shortStageName(s)}</span>{s.id === officialStage.id && <span className="rounded-full bg-[#FFF4CC] px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-[0.06em] text-[#6F5400]">ativa</span>}<span className="text-[10px] font-semibold uppercase tracking-[0.08em]">{s.status === "aguardando" ? "aguard." : s.status.replace("com ", "")}</span></button>)}
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex min-w-0 flex-1 overflow-x-auto">
          <div className="flex min-w-[620px] gap-1">{validationActivities.map((item, index) => <button key={item} type="button" onClick={() => goActivity(item)} className={`h-8 flex-1 rounded-md px-2 text-xs font-bold ${item === activity ? "bg-[#2D2A26] text-white" : item === state.activeActivity ? "bg-[#FFF4CC] text-[#6F5400]" : "bg-[#F6F6F4] text-[#54504A]"}`}><span className="mr-1 text-[10px] opacity-70">{index + 1}</span>{activityShortLabels[item]}</button>)}</div>
        </div>
        {canControl && <div className="flex flex-wrap gap-1.5"><PrimaryButton onClick={finishStage}>Concluir etapa</PrimaryButton></div>}
      </div>
    </section>
  );
}

function addContribution(setState: React.Dispatch<React.SetStateAction<WorkshopState>>, state: WorkshopState, partial: Omit<Contribution, "id" | "authorId" | "author" | "area" | "createdAt" | "stageId" | "activity" | "status"> & { status?: ContributionStatus }) {
  const p = currentParticipant(state);
  if (!p) return;
  const c: Contribution = { id: id("contribution"), authorId: p.id, author: p.name, authorRole: p.role, authorProfile: p.status === "facilitador" ? "Facilitadora" : "Participante", area: p.area, createdAt: now(), stageId: visibleStage(state).id, activity: visibleActivity(state), status: partial.status ?? "nova", ...partial };
  setState((s) => ({ ...s, contributions: [c, ...s.contributions] }));
}
function defaultType(activity: Activity): ContributionType {
  if (activity === "fluxo") return "ajuste de fluxo";
  if (activity === "reforma") return "impacto de Reforma Tributária";
  if (activity === "kdd") return "sugestão de KDD";
  if (activity === "hipoteses") return "hipótese";
  if (activity === "priorizacao") return "voto";
  return "comentário";
}
function Composer({ state, setState }: { state: WorkshopState; setState: React.Dispatch<React.SetStateAction<WorkshopState>> }) {
  const [draft, setDraft] = useState({ type: defaultType(state.activeActivity), content: "", impact: "Médio" as Level });
  useEffect(() => setDraft((d) => ({ ...d, type: defaultType(state.activeActivity) })), [state.activeActivity]);
  return <section className="rounded-lg border border-[#D8D8D8] bg-white p-4 shadow-sm"><h3 className="flex items-center gap-2 text-lg font-bold"><MessageSquarePlus size={18} />Adicionar contribuição</h3><div className="mt-3 grid gap-3"><Field label="Tipo"><select className={inputClass(state.roundStatus === "encerrada")} value={draft.type} disabled={state.roundStatus === "encerrada"} onChange={(e) => setDraft({ ...draft, type: e.target.value as ContributionType })}>{contributionTypes.map((t) => <option key={t}>{t}</option>)}</select></Field><Field label="Contribuição"><textarea className={textareaClass(state.roundStatus === "encerrada")} value={draft.content} disabled={state.roundStatus === "encerrada"} onChange={(e) => setDraft({ ...draft, content: e.target.value })} /></Field><Field label="Impacto"><select className={inputClass(state.roundStatus === "encerrada")} value={draft.impact} disabled={state.roundStatus === "encerrada"} onChange={(e) => setDraft({ ...draft, impact: e.target.value as Level })}>{levels.map((l) => <option key={l}>{l}</option>)}</select></Field><PrimaryButton disabled={!draft.content.trim() || state.roundStatus === "encerrada"} onClick={() => { addContribution(setState, state, { type: draft.type, content: draft.content, impact: draft.impact }); setDraft({ ...draft, content: "" }); }}><Send size={17} />Enviar contribuição</PrimaryButton></div></section>;
}
function Feed({ state, compact }: { state: WorkshopState; compact?: boolean }) {
  const stage = visibleStage(state);
  const list = state.contributions.filter((c) => !compact || c.stageId === stage.id).slice(0, compact ? 6 : 80);
  return <section className="rounded-lg border border-[#D8D8D8] bg-white p-3 shadow-sm"><SectionTitle title="Contribuições da sala" subtitle={compact ? "Últimos registros da etapa." : "Registros da sala."} /><div className="mt-3 grid gap-2">{list.map((c) => <article key={c.id} className="rounded-lg bg-[#F6F6F4] p-3"><div className="flex flex-wrap gap-2"><Badge>{c.type}</Badge><Badge>{c.status}</Badge><Badge tone="bg-white text-[#54504A]">{c.area}</Badge><Badge tone="bg-white text-[#54504A]">{c.authorProfile}</Badge></div><p className="mt-2 text-sm font-semibold leading-5">{c.content}</p><p className="mt-1 text-xs text-[#756F68]">{c.author} · {c.authorRole || "cargo não informado"} · {new Date(c.createdAt).toLocaleString("pt-BR")}</p></article>)}{!list.length && <EmptyState text="Nenhuma contribuição registrada ainda." />}</div></section>;
}

function ContextualContributionPanel({ state, setState, stage, updateStage }: { state: WorkshopState; setState: React.Dispatch<React.SetStateAction<WorkshopState>>; stage: Stage; updateStage: (stageId: string, fn: (stage: Stage) => Stage) => void }) {
  const openModal = useActionModal();
  const p = currentParticipant(state);
  if (!p) return null;
  const activity = visibleActivity(state);
  const canAddPain = ["fluxo", "hipoteses"].includes(activity);
  const canAddHypothesis = activity === "hipoteses";
  const canAddOffender = activity === "hipoteses";
  const addPain = () => openModal({ title: "Adicionar dor", confirmLabel: "Adicionar", fields: [{ id: "text", label: "Texto da dor", multiline: true, required: true }], onSubmit: ({ text }) => addContribution(setState, state, { type: "dor", content: text, impact: "Médio" }) });
  const addHypothesis = () => openModal({ title: "Criar hipótese", message: "Use o formato: Se [ação], então [resultado], porque [evidência].", confirmLabel: "Criar", fields: [{ id: "text", label: "Hipótese", multiline: true, required: true }], onSubmit: ({ text }) => addContribution(setState, state, { type: "hipótese", content: text, impact: "Médio" }) });
  const addOffender = () => openModal({ title: "Adicionar ofensor", confirmLabel: "Adicionar", fields: [{ id: "text", label: "Ofensor identificado", multiline: true, required: true }], onSubmit: ({ text }) => { const offender: Offender = { id: id("offender"), stageId: stage.id, hypothesisId: "", type: "Processo", content: text, cause: "Causa provável registrada por participante", impact: "Médio", responsibleArea: p.area, status: "Sugerido", origin: "Workshop" }; updateStage(stage.id, (s) => ({ ...s, offenders: [offender, ...s.offenders] })); addContribution(setState, state, { type: "ofensor", content: text, impact: "Médio" }); } });
  return <section className="rounded-lg border border-[#D8D8D8] bg-white p-3 shadow-sm"><SectionTitle title="Ações contextuais" subtitle={p.status === "facilitador" ? "Insumos rápidos da etapa." : "Registre insumos da discussão."} /><div className="mt-3 flex flex-wrap gap-2">{canAddPain && <SecondaryButton onClick={addPain}>Adicionar dor</SecondaryButton>}{canAddHypothesis && <SecondaryButton onClick={addHypothesis}><FlaskConical size={17} />Criar hipótese</SecondaryButton>}{canAddOffender && <SecondaryButton onClick={addOffender}>Adicionar ofensor</SecondaryButton>}{!canAddPain && !canAddHypothesis && !canAddOffender && <Badge tone="bg-[#F6F6F4] text-[#54504A]">Sem ação contextual</Badge>}</div></section>;
}

function Room({ state, setState, updateStage }: { state: WorkshopState; setState: React.Dispatch<React.SetStateAction<WorkshopState>>; updateStage: (stageId: string, fn: (stage: Stage) => Stage) => void }) {
  const officialStage = activeStage(state);
  const stage = visibleStage(state);
  const activity = visibleActivity(state);
  const participant = currentParticipant(state);
  const isConsulting = participant?.status !== "facilitador" && (stage.id !== officialStage.id || activity !== state.activeActivity);
  const focusFlow = activity === "fluxo";
  const focusMain = focusFlow || activity === "reforma" || activity === "kdd" || activity === "hipoteses";
  return <div className="grid min-w-0 gap-2.5"><NowPanel state={state} /><ValidationNavigator state={state} setState={setState} updateStage={updateStage} />{isConsulting && <div className="rounded-md border border-[#D8D8D8] bg-white px-3 py-2 text-xs font-semibold text-[#5B5650]">Você está visualizando {stage.name} / {activityLabels[activity]}. A etapa ativa do workshop é {officialStage.name} / {activityLabels[state.activeActivity]}.</div>}<div className={`grid min-w-0 gap-3 ${focusMain ? "" : "xl:grid-cols-[minmax(0,1fr)_360px]"}`}><section className={`min-w-0 overflow-hidden rounded-lg border border-[#D8D8D8] bg-white shadow-sm ${focusMain ? "p-3" : "p-5"}`}><WorkContent activity={activity} state={state} setState={setState} stage={stage} updateStage={updateStage} /></section>{!focusMain && <aside className="grid h-fit min-w-0 gap-4"><ContextualContributionPanel state={state} setState={setState} stage={stage} updateStage={updateStage} /><Feed state={state} compact /></aside>}</div></div>;
}
function WorkContent({ activity, state, setState, stage, updateStage }: { activity: Activity; state: WorkshopState; setState: React.Dispatch<React.SetStateAction<WorkshopState>>; stage: Stage; updateStage: (stageId: string, fn: (stage: Stage) => Stage) => void }) {
  if (activity === "fluxo") return <FlowWork state={state} setState={setState} stage={stage} updateStage={updateStage} />;
  if (activity === "reforma") return <TaxWork state={state} setState={setState} stage={stage} updateStage={updateStage} />;
  if (activity === "kdd") return <KddWork state={state} setState={setState} stage={stage} updateStage={updateStage} />;
  if (activity === "hipoteses") return <HypothesisWork state={state} setState={setState} stage={stage} updateStage={updateStage} />;
  if (activity === "priorizacao") return <Prioritization state={state} updateStage={updateStage} />;
  if (activity === "plano") return <Plans state={state} updateStage={updateStage} />;
  return <Feed state={state} />;
}
type WorkItemGroup = "flow" | "pains" | "rules" | "needs" | "openQuestions";

function patchWorkItem(updateStage: (stageId: string, fn: (stage: Stage) => Stage) => void, stage: Stage, group: WorkItemGroup, itemId: string, patchItem: Partial<WorkItem>) {
  updateStage(stage.id, (s) => ({ ...s, [group]: s[group].map((i) => i.id === itemId ? { ...i, ...patchItem } : i) }));
}

function transformWorkItemToHypothesis(state: WorkshopState, setState: React.Dispatch<React.SetStateAction<WorkshopState>>, stage: Stage, updateStage: (stageId: string, fn: (stage: Stage) => Stage) => void, group: WorkItemGroup, work: WorkItem) {
  const h = hypothesis(stage.id, work.id, work.text, work.area);
  updateStage(stage.id, (s) => ({ ...s, [group]: s[group].map((i) => i.id === work.id ? { ...i, status: "transformado em hipótese" } : i), hypotheses: [h, ...s.hypotheses] }));
  addContribution(setState, state, { type: "hipótese", content: h.text, relatedItemId: work.id });
}

function WorkItemControls({
  state,
  setState,
  stage,
  updateStage,
  group,
  work,
  contributionType,
}: {
  state: WorkshopState;
  setState: React.Dispatch<React.SetStateAction<WorkshopState>>;
  stage: Stage;
  updateStage: (stageId: string, fn: (stage: Stage) => Stage) => void;
  group: WorkItemGroup;
  work: WorkItem;
  contributionType: ContributionType;
}) {
  const openModal = useActionModal();
  const comment = () => {
    openModal({ title: "Adicionar comentário", confirmLabel: "Adicionar", fields: [{ id: "text", label: "Comentário", multiline: true, required: true }], onSubmit: ({ text }) => { patchWorkItem(updateStage, stage, group, work.id, { comments: [text, ...work.comments] }); addContribution(setState, state, { type: "comentário", content: text, relatedItemId: work.id }); } });
  };
  const adjust = () => {
    openModal({ title: "Sugerir ajuste", confirmLabel: "Salvar ajuste", fields: [{ id: "text", label: "Ajuste sugerido", multiline: true, required: true }], onSubmit: ({ text }) => { addContribution(setState, state, { type: contributionType, content: text, relatedItemId: work.id }); patchWorkItem(updateStage, stage, group, work.id, { status: "ajustar" }); } });
  };
  const editItem = () => {
    openModal({
      title: "Editar item",
      confirmLabel: "Salvar",
      fields: [
        { id: "title", label: "Título", value: work.title ?? "" },
        { id: "text", label: "Texto", value: work.text, multiline: true, required: true },
        { id: "area", label: "Área relacionada", value: work.area },
      ],
      onSubmit: ({ title, text, area }) => {
        patchWorkItem(updateStage, stage, group, work.id, { title: title.trim() || undefined, text: text.trim(), area: area.trim() || work.area, status: "em revisão" });
        addContribution(setState, state, { type: contributionType, content: `Item editado: ${text.trim()}`, relatedItemId: work.id, impact: work.impact });
      },
    });
  };

  return (
    <div className="mt-3 flex flex-wrap gap-2">
      <MiniButton onClick={() => patchWorkItem(updateStage, stage, group, work.id, { status: "validado" })}><Check size={13} />Validar</MiniButton>
      <MiniButton onClick={editItem}>Editar item</MiniButton>
      <MiniButton onClick={adjust}>Ajustar</MiniButton>
      <MiniButton onClick={() => patchWorkItem(updateStage, stage, group, work.id, { status: "discordância" })}>Discordar</MiniButton>
      <MiniButton onClick={comment}>Comentar</MiniButton>
      <MiniButton onClick={() => patchWorkItem(updateStage, stage, group, work.id, { status: "dúvida" })}>Dúvida</MiniButton>
      <MiniButton onClick={() => transformWorkItemToHypothesis(state, setState, stage, updateStage, group, work)}><FlaskConical size={13} />Hipótese</MiniButton>
      <MiniButton onClick={() => createOffender(stage, work, updateStage, setState, state)}>Ofensor</MiniButton>
    </div>
  );
}

function asList(value?: string | string[]) {
  if (!value) return [];
  return Array.isArray(value) ? value : value.split(",").map((item) => item.trim()).filter(Boolean);
}

function ToolIcon({ label }: { label: string }) {
  const lower = label.toLowerCase();
  if (lower.includes("outlook")) return <Mail size={16} />;
  if (lower.includes("excel")) return <FileSpreadsheet size={16} />;
  return <Database size={16} />;
}

function InfoPanel({ title, items, empty, icon }: { title: string; items: string[]; empty: string; icon: "role" | "tool" | "system" | "comment" | "doubt" | "dependency" }) {
  const Icon = icon === "role" ? UserCircle : icon === "tool" ? FileSpreadsheet : icon === "system" ? Database : icon === "doubt" ? HelpCircle : icon === "dependency" ? AlertTriangle : MessageSquarePlus;
  return (
    <div className="rounded-lg bg-[#F6F6F4] p-3">
      <h4 className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.12em] text-[#756F68]"><Icon size={14} />{title}</h4>
      {items.length ? <ul className="mt-2 grid gap-1 text-sm font-semibold leading-6 text-[#2D2A26]">{items.map((itemText, index) => <li key={`${itemText}-${index}`}>{itemText}</li>)}</ul> : <p className="mt-2 text-sm text-[#756F68]">{empty}</p>}
    </div>
  );
}

function FlowWork({ state, setState, stage, updateStage }: { state: WorkshopState; setState: React.Dispatch<React.SetStateAction<WorkshopState>>; stage: Stage; updateStage: (stageId: string, fn: (stage: Stage) => Stage) => void }) {
  const openModal = useActionModal();
  if (["etapa-1", "etapa-2", "etapa-3", "etapa-4", "etapa-5", "etapa-6"].includes(stage.id)) {
    const updateStep = (stepId: string, patch: Partial<ProcessFlowStep>) => patchWorkItem(updateStage, stage, "flow", stepId, patch as Partial<WorkItem>);
    const addFlowContribution = (type: string, content: string, relatedItemId?: string, impact?: Level) => addContribution(setState, state, { type: type as ContributionType, content, relatedItemId, impact });
    const addRelatedPain = (step: ProcessFlowStep, text: string) => {
      const related = preworkItem(id("pain"), `Dor relacionada - ${step.title}`, text, step.area, step.impact, { origin: "Workshop", status: "em revisão" });
      updateStage(stage.id, (current) => ({ ...current, pains: [related, ...current.pains] }));
      addFlowContribution("dor", text, step.id, step.impact);
    };
    const addRelatedRule = (step: ProcessFlowStep, text: string) => {
      const related = preworkItem(id("rule"), `Regra relacionada - ${step.title}`, text, step.area, step.impact, { origin: "Workshop", status: "em revisão" });
      updateStage(stage.id, (current) => ({ ...current, rules: [related, ...current.rules] }));
      addFlowContribution("regra de negócio", text, step.id, step.impact);
    };
    const withFlowOrder = (items: WorkItem[]) => items.map((item, index) => ({ ...item, order: index + 1, updatedAt: now() }));
    const addStep = (step: ProcessFlowStep, index: number) => updateStage(stage.id, (current) => {
      if (current.flow.some((item) => item.id === step.id)) return current;
      const next = [...current.flow];
      const insertAt = Math.max(0, Math.min(index, next.length));
      next.splice(insertAt, 0, step as WorkItem);
      return { ...current, flow: withFlowOrder(next) };
    });
    const moveStep = (stepId: string, index: number) => updateStage(stage.id, (current) => {
      const moving = current.flow.find((step) => step.id === stepId);
      if (!moving) return current;
      const next = current.flow.filter((step) => step.id !== stepId);
      const insertAt = Math.max(0, Math.min(index, next.length));
      next.splice(insertAt, 0, moving);
      return { ...current, flow: withFlowOrder(next) };
    });
    const deleteStep = (stepId: string) => updateStage(stage.id, (current) => ({ ...current, flow: withFlowOrder(current.flow.filter((step) => step.id !== stepId)) }));

    return <div className="grid gap-4"><ProcessFlowDiagram steps={stage.flow} origin={stage.origin} variant={stage.id === "etapa-2" ? "branching" : stage.id === "etapa-3" ? "parallel" : "linear"} diagramTitle={stage.name} canEditFlow={currentParticipant(state)?.status === "facilitador"} onUpdateStep={updateStep} onAddContribution={addFlowContribution} onAddRelatedPain={addRelatedPain} onAddRelatedRule={addRelatedRule} onCreateHypothesis={(step) => transformWorkItemToHypothesis(state, setState, stage, updateStage, "flow", step as WorkItem)} onAddStep={addStep} onMoveStep={moveStep} onDeleteStep={deleteStep} /><StageInputSections state={state} setState={setState} stage={stage} updateStage={updateStage} /></div>;
}

  return (
    <div className="grid gap-5">
      <section>
        <SectionTitle title="Fluxo visual da etapa" subtitle={stage.description ?? "Comente em cada passo, sugira ajuste, confirme ou marque dúvida."} />
        <div className="mt-4 grid gap-3 lg:grid-cols-5">
          {stage.flow.map((f, index) => (
            <article key={f.id} className={`rounded-lg border p-4 ${state.highlightedItemId === f.id ? "border-[#FFC629] bg-[#FFF9E3]" : "border-[#D8D8D8] bg-[#FAFAF9]"}`}>
              <div className="flex items-start gap-3">
                <span className="grid h-8 w-8 flex-shrink-0 place-items-center rounded-full bg-[#2D2A26] text-sm font-bold text-[#FFC629]">{index + 1}</span>
                <div>
                  <div className="flex flex-wrap gap-2"><Badge>{f.status}</Badge>{f.origin && <Badge tone="bg-white text-[#54504A]">{f.origin}</Badge>}</div>
                  <p className="mt-3 font-bold leading-6">{f.title ?? f.text}</p>
                  {f.title && <p className="mt-2 text-sm leading-6 text-[#5B5650]">{f.text}</p>}
                  <p className="mt-2 text-xs font-bold uppercase tracking-[0.1em] text-[#756F68]">{f.area}</p>
                  {f.tools && <p className="mt-1 text-xs text-[#756F68]">Ferramentas / fontes: {f.tools}</p>}
                </div>
              </div>
              <WorkItemControls state={state} setState={setState} stage={stage} updateStage={updateStage} group="flow" work={f} contributionType="ajuste de fluxo" />
            </article>
          ))}
        </div>
        <div className="mt-4">
          <SecondaryButton onClick={() => openModal({ title: "Adicionar novo passo", confirmLabel: "Adicionar", fields: [{ id: "text", label: "Novo passo sugerido", multiline: true, required: true }], onSubmit: ({ text }) => { updateStage(stage.id, (s) => ({ ...s, flow: [...s.flow, item(id("flow"), text, "Sugestão da sala")] })); addContribution(setState, state, { type: "ajuste de fluxo", content: `Novo passo sugerido: ${text}` }); } })}><Plus size={17} />Adicionar novo passo</SecondaryButton>
        </div>
      </section>
      <section className="rounded-lg border-l-4 border-[#FFC629] bg-[#FFF9E3] p-4">
        <div className="flex flex-wrap items-center gap-2"><p className="text-xs font-bold uppercase tracking-[0.14em] text-[#756F68]">KDD preliminar</p><Badge>{stage.kdd.status}</Badge>{stage.origin && <Badge tone="bg-white text-[#54504A]">{stage.origin}</Badge>}</div>
        <p className="mt-3 text-xl font-bold leading-8">{stage.kdd.final || stage.kdd.draft}</p>
      </section>
    </div>
  );
}

function StageInputSections({ state, setState, stage, updateStage }: { state: WorkshopState; setState: React.Dispatch<React.SetStateAction<WorkshopState>>; stage: Stage; updateStage: (stageId: string, fn: (stage: Stage) => Stage) => void }) {
  const kpiItems = stage.kpiItems ?? [];
  return <div className="grid gap-3"><CompactWorkItemSection title="Dores" tone="red" group="pains" items={stage.pains} contributionType="dor" state={state} setState={setState} stage={stage} updateStage={updateStage} /><CompactWorkItemSection title="Regras de negócio" tone="blue" group="rules" items={stage.rules} contributionType="regra de negócio" state={state} setState={setState} stage={stage} updateStage={updateStage} /><CompactWorkItemSection title="Necessidades" tone="green" group="needs" items={stage.needs} contributionType="necessidade" state={state} setState={setState} stage={stage} updateStage={updateStage} /><CompactWorkItemSection title="KPIs / Metas" tone="yellow" group="kpis" items={kpiItems} contributionType="comentário" state={state} setState={setState} stage={stage} updateStage={updateStage} /><CompactWorkItemSection title="Dúvidas" tone="blue" group="openQuestions" items={stage.openQuestions} contributionType="dúvida" state={state} setState={setState} stage={stage} updateStage={updateStage} /></div>;
}

function CompactWorkItemSection({ title, tone, group, items, contributionType, state, setState, stage, updateStage }: { title: string; tone: "red" | "blue" | "green" | "yellow"; group: WorkItemGroup | "kpis"; items: WorkItem[]; contributionType: ContributionType; state: WorkshopState; setState: React.Dispatch<React.SetStateAction<WorkshopState>>; stage: Stage; updateStage: (stageId: string, fn: (stage: Stage) => Stage) => void }) {
  const openModal = useActionModal();
  const participant = currentParticipant(state);
  const [feedback, setFeedback] = useState("");
  const canManage = currentParticipant(state)?.status === "facilitador";
  const theme = {
    red: { section: "border-[#E8C7C7] bg-[#FFF7F7]", card: "border-[#F0CFCF] bg-[#FFFDFD]", button: "border-[#E8C7C7]" },
    blue: { section: "border-[#BFD7F5] bg-[#F4F9FF]", card: "border-[#C8DDF7] bg-[#FCFDFF]", button: "border-[#BFD7F5]" },
    green: { section: "border-[#BFE5CB] bg-[#F4FFF7]", card: "border-[#C9EBD2] bg-[#FDFFFD]", button: "border-[#BFE5CB]" },
    yellow: { section: "border-[#F0DE9A] bg-[#FFFBEA]", card: "border-[#F3E4A8] bg-[#FFFDF4]", button: "border-[#F0DE9A]" },
  }[tone];
  const showFeedback = (message: string) => {
    setFeedback(message);
    window.setTimeout(() => setFeedback(""), 2400);
  };
  const addItem = () => {
    if (!participant) return;
    const commonFields = [
      { id: "title", label: group === "openQuestions" ? "Título da dúvida" : `Título de ${title.toLowerCase()}`, required: true },
      { id: "text", label: "Descrição", multiline: true, required: true },
      { id: "area", label: group === "openQuestions" ? "Área relacionada" : "Área relacionada", value: participant.area },
      { id: "impact", label: "Impacto", value: "Médio", options: levels.map((level) => ({ label: level, value: level })) },
      { id: "notes", label: "Observações", multiline: true },
    ];
    const fields = group === "kpis"
      ? [
          { id: "title", label: "Nome do KPI ou meta", required: true },
          { id: "text", label: "Descrição", multiline: true, required: true },
          { id: "kind", label: "Tipo", value: "KPI", options: ["KPI", "Meta", "Indicador", "Métrica"].map((value) => ({ label: value, value })) },
          { id: "expectedValue", label: "Valor esperado" },
          { id: "source", label: "Fonte de dados" },
          { id: "area", label: "Área responsável", value: participant.area },
          { id: "notes", label: "Observações", multiline: true },
        ]
      : group === "openQuestions"
        ? [
            { id: "title", label: "Título da dúvida", required: true },
            { id: "text", label: "Descrição", multiline: true, required: true },
            { id: "area", label: "Área relacionada", value: participant.area },
            { id: "owner", label: "Responsável sugerido" },
            { id: "notes", label: "Observações", multiline: true },
          ]
        : commonFields;
    openModal({
      title: `Adicionar ${title.toLowerCase()}`,
      confirmLabel: "Adicionar",
      fields,
      onSubmit: (values) => {
        const metadata = group === "kpis"
          ? [values.kind, values.expectedValue && `Valor esperado: ${values.expectedValue}`, values.source && `Fonte: ${values.source}`, values.notes && `Obs.: ${values.notes}`].filter(Boolean).join(" · ")
          : group === "openQuestions"
            ? [values.owner && `Responsável sugerido: ${values.owner}`, values.notes && `Obs.: ${values.notes}`].filter(Boolean).join(" · ")
            : values.notes?.trim() ?? "";
        const work: WorkItem = {
          id: id(group === "kpis" ? "kpi" : group),
          title: values.title.trim(),
          text: values.text.trim(),
          area: values.area?.trim() || participant.area,
          impact: group === "openQuestions" ? "Médio" : ((values.impact || "Médio") as Level),
          status: group === "openQuestions" ? "em aberto" : "em validação",
          origin: "Workshop",
          comments: metadata ? [metadata] : [],
          createdBy: participant.name,
          createdAt: now(),
          updatedAt: now(),
        };
        if (group === "kpis") {
          updateStage(stage.id, (s) => ({ ...s, kpiItems: [work, ...(s.kpiItems ?? [])], kpis: { ...s.kpis, message: "", status: s.kpis.status || "Em validação" } }));
        } else {
          updateStage(stage.id, (s) => ({ ...s, [group]: [work, ...s[group]] }));
        }
        addContribution(setState, state, { type: contributionType, content: `${title} adicionado: ${work.title}`, relatedItemId: work.id, impact: work.impact });
        showFeedback(`${title} adicionado.`);
      },
    });
  };
  const editItem = (work: WorkItem) => {
    openModal({
      title: `Editar ${title.toLowerCase()}`,
      confirmLabel: "Salvar",
      fields: [
        { id: "title", label: "Título", value: work.title ?? "" },
        { id: "text", label: "Descrição", value: work.text, multiline: true, required: true },
        { id: "area", label: "Origem / área", value: work.area },
      ],
      onSubmit: ({ title: itemTitle, text, area }) => {
        if (group === "kpis") {
          updateStage(stage.id, (s) => ({ ...s, kpiItems: (s.kpiItems ?? []).map((item) => item.id === work.id ? { ...item, title: itemTitle.trim() || undefined, text: text.trim(), area: area.trim() || work.area, status: "em revisão", updatedAt: now() } : item) }));
        } else {
          patchWorkItem(updateStage, stage, group, work.id, { title: itemTitle.trim() || undefined, text: text.trim(), area: area.trim() || work.area, status: "em revisão", updatedAt: now() });
        }
        addContribution(setState, state, { type: contributionType, content: `${title} editado: ${text.trim()}`, relatedItemId: work.id, impact: work.impact });
      },
    });
  };
  const deleteItem = (work: WorkItem) => {
    openModal({
      title: `Excluir ${title.toLowerCase()}?`,
      message: work.title ?? work.text,
      confirmLabel: "Excluir",
      tone: "danger",
      onSubmit: () => {
        if (group === "kpis") {
          updateStage(stage.id, (s) => ({ ...s, kpiItems: (s.kpiItems ?? []).filter((item) => item.id !== work.id) }));
        } else {
          updateStage(stage.id, (s) => ({ ...s, [group]: s[group].filter((item) => item.id !== work.id) }));
        }
        addContribution(setState, state, { type: "comentário", content: `${title} excluído: ${work.title ?? work.text}`, relatedItemId: work.id, impact: work.impact });
      },
    });
  };

  return (
    <section className={`rounded-lg border p-3 ${theme.section}`}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-bold">{title}</h3>
          <p className="text-xs text-[#756F68]">{items.length ? `${items.length} registrados` : "Não informado no pré-work."}</p>
        </div>
        <button type="button" title={`Adicionar ${title.toLowerCase()}`} onClick={addItem} className={`grid h-8 w-8 place-items-center rounded-md border bg-white text-[#2D2A26] hover:border-[#2D2A26] ${theme.button}`}><Plus size={16} /></button>
      </div>
      {feedback && <div className="mt-2 inline-flex min-h-7 items-center rounded-md border border-[#BFE6CB] bg-[#E1F5E8] px-2 text-xs font-bold text-[#146B35]">{feedback}</div>}
      <div className="mt-2 grid auto-rows-auto items-start gap-2 md:grid-cols-2 xl:grid-cols-3">
        {items.map((work) => (
          <article key={work.id} className={`grid h-auto min-h-[94px] grid-cols-[minmax(0,1fr)_auto] items-start gap-2 rounded-md border px-3 py-2 ${theme.card}`}>
            <div className="min-w-0 flex-1">
              <div className="mb-1 flex flex-wrap gap-1.5"><Badge>{work.status}</Badge>{group !== "openQuestions" && <Badge tone="bg-white text-[#54504A]">Impacto {work.impact}</Badge>}{work.area && <Badge tone="bg-white text-[#54504A]">{work.area}</Badge>}</div>
              <p className="whitespace-normal break-words text-sm font-bold leading-5">{work.title || work.text}</p>
              {work.title && <p className="mt-0.5 whitespace-normal break-words text-xs font-semibold leading-5 text-[#5B5650]">{work.text}</p>}
            </div>
            {canManage && <div className="flex shrink-0 items-start gap-1">
              <button type="button" title={`Editar ${title.toLowerCase()}`} onClick={() => editItem(work)} className={`grid h-7 w-7 place-items-center rounded-md border bg-white text-[#2D2A26] hover:border-[#2D2A26] ${theme.button}`}><Pencil size={14} /></button>
              <button type="button" title={`Excluir ${title.toLowerCase()}`} onClick={() => deleteItem(work)} className={`grid h-7 w-7 place-items-center rounded-md border bg-white text-[#8A1F1F] hover:border-[#8A1F1F] ${theme.button}`}><Trash2 size={14} /></button>
            </div>}
          </article>
        ))}
      </div>
      {!items.length && <div className="mt-2"><EmptyState text="Não informado no pré-work." /></div>}
    </section>
  );
}
function TaxWork({ state, setState, stage, updateStage }: { state: WorkshopState; setState: React.Dispatch<React.SetStateAction<WorkshopState>>; stage: Stage; updateStage: (stageId: string, fn: (stage: Stage) => Stage) => void }) {
  const patch = (tax: Partial<Stage["taxImpact"]>) => updateStage(stage.id, (s) => ({ ...s, taxImpact: { ...s.taxImpact, ...tax } }));
  return <div className="grid gap-4 lg:grid-cols-[420px_minmax(0,1fr)]"><section className="rounded-lg bg-[#FFF9E3] p-4"><h3 className="text-xl font-bold leading-7">A Reforma Tributária impacta esta etapa?</h3><div className="mt-4 grid gap-2">{taxAnswers.map((a) => <button key={a} type="button" onClick={() => { patch({ answer: a }); addContribution(setState, state, { type: "impacto de Reforma Tributária", content: a }); }} className={`rounded-md border px-3 py-3 text-left text-sm font-bold ${stage.taxImpact.answer === a ? "border-[#2D2A26] bg-white" : "border-[#D8D8D8] bg-[#FFFDF2]"}`}>{a}</button>)}</div></section><section className="grid content-start gap-3"><TaxField label="Impacto esperado" value={stage.taxImpact.expectedImpact} onChange={(v) => patch({ expectedImpact: v })} /><TaxField label="Obrigação fiscal/regulatória" value={stage.taxImpact.obligation} onChange={(v) => patch({ obligation: v })} /></section></div>;
}
function TaxField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return <Field label={label}><textarea className={`${inputClass()} min-h-28 resize-y`} value={value} onChange={(e) => onChange(e.target.value)} /></Field>;
}
function KddWork({ state, setState, stage, updateStage }: { state: WorkshopState; setState: React.Dispatch<React.SetStateAction<WorkshopState>>; stage: Stage; updateStage: (stageId: string, fn: (stage: Stage) => Stage) => void }) {
  const canValidateKdd = currentParticipant(state)?.status === "facilitador";
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(stage.kdd.final || stage.kdd.draft);
  useEffect(() => setDraft(stage.kdd.final || stage.kdd.draft), [stage.id, stage.kdd.final, stage.kdd.draft]);
  const save = () => {
    const text = draft.trim();
    if (!text) return;
    updateStage(stage.id, (s) => ({ ...s, kdd: { ...s.kdd, draft: text, final: s.kdd.status === "validado" ? text : s.kdd.final, status: s.kdd.status === "validado" ? "validado" : "em revisão" } }));
    addContribution(setState, state, { type: "sugestão de KDD", content: `KDD editado: ${text}` });
    setEditing(false);
  };
  const validate = () => {
    updateStage(stage.id, (s) => ({ ...s, kdd: { ...s.kdd, status: "validado", final: draft.trim() || s.kdd.final || s.kdd.draft, draft: draft.trim() || s.kdd.draft } }));
    addContribution(setState, state, { type: "comentário", content: "KDD preliminar validado" });
  };
  return <div className="grid gap-3"><section className="rounded-lg border-l-4 border-[#FFC629] bg-[#FFF9E3] p-4"><div className="flex flex-wrap items-center justify-between gap-3"><div className="flex flex-wrap items-center gap-2"><p className="text-xs font-bold uppercase tracking-[0.14em] text-[#756F68]">KDD preliminar</p><Badge>{stage.kdd.status}</Badge></div>{canValidateKdd && !editing && <button type="button" title="Editar KDD" onClick={() => setEditing(true)} className="grid h-8 w-8 place-items-center rounded-md border border-[#D8D8D8] bg-white text-[#756F68] hover:border-[#2D2A26] hover:text-[#2D2A26]"><Pencil size={15} /></button>}</div>{editing ? <div className="mt-3 grid gap-3"><textarea autoFocus className={`${inputClass()} min-h-36 resize-y text-lg font-bold leading-8`} value={draft} onChange={(event) => setDraft(event.target.value)} /><div className="flex flex-wrap gap-2"><PrimaryButton disabled={!draft.trim()} onClick={save}>Salvar KDD</PrimaryButton><SecondaryButton onClick={() => { setDraft(stage.kdd.final || stage.kdd.draft); setEditing(false); }}>Cancelar</SecondaryButton></div></div> : <p className="mt-3 text-2xl font-bold leading-9">{stage.kdd.final || stage.kdd.draft}</p>}</section>{canValidateKdd && <div className="flex flex-wrap gap-2"><PrimaryButton onClick={validate}><Check size={17} />Validar KDD</PrimaryButton></div>}</div>;
}
function DataWork({ state, setState, stage, updateStage }: { state: WorkshopState; setState: React.Dispatch<React.SetStateAction<WorkshopState>>; stage: Stage; updateStage: (stageId: string, fn: (stage: Stage) => Stage) => void }) {
  const groups: Array<[string, WorkItemGroup, ContributionType]> = [["Dores", "pains", "dor"], ["Regras de negócio", "rules", "regra de negócio"], ["Necessidades", "needs", "necessidade"], ["Perguntas em aberto", "openQuestions", "pergunta"]];
  return (
    <div className="grid gap-4">
      <section className="grid gap-3 md:grid-cols-2">
        <div className="rounded-lg border border-[#F3C7C7] bg-[#FFF7F7] p-4">
          <div className="flex flex-wrap gap-2"><Badge>Não avaliado</Badge><Badge tone="bg-white text-[#54504A]">{stage.origin ?? PREWORK_ORIGIN}</Badge></div>
          <h3 className="mt-3 text-lg font-bold">Reforma Tributária não avaliada</h3>
          <p className="mt-2 text-sm leading-6 text-[#5B5650]">{stage.taxImpact.expectedImpact || "Validar impacto durante o workshop."}</p>
        </div>
        <div className="rounded-lg border border-[#F3C7C7] bg-[#FFF7F7] p-4">
          <div className="flex flex-wrap gap-2"><Badge>{stage.kpis.status || "Não informado no pré-work"}</Badge><Badge tone="bg-white text-[#54504A]">{stage.origin ?? PREWORK_ORIGIN}</Badge></div>
          <h3 className="mt-3 text-lg font-bold">KPIs / Metas não definidos</h3>
          <p className="mt-2 text-sm leading-6 text-[#5B5650]">{stage.kpis.message || "Validar KPIs / Metas em workshop."}</p>
        </div>
      </section>
      <div className="grid gap-4 xl:grid-cols-4">
        {groups.map(([title, group, contributionType]) => (
          <section key={group} className="rounded-lg border border-[#D8D8D8] bg-[#FAFAF9] p-4">
            <h3 className="text-lg font-bold">{title}</h3>
            <div className="mt-3 grid gap-3">
              {stage[group].map((w) => (
                <article key={w.id} className="rounded-lg border border-[#EAEAEA] bg-white p-3">
                  <div className="flex flex-wrap gap-2"><Badge>{w.status}</Badge><Badge tone="bg-[#EAEAEA] text-[#2D2A26]">Impacto {w.impact}</Badge>{w.origin && <Badge tone="bg-[#F6F6F4] text-[#54504A]">{w.origin}</Badge>}</div>
                  {w.title && <p className="mt-3 text-sm font-bold leading-6">{w.title}</p>}
                  <p className={`${w.title ? "mt-1" : "mt-3"} text-sm font-semibold leading-6 text-[#2D2A26]`}>{w.text}</p>
                  <p className="mt-1 text-xs font-bold uppercase tracking-[0.1em] text-[#756F68]">{w.area}</p>
                  {w.comments.length > 0 && <p className="mt-2 rounded bg-[#F6F6F4] p-2 text-xs text-[#5B5650]">Último comentário: {w.comments[0]}</p>}
                  <WorkItemControls state={state} setState={setState} stage={stage} updateStage={updateStage} group={group} work={w} contributionType={contributionType} />
                  <div className="mt-2"><MiniButton onClick={() => patchWorkItem(updateStage, stage, group, w.id, { status: "fora de escopo" })}>Fora</MiniButton></div>
                </article>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
function createOffender(stage: Stage, w: WorkItem, updateStage: (stageId: string, fn: (stage: Stage) => Stage) => void, setState: React.Dispatch<React.SetStateAction<WorkshopState>>, state: WorkshopState) {
  const offender: Offender = { id: id("offender"), stageId: stage.id, hypothesisId: "", type: w.area === "Fiscal" ? "Fiscal" : "Processo", content: w.text, cause: "Causa provável a validar em sala", impact: w.impact, responsibleArea: w.area };
  updateStage(stage.id, (s) => ({ ...s, offenders: [offender, ...s.offenders] }));
  addContribution(setState, state, { type: "ofensor", content: offender.content, relatedItemId: w.id });
}
function HypothesisWork({ state, setState, stage, updateStage }: { state: WorkshopState; setState: React.Dispatch<React.SetStateAction<WorkshopState>>; stage: Stage; updateStage: (stageId: string, fn: (stage: Stage) => Stage) => void }) {
  const openModal = useActionModal();
  const participant = currentParticipant(state);
  const [feedback, setFeedback] = useState("");
  const sourceItems = allItems(stage);
  const kddText = stage.kdd.final || stage.kdd.draft;
  const sourceOptions = [{ label: "Sem item vinculado", value: "" }, ...sourceItems.map((item) => ({ label: (item.title || item.text).slice(0, 96), value: item.id }))];
  const showFeedback = (message: string) => { setFeedback(message); window.setTimeout(() => setFeedback(""), 2800); };
  const createHypothesis = () => openModal({
    title: "Nova hipótese",
    message: `KDD: ${kddText}`,
    confirmLabel: "Salvar hipótese",
    fields: [
      { id: "sourceId", label: "Vincular item", options: sourceOptions },
      { id: "action", label: "Se [ação ou mudança]", multiline: true, required: true },
      { id: "result", label: "Então [resultado esperado]", required: true },
      { id: "evidence", label: "Porque [evidência]", multiline: true, required: true },
    ],
    onSubmit: (values) => {
      const source = sourceItems.find((item) => item.id === values.sourceId);
      const text = `Se ${values.action.trim()}, então ${values.result.trim()}, porque ${values.evidence.trim()}.`;
      const h: Hypothesis = { ...hypothesis(stage.id, values.sourceId, source?.text ?? "", source?.area ?? participant?.area ?? ""), text, expectedResult: values.result.trim(), evidence: values.evidence.trim(), area: source?.area ?? participant?.area ?? "", createdBy: participant?.name ?? "Workshop", createdAt: now() };
      updateStage(stage.id, (s) => ({ ...s, hypotheses: [h, ...s.hypotheses] }));
      addContribution(setState, state, { type: "hipótese", content: text, relatedItemId: source?.id });
      showFeedback("Hipótese criada.");
    },
  });
  const createOffenderFromModal = () => openModal({
    title: "Novo ofensor",
    message: `KDD: ${kddText}`,
    confirmLabel: "Salvar ofensor",
    fields: [
      { id: "content", label: "Ofensor / risco", required: true },
      { id: "cause", label: "Como isso pode impedir o alcance do KDD", multiline: true, required: true },
      { id: "origin", label: "Origem / evidência", multiline: true },
      { id: "impact", label: "Impacto", value: "Médio", options: levels.map((level) => ({ label: level, value: level })) },
    ],
    onSubmit: (values) => {
      const offender: Offender = { id: id("offender"), stageId: stage.id, hypothesisId: "", type: "Processo", content: values.content.trim(), cause: values.origin?.trim() ? `${values.cause.trim()} Origem/evidência: ${values.origin.trim()}` : values.cause.trim(), impact: (values.impact || "Médio") as Level, responsibleArea: participant?.area ?? "Workshop", status: "Sugerido", origin: values.origin?.trim() ? "Workshop" : undefined, createdBy: participant?.name ?? "Workshop", createdAt: now() };
      updateStage(stage.id, (s) => ({ ...s, offenders: [offender, ...s.offenders] }));
      addContribution(setState, state, { type: "ofensor", content: offender.content });
      showFeedback("Ofensor criado.");
    },
  });
  return (
    <div className="grid gap-4">
      <section className="rounded-lg border-l-4 border-[#FFC629] bg-[#FFF9E3] p-4">
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#756F68]">KDD da etapa</p>
        <p className="mt-2 text-xl font-bold leading-8 text-[#2D2A26]">{kddText}</p>
        <div className="mt-3 grid gap-2 text-sm font-semibold leading-6 text-[#5B5650] md:grid-cols-2">
          <p><strong>Hipóteses:</strong> ideias e caminhos para alcançar este KDD.</p>
          <p><strong>Ofensores:</strong> fatores que podem impedir ou dificultar alcançar este KDD.</p>
        </div>
      </section>
      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={createHypothesis} className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-[#BFE6CB] bg-[#E1F5E8] px-4 text-sm font-bold text-[#146B35] hover:border-[#146B35]"><FlaskConical size={17} />Criar hipótese</button>
        <button type="button" onClick={createOffenderFromModal} className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-[#F3C7C7] bg-[#FFF1F1] px-4 text-sm font-bold text-[#8A1F1F] hover:border-[#8A1F1F]"><AlertTriangle size={17} />Criar ofensor</button>
        {feedback && <span className="inline-flex h-10 items-center rounded-md bg-[#E1F5E8] px-3 text-sm font-bold text-[#146B35]">{feedback}</span>}
      </div>
      <div className="grid gap-4 xl:grid-cols-2">
        <section className="rounded-lg border border-[#BFE6CB] bg-[#F4FBF6] p-3">
          <SectionTitle title="Hipóteses" subtitle="Caminhos propostos para alcançar o KDD" />
          <div className="mt-3 grid gap-2">{stage.hypotheses.map((h) => <HypothesisCard key={h.id} h={h} state={state} updateStage={updateStage} />)}{!stage.hypotheses.length && <EmptyState text="Nenhuma hipótese criada ainda." />}</div>
        </section>
        <section className="rounded-lg border border-[#F3C7C7] bg-[#FFF7F7] p-3">
          <SectionTitle title="Ofensores" subtitle="Fatores que podem impedir o alcance do KDD" />
          <div className="mt-3 grid gap-2">{stage.offenders.map((o) => <OffenderCard key={o.id} offender={o} />)}{!stage.offenders.length && <EmptyState text="Nenhum ofensor criado ainda." />}</div>
        </section>
      </div>
    </div>
  );
}
function HypothesisCard({ h, state, updateStage }: { h: Hypothesis; state: WorkshopState; updateStage: (stageId: string, fn: (stage: Stage) => Stage) => void }) {
  const p = currentParticipant(state);
  const stage = state.stages.find((s) => s.id === h.stageId);
  const source = stage ? allItems(stage).find((item) => item.id === h.sourceId) : undefined;
  const votes = h.votes ?? {};
  const liked = !!p && votes[p.id] > 0;
  const likes = Object.values(votes).filter((value) => value > 0).length;
  const toggleLike = () => { if (!p) return; updateStage(h.stageId, (s) => ({ ...s, hypotheses: s.hypotheses.map((x) => x.id === h.id ? { ...x, votes: { ...(x.votes ?? {}), [p.id]: liked ? 0 : 1 } } : x) })); };
  return <article className="rounded-md border border-[#BFE6CB] bg-white p-3"><div className="flex flex-wrap items-start justify-between gap-2"><Badge tone={statusStyle[h.priorityStatus] ?? "bg-[#E1F5E8] text-[#146B35]"}>{h.priorityStatus}</Badge><button type="button" onClick={toggleLike} className={`inline-flex h-8 items-center gap-1 rounded-md border px-2 text-xs font-bold ${liked ? "border-[#146B35] bg-[#E1F5E8] text-[#146B35]" : "border-[#D8D8D8] bg-white text-[#54504A] hover:border-[#146B35]"}`}><ThumbsUp size={13} />Gostei {likes}</button></div><p className="mt-2 text-sm font-bold leading-6 text-[#2D2A26]">{h.text}</p>{source && <p className="mt-2 line-clamp-2 rounded bg-[#F4FBF6] p-2 text-xs font-semibold leading-5 text-[#3F6B4E]">Vinculado: {source.title || source.text}</p>}<p className="mt-2 text-xs font-bold uppercase tracking-[0.1em] text-[#756F68]">{h.createdBy || h.area || "Pré-work"} · {h.createdAt ? new Date(h.createdAt).toLocaleString("pt-BR") : "pré-work"}</p></article>;
}
function OffenderCard({ offender }: { offender: Offender }) {
  return <article className="rounded-md border border-[#F3C7C7] bg-white p-3"><div className="flex flex-wrap items-center gap-2"><Badge tone="bg-[#FFE1E1] text-[#8A1F1F]">{offender.status ?? "Sugerido"}</Badge><Badge tone="bg-white text-[#8A1F1F]">Impacto {offender.impact}</Badge></div><p className="mt-2 text-sm font-bold leading-6 text-[#2D2A26]">{offender.content}</p><p className="mt-1 text-sm font-semibold leading-6 text-[#5B5650]">{offender.cause}</p><p className="mt-2 text-xs font-bold uppercase tracking-[0.1em] text-[#756F68]">{offender.createdBy || offender.responsibleArea || "Pré-work"} · {offender.createdAt ? new Date(offender.createdAt).toLocaleString("pt-BR") : offender.origin || "pré-work"}</p></article>;
}
function Prioritization({ state, updateStage }: { state: WorkshopState; updateStage: (stageId: string, fn: (stage: Stage) => Stage) => void }) {
  const stage = activeStage(state);
  return <div className="grid gap-4"><SectionTitle title="Priorização da etapa ativa" subtitle="Pontue critérios e veja o resultado consolidado com votos da sala." />{stage.hypotheses.map((h) => <article key={h.id} className="rounded-lg border border-[#D8D8D8] bg-[#FAFAF9] p-4"><div className="flex flex-wrap items-start justify-between gap-3"><div><Badge>{h.priorityStatus}</Badge><p className="mt-3 max-w-4xl text-sm font-semibold leading-6">{h.text}</p></div><Badge tone="bg-white text-[#2D2A26]">Score {priorityScore(h)}</Badge></div><div className="mt-4 grid gap-3 md:grid-cols-4">{(["impactProcess", "financialRisk", "fiscalRisk", "painFrequency", "technicalDependency", "effort", "urgency", "clarity"] as Array<keyof Hypothesis>).map((key) => <LevelSelect key={key} label={String(key)} value={h[key] as Level} onChange={(v) => patchHyp(updateStage, stage.id, h.id, { [key]: v } as Partial<Hypothesis>)} />)}</div><div className="mt-3 flex flex-wrap gap-2">{hypothesisStatuses.map((status) => <MiniButton key={status} active={h.priorityStatus === status} onClick={() => patchHyp(updateStage, stage.id, h.id, { priorityStatus: status })}>{status}</MiniButton>)}</div></article>)}{!stage.hypotheses.length && <EmptyState text="Nenhuma hipótese priorizada ainda." />}</div>;
}
function patchHyp(updateStage: (stageId: string, fn: (stage: Stage) => Stage) => void, stageId: string, hypId: string, patch: Partial<Hypothesis>) {
  updateStage(stageId, (s) => ({ ...s, hypotheses: s.hypotheses.map((h) => h.id === hypId ? { ...h, ...patch } : h) }));
}
function LevelSelect({ label, value, onChange, disabled }: { label: string; value: Level; onChange: (v: Level) => void; disabled?: boolean }) {
  return <Field label={label}><select className={inputClass(disabled)} disabled={disabled} value={value} onChange={(e) => onChange(e.target.value as Level)}>{levels.map((l) => <option key={l}>{l}</option>)}</select></Field>;
}
function Plans({ state, updateStage }: { state: WorkshopState; updateStage: (stageId: string, fn: (stage: Stage) => Stage) => void }) {
  const [selectedHypothesisId, setSelectedHypothesisId] = useState("");
  const canEdit = currentParticipant(state)?.status === "facilitador";
  const prioritized = state.stages.flatMap((s) => s.hypotheses.filter((h) => h.priorityStatus === "Prioritária").map((h) => ({ stage: s, h })));
  const selected = prioritized.find(({ h }) => h.id === (selectedHypothesisId || prioritized[0]?.h.id)) ?? prioritized[0];
  const plans = state.stages.flatMap((s) => s.plans);
  const ensure = (stage: Stage, h: Hypothesis) => {
    updateStage(stage.id, (s) => s.plans.some((p) => p.hypothesisId === h.id) ? s : ({ ...s, plans: [createPlan(stage, h), ...s.plans] }));
    setSelectedHypothesisId(h.id);
  };
  const completedPlans = plans.filter((p) => p.status === "Validado").length;
  return (
    <div className="grid gap-3">
      <section className="rounded-lg border border-[#D8D8D8] bg-white p-3 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <SectionTitle title="Planos de ação" subtitle="Jornada guiada por hipótese priorizada." />
          <div className="flex flex-wrap gap-2">
            <Badge>{visibleStage(state).name}</Badge>
            <Badge tone="bg-[#EAEAEA] text-[#2D2A26]">{prioritized.length} priorizadas</Badge>
            <Badge tone="bg-[#FFF4CC] text-[#6F5400]">{plans.length} iniciados</Badge>
            <Badge tone="bg-[#E1F5E8] text-[#146B35]">{completedPlans} completos</Badge>
          </div>
        </div>
      </section>
      {!prioritized.length && <EmptyState text="Nenhum plano criado ainda." />}
      {!!prioritized.length && (
        <section className="rounded-lg border border-[#D8D8D8] bg-white p-3">
          <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-3">
            {prioritized.map(({ stage, h }) => {
              const plan = stage.plans.find((p) => p.hypothesisId === h.id);
              const selectedCard = selected?.h.id === h.id;
              const likes = Object.values(h.votes ?? {}).filter((value) => value > 0).length;
              return (
                <button key={h.id} type="button" onClick={() => { setSelectedHypothesisId(h.id); if (!plan && canEdit) ensure(stage, h); }} className={`rounded-md border p-3 text-left transition ${selectedCard ? "border-[#2D2A26] bg-[#FFF9E3]" : "border-[#D8D8D8] bg-[#FAFAF9] hover:border-[#2D2A26]"}`}>
                  <div className="flex flex-wrap items-center gap-2"><Badge tone="bg-white text-[#2D2A26]">{shortStageName(stage)}</Badge><Badge tone={statusStyle[plan?.status ?? "Não iniciado"]}>{plan?.status ?? "Sem plano"}</Badge><Badge tone="bg-[#E7F0FF] text-[#184B9B]">Score {priorityScore(h)}</Badge><Badge tone="bg-[#F6F6F4] text-[#54504A]">{likes} likes</Badge></div>
                  <p className="mt-2 line-clamp-3 text-sm font-bold leading-5">{h.text}</p>
                  {!plan && canEdit && <span className="mt-3 inline-flex h-8 items-center gap-1 rounded-md bg-[#FFC629] px-3 text-xs font-bold"><Plus size={14} />Criar plano</span>}
                </button>
              );
            })}
          </div>
        </section>
      )}
      {selected && (selected.stage.plans.find((p) => p.hypothesisId === selected.h.id) ? <PlanEditor plan={selected.stage.plans.find((p) => p.hypothesisId === selected.h.id)!} stage={selected.stage} hypothesis={selected.h} updateStage={updateStage} canEdit={canEdit} /> : <section className="rounded-lg border border-[#D8D8D8] bg-white p-5 text-center"><p className="text-sm font-semibold text-[#5B5650]">Selecione esta hipótese para iniciar o plano guiado.</p>{canEdit && <div className="mt-3"><PrimaryButton onClick={() => ensure(selected.stage, selected.h)}><Plus size={17} />Criar plano</PrimaryButton></div>}</section>)}
    </div>
  );
}

function createPlan(stage: Stage, h: Hypothesis): ActionPlan {
  return { id: id("plan"), stageId: stage.id, hypothesisId: h.id, action: "", experiment: "", scope: "", areas: h.area, dataNeeded: "", impactedSystem: "", owner: "", support: "", deadline: "", successMetric: "", invalidationCriteria: "", risks: "", dependencies: "", nextStep: "", status: "Em construção", planStep: 1, planStepStatuses: defaultPlanStepStatuses(), actionRows: [], riskItems: [], premiseItems: [], metricItems: [], stopConditions: [] };
}
function defaultPlanStepStatuses(): Record<string, PlanStepStatus> {
  return Object.fromEntries(planSteps.map((step, index) => [step.key, index === 0 ? "Em andamento" : "Não iniciado"])) as Record<string, PlanStepStatus>;
}
const planSteps = [
  { key: "priorizacao", label: "Priorização" },
  { key: "experimento", label: "Experimento" },
  { key: "plano", label: "Plano" },
  { key: "riscos", label: "Riscos e premissas" },
  { key: "metrica", label: "Métrica" },
  { key: "invalidacao", label: "Critério de invalidação" },
];
const planStepStatuses: PlanStepStatus[] = ["Não iniciado", "Em andamento", "Concluído", "Com pendência"];
function PlanEditor({ plan, stage, hypothesis, updateStage, canEdit }: { plan: ActionPlan; stage: Stage; hypothesis: Hypothesis; updateStage: (stageId: string, fn: (stage: Stage) => Stage) => void; canEdit: boolean }) {
  const patch = (p: Partial<ActionPlan>) => updateStage(stage.id, (s) => ({ ...s, plans: s.plans.map((x) => x.id === plan.id ? { ...x, ...p } : x) }));
  const stepIndexValue = Math.min(Math.max((plan.planStep ?? 1) - 1, 0), planSteps.length - 1);
  const step = planSteps[stepIndexValue];
  const statuses = plan.planStepStatuses ?? defaultPlanStepStatuses();
  const setStep = (index: number) => patch({ planStep: index + 1, planStepStatuses: { ...statuses, [planSteps[index].key]: statuses[planSteps[index].key] === "Não iniciado" ? "Em andamento" : statuses[planSteps[index].key] } });
  const markStep = (status: PlanStepStatus) => patch({ planStepStatuses: { ...statuses, [step.key]: status } });
  return (
    <section className="rounded-lg border border-[#D8D8D8] bg-white p-3 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div><p className="text-xs font-bold uppercase tracking-[0.14em] text-[#756F68]">Hipótese priorizada</p><h2 className="mt-1 max-w-5xl text-lg font-bold leading-7">{hypothesis.text}</h2></div>
        <div className="flex flex-wrap gap-2"><Badge>{plan.status}</Badge><Badge tone="bg-[#F6F6F4] text-[#54504A]">{planCompleteness(plan)}% completo</Badge></div>
      </div>
      <div className="mt-3 grid gap-2 lg:grid-cols-6">
        {planSteps.map((item, index) => (
          <button key={item.key} type="button" onClick={() => setStep(index)} className={`rounded-md border p-2 text-left transition ${index === stepIndexValue ? "border-[#2D2A26] bg-[#FFF9E3]" : "border-[#D8D8D8] bg-[#FAFAF9] hover:border-[#2D2A26]"}`}>
            <span className="text-xs font-bold text-[#756F68]">{index + 1}</span>
            <p className="mt-1 text-sm font-bold leading-4">{item.label}</p>
            <span className={`mt-2 inline-flex rounded-full px-2 py-1 text-[11px] font-bold ${statusStyle[statuses[item.key]] ?? "bg-[#EAEAEA] text-[#2D2A26]"}`}>{statuses[item.key]}</span>
          </button>
        ))}
      </div>
      <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap gap-2"><SecondaryButton disabled={stepIndexValue === 0} onClick={() => setStep(stepIndexValue - 1)}>Voltar</SecondaryButton><SecondaryButton disabled={stepIndexValue === planSteps.length - 1} onClick={() => setStep(stepIndexValue + 1)}>Avançar</SecondaryButton></div>
        {canEdit && <div className="flex flex-wrap gap-2"><MiniButton onClick={() => markStep("Concluído")}><Check size={14} />Concluir passo</MiniButton><MiniButton onClick={() => markStep("Com pendência")}><AlertTriangle size={14} />Pendência</MiniButton><select className={inputClass()} value={plan.status} onChange={(event) => patch({ status: event.target.value as PlanStatus })}>{["Não iniciado", "Em construção", "Pronto para revisão", "Validado", "Pendente de responsável", "Com pendência"].map((status) => <option key={status}>{status}</option>)}</select></div>}
      </div>
      <PlanStepContent stepKey={step.key} plan={plan} stage={stage} hypothesis={hypothesis} patch={patch} canEdit={canEdit} />
    </section>
  );
}

function PlanStepContent({ stepKey, plan, stage, hypothesis, patch, canEdit }: { stepKey: string; plan: ActionPlan; stage: Stage; hypothesis: Hypothesis; patch: (p: Partial<ActionPlan>) => void; canEdit: boolean }) {
  if (stepKey === "priorizacao") return <PlanPrioritizationStep plan={plan} stage={stage} hypothesis={hypothesis} patch={patch} canEdit={canEdit} />;
  if (stepKey === "experimento") return <PlanExperimentStep plan={plan} patch={patch} canEdit={canEdit} />;
  if (stepKey === "plano") return <PlanOperationalStep plan={plan} patch={patch} canEdit={canEdit} />;
  if (stepKey === "riscos") return <PlanRisksStep plan={plan} patch={patch} canEdit={canEdit} />;
  if (stepKey === "metrica") return <PlanMetricsStep plan={plan} patch={patch} canEdit={canEdit} />;
  return <PlanInvalidationStep plan={plan} patch={patch} canEdit={canEdit} />;
}

function PlanPrioritizationStep({ plan, stage, hypothesis, patch, canEdit }: { plan: ActionPlan; stage: Stage; hypothesis: Hypothesis; patch: (p: Partial<ActionPlan>) => void; canEdit: boolean }) {
  const offenders = stage.offenders.filter((offender) => offender.hypothesisId === hypothesis.id);
  const source = allItems(stage).find((item) => item.id === hypothesis.sourceId);
  const quadrants = ["Alto impacto / Baixo esforço", "Alto impacto / Alto esforço", "Baixo impacto / Baixo esforço", "Baixo impacto / Alto esforço"];
  return (
    <div className="mt-4 grid gap-3 xl:grid-cols-[1fr_1.1fr]">
      <section className="rounded-lg border border-[#D8D8D8] bg-[#FAFAF9] p-3">
        <h3 className="text-base font-bold">Base da priorização</h3>
        <p className="mt-2 text-sm font-semibold leading-6">{hypothesis.text}</p>
        <p className="mt-3 rounded-md bg-white p-3 text-sm leading-6"><strong>KDD:</strong> {stage.kdd.final || stage.kdd.draft}</p>
        {source && <p className="mt-2 rounded-md bg-white p-3 text-sm leading-6"><strong>Item vinculado:</strong> {source.title || source.text}</p>}
        <div className="mt-3 grid gap-2">{offenders.map((offender) => <div key={offender.id} className="rounded-md border border-[#F3C7C7] bg-white p-2 text-sm"><strong>{offender.type}:</strong> {offender.content}</div>)}{!offenders.length && <EmptyState text="Sem ofensores vinculados a esta hipótese." />}</div>
      </section>
      <section className="rounded-lg border border-[#D8D8D8] bg-white p-3">
        <h3 className="text-base font-bold">Impacto x esforço</h3>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">{quadrants.map((quadrant) => <button key={quadrant} type="button" disabled={!canEdit} onClick={() => patch({ priorityMatrix: quadrant })} className={`min-h-20 rounded-md border p-3 text-left text-sm font-bold ${plan.priorityMatrix === quadrant ? "border-[#2D2A26] bg-[#FFF4CC]" : "border-[#D8D8D8] bg-[#FAFAF9]"}`}>{quadrant}</button>)}</div>
        <div className="mt-3 grid gap-3 md:grid-cols-2">
          <PlanField label="Impacto esperado" value={plan.priorityImpact ?? plan.action} onChange={(value) => patch({ priorityImpact: value, action: value })} disabled={!canEdit} />
          <PlanField label="Esforço estimado" value={plan.priorityEffort ?? ""} onChange={(value) => patch({ priorityEffort: value })} disabled={!canEdit} />
          <PlanField label="Risco fiscal/financeiro" value={plan.priorityFinancialRisk ?? ""} onChange={(value) => patch({ priorityFinancialRisk: value })} disabled={!canEdit} />
          <PlanField label="Urgência" value={plan.priorityUrgency ?? ""} onChange={(value) => patch({ priorityUrgency: value })} disabled={!canEdit} />
          <PlanField label="Dependência técnica" value={plan.priorityTechnicalDependency ?? plan.dependencies} onChange={(value) => patch({ priorityTechnicalDependency: value, dependencies: value })} disabled={!canEdit} />
          <PlanField label="Justificativa" value={plan.priorityReason ?? ""} onChange={(value) => patch({ priorityReason: value })} multiline disabled={!canEdit} />
        </div>
      </section>
    </div>
  );
}

function PlanExperimentStep({ plan, patch, canEdit }: { plan: ActionPlan; patch: (p: Partial<ActionPlan>) => void; canEdit: boolean }) {
  const cards: Array<[keyof ActionPlan, string, string]> = [["scope", "Onde", "Onde será testado?"], ["experiment", "Como", "Como será testado?"], ["areas", "Quem", "Quem participa?"], ["impactedSystem", "Ferramentas / sistemas", "Com quais ferramentas ou sistemas?"], ["support", "Recorte e duração", "Qual será o recorte e a duração estimada?"], ["dataNeeded", "Disponível para começar", "O que precisa estar disponível?"]];
  return <div className="mt-4"><h3 className="text-base font-bold">Como vamos testar esta hipótese?</h3><div className="mt-3 grid gap-3 md:grid-cols-2 xl:grid-cols-3">{cards.map(([key, title, hint]) => <section key={key} className="rounded-lg border border-[#D8D8D8] bg-[#FFF9E3] p-3"><p className="text-xs font-bold uppercase tracking-[0.12em] text-[#756F68]">{title}</p><PlanField label={hint} value={String(plan[key] ?? "")} onChange={(value) => patch({ [key]: value } as Partial<ActionPlan>)} multiline disabled={!canEdit} /></section>)}</div></div>;
}

function PlanOperationalStep({ plan, patch, canEdit }: { plan: ActionPlan; patch: (p: Partial<ActionPlan>) => void; canEdit: boolean }) {
  const rows = plan.actionRows ?? [];
  const update = (idValue: string, field: keyof PlanActionRow, value: string) => patch({ actionRows: rows.map((row) => row.id === idValue ? { ...row, [field]: value } : row) });
  const missingOwner = rows.filter((row) => !row.owner.trim()).length;
  const missingDeadline = rows.filter((row) => !row.deadline.trim()).length;
  const missingOutput = rows.filter((row) => !row.output.trim()).length;
  return (
    <div className="mt-4 grid gap-3">
      <div className="flex flex-wrap items-center justify-between gap-2"><h3 className="text-base font-bold">Plano operacional</h3>{canEdit && <PrimaryButton onClick={() => patch({ actionRows: [...rows, { id: id("plan-action"), action: "", owner: "", deadline: "", input: "", output: "", notes: "" }] })}><Plus size={17} />Adicionar ação</PrimaryButton>}</div>
      <div className="grid gap-2 md:grid-cols-3"><Metric value={String(missingOwner)} label="sem responsável" /><Metric value={String(missingDeadline)} label="sem prazo" /><Metric value={String(missingOutput)} label="sem output" /></div>
      <div className="overflow-x-auto rounded-lg border border-[#D8D8D8]">
        <table className="min-w-[980px] w-full text-left text-sm">
          <thead className="bg-[#2D2A26] text-white"><tr>{["Ação", "Responsável", "Prazo", "Input", "Output", "Observações", ""].map((header) => <th key={header} className="p-2 font-bold">{header}</th>)}</tr></thead>
          <tbody>{rows.map((row, index) => <tr key={row.id} className="border-t border-[#EAEAEA] align-top">{(["action", "owner", "deadline", "input", "output", "notes"] as Array<keyof PlanActionRow>).map((field) => <td key={field} className="p-2"><input type={field === "deadline" ? "date" : "text"} className={inputClass(!canEdit)} disabled={!canEdit} value={row[field]} onChange={(event) => update(row.id, field, event.target.value)} /></td>)}<td className="p-2"><div className="flex gap-1"><IconButton label="Subir" disabled={!canEdit || index === 0} onClick={() => patch({ actionRows: moveItem(rows, index, index - 1) })}>↑</IconButton><IconButton label="Descer" disabled={!canEdit || index === rows.length - 1} onClick={() => patch({ actionRows: moveItem(rows, index, index + 1) })}>↓</IconButton><IconButton label="Excluir" disabled={!canEdit} onClick={() => patch({ actionRows: rows.filter((item) => item.id !== row.id) })}><Trash2 size={14} /></IconButton></div></td></tr>)}{!rows.length && <tr><td colSpan={7} className="p-4"><EmptyState text="Nenhuma ação adicionada ao plano." /></td></tr>}</tbody>
        </table>
      </div>
    </div>
  );
}

function PlanRisksStep({ plan, patch, canEdit }: { plan: ActionPlan; patch: (p: Partial<ActionPlan>) => void; canEdit: boolean }) {
  const risks = plan.riskItems ?? [];
  const premises = plan.premiseItems ?? [];
  return <div className="mt-4 grid gap-3 xl:grid-cols-2"><EditableRiskList title="Riscos" question="O que pode impedir que a hipótese seja validada corretamente?" items={risks} canEdit={canEdit} onChange={(items) => patch({ riskItems: items, risks: items.map((item) => item.risk).join("; ") })} /><EditablePremiseList title="Premissas" question="O que precisa ser verdade ou estar disponível?" items={premises} canEdit={canEdit} onChange={(items) => patch({ premiseItems: items })} /></div>;
}

function PlanMetricsStep({ plan, patch, canEdit }: { plan: ActionPlan; patch: (p: Partial<ActionPlan>) => void; canEdit: boolean }) {
  const metrics = plan.metricItems ?? [];
  const update = (idValue: string, field: keyof PlanMetricItem, value: string) => {
    const next = metrics.map((metric) => metric.id === idValue ? { ...metric, [field]: value } : metric);
    patch({ metricItems: next, successMetric: next.map((metric) => metric.name).filter(Boolean).join("; ") });
  };
  return <div className="mt-4 grid gap-3"><div className="flex flex-wrap items-center justify-between gap-2"><div><h3 className="text-base font-bold">Métricas do experimento</h3><p className="text-sm leading-6 text-[#5B5650]">Indicador, métrica e meta precisam ficar claros antes do teste.</p></div>{canEdit && <PrimaryButton onClick={() => patch({ metricItems: [...metrics, { id: id("metric"), name: "", description: "", source: "", baseline: "", target: "", frequency: "", owner: "" }] })}><Plus size={17} />Adicionar métrica</PrimaryButton>}</div><div className="grid gap-3 xl:grid-cols-2">{metrics.map((metric) => <article key={metric.id} className="rounded-lg border border-[#F3E2A1] bg-[#FFFCED] p-3"><div className="flex justify-between gap-2"><PlanField label="Nome" value={metric.name} onChange={(value) => update(metric.id, "name", value)} disabled={!canEdit} /><IconButton label="Excluir" disabled={!canEdit} onClick={() => patch({ metricItems: metrics.filter((item) => item.id !== metric.id) })}><Trash2 size={15} /></IconButton></div><div className="mt-2 grid gap-2 md:grid-cols-2"><PlanField label="Descrição" value={metric.description} onChange={(value) => update(metric.id, "description", value)} multiline disabled={!canEdit} /><PlanField label="Fonte" value={metric.source} onChange={(value) => update(metric.id, "source", value)} disabled={!canEdit} /><PlanField label="Baseline" value={metric.baseline} onChange={(value) => update(metric.id, "baseline", value)} disabled={!canEdit} /><PlanField label="Meta" value={metric.target} onChange={(value) => update(metric.id, "target", value)} disabled={!canEdit} /><PlanField label="Frequência" value={metric.frequency} onChange={(value) => update(metric.id, "frequency", value)} disabled={!canEdit} /><PlanField label="Responsável" value={metric.owner} onChange={(value) => update(metric.id, "owner", value)} disabled={!canEdit} /></div></article>)}{!metrics.length && <EmptyState text="Nenhuma métrica adicionada." />}</div></div>;
}

function PlanInvalidationStep({ plan, patch, canEdit }: { plan: ActionPlan; patch: (p: Partial<ActionPlan>) => void; canEdit: boolean }) {
  const stops = plan.stopConditions ?? [];
  return <div className="mt-4 grid gap-3 xl:grid-cols-[1fr_0.8fr]"><section className="rounded-lg border border-[#D8D8D8] bg-white p-3"><h3 className="text-base font-bold">Quando a hipótese não se sustenta?</h3><div className="mt-3 grid gap-3 md:grid-cols-2"><PlanField label="Critério de invalidação" value={plan.invalidationCriteria} onChange={(value) => patch({ invalidationCriteria: value })} multiline disabled={!canEdit} /><PlanField label="Condição de parada antecipada" value={plan.earlyStop ?? ""} onChange={(value) => patch({ earlyStop: value })} multiline disabled={!canEdit} /><PlanField label="Sinal de alerta" value={plan.alertSignal ?? ""} onChange={(value) => patch({ alertSignal: value })} disabled={!canEdit} /><PlanField label="Responsável pela decisão" value={plan.decisionOwner ?? plan.owner} onChange={(value) => patch({ decisionOwner: value, owner: value })} disabled={!canEdit} /><Field label="Decisão se o critério for atingido"><select className={inputClass(!canEdit)} disabled={!canEdit} value={plan.invalidationDecision ?? ""} onChange={(event) => patch({ invalidationDecision: event.target.value })}><option value="">Selecionar decisão</option>{["Ajustar experimento", "Interromper experimento", "Descartar hipótese", "Voltar para nova hipótese"].map((option) => <option key={option}>{option}</option>)}</select></Field></div></section><section className="rounded-lg border border-[#D8D8D8] bg-[#FAFAF9] p-3"><div className="flex items-center justify-between gap-2"><h3 className="text-base font-bold">Condições de falha</h3>{canEdit && <MiniButton onClick={() => patch({ stopConditions: [...stops, ""] })}><Plus size={14} />Adicionar</MiniButton>}</div><div className="mt-3 grid gap-2">{stops.map((condition, index) => <div key={index} className="flex gap-2"><input className={inputClass(!canEdit)} disabled={!canEdit} value={condition} onChange={(event) => patch({ stopConditions: stops.map((item, itemIndex) => itemIndex === index ? event.target.value : item) })} />{canEdit && <IconButton label="Excluir" onClick={() => patch({ stopConditions: stops.filter((_, itemIndex) => itemIndex !== index) })}><Trash2 size={14} /></IconButton>}</div>)}{!stops.length && <EmptyState text="Nenhuma condição de falha definida." />}</div></section></div>;
}

function PlanField({ label, value, onChange, multiline, disabled }: { label: string; value: string; onChange: (value: string) => void; multiline?: boolean; disabled?: boolean }) {
  return <Field label={label}>{multiline ? <textarea className={textareaClass(disabled)} disabled={disabled} value={value} onChange={(event) => onChange(event.target.value)} /> : <input className={inputClass(disabled)} disabled={disabled} value={value} onChange={(event) => onChange(event.target.value)} />}</Field>;
}

function EditableRiskList({ title, question, items, canEdit, onChange }: { title: string; question: string; items: PlanRisk[]; canEdit: boolean; onChange: (items: PlanRisk[]) => void }) {
  const update = (idValue: string, field: keyof PlanRisk, value: string) => onChange(items.map((item) => item.id === idValue ? { ...item, [field]: field === "impact" ? value as Level : value } : item));
  return <section className="rounded-lg border border-[#F3C7C7] bg-[#FFF7F7] p-3"><div className="flex items-center justify-between gap-2"><div><h3 className="text-base font-bold">{title}</h3><p className="text-sm text-[#5B5650]">{question}</p></div>{canEdit && <MiniButton onClick={() => onChange([...items, { id: id("risk"), risk: "", type: "Operacional", impact: "Médio", mitigation: "" }])}><Plus size={14} />Adicionar</MiniButton>}</div><div className="mt-3 grid gap-2">{items.map((item) => <article key={item.id} className="rounded-md border border-[#F3C7C7] bg-white p-3"><div className="grid gap-2 md:grid-cols-2"><PlanField label="Risco" value={item.risk} onChange={(value) => update(item.id, "risk", value)} disabled={!canEdit} /><Field label="Tipo"><select className={inputClass(!canEdit)} disabled={!canEdit} value={item.type} onChange={(event) => update(item.id, "type", event.target.value)}>{["Fiscal", "Financeiro", "Operacional", "Tecnológico", "Dados", "Governança", "Prazo", "Aderência das áreas"].map((option) => <option key={option}>{option}</option>)}</select></Field><LevelSelect label="Impacto" value={item.impact} onChange={(value) => update(item.id, "impact", value)} disabled={!canEdit} /><PlanField label="Mitigação" value={item.mitigation} onChange={(value) => update(item.id, "mitigation", value)} disabled={!canEdit} /></div>{canEdit && <div className="mt-2"><IconButton label="Excluir" onClick={() => onChange(items.filter((risk) => risk.id !== item.id))}><Trash2 size={14} /></IconButton></div>}</article>)}{!items.length && <EmptyState text="Nenhum risco registrado." />}</div></section>;
}

function EditablePremiseList({ title, question, items, canEdit, onChange }: { title: string; question: string; items: PlanPremise[]; canEdit: boolean; onChange: (items: PlanPremise[]) => void }) {
  const update = (idValue: string, field: keyof PlanPremise, value: string) => onChange(items.map((item) => item.id === idValue ? { ...item, [field]: value } : item));
  return <section className="rounded-lg border border-[#BFE6CB] bg-[#F4FBF6] p-3"><div className="flex items-center justify-between gap-2"><div><h3 className="text-base font-bold">{title}</h3><p className="text-sm text-[#5B5650]">{question}</p></div>{canEdit && <MiniButton onClick={() => onChange([...items, { id: id("premise"), premise: "", area: "", evidence: "", status: "Não validada" }])}><Plus size={14} />Adicionar</MiniButton>}</div><div className="mt-3 grid gap-2">{items.map((item) => <article key={item.id} className="rounded-md border border-[#BFE6CB] bg-white p-3"><div className="grid gap-2 md:grid-cols-2"><PlanField label="Premissa" value={item.premise} onChange={(value) => update(item.id, "premise", value)} disabled={!canEdit} /><PlanField label="Área responsável" value={item.area} onChange={(value) => update(item.id, "area", value)} disabled={!canEdit} /><PlanField label="Evidência necessária" value={item.evidence} onChange={(value) => update(item.id, "evidence", value)} disabled={!canEdit} /><Field label="Status"><select className={inputClass(!canEdit)} disabled={!canEdit} value={item.status} onChange={(event) => update(item.id, "status", event.target.value)}>{["Não validada", "Em validação", "Validada", "Quebrada"].map((option) => <option key={option}>{option}</option>)}</select></Field></div>{canEdit && <div className="mt-2"><IconButton label="Excluir" onClick={() => onChange(items.filter((premise) => premise.id !== item.id))}><Trash2 size={14} /></IconButton></div>}</article>)}{!items.length && <EmptyState text="Nenhuma premissa registrada." />}</div></section>;
}

function IconButton({ label, children, onClick, disabled }: { label: string; children: React.ReactNode; onClick: () => void; disabled?: boolean }) {
  return <button type="button" title={label} aria-label={label} disabled={disabled} onClick={onClick} className="grid h-9 min-w-9 place-items-center rounded-md border border-[#D8D8D8] bg-white px-2 text-sm font-bold text-[#2D2A26] hover:border-[#2D2A26] disabled:cursor-not-allowed disabled:opacity-40">{children}</button>;
}

function moveItem<T>(items: T[], from: number, to: number) {
  const next = [...items];
  const [itemValue] = next.splice(from, 1);
  next.splice(to, 0, itemValue);
  return next;
}
function StagesView({ state, setState }: { state: WorkshopState; setState: React.Dispatch<React.SetStateAction<WorkshopState>> }) {
  const canControl = currentParticipant(state)?.status === "facilitador";
  const openStage = (stageId: string, activity: Activity = "fluxo") => setState((current) => canControl ? ({ ...current, activeStageId: stageId, viewingStageId: "", viewingActivity: "", activeActivity: activity, activeView: "room" }) : ({ ...current, viewingStageId: stageId, viewingActivity: activity, activeView: "room" }));
  return <div className="grid gap-5"><NowPanel state={state} /><section className="rounded-lg border border-[#D8D8D8] bg-white p-5 shadow-sm"><SectionTitle title="Mapa das etapas" subtitle="Visão geral das 6 etapas de Acordos, com progresso, pendências e evidências de validação." /><div className="mt-4 grid gap-4 lg:grid-cols-3">{state.stages.map((s) => <article key={s.id} className="rounded-lg border border-[#D8D8D8] bg-white p-4 text-left shadow-sm"><div className="flex items-start justify-between gap-3"><span className="grid h-9 w-9 place-items-center rounded-full bg-[#2D2A26] text-sm font-bold text-[#FFC629]">{s.order}</span><Badge>{s.status}</Badge></div><h3 className="mt-3 text-lg font-bold">{s.name}</h3><p className="mt-2 text-sm leading-6 text-[#5B5650]">{s.objective}</p><div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs"><SmallStat value={stageProgress(s)} label="atividades" /><SmallStat value={s.pending.length} label="pendências" /><SmallStat value={s.hypotheses.length} label="hipóteses" /><SmallStat value={s.offenders.length} label="ofensores" /><SmallStat value={s.kdd.status === "validado" ? 1 : 0} label="KDD" /><SmallStat value={s.taxImpact.status !== "não avaliado" ? 1 : 0} label="Reforma" /></div><div className="mt-4 flex flex-wrap gap-2">{canControl ? <><MiniButton onClick={() => openStage(s.id)}>Abrir etapa</MiniButton><MiniButton onClick={() => openStage(s.id, validationActivities.find((a) => !isActivityComplete(s, a)) ?? "fluxo")}>Continuar de onde parou</MiniButton><MiniButton onClick={() => openStage(s.id, "fluxo")}>Revisar pendências</MiniButton></> : <Badge tone="bg-[#F6F6F4] text-[#54504A]">{stageProgress(s)}/{validationActivities.length} atividades</Badge>}</div></article>)}</div></section><ParticipantsPanel state={state} /></div>;
}
function SmallStat({ value, label }: { value: number; label: string }) { return <div className="rounded-md bg-[#F6F6F4] px-2 py-2"><div className="font-bold">{value}</div><div className="text-[#756F68]">{label}</div></div>; }
function ParticipantsPanel({ state }: { state: WorkshopState }) {
  const [filter, setFilter] = useState("Todas");
  const visible = state.participants.filter((p) => filter === "Todas" || p.area === filter);
  return <section className="rounded-lg border border-[#D8D8D8] bg-white p-5 shadow-sm"><div className="flex flex-wrap items-center justify-between gap-3"><SectionTitle title="Presença e composição da sala" subtitle="Participantes, áreas representadas e status de presença." /><Badge>{state.participants.length} pessoas</Badge></div><div className="mt-4 flex flex-wrap gap-2"><MiniButton active={filter === "Todas"} onClick={() => setFilter("Todas")}>Todas</MiniButton>{areas.map((a) => <MiniButton key={a} active={filter === a} onClick={() => setFilter(a)}>{a}</MiniButton>)}</div><div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">{visible.map((p) => <article key={p.id} className="rounded-lg bg-[#F6F6F4] p-4"><div className="flex items-start justify-between gap-3"><div><h3 className="font-bold">{p.name}</h3><p className="text-sm text-[#5B5650]">{p.role || "Cargo não informado"}</p></div><Badge>{p.status}</Badge></div><p className="mt-2 text-xs font-bold text-[#756F68]">{p.area} · {p.workshopRole || "papel a definir"}</p></article>)}{!visible.length && <div className="md:col-span-2 xl:col-span-3"><EmptyState text="Nenhum participante cadastrado ainda." /></div>}</div></section>;
}
function Facilitation({ state, setState, updateStage }: { state: WorkshopState; setState: React.Dispatch<React.SetStateAction<WorkshopState>>; updateStage: (stageId: string, fn: (stage: Stage) => Stage) => void }) {
  const openModal = useActionModal();
  const stage = activeStage(state);
  const newCount = state.contributions.filter((c) => c.status === "nova").length;
  const divergences = state.contributions.filter((c) => c.content.toLowerCase().includes("discord") || c.type === "pendência").length;
  const pending = state.contributions.filter((c) => c.status === "pendente de validação").length + state.stages.reduce((sum, s) => sum + s.pending.length, 0);
  const nextStageForFacilitation = state.stages[stageIndex(state) + 1];
  const nextActivityForFacilitation = nextValidationActivity(state.activeActivity);
  const advanceNow = () => setState((s) => validationActivities.includes(s.activeActivity) && s.activeActivity !== "hipoteses" ? ({ ...s, activeActivity: nextValidationActivity(s.activeActivity), activeView: "room" }) : nextStageForFacilitation ? ({ ...s, activeStageId: nextStageForFacilitation.id, activeActivity: "fluxo", activeView: "room" }) : ({ ...s, activeView: "summary" }));
  const missing = validationMissing(stage);
  const markValidated = () => {
    if (missing.length) {
      openModal({ title: "Ainda não é possível validar", message: missing.join("\n"), confirmLabel: "Entendi", onSubmit: () => undefined });
      return;
    }
    updateStage(stage.id, (s) => ({ ...s, status: "validada" }));
  };
  return (
    <div className="grid gap-5">
      <section className="rounded-lg border border-[#D8D8D8] bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-3"><SectionTitle title="Painel de facilitação" subtitle="Controle discreto da etapa ativa, atividade, rodada, consolidação e avanço do workshop." /><Badge>{state.roundStatus}</Badge></div>
        <div className="mt-4 grid gap-3 md:grid-cols-4"><Metric value={stage.name} label="etapa ativa" /><Metric value={activityLabels[state.activeActivity]} label="atividade ativa" /><Metric value={nextStageForFacilitation?.name ?? "Resumo final"} label="próxima etapa" /><Metric value={activityShortLabels[nextActivityForFacilitation]} label="próxima atividade" /><Metric value={String(newCount)} label="contribuições novas" /><Metric value={String(divergences)} label="divergências" /><Metric value={String(pending)} label="pendências" /></div>
        <div className="mt-5 grid gap-3 lg:grid-cols-3">
          <Field label="Etapa ativa"><select className={inputClass()} value={state.activeStageId} onChange={(e) => setState((s) => ({ ...s, activeStageId: e.target.value }))}>{state.stages.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}</select></Field>
          <Field label="Atividade ativa"><select className={inputClass()} value={state.activeActivity} onChange={(e) => setState((s) => ({ ...s, activeActivity: e.target.value as Activity }))}>{activities.map((a) => <option key={a} value={a}>{activityLabels[a]}</option>)}</select></Field>
          <Field label="Tempo da rodada"><input type="number" className={inputClass()} value={state.roundMinutes} onChange={(e) => setState((s) => ({ ...s, roundMinutes: Number(e.target.value) }))} /></Field>
        </div>
        {missing.length > 0 && <div className="mt-4 rounded-lg border border-[#F3C7C7] bg-[#FFF7F7] p-4"><h3 className="font-bold">Critérios pendentes para validar a etapa</h3><ul className="mt-2 grid gap-1 text-sm leading-6 text-[#5B5650]">{missing.map((m) => <li key={m}>{m}</li>)}</ul></div>}
        <div className="mt-4 flex flex-wrap gap-2">
          <PrimaryButton onClick={() => setState((s) => ({ ...s, roundStatus: "aberta" }))}>Abrir rodada</PrimaryButton>
          <SecondaryButton onClick={() => setState((s) => ({ ...s, roundStatus: "encerrada" }))}>Fechar rodada</SecondaryButton>
          <SecondaryButton onClick={() => setState((s) => ({ ...s, roundStatus: "em consolidação" }))}>Consolidar</SecondaryButton>
          <SecondaryButton disabled={missing.length > 0} onClick={markValidated}><CheckCircle2 size={17} />Marcar validado</SecondaryButton>
          <SecondaryButton onClick={() => updateStage(stage.id, (s) => ({ ...s, pending: ["Pendência marcada pela facilitação", ...s.pending] }))}><AlertTriangle size={17} />Marcar pendência</SecondaryButton>
          <PrimaryButton onClick={advanceNow}>Avançar agora</PrimaryButton>
          <SecondaryButton onClick={() => setState((s) => ({ ...s, activeActivity: nextActivity(s.activeActivity) }))}>Avançar atividade</SecondaryButton>
          <SecondaryButton onClick={() => setState((s) => ({ ...s, activeView: "summary" }))}><Download size={17} />Gerar resumo</SecondaryButton>
        </div>
      </section>
      <Feed state={state} />
    </div>
  );
}
function nextActivity(a: Activity): Activity { const i = activities.indexOf(a); return activities[Math.min(i + 1, activities.length - 1)]; }
function HypothesesView({ state, updateStage }: { state: WorkshopState; updateStage: (stageId: string, fn: (stage: Stage) => Stage) => void }) {
  const all = state.stages.flatMap((s) => s.hypotheses.map((h) => ({ s, h })));
  return <div className="grid gap-4"><NowPanel state={state} />{all.map(({ h }) => <HypothesisCard key={h.id} h={h} state={state} updateStage={updateStage} />)}{!all.length && <EmptyState text="Nenhuma hipótese criada ainda." />}</div>;
}
function Summary({ state }: { state: WorkshopState }) {
  const html = useMemo(() => buildHtml(state), [state]);
  const text = useMemo(() => buildText(state), [state]);
  const exportJson = () => { const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" }); const url = URL.createObjectURL(blob); const link = document.createElement("a"); link.href = url; link.download = "workspace-workshop-acordos.json"; link.click(); URL.revokeObjectURL(url); };
  const represented = new Set(state.participants.map((p) => p.area)).size;
  const validated = state.stages.filter((s) => s.status === "validada" || s.status === "com pendências").length;
  const kdds = state.stages.filter((s) => s.kdd.status === "validado").length;
  const tax = state.stages.filter((s) => s.taxImpact.answer && s.taxImpact.answer !== "Não").length;
  const hypotheses = state.stages.reduce((sum, s) => sum + s.hypotheses.length, 0);
  const prioritized = state.stages.reduce((sum, s) => sum + s.hypotheses.filter((h) => h.priorityStatus === "Prioritária").length, 0);
  const plans = state.stages.reduce((sum, s) => sum + s.plans.length, 0);
  const canExport = currentParticipant(state)?.status === "facilitador";
  return <div className="grid gap-5"><section className="rounded-lg border border-[#D8D8D8] bg-white p-5 shadow-sm"><div className="flex flex-wrap items-start justify-between gap-3"><SectionTitle title="Resumo final colaborativo" subtitle="Consolidação do que foi produzido por todos na sala." />{canExport && <div className="flex flex-wrap gap-2"><PrimaryButton onClick={exportJson}><FileJson size={17} />JSON</PrimaryButton><SecondaryButton onClick={() => navigator.clipboard.writeText(html)}><Download size={17} />HTML</SecondaryButton><SecondaryButton onClick={() => navigator.clipboard.writeText(text)}><FileText size={17} />Texto</SecondaryButton></div>}</div><div className="mt-5 grid gap-3 md:grid-cols-4"><Metric value={String(state.participants.length)} label="participantes" /><Metric value={String(represented)} label="áreas" /><Metric value={`${validated}/6`} label="etapas validadas" /><Metric value={`${kdds}/6`} label="KDDs validados" /><Metric value={String(tax)} label="impactos Reforma" /><Metric value={String(hypotheses)} label="hipóteses" /><Metric value={String(prioritized)} label="priorizadas" /><Metric value={String(plans)} label="planos" /></div></section>{state.stages.map((s) => <StageSummary key={s.id} stage={s} />)}{canExport && <section className="rounded-lg border border-[#D8D8D8] bg-white p-5"><SectionTitle title="Texto estruturado" subtitle="Pronto para copiar em documentação." /><textarea readOnly className={`${textareaClass()} mt-4 min-h-80 font-mono text-xs`} value={text} /></section>}</div>;
}
function StageSummary({ stage }: { stage: Stage }) {
  const kpiSummary = [...(stage.kpiItems ?? []).map((item) => `${item.title || "KPI / Meta"}: ${item.text}`), stage.kpis.status, stage.kpis.message, ...stage.kpis.items];
  return <article className="rounded-lg border border-[#D8D8D8] bg-white p-5"><div className="flex flex-wrap items-center justify-between gap-3"><div><h3 className="text-xl font-bold">{stage.name}</h3>{stage.origin && <p className="mt-1 text-xs font-bold uppercase tracking-[0.12em] text-[#756F68]">{stage.origin}</p>}</div><Badge>{stage.status}</Badge></div><div className="mt-4 grid gap-4 lg:grid-cols-2"><SummaryPanel title="Impacto Reforma Tributária" items={[stage.taxImpact.answer || "Não avaliado", stage.taxImpact.expectedImpact, stage.taxImpact.obligation]} /><SummaryPanel title="KPIs / Metas" items={kpiSummary} /><SummaryPanel title="KDD" items={[stage.kdd.final || stage.kdd.draft]} /><SummaryPanel title="Dores validadas" items={stage.pains.filter((i) => i.status === "validado").map((i) => i.text)} /><SummaryPanel title="Regras críticas" items={stage.rules.filter((i) => i.impact === "Alto").map((i) => i.text)} /><SummaryPanel title="Necessidades priorizadas" items={stage.needs.filter((i) => i.impact !== "Baixo").map((i) => i.text)} /><SummaryPanel title="Perguntas em aberto" items={stage.openQuestions.map((i) => i.text)} /><SummaryPanel title="Hipóteses criadas" items={stage.hypotheses.map((h) => h.text)} /><SummaryPanel title="Ofensores identificados" items={stage.offenders.map((o) => `${o.type}: ${o.content}`)} /><SummaryPanel title="Planos de ação" items={stage.plans.map((p) => p.action || p.nextStep || "Plano em construção")} /><SummaryPanel title="Responsáveis" items={stage.plans.map((p) => p.owner).filter(Boolean)} /><SummaryPanel title="Pendências" items={stage.pending} /></div></article>;
}
function SummaryPanel({ title, items }: { title: string; items: string[] }) {
  const clean = items.filter(Boolean);
  return <div className="rounded-lg bg-[#F6F6F4] p-4"><h4 className="text-sm font-bold uppercase tracking-[0.12em] text-[#756F68]">{title}</h4>{clean.length ? <ul className="mt-3 grid gap-2 text-sm leading-6">{clean.map((x, i) => <li key={`${x}-${i}`}>{x}</li>)}</ul> : <p className="mt-3 text-sm text-[#756F68]">Sem registros.</p>}</div>;
}
function escapeHtml(value: string) { return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;"); }
function listHtml(items: string[]) { const clean = items.filter(Boolean); return clean.length ? `<ul>${clean.map((x) => `<li>${escapeHtml(x)}</li>`).join("")}</ul>` : "<p>Sem registros.</p>"; }
function buildHtml(state: WorkshopState) {
  return `<section><h1>Workshop de Acordos - Resumo colaborativo</h1><p><strong>Participantes:</strong> ${state.participants.length}</p><p><strong>Áreas representadas:</strong> ${new Set(state.participants.map((p) => p.area)).size}</p>${state.stages.map((s) => `<article><h2>${escapeHtml(s.name)}</h2><p><strong>Origem:</strong> ${escapeHtml(s.origin || "Workshop")}</p><h3>KDD</h3>${listHtml([s.kdd.final || s.kdd.draft])}<h3>KPIs / Metas</h3>${listHtml([...(s.kpiItems ?? []).map((item) => `${item.title || "KPI / Meta"}: ${item.text}`), s.kpis.status, s.kpis.message, ...s.kpis.items])}<h3>Perguntas em aberto</h3>${listHtml(s.openQuestions.map((q) => q.text))}<h3>Hipóteses</h3>${listHtml(s.hypotheses.map((h) => h.text))}<h3>Ofensores</h3>${listHtml(s.offenders.map((o) => `${o.type}: ${o.content}`))}<h3>Planos de ação</h3>${listHtml(s.plans.map((p) => p.action || p.nextStep))}</article>`).join("")}</section>`;
}
function buildText(state: WorkshopState) {
  const lines = ["WORKSHOP DE ACORDOS - RESUMO COLABORATIVO", "", `Participantes: ${state.participants.length}`, `Áreas representadas: ${new Set(state.participants.map((p) => p.area)).size}`, ""];
  state.stages.forEach((s) => { lines.push(`ETAPA: ${s.name}`, `Status: ${s.status}`, `Origem: ${s.origin || "Workshop"}`, `Reforma Tributária: ${s.taxImpact.answer || "Não avaliado"}`, `KPIs / Metas: ${[...(s.kpiItems ?? []).map((item) => `${item.title || "KPI / Meta"}: ${item.text}`), s.kpis.status, s.kpis.message, ...s.kpis.items].filter(Boolean).join(" | ") || "Sem registros"}`, `KDD: ${s.kdd.final || s.kdd.draft}`, `Perguntas em aberto: ${s.openQuestions.map((q) => q.text).join(" | ") || "Sem registros"}`, `Hipóteses: ${s.hypotheses.map((h) => h.text).join(" | ") || "Sem registros"}`, `Ofensores: ${s.offenders.map((o) => o.content).join(" | ") || "Sem registros"}`, `Planos: ${s.plans.map((p) => p.action || p.nextStep).join(" | ") || "Sem registros"}`, ""); });
  return lines.join("\n");
}

export default function WorkspaceWorkshopApp() {
  const { state, setState, updateStage } = useWorkshopState();
  const participant = currentParticipant(state);
  const [workshopStarted, setWorkshopStarted] = useState(false);
  useEffect(() => {
    if (!participant) {
      setWorkshopStarted(false);
      return;
    }
    setWorkshopStarted(sessionStorage.getItem(workshopStartedKey(participant.id)) === "true");
  }, [participant?.id]);
  const startWorkshop = () => {
    if (!participant) return;
    sessionStorage.setItem(workshopStartedKey(participant.id), "true");
    setWorkshopStarted(true);
    setState((current) => participant.status === "facilitador"
      ? ({ ...current, activeView: "room", activeStageId: "etapa-1", activeActivity: "fluxo", viewingStageId: "", viewingActivity: "" })
      : ({ ...current, activeView: "room", viewingStageId: "etapa-1", viewingActivity: "fluxo" }));
  };
  if (!participant) return <ActionModalProvider><EntryScreen setState={setState} /></ActionModalProvider>;
  if (!workshopStarted) return <ActionModalProvider><WorkshopOpening state={state} setState={setState} onStart={startWorkshop} /></ActionModalProvider>;
  return <ActionModalProvider><AppShell state={state} setState={setState}>{state.activeView === "room" && <Room state={state} setState={setState} updateStage={updateStage} />}{state.activeView === "stages" && <StagesView state={state} setState={setState} />}{state.activeView === "hypotheses" && <HypothesesView state={state} updateStage={updateStage} />}{state.activeView === "prioritization" && <Prioritization state={state} updateStage={updateStage} />}{state.activeView === "plans" && <Plans state={state} updateStage={updateStage} />}{state.activeView === "summary" && <Summary state={state} />}{state.activeView === "facilitation" && participant.status === "facilitador" && <Facilitation state={state} setState={setState} updateStage={updateStage} />}</AppShell></ActionModalProvider>;
}
