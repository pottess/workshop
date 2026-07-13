import React from "react";
import { toast } from "sonner";
import { ArrowLeft, Download, Printer } from "lucide-react";
import imgCora from "figma:asset/ed252fcb7695058c90569a462639d4a2d13c0645.png";
import { ClbStatus, rowStatusToClbVariant } from "./ClbComponents";

// ─── Constants ────────────────────────────────────────────────────────────────

const IBM = "'IBM Plex Sans', system-ui, sans-serif";
const CORA_ORANGE = "#fd9d1e";

export type DocType = "os" | "comprovante";

export interface DocumentPreviewPageProps {
  type: DocType;
  onBack: () => void;
  onPrint?: (docType: DocType) => void;
}

// ─── Document data ────────────────────────────────────────────────────────────

const DOC = {
  os:           "OSR-2026-000123",
  ticket:       "Cora-000123",
  dataGeracao:  "12/06/2026",
  hora:         "13:27",
  status:       "Recolha agendada",
  unidade:      "CDD Campinas",
  logistica:    "Metalfrio",
  dataAgendada: "20/06/2026",
  periodo:      "Manhã",
  responsavel:  "Equipe 03",
  prioridade:   "Média",
  codigoPdv:    "95252",
  pdv:          "Fernando Lima",
  contato:      "Ana Paula Gonçalves",
  telefone:     "(11) 90000-0000",
  email:        "ana.paula@email.com",
  endereco:     "Rua Magnólia, nº 12 - Bairro das Flores",
  cidade:       "Campinas",
  estado:       "SP",
  cep:          "12345-000",
  equipamento:  "Cooler",
  modelo:       "Geladeira Brahma",
  marca:        "Brahma",
  voltagem:     "220v",
  modalidade:   "Comodato",
  serial:       "SN-2026-009812",
  etiqueta:     "2090594173528-9",
  contrato:     "C-203948",
};

// ─── A4 document sub-components ──────────────────────────────────────────────

function DocSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div style={{ marginBottom: "28px" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          marginBottom: "14px",
        }}
      >
        <span
          style={{
            fontFamily: IBM,
            fontWeight: 600,
            fontSize: "10px",
            color: "#9CA3AF",
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            whiteSpace: "nowrap",
          }}
        >
          {title}
        </span>
        <div style={{ flex: 1, height: "1px", backgroundColor: "#E5E7EB" }} />
      </div>
      {children}
    </div>
  );
}

function FieldGrid({
  children,
  cols = 2,
}: {
  children: React.ReactNode;
  cols?: 1 | 2 | 3;
}) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        gap: "12px 24px",
      }}
    >
      {children}
    </div>
  );
}

function DocField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p
        style={{
          fontFamily: IBM,
          fontWeight: 400,
          fontSize: "10px",
          color: "#9CA3AF",
          marginBottom: "2px",
          textTransform: "uppercase",
          letterSpacing: "0.05em",
        }}
      >
        {label}
      </p>
      <p
        style={{
          fontFamily: IBM,
          fontWeight: 500,
          fontSize: "13px",
          color: "#111827",
        }}
      >
        {value}
      </p>
    </div>
  );
}

function DocInfoRight({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ textAlign: "right", marginBottom: "4px" }}>
      <span
        style={{
          fontFamily: IBM,
          fontSize: "11px",
          color: "#9CA3AF",
          marginRight: "6px",
        }}
      >
        {label}:
      </span>
      <span style={{ fontFamily: IBM, fontWeight: 500, fontSize: "11px", color: "#111827" }}>
        {value}
      </span>
    </div>
  );
}

function DocFooter() {
  return (
    <div
      style={{
        marginTop: "40px",
        paddingTop: "16px",
        borderTop: "1px solid #E5E7EB",
        textAlign: "center",
      }}
    >
      <p
        style={{
          fontFamily: IBM,
          fontWeight: 400,
          fontSize: "11px",
          color: "#9CA3AF",
          margin: 0,
        }}
      >
        Documento gerado pela Cora em {DOC.dataGeracao} às {DOC.hora}.
      </p>
    </div>
  );
}

// ─── OS document ─────────────────────────────────────────────────────────────

