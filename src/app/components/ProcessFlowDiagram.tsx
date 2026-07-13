import { useState } from "react";
import {
  AlertTriangle,
  Check,
  CheckCircle2,
  Database,
  FileSpreadsheet,
  HelpCircle,
  Mail,
  MessageSquarePlus,
  Pencil,
  Plus,
  Trash2,
  UserCircle,
  X,
} from "lucide-react";
import { useActionModal } from "./ActionModal";

export type ProcessStepStatus =
  | "em validação"
  | "em revisão"
  | "validado"
  | "ajustar"
  | "discordância"
  | "dúvida"
  | "pendência"
  | "fora de escopo"
  | "transformado em hipótese";

export interface ProcessFlowStep {
  id: string;
  title?: string;
  text: string;
  area: string;
  roles?: string[];
  tools?: string | string[];
  systems?: string[];
  doubts?: string[];
  dependencies?: string[];
  origin?: string;
  note?: string;
  impact: "Baixo" | "Médio" | "Alto";
  status: ProcessStepStatus;
  comments: string[];
}

interface ProcessFlowDiagramProps {
  steps: ProcessFlowStep[];
  origin?: string;
  variant?: "linear" | "branching" | "parallel";
  diagramTitle?: string;
  canEditFlow?: boolean;
  onUpdateStep: (stepId: string, patch: Partial<ProcessFlowStep>) => void;
  onAddContribution: (type: string, content: string, relatedItemId?: string, impact?: "Baixo" | "Médio" | "Alto") => void;
  onAddRelatedPain: (step: ProcessFlowStep, text: string) => void;
  onAddRelatedRule: (step: ProcessFlowStep, text: string) => void;
  onCreateHypothesis: (step: ProcessFlowStep) => void;
  onAddStep: (step: ProcessFlowStep) => void;
  onDeleteStep: (stepId: string) => void;
}

function asList(value?: string | string[]) {
  if (!value) return [];
  return Array.isArray(value) ? value : value.split(",").map((item) => item.trim()).filter(Boolean);
}

function listFromPrompt(value: string) {
  return value.split(",").map((item) => item.trim()).filter(Boolean);
}

function ToolIcon({ label }: { label: string }) {
  const lower = label.toLowerCase();
  if (lower.includes("outlook")) return <Mail size={16} />;
  if (lower.includes("excel")) return <FileSpreadsheet size={16} />;
  return <Database size={16} />;
}

