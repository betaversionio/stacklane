import { useState, useRef, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ExplorerToolbar,
  ExplorerGrid,
  ExplorerList,
} from "@/components/shared/file-explorer";
import type { FileItem, FolderItem } from "@/components/shared/file-explorer";
import type { RemoteFile } from "@stacklane/shared";
import {
  useFileList,
  useDeleteFile,
  useMkdir,
  useUploadFile,
} from "../hooks/use-files";
import { sftpApi } from "../api";

interface FilesPageProps {
  connectionId: string;
}

export function FilesPage({ connectionId }: FilesPageProps) {
  const [currentPath, setCurrentPath] = useState("/");
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [showMkdir, setShowMkdir] = useState(false);
  const [newDirName, setNewDirName] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Navigation history
  const historyRef = useRef<string[]>([""]);
  const historyIndexRef = useRef(0);

  const { data, isLoading, refetch } = useFileList(connectionId, currentPath);
  const deleteMutation = useDeleteFile(connectionId, currentPath);
  const mkdirMutation = useMkdir(connectionId, currentPath, () => {
    setShowMkdir(false);
    setNewDirName("");
  });
  const uploadMutation = useUploadFile(connectionId, currentPath);

  const files = (data?.data as RemoteFile[] | undefined) ?? [];

  const navigateTo = useCallback((path: string) => {
    // Normalize: empty string means root "/"
    const target = path || "/";
    const idx = historyIndexRef.current;
    historyRef.current = historyRef.current.slice(0, idx + 1);
    historyRef.current.push(target);
    historyIndexRef.current = historyRef.current.length - 1;
    setCurrentPath(target);
  }, []);

  const canGoBack = historyIndexRef.current > 0;
  const canGoForward =
    historyIndexRef.current < historyRef.current.length - 1;

  const goBack = useCallback(() => {
    if (historyIndexRef.current > 0) {
      historyIndexRef.current--;
      setCurrentPath(historyRef.current[historyIndexRef.current] || "/");
    }
  }, []);

  const goForward = useCallback(() => {
    if (historyIndexRef.current < historyRef.current.length - 1) {
      historyIndexRef.current++;
      setCurrentPath(historyRef.current[historyIndexRef.current] || "/");
    }
  }, []);

  const pathSegments = currentPath.split("/").filter(Boolean);

  // Convert RemoteFile[] to shared FileItem[] and FolderItem[]
  const folders: FolderItem[] = files
    .filter((f) => f.type === "directory")
    .map((f) => ({ key: f.path, name: f.name }));

  const fileItems: FileItem[] = files
    .filter((f) => f.type !== "directory")
    .map((f) => ({
      key: f.path,
      name: f.name,
      isFolder: false,
      size: f.size,
      lastModified: f.modifiedAt,
      extra: f.permissions,
    }));

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) uploadMutation.mutate(file);
    e.target.value = "";
  };

  const handleDownload = (path: string) => {
    window.open(sftpApi.download(connectionId, path), "_blank");
  };

  const handleDelete = (path: string) => {
    const file = files.find((f) => f.path === path);
    if (file) {
      deleteMutation.mutate({ path, isDir: file.type === "directory" });
    }
  };

  const handleOpen = (file: FileItem) => {
    // For server files, download on double-click
    handleDownload(file.key);
  };

  return (
    <div className="space-y-4">
      <ExplorerToolbar
        root="/"
        path={currentPath}
        segments={pathSegments}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onNavigate={(p) => navigateTo(p || "/")}
        onBack={goBack}
        onForward={goForward}
        canGoBack={canGoBack}
        canGoForward={canGoForward}
        onUpload={() => fileInputRef.current?.click()}
        onRefresh={() => refetch()}
        onNewFolder={() => setShowMkdir(!showMkdir)}
        buildSegmentPath={(segs, i) => "/" + segs.slice(0, i + 1).join("/")}
      />

      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        onChange={handleUpload}
      />

      {/* New folder input */}
      {showMkdir && (
        <div className="flex items-center gap-2 rounded-lg border border-border bg-card p-3">
          <Input
            placeholder="New folder name"
            value={newDirName}
            onChange={(e) => setNewDirName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && newDirName) {
                const path =
                  currentPath === "/"
                    ? `/${newDirName}`
                    : `${currentPath}/${newDirName}`;
                mkdirMutation.mutate(path);
              }
            }}
            autoFocus
            className="max-w-xs"
          />
          <Button
            size="sm"
            onClick={() => {
              if (newDirName) {
                const path =
                  currentPath === "/"
                    ? `/${newDirName}`
                    : `${currentPath}/${newDirName}`;
                mkdirMutation.mutate(path);
              }
            }}
          >
            Create
          </Button>
        </div>
      )}

      {/* Content */}
      {isLoading ? (
        <div className="space-y-2 p-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-full" />
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-border bg-card overflow-hidden">
          {viewMode === "grid" ? (
            <ExplorerGrid
              files={fileItems}
              folders={folders}
              emptyMessage="Empty directory"
              onNavigateFolder={navigateTo}
              onOpen={handleOpen}
              onDownload={handleDownload}
              onDelete={handleDelete}
            />
          ) : (
            <ExplorerList
              files={fileItems}
              folders={folders}
              emptyMessage="Empty directory"
              extraColumn={{ label: "Permissions" }}
              onNavigateFolder={navigateTo}
              onOpen={handleOpen}
              onDownload={handleDownload}
              onDelete={handleDelete}
            />
          )}
        </div>
      )}
    </div>
  );
}