function OSDocument() {
  return (
    <>
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: "36px",
        }}
      >
        <div>
          <img
            src={imgCora}
            alt="Cora"
            style={{ height: "28px", width: "auto", display: "block", marginBottom: "14px" }}
          />
          <h1
            style={{
              fontFamily: IBM,
              fontWeight: 700,
              fontSize: "20px",
              color: "#111827",
              margin: "0 0 4px",
            }}
          >
            Ordem de Serviço de Recolha
          </h1>
          <p style={{ fontFamily: IBM, fontWeight: 400, fontSize: "13px", color: "#6B7280", margin: 0 }}>
            Dados da OS
          </p>
        </div>
        <div style={{ flexShrink: 0, marginLeft: "32px" }}>
          <DocInfoRight label="OS" value={DOC.os} />
          <DocInfoRight label="Ticket" value={DOC.ticket} />
          <DocInfoRight label="Data de geração" value={DOC.dataGeracao} />
          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "4px" }}>
            <ClbStatus variant={rowStatusToClbVariant(DOC.status)} label={DOC.status} />
          </div>
        </div>
      </div>

      {/* Section 1 – Dados da operação */}
      <DocSection title="Dados da operação">
        <FieldGrid cols={2}>
          <DocField label="Unidade" value={DOC.unidade} />
          <DocField label="Logística / fornecedor" value={DOC.logistica} />
          <DocField label="Data agendada" value={DOC.dataAgendada} />
          <DocField label="Período" value={DOC.periodo} />
          <DocField label="Responsável pela rota" value={DOC.responsavel} />
          <DocField label="Prioridade" value={DOC.prioridade} />
        </FieldGrid>
      </DocSection>

      {/* Section 2 – Dados do cliente */}
      <DocSection title="Dados do cliente / PDV">
        <FieldGrid cols={2}>
          <DocField label="Código do PDV" value={DOC.codigoPdv} />
          <DocField label="PDV" value={DOC.pdv} />
          <DocField label="Contato" value={DOC.contato} />
          <DocField label="Telefone" value={DOC.telefone} />
          <DocField label="E-mail" value={DOC.email} />
          <DocField label="CEP" value={DOC.cep} />
        </FieldGrid>
        <div style={{ marginTop: "12px" }}>
          <DocField
            label="Endereço de recolha"
            value={`${DOC.endereco} — ${DOC.cidade}, ${DOC.estado}`}
          />
        </div>
      </DocSection>

      {/* Section 3 – Dados do equipamento */}
      <DocSection title="Dados do equipamento">
        <FieldGrid cols={3}>
          <DocField label="Equipamento" value={DOC.equipamento} />
          <DocField label="Modelo" value={DOC.modelo} />
          <DocField label="Marca" value={DOC.marca} />
          <DocField label="Voltagem" value={DOC.voltagem} />
          <DocField label="Modalidade" value={DOC.modalidade} />
          <DocField label="Contrato" value={DOC.contrato} />
        </FieldGrid>
        <FieldGrid cols={2} >
          <div style={{ marginTop: "12px" }}>
            <DocField label="Número de série" value={DOC.serial} />
          </div>
          <div style={{ marginTop: "12px" }}>
            <DocField label="Etiqueta / RG" value={DOC.etiqueta} />
          </div>
        </FieldGrid>
      </DocSection>

      {/* Section 4 – Orientações */}
      <DocSection title="Orientações para recolha">
        <p
          style={{
            fontFamily: IBM,
            fontWeight: 400,
            fontSize: "13px",
            color: "#374151",
            lineHeight: "1.6",
            margin: 0,
            padding: "12px 16px",
            backgroundColor: "#F9FAFB",
            borderLeft: "3px solid #E5E7EB",
            borderRadius: "2px",
          }}
        >
          Antes da retirada, confirme se o equipamento está vazio, desligado e em condições seguras para transporte. Caso a recolha não possa ser realizada, registre o motivo da improdutividade na Cora.
        </p>
      </DocSection>

      {/* Section 5 – Observações da rota */}
      <DocSection title="Observações da rota">
        <p
          style={{
            fontFamily: IBM,
            fontWeight: 400,
            fontSize: "13px",
            color: "#374151",
            lineHeight: "1.6",
            margin: 0,
          }}
        >
          Entrar em contato com Ana Paula antes da visita. Acesso pela entrada lateral do estabelecimento.
        </p>
      </DocSection>

      <DocFooter />
    </>
  );
}

// ─── Comprovante document ─────────────────────────────────────────────────────

function PrintCheckbox({ label }: { label: string }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "10px",
        marginBottom: "8px",
      }}
    >
      <div
        style={{
          width: "14px",
          height: "14px",
          border: "1px solid #374151",
          borderRadius: "2px",
          flexShrink: 0,
        }}
      />
      <span
        style={{ fontFamily: IBM, fontWeight: 400, fontSize: "13px", color: "#374151" }}
      >
        {label}
      </span>
    </div>
  );
}

