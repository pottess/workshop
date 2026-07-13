import { createContext, useContext, useEffect, useState } from "react";
import { AlertTriangle, X } from "lucide-react";

export interface ActionModalField {
  id: string;
  label: string;
  value?: string;
  placeholder?: string;
  multiline?: boolean;
  required?: boolean;
  options?: Array<{ label: string; value: string }>;
}

export interface ActionModalRequest {
  title: string;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  tone?: "default" | "danger";
  fields?: ActionModalField[];
  onSubmit: (values: Record<string, string>) => void;
}

const ActionModalContext = createContext<(request: ActionModalRequest) => void>(() => undefined);

export function useActionModal() {
  return useContext(ActionModalContext);
}

export function ActionModalProvider({ children }: { children: React.ReactNode }) {
  const [request, setRequest] = useState<ActionModalRequest | null>(null);
  const [draft, setDraft] = useState<Record<string, string>>({});

  useEffect(() => {
    setDraft(Object.fromEntries((request?.fields ?? []).map((field) => [field.id, field.value ?? ""])));
  }, [request]);

  const close = () => setRequest(null);
  const submit = () => {
    if (!request) return;
    const missing = (request.fields ?? []).some((field) => field.required && !draft[field.id]?.trim());
    if (missing) return;
    request.onSubmit(draft);
    close();
  };

  return (
    <ActionModalContext.Provider value={setRequest}>
      {children}
      {request && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/45 p-4">
          <section className="w-full max-w-xl rounded-lg border border-[#D8D8D8] bg-white p-5 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                {request.tone === "danger" && <span className="grid h-9 w-9 place-items-center rounded-full bg-[#FFE9E9] text-[#8A1F1F]"><AlertTriangle size={18} /></span>}
                <div>
                  <h2 className="text-xl font-bold text-[#2D2A26]">{request.title}</h2>
                  {request.message && <p className="mt-1 text-sm leading-6 text-[#5B5650]">{request.message}</p>}
                </div>
              </div>
              <button type="button" onClick={close} className="grid h-9 w-9 place-items-center rounded-md border border-[#D8D8D8] bg-white text-[#2D2A26] hover:border-[#2D2A26]" aria-label="Fechar"><X size={18} /></button>
            </div>
            {!!request.fields?.length && (
              <div className="mt-4 grid gap-3">
                {request.fields.map((field) => (
                  <label key={field.id} className="grid gap-1 text-sm font-bold text-[#2D2A26]">
                    <span>{field.label}</span>
                    {field.options ? (
                      <select autoFocus className="min-h-10 rounded-md border border-[#D8D8D8] bg-white px-3 py-2 text-sm font-normal text-[#2D2A26] outline-none transition focus:border-[#FFC629] focus:ring-2 focus:ring-[#FFC629]/20" value={draft[field.id] ?? ""} onChange={(event) => setDraft((current) => ({ ...current, [field.id]: event.target.value }))}>
                        {field.options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                      </select>
                    ) : field.multiline ? (
                      <textarea autoFocus className="min-h-28 resize-y rounded-md border border-[#D8D8D8] bg-white px-3 py-2 text-sm font-normal text-[#2D2A26] outline-none transition focus:border-[#FFC629] focus:ring-2 focus:ring-[#FFC629]/20" value={draft[field.id] ?? ""} placeholder={field.placeholder} onChange={(event) => setDraft((current) => ({ ...current, [field.id]: event.target.value }))} />
                    ) : (
                      <input autoFocus className="min-h-10 rounded-md border border-[#D8D8D8] bg-white px-3 py-2 text-sm font-normal text-[#2D2A26] outline-none transition focus:border-[#FFC629] focus:ring-2 focus:ring-[#FFC629]/20" value={draft[field.id] ?? ""} placeholder={field.placeholder} onChange={(event) => setDraft((current) => ({ ...current, [field.id]: event.target.value }))} onKeyDown={(event) => { if (event.key === "Enter") submit(); }} />
                    )}
                  </label>
                ))}
              </div>
            )}
            <div className="mt-5 flex flex-wrap justify-end gap-2">
              <button type="button" onClick={close} className="inline-flex h-10 items-center justify-center rounded-md border border-[#D8D8D8] bg-white px-4 text-sm font-bold text-[#2D2A26] hover:border-[#2D2A26]">{request.cancelLabel ?? "Cancelar"}</button>
              <button type="button" onClick={submit} className={`inline-flex h-10 items-center justify-center rounded-md px-4 text-sm font-bold transition ${request.tone === "danger" ? "bg-[#8A1F1F] text-white hover:bg-[#721818]" : "bg-[#FFC629] text-[#2D2A26] hover:bg-[#FFD65E]"}`}>{request.confirmLabel ?? "Confirmar"}</button>
            </div>
          </section>
        </div>
      )}
    </ActionModalContext.Provider>
  );
}
