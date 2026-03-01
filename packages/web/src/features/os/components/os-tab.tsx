import { WindowManagerProvider } from "../context/window-manager-context";
import { DesktopSettingsProvider } from "../context/desktop-settings-context";
import { Desktop } from "./desktop/desktop";
import { Taskbar } from "./taskbar/taskbar";

interface OsTabProps {
  connectionId: string;
}

export function OsTab({ connectionId }: OsTabProps) {
  return (
    <DesktopSettingsProvider>
      <WindowManagerProvider>
        <div className="fixed inset-0 z-50 flex flex-col">
          <Desktop connectionId={connectionId} />
          <Taskbar />
        </div>
      </WindowManagerProvider>
    </DesktopSettingsProvider>
  );
}