function SignatureBlock({
  role,
  fields,
}: {
  role: string;
  fields: string[];
}) {
  return (
    <div style={{ flex: 1 }}>
      <p
        style={{
          fontFamily: IBM,
          fontWeight: 600,
          fontSize: "11px",
          color: "#9CA3AF",
          textTransform: "uppercase",
          letterSpacing: "0.06em",
          marginBottom: "16px",
        }}
      >
        {role}
      </p>
      {fields.map((f) => (
        <div key={f} style={{ marginBottom: "20px" }}>
          <div
            style={{
              borderBottom: "1px solid #374151",
              height: "28px",
              marginBottom: "4px",
            }}
          />
          <p
            style={{
              fontFamily: IBM,
              fontWeight: 400,
              fontSize: "10px",
              color: "#9CA3AF",
              margin: 0,
            }}
          >
            {f}
          </p>
        </div>
      ))}
    </div>
  );
}

function ComprovantDocument() {
  return (
    <>
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: "36px",
        }}
      >
        <div>
          <img
            src={imgCora}
            alt="Cora"
            style={{ height: "28px", width: "auto", display: "block", marginBottom: "14px" }}
          />
          <h1
            style={{
              fontFamily: IBM,
              fontWeight: 700,
              fontSize: "18px",
              color: "#111827",
              margin: "0 0 4px",
            }}
          >
            Comprovante de Recolha de Equipamento
          </h1>
        </div>
        <div style={{ flexShrink: 0, marginLeft: "32px" }}>
          <DocInfoRight label="OS" value={DOC.os} />
          <DocInfoRight label="Ticket" value={DOC.ticket} />
          <DocInfoRight label="Data agendada da recolha" value={DOC.dataAgendada} />
        </div>
      </div>

      {/* Section 1 */}
      <DocSection title="Dados da recolha">
        <FieldGrid cols={2}>
          <DocField label="Unidade" value={DOC.unidade} />
          <DocField label="Logística / fornecedor" value={DOC.logistica} />
          <DocField label="Responsável pela rota" value={DOC.responsavel} />
          <DocField label="Data agendada" value={DOC.dataAgendada} />
          <DocField label="Período" value={DOC.periodo} />
        </FieldGrid>
      </DocSection>

      {/* Section 2 */}
      <DocSection title="Dados do cliente / PDV">
        <FieldGrid cols={2}>
          <DocField label="Código do PDV" value={DOC.codigoPdv} />
          <DocField label="PDV" value={DOC.pdv} />
          <DocField label="Contato" value={DOC.contato} />
          <DocField label="Telefone" value={DOC.telefone} />
          <DocField label="CEP" value={DOC.cep} />
        </FieldGrid>
        <div style={{ marginTop: "12px" }}>
          <DocField
            label="Endereço de recolha"
            value={`${DOC.endereco}, ${DOC.cidade} — ${DOC.estado}`}
          />
        </div>
      </DocSection>

      {/* Section 3 */}
      <DocSection title="Dados do equipamento">
        <FieldGrid cols={3}>
          <DocField label="Equipamento" value={DOC.equipamento} />
          <DocField label="Modelo" value={DOC.modelo} />
          <DocField label="Marca" value={DOC.marca} />
          <DocField label="Voltagem" value={DOC.voltagem} />
          <DocField label="Número de série" value={DOC.serial} />
          <DocField label="Etiqueta / RG" value={DOC.etiqueta} />
        </FieldGrid>
        <div style={{ marginTop: "12px" }}>
          <DocField label="Modalidade" value={DOC.modalidade} />
        </div>
      </DocSection>

      {/* Section 4 – Declaração */}
      <DocSection title="Declaração de recolha">
        <p
          style={{
            fontFamily: IBM,
            fontWeight: 400,
            fontSize: "13px",
            color: "#374151",
            lineHeight: "1.6",
            margin: 0,
            padding: "12px 16px",
            border: "1px solid #E5E7EB",
            borderRadius: "2px",
          }}
        >
          Declaro que o equipamento descrito neste comprovante foi recolhido pela operação logística responsável na data informada.
        </p>
      </DocSection>

      {/* Section 5 – Conferência */}
      <DocSection title="Conferência do equipamento">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 32px" }}>
          <PrintCheckbox label="Equipamento vazio" />
          <PrintCheckbox label="Equipamento desligado" />
          <PrintCheckbox label="Equipamento retirado do local" />
          <PrintCheckbox label="Equipamento sem avarias aparentes" />
          <PrintCheckbox label="Equipamento com avarias aparentes" />
        </div>
        <div style={{ marginTop: "16px" }}>
          <p
            style={{
              fontFamily: IBM,
              fontWeight: 400,
              fontSize: "11px",
              color: "#9CA3AF",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              marginBottom: "6px",
            }}
          >
            Observações sobre o estado do equipamento
          </p>
          <div
            style={{
              border: "1px solid #E5E7EB",
              borderRadius: "2px",
              height: "56px",
            }}
          />
        </div>
      </DocSection>

      {/* Section 6 – Assinaturas */}
      <DocSection title="Assinaturas">
        <div style={{ display: "flex", gap: "48px" }}>
          <SignatureBlock
            role="Responsável pelo PDV"
            fields={["Nome", "Documento (CPF/RG)", "Assinatura", "Data"]}
          />
          <SignatureBlock
            role="Responsável pela recolha"
            fields={["Nome", "Documento ou matrícula", "Assinatura", "Data"]}
          />
        </div>
      </DocSection>

      <DocFooter />
    </>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function DocumentPreviewPage({
  type,
  onBack,
  onPrint,
}: DocumentPreviewPageProps) {
  const isOS = type === "os";
  const subtitle = isOS ? "Dados da OS" : "Comprovante de recolha";

  const handleDownload = () => {
    toast.success(isOS ? "PDF gerado com sucesso." : "Comprovante gerado com sucesso.");
  };

  const handlePrint = () => {
    toast.success(
      isOS
        ? "Documento enviado para impressão."
        : "Comprovante enviado para impressão."
    );
    onPrint?.(type);
  };

  return (
    <div
      className="fixed left-0 right-0 bottom-0 flex flex-col"
      style={{ top: "30px", zIndex: 60, backgroundColor: "#f5f5f5", fontFamily: IBM }}
    >
      {/* ── Top bar ──────────────────────────────────────────────────────── */}
      <div
        className="flex-shrink-0 bg-white flex items-center"
        style={{
          height: "64px",
          padding: "0 24px",
          gap: "16px",
          borderBottom: "1px solid #E5E7EB",
          boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
        }}
      >
        {/* Back */}
        <button
          onClick={onBack}
          className="flex items-center gap-[8px] hover:opacity-70 transition-opacity flex-shrink-0"
          style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}
        >
          <ArrowLeft style={{ width: "18px", height: "18px", color: "#0e0e0e" }} />
          <span style={{ fontFamily: IBM, fontWeight: 500, fontSize: "14px", color: "#0e0e0e" }}>
            Voltar
          </span>
        </button>

        {/* Separator */}
        <div style={{ width: "1px", height: "32px", backgroundColor: "#E5E7EB", flexShrink: 0 }} />

        {/* Title */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <p
            style={{
              fontFamily: IBM,
              fontWeight: 600,
              fontSize: "15px",
              color: "#0e0e0e",
              margin: 0,
              lineHeight: 1.2,
            }}
          >
            Pré-visualização do documento
          </p>
          <p
            style={{
              fontFamily: IBM,
              fontWeight: 400,
              fontSize: "12px",
              color: "#6B7280",
              margin: 0,
              lineHeight: 1.4,
            }}
          >
            {subtitle}
          </p>
        </div>

        {/* Download (secondary) */}
        <button
          onClick={handleDownload}
          className="flex items-center gap-[8px] hover:bg-gray-50 transition-colors flex-shrink-0"
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
          <Download style={{ width: "15px", height: "15px" }} />
          Baixar PDF
        </button>

        {/* Print (primary) */}
        <button
          onClick={handlePrint}
          className="flex items-center gap-[8px] hover:opacity-90 transition-opacity flex-shrink-0"
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
          <Printer style={{ width: "15px", height: "15px" }} />
          {isOS ? "Imprimir" : "Imprimir comprovante"}
        </button>
      </div>

      {/* ── Document area ─────────────────────────────────────────────────── */}
      <div
        className="flex-1 overflow-y-auto"
        style={{ padding: "32px 24px 48px" }}
      >
        <div
          style={{
            maxWidth: "794px",
            margin: "0 auto",
            backgroundColor: "white",
            boxShadow: "0 2px 12px rgba(0,0,0,0.10)",
            padding: "56px 72px",
          }}
        >
          {isOS ? <OSDocument /> : <ComprovantDocument />}
        </div>
      </div>
    </div>
  );
}
