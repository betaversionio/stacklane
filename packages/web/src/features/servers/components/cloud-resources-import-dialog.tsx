import { useState, useEffect } from "react";
import { Monitor, Folder, TickCircle, Refresh2 } from "iconsax-react";
import type { CloudComputeInstance, CloudStorageResource } from "@stacklane/shared";
import { useDiscoverCloudResources, useImportCloudResources } from "../hooks/use-cloud-providers";
import { CustomDialog } from "@/components/ui/custom-dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface CloudResourcesImportDialogProps {
  open: boolean;
  onClose: () => void;
  credentialId: string | null;
}

export function CloudResourcesImportDialog({
  open,
  onClose,
  credentialId,
}: CloudResourcesImportDialogProps) {
  const [selectedCompute, setSelectedCompute] = useState<Set<string>>(new Set());
  const [selectedStorage, setSelectedStorage] = useState<Set<string>>(new Set());

  const { data: discoveryData, isLoading, refetch } = useDiscoverCloudResources(credentialId || "");
  const importMutation = useImportCloudResources();

  const discovery = discoveryData?.data;

  useEffect(() => {
    if (open && discovery) {
      // Auto-select all running instances by default
      const runningInstances = discovery.compute
        .filter((c) => c.state === "running")
        .map((c) => c.id);
      setSelectedCompute(new Set(runningInstances));

      // Auto-select all storage
      const allStorage = discovery.storage.map((s) => s.id);
      setSelectedStorage(new Set(allStorage));
    }
  }, [open, discovery]);

  const handleClose = () => {
    setSelectedCompute(new Set());
    setSelectedStorage(new Set());
    onClose();
  };

  const handleToggleCompute = (id: string) => {
    setSelectedCompute((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleToggleStorage = (id: string) => {
    setSelectedStorage((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleImport = () => {
    if (!credentialId) return;

    importMutation.mutate(
      {
        credentialId,
        computeInstances: Array.from(selectedCompute),
        storageResources: Array.from(selectedStorage),
      },
      {
        onSuccess: (res) => {
          if (res.success) {
            handleClose();
          }
        },
      }
    );
  };

  const totalSelected = selectedCompute.size + selectedStorage.size;

  return (
    <CustomDialog
      open={open}
      onOpenChange={(v) => !v && handleClose()}
      title="Import Cloud Resources"
      footer={
        <div className="flex w-full justify-between items-center">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isLoading}
          >
            <Refresh2 size={16} color="currentColor" className="mr-2" />
            Refresh
          </Button>
          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button
              onClick={handleImport}
              disabled={totalSelected === 0}
              isLoading={importMutation.isPending}
            >
              Import {totalSelected} {totalSelected === 1 ? "Resource" : "Resources"}
            </Button>
          </div>
        </div>
      }
    >
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center space-y-2">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-sm text-muted-foreground">Discovering resources...</p>
          </div>
        </div>
      ) : discovery ? (
        <Tabs defaultValue="compute" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="compute">
              <Monitor size={16} color="currentColor" className="mr-2" />
              Monitors ({discovery.compute.length})
            </TabsTrigger>
            <TabsTrigger value="storage">
              <Folder size={16} color="currentColor" className="mr-2" />
              Storage ({discovery.storage.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="compute" className="mt-4">
            {discovery.compute.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Monitor size={48} color="currentColor" className="mx-auto mb-2 opacity-50" />
                <p>No compute instances found</p>
              </div>
            ) : (
              <ScrollArea className="h-[400px] rounded-lg border">
                <div className="p-4 space-y-2">
                  {discovery.compute.map((instance) => (
                    <ComputeInstanceCard
                      key={instance.id}
                      instance={instance}
                      selected={selectedCompute.has(instance.id)}
                      onToggle={() => handleToggleCompute(instance.id)}
                    />
                  ))}
                </div>
              </ScrollArea>
            )}
          </TabsContent>

          <TabsContent value="storage" className="mt-4">
            {discovery.storage.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Folder size={48} color="currentColor" className="mx-auto mb-2 opacity-50" />
                <p>No storage resources found</p>
              </div>
            ) : (
              <ScrollArea className="h-[400px] rounded-lg border">
                <div className="p-4 space-y-2">
                  {discovery.storage.map((storage) => (
                    <StorageResourceCard
                      key={storage.id}
                      storage={storage}
                      selected={selectedStorage.has(storage.id)}
                      onToggle={() => handleToggleStorage(storage.id)}
                    />
                  ))}
                </div>
              </ScrollArea>
            )}
          </TabsContent>
        </Tabs>
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          <p>No resources discovered</p>
        </div>
      )}
    </CustomDialog>
  );
}

interface ComputeInstanceCardProps {
  instance: CloudComputeInstance;
  selected: boolean;
  onToggle: () => void;
}

function ComputeInstanceCard({ instance, selected, onToggle }: ComputeInstanceCardProps) {
  const stateColors = {
    running: "text-emerald-500",
    stopped: "text-amber-500",
    pending: "text-blue-500",
    terminated: "text-red-500",
    unknown: "text-gray-500",
  };

  return (
    <div
      className={`flex items-start gap-3 p-3 rounded-lg border transition-colors ${
        selected ? "bg-accent border-primary" : "bg-card hover:bg-accent/50"
      }`}
    >
      <Checkbox checked={selected} onCheckedChange={onToggle} className="mt-1" />
      <div className="flex-1 space-y-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-medium truncate">{instance.name}</span>
          <span className={`text-xs ${stateColors[instance.state]}`}>● {instance.state}</span>
        </div>
        <div className="text-sm text-muted-foreground space-y-0.5">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-mono text-xs">{instance.publicIp || instance.privateIp}</span>
            <span>•</span>
            <span>{instance.instanceType}</span>
            <span>•</span>
            <span>{instance.region}</span>
          </div>
          {instance.operatingSystem && (
            <div className="flex items-center gap-2">
              <span>{instance.operatingSystem}</span>
              <span>•</span>
              <span className="text-xs">User: {instance.defaultUsername}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

interface StorageResourceCardProps {
  storage: CloudStorageResource;
  selected: boolean;
  onToggle: () => void;
}

function StorageResourceCard({ storage, selected, onToggle }: StorageResourceCardProps) {
  return (
    <div
      className={`flex items-start gap-3 p-3 rounded-lg border transition-colors ${
        selected ? "bg-accent border-primary" : "bg-card hover:bg-accent/50"
      }`}
    >
      <Checkbox checked={selected} onCheckedChange={onToggle} className="mt-1" />
      <div className="flex-1 space-y-1 min-w-0">
        <div className="flex items-center gap-2">
          <Folder size={16} color="currentColor" />
          <span className="font-medium truncate">{storage.bucketName}</span>
          <span className="text-xs text-emerald-500">● {storage.status}</span>
        </div>
        <div className="text-sm text-muted-foreground space-y-0.5">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs">{storage.region}</span>
            {storage.storageClass && (
              <>
                <span>•</span>
                <span className="text-xs">{storage.storageClass}</span>
              </>
            )}
          </div>
          {storage.endpoint && (
            <div className="font-mono text-xs truncate">{storage.endpoint}</div>
          )}
        </div>
      </div>
    </div>
  );
}
