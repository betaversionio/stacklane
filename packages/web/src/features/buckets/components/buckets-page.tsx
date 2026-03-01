import { useState } from "react";
import { CloudConnection, Add } from "iconsax-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/shared/page-header";
import type { BucketCredential } from "@stacklane/shared";
import { useBuckets, useDeleteBucket } from "../hooks/use-buckets";
import { BucketCard } from "./bucket-card";
import { BucketDialog } from "./bucket-dialog";

export function BucketsPage() {
  const { data, isLoading } = useBuckets();
  const deleteMutation = useDeleteBucket();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editCredential, setEditCredential] = useState<BucketCredential | undefined>();

  const credentials = (data?.data as BucketCredential[] | undefined) ?? [];

  const openAdd = () => {
    setEditCredential(undefined);
    setDialogOpen(true);
  };

  const openEdit = (cred: BucketCredential) => {
    setEditCredential(cred);
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setEditCredential(undefined);
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Buckets" description="Manage your cloud storage credentials">
        <Button onClick={openAdd}>
          <Add size={18} color="currentColor" />
          Add Credential
        </Button>
      </PageHeader>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-28 rounded-lg border border-border bg-card animate-pulse"
            />
          ))}
        </div>
      ) : credentials.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <CloudConnection size={48} color="currentColor" variant="Linear" className="text-muted-foreground/50 mb-4" />
          <h2 className="text-lg font-semibold">No bucket credentials yet</h2>
          <p className="text-muted-foreground mb-6 max-w-sm">
            Store your cloud storage credentials for S3, R2, MinIO, or Google Cloud Storage.
          </p>
          <Button onClick={openAdd}>
            <Add size={18} color="currentColor" />
            Add Credential
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {credentials.map((cred) => (
            <BucketCard
              key={cred.id}
              credential={cred}
              onEdit={openEdit}
              onDelete={(id) => deleteMutation.mutate(id)}
            />
          ))}
        </div>
      )}

      <BucketDialog open={dialogOpen} onClose={closeDialog} editCredential={editCredential} />
    </div>
  );
}
