import { getFileIconUrl, getFolderIconUrl } from "@/features/servers/files/lib/file-icon";
import { formatBytes } from "@/lib/utils";
import { Trash, DocumentDownload } from "iconsax-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import type { FileItem, FolderItem } from "./types";

dayjs.extend(relativeTime);

interface ExplorerListColumn {
  label: string;
  className?: string;
}

interface ExplorerListProps {
  files: FileItem[];
  folders: FolderItem[];
  emptyMessage?: string;
  extraColumn?: ExplorerListColumn;
  onNavigateFolder: (key: string) => void;
  onOpen: (file: FileItem) => void;
  onDownload: (key: string) => void;
  onDelete: (key: string) => void;
  onDeleteFolder?: (key: string) => void;
  onDownloadFolder?: (key: string) => void;
}

export function ExplorerList({
  files,
  folders,
  emptyMessage = "This folder is empty",
  extraColumn,
  onNavigateFolder,
  onOpen,
  onDownload,
  onDelete,
  onDeleteFolder,
  onDownloadFolder,
}: ExplorerListProps) {
  if (folders.length === 0 && files.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
        <p className="text-sm">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[40%]">Name</TableHead>
          <TableHead>Size</TableHead>
          <TableHead>Modified</TableHead>
          {extraColumn && (
            <TableHead className={extraColumn.className}>
              {extraColumn.label}
            </TableHead>
          )}
          <TableHead className="w-20">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {folders.map((folder) => (
          <TableRow
            key={folder.key}
            className="cursor-pointer"
            onDoubleClick={() => onNavigateFolder(folder.key)}
          >
            <TableCell>
              <div className="flex items-center gap-2">
                <img
                  src={getFolderIconUrl(folder.name)}
                  alt=""
                  className="h-5 w-5"
                />
                <span className="truncate">{folder.name}</span>
              </div>
            </TableCell>
            <TableCell className="text-muted-foreground">--</TableCell>
            <TableCell className="text-muted-foreground">--</TableCell>
            {extraColumn && (
              <TableCell className="text-muted-foreground">--</TableCell>
            )}
            <TableCell>
              <div className="flex items-center gap-0.5">
                {onDownloadFolder && (
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDownloadFolder(folder.key);
                    }}
                  >
                    <DocumentDownload size={14} color="currentColor" />
                  </Button>
                )}
                {onDeleteFolder && (
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    className="text-destructive hover:text-destructive"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteFolder(folder.key);
                    }}
                  >
                    <Trash size={14} color="currentColor" />
                  </Button>
                )}
              </div>
            </TableCell>
          </TableRow>
        ))}

        {files.map((file) => (
          <TableRow
            key={file.key}
            className="cursor-pointer"
            onDoubleClick={() => onOpen(file)}
          >
            <TableCell>
              <div className="flex items-center gap-2">
                <img
                  src={getFileIconUrl(file.name)}
                  alt=""
                  className="h-5 w-5"
                />
                <span className="truncate">{file.name}</span>
              </div>
            </TableCell>
            <TableCell className="text-muted-foreground">
              {formatBytes(file.size)}
            </TableCell>
            <TableCell
              className="text-muted-foreground"
              title={dayjs(file.lastModified).format("MMM D, YYYY h:mm A")}
            >
              {dayjs(file.lastModified).fromNow()}
            </TableCell>
            {extraColumn && (
              <TableCell className="text-muted-foreground">
                {file.extra ?? "--"}
              </TableCell>
            )}
            <TableCell>
              <div className="flex items-center gap-0.5">
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDownload(file.key);
                  }}
                >
                  <DocumentDownload size={14} color="currentColor" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className="text-destructive hover:text-destructive"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(file.key);
                  }}
                >
                  <Trash size={14} color="currentColor" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
