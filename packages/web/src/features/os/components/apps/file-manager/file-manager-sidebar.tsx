import {
  Home,
  HardDrive,
  FolderCog,
  FolderArchive,
  Settings,
  Package,
  Server,
  Folder,
} from "lucide-react";
import { SIDEBAR_SHORTCUTS } from "../../../lib/os-constants";
import { cn } from "@/lib/utils";

const iconMap: Record<string, typeof Home> = {
  Root: HardDrive,
  Home: Home,
  tmp: FolderArchive,
  etc: FolderCog,
  var: Folder,
  opt: Package,
  usr: Settings,
  srv: Server,
};

interface FileManagerSidebarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
}

export function FileManagerSidebar({
  currentPath,
  onNavigate,
}: FileManagerSidebarProps) {
  return (
    <div className="w-44 shrink-0 border-r border-border bg-muted/30 overflow-y-auto py-2">
      {SIDEBAR_SHORTCUTS.map((item) => {
        const Icon = iconMap[item.label] ?? Folder;
        const isActive = currentPath === item.path;

        return (
          <button
            key={item.path}
            onClick={() => onNavigate(item.path)}
            className={cn(
              "flex w-full items-center gap-2 px-3 py-1.5 text-xs transition-colors",
              isActive
                ? "bg-accent text-accent-foreground font-medium"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <Icon className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">{item.label}</span>
          </button>
        );
      })}
    </div>
  );
}
