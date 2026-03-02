import { useState, useRef } from "react";
import { DocumentUpload } from "iconsax-react";
import { Button } from "@/components/ui/button";
import { CustomDialog } from "@/components/ui/custom-dialog";
import { formatBytes } from "@/lib/utils";
import { useUploadObject } from "../hooks/use-storage-explorer";

interface StorageUploadDialogProps {
  open: boolean;
  onClose: () => void;
  credentialId: string;
  bucket: string;
  prefix: string;
}

export function StorageUploadDialog({
  open,
  onClose,
  credentialId,
  bucket,
  prefix,
}: StorageUploadDialogProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadMutation = useUploadObject(credentialId, bucket, prefix);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setSelectedFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) setSelectedFile(file);
  };

  const handleUpload = () => {
    if (!selectedFile) return;
    uploadMutation.mutate(selectedFile, {
      onSuccess: () => {
        setSelectedFile(null);
        onClose();
      },
    });
  };

  const handleClose = () => {
    setSelectedFile(null);
    onClose();
  };

  return (
    <CustomDialog
      open={open}
      onOpenChange={(v) => !v && handleClose()}
      title="Upload File"
      footer={
        <div className="flex gap-2 justify-end">
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            onClick={handleUpload}
            disabled={!selectedFile || uploadMutation.isPending}
          >
            {uploadMutation.isPending ? "Uploading..." : "Upload"}
          </Button>
        </div>
      }
    >
      <div
        className={`flex flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed p-8 transition-colors ${
          dragOver
            ? "border-primary bg-primary/5"
            : "border-border hover:border-muted-foreground/50"
        }`}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <DocumentUpload
          size={32}
          color="currentColor"
          className="text-muted-foreground"
        />
        <div className="text-center">
          <p className="text-sm font-medium">
            Drop a file here or click to browse
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Uploads to: {prefix || "/"}
          </p>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          onChange={handleFileSelect}
        />
      </div>

      {selectedFile && (
        <div className="flex items-center justify-between rounded-lg border bg-muted/50 px-4 py-3">
          <div className="min-w-0">
            <p className="text-sm font-medium truncate">{selectedFile.name}</p>
            <p className="text-xs text-muted-foreground">
              {formatBytes(selectedFile.size)}
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedFile(null);
            }}
          >
            Remove
          </Button>
        </div>
      )}
    </CustomDialog>
  );
}
