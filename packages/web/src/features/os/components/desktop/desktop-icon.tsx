import type { AppType } from "../../types/window";
import { APP_REGISTRY } from "../../lib/os-constants";
import { useWindowManager } from "../../context/window-manager-context";

interface DesktopIconProps {
  appType: AppType;
}

export function DesktopIcon({ appType }: DesktopIconProps) {
  const { dispatch } = useWindowManager();
  const app = APP_REGISTRY[appType];

  return (
    <button
      className="flex flex-col items-center justify-start w-[76px] py-1.5 px-1 rounded-[3px] border border-transparent hover:bg-white/10 hover:border-white/20 active:bg-white/20 focus-visible:bg-white/10 focus-visible:border-white/25 transition-colors cursor-default select-none outline-none"
      onDoubleClick={() => dispatch({ type: "OPEN", appType })}
    >
      <img
        src={app.iconUrl}
        alt={app.title}
        className="h-10 w-10 shrink-0 pointer-events-none"
        draggable={false}
      />
      <span
        className="mt-1 text-[11px] leading-[14px] text-white text-center break-words max-w-full px-0.5"
        style={{
          textShadow:
            "1px 1px 2px rgba(0,0,0,0.8), -1px -1px 2px rgba(0,0,0,0.4)",
        }}
      >
        {app.title}
      </span>
    </button>
  );
}
