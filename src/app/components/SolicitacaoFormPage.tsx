import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { Info, ChevronLeft } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "./ui/dialog";
import { Textarea } from "./ui/textarea";
import svgClose from "../../imports/ClbFullPageFlow/svg-oqv3yhu8hf";
import {
  ClbInputText,
  ClbSelect,
  ClbRadioButton,
} from "./ClbComponents";

// ─── Types ────────────────────────────────────────────────────────────────────

export type FormVariant = "empty" | "filled" | "no-serial";

export interface SolicitacaoFormPageProps {
  variant: FormVariant;
  onVariantChange: (v: FormVariant) => void;
  onCancel: () => void;
  onSuccess: () => void;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const CORA_ORANGE = "#fd9d1e";
const IBM = "'IBM Plex Sans', system-ui, sans-serif";

const STEPS = [
  "Dados para busca",
  "Dados do cliente",
  "Dados do equipamento",
];

// ─── Reusable primitives ──────────────────────────────────────────────────────

function CardBlock({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`bg-white rounded-lg border border-gray-200 overflow-hidden ${className ?? ""}`}
    >
      <div className="px-6 py-5">{children}</div>
    </div>
  );
}

function DataRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span
        style={{
          fontSize: "11px",
          fontWeight: 500,
          color: "#9CA3AF",
          textTransform: "uppercase",
          letterSpacing: "0.04em",
          fontFamily: IBM,
        }}
      >
        {label}
      </span>
      <span style={{ fontSize: "13px", color: "#374151", fontFamily: IBM }}>{value}</span>
    </div>
  );
}

// ─── Step Content Components ──────────────────────────────────────────────────

function Step1Content({
  radioChoice,
  setRadioChoice,
}: {
  radioChoice: "serial" | "no-serial";
  setRadioChoice: (v: "serial" | "no-serial") => void;
}) {
  const [equipType, setEquipType] = useState("");
  return (
    <CardBlock>
      <div className="grid grid-cols-2 gap-5 mb-6">
        <ClbInputText label="Unidade" required placeholder="Informe o código do CDD" />
        <ClbInputText label="Código do cliente / PDV" required placeholder="Informe o código do cliente" />
      </div>

      <div>
        <p style={{ fontFamily: IBM, fontWeight: 500, fontSize: "14px", color: "#0e0e0e", marginBottom: "12px" }}>
          Identificação do equipamento <span className="text-red-500">*</span>
        </p>
        <div className="flex flex-col gap-4">
          {/* Serial option */}
          <div className="flex flex-col gap-3">
            <ClbRadioButton
              checked={radioChoice === "serial"}
              onClick={() => setRadioChoice("serial")}
              label="Tenho o número de série"
            />
            <div style={{ paddingLeft: "24px" }}>
              <ClbInputText
                placeholder="Número de série"
                disabled={radioChoice !== "serial"}
              />
            </div>
          </div>

          {/* No-serial option */}
          <div className="flex flex-col gap-3">
            <ClbRadioButton
              checked={radioChoice === "no-serial"}
              onClick={() => setRadioChoice("no-serial")}
              label="Não tenho o número de série"
            />
            <div style={{ paddingLeft: "24px" }} className="flex flex-col gap-2">
              {radioChoice === "no-serial" && (
                <div
                  className="flex items-start gap-2 rounded-lg p-2.5 mb-1"
                  style={{ backgroundColor: "#EFF6FF", border: "1px solid #BFDBFE" }}
                >
                  <Info className="text-blue-500 mt-0.5 flex-shrink-0" style={{ width: "14px", height: "14px" }} />
                  <p style={{ fontSize: "12px", color: "#1D4ED8", fontFamily: IBM }}>
                    Informe o tipo de equipamento para seguir sem número de série.
                  </p>
                </div>
              )}
              <ClbSelect
                placeholder="Tipo de equipamento"
                value={equipType}
                onChange={setEquipType}
                disabled={radioChoice !== "no-serial"}
                options={[
                  { value: "cooler", label: "Cooler" },
                  { value: "freezer", label: "Freezer" },
                  { value: "geladeira", label: "Geladeira" },
                ]}
              />
            </div>
          </div>
        </div>
      </div>
    </CardBlock>
  );
}

