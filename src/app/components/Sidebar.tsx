import React from "react";
import {
  Package,
  Truck,
  PackageCheck,
  ClipboardList,
  ChevronDown,
} from "lucide-react";
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "./ui/tooltip";

// ─── Types ────────────────────────────────────────────────────────────────────

export type SidebarSubitem = "recolha" | "gestao" | "baixa";

export interface SidebarProps {
  isExpanded: boolean;
  activeSubitem: SidebarSubitem;
  onSubitemChange: (sub: SidebarSubitem) => void;
  onToggle: () => void;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const IBM = "'IBM Plex Sans', system-ui, sans-serif";
const CORA_ORANGE = "#fd9d1e";
const COLLAPSED_W = 72;
const EXPANDED_W = 260;


const GESTAO_SUBITEMS: { id: SidebarSubitem; label: string }[] = [
  { id: "recolha", label: "Recolha de equipamentos" },
  { id: "gestao",  label: "Gestão de Solicitações"  },
  { id: "baixa",   label: "Baixa de equipamentos"   },
];


// ─── Gestão de Ativos section ─────────────────────────────────────────────────

interface GestaoSectionProps {
  isExpanded: boolean;
  isAtivosActive: boolean;
  activeSubitem: SidebarSubitem;
  onSubitemChange: (sub: SidebarSubitem) => void;
  onToggle: () => void;
}

function GestaoAtivosSection({
  isExpanded,
  isAtivosActive,
  activeSubitem,
  onSubitemChange,
  onToggle,
}: GestaoSectionProps) {
  /* Collapsed: icon button — click expands the sidebar */
  if (!isExpanded) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            onClick={onToggle}
            className="w-full flex items-center justify-center hover:bg-gray-50 transition-colors"
            style={{
              padding: "12px 0",
              borderTop: "none",
              borderRight: "none",
              borderBottom: "none",
              borderLeft: `3px solid ${isAtivosActive ? CORA_ORANGE : "transparent"}`,
              backgroundColor: isAtivosActive ? "rgba(253,157,30,0.07)" : undefined,
              cursor: "pointer",
            }}
          >
            <Package
              style={{
                width: "18px",
                height: "18px",
                color: isAtivosActive ? CORA_ORANGE : "#6B7280",
              }}
            />
          </button>
        </TooltipTrigger>
        <TooltipContent side="right" className="text-xs">
          Gestão de Ativos — clique para expandir
        </TooltipContent>
      </Tooltip>
    );
  }

  /* Expanded: parent + subitems */
  return (
    <>
      {/* Parent item (non-clickable, always shown expanded) */}
      <div
        className="w-full flex items-center"
        style={{
          padding: "10px 20px",
          borderLeft: `3px solid ${isAtivosActive ? CORA_ORANGE + "55" : "transparent"}`,
          gap: "10px",
          fontFamily: IBM,
        }}
      >
        <Package
          style={{
            width: "18px",
            height: "18px",
            flexShrink: 0,
            color: isAtivosActive ? CORA_ORANGE : "#4B5563",
          }}
        />
        <span
          className="flex-1 text-left whitespace-nowrap overflow-hidden text-ellipsis"
          style={{
            fontSize: "13px",
            fontWeight: 500,
            color: "#111827",
          }}
        >
          Gestão de Ativos
        </span>
        <ChevronDown
          style={{
            width: "14px",
            height: "14px",
            flexShrink: 0,
            color: "#9CA3AF",
          }}
        />
      </div>

      {/* Subitems */}
      {GESTAO_SUBITEMS.map((sub) => {
        const active = activeSubitem === sub.id;
        return (
          <button
            key={sub.id}
            onClick={() => onSubitemChange(sub.id)}
            className="w-full flex items-center text-left hover:bg-gray-50 transition-colors"
            style={{
              padding: "8px 20px 8px 48px",
              borderTop: "none",
              borderRight: "none",
              borderBottom: "none",
              borderLeft: `3px solid ${active ? CORA_ORANGE : "transparent"}`,
              backgroundColor: active ? "rgba(253,157,30,0.07)" : "transparent",
              cursor: "pointer",
              fontFamily: IBM,
              gap: "8px",
            }}
          >
            {active && (
              <span
                style={{
                  width: "5px",
                  height: "5px",
                  borderRadius: "50%",
                  backgroundColor: CORA_ORANGE,
                  flexShrink: 0,
                }}
              />
            )}
            <span
              className="whitespace-nowrap overflow-hidden text-ellipsis"
              style={{
                fontSize: "13px",
                fontWeight: active ? 600 : 400,
                color: active ? "#111827" : "#6B7280",
              }}
            >
              {sub.label}
            </span>
          </button>
        );
      })}
    </>
  );
}

// ─── Main Sidebar component ───────────────────────────────────────────────────

export function Sidebar({ isExpanded, activeSubitem, onSubitemChange, onToggle }: SidebarProps) {
  const isAtivosActive = GESTAO_SUBITEMS.some((s) => s.id === activeSubitem);
  const W = isExpanded ? EXPANDED_W : COLLAPSED_W;

  return (
    <TooltipProvider delayDuration={150}>
      <div
        style={{
          position: "fixed",
          top: "86px", // 30px prototype nav + 56px topbar
          left: 0,
          bottom: 0,
          width: `${W}px`,
          backgroundColor: "white",
          borderRight: "1px solid #E5E7EB",
          zIndex: 40,
          transition: "width 0.25s ease",
          overflowX: "hidden",
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Gestão de Ativos + subitems */}
        <GestaoAtivosSection
          isExpanded={isExpanded}
          isAtivosActive={isAtivosActive}
          activeSubitem={activeSubitem}
          onSubitemChange={onSubitemChange}
          onToggle={onToggle}
        />
      </div>
    </TooltipProvider>
  );
}
