/**
 * CLB (Celebration) Design System Components
 * Matches the CLB-Status, CLB-Pagination, CLB-InputText, CLB-Select, CLB-RadioButton
 * designs from Figma.
 */

import React, { useState, useEffect } from "react";
import svgPositive from "../../imports/ClbStatusAtualizado/svg-6bhyoid05u";
import svgWarning from "../../imports/ClbStatusAtualizado-1/svg-bpwaavokpt";
import svgNegative from "../../imports/ClbStatusAtualizado-2/svg-2s5nass12w";
import svgNeutral from "../../imports/ClbStatusAtualizado-3/svg-hvnoapn0qc";
import svgInfo from "../../imports/ClbStatusAtualizado-4/svg-4jo4v9ykmu";
import svgPag from "../../imports/ClbPaginationAtualizado/svg-kz9qiaewpt";
import svgSelectIcon from "../../imports/ClbSelectAtualizado/svg-s0ip8sme31";

// ─── Design tokens ────────────────────────────────────────────────────────────

const IBM = "'IBM Plex Sans', system-ui, sans-serif";

// ═══════════════════════════════════════════════════════════════════════════════
// CLB STATUS
// ═══════════════════════════════════════════════════════════════════════════════

const STATUS_CFG = {
  positive: {
    bg: "#e1fce9",
    fill: "#08663B",
    path: svgPositive.p2ef16bf0,
    viewBox: "0 0 10 10",
    inset: "8.33%",
  },
  warning: {
    bg: "#fff0de",
    fill: "#DB5C00",
    path: svgWarning.pe6170a0,
    viewBox: "0 0 10.5264 9.2501",
    inset: "12.5% 8.11% 10.42% 4.17%",
  },
  negative: {
    bg: "#ffeaea",
    fill: "#AE1E1E",
    path: svgNegative.p2a98c600,
    viewBox: "0 0 9.91304 9.91304",
    inset: "8.33% 9.92% 9.06% 7.47%",
  },
  neutral: {
    bg: "#d9d9d9",
    fill: "#666666",
    path: svgNeutral.p335ba380,
    viewBox: "0 0 10 10",
    inset: "8.33%",
  },
  info: {
    bg: "#deecff",
    fill: "#2B83F7",
    path: svgInfo.p163f3871,
    viewBox: "0 0 10 10",
    inset: "8.33% 6.36% 8.33% 10.31%",
  },
} as const;

export type ClbStatusVariant = keyof typeof STATUS_CFG;

export function ClbStatus({
  variant,
  label,
}: {
  variant: ClbStatusVariant;
  label: string;
}) {
  const cfg = STATUS_CFG[variant];
  return (
    <div
      className="inline-flex items-center gap-[4px] px-[8px] rounded-[2px] whitespace-nowrap flex-shrink-0"
      style={{ backgroundColor: cfg.bg, height: "24px", paddingTop: "4px", paddingBottom: "4px" }}
    >
      {/* Icon 12×12 */}
      <div className="relative flex-shrink-0" style={{ width: "12px", height: "12px" }}>
        <div className="absolute" style={{ inset: cfg.inset }}>
          <svg
            className="absolute inset-0 block w-full h-full"
            fill="none"
            preserveAspectRatio="none"
            viewBox={cfg.viewBox}
          >
            <path d={cfg.path} fill={cfg.fill} />
          </svg>
        </div>
      </div>
      {/* Label */}
      <span
        style={{
          fontFamily: IBM,
          fontWeight: 400,
          fontSize: "13px",
          lineHeight: "16px",
          color: "#0e0e0e",
        }}
      >
        {label}
      </span>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// CLB PAGINATION
// ═══════════════════════════════════════════════════════════════════════════════

interface ClbPaginationProps {
  total: number;
  page: number;
  perPage: number;
  onPageChange: (page: number) => void;
  onPerPageChange: (perPage: number) => void;
}

function PaginationChevronBtn({
  kind,
  disabled,
  onClick,
}: {
  kind: "first" | "prev" | "next" | "last";
  disabled: boolean;
  onClick: () => void;
}) {
  const isDouble = kind === "first" || kind === "last";
  const isLeft = kind === "first" || kind === "prev";
  const path = isDouble ? svgPag.p32a3580 : svgPag.p3ca70180;
  const viewBox = isDouble ? "0 0 11.1625 12.5635" : "0 0 11.5594 6.40326";
  const fill = disabled ? "#BFBFBF" : "#0E0E0E";
  const rotateDeg = isLeft ? "-90deg" : "90deg";

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        width: "40px",
        height: "40px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "transparent",
        border: "none",
        borderRadius: "2px",
        cursor: disabled ? "default" : "pointer",
        padding: 0,
        flexShrink: 0,
      }}
    >
      <svg
        fill="none"
        viewBox={viewBox}
        style={{
          transform: `rotate(${rotateDeg})`,
          width: isDouble ? "14px" : "13px",
          height: "auto",
          display: "block",
        }}
      >
        <path d={path} fill={fill} />
      </svg>
    </button>
  );
}

