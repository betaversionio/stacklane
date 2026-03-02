import { getFileIconUrl, getFolderIconUrl } from "@/features/servers/files/lib/file-icon";
import { Trash, DocumentDownload } from "iconsax-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { FileItem, FolderItem } from "./types";

interface ExplorerGridProps {
  files: FileItem[];
  folders: FolderItem[];
  emptyMessage?: string;
  onNavigateFolder: (key: string) => void;
  onOpen: (file: FileItem) => void;
  onDownload: (key: string) => void;
  onDelete: (key: string) => void;
}

export function ExplorerGrid({
  files,
  folders,
  emptyMessage = "This folder is empty",
  onNavigateFolder,
  onOpen,
  onDownload,
  onDelete,
}: ExplorerGridProps) {
  return (
    <div
      className="grid gap-1 p-2"
      style={{ gridTemplateColumns: "repeat(auto-fill, minmax(90px, 1fr))" }}
    >
      {folders.map((folder) => (
        <button
          key={folder.key}
          className="flex flex-col items-center gap-1 rounded-lg p-2 hover:bg-muted/60 transition-colors cursor-pointer"
          onDoubleClick={() => onNavigateFolder(folder.key)}
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
      ))}

      {files.map((file) => (
        <DropdownMenu key={file.key}>
          <DropdownMenuTrigger asChild>
            <button
              className="flex flex-col items-center gap-1 rounded-lg p-2 hover:bg-muted/60 transition-colors cursor-pointer"
              onDoubleClick={() => onOpen(file)}
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
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => onOpen(file)}>
              Preview
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onDownload(file.key)}>
              <DocumentDownload
                size={14}
                color="currentColor"
                className="mr-2"
              />
              Download
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-destructive focus:text-destructive"
              onClick={() => onDelete(file.key)}
            >
              <Trash size={14} color="currentColor" className="mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ))}

      {folders.length === 0 && files.length === 0 && (
        <div className="col-span-full flex flex-col items-center justify-center py-16 text-muted-foreground">
          <p className="text-sm">{emptyMessage}</p>
        </div>
      )}
    </div>
  );
}
