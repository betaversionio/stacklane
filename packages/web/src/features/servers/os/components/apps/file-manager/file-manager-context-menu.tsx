import { useEffect, useRef } from "react";
import {
  FolderPlus,
  Upload,
  Pencil,
  Trash2,
  Download,
} from "lucide-react";
import { sftpApi } from "@/features/servers/files/api";

interface ContextMenuAction {
  label: string;
  icon: typeof FolderPlus;
  onClick: () => void;
  destructive?: boolean;
}

interface FileManagerContextMenuProps {
  x: number;
  y: number;
  actions: ContextMenuAction[];
  onClose: () => void;
}

export function FileManagerContextMenu({
  x,
  y,
  actions,
  onClose,
}: FileManagerContextMenuProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);

  // Adjust position if menu would go off screen
  const adjustedX = Math.min(x, globalThis.innerWidth - 200);
  const adjustedY = Math.min(y, globalThis.innerHeight - actions.length * 36 - 16);

  return (
    <div
      ref={ref}
      className="fixed z-[10000] min-w-[180px] rounded-lg border border-border bg-card py-1 shadow-xl"
      style={{ left: adjustedX, top: adjustedY }}
    >
      {actions.map((action) => (
        <button
          key={action.label}
          onClick={() => {
            action.onClick();
            onClose();
          }}
          className={`flex w-full items-center gap-2 px-3 py-1.5 text-xs transition-colors ${
            action.destructive
              ? "text-destructive hover:bg-destructive/10"
              : "text-foreground hover:bg-accent"
          }`}
        >
          <action.icon className="h-3.5 w-3.5" />
          {action.label}
        </button>
      ))}
    </div>
  );
}

export function getFileContextActions({
  file,
  connectionId,
  onRename,
  onDelete,
}: {
  file: { path: string; name: string; type: string };
  connectionId: string;
  onRename: () => void;
  onDelete: () => void;
}): ContextMenuAction[] {
  const isDir = file.type === "directory";
  const actions: ContextMenuAction[] = [];

  if (!isDir) {
    actions.push({
      label: "Download",
      icon: Download,
      onClick: () => {
        globalThis.open(sftpApi.download(connectionId, file.path));
      },
    });
  }

  actions.push({
    label: "Rename",
    icon: Pencil,
    onClick: onRename,
  });

  actions.push({
    label: "Delete",
    icon: Trash2,
    onClick: onDelete,
    destructive: true,
  });

  return actions;
}

export function getBackgroundContextActions({
  onNewFolder,
  onUpload,
}: {
  onNewFolder: () => void;
  onUpload: () => void;
}): ContextMenuAction[] {
  return [
    { label: "New Folder", icon: FolderPlus, onClick: onNewFolder },
    { label: "Upload File", icon: Upload, onClick: onUpload },
  ];
}
