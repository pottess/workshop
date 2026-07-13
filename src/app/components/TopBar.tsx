import { Bell, Menu } from "lucide-react";
import imgCora from "figma:asset/ed252fcb7695058c90569a462639d4a2d13c0645.png";

export interface TopBarProps {
  onMenuToggle?: () => void;
}

export function TopBar({ onMenuToggle }: TopBarProps) {
  return (
    <header
      className="bg-white border-b border-gray-200 flex items-center px-4 sticky z-50"
      style={{ top: "30px", height: "56px" }}
    >
      {/* Circular menu toggle */}
      <button
        onClick={onMenuToggle}
        className="flex items-center justify-center flex-shrink-0 hover:bg-gray-200 transition-colors"
        style={{
          width: "36px",
          height: "36px",
          borderRadius: "50%",
          backgroundColor: "#F3F4F6",
          border: "none",
          cursor: "pointer",
          marginRight: "12px",
        }}
      >
        <Menu style={{ width: "18px", height: "18px", color: "#111827" }} />
      </button>

      {/* Cora logo */}
      <div className="flex items-center flex-shrink-0">
        <img
          src={imgCora}
          alt="Cora"
          style={{ height: "36px", width: "auto", objectFit: "contain", display: "block" }}
        />
      </div>

      <div className="flex-1" />

      {/* Right actions */}
      <div className="flex items-center gap-2">
        <button className="relative p-2 rounded-full hover:bg-gray-100 transition-colors">
          <Bell className="text-gray-500" style={{ width: "18px", height: "18px" }} />
        </button>

        <div className="flex items-center cursor-pointer ml-1">
          <div
            className="rounded-full flex items-center justify-center text-white font-semibold select-none"
            style={{
              width: "32px",
              height: "32px",
              backgroundColor: "#F97316",
              fontSize: "13px",
              fontFamily: "'IBM Plex Sans', system-ui, sans-serif",
            }}
          >
            A
          </div>
        </div>
      </div>
    </header>
  );
}
