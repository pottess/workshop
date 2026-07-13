import React, { useState } from "react";
import { toast } from "sonner";
import {
  ChevronRight,
  Filter,
  Download,
  Eye,
  Truck,
  PackagePlus,
  X,
  AlertTriangle,
  Calendar,
  Check,
  FileText,
  Upload,
} from "lucide-react";
import {
  ClbStatus,
  ClbPagination,
  ClbSelect,
  ClbInputText,
  type ClbStatusVariant,
} from "./ClbComponents";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
  DialogFooter, DialogDescription,
} from "./ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "./ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "./ui/tooltip";
import * as RadixDialog from "@radix-ui/react-dialog";
import svgDrawer from "../../imports/ClbDrawerAtualizado/svg-bkd027awmb";

// ─── Constants ────────────────────────────────────────────────────────────────

const IBM = "'IBM Plex Sans', system-ui, sans-serif";
const CORA_ORANGE = "#fd9d1e";

// ─── Types ────────────────────────────────────────────────────────────────────

type TipoOS = "instalacao" | "recolha";

interface OSRow {
  id: string;
  operacao: string;
  pdv: string;
  tipo: TipoOS;
  ticket: string;
  equipamento: string;
  manual?: boolean;
  criacao: string;
  status: string;
  ultimaAtualizacao: string;
}

// ─── Mock data ────────────────────────────────────────────────────────────────

const MOCK_ROWS: OSRow[] = [
  { id: "1", operacao: "CDD Sapucaia do Sul", pdv: "10034 · Sapucaia do Sul",    tipo: "instalacao", ticket: "Z510233",    equipamento: "Cooler",           criacao: "12/06/2026", status: "Instalação produtiva",  ultimaAtualizacao: "12/06/2026" },
  { id: "2", operacao: "CDD Campinas",         pdv: "95252 · Fernando Lima",      tipo: "recolha",    ticket: "C16799833",  equipamento: "2 equipamentos",   criacao: "12/06/2026", status: "Aguardando recolha",    ultimaAtualizacao: "12/06/2026" },
  { id: "3", operacao: "Ribeirão Preto",        pdv: "66723 · Distribuidora Sul",  tipo: "recolha",    ticket: "C16799742",  equipamento: "Freezer Skol 300L",criacao: "12/06/2026", status: "Recolha em andamento",  ultimaAtualizacao: "12/06/2026" },
  { id: "4", operacao: "CDD Contagem",          pdv: "7556 · PDV Centro",          tipo: "instalacao", ticket: "Z510189",    equipamento: "Chopeira",         criacao: "10/06/2026", status: "Aguardando reserva",    ultimaAtualizacao: "10/06/2026" },
  { id: "5", operacao: "Salvador",              pdv: "881 · Fernando Ltda",        tipo: "recolha",    ticket: "C16785701",  equipamento: "Cooler",           criacao: "11/06/2026", status: "Recolhido",             ultimaAtualizacao: "11/06/2026" },
  { id: "6", operacao: "CDD Natal",             pdv: "15423 · Distribuidora Norte",tipo: "instalacao", ticket: "Z509822",    equipamento: "Ice Machine",      criacao: "08/06/2026", status: "Encerrada",             ultimaAtualizacao: "09/06/2026" },
  { id: "7", operacao: "CDD Curitiba",          pdv: "22890 · PDV Sul",            tipo: "recolha",    ticket: "C16800012",  equipamento: "Cooler 240L", manual: true, criacao: "13/06/2026", status: "Aguardando recolha", ultimaAtualizacao: "13/06/2026" },
];

// ─── Status variant mapping ───────────────────────────────────────────────────

function statusVariant(status: string): ClbStatusVariant {
  switch (status) {
    case "Instalação produtiva":
    case "Recolhido":
      return "positive";
    case "Recolha em andamento":
      return "warning";
    case "Instalação improdutiva":
    case "Recolha cancelada":
      return "negative";
    case "Aguardando recolha":
    case "Aguardando reserva":
    case "Encerrada":
    default:
      return "neutral";
  }
}

// ─── Tipo de solicitação cell ─────────────────────────────────────────────────

function TipoCell({ tipo }: { tipo: TipoOS }) {
  const Icon = tipo === "instalacao" ? PackagePlus : Truck;
  return (
    <div className="flex items-center gap-1.5">
      <Icon style={{ width: "14px", height: "14px", color: "#9CA3AF", flexShrink: 0 }} />
      <span style={{ fontFamily: IBM, fontSize: "13px", color: "#6B7280" }}>
        {tipo === "instalacao" ? "Instalação" : "Recolha"}
      </span>
    </div>
  );
}

// ─── Advanced filters panel ───────────────────────────────────────────────────

