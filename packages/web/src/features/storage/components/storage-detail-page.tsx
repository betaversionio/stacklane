import { useState, useCallback, useRef } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import type { BucketObject, StorageCredential } from "@stacklane/shared";
import {
  useStorageBucketObjects,
  useDeleteObject,
} from "../hooks/use-storage-explorer";
import { storageApi } from "../api";
import { BucketSelector } from "./bucket-selector";
import { StorageStatsBar } from "./storage-stats-bar";
import { StorageExplorerToolbar } from "./storage-explorer-toolbar";
import { StorageObjectGrid } from "./storage-object-grid";
import { StorageObjectList } from "./storage-object-list";
import { StorageFilePreview } from "./storage-file-preview";
import { StorageUploadDialog } from "./storage-upload-dialog";

interface StorageExplorerPageProps {
  credentialId: string;
  credential: StorageCredential;
  initialBucket?: string;
}

export function StorageExplorerPage({
  credentialId,
  credential,
  initialBucket,
}: StorageExplorerPageProps) {
  const [selectedBucket, setSelectedBucket] = useState(
    initialBucket ?? credential.defaultBucket ?? "",
  );
  const [currentPrefix, setCurrentPrefix] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [previewFile, setPreviewFile] = useState<BucketObject | null>(null);
  const [uploadOpen, setUploadOpen] = useState(false);

  // Navigation history
  const historyRef = useRef<string[]>([""]);
  const historyIndexRef = useRef(0);

  const {
    data: objectsData,
    isLoading: objectsLoading,
    refetch,
  } = useStorageBucketObjects(credentialId, selectedBucket, currentPrefix);
  const deleteMutation = useDeleteObject(
    credentialId,
    selectedBucket,
    currentPrefix,
  );

  const listing = objectsData?.data;

  const navigateToPrefix = useCallback((prefix: string) => {
    const idx = historyIndexRef.current;
    historyRef.current = historyRef.current.slice(0, idx + 1);
    historyRef.current.push(prefix);
    historyIndexRef.current = historyRef.current.length - 1;
    setCurrentPrefix(prefix);
  }, []);

  const canGoBack = historyIndexRef.current > 0;
  const canGoForward = historyIndexRef.current < historyRef.current.length - 1;

  const goBack = useCallback(() => {
    if (historyIndexRef.current > 0) {
      historyIndexRef.current--;
      setCurrentPrefix(historyRef.current[historyIndexRef.current]);
    }
  }, []);

  const goForward = useCallback(() => {
    if (historyIndexRef.current < historyRef.current.length - 1) {
      historyIndexRef.current++;
      setCurrentPrefix(historyRef.current[historyIndexRef.current]);
    }
  }, []);

  const handleBucketChange = (bucket: string) => {
    setSelectedBucket(bucket);
    setCurrentPrefix("");
    historyRef.current = [""];
    historyIndexRef.current = 0;
  };

  const handleDownload = async (key: string) => {
    const res = await storageApi.getDownloadUrl(
      credentialId,
      selectedBucket,
      key,
    );
    if (res.data) {
      window.open(res.data, "_blank");
    }
  };

  const handleDelete = (key: string) => {
    deleteMutation.mutate(key);
  };

  return (
    <div className="space-y-4">
      {/* Header with bucket selector */}
      <div className="flex items-center justify-between">
        <StorageStatsBar
          credentialId={credentialId}
          bucket={selectedBucket}
          provider={credential.provider}
        />
        {!initialBucket && (
          <BucketSelector
            credentialId={credentialId}
            value={selectedBucket}
            onChange={handleBucketChange}
          />
        )}
      </div>

      {/* Toolbar */}
      {selectedBucket && (
        <StorageExplorerToolbar
          bucket={selectedBucket}
          prefix={currentPrefix}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          onNavigate={navigateToPrefix}
          onBack={goBack}
          onForward={goForward}
          canGoBack={canGoBack}
          canGoForward={canGoForward}
          onUpload={() => setUploadOpen(true)}
          onRefresh={() => refetch()}
        />
      )}

      {/* Content */}
      {!selectedBucket ? (
        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
          <p className="text-sm">Select a bucket to start browsing</p>
        </div>
      ) : objectsLoading ? (
        <div className="space-y-2 p-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-full" />
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-border bg-card overflow-hidden">
          {viewMode === "grid" ? (
            <StorageObjectGrid
              objects={listing?.objects ?? []}
              folders={listing?.folders ?? []}
              onNavigateFolder={navigateToPrefix}
              onPreview={setPreviewFile}
              onDownload={handleDownload}
              onDelete={handleDelete}
            />
          ) : (
            <StorageObjectList
              objects={listing?.objects ?? []}
              folders={listing?.folders ?? []}
              onNavigateFolder={navigateToPrefix}
              onPreview={setPreviewFile}
              onDownload={handleDownload}
              onDelete={handleDelete}
            />
          )}

          {listing?.isTruncated && (
            <div className="border-t p-3 text-center">
              <p className="text-xs text-muted-foreground">
                More objects available. Scroll or refine your path.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Preview modal */}
      <StorageFilePreview
        open={!!previewFile}
        onClose={() => setPreviewFile(null)}
        object={previewFile}
        credentialId={credentialId}
        bucket={selectedBucket}
      />

      {/* Upload dialog */}
      <StorageUploadDialog
        open={uploadOpen}
        onClose={() => setUploadOpen(false)}
        credentialId={credentialId}
        bucket={selectedBucket}
        prefix={currentPrefix}
      />
    </div>
  );
}

// Keep backward-compatible default export for the route
export { StorageExplorerPage as StorageDetailPage };