function Step2Content() {
  const [contato, setContato] = useState("Ana Paula Gonçalves");
  const [email, setEmail] = useState("ana.paula@email.com");
  const [telefone, setTelefone] = useState("(11) 90000-0000");
  const [endereco, setEndereco] = useState("Rua Magnólia, nº 12 - Bairro das Flores");
  const [cidade, setCidade] = useState("Campinas");
  const [estado, setEstado] = useState("SP");
  const [cep, setCep] = useState("12345-000");
  const [referencia, setReferencia] = useState("");

  return (
    <CardBlock>
      <div className="grid grid-cols-2 gap-5 mb-5">
        <div>
          <p style={{ fontFamily: IBM, fontWeight: 500, fontSize: "14px", color: "#0e0e0e", marginBottom: "8px" }}>PDV</p>
          <div
            style={{
              height: "48px",
              display: "flex",
              alignItems: "center",
              paddingLeft: "16px",
              backgroundColor: "#f5f5f5",
              border: "1px solid #d9d9d9",
              borderRadius: "2px",
              fontFamily: IBM,
              fontSize: "16px",
              color: "#0e0e0e",
            }}
          >
            95252 — Fernando Lima
          </div>
        </div>
        <ClbInputText
          label="Contato"
          value={contato}
          onChange={(e) => setContato(e.target.value)}
        />
        <ClbInputText
          label="E-mail"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <ClbInputText
          label="Telefone"
          value={telefone}
          onChange={(e) => setTelefone(e.target.value)}
        />
      </div>
      <div className="mb-5">
        <ClbInputText
          label="Endereço de recolha"
          value={endereco}
          onChange={(e) => setEndereco(e.target.value)}
        />
      </div>
      <div className="grid grid-cols-3 gap-5 mb-5">
        <ClbInputText label="Cidade" value={cidade} onChange={(e) => setCidade(e.target.value)} />
        <ClbInputText label="Estado" value={estado} onChange={(e) => setEstado(e.target.value)} />
        <ClbInputText label="CEP" value={cep} onChange={(e) => setCep(e.target.value)} />
      </div>
      <div className="mb-4">
        <ClbInputText
          label="Referência / observações para recolha"
          placeholder="Ex: portão azul, próximo ao mercado..."
          value={referencia}
          onChange={(e) => setReferencia(e.target.value)}
        />
      </div>
      <div
        className="flex items-start gap-1.5 rounded p-2.5"
        style={{ backgroundColor: "#FFFBEB", border: "1px solid #FDE68A" }}
      >
        <Info
          className="text-amber-500 mt-0.5 flex-shrink-0"
          style={{ width: "13px", height: "13px" }}
        />
        <p style={{ fontSize: "11px", color: "#92400E", fontFamily: IBM }}>
          As alterações feitas aqui serão usadas apenas nesta solicitação de recolha.
        </p>
      </div>
    </CardBlock>
  );
}

const EQUIPMENTS = [
  { id: "eq1", modelo: "Geladeira Brahma", tipo: "Cooler", marca: "Brahma", voltagem: "220v", etiqueta: "2090594173528-9" },
  { id: "eq2", modelo: "Freezer Skol 300L", tipo: "Freezer", marca: "Skol", voltagem: "110v", etiqueta: "3081605284639-1" },
];

