import { Monitor, Add } from "iconsax-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/shared/page-header";
import type { ServerConnection } from "@stacklane/shared";
import { useConnections, useDeleteConnection, useConnectionDialog } from "@/features/connections";
import { ServerCard } from "@/features/connections";

export function DashboardPage() {
  const { data, isLoading } = useConnections();
  const deleteMutation = useDeleteConnection();
  const { openAddDialog } = useConnectionDialog();

  const connections = (data?.data as ServerConnection[] | undefined) ?? [];

  return (
    <div className="space-y-6">
      <PageHeader title="Dashboard" description="Manage your remote servers">
        <Button onClick={openAddDialog}>
          <Add size={18} color="currentColor" />
          Add Server
        </Button>
      </PageHeader>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-40 rounded-lg border border-border bg-card animate-pulse"
            />
          ))}
        </div>
      ) : connections.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Monitor size={48} color="currentColor" variant="Linear" className="text-muted-foreground/50 mb-4" />
          <h2 className="text-lg font-semibold">No servers yet</h2>
          <p className="text-muted-foreground mb-6 max-w-sm">
            Add your first server to start managing it through the browser.
          </p>
          <Button onClick={openAddDialog}>
            <Add size={18} color="currentColor" />
            Add Server
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {connections.map((conn) => (
            <ServerCard
              key={conn.id}
              connection={conn}
              onDelete={(id) => deleteMutation.mutate(id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
