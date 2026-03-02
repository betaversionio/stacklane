import { FolderOpen, DocumentText } from "iconsax-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { formatBytes } from "@/lib/utils";
import { useStorageBucketStats } from "../hooks/use-storage-explorer";

interface StorageStatsBarProps {
  credentialId: string;
  bucket: string;
  provider: string;
}

const providerLabels: Record<string, string> = {
  s3: "AWS S3",
  r2: "Cloudflare R2",
  minio: "MinIO",
  other: "S3 Compatible",
  gcs: "Google Cloud Storage",
};

export function StorageStatsBar({
  credentialId,
  bucket,
  provider,
}: StorageStatsBarProps) {
  const { data, isLoading } = useStorageBucketStats(credentialId, bucket);
  const stats = data?.data;

  return (
    <div className="flex items-center gap-4 text-sm text-muted-foreground">
      {isLoading ? (
        <>
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-5 w-24" />
        </>
      ) : stats ? (
        <>
          <div className="flex items-center gap-1.5">
            <DocumentText size={14} color="currentColor" />
            <span>{stats.totalObjects.toLocaleString()} objects</span>
          </div>
          <div className="flex items-center gap-1.5">
            <FolderOpen size={14} color="currentColor" />
            <span>{formatBytes(stats.totalSize)}</span>
          </div>
        </>
      ) : null}
      <Badge variant="outline" className="text-[11px]">
        {providerLabels[provider] ?? provider}
      </Badge>
    </div>
  );
}
