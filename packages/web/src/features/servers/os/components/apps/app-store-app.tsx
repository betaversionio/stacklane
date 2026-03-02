import { useState } from "react";
import { useMarketplace } from "@/features/servers/marketplace/components/marketplace-context";
import type { MarketplaceAppManifest } from "@/features/servers/marketplace/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Spinner } from "@/components/ui/spinner";
import { Trash2, Download, Package, AlertCircle } from "lucide-react";

export function AppStoreApp() {
  const { catalog, catalogLoading, catalogError, installedApps, installApp, uninstallApp, isInstalled } =
    useMarketplace();
  const [activeTab, setActiveTab] = useState("explore");

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
        <Package className="h-5 w-5 text-primary" />
        <h2 className="text-sm font-semibold text-foreground">App Store</h2>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <div className="px-4 pt-2">
          <TabsList>
            <TabsTrigger value="explore">Explore</TabsTrigger>
            <TabsTrigger value="installed">
              Installed
              {installedApps.length > 0 && (
                <Badge variant="secondary" className="ml-1.5 h-5 px-1.5 text-[10px]">
                  {installedApps.length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="explore" className="flex-1 overflow-auto px-4 pb-4">
          {catalogLoading ? (
            <div className="flex flex-col items-center justify-center h-full gap-3">
              <Spinner className="h-6 w-6" />
              <p className="text-sm text-muted-foreground">Loading catalog...</p>
            </div>
          ) : catalogError ? (
            <div className="flex flex-col items-center justify-center h-full gap-3 text-center py-12">
              <AlertCircle className="h-10 w-10 text-destructive/60" />
              <p className="text-sm text-destructive">Failed to load catalog</p>
              <p className="text-xs text-muted-foreground max-w-xs">{catalogError.message}</p>
            </div>
          ) : catalog.length === 0 ? (
            <EmptyState message="No apps available yet." />
          ) : (
            <div className="grid gap-3 pt-2" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))" }}>
              {catalog.map((manifest) => (
                <AppCard
                  key={manifest.id}
                  manifest={manifest}
                  installed={isInstalled(manifest.id)}
                  onInstall={() => installApp(manifest)}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="installed" className="flex-1 overflow-auto px-4 pb-4">
          {installedApps.length === 0 ? (
            <EmptyState message="No apps installed. Browse the Explore tab to find apps." />
          ) : (
            <div className="flex flex-col gap-2 pt-2">
              {installedApps.map(({ manifest, installedAt }) => (
                <InstalledAppRow
                  key={manifest.id}
                  manifest={manifest}
                  installedAt={installedAt}
                  onUninstall={() => uninstallApp(manifest.id)}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function AppCard({
  manifest,
  installed,
  onInstall,
}: {
  manifest: MarketplaceAppManifest;
  installed: boolean;
  onInstall: () => void;
}) {
  return (
    <div className="flex gap-3 p-3 rounded-lg border border-border bg-card hover:bg-accent/30 transition-colors">
      <img
        src={manifest.iconUrl}
        alt={manifest.name}
        className="h-12 w-12 rounded-lg shrink-0"
        draggable={false}
      />
      <div className="flex flex-col flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="text-sm font-medium text-foreground truncate">
              {manifest.name}
            </h3>
            <p className="text-[11px] text-muted-foreground">{manifest.author}</p>
          </div>
          <Button
            size="sm"
            variant={installed ? "secondary" : "default"}
            className="shrink-0 h-7 text-xs px-3"
            disabled={installed}
            onClick={onInstall}
          >
            {installed ? (
              "Installed"
            ) : (
              <>
                <Download className="h-3 w-3 mr-1" />
                Install
              </>
            )}
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
          {manifest.description}
        </p>
        <div className="flex items-center gap-2 mt-1.5">
          <Badge variant="outline" className="text-[10px] h-4 px-1.5">
            {manifest.category}
          </Badge>
          <span className="text-[10px] text-muted-foreground">v{manifest.version}</span>
        </div>
      </div>
    </div>
  );
}

function InstalledAppRow({
  manifest,
  installedAt,
  onUninstall,
}: {
  manifest: MarketplaceAppManifest;
  installedAt: number;
  onUninstall: () => void;
}) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-lg border border-border bg-card">
      <img
        src={manifest.iconUrl}
        alt={manifest.name}
        className="h-10 w-10 rounded-lg shrink-0"
        draggable={false}
      />
      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-medium text-foreground truncate">
          {manifest.name}
        </h3>
        <p className="text-[11px] text-muted-foreground">
          v{manifest.version} · Installed{" "}
          {new Date(installedAt).toLocaleDateString()}
        </p>
      </div>
      <Button
        size="sm"
        variant="ghost"
        className="shrink-0 h-8 text-xs text-destructive hover:text-destructive hover:bg-destructive/10"
        onClick={onUninstall}
      >
        <Trash2 className="h-3.5 w-3.5 mr-1" />
        Uninstall
      </Button>
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-2 text-center py-12">
      <Package className="h-10 w-10 text-muted-foreground/40" />
      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  );
}
