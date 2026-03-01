import { useState, useRef } from "react";
import {
  ArrowUp2,
  DocumentUpload,
  FolderAdd,
  RefreshCircle,
} from "iconsax-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { RemoteFile } from "@stacklane/shared";
import { useFileList, useDeleteFile, useMkdir, useUploadFile } from "../hooks/use-files";
import { FileRow } from "./file-row";

interface FilesTabProps {
  connectionId: string;
}

export function FilesTab({ connectionId }: FilesTabProps) {
  const [currentPath, setCurrentPath] = useState("/");
  const [showMkdir, setShowMkdir] = useState(false);
  const [newDirName, setNewDirName] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data, isLoading, refetch } = useFileList(connectionId, currentPath);
  const deleteMutation = useDeleteFile(connectionId, currentPath);
  const mkdirMutation = useMkdir(connectionId, currentPath, () => {
    setShowMkdir(false);
    setNewDirName("");
  });
  const uploadMutation = useUploadFile(connectionId, currentPath);

  const files = (data?.data as RemoteFile[] | undefined) ?? [];

  const navigateTo = (path: string) => setCurrentPath(path);
  const navigateUp = () => {
    const parts = currentPath.split("/").filter(Boolean);
    parts.pop();
    setCurrentPath("/" + parts.join("/"));
  };

  const pathParts = currentPath.split("/").filter(Boolean);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) uploadMutation.mutate(file);
    e.target.value = "";
  };

  return (
    <div className="rounded-lg border border-border bg-card">
      {/* Toolbar */}
      <div className="flex items-center gap-2 p-3 border-b border-border">
        <Button
          variant="ghost"
          size="icon"
          onClick={navigateUp}
          disabled={currentPath === "/"}
        >
          <ArrowUp2 size={18} color="currentColor" />
        </Button>

        <div className="flex items-center gap-1 text-sm flex-1 min-w-0">
          <button
            onClick={() => navigateTo("/")}
            className="text-muted-foreground hover:text-foreground cursor-pointer"
          >
            /
          </button>
          {pathParts.map((part, i) => (
            <span key={i} className="flex items-center gap-1">
              <span className="text-muted-foreground">/</span>
              <button
                onClick={() =>
                  navigateTo("/" + pathParts.slice(0, i + 1).join("/"))
                }
                className="text-muted-foreground hover:text-foreground truncate cursor-pointer"
              >
                {part}
              </button>
            </span>
          ))}
        </div>

        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" onClick={() => refetch()}>
            <RefreshCircle size={18} color="currentColor" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowMkdir(!showMkdir)}
          >
            <FolderAdd size={18} color="currentColor" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => fileInputRef.current?.click()}
          >
            <DocumentUpload size={18} color="currentColor" />
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            onChange={handleUpload}
          />
        </div>
      </div>

      {/* New folder input */}
      {showMkdir && (
        <div className="flex items-center gap-2 p-3 border-b border-border bg-muted/50">
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

      {/* File list */}
      <div className="divide-y divide-border">
        {isLoading ? (
          <div className="p-8 text-center text-muted-foreground">
            Loading...
          </div>
        ) : files.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            Empty directory
          </div>
        ) : (
          files.map((file) => (
            <FileRow
              key={file.path}
              file={file}
              connectionId={connectionId}
              onNavigate={navigateTo}
              onDelete={(path, isDir) =>
                deleteMutation.mutate({ path, isDir })
              }
            />
          ))
        )}
      </div>
    </div>
  );
}