function SmallBadge({ children }: { children: string }) {
  return <span className="inline-flex min-h-7 items-center rounded-full bg-[#EAEAEA] px-3 py-1 text-xs font-bold text-[#2D2A26]">{children}</span>;
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

function EditableInfoPanel({
  title,
  items,
  empty,
  icon,
  editing,
  draft,
  canEdit = true,
  onEdit,
  onDraft,
  onSave,
}: {
  title: string;
  items: string[];
  empty: string;
  icon: "role" | "tool" | "system" | "comment" | "doubt";
  editing: boolean;
  draft: string;
  canEdit?: boolean;
  onEdit: () => void;
  onDraft: (value: string) => void;
  onSave: () => void;
}) {
  const Icon = icon === "role" ? UserCircle : icon === "tool" ? FileSpreadsheet : icon === "system" ? Database : icon === "doubt" ? HelpCircle : MessageSquarePlus;
  return (
    <div className="rounded-lg bg-[#F6F6F4] p-3">
      <div className="flex items-center justify-between gap-3">
        <h4 className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.12em] text-[#756F68]"><Icon size={14} />{title}</h4>
        {canEdit && <button type="button" title={`Editar ${title.toLowerCase()}`} onClick={onEdit} className="grid h-7 w-7 flex-shrink-0 place-items-center rounded-md border border-transparent text-[#756F68] transition hover:border-[#D8D8D8] hover:bg-white hover:text-[#2D2A26]" aria-label={`Editar ${title.toLowerCase()}`}><Pencil size={14} /></button>}
      </div>
      {editing ? (
        <textarea autoFocus className="mt-2 min-h-24 w-full resize-y rounded-md border border-[#C8C8C8] bg-white p-2 text-sm font-semibold leading-5 text-[#2D2A26] outline-none focus:border-[#2D2A26]" value={draft} onChange={(event) => onDraft(event.target.value)} onBlur={onSave} onKeyDown={(event) => { if ((event.metaKey || event.ctrlKey) && event.key === "Enter") onSave(); }} />
      ) : items.length ? (
        <ul className="mt-2 grid gap-1 text-sm font-semibold leading-6 text-[#2D2A26]">{items.map((itemText, index) => <li key={`${itemText}-${index}`}>{itemText}</li>)}</ul>
      ) : (
        <p className="mt-2 text-sm text-[#756F68]">{empty}</p>
      )}
    </div>
  );
}

function ProcessStepBox({ step, onSelect, wide = false }: { step: ProcessFlowStep; onSelect: (stepId: string) => void; wide?: boolean }) {
  const roles = step.roles?.length ? step.roles : asList(step.area);
  const supportingItems = [...asList(step.tools), ...(step.systems ?? [])];
  return (
    <button type="button" onClick={() => onSelect(step.id)} className={`group flex ${wide ? "w-[250px]" : "w-[230px]"} flex-col text-left outline-none transition hover:scale-[1.01]`} aria-label={`Abrir detalhe do passo ${step.title ?? step.text}`}>
      <div className="flex min-h-11 items-end justify-center gap-1.5 px-1 pb-1.5">
        {roles.map((role, roleIndex) => (
          <div key={`${step.id}-${role}`} className="grid min-w-0 justify-items-center gap-1">
            <span className={`grid h-7 w-7 place-items-center rounded-full border border-white shadow-sm ${roleIndex % 2 ? "bg-[#F0647A] text-white" : "bg-[#FFE7B0] text-[#2D2A26]"}`}><UserCircle size={17} /></span>
            <span className="max-w-[92px] text-center text-[9px] font-bold leading-3 text-[#2D2A26]">{role}</span>
          </div>
        ))}
      </div>
      <div className={`border border-[#B8BCC2] bg-white shadow-sm transition group-hover:border-[#2D2A26] ${step.status === "validado" ? "ring-2 ring-[#79C58A]" : step.status === "pendência" || step.status === "dúvida" ? "ring-2 ring-[#E4B4B4]" : ""}`}>
        <div className="flex min-h-9 items-center justify-center bg-[#2D2A26] px-2 py-1 text-center text-[11px] font-bold uppercase leading-4 text-white">{step.title ?? step.text}</div>
        <div className={`flex ${wide ? "min-h-[102px]" : "min-h-[118px]"} items-center justify-center px-3 py-3 text-center text-[14px] font-semibold leading-5 text-[#2D2A26]`}>{step.text}</div>
      </div>
      <div className="flex min-h-9 flex-wrap items-start justify-center gap-1.5 pt-2">
        {supportingItems.map((itemLabel) => <span key={`${step.id}-${itemLabel}`} className="inline-flex items-center gap-1 rounded-sm border border-[#D8D8D8] bg-white px-1.5 py-1 text-[10px] font-bold text-[#2D2A26] shadow-sm"><ToolIcon label={itemLabel} />{itemLabel}</span>)}
      </div>
    </button>
  );
}

function Arrow({ className = "" }: { className?: string }) {
  return <div className={`flex w-8 items-center ${className}`} aria-hidden="true"><div className="h-0.5 flex-1 bg-[#2D2A26]" /><div className="h-0 w-0 border-y-[5px] border-l-[8px] border-y-transparent border-l-[#2D2A26]" /></div>;
}

function LineArrow({ x, y, w }: { x: number; y: number; w: number }) {
  return <div className="absolute h-0.5 bg-[#2D2A26]" style={{ left: x, top: y, width: w }} aria-hidden="true"><span className="absolute right-[-8px] top-[-5px] h-0 w-0 border-y-[6px] border-l-[9px] border-y-transparent border-l-[#2D2A26]" /></div>;
}

function BranchingFlow({ steps, onSelect }: { steps: ProcessFlowStep[]; onSelect: (stepId: string) => void }) {
  const [direct, bees, review, lake, gpro, beesLink] = steps;
  return (
    <div className="relative h-[610px] w-[1500px]">
      <div className="absolute left-[70px] top-[28px]">{direct && <ProcessStepBox step={direct} onSelect={onSelect} wide />}</div>
      <div className="absolute left-[70px] top-[278px]">{bees && <ProcessStepBox step={bees} onSelect={onSelect} wide />}</div>
      <div className="absolute left-[455px] top-[278px]">{review && <ProcessStepBox step={review} onSelect={onSelect} wide />}</div>
      <div className="absolute left-[840px] top-[278px]">{lake && <ProcessStepBox step={lake} onSelect={onSelect} wide />}</div>
      <div className="absolute left-[1220px] top-[138px]">{gpro && <ProcessStepBox step={gpro} onSelect={onSelect} wide />}</div>
      <div className="absolute left-[1220px] top-[278px]">{beesLink && <ProcessStepBox step={beesLink} onSelect={onSelect} wide />}</div>
      <LineArrow x={330} y={405} w={125} />
      <LineArrow x={715} y={405} w={125} />
      <div className="absolute left-[1100px] top-[405px] h-0.5 w-[60px] bg-[#2D2A26]" aria-hidden="true" />
      <div className="absolute left-[1160px] top-[265px] h-[140px] w-0.5 bg-[#2D2A26]" aria-hidden="true" />
      <LineArrow x={1160} y={265} w={60} />
      <LineArrow x={1160} y={405} w={60} />
      <span className="absolute left-[1110px] top-[313px] w-[96px] text-center text-[10px] font-bold leading-3 text-[#2D2A26]">{gpro?.note}</span>
      <span className="absolute left-[1110px] top-[420px] w-[96px] text-center text-[10px] font-bold leading-3 text-[#2D2A26]">{beesLink?.note}</span>
    </div>
  );
}

function ParallelFlow({ steps, onSelect }: { steps: ProcessFlowStep[]; onSelect: (stepId: string) => void }) {
  const [manual, automatic, send] = steps;
  return (
    <div className="relative h-[460px] w-[920px]">
      <div className="absolute left-[70px] top-[28px]">{manual && <ProcessStepBox step={manual} onSelect={onSelect} wide />}</div>
      <div className="absolute left-[70px] top-[208px]">{automatic && <ProcessStepBox step={automatic} onSelect={onSelect} wide />}</div>
      <div className="absolute left-[500px] top-[208px]">{send && <ProcessStepBox step={send} onSelect={onSelect} wide />}</div>
      <LineArrow x={330} y={335} w={170} />
    </div>
  );
}

export function ProcessFlowDiagram({ steps, origin, variant = "linear", diagramTitle = "Fluxo", canEditFlow = false, onUpdateStep, onAddContribution, onAddRelatedPain, onAddRelatedRule, onCreateHypothesis, onAddStep, onDeleteStep }: ProcessFlowDiagramProps) {
  const openModal = useActionModal();
  const [selectedId, setSelectedId] = useState("");
  const selectedStep = steps.find((step) => step.id === selectedId);
  const flowReady = steps.every((step) => step.status === "validado" || step.status === "pendência");
  const isBranching = variant === "branching";
  const isParallel = variant === "parallel";
  const linearWidth = Math.max(steps.length * 264 + Math.max(steps.length - 1, 0) * 16, 820);
  const addStep = () => openModal({
    title: "Adicionar passo ao fluxo",
    confirmLabel: "Adicionar passo",
    fields: [
      { id: "title", label: "Título do passo", required: true },
      { id: "text", label: "Descrição", multiline: true, required: true },
      { id: "roles", label: "Papéis envolvidos", placeholder: "Separar por vírgula" },
      { id: "tools", label: "Ferramentas", placeholder: "Separar por vírgula" },
      { id: "systems", label: "Sistemas", placeholder: "Separar por vírgula" },
    ],
    onSubmit: ({ title, text, roles, tools, systems }) => {
      const step: ProcessFlowStep = { id: `flow-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`, title: title.trim(), text: text.trim(), area: roles.trim() || "Workshop", roles: listFromPrompt(roles), tools: listFromPrompt(tools), systems: listFromPrompt(systems), origin: "Workshop", impact: "Médio", status: "em validação", comments: [] };
      onAddStep(step);
      onAddContribution("ajuste de fluxo", `Novo passo adicionado: ${step.title}`, step.id, step.impact);
    },
  });

  return (
    <section className="min-w-0 max-w-full">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold">Fluxo - {diagramTitle}</h2>
        </div>
        {canEditFlow && <div className="flex flex-wrap gap-2">
          <button type="button" onClick={addStep} className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-[#D8D8D8] bg-white px-4 text-sm font-bold text-[#2D2A26] transition hover:border-[#2D2A26]"><Plus size={17} />Adicionar passo</button>
          <button type="button" disabled={!flowReady} onClick={() => onAddContribution("comentário", "Fluxo validado")} className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-[#D8D8D8] bg-white px-4 text-sm font-bold text-[#2D2A26] transition hover:border-[#2D2A26] disabled:cursor-not-allowed disabled:opacity-50">
            <CheckCircle2 size={17} />Fluxo validado
          </button>
        </div>}
      </div>

      <div className="mt-2 w-full max-w-full overflow-x-auto overscroll-x-contain rounded-lg border border-[#8D9299] bg-[#F3F4F4] p-2 shadow-sm">
        <div className={`${isBranching ? "w-[1500px]" : isParallel ? "w-[920px]" : ""} max-w-none`} style={!isBranching && !isParallel ? { width: linearWidth } : undefined}>
          {isBranching ? (
            <BranchingFlow steps={steps} onSelect={setSelectedId} />
          ) : isParallel ? (
            <ParallelFlow steps={steps} onSelect={setSelectedId} />
          ) : (
          <div className="flex items-start">
            {steps.map((step, index) => {
              return (
                <div key={step.id} className="flex items-center">
                  <ProcessStepBox step={step} onSelect={setSelectedId} />
                  {index < steps.length - 1 && <Arrow className="mx-1 mt-[116px]" />}
                </div>
              );
            })}
          </div>
          )}
        </div>
      </div>

      {selectedStep && <StepModal step={selectedStep} origin={origin} canEditFlow={canEditFlow} onClose={() => setSelectedId("")} onUpdateStep={onUpdateStep} onAddContribution={onAddContribution} onAddRelatedPain={onAddRelatedPain} onAddRelatedRule={onAddRelatedRule} onCreateHypothesis={onCreateHypothesis} onAddStep={onAddStep} onDeleteStep={onDeleteStep} />}
    </section>
  );
}

function StepModal({ step, canEditFlow = false, onClose, onUpdateStep, onAddContribution, onAddRelatedPain, onAddRelatedRule, onDeleteStep }: ProcessFlowDiagramProps & { step: ProcessFlowStep; onClose: () => void }) {
  const openModal = useActionModal();
  const roles = step.roles?.length ? step.roles : asList(step.area);
  const tools = asList(step.tools);
  const systems = step.systems ?? [];
  const resources = [...tools, ...systems];
  const doubts = step.doubts ?? [];
  type EditableField = "title" | "description" | "roles" | "resources" | "doubts";
  const [editing, setEditing] = useState<EditableField | "">("");
  const [draft, setDraft] = useState("");

  const beginEdit = (field: EditableField, value: string) => {
    setEditing(field);
    setDraft(value);
  };
  const saveEdit = () => {
    if (!editing) return;
    const text = draft.trim();
    if (editing === "title" && text) {
      onUpdateStep(step.id, { title: text });
      onAddContribution("ajuste de fluxo", `Título ajustado em ${step.title ?? step.text}: ${text}`, step.id);
    }
    if (editing === "description" && text) {
      onUpdateStep(step.id, { text });
      onAddContribution("ajuste de fluxo", `Descrição ajustada em ${step.title}: ${text}`, step.id);
    }
    if (editing === "roles") {
      const nextRoles = listFromPrompt(draft);
      onUpdateStep(step.id, { roles: nextRoles, area: nextRoles.join(", ") || step.area });
      onAddContribution("ajuste de fluxo", `Papéis ajustados em ${step.title}: ${nextRoles.join(", ") || "sem papel"}`, step.id);
    }
    if (editing === "resources") {
      const nextResources = listFromPrompt(draft);
      onUpdateStep(step.id, { tools: nextResources, systems: [] });
      onAddContribution("ajuste de fluxo", `Ferramentas e sistemas ajustados em ${step.title}: ${nextResources.join(", ") || "sem recurso"}`, step.id);
    }
    if (editing === "doubts") onUpdateStep(step.id, { doubts: draft.split("\n").map((item) => item.trim()).filter(Boolean), status: draft.trim() ? "dúvida" : step.status });
    setEditing("");
    setDraft("");
  };
  const addDoubt = () => {
    openModal({ title: "Adicionar dúvida", confirmLabel: "Adicionar dúvida", fields: [{ id: "text", label: "Dúvida", multiline: true, required: true }], onSubmit: ({ text }) => { onUpdateStep(step.id, { status: "dúvida", doubts: [text, ...doubts] }); onAddContribution("pendência", `Dúvida em ${step.title}: ${text}`, step.id); } });
  };
  const addRelatedPain = () => openModal({ title: "Adicionar dor relacionada", confirmLabel: "Adicionar", fields: [{ id: "text", label: "Dor relacionada", multiline: true, required: true }], onSubmit: ({ text }) => onAddRelatedPain(step, text) });
  const addRelatedRule = () => openModal({ title: "Adicionar regra de negócio", confirmLabel: "Adicionar", fields: [{ id: "text", label: "Regra de negócio", multiline: true, required: true }], onSubmit: ({ text }) => onAddRelatedRule(step, text) });
  const deleteStep = () => openModal({
    title: "Excluir passo do fluxo?",
    message: step.title ?? step.text,
    confirmLabel: "Excluir passo",
    tone: "danger",
    onSubmit: () => {
      onDeleteStep(step.id);
      onAddContribution("ajuste de fluxo", `Passo removido: ${step.title ?? step.text}`, step.id, step.impact);
      onClose();
    },
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <section className="max-h-[86vh] w-full max-w-2xl overflow-y-auto rounded-lg border border-[#D8D8D8] bg-white p-4 shadow-xl">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap gap-2"><SmallBadge>{step.status}</SmallBadge><SmallBadge>{`Impacto ${step.impact}`}</SmallBadge></div>
            <div className="mt-2 flex items-start gap-2">
              {editing === "title" ? (
                <input autoFocus className="min-w-0 flex-1 rounded-md border border-[#C8C8C8] bg-white px-3 py-2 text-xl font-bold uppercase text-[#2D2A26] outline-none focus:border-[#2D2A26]" value={draft} onChange={(event) => setDraft(event.target.value)} onBlur={saveEdit} onKeyDown={(event) => { if (event.key === "Enter") saveEdit(); }} />
              ) : (
                <h3 className="min-w-0 flex-1 text-xl font-bold uppercase text-[#2D2A26]">{step.title ?? step.text}</h3>
              )}
              {canEditFlow && <button type="button" title="Editar título" onClick={() => beginEdit("title", step.title ?? "")} className="grid h-7 w-7 flex-shrink-0 place-items-center rounded-md border border-transparent text-[#756F68] transition hover:border-[#D8D8D8] hover:bg-[#F6F6F4] hover:text-[#2D2A26]" aria-label="Editar título"><Pencil size={14} /></button>}
            </div>
            <div className="mt-1.5 flex items-start gap-2">
              {editing === "description" ? (
                <textarea autoFocus className="min-h-20 min-w-0 flex-1 rounded-md border border-[#C8C8C8] bg-white px-3 py-2 text-sm leading-6 text-[#2D2A26] outline-none focus:border-[#2D2A26]" value={draft} onChange={(event) => setDraft(event.target.value)} onBlur={saveEdit} onKeyDown={(event) => { if ((event.metaKey || event.ctrlKey) && event.key === "Enter") saveEdit(); }} />
              ) : (
                <p className="min-w-0 flex-1 text-sm leading-6 text-[#5B5650]">{step.text}</p>
              )}
              {canEditFlow && <button type="button" title="Editar descrição" onClick={() => beginEdit("description", step.text)} className="grid h-7 w-7 flex-shrink-0 place-items-center rounded-md border border-transparent text-[#756F68] transition hover:border-[#D8D8D8] hover:bg-[#F6F6F4] hover:text-[#2D2A26]" aria-label="Editar descrição"><Pencil size={14} /></button>}
            </div>
          </div>
          <button type="button" onClick={onClose} className="grid h-9 w-9 flex-shrink-0 place-items-center rounded-md border border-[#D8D8D8] bg-white text-[#2D2A26] hover:border-[#2D2A26]" aria-label="Fechar detalhe"><X size={18} /></button>
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <EditableInfoPanel title="Papéis envolvidos" items={roles} empty="Sem papel informado." icon="role" editing={editing === "roles"} draft={draft} canEdit={canEditFlow} onEdit={() => beginEdit("roles", roles.join(", "))} onDraft={setDraft} onSave={saveEdit} />
          <EditableInfoPanel title="Ferramentas e sistemas" items={resources} empty="Sem ferramenta ou sistema informado." icon="system" editing={editing === "resources"} draft={draft} canEdit={canEditFlow} onEdit={() => beginEdit("resources", resources.join(", "))} onDraft={setDraft} onSave={saveEdit} />
        </div>

        <div className="mt-4 flex flex-wrap gap-2 border-t border-[#EAEAEA] pt-3">
          {canEditFlow && <button type="button" onClick={() => onUpdateStep(step.id, { status: "validado" })} className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-[#FFC629] px-4 text-sm font-bold text-[#2D2A26] transition hover:bg-[#FFD65E]"><Check size={17} />Confirmar passo</button>}
          <button type="button" onClick={addDoubt} className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-[#D8D8D8] bg-white px-4 text-sm font-bold text-[#2D2A26] transition hover:border-[#2D2A26]"><HelpCircle size={17} />Adicionar dúvida</button>
          <button type="button" onClick={addRelatedPain} className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-[#D8D8D8] bg-white px-4 text-sm font-bold text-[#2D2A26] transition hover:border-[#2D2A26]">Adicionar dor relacionada</button>
          <button type="button" onClick={addRelatedRule} className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-[#D8D8D8] bg-white px-4 text-sm font-bold text-[#2D2A26] transition hover:border-[#2D2A26]">Adicionar regra de negócio</button>
          {canEditFlow && <button type="button" onClick={deleteStep} className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-[#F3C7C7] bg-white px-4 text-sm font-bold text-[#8A1F1F] transition hover:border-[#8A1F1F]"><Trash2 size={17} />Excluir passo</button>}
        </div>
      </section>
    </div>
  );
}