export function ClbPagination({
  total,
  page,
  perPage,
  onPageChange,
  onPerPageChange,
}: ClbPaginationProps) {
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const startItem = Math.min((page - 1) * perPage + 1, total);
  const endItem = Math.min(page * perPage, total);

  const [inputVal, setInputVal] = useState(String(page));
  useEffect(() => setInputVal(String(page)), [page]);

  const commitPage = () => {
    const n = parseInt(inputVal, 10);
    if (!isNaN(n) && n >= 1 && n <= totalPages) {
      onPageChange(n);
    } else {
      setInputVal(String(page));
    }
  };

  return (
    <div
      className="flex items-center w-full"
      style={{ height: "40px", fontFamily: IBM, position: "relative" }}
    >
      {/* Left — per-page select */}
      <div className="flex items-center gap-[8px] flex-shrink-0">
        {/* Custom per-page select */}
        <div className="relative flex-shrink-0" style={{ width: "69px", height: "40px" }}>
          <select
            value={String(perPage)}
            onChange={(e) => onPerPageChange(Number(e.target.value))}
            style={{
              appearance: "none",
              WebkitAppearance: "none",
              width: "100%",
              height: "40px",
              backgroundColor: "rgba(255,255,255,0.32)",
              border: "1px solid #d9d9d9",
              borderRadius: "2px",
              paddingLeft: "16px",
              paddingRight: "32px",
              fontFamily: IBM,
              fontWeight: 400,
              fontSize: "14px",
              color: "#0e0e0e",
              cursor: "pointer",
            }}
          >
            {[10, 25, 50].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
          {/* Chevron */}
          <div
            style={{
              position: "absolute",
              right: "8px",
              top: "50%",
              transform: "translateY(-50%)",
              pointerEvents: "none",
              display: "flex",
              alignItems: "center",
            }}
          >
            <svg fill="none" viewBox="0 0 7.43333 4.64745" style={{ width: "8px", height: "auto", transform: "rotate(180deg)" }}>
              <path d={svgPag.p1db3c3f1} fill="#0E0E0E" />
            </svg>
          </div>
        </div>
        <span
          style={{ fontFamily: IBM, fontWeight: 400, fontSize: "14px", color: "#0e0e0e", whiteSpace: "nowrap" }}
        >
          Itens por página
        </span>
      </div>

      {/* Center — navigation */}
      <div className="flex items-center gap-[8px] absolute left-1/2 -translate-x-1/2">
        {/* Back buttons */}
        <div className="flex items-center gap-[8px]">
          <PaginationChevronBtn kind="first" disabled={page <= 1} onClick={() => onPageChange(1)} />
          <PaginationChevronBtn kind="prev" disabled={page <= 1} onClick={() => onPageChange(page - 1)} />
        </div>

        {/* Page input */}
        <div className="flex items-center gap-[8px]">
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onBlur={commitPage}
            onKeyDown={(e) => e.key === "Enter" && commitPage()}
            style={{
              width: "48px",
              height: "40px",
              backgroundColor: "rgba(255,255,255,0.32)",
              border: "1px solid #d9d9d9",
              borderRadius: "4px",
              textAlign: "center",
              fontFamily: IBM,
              fontWeight: 400,
              fontSize: "16px",
              color: "#0e0e0e",
            }}
          />
          <span style={{ fontFamily: IBM, fontWeight: 400, fontSize: "16px", color: "#0e0e0e", whiteSpace: "nowrap" }}>
            de {totalPages}
          </span>
        </div>

        {/* Forward buttons */}
        <div className="flex items-center gap-[8px]">
          <PaginationChevronBtn kind="next" disabled={page >= totalPages} onClick={() => onPageChange(page + 1)} />
          <PaginationChevronBtn kind="last" disabled={page >= totalPages} onClick={() => onPageChange(totalPages)} />
        </div>
      </div>

      {/* Right — results count */}
      <div className="ml-auto flex-shrink-0">
        <span
          style={{ fontFamily: IBM, fontWeight: 400, fontSize: "14px", color: "#0e0e0e", whiteSpace: "nowrap" }}
        >
          {total === 0 ? "0 resultados" : `${startItem}-${endItem} de ${total} resultados`}
        </span>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// CLB INPUT TEXT
// ═══════════════════════════════════════════════════════════════════════════════

export interface ClbInputTextProps {
  label?: string;
  required?: boolean;
  placeholder?: string;
  value?: string;
  defaultValue?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  readOnly?: boolean;
  type?: string;
}

export function ClbInputText({
  label,
  required,
  placeholder,
  value,
  defaultValue,
  onChange,
  disabled,
  readOnly,
  type = "text",
}: ClbInputTextProps) {
  return (
    <div className="flex flex-col gap-[8px] w-full">
      {label && (
        <div className="flex gap-[4px] items-end whitespace-nowrap" style={{ lineHeight: "16px" }}>
          <span style={{ fontFamily: IBM, fontWeight: 500, fontSize: "14px", color: "#0e0e0e" }}>
            {label}
          </span>
          {required && (
            <span style={{ fontFamily: IBM, fontWeight: 400, fontSize: "12px", color: "#292929" }}>
              (obrigatório)
            </span>
          )}
        </div>
      )}
      <div
        className="relative"
        style={{
          height: "48px",
          backgroundColor: disabled ? "#f5f5f5" : "rgba(255,255,255,0.32)",
          border: "1px solid #d9d9d9",
          borderRadius: "2px",
        }}
      >
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          defaultValue={defaultValue}
          onChange={onChange}
          disabled={disabled}
          readOnly={readOnly}
          style={{
            width: "100%",
            height: "100%",
            background: "transparent",
            border: "none",
            outline: "none",
            paddingLeft: "16px",
            paddingRight: "16px",
            fontFamily: IBM,
            fontWeight: 400,
            fontSize: "16px",
            color: disabled ? "#999" : "#0e0e0e",
            cursor: disabled ? "not-allowed" : "text",
          }}
        />
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// CLB SELECT
// ═══════════════════════════════════════════════════════════════════════════════

export interface ClbSelectProps {
  label?: string;
  required?: boolean;
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  options: { value: string; label: string }[];
}

export function ClbSelect({
  label,
  required,
  placeholder,
  value,
  onChange,
  disabled,
  options,
}: ClbSelectProps) {
  return (
    <div className="flex flex-col gap-[8px] w-full">
      {label && (
        <div className="flex gap-[4px] items-end whitespace-nowrap" style={{ lineHeight: "16px" }}>
          <span style={{ fontFamily: IBM, fontWeight: 500, fontSize: "14px", color: "#0e0e0e" }}>
            {label}
          </span>
          {required && (
            <span style={{ fontFamily: IBM, fontWeight: 400, fontSize: "12px", color: "#292929" }}>
              (obrigatório)
            </span>
          )}
        </div>
      )}
      <div className="relative" style={{ height: "48px" }}>
        <select
          value={value ?? ""}
          onChange={(e) => onChange?.(e.target.value)}
          disabled={disabled}
          style={{
            appearance: "none",
            WebkitAppearance: "none",
            width: "100%",
            height: "48px",
            backgroundColor: disabled ? "#f5f5f5" : "rgba(255,255,255,0.32)",
            border: "1px solid #d9d9d9",
            borderRadius: "2px",
            paddingLeft: "16px",
            paddingRight: "44px",
            fontFamily: IBM,
            fontWeight: 400,
            fontSize: "16px",
            color: value ? "#0e0e0e" : "#666",
            cursor: disabled ? "not-allowed" : "pointer",
            outline: "none",
          }}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {/* Chevron down icon */}
        <div
          style={{
            position: "absolute",
            right: "16px",
            top: "50%",
            transform: "translateY(-50%)",
            pointerEvents: "none",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "24px",
            height: "24px",
          }}
        >
          <svg
            fill="none"
            viewBox="0 0 11.15 6.97118"
            style={{ width: "12px", height: "auto", transform: "rotate(180deg)" }}
          >
            <path d={svgSelectIcon.p2b0b3770} fill="#0E0E0E" />
          </svg>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// CLB RADIO BUTTON
// ═══════════════════════════════════════════════════════════════════════════════

export interface ClbRadioButtonProps {
  checked: boolean;
  onClick: () => void;
  label: string;
  disabled?: boolean;
}

export function ClbRadioButton({
  checked,
  onClick,
  label,
  disabled,
}: ClbRadioButtonProps) {
  return (
    <button
      onClick={disabled ? undefined : onClick}
      className="flex items-start gap-[8px]"
      style={{
        background: "none",
        border: "none",
        padding: 0,
        cursor: disabled ? "default" : "pointer",
        textAlign: "left",
        maxWidth: "400px",
      }}
    >
      {/* Radio circle */}
      <div className="flex-shrink-0" style={{ width: "16px", height: "16px", marginTop: "1px" }}>
        <svg
          viewBox="0 0 16 16"
          fill="none"
          style={{ width: "16px", height: "16px", display: "block" }}
        >
          <circle
            cx="8"
            cy="8"
            r="7.5"
            fill="rgba(255,255,255,0.32)"
            stroke={checked ? "#fd9d1e" : "#BFBFBF"}
            strokeWidth="1"
          />
          {checked && <circle cx="8" cy="8" r="4" fill="#fd9d1e" />}
        </svg>
      </div>
      {/* Label */}
      <span
        className="overflow-hidden text-ellipsis whitespace-nowrap"
        style={{
          fontFamily: IBM,
          fontWeight: 400,
          fontSize: "16px",
          lineHeight: "16px",
          color: disabled ? "#999" : "#0e0e0e",
          maxWidth: "372px",
        }}
      >
        {label}
      </span>
    </button>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// STATUS VARIANT HELPER
// ═══════════════════════════════════════════════════════════════════════════════

export function rowStatusToClbVariant(
  status: string
): ClbStatusVariant {
  switch (status) {
    case "Recolha produtiva":
      return "positive";
    case "Recolha atrasada":
      return "warning";
    case "Recolha improdutiva":
      return "negative";
    case "Recolha agendada":
      return "info";
    default:
      return "neutral";
  }
}
