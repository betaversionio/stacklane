import { useState } from "react";
import { APP_REGISTRY } from "../../lib/os-constants";
import type { AppType } from "../../types/window";

interface DockIconProps {
  appType: AppType;
  isRunning: boolean;
  isActive: boolean;
  onClick: () => void;
}

export function DockIcon({ appType, isRunning, isActive, onClick }: DockIconProps) {
  const app = APP_REGISTRY[appType];
  const [hovered, setHovered] = useState(false);

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative flex flex-col items-center justify-center outline-none"
      style={{ width: 40, height: 48 }}
    >
      {/* Tooltip */}
      <div
        className="absolute -top-[34px] px-[10px] py-[4px] rounded-[6px] text-[12px] font-medium text-white whitespace-nowrap pointer-events-none transition-opacity duration-100"
        style={{
          opacity: hovered ? 1 : 0,
          backgroundColor: "rgba(30, 30, 30, 0.82)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          border: "0.5px solid rgba(255,255,255,0.15)",
          boxShadow: "0 4px 16px rgba(0,0,0,0.3)",
        }}
      >
        {app.title}
      </div>

      {/* Icon with hover scale */}
      <img
        src={app.iconUrl}
        alt={app.title}
        className="rounded-[11px] transition-transform duration-200 ease-out"
        style={{
          width: 32,
          height: 32,
          transform: hovered ? "scale(1.25) translateY(-4px)" : "scale(1.15)",
        }}
        draggable={false}
      />

      {/* Running dot */}
      {isRunning && (
        <div
          className="absolute -bottom-[1px] rounded-full"
          style={{
            width: 4,
            height: 4,
            backgroundColor: isActive
              ? "rgba(255, 255, 255, 0.95)"
              : "rgba(255, 255, 255, 0.5)",
          }}
        />
      )}
    </button>
  );
}