function FiltrosAvancadosPanel({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [operacao, setOperacao] = useState("");
  const [tipo, setTipo] = useState("");
  const [status, setStatus] = useState("");
  const [modalidade, setModalidade] = useState("");

  return (
    <RadixDialog.Root open={open} onOpenChange={(v) => !v && onClose()}>
      <RadixDialog.Portal>
        <RadixDialog.Overlay className="fixed inset-0 z-50 bg-black/30 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <RadixDialog.Content
          className="fixed inset-y-0 right-0 z-50 flex flex-col bg-white shadow-xl data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:slide-in-from-right data-[state=closed]:slide-out-to-right data-[state=closed]:duration-300 data-[state=open]:duration-500"
          style={{ width: "360px" }}
        >
          {/* Header */}
          <RadixDialog.Title className="sr-only">Filtros avançados</RadixDialog.Title>
          <RadixDialog.Description className="sr-only">Painel de filtros avançados para solicitações</RadixDialog.Description>
          <div className="flex items-center justify-between flex-shrink-0 px-6 py-5" style={{ borderBottom: "1px solid #E5E7EB" }}>
            <div className="flex items-center gap-2">
              <Filter style={{ width: "16px", height: "16px", color: "#6B7280" }} />
              <span style={{ fontFamily: IBM, fontWeight: 600, fontSize: "16px", color: "#111827" }}>
                Filtros avançados
              </span>
            </div>
            <button
              onClick={onClose}
              className="hover:bg-gray-100 rounded transition-colors"
              style={{ padding: "6px", background: "none", border: "none", cursor: "pointer" }}
            >
              <X style={{ width: "16px", height: "16px", color: "#6B7280" }} />
            </button>
          </div>

          {/* Filters */}
          <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-5">
            <ClbSelect
              label="Operação"
              required
              placeholder="Selecione a operação"
              value={operacao}
              onChange={setOperacao}
              options={[
                { value: "cdd-campinas", label: "CDD Campinas" },
                { value: "cdd-sapucaia", label: "CDD Sapucaia do Sul" },
                { value: "cdd-contagem", label: "CDD Contagem" },
                { value: "ribeirão-preto", label: "Ribeirão Preto" },
                { value: "salvador", label: "Salvador" },
                { value: "cdd-natal", label: "CDD Natal" },
                { value: "cdd-curitiba", label: "CDD Curitiba" },
              ]}
            />
            <ClbSelect
              label="Tipo de solicitação"
              placeholder="Todas"
              value={tipo}
              onChange={setTipo}
              options={[
                { value: "todas", label: "Todas" },
                { value: "instalacao", label: "Instalação" },
                { value: "recolha", label: "Recolha" },
              ]}
            />
            <ClbInputText label="Código do PDV" placeholder="Ex.: 95252" />
            <ClbInputText label="Ticket / número da OS" placeholder="Ex.: Z510233" />
            <ClbInputText label="Equipamento" placeholder="Ex.: Cooler, Freezer" />
            <ClbSelect
              label="Status"
              placeholder="Selecione um status"
              value={status}
              onChange={setStatus}
              options={[
                { value: "ag-reserva",  label: "Aguardando reserva" },
                { value: "inst-prod",   label: "Instalação produtiva" },
                { value: "inst-improd", label: "Instalação improdutiva" },
                { value: "ag-recolha",  label: "Aguardando recolha" },
                { value: "rec-and",     label: "Recolha em andamento" },
                { value: "recolhido",   label: "Recolhido" },
                { value: "rec-cancel",  label: "Recolha cancelada" },
                { value: "encerrada",   label: "Encerrada" },
              ]}
            />
            <div>
              <p style={{ fontFamily: IBM, fontWeight: 500, fontSize: "14px", color: "#0e0e0e", marginBottom: "8px" }}>
                Período de solicitação
              </p>
              <div className="flex gap-3">
                <ClbInputText type="date" />
                <ClbInputText type="date" />
              </div>
            </div>
            <ClbSelect
              label="Modalidade"
              placeholder="Selecione a modalidade"
              value={modalidade}
              onChange={setModalidade}
              options={[
                { value: "comodato", label: "Comodato" },
                { value: "aluguel",  label: "Aluguel" },
                { value: "venda",    label: "Venda" },
              ]}
            />
            <ClbInputText label="Solicitante" placeholder="Nome ou matrícula" />
          </div>

          {/* Footer */}
          <div
            className="flex-shrink-0 flex items-center justify-end gap-3 px-6 py-4"
            style={{ borderTop: "1px solid #E5E7EB" }}
          >
            <button
              onClick={onClose}
              className="hover:bg-gray-50 transition-colors"
              style={{
                height: "40px",
                padding: "0 16px",
                borderRadius: "2px",
                border: "1.6px solid #0e0e0e",
                backgroundColor: "white",
                cursor: "pointer",
                fontFamily: IBM,
                fontWeight: 500,
                fontSize: "14px",
                color: "#0e0e0e",
              }}
            >
              Limpar filtros
            </button>
            <button
              onClick={onClose}
              className="hover:opacity-90 transition-opacity"
              style={{
                height: "40px",
                padding: "0 16px",
                borderRadius: "2px",
                border: "none",
                backgroundColor: CORA_ORANGE,
                cursor: "pointer",
                fontFamily: IBM,
                fontWeight: 500,
                fontSize: "14px",
                color: "#0e0e0e",
              }}
            >
              Aplicar
            </button>
          </div>
        </RadixDialog.Content>
      </RadixDialog.Portal>
    </RadixDialog.Root>
  );
}

// ─── Detail Drawer ────────────────────────────────────────────────────────────

function DetailDrawer({
  row,
  onClose,
}: {
  row: OSRow | null;
  onClose: () => void;
}) {
  const [tab, setTab] = useState<"detalhes" | "historico">("detalhes");

  const historyEvents = row ? [
    { date: row.criacao + " 09:00", label: row.tipo === "instalacao" ? "Aguardando reserva" : "Aguardando recolha", desc: "Solicitação criada por 123456@ambev.com.br" },
    { date: row.criacao + " 09:01", label: "Processando", desc: "Solicitação registrada no sistema" },
    ...(row.status !== "Aguardando reserva" && row.status !== "Aguardando recolha"
      ? [{ date: row.ultimaAtualizacao + " 14:30", label: row.status, desc: `Status atualizado para "${row.status}"` }]
      : []),
  ] : [];

  const dotColor = (label: string) => {
    switch (statusVariant(label)) {
      case "positive": return "#08663B";
      case "warning":  return "#DB5C00";
      case "negative": return "#AE1E1E";
      default:         return "#666666";
    }
  };

  return (
    <RadixDialog.Root open={!!row} onOpenChange={(v) => !v && onClose()}>
      <RadixDialog.Portal>
        <RadixDialog.Overlay className="fixed inset-0 z-50 bg-black/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <RadixDialog.Content
          className="fixed inset-y-0 right-0 z-50 flex flex-col bg-white shadow-xl data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:slide-in-from-right data-[state=closed]:slide-out-to-right data-[state=closed]:duration-300 data-[state=open]:duration-500"
          style={{ width: "420px" }}
        >
          <RadixDialog.Title className="sr-only">Detalhes da OS</RadixDialog.Title>
          <RadixDialog.Description className="sr-only">Informações detalhadas da ordem de serviço</RadixDialog.Description>
          {/* CLB Heading */}
          <div className="flex-shrink-0 bg-white" style={{ height: "100px" }}>
            <div className="flex items-start size-full" style={{ padding: "16px 16px 16px 24px", gap: "48px" }}>
              <div className="flex flex-col flex-1 min-w-0 gap-[12px]" style={{ paddingTop: "4px" }}>
                <p className="overflow-hidden text-ellipsis whitespace-nowrap w-full" style={{ fontFamily: IBM, fontWeight: 500, fontSize: "20px", lineHeight: "20px", color: "#0e0e0e" }}>
                  Detalhes da OS
                </p>
                {row && (
                  <p className="overflow-hidden text-ellipsis w-full" style={{ fontFamily: IBM, fontWeight: 400, fontSize: "14px", lineHeight: "16px", color: "#666" }}>
                    {row.ticket} — {row.operacao}
                  </p>
                )}
              </div>
              <button
                onClick={onClose}
                className="flex-shrink-0 flex items-center justify-center rounded-[2px] hover:bg-gray-100 transition-colors"
                style={{ width: "32px", height: "32px", background: "none", border: "none", cursor: "pointer" }}
              >
                <div style={{ position: "relative", width: "20px", height: "20px" }}>
                  <div style={{ position: "absolute", inset: "25.74% 22.79% 22.79% 25.74%" }}>
                    <div style={{ position: "absolute", inset: "3.25%" }}>
                      <svg style={{ display: "block", width: "100%", height: "100%" }} fill="none" viewBox="0 0 9.62447 9.62447">
                        <path d={svgDrawer.p17530280} fill="#0E0E0E" />
                      </svg>
                    </div>
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex-shrink-0 relative" style={{ borderBottom: "1px solid #f2f2f2" }}>
            <div className="flex" style={{ height: "48px" }}>
              {(["detalhes", "historico"] as const).map((t) => {
                const active = tab === t;
                return (
                  <button
                    key={t}
                    onClick={() => setTab(t)}
                    className="flex flex-col flex-shrink-0"
                    style={{ height: "48px", background: "none", border: "none", cursor: "pointer", padding: 0 }}
                  >
                    <div className="flex items-center justify-center" style={{ flex: 1, minHeight: "44px", padding: "0 24px" }}>
                      <span style={{ fontFamily: IBM, fontWeight: active ? 600 : 400, fontSize: "16px", lineHeight: "16px", color: "#0e0e0e", whiteSpace: "nowrap" }}>
                        {t === "detalhes" ? "Detalhes" : "Histórico"}
                      </span>
                    </div>
                    <div style={{ height: "4px", backgroundColor: active ? CORA_ORANGE : "transparent" }} />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto" style={{ padding: "24px" }}>
            {tab === "detalhes" && row && (
              <div>
                {/* Manual badge */}
                {row.manual && (
                  <div
                    className="flex items-center gap-2 rounded p-3 mb-4"
                    style={{ backgroundColor: "#FFFBEB", border: "1px solid #FDE68A" }}
                  >
                    <AlertTriangle style={{ width: "14px", height: "14px", color: "#D97706", flexShrink: 0 }} />
                    <div>
                      <p style={{ fontFamily: IBM, fontWeight: 600, fontSize: "12px", color: "#92400E" }}>
                        Equipamento informado manualmente
                      </p>
                      <p style={{ fontFamily: IBM, fontWeight: 400, fontSize: "11px", color: "#B45309" }}>
                        Não encontrado no cadastro original do PDV
                      </p>
                    </div>
                  </div>
                )}

                {/* Info rows */}
                {[
                  { label: "Ticket / OS",       value: row.ticket },
                  { label: "Tipo",              value: row.tipo === "instalacao" ? "Instalação" : "Recolha" },
                  { label: "Operação",          value: row.operacao },
                  { label: "PDV",               value: row.pdv },
                  { label: "Modalidade",        value: "Comodato" },
                  { label: "Equipamento(s)",    value: row.equipamento },
                  { label: "Data de criação",   value: row.criacao },
                  { label: "Última atualização",value: row.ultimaAtualizacao },
                  { label: "Solicitante",       value: "123456@ambev.com.br" },
                ].map(({ label, value }, i) => (
                  <div
                    key={label}
                    className="flex flex-col gap-0.5 py-2.5"
                    style={{ borderBottom: i < 8 ? "1px solid #F3F4F6" : "none" }}
                  >
                    <span style={{ fontFamily: IBM, fontWeight: 500, fontSize: "10px", color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                      {label}
                    </span>
                    <span style={{ fontFamily: IBM, fontSize: "13px", color: "#111827" }}>{value}</span>
                  </div>
                ))}

                {/* Status */}
                <div className="flex flex-col gap-1 py-2.5">
                  <span style={{ fontFamily: IBM, fontWeight: 500, fontSize: "10px", color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    Status
                  </span>
                  <ClbStatus variant={statusVariant(row.status)} label={row.status} />
                </div>

                {/* Manual equipment details */}
                {row.manual && (
                  <div className="mt-4 rounded-lg overflow-hidden" style={{ border: "1px solid #E5E7EB" }}>
                    <div className="px-3 py-2.5" style={{ backgroundColor: "#FAFAFA", borderBottom: "1px solid #E5E7EB" }}>
                      <span style={{ fontFamily: IBM, fontWeight: 600, fontSize: "12px", color: "#374151" }}>
                        Dados do equipamento (manual)
                      </span>
                    </div>
                    <div className="p-3 grid grid-cols-2 gap-3">
                      {[
                        { label: "Tipo",    value: "Cooler" },
                        { label: "Marca",   value: "Brahma" },
                        { label: "Modelo",  value: "Cooler 240L" },
                        { label: "Voltagem",value: "220v" },
                        { label: "Etiqueta / RG", value: "Serial não informado" },
                      ].map(({ label, value }) => (
                        <div key={label}>
                          <p style={{ fontFamily: IBM, fontSize: "10px", color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: "2px" }}>{label}</p>
                          <p style={{ fontFamily: IBM, fontSize: "12px", color: "#374151", fontWeight: 500 }}>{value}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {tab === "historico" && row && (
              <div className="relative">
                <div className="absolute left-2 top-0 bottom-0 bg-gray-200" style={{ width: "2px", zIndex: 0 }} />
                <div className="flex flex-col gap-0">
                  {historyEvents.map((ev, i) => (
                    <div key={i} className="relative flex gap-4 pb-6 last:pb-0" style={{ paddingLeft: "24px" }}>
                      <div
                        className="absolute rounded-full"
                        style={{ left: 0, top: "4px", width: "18px", height: "18px", zIndex: 1, border: "3px solid white", boxShadow: "0 0 0 1px #E5E7EB", backgroundColor: dotColor(ev.label) }}
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <ClbStatus variant={statusVariant(ev.label)} label={ev.label} />
                          <span style={{ fontSize: "11px", color: "#9CA3AF", fontFamily: IBM }}>{ev.date}</span>
                        </div>
                        <p style={{ fontSize: "12px", color: "#6B7280", fontFamily: IBM }}>{ev.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </RadixDialog.Content>
      </RadixDialog.Portal>
    </RadixDialog.Root>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export interface GestaoSolicitacoesPageProps {
  onDocOS?: () => void;
  onDocComprovante?: () => void;
}

export function GestaoSolicitacoesPage({ onDocOS, onDocComprovante }: GestaoSolicitacoesPageProps = {}) {
  // ── Filters / pagination
  const [tipoFiltro, setTipoFiltro] = useState("todas");
  const [operacaoFiltro, setOperacaoFiltro] = useState("");
  const [showFiltros, setShowFiltros] = useState(false);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  // ── Row data (stateful so status updates work)
  const [allRows, setAllRows] = useState<OSRow[]>(MOCK_ROWS);
  const rows = allRows.filter((r) => tipoFiltro === "todas" || r.tipo === tipoFiltro);

  // ── Detail drawer
  const [detailRow, setDetailRow] = useState<OSRow | null>(null);

  // ── Schedule modal
  const [schedulingRow, setSchedulingRow] = useState<OSRow | null>(null);
  const [scheduleDate, setScheduleDate] = useState("");
  const [schedulePeriod, setSchedulePeriod] = useState("");
  const [scheduleLogistica, setScheduleLogistica] = useState("");
  const [scheduleObs, setScheduleObs] = useState("");

  // ── Finalize modal
  const [finalizingRow, setFinalizingRow] = useState<OSRow | null>(null);
  const [finalizeResult, setFinalizeResult] = useState<"productive" | "improductive">("productive");
  const [finalizeMotivo, setFinalizeMotivo] = useState("");
  const [finalizeEstado, setFinalizeEstado] = useState("");
  const [finalizeObs, setFinalizeObs] = useState("");

  // ── Print dropdown
  const [printOpenId, setPrintOpenId] = useState<string | null>(null);

  // ── No-schedule warning (comprovante before scheduling)
  const [noScheduleRow, setNoScheduleRow] = useState<OSRow | null>(null);

  // ── Action predicates (recolha-specific statuses)
  const canSchedule = (s: string) => s === "Aguardando recolha";
  const canReschedule = (s: string) => s === "Recolha em andamento";
  const canFinalize = (s: string) => s === "Recolha em andamento";

  // ── Handlers
  const handleScheduleConfirm = () => {
    if (!schedulingRow) return;
    setAllRows((prev) =>
      prev.map((r) =>
        r.id === schedulingRow.id
          ? { ...r, status: "Recolha em andamento", ultimaAtualizacao: "12/06/2026" }
          : r
      )
    );
    toast.success("Recolha agendada com sucesso.");
    setSchedulingRow(null);
    setScheduleDate(""); setSchedulePeriod(""); setScheduleLogistica(""); setScheduleObs("");
  };

  const handleFinalizeConfirm = () => {
    if (!finalizingRow) return;
    const newStatus = finalizeResult === "productive" ? "Recolhido" : "Recolha cancelada";
    setAllRows((prev) =>
      prev.map((r) =>
        r.id === finalizingRow.id
          ? { ...r, status: newStatus, ultimaAtualizacao: "12/06/2026" }
          : r
      )
    );
    toast.success(
      finalizeResult === "productive"
        ? "Recolha finalizada com sucesso."
        : "Recolha marcada como cancelada."
    );
    setFinalizingRow(null);
    setFinalizeMotivo(""); setFinalizeEstado(""); setFinalizeObs("");
  };

  return (
    <TooltipProvider delayDuration={300}>
      <div className="min-h-screen bg-gray-50">
        <div className="px-8 py-6" style={{ maxWidth: "1440px", margin: "0 auto" }}>

          {/* Breadcrumb */}
          <nav className="flex items-center gap-1 mb-5" style={{ fontSize: "13px", color: "#6B7280", fontFamily: IBM }}>
            <span className="hover:text-gray-700 cursor-pointer">Início</span>
            <ChevronRight style={{ width: "14px", height: "14px" }} />
            <span className="hover:text-gray-700 cursor-pointer">Equipamentos de Refrigeração</span>
            <ChevronRight style={{ width: "14px", height: "14px" }} />
            <span style={{ color: "#111827", fontWeight: 500 }}>Gestão de solicitações</span>
          </nav>

          {/* Page header */}
          <div className="mb-6">
            <h1 className="text-gray-900 mb-1" style={{ fontSize: "26px", fontWeight: 700, lineHeight: 1.3, fontFamily: IBM }}>
              Gestão de solicitações
            </h1>
            <p style={{ fontSize: "14px", color: "#6B7280", fontFamily: IBM }}>
              Acompanhe e gerencie as solicitações de instalação e recolha de equipamentos.
            </p>
          </div>

          {/* Filter bar */}
          <div className="bg-white rounded-lg border border-gray-200 px-4 py-3 mb-4 flex items-center gap-4 flex-wrap">
            {/* Operação */}
            <div style={{ minWidth: "200px" }}>
              <ClbSelect
                placeholder="Operação (obrigatório)"
                value={operacaoFiltro}
                onChange={setOperacaoFiltro}
                options={[
                  { value: "cdd-campinas",  label: "CDD Campinas" },
                  { value: "cdd-sapucaia",  label: "CDD Sapucaia do Sul" },
                  { value: "cdd-contagem",  label: "CDD Contagem" },
                  { value: "ribeirao",      label: "Ribeirão Preto" },
                  { value: "salvador",      label: "Salvador" },
                  { value: "cdd-natal",     label: "CDD Natal" },
                  { value: "cdd-curitiba",  label: "CDD Curitiba" },
                ]}
              />
            </div>

            {/* Tipo de solicitação */}
            <div style={{ minWidth: "180px" }}>
              <ClbSelect
                placeholder="Tipo de solicitação"
                value={tipoFiltro === "todas" ? "" : tipoFiltro}
                onChange={(v) => setTipoFiltro(v || "todas")}
                options={[
                  { value: "todas",      label: "Todas" },
                  { value: "instalacao", label: "Instalação" },
                  { value: "recolha",    label: "Recolha" },
                ]}
              />
            </div>

            {/* Filtros avançados */}
            <button
              onClick={() => setShowFiltros(true)}
              className="flex items-center gap-1.5 hover:text-gray-800 transition-colors"
              style={{ fontSize: "13px", color: "#4B5563", fontWeight: 500, background: "none", border: "none", cursor: "pointer", fontFamily: IBM, whiteSpace: "nowrap" }}
            >
              <Filter style={{ width: "14px", height: "14px" }} />
              Filtros avançados
            </button>

            <div className="ml-auto">
              <Tooltip>
                <TooltipTrigger asChild>
                  <button className="p-1.5 rounded hover:bg-gray-100 transition-colors text-gray-500 hover:text-gray-700" style={{ background: "none", border: "none", cursor: "pointer" }}>
                    <Download style={{ width: "17px", height: "17px" }} />
                  </button>
                </TooltipTrigger>
                <TooltipContent>Exportar</TooltipContent>
              </Tooltip>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">

            {/* ── CLB Tab strip ─────────────────────────────────────────── */}
            <div className="relative" style={{ borderBottom: "1px solid #f2f2f2" }}>
              <div className="flex items-center">
                {(["todas", "instalacao", "recolha"] as const).map((id) => {
                  const label = id === "todas" ? "Todas" : id === "instalacao" ? "Instalação" : "Recolha";
                  const active = tipoFiltro === id;
                  return (
                    <button
                      key={id}
                      onClick={() => { setTipoFiltro(id); setPage(1); }}
                      className="flex flex-col flex-shrink-0"
                      style={{ height: "48px", background: "none", border: "none", cursor: "pointer", padding: 0 }}
                    >
                      <div
                        className="flex items-center justify-center"
                        style={{ flex: 1, minHeight: "44px", padding: "0 24px" }}
                      >
                        <span
                          style={{
                            fontFamily: IBM,
                            fontWeight: active ? 600 : 400,
                            fontSize: "16px",
                            lineHeight: "16px",
                            color: "#0e0e0e",
                            whiteSpace: "nowrap",
                            minWidth: "24px",
                          }}
                        >
                          {label}
                        </span>
                      </div>
                      <div style={{ height: "4px", backgroundColor: active ? "#fd9d1e" : "transparent" }} />
                    </button>
                  );
                })}
              </div>
            </div>

            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  {["Operação", "PDV", "Tipo de solicitação", "Ticket / OS", "Equipamento(s)", "Criação", "Status", "Última atualização", "Ações"].map((col) => (
                    <th
                      key={col}
                      className="text-left px-4 py-3 whitespace-nowrap"
                      style={{ fontSize: "11px", fontWeight: 600, color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.05em", fontFamily: IBM }}
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row, idx) => (
                  <tr
                    key={row.id}
                    className="border-b border-gray-100 hover:bg-orange-50/20 transition-colors"
                    style={{ backgroundColor: idx % 2 === 0 ? "#FFFFFF" : "#FAFAFA" }}
                  >
                    {/* Operação */}
                    <td className="px-4 py-3" style={{ fontSize: "13px", color: "#111827", fontFamily: IBM }}>
                      {row.operacao}
                    </td>

                    {/* PDV */}
                    <td className="px-4 py-3 max-w-[160px]">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className="block overflow-hidden text-ellipsis whitespace-nowrap" style={{ fontSize: "13px", color: "#6B7280", fontFamily: IBM, maxWidth: "150px" }}>
                            {row.pdv}
                          </span>
                        </TooltipTrigger>
                        <TooltipContent>{row.pdv}</TooltipContent>
                      </Tooltip>
                    </td>

                    {/* Tipo */}
                    <td className="px-4 py-3">
                      <TipoCell tipo={row.tipo} />
                    </td>

                    {/* Ticket */}
                    <td className="px-4 py-3">
                      <span style={{ fontFamily: IBM, fontWeight: 500, fontSize: "13px", color: "#111827" }}>
                        {row.ticket}
                      </span>
                    </td>

                    {/* Equipamento */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span style={{ fontFamily: IBM, fontSize: "13px", color: "#6B7280" }}>
                          {row.equipamento}
                        </span>
                        {row.manual && (
                          <span
                            className="inline-flex items-center px-1.5 py-0.5 rounded"
                            style={{ backgroundColor: "#F3F4F6", fontFamily: IBM, fontSize: "10px", fontWeight: 500, color: "#6B7280", whiteSpace: "nowrap" }}
                          >
                            Informado manualmente
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Criação */}
                    <td className="px-4 py-3" style={{ fontSize: "13px", color: "#6B7280", fontFamily: IBM }}>
                      {row.criacao}
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3">
                      <ClbStatus variant={statusVariant(row.status)} label={row.status} />
                    </td>

                    {/* Última atualização */}
                    <td className="px-4 py-3" style={{ fontSize: "13px", color: "#6B7280", fontFamily: IBM }}>
                      {row.ultimaAtualizacao}
                    </td>

                    {/* Ações */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-0.5">
                        {/* Agendar recolha */}
                        {row.tipo === "recolha" && canSchedule(row.status) && (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button className="p-1.5 rounded hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors" style={{ background: "none", border: "none", cursor: "pointer" }}
                                onClick={() => { setSchedulingRow(row); setScheduleDate(""); setSchedulePeriod(""); setScheduleLogistica(""); setScheduleObs(""); }}>
                                <Calendar style={{ width: "15px", height: "15px" }} />
                              </button>
                            </TooltipTrigger>
                            <TooltipContent>Agendar recolha</TooltipContent>
                          </Tooltip>
                        )}

                        {/* Reagendar */}
                        {row.tipo === "recolha" && canReschedule(row.status) && (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button className="p-1.5 rounded hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors" style={{ background: "none", border: "none", cursor: "pointer" }}
                                onClick={() => { setSchedulingRow(row); setScheduleDate(""); setSchedulePeriod(""); setScheduleLogistica(""); setScheduleObs(""); }}>
                                <Calendar style={{ width: "15px", height: "15px" }} />
                              </button>
                            </TooltipTrigger>
                            <TooltipContent>Reagendar</TooltipContent>
                          </Tooltip>
                        )}

                        {/* Finalizar */}
                        {row.tipo === "recolha" && canFinalize(row.status) && (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button className="p-1.5 rounded hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors" style={{ background: "none", border: "none", cursor: "pointer" }}
                                onClick={() => { setFinalizingRow(row); setFinalizeResult("productive"); setFinalizeMotivo(""); setFinalizeEstado(""); setFinalizeObs(""); }}>
                                <Check style={{ width: "15px", height: "15px" }} />
                              </button>
                            </TooltipTrigger>
                            <TooltipContent>Finalizar recolha</TooltipContent>
                          </Tooltip>
                        )}

                        {/* Imprimir documentos */}
                        {row.tipo === "recolha" && (
                          <Popover open={printOpenId === row.id} onOpenChange={(open) => setPrintOpenId(open ? row.id : null)}>
                            <PopoverTrigger asChild>
                              <button className="p-1.5 rounded hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors" style={{ background: "none", border: "none", cursor: "pointer" }}>
                                <Download style={{ width: "15px", height: "15px" }} />
                              </button>
                            </PopoverTrigger>
                            <PopoverContent className="p-1" style={{ width: "210px" }} align="end">
                              <p className="px-2 py-1.5" style={{ fontSize: "11px", fontWeight: 600, color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                                Imprimir documentos
                              </p>
                              <button className="w-full text-left flex items-center gap-2 px-2 py-2 rounded hover:bg-gray-50 transition-colors" style={{ fontSize: "13px", color: "#374151", background: "none", border: "none", cursor: "pointer" }}
                                onClick={() => { setPrintOpenId(null); onDocOS?.(); }}>
                                <FileText className="text-gray-400 flex-shrink-0" style={{ width: "14px", height: "14px" }} />
                                Dados da OS
                              </button>
                              <button className="w-full text-left flex items-center gap-2 px-2 py-2 rounded hover:bg-gray-50 transition-colors" style={{ fontSize: "13px", color: "#374151", background: "none", border: "none", cursor: "pointer" }}
                                onClick={() => {
                                  setPrintOpenId(null);
                                  if (row.status === "Aguardando recolha") {
                                    setNoScheduleRow(row);
                                  } else {
                                    onDocComprovante?.();
                                  }
                                }}>
                                <FileText className="text-gray-400 flex-shrink-0" style={{ width: "14px", height: "14px" }} />
                                Comprovante de recolha
                              </button>
                            </PopoverContent>
                          </Popover>
                        )}

                        {/* Ver detalhes */}
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button className="p-1.5 rounded hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors" style={{ background: "none", border: "none", cursor: "pointer" }}
                              onClick={() => setDetailRow(row)}>
                              <Eye style={{ width: "15px", height: "15px" }} />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent>Visualizar detalhes</TooltipContent>
                        </Tooltip>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            <div className="border-t border-gray-100 px-4 py-3">
              <ClbPagination
                total={rows.length}
                page={page}
                perPage={perPage}
                onPageChange={setPage}
                onPerPageChange={(p) => { setPerPage(p); setPage(1); }}
              />
            </div>
          </div>
        </div>

        {/* Advanced filters panel */}
        <FiltrosAvancadosPanel open={showFiltros} onClose={() => setShowFiltros(false)} />

        {/* Detail drawer */}
        <DetailDrawer row={detailRow} onClose={() => setDetailRow(null)} />

        {/* ── SCHEDULE MODAL ─────────────────────────────────────────────── */}
        <Dialog open={!!schedulingRow} onOpenChange={(o) => !o && setSchedulingRow(null)}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle style={{ fontSize: "16px", fontWeight: 600 }}>
                {schedulingRow && canReschedule(schedulingRow.status) ? "Reagendar recolha" : "Agendar recolha"}
              </DialogTitle>
              <DialogDescription style={{ fontSize: "13px", color: "#6B7280" }}>
                Defina a data de recolha que será exibida no comprovante.
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-4 py-2">
              <div>
                <label className="block mb-1.5" style={{ fontSize: "13px", fontWeight: 500, color: "#374151" }}>
                  Data da recolha <span className="text-red-500">*</span>
                </label>
                <Input type="date" value={scheduleDate} onChange={(e) => setScheduleDate(e.target.value)} className="bg-gray-50 border-gray-200" style={{ fontSize: "13px", height: "36px" }} />
              </div>
              <div>
                <label className="block mb-1.5" style={{ fontSize: "13px", fontWeight: 500, color: "#374151" }}>
                  Período / horário <span className="text-red-500">*</span>
                </label>
                <Select value={schedulePeriod} onValueChange={setSchedulePeriod}>
                  <SelectTrigger className="bg-gray-50 border-gray-200" style={{ fontSize: "13px", height: "36px" }}>
                    <SelectValue placeholder="Selecione o período" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="manha">Manhã (08h–12h)</SelectItem>
                    <SelectItem value="tarde">Tarde (12h–18h)</SelectItem>
                    <SelectItem value="integral">Dia inteiro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block mb-1.5" style={{ fontSize: "13px", fontWeight: 500, color: "#374151" }}>
                  Logística / fornecedor <span className="text-red-500">*</span>
                </label>
                <Input placeholder="Nome da empresa de logística" value={scheduleLogistica} onChange={(e) => setScheduleLogistica(e.target.value)} className="bg-gray-50 border-gray-200" style={{ fontSize: "13px", height: "36px" }} />
              </div>
              <div>
                <label className="block mb-1.5" style={{ fontSize: "13px", fontWeight: 500, color: "#374151" }}>
                  Observações para a rota
                </label>
                <Textarea placeholder="Instruções adicionais para o motorista..." value={scheduleObs} onChange={(e) => setScheduleObs(e.target.value)} className="bg-gray-50 border-gray-200 resize-none" style={{ fontSize: "13px" }} rows={3} />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setSchedulingRow(null)} style={{ fontSize: "13px" }}>Cancelar</Button>
              <Button onClick={handleScheduleConfirm} disabled={!scheduleDate || !schedulePeriod || !scheduleLogistica} className="text-black" style={{ backgroundColor: CORA_ORANGE, fontSize: "13px", opacity: !scheduleDate || !schedulePeriod || !scheduleLogistica ? 0.5 : 1 }}>
                Confirmar agendamento
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* ── FINALIZE MODAL ─────────────────────────────────────────────── */}
        <Dialog open={!!finalizingRow} onOpenChange={(o) => !o && setFinalizingRow(null)}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle style={{ fontSize: "16px", fontWeight: 600 }}>Finalizar recolha</DialogTitle>
              <DialogDescription style={{ fontSize: "13px", color: "#6B7280" }}>Informe o resultado da tentativa de recolha.</DialogDescription>
            </DialogHeader>
            {/* Result radio cards */}
            <div className="flex gap-3">
              {[
                { id: "productive", label: "Recolha produtiva", desc: "O equipamento foi recolhido.", color: CORA_ORANGE },
                { id: "improductive", label: "Recolha improdutiva", desc: "O equipamento não foi recolhido.", color: "#EF4444" },
              ].map(({ id, label, desc, color }) => {
                const active = finalizeResult === id;
                return (
                  <button key={id} onClick={() => { setFinalizeResult(id as "productive" | "improductive"); setFinalizeMotivo(""); }} className="flex-1 border rounded-lg p-3 text-left transition-all" style={{ borderColor: active ? color : "#E5E7EB", backgroundColor: active ? (id === "productive" ? "#FFF7ED" : "#FEF2F2") : "#FAFAFA" }}>
                    <div className="flex items-center gap-2 mb-1">
                      <div className="rounded-full border-2 flex-shrink-0 flex items-center justify-center" style={{ width: "16px", height: "16px", borderColor: active ? color : "#D1D5DB" }}>
                        {active && <div className="rounded-full" style={{ width: "8px", height: "8px", backgroundColor: color }} />}
                      </div>
                      <span style={{ fontSize: "13px", fontWeight: 600, color: "#111827" }}>{label}</span>
                    </div>
                    <p style={{ fontSize: "12px", color: "#6B7280", paddingLeft: "24px" }}>{desc}</p>
                  </button>
                );
              })}
            </div>
            {finalizeResult === "productive" && (
              <div className="flex flex-col gap-4">
                <div>
                  <label className="block mb-1.5" style={{ fontSize: "13px", fontWeight: 500, color: "#374151" }}>Evidência <span className="text-red-500">*</span></label>
                  <div className="border-2 border-dashed rounded-lg flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-gray-50 transition-colors" style={{ borderColor: "#D1D5DB", padding: "20px" }}>
                    <Upload className="text-gray-400" style={{ width: "22px", height: "22px" }} />
                    <span style={{ fontSize: "13px", color: "#6B7280" }}>Selecione o arquivo ou arraste aqui</span>
                  </div>
                </div>
                <div>
                  <label className="block mb-1.5" style={{ fontSize: "13px", fontWeight: 500, color: "#374151" }}>Estado do equipamento</label>
                  <Select value={finalizeEstado} onValueChange={setFinalizeEstado}>
                    <SelectTrigger className="bg-gray-50 border-gray-200" style={{ fontSize: "13px", height: "36px" }}><SelectValue placeholder="Selecione o estado" /></SelectTrigger>
                    <SelectContent>
                      {["Disponível", "Em manutenção", "Sucata", "Bloqueado", "A validar"].map((v) => <SelectItem key={v} value={v}>{v}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
            {finalizeResult === "improductive" && (
              <div className="flex flex-col gap-4">
                <div>
                  <label className="block mb-1.5" style={{ fontSize: "13px", fontWeight: 500, color: "#374151" }}>Motivo <span className="text-red-500">*</span></label>
                  <Select value={finalizeMotivo} onValueChange={setFinalizeMotivo}>
                    <SelectTrigger className="bg-gray-50 border-gray-200" style={{ fontSize: "13px", height: "36px" }}><SelectValue placeholder="Selecione o motivo" /></SelectTrigger>
                    <SelectContent>
                      {["Cliente se recusa a devolver o equipamento", "Estabelecimento fechado", "Equipamento não encontrado", "Cliente não encontrado", "Equipamento não estava em condições para recolha", "Cliente solicitou reagendamento", "Outro"].map((v) => <SelectItem key={v} value={v}>{v}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block mb-1.5" style={{ fontSize: "13px", fontWeight: 500, color: "#374151" }}>Observações</label>
                  <Textarea placeholder="Descreva o ocorrido..." value={finalizeObs} onChange={(e) => setFinalizeObs(e.target.value)} className="bg-gray-50 border-gray-200 resize-none" style={{ fontSize: "13px" }} rows={3} />
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setFinalizingRow(null)} style={{ fontSize: "13px" }}>Cancelar</Button>
              <Button onClick={handleFinalizeConfirm} disabled={finalizeResult === "improductive" && !finalizeMotivo} className="text-black" style={{ backgroundColor: finalizeResult === "productive" ? CORA_ORANGE : "#EF4444", fontSize: "13px", opacity: finalizeResult === "improductive" && !finalizeMotivo ? 0.5 : 1 }}>
                Finalizar recolha
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* ── NO-SCHEDULE WARNING ─────────────────────────────────────────── */}
        <Dialog open={!!noScheduleRow} onOpenChange={(o) => !o && setNoScheduleRow(null)}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle style={{ fontSize: "16px", fontWeight: 600 }}>Agende a recolha para gerar o comprovante</DialogTitle>
              <DialogDescription style={{ fontSize: "13px", color: "#6B7280" }}>O comprovante precisa da data agendada para ser gerado.</DialogDescription>
            </DialogHeader>
            <div className="rounded-lg border border-gray-200 overflow-hidden" style={{ fontSize: "13px" }}>
              {noScheduleRow && [
                { label: "Ticket / OS", value: noScheduleRow.ticket },
                { label: "PDV", value: noScheduleRow.pdv },
                { label: "Status", value: noScheduleRow.status },
              ].map(({ label, value }, i) => (
                <div key={label} className="flex gap-3 px-4 py-2.5 border-b border-gray-100 last:border-0" style={{ backgroundColor: i % 2 === 0 ? "#FFFFFF" : "#FAFAFA" }}>
                  <span className="flex-shrink-0" style={{ width: "120px", fontWeight: 500, color: "#6B7280", fontSize: "12px" }}>{label}</span>
                  <span style={{ color: "#111827" }}>{value}</span>
                </div>
              ))}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setNoScheduleRow(null)} style={{ fontSize: "13px" }}>Cancelar</Button>
              <Button className="text-black" style={{ backgroundColor: CORA_ORANGE, fontSize: "13px" }}
                onClick={() => { setSchedulingRow(noScheduleRow); setNoScheduleRow(null); setScheduleDate(""); setSchedulePeriod(""); setScheduleLogistica(""); }}>
                Agendar recolha
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </TooltipProvider>
  );
}
