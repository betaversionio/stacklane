import { useRef } from "react";
import {
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  List,
  FolderPlus,
  Upload,
  RefreshCw,
} from "lucide-react";

interface FileManagerToolbarProps {
  currentPath: string;
  canGoBack: boolean;
  canGoForward: boolean;
  viewMode: "grid" | "list";
  onBack: () => void;
  onForward: () => void;
  onNavigate: (path: string) => void;
  onViewModeChange: (mode: "grid" | "list") => void;
  onNewFolder: () => void;
  onUpload: (file: File) => void;
  onRefresh: () => void;
}

export function FileManagerToolbar({
  currentPath,
  canGoBack,
  canGoForward,
  viewMode,
  onBack,
  onForward,
  onNavigate,
  onViewModeChange,
  onNewFolder,
  onUpload,
  onRefresh,
}: FileManagerToolbarProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const pathParts = currentPath.split("/").filter(Boolean);

  return (
    <div className="flex items-center gap-1.5 px-2 py-1.5 border-b border-border bg-card shrink-0">
      {/* Navigation */}
      <button
        onClick={onBack}
        disabled={!canGoBack}
        className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-muted disabled:opacity-30 disabled:pointer-events-none"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>
      <button
        onClick={onForward}
        disabled={!canGoForward}
        className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-muted disabled:opacity-30 disabled:pointer-events-none"
      >
        <ChevronRight className="h-4 w-4" />
      </button>

      {/* Breadcrumbs */}
      <div className="flex flex-1 items-center gap-0.5 text-xs min-w-0 overflow-hidden mx-1">
        <button
          onClick={() => onNavigate("/")}
          className="shrink-0 text-muted-foreground hover:text-foreground px-1 py-0.5 rounded hover:bg-muted"
        >
          /
        </button>
        {pathParts.map((part, i) => (
          <span key={i} className="flex items-center gap-0.5 min-w-0">
            <span className="text-muted-foreground/50 shrink-0">/</span>
            <button
              onClick={() =>
                onNavigate("/" + pathParts.slice(0, i + 1).join("/"))
              }
              className="truncate text-muted-foreground hover:text-foreground px-1 py-0.5 rounded hover:bg-muted"
            >
              {part}
            </button>
          </span>
        ))}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-0.5 shrink-0">
        <button
          onClick={() => onViewModeChange(viewMode === "grid" ? "list" : "grid")}
          className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-muted"
          title={viewMode === "grid" ? "List view" : "Grid view"}
        >
          {viewMode === "grid" ? (
            <List className="h-4 w-4" />
          ) : (
            <LayoutGrid className="h-4 w-4" />
          )}
        </button>
        <button
          onClick={onNewFolder}
          className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-muted"
          title="New Folder"
        >
          <FolderPlus className="h-4 w-4" />
        </button>
        <button
          onClick={() => fileInputRef.current?.click()}
          className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-muted"
          title="Upload"
        >
          <Upload className="h-4 w-4" />
        </button>
        <button
          onClick={onRefresh}
          className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-muted"
          title="Refresh"
        >
          <RefreshCw className="h-4 w-4" />
        </button>
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) onUpload(file);
            e.target.value = "";
          }}
        />
      </div>
    </div>
  );
}