function Step3Content({
  radioChoice,
  selectedEquipment,
  setSelectedEquipment,
}: {
  radioChoice: "serial" | "no-serial";
  selectedEquipment: string | null;
  setSelectedEquipment: (id: string | null) => void;
}) {
  const [observacoes, setObservacoes] = useState("");

  // Manual form state
  const [showManualForm, setShowManualForm] = useState(false);
  const [manualTipo, setManualTipo] = useState("");
  const [manualMarca, setManualMarca] = useState("");
  const [manualModelo, setManualModelo] = useState("");
  const [manualVoltagem, setManualVoltagem] = useState("");
  const [manualEtiqueta, setManualEtiqueta] = useState("");
  const [manualSerial, setManualSerial] = useState("");
  const [manualObs, setManualObs] = useState("");

  // Sync "manual" selection into parent when required fields are filled
  useEffect(() => {
    if (!showManualForm) return;
    const ready = manualTipo.trim() && manualMarca.trim() && manualModelo.trim();
    setSelectedEquipment(ready ? "manual" : null);
  }, [showManualForm, manualTipo, manualMarca, manualModelo]);

  const clearManualForm = () => {
    setManualTipo(""); setManualMarca(""); setManualModelo("");
    setManualVoltagem(""); setManualEtiqueta(""); setManualSerial(""); setManualObs("");
    setShowManualForm(false);
  };

  const handleTableSelect = (id: string) => {
    setSelectedEquipment(id);
    clearManualForm();
  };

  const handleOpenManual = () => {
    setShowManualForm(true);
    setSelectedEquipment(null);
  };

  const hasIdentifier = manualEtiqueta.trim() || manualSerial.trim();
  const manualFilled = !!(manualTipo && manualMarca && manualModelo);

  return (
    <div className="flex flex-col gap-4">
      <CardBlock>
        {/* Serial badge — no-serial flow, table mode */}
        {radioChoice === "no-serial" && selectedEquipment !== "manual" && (
          <div className="mb-3">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-500" style={{ fontSize: "11px", fontWeight: 500, fontFamily: IBM }}>
              <span className="inline-block rounded-full bg-gray-400 flex-shrink-0" style={{ width: "6px", height: "6px" }} />
              Serial não informado
            </span>
          </div>
        )}

        {/* Fixed data — serial flow */}
        {radioChoice === "serial" && (
          <div className="grid grid-cols-2 gap-4 mb-2">
            <DataRow label="Tipo" value="Cooler" />
            <DataRow label="Modelo" value="Geladeira Brahma" />
            <DataRow label="Marca" value="Brahma" />
            <DataRow label="Voltagem" value="220v" />
            <DataRow label="Número de série" value="SN-2026-009812" />
            <DataRow label="Etiqueta / RG" value="2090594173528-9" />
            <DataRow label="Modalidade" value="Comodato" />
            <DataRow label="Contrato" value="C-203948" />
          </div>
        )}

        {/* Equipment table + manual form — no-serial flow */}
        {radioChoice === "no-serial" && (
          <>
            {/* ─── Associated equipment table ─────────────────────────── */}
            <div className="mt-1">
              <h4 className="mb-2" style={{ fontSize: "13px", fontWeight: 600, color: "#374151", fontFamily: IBM }}>
                Equipamentos associados ao PDV
              </h4>
              <div className="rounded-lg border border-gray-200 overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="w-10 px-3 py-2" />
                      {["Modelo", "Tipo", "Marca", "Voltagem", "Etiqueta / RG"].map((h) => (
                        <th key={h} className="text-left px-3 py-2" style={{ fontSize: "11px", fontWeight: 600, color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.04em", fontFamily: IBM }}>
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {EQUIPMENTS.map((eq, idx) => {
                      const sel = selectedEquipment === eq.id;
                      return (
                        <tr
                          key={eq.id}
                          className="border-b border-gray-100 last:border-0 cursor-pointer transition-colors"
                          style={{ backgroundColor: sel ? "#FFF7ED" : idx % 2 === 0 ? "#FFFFFF" : "#FAFAFA" }}
                          onClick={() => handleTableSelect(eq.id)}
                        >
                          <td className="px-3 py-2.5">
                            <div className="rounded-full border-2 mx-auto flex items-center justify-center" style={{ width: "15px", height: "15px", borderColor: sel ? CORA_ORANGE : "#D1D5DB" }}>
                              {sel && <div className="rounded-full" style={{ width: "7px", height: "7px", backgroundColor: CORA_ORANGE }} />}
                            </div>
                          </td>
                          {[eq.modelo, eq.tipo, eq.marca, eq.voltagem, eq.etiqueta].map((val, i) => (
                            <td key={i} className="px-3 py-2.5" style={{ fontSize: "13px", color: i === 0 ? "#111827" : "#6B7280", fontFamily: IBM }}>{val}</td>
                          ))}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* ─── Manual entry section ────────────────────────────────── */}
            {!showManualForm ? (
              <div className="mt-4 flex items-center justify-between gap-4 rounded-lg px-4 py-3" style={{ backgroundColor: "#F9FAFB", border: "1px dashed #D1D5DB" }}>
                <div>
                  <p style={{ fontFamily: IBM, fontWeight: 500, fontSize: "13px", color: "#374151", marginBottom: "2px" }}>
                    O equipamento que será recolhido não está na lista?
                  </p>
                  <p style={{ fontFamily: IBM, fontWeight: 400, fontSize: "12px", color: "#9CA3AF" }}>
                    Informe os dados manualmente para seguir com a solicitação.
                  </p>
                </div>
                <button
                  onClick={handleOpenManual}
                  className="flex items-center gap-1.5 hover:opacity-75 transition-opacity flex-shrink-0"
                  style={{ background: "none", border: "1px solid #D1D5DB", borderRadius: "2px", padding: "8px 14px", cursor: "pointer", fontFamily: IBM, fontWeight: 500, fontSize: "13px", color: "#374151", whiteSpace: "nowrap" }}
                >
                  <span style={{ fontSize: "17px", lineHeight: 1, fontWeight: 300 }}>+</span>
                  Informar equipamento manualmente
                </button>
              </div>
            ) : (
              <div className="mt-4 rounded-lg overflow-hidden" style={{ border: "1px solid #E5E7EB" }}>
                {/* Card header */}
                <div className="flex items-center justify-between px-4 py-3 flex-wrap gap-2" style={{ backgroundColor: "#FAFAFA", borderBottom: "1px solid #E5E7EB" }}>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span style={{ fontFamily: IBM, fontWeight: 600, fontSize: "13px", color: "#111827" }}>
                      Equipamento informado manualmente
                    </span>
                    <span className="inline-flex items-center px-2 py-0.5 rounded" style={{ backgroundColor: "#FFF7ED", border: "1px solid #FDE68A", fontFamily: IBM, fontSize: "11px", fontWeight: 500, color: "#92400E" }}>
                      Não associado ao cadastro do cliente
                    </span>
                  </div>
                  <button
                    onClick={clearManualForm}
                    title="Fechar formulário manual"
                    className="hover:opacity-60 transition-opacity flex-shrink-0"
                    style={{ background: "none", border: "none", cursor: "pointer", padding: "4px" }}
                  >
                    <svg width="13" height="13" viewBox="0 0 10 10" fill="none">
                      <path d="M1 1L9 9M9 1L1 9" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  </button>
                </div>

                {/* Context warning */}
                <div className="px-4 py-2.5 flex items-start gap-2" style={{ backgroundColor: "#FFFBEB", borderBottom: "1px solid #FDE68A" }}>
                  <Info className="text-amber-500 mt-0.5 flex-shrink-0" style={{ width: "13px", height: "13px" }} />
                  <p style={{ fontFamily: IBM, fontWeight: 400, fontSize: "12px", color: "#92400E" }}>
                    Use esta opção apenas quando o equipamento não estiver disponível na lista de itens associados ao PDV.
                  </p>
                </div>

                {/* Form fields */}
                <div className="p-4 flex flex-col gap-4">
                  <div className="grid grid-cols-2 gap-4">
                    <ClbSelect
                      label="Tipo do equipamento" required
                      placeholder="Selecione o tipo"
                      value={manualTipo} onChange={setManualTipo}
                      options={[
                        { value: "Cooler", label: "Cooler" },
                        { value: "Freezer", label: "Freezer" },
                        { value: "Chopeira", label: "Chopeira" },
                        { value: "Expositor", label: "Expositor" },
                        { value: "Outro", label: "Outro" },
                      ]}
                    />
                    <ClbSelect
                      label="Marca" required
                      placeholder="Selecione a marca"
                      value={manualMarca} onChange={setManualMarca}
                      options={[
                        { value: "Brahma", label: "Brahma" },
                        { value: "Skol", label: "Skol" },
                        { value: "Antarctica", label: "Antarctica" },
                        { value: "Heineken", label: "Heineken" },
                        { value: "Amstel", label: "Amstel" },
                        { value: "Metalfrio", label: "Metalfrio" },
                        { value: "Outra", label: "Outra" },
                      ]}
                    />
                    <ClbInputText
                      label="Modelo" required
                      placeholder="Ex.: Geladeira Brahma 240L"
                      value={manualModelo} onChange={(e) => setManualModelo(e.target.value)}
                    />
                    <ClbInputText
                      label="Voltagem"
                      placeholder="Ex.: 220v"
                      value={manualVoltagem} onChange={(e) => setManualVoltagem(e.target.value)}
                    />
                    <ClbInputText
                      label="Etiqueta / RG"
                      placeholder="Ex.: 2090594173528-9"
                      value={manualEtiqueta} onChange={(e) => setManualEtiqueta(e.target.value)}
                    />
                    <ClbInputText
                      label="Número de série"
                      placeholder="Ex.: SN-2026-009812"
                      value={manualSerial} onChange={(e) => setManualSerial(e.target.value)}
                    />
                  </div>
                  <ClbInputText
                    label="Observações"
                    placeholder="Ex.: equipamento identificado visualmente no ponto de venda, sem etiqueta legível."
                    value={manualObs} onChange={(e) => setManualObs(e.target.value)}
                  />

                  {/* Identifier badge */}
                  <div>
                    {hasIdentifier ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full" style={{ backgroundColor: "#D1FAE5", fontFamily: IBM, fontSize: "11px", fontWeight: 500, color: "#065F46" }}>
                        <span className="inline-block rounded-full flex-shrink-0" style={{ width: "6px", height: "6px", backgroundColor: "#10B981" }} />
                        Identificador informado
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-500" style={{ fontFamily: IBM, fontSize: "11px", fontWeight: 500 }}>
                        <span className="inline-block rounded-full bg-gray-400 flex-shrink-0" style={{ width: "6px", height: "6px" }} />
                        Serial não informado
                      </span>
                    )}
                  </div>

                  {/* Preview — shown when required fields are filled */}
                  {manualFilled && (
                    <div className="rounded-lg overflow-hidden" style={{ border: `1px solid ${CORA_ORANGE}55`, backgroundColor: "#FFFBEB" }}>
                      <div className="px-3 py-2 flex items-center gap-2 flex-wrap" style={{ borderBottom: `1px solid ${CORA_ORANGE}44` }}>
                        <span className="inline-flex items-center px-2 py-0.5 rounded" style={{ backgroundColor: CORA_ORANGE, fontFamily: IBM, fontSize: "10px", fontWeight: 600, color: "#0e0e0e", textTransform: "uppercase", letterSpacing: "0.04em" }}>
                          Informado manualmente
                        </span>
                        <span style={{ fontFamily: IBM, fontSize: "11px", color: "#92400E" }}>
                          Não encontrado no cadastro original
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-3 p-3">
                        {([
                          { label: "Tipo", value: manualTipo },
                          { label: "Marca", value: manualMarca },
                          { label: "Modelo", value: manualModelo },
                          ...(manualVoltagem ? [{ label: "Voltagem", value: manualVoltagem }] : []),
                          { label: hasIdentifier ? "Etiqueta / RG" : "Identificador", value: hasIdentifier ? (manualEtiqueta || manualSerial) : "Serial não informado" },
                        ] as { label: string; value: string }[]).map(({ label, value }) => (
                          <div key={label}>
                            <p style={{ fontFamily: IBM, fontWeight: 400, fontSize: "10px", color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "2px" }}>{label}</p>
                            <p style={{ fontFamily: IBM, fontWeight: 500, fontSize: "12px", color: "#111827" }}>{value}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </CardBlock>

      {/* Observações logística */}
      <CardBlock>
        <p style={{ fontFamily: IBM, fontWeight: 500, fontSize: "14px", color: "#0e0e0e", marginBottom: "8px" }}>
          Observações
        </p>
        <Textarea
          placeholder="Adicione instruções para a logística, se necessário..."
          value={observacoes}
          onChange={(e) => setObservacoes(e.target.value)}
          className="bg-gray-50 border-gray-200 resize-none"
          style={{ fontSize: "13px", fontFamily: IBM }}
          rows={4}
        />
      </CardBlock>
    </div>
  );
}

// ─── CLB-style buttons ────────────────────────────────────────────────────────

function PrimaryButton({
  onClick,
  disabled,
  children,
}: {
  onClick?: () => void;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="h-[48px] rounded-[4px] overflow-hidden transition-opacity"
      style={{
        padding: "12px 24px",
        backgroundColor: disabled ? "#fcd5a1" : CORA_ORANGE,
        cursor: disabled ? "not-allowed" : "pointer",
        border: "none",
      }}
    >
      <span
        style={{ fontFamily: IBM, fontWeight: 600, fontSize: "16px", color: "#0e0e0e", whiteSpace: "nowrap" }}
      >
        {children}
      </span>
    </button>
  );
}

function SecondaryButton({
  onClick,
  children,
}: {
  onClick?: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className="h-[48px] rounded-[4px] hover:bg-gray-50 transition-colors relative"
      style={{
        padding: "12px 24px",
        backgroundColor: "rgba(255,255,255,0.32)",
        border: "1.6px solid #0e0e0e",
        cursor: "pointer",
      }}
    >
      <span
        style={{ fontFamily: IBM, fontWeight: 600, fontSize: "16px", color: "#0e0e0e", whiteSpace: "nowrap" }}
      >
        {children}
      </span>
    </button>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function SolicitacaoFormPage({
  variant,
  onVariantChange,
  onCancel,
  onSuccess,
}: SolicitacaoFormPageProps) {
  const [step, setStep] = useState(() =>
    variant === "empty" ? 0 : 2
  );
  const [radioChoice, setRadioChoice] = useState<"serial" | "no-serial">(
    variant === "no-serial" ? "no-serial" : "serial"
  );
  const [selectedEquipment, setSelectedEquipment] = useState<string | null>(
    variant === "no-serial" ? "eq1" : null
  );
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    if (variant === "empty") {
      setStep(0);
      setRadioChoice("serial");
      setSelectedEquipment(null);
    } else if (variant === "filled") {
      setStep(2);
      setRadioChoice("serial");
      setSelectedEquipment(null);
    } else if (variant === "no-serial") {
      setStep(2);
      setRadioChoice("no-serial");
      setSelectedEquipment("eq1");
    }
    setShowConfirm(false);
  }, [variant]);

  const progress = ((step + 1) / STEPS.length) * 100;
  const stepName = STEPS[step];

  const canProceed =
    step < 2 || (step === 2 && (radioChoice === "serial" || selectedEquipment !== null));

  const handleNext = () => {
    if (step < STEPS.length - 1) {
      if (step === 0) {
        onVariantChange(radioChoice === "no-serial" ? "no-serial" : "filled");
      }
      setStep((s) => s + 1);
    } else {
      setShowConfirm(true);
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep((s) => s - 1);
    } else {
      onCancel();
    }
  };

  const handleConfirm = () => {
    toast.success("Solicitação de recolha criada com sucesso.");
    setShowConfirm(false);
    onSuccess();
  };

  return (
    <div
      className="fixed left-0 right-0 bottom-0 flex flex-col"
      style={{ top: "30px", zIndex: 60, backgroundColor: "#f2f2f2", fontFamily: IBM }}
    >
      {/* ── Header ────────────────────────────────────────────────────────── */}
      <div className="bg-white flex-shrink-0" style={{ borderBottom: "1px solid #E5E7EB" }}>
        {/* Title row */}
        <div className="flex items-start p-[32px]">
          <div className="flex-1 min-w-0" style={{ height: "40px", overflow: "hidden" }}>
            <p
              className="whitespace-nowrap overflow-hidden text-ellipsis"
              style={{
                fontFamily: IBM,
                fontWeight: 600,
                fontSize: "24px",
                lineHeight: "40px",
                color: "#0e0e0e",
              }}
            >
              {stepName}
            </p>
          </div>

          {/* CLB X close button */}
          <button
            onClick={onCancel}
            className="flex items-center justify-center rounded-[4px] hover:bg-gray-100 transition-colors flex-shrink-0 ml-4"
            style={{ width: "40px", height: "40px", border: "none", backgroundColor: "transparent", cursor: "pointer" }}
          >
            <div style={{ position: "relative", width: "24px", height: "24px" }}>
              <div
                style={{
                  position: "absolute",
                  inset: "23.48%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <div style={{ position: "absolute", inset: "3.25%" }}>
                  <svg
                    style={{ display: "block", width: "100%", height: "100%" }}
                    fill="none"
                    viewBox="0 0 11.8997 11.8997"
                  >
                    <path d={svgClose.p3444b600} fill="#0E0E0E" />
                  </svg>
                </div>
              </div>
            </div>
          </button>
        </div>

        {/* Progress bar */}
        <div className="px-[8px] pb-[12px]">
          <div
            className="overflow-hidden rounded-[50px]"
            style={{ backgroundColor: "#d9d9d9", height: "8px" }}
          >
            <div
              className="rounded-[50px]"
              style={{
                width: `${progress}%`,
                height: "8px",
                backgroundColor: "#fd9d1e",
                transition: "width 0.4s ease",
              }}
            />
          </div>
          <div className="flex items-center justify-between mt-[4px] px-[0px]">
            <span style={{ fontSize: "12px", color: "#6B7280", fontFamily: IBM }}>
              Etapa {step + 1} de {STEPS.length}
            </span>
            <span
              style={{
                fontFamily: IBM,
                fontWeight: 600,
                fontSize: "14px",
                lineHeight: "22px",
                color: "#0e0e0e",
                textAlign: "right",
              }}
            >
              {Math.round(progress)}%
            </span>
          </div>
        </div>
      </div>

      {/* ── Content ───────────────────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto">
        <div
          className="mx-auto py-8 px-8"
          style={{ maxWidth: "860px" }}
        >
          {step === 0 && (
            <Step1Content
              radioChoice={radioChoice}
              setRadioChoice={setRadioChoice}
            />
          )}
          {step === 1 && <Step2Content />}
          {step === 2 && (
            <Step3Content
              radioChoice={radioChoice}
              selectedEquipment={selectedEquipment}
              setSelectedEquipment={setSelectedEquipment}
            />
          )}
        </div>
      </div>

      {/* ── Footer ────────────────────────────────────────────────────────── */}
      <div
        className="flex-shrink-0"
        style={{ borderTop: "1px solid #E5E7EB", backgroundColor: "#f2f2f2" }}
      >
        <div
          className="flex items-center"
          style={{ padding: "24px 32px", minHeight: "96px" }}
        >
          {/* Tertiary back button (CLB style) */}
          <button
            onClick={handleBack}
            className="flex items-center gap-[8px] hover:opacity-70 transition-opacity"
            style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}
          >
            <ChevronLeft style={{ width: "24px", height: "24px", color: "#0e0e0e", flexShrink: 0 }} />
            <span
              style={{
                fontFamily: IBM,
                fontWeight: 600,
                fontSize: "16px",
                color: "#0e0e0e",
                whiteSpace: "nowrap",
              }}
            >
              {step === 0 ? "Cancelar" : "Voltar"}
            </span>
          </button>

          <div className="flex-1" />

          {/* Right buttons */}
          <div className="flex items-center gap-[16px]">
            {step > 0 && (
              <SecondaryButton onClick={onCancel}>Cancelar</SecondaryButton>
            )}
            <PrimaryButton onClick={handleNext} disabled={!canProceed}>
              {step === STEPS.length - 1 ? "Criar solicitação" : "Próximo"}
            </PrimaryButton>
          </div>
        </div>
      </div>

      {/* ── Confirmation modal ─────────────────────────────────────────────── */}
      <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
        <DialogContent className="sm:max-w-md" style={{ fontFamily: IBM }}>
          <DialogHeader>
            <DialogTitle style={{ fontSize: "16px", fontWeight: 600, fontFamily: IBM }}>
              Confirmar solicitação de recolha?
            </DialogTitle>
            <DialogDescription style={{ fontSize: "13px", color: "#6B7280", fontFamily: IBM }}>
              Confira os dados antes de criar a solicitação.
            </DialogDescription>
          </DialogHeader>

          <div className="rounded-lg border border-gray-200 overflow-hidden" style={{ fontSize: "13px" }}>
            {[
              { label: "CDD", value: "CDD Campinas" },
              { label: "PDV", value: "95252 — Fernando Lima" },
              {
                label: "Equipamento",
                value: selectedEquipment === "manual"
                  ? "Informado manualmente"
                  : selectedEquipment === "eq2"
                  ? "Freezer — Freezer Skol 300L"
                  : "Cooler — Geladeira Brahma",
              },
              {
                label: "Número de série",
                value: radioChoice === "serial" ? "SN-2026-009812"
                  : selectedEquipment === "manual" ? "Não informado (manual)"
                  : "Não informado",
              },
              { label: "Endereço de recolha", value: "Rua Magnólia, nº 12 — Bairro das Flores, Campinas — SP" },
              { label: "Contato", value: "Ana Paula Gonçalves — (11) 90000-0000" },
              ...(selectedEquipment === "manual"
                ? [{ label: "Auditoria", value: "Equipamento inserido manualmente por 123456@ambev.com.br em 12/06/2026 13:45" }]
                : []),
            ].map(({ label, value }, i) => (
              <div
                key={label}
                className="flex gap-3 px-4 py-2.5 border-b border-gray-100 last:border-0"
                style={{ backgroundColor: i % 2 === 0 ? "#FFFFFF" : "#FAFAFA" }}
              >
                <span
                  className="flex-shrink-0"
                  style={{ width: "130px", fontWeight: 500, color: "#6B7280", fontSize: "12px", fontFamily: IBM }}
                >
                  {label}
                </span>
                <span style={{ color: "#111827", fontFamily: IBM }}>{value}</span>
              </div>
            ))}
          </div>

          <DialogFooter>
            <SecondaryButton onClick={() => setShowConfirm(false)}>
              Cancelar
            </SecondaryButton>
            <PrimaryButton onClick={handleConfirm}>
              Confirmar solicitação
            </PrimaryButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
