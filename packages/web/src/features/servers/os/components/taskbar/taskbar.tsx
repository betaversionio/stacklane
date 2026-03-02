import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useWindowManager } from "../../context/window-manager-context";
import { useMarketplace } from "@/features/servers/marketplace/components/marketplace-context";
import { TASKBAR_HEIGHT } from "../../lib/os-constants";
import type { AppType } from "../../types/window";
import { DockIcon } from "./dock-icon";
import { TaskbarClock } from "./taskbar-clock";

export function Taskbar() {
  const navigate = useNavigate();
  const { state, dispatch } = useWindowManager();
  const { dockApps } = useMarketplace();

  const activeAppType = state.windows
    .filter((w) => !w.minimized)
    .sort((a, b) => b.zIndex - a.zIndex)[0]?.appType;

  const handleAppClick = (appType: AppType) => {
    const wins = state.windows.filter((w) => w.appType === appType);

    if (wins.length === 0) {
      dispatch({ type: "OPEN", appType });
      return;
    }

    const visible = wins.filter((w) => !w.minimized);
    if (visible.length === 0) {
      const latest = wins.sort((a, b) => b.zIndex - a.zIndex)[0];
      dispatch({ type: "RESTORE", id: latest.id });
      return;
    }

    const topWin = state.windows
      .filter((w) => !w.minimized)
      .sort((a, b) => b.zIndex - a.zIndex)[0];

    if (topWin && topWin.appType === appType) {
      dispatch({ type: "MINIMIZE", id: topWin.id });
    } else {
      const latest = visible.sort((a, b) => b.zIndex - a.zIndex)[0];
      dispatch({ type: "FOCUS", id: latest.id });
    }
  };

  return (
    <div
      className="fixed bottom-0 left-0 right-0 flex items-center border-t border-white/[0.08]"
      style={{
        height: TASKBAR_HEIGHT,
        zIndex: 9999,
        backgroundColor: "rgba(20, 20, 20, 0.65)",
        backdropFilter: "blur(50px) saturate(1.7)",
        WebkitBackdropFilter: "blur(50px) saturate(1.7)",
      }}
    >
      {/* Left — back button */}
      <div className="flex items-center px-3 shrink-0">
        <button
          onClick={() => navigate(-1)}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-white/50 hover:text-white hover:bg-white/[0.08] transition-colors duration-150"
          title="Exit OS view"
        >
          <ArrowLeft className="h-[18px] w-[18px]" />
        </button>
      </div>

      {/* Center — only open app icons */}
      <div className="flex-1 flex items-center justify-center gap-[6px]">
        {[...new Set(state.windows.map((w) => w.appType))].map((appType) => (
          <DockIcon
            key={appType}
            appType={appType}
            isRunning={true}
            isActive={appType === activeAppType}
            onClick={() => handleAppClick(appType)}
          />
        ))}
      </div>

      {/* Right — clock */}
      <div className="flex items-center px-4 shrink-0">
        <TaskbarClock />
      </div>
    </div>
  );
}
