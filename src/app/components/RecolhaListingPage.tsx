import React, { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import {
  AlertTriangle,
  Download,
  ChevronRight,
  Filter,
  Search,
} from "lucide-react";
import type { DocType } from "./DocumentPreviewPage";
import {
  ClbStatus,
  ClbPagination,
  rowStatusToClbVariant,
} from "./ClbComponents";
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "./ui/tooltip";
import { Input } from "./ui/input";

// ─── Types ────────────────────────────────────────────────────────────────────

type RowStatus =
  | "Aguardando agendamento"
  | "Recolha agendada"
  | "Recolha atrasada"
  | "Recolha improdutiva"
  | "Recolha produtiva";

interface TableRow {
  id: string;
  unidade: string;
  ticket: string;
  dataAbertura: string;
  codigoPdv: string;
  modalidade: string;
  equipamento: string;
  status: RowStatus;
  dataAtualizacao: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const CORA_ORANGE = "#fd9d1e";

const initialRows: TableRow[] = [
  {
    id: "1",
    unidade: "Paulínia / Campinas",
    ticket: "C16799833",
    dataAbertura: "12/06/2026",
    codigoPdv: "95252",
    modalidade: "Comodato",
    equipamento: "Cooler",
    status: "Aguardando agendamento",
    dataAtualizacao: "12/06/2026",
  },
  {
    id: "2",
    unidade: "Ribeirão Preto",
    ticket: "C16799742",
    dataAbertura: "12/06/2026",
    codigoPdv: "66723",
    modalidade: "Comodato",
    equipamento: "Cooler",
    status: "Recolha agendada",
    dataAtualizacao: "12/06/2026",
  },
  {
    id: "3",
    unidade: "CDD CONTAGEM",
    ticket: "C16799446",
    dataAbertura: "12/06/2026",
    codigoPdv: "7556",
    modalidade: "Comodato",
    equipamento: "Cooler",
    status: "Recolha atrasada",
    dataAtualizacao: "12/06/2026",
  },
  {
    id: "4",
    unidade: "Salvador",
    ticket: "C16785701",
    dataAbertura: "11/06/2026",
    codigoPdv: "881",
    modalidade: "Comodato",
    equipamento: "Cooler",
    status: "Recolha improdutiva",
    dataAtualizacao: "11/06/2026",
  },
];

const successRow: TableRow = {
  id: "0",
  unidade: "CDD Campinas",
  ticket: "Cora-000123",
  dataAbertura: "12/06/2026",
  codigoPdv: "95252",
  modalidade: "Comodato",
  equipamento: "Cooler",
  status: "Aguardando agendamento",
  dataAtualizacao: "12/06/2026",
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatusChip({
  status,
  withTooltip,
}: {
  status: RowStatus | "Processando" | "Serial não informado";
  withTooltip?: boolean;
}) {
  const variant = rowStatusToClbVariant(status);
  const chip = <ClbStatus variant={variant} label={status} />;

  if (withTooltip) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="cursor-default inline-flex items-center gap-1">
            {chip}
            <AlertTriangle
              className="text-amber-500 ml-0.5"
              style={{ width: "13px", height: "13px" }}
            />
          </span>
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-56 text-xs">
          A data agendada já passou. Reagende ou finalize a recolha.
        </TooltipContent>
      </Tooltip>
    );
  }

  return chip;
}

// ─── Main Component ───────────────────────────────────────────────────────────

export interface RecolhaListingPageProps {
  variant: "default" | "success" | "delayed";
  onSolicitar: () => void;
}

export function RecolhaListingPage({
  variant,
  onSolicitar,
}: RecolhaListingPageProps) {
  // Table data
  const [rows, setRows] = useState<TableRow[]>(() =>
    variant === "success" ? [successRow, ...initialRows] : initialRows
  );

  // Pagination state (CLB)
  const [paginationPage, setPaginationPage] = useState(1);
  const [paginationPerPage, setPaginationPerPage] = useState(10);


  // Show toast on success variant mount
  const toastShownRef = useRef(false);
  useEffect(() => {
    if (variant === "success" && !toastShownRef.current) {
      const t = setTimeout(() => {
        toast.success("Solicitação de recolha criada com sucesso.");
        toastShownRef.current = true;
      }, 400);
      return () => clearTimeout(t);
    }
    if (variant !== "success") {
      toastShownRef.current = false;
    }
  }, [variant]);

  // Sync rows when variant changes externally
  useEffect(() => {
    setRows(variant === "success" ? [successRow, ...initialRows] : initialRows);
  }, [variant]);

  // ─── Handlers ──────────────────────────────────────────────────────────────

  // ─── Render ────────────────────────────────────────────────────────────────

  return (
    <TooltipProvider delayDuration={300}>
      <div className="min-h-screen bg-gray-50">
        <div className="px-8 py-6" style={{ maxWidth: "1440px", margin: "0 auto" }}>

          {/* Breadcrumb */}
          <nav className="flex items-center gap-1 mb-5" style={{ fontSize: "13px", color: "#6B7280" }}>
            <span className="hover:text-gray-700 cursor-pointer">Início</span>
            <ChevronRight style={{ width: "14px", height: "14px" }} />
            <span className="hover:text-gray-700 cursor-pointer">Equipamentos de Refrigeração</span>
            <ChevronRight style={{ width: "14px", height: "14px" }} />
            <span style={{ color: "#111827", fontWeight: 500 }}>Recolha de Equipamentos</span>
          </nav>

          {/* — single-column content — */}
          <>


          {/* Page header */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1
                className="text-gray-900 mb-1"
                style={{ fontSize: "26px", fontWeight: 700, lineHeight: 1.3 }}
              >
                Recolha de Equipamentos
              </h1>
              <p style={{ fontSize: "14px", color: "#6B7280" }}>
                Acompanhe aqui o andamento das solicitações de recolha
              </p>
            </div>
            <button
              onClick={onSolicitar}
              className="flex items-center gap-[8px] flex-shrink-0 hover:opacity-90 active:opacity-80 transition-opacity"
              style={{
                backgroundColor: "#fd9d1e",
                height: "40px",
                padding: "0 16px",
                borderRadius: "2px",
                border: "none",
                cursor: "pointer",
              }}
            >
              {/* Plus icon */}
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
                <path d="M8.75 7.25V2h-1.5v5.25H2v1.5h5.25V14h1.5V8.75H14v-1.5H8.75z" fill="#0E0E0E" />
              </svg>
              <span
                style={{
                  fontFamily: "'IBM Plex Sans', sans-serif",
                  fontWeight: 500,
                  fontSize: "16px",
                  lineHeight: "24px",
                  color: "#0e0e0e",
                  whiteSpace: "nowrap",
                }}
              >
                Solicitar recolha
              </span>
            </button>
          </div>

          {/* Filter bar */}
          <div className="bg-white rounded-lg border border-gray-200 px-4 py-3 mb-4 flex items-center gap-4">
            <div style={{ position: "relative", width: "280px" }}>
              <Search
                className="text-gray-400"
                style={{
                  position: "absolute",
                  left: "10px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  width: "15px",
                  height: "15px",
                  pointerEvents: "none",
                }}
              />
              <Input
                placeholder="Informe o código do cliente"
                className="bg-gray-50 border-gray-200"
                style={{ paddingLeft: "32px", fontSize: "13px", height: "36px" }}
              />
            </div>

            <button
              className="flex items-center gap-1.5 hover:text-gray-800 transition-colors"
              style={{ fontSize: "13px", color: "#4B5563", fontWeight: 500 }}
            >
              <Filter style={{ width: "14px", height: "14px" }} />
              Filtros avançados
            </button>

            <div className="ml-auto flex items-center gap-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <button className="p-1.5 rounded hover:bg-gray-100 transition-colors text-gray-500 hover:text-gray-700">
                    <Download style={{ width: "17px", height: "17px" }} />
                  </button>
                </TooltipTrigger>
                <TooltipContent>Exportar</TooltipContent>
              </Tooltip>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  {[
                    "Unidade",
                    "Ticket",
                    "Data de abertura",
                    "Código do PDV",
                    "Modalidade",
                    "Equipamento",
                    "Status",
                    "Data de atualização",
                    "Ações",
                  ].map((col) => (
                    <th
                      key={col}
                      className="text-left px-4 py-3 whitespace-nowrap"
                      style={{
                        fontSize: "11px",
                        fontWeight: 600,
                        color: "#6B7280",
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                      }}
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
                    <td
                      className="px-4 py-3"
                      style={{ fontSize: "13px", color: "#111827" }}
                    >
                      {row.unidade}
                    </td>
                    <td
                      className="px-4 py-3"
                      style={{ fontSize: "13px", fontWeight: 500, color: "#111827" }}
                    >
                      {row.ticket}
                    </td>
                    <td
                      className="px-4 py-3"
                      style={{ fontSize: "13px", color: "#6B7280" }}
                    >
                      {row.dataAbertura}
                    </td>
                    <td
                      className="px-4 py-3"
                      style={{ fontSize: "13px", color: "#6B7280" }}
                    >
                      {row.codigoPdv}
                    </td>
                    <td
                      className="px-4 py-3"
                      style={{ fontSize: "13px", color: "#6B7280" }}
                    >
                      {row.modalidade}
                    </td>
                    <td
                      className="px-4 py-3"
                      style={{ fontSize: "13px", color: "#6B7280" }}
                    >
                      {row.equipamento}
                    </td>
                    <td className="px-4 py-3">
                      <StatusChip
                        status={row.status}
                        withTooltip={row.status === "Recolha atrasada"}
                      />
                    </td>
                    <td
                      className="px-4 py-3"
                      style={{ fontSize: "13px", color: "#6B7280" }}
                    >
                      {row.dataAtualizacao}
                    </td>
                    <td className="px-4 py-3" />
                  </tr>
                ))}
              </tbody>
            </table>

            {/* CLB Pagination */}
            <div className="border-t border-gray-100 px-4 py-3">
              <ClbPagination
                total={rows.length}
                page={paginationPage}
                perPage={paginationPerPage}
                onPageChange={setPaginationPage}
                onPerPageChange={(p) => { setPaginationPerPage(p); setPaginationPage(1); }}
              />
            </div>
          </div>
          </>
        </div>
        {/* end px-8 container */}

      </div>
    </TooltipProvider>
  );
}

// ─── Drawer Sub-components ────────────────────────────────────────────────────

function InfoRow({
  label,
  value,
  valueEl,
}: {
  label: string;
  value?: string;
  valueEl?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-0.5 py-2.5 border-b border-gray-100 last:border-0">
      <span style={{ fontSize: "11px", fontWeight: 500, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.04em" }}>
        {label}
      </span>
      {valueEl ?? (
        <span style={{ fontSize: "13px", color: "#111827" }}>
          {value || "—"}
        </span>
      )}
    </div>
  );
}

function DrawerDetails({ row }: { row: TableRow }) {
  return (
    <div className="flex flex-col">
      <InfoRow label="Ticket" value={row.ticket} />
      <InfoRow label="PDV" value={row.codigoPdv === "95252" ? "95252 — FERNANDO LIMA" : row.codigoPdv} />
      <InfoRow label="CDD" value={row.unidade} />
      <InfoRow
        label="Status"
        valueEl={<StatusChip status={row.status} />}
      />
      <InfoRow label="Modelo" value="Geladeira Brahma" />
      <InfoRow label="Equipamento" value={row.equipamento} />
      <InfoRow
        label="Número de série"
        value={row.id === "0" ? "SN-2026-009812" : "SN-2026-00" + row.id.padStart(4, "0")}
      />
      <InfoRow
        label="Etiqueta / RG"
        value={row.id === "0" ? "2090594173528-9" : "20905941735" + row.id + "-0"}
      />
      <InfoRow label="Modalidade" value={row.modalidade} />
      <InfoRow label="Logística" value="—" />
      <InfoRow label="Contato" value="Ana Paula Gonçalves" />
      <InfoRow label="Telefone" value="(11) 90000-0000" />
      <InfoRow
        label="Endereço de recolha"
        value="Rua Magnólia, nº 12 — Bairro das Flores, Campinas — SP"
      />
    </div>
  );
}

function DrawerHistory({ row, printedDocTypes }: { row: TableRow; printedDocTypes?: DocType[] }) {
  const events: { date: string; status: RowStatus | "Processando"; desc: string }[] = [
    {
      date: row.dataAbertura + " 13:27",
      status: "Aguardando agendamento",
      desc: "Solicitação criada via Cora por 123456@ambev.com.br",
    },
    {
      date: row.dataAbertura + " 13:27",
      status: "Processando",
      desc: "Solicitação registrada",
    },
  ];

  if (row.status === "Recolha agendada" || row.status === "Recolha atrasada") {
    events.unshift({
      date: row.dataAtualizacao + " 09:15",
      status: "Recolha agendada" as RowStatus,
      desc: "Recolha agendada para " + row.dataAtualizacao,
    });
  }

  if (row.status === "Recolha produtiva") {
    events.unshift({
      date: row.dataAtualizacao + " 14:30",
      status: "Recolha produtiva" as RowStatus,
      desc: "Recolha finalizada como produtiva",
    });
  }

  if (row.status === "Recolha improdutiva") {
    events.unshift({
      date: row.dataAtualizacao + " 11:45",
      status: "Recolha improdutiva" as RowStatus,
      desc: "Recolha finalizada como improdutiva",
    });
  }

  // Frame 7 — print history events (only for the demo row)
  if (row.id === "0" && printedDocTypes?.includes("comprovante")) {
    events.unshift({
      date: "12/06/2026 13:34",
      status: "Recolha agendada" as RowStatus,
      desc: "Comprovante de recolha impresso por 123456@ambev.com.br.",
    });
  }
  if (row.id === "0" && printedDocTypes?.includes("os")) {
    events.unshift({
      date: "12/06/2026 13:32",
      status: "Recolha agendada" as RowStatus,
      desc: "Dados da OS impressos por 123456@ambev.com.br.",
    });
  }

  return (
    <div className="relative">
      {/* Vertical line */}
      <div
        className="absolute left-2 top-0 bottom-0 bg-gray-200"
        style={{ width: "2px", zIndex: 0 }}
      />
      <div className="flex flex-col gap-0">
        {events.map((ev, i) => {
          const dotColors: Record<string, string> = {
            positive: "#08663B",
            warning: "#DB5C00",
            negative: "#AE1E1E",
            info: "#2B83F7",
            neutral: "#666666",
          };
          const variant = rowStatusToClbVariant(ev.status);
          const dotColor = dotColors[variant] ?? "#666666";
          return (
            <div key={i} className="relative flex gap-4 pb-6 last:pb-0" style={{ paddingLeft: "24px" }}>
              {/* Dot */}
              <div
                className="absolute rounded-full flex-shrink-0"
                style={{ left: "0px", top: "4px", width: "18px", height: "18px", zIndex: 1, border: "3px solid white", boxShadow: "0 0 0 1px #E5E7EB", backgroundColor: dotColor }}
              />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <StatusChip status={ev.status} />
                  <span style={{ fontSize: "11px", color: "#9CA3AF" }}>
                    {ev.date}
                  </span>
                </div>
                <p style={{ fontSize: "12px", color: "#6B7280" }}>{ev.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
