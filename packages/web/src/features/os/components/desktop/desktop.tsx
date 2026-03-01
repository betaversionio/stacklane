import { useCallback, useMemo, useState } from "react";
import { useWindowManager } from "../../context/window-manager-context";
import { useDesktopSettings } from "../../context/desktop-settings-context";
import { DESKTOP_APPS, TASKBAR_HEIGHT } from "../../lib/os-constants";
import { WALLPAPERS } from "../../lib/wallpapers";
import { DesktopIcon } from "./desktop-icon";
import { DesktopContextMenu } from "./desktop-context-menu";
import { WindowFrame } from "../window/window-frame";
import { FileManagerApp } from "../apps/file-manager/file-manager-app";
import { TerminalApp } from "../apps/terminal-app";
import { MonitorApp } from "../apps/monitor-app";
import { NotepadApp } from "../apps/notepad-app";
import { SettingsApp } from "../apps/settings-app";
import { BrowserApp } from "../apps/browser-app";
import { cn } from "@/lib/utils";
import type { AppType } from "../../types/window";

interface DesktopProps {
  connectionId: string;
}

export function Desktop({ connectionId }: DesktopProps) {
  const { state, dispatch } = useWindowManager();
  const { wallpaper, setWallpaper } = useDesktopSettings();
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);

  const wp = useMemo(
    () => WALLPAPERS.find((w) => w.id === wallpaper),
    [wallpaper]
  );

  const isImage = wp?.type === "image";

  const handleContextMenu = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      setContextMenu({ x: e.clientX, y: e.clientY });
    },
    []
  );

  const handleOpenApp = useCallback(
    (appType: AppType) => {
      dispatch({ type: "OPEN", appType });
    },
    [dispatch]
  );

  return (
    <div
      className={cn(
        "relative flex-1 overflow-hidden",
        !isImage && wp?.value
      )}
      style={
        isImage
          ? {
              backgroundImage: `url(${wp.value})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }
          : undefined
      }
      onContextMenu={handleContextMenu}
    >
      {/* Desktop icons — grid flows top→bottom, left→right like macOS */}
      <div className="absolute inset-0 p-2 flex flex-col flex-wrap content-start gap-0.5" style={{ paddingBottom: TASKBAR_HEIGHT + 8 }}>
        {DESKTOP_APPS.map((appType) => (
          <DesktopIcon key={appType} appType={appType} />
        ))}
      </div>

      {/* Windows */}
      {state.windows.map((win) => (
        <WindowFrame key={win.id} window={win}>
          {win.appType === "file-manager" && (
            <FileManagerApp connectionId={connectionId} />
          )}
          {win.appType === "terminal" && (
            <TerminalApp connectionId={connectionId} />
          )}
          {win.appType === "monitor" && (
            <MonitorApp connectionId={connectionId} />
          )}
          {win.appType === "notepad" && (
            <NotepadApp connectionId={connectionId} payload={win.payload} />
          )}
          {win.appType === "settings" && <SettingsApp />}
          {win.appType === "browser" && (
            <BrowserApp connectionId={connectionId} />
          )}
        </WindowFrame>
      ))}

      {/* Desktop right-click context menu */}
      {contextMenu && (
        <DesktopContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          onClose={() => setContextMenu(null)}
          onOpenApp={handleOpenApp}
          onChangeWallpaper={setWallpaper}
          currentWallpaper={wallpaper}
        />
      )}
    </div>
  );
}
