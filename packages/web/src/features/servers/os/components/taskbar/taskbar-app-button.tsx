import type { WindowState } from "../../types/window";
import { appRegistry } from "../../lib/os-constants";
import { useWindowManager } from "../../context/window-manager-context";
import { cn } from "@/lib/utils";

interface TaskbarAppButtonProps {
  window: WindowState;
  isActive: boolean;
}

export function TaskbarAppButton({ window: win, isActive }: TaskbarAppButtonProps) {
  const { dispatch } = useWindowManager();
  const app = appRegistry.get(win.appType);
  if (!app) return null;

  const handleClick = () => {
    if (win.minimized) {
      dispatch({ type: "RESTORE", id: win.id });
    } else if (isActive) {
      dispatch({ type: "MINIMIZE", id: win.id });
    } else {
      dispatch({ type: "FOCUS", id: win.id });
    }
  };

  return (
    <button
      onClick={handleClick}
      className={cn(
        "relative flex h-9 items-center gap-2 rounded-md px-3 text-xs font-medium transition-colors",
        isActive
          ? "bg-white/15 text-white"
          : "text-white/70 hover:bg-white/10 hover:text-white",
        win.minimized && "opacity-60"
      )}
    >
      <img
        src={app.iconUrl}
        alt={app.title}
        className="h-4 w-4 shrink-0"
        draggable={false}
      />
      <span className="max-w-[120px] truncate">{win.title}</span>
      {isActive && !win.minimized && (
        <div className="absolute bottom-0 left-1/2 h-0.5 w-6 -translate-x-1/2 rounded-full bg-white/80" />
      )}
    </button>
  );
}
