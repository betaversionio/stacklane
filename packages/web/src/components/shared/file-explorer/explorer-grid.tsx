import { getFileIconUrl, getFolderIconUrl } from "@/features/servers/files/lib/file-icon";
import { Trash, DocumentDownload, FolderOpen, Eye } from "iconsax-react";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
  ContextMenuSeparator,
} from "@/components/ui/context-menu";
import type { FileItem, FolderItem } from "./types";

interface ExplorerGridProps {
  files: FileItem[];
  folders: FolderItem[];
  emptyMessage?: string;
  onNavigateFolder: (key: string) => void;
  onOpen: (file: FileItem) => void;
  onDownload: (key: string) => void;
  onDelete: (key: string) => void;
  onDeleteFolder?: (key: string) => void;
  onDownloadFolder?: (key: string) => void;
}

export function ExplorerGrid({
  files,
  folders,
  emptyMessage = "This folder is empty",
  onNavigateFolder,
  onOpen,
  onDownload,
  onDelete,
  onDeleteFolder,
  onDownloadFolder,
}: ExplorerGridProps) {
  return (
    <div
      className="grid gap-1 p-2"
      style={{ gridTemplateColumns: "repeat(auto-fill, minmax(90px, 1fr))" }}
    >
      {folders.map((folder) => (
        <ContextMenu key={folder.key}>
          <ContextMenuTrigger asChild>
            <button
              className="flex flex-col items-center gap-1 rounded-lg p-2 hover:bg-muted/60 transition-colors cursor-pointer"
              onClick={() => onNavigateFolder(folder.key)}
            >
              <img
                src={getFolderIconUrl(folder.name)}
                alt=""
                className="h-10 w-10"
                draggable={false}
              />
              <span className="text-xs text-center leading-tight line-clamp-2 w-full break-all">
                {folder.name}
              </span>
            </button>
          </ContextMenuTrigger>
          <ContextMenuContent>
            <ContextMenuItem onClick={() => onNavigateFolder(folder.key)}>
              <FolderOpen size={14} color="currentColor" className="mr-2" />
              Open
            </ContextMenuItem>
            {onDownloadFolder && (
              <ContextMenuItem onClick={() => onDownloadFolder(folder.key)}>
                <DocumentDownload size={14} color="currentColor" className="mr-2" />
                Download as ZIP
              </ContextMenuItem>
            )}
            {onDeleteFolder && (
              <>
                <ContextMenuSeparator />
                <ContextMenuItem
                  className="text-destructive focus:text-destructive"
                  onClick={() => onDeleteFolder(folder.key)}
                >
                  <Trash size={14} color="currentColor" className="mr-2" />
                  Delete
                </ContextMenuItem>
              </>
            )}
          </ContextMenuContent>
        </ContextMenu>
      ))}

      {files.map((file) => (
        <ContextMenu key={file.key}>
          <ContextMenuTrigger asChild>
            <button
              className="flex flex-col items-center gap-1 rounded-lg p-2 hover:bg-muted/60 transition-colors cursor-pointer"
              onClick={() => onOpen(file)}
            >
              <img
                src={getFileIconUrl(file.name)}
                alt=""
                className="h-10 w-10"
                draggable={false}
              />
              <span className="text-xs text-center leading-tight line-clamp-2 w-full break-all">
                {file.name}
              </span>
            </button>
          </ContextMenuTrigger>
          <ContextMenuContent>
            <ContextMenuItem onClick={() => onOpen(file)}>
              <Eye size={14} color="currentColor" className="mr-2" />
              Preview
            </ContextMenuItem>
            <ContextMenuItem onClick={() => onDownload(file.key)}>
              <DocumentDownload
                size={14}
                color="currentColor"
                className="mr-2"
              />
              Download
            </ContextMenuItem>
            <ContextMenuSeparator />
            <ContextMenuItem
              className="text-destructive focus:text-destructive"
              onClick={() => onDelete(file.key)}
            >
              <Trash size={14} color="currentColor" className="mr-2" />
              Delete
            </ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>
      ))}

      {folders.length === 0 && files.length === 0 && (
        <div className="col-span-full flex flex-col items-center justify-center py-16 text-muted-foreground">
          <p className="text-sm">{emptyMessage}</p>
        </div>
      )}
    </div>
  );
}
