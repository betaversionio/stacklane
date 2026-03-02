import {
  ArrowLeft,
  ArrowRight,
  RefreshCircle,
  DocumentUpload,
  Grid2,
  RowVertical,
  FolderAdd,
} from "iconsax-react";
import { Button } from "@/components/ui/button";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

interface ExplorerToolbarProps {
  root: string;
  path: string;
  segments: string[];
  viewMode: "grid" | "list";
  onViewModeChange: (mode: "grid" | "list") => void;
  onNavigate: (path: string) => void;
  onBack: () => void;
  onForward: () => void;
  canGoBack: boolean;
  canGoForward: boolean;
  onUpload: () => void;
  onRefresh: () => void;
  onNewFolder?: () => void;
  buildSegmentPath: (segments: string[], index: number) => string;
}

export function ExplorerToolbar({
  root,
  segments,
  viewMode,
  onViewModeChange,
  onNavigate,
  onBack,
  onForward,
  canGoBack,
  canGoForward,
  onUpload,
  onRefresh,
  onNewFolder,
  buildSegmentPath,
}: ExplorerToolbarProps) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border border-border bg-card px-3 py-2">
      <div className="flex items-center gap-1.5 min-w-0">
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={onBack}
          disabled={!canGoBack}
        >
          <ArrowLeft size={16} color="currentColor" />
        </Button>
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={onForward}
          disabled={!canGoForward}
        >
          <ArrowRight size={16} color="currentColor" />
        </Button>

        <div className="mx-1 h-4 w-px bg-border" />

        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              {segments.length === 0 ? (
                <BreadcrumbPage>{root}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink
                  className="cursor-pointer"
                  onClick={() => onNavigate("")}
                >
                  {root}
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
            {segments.map((seg, i) => {
              const isLast = i === segments.length - 1;
              const segPath = buildSegmentPath(segments, i);
              return (
                <span key={segPath} className="contents">
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    {isLast ? (
                      <BreadcrumbPage>{seg}</BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink
                        className="cursor-pointer"
                        onClick={() => onNavigate(segPath)}
                      >
                        {seg}
                      </BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                </span>
              );
            })}
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="flex items-center gap-1">
        <Button variant="ghost" size="icon-sm" onClick={onRefresh}>
          <RefreshCircle size={16} color="currentColor" />
        </Button>
        {onNewFolder && (
          <Button variant="ghost" size="icon-sm" onClick={onNewFolder}>
            <FolderAdd size={16} color="currentColor" />
          </Button>
        )}
        <Button variant="ghost" size="icon-sm" onClick={onUpload}>
          <DocumentUpload size={16} color="currentColor" />
        </Button>
        <div className="mx-1 h-4 w-px bg-border" />
        <Button
          variant={viewMode === "grid" ? "secondary" : "ghost"}
          size="icon-sm"
          onClick={() => onViewModeChange("grid")}
        >
          <Grid2 size={16} color="currentColor" />
        </Button>
        <Button
          variant={viewMode === "list" ? "secondary" : "ghost"}
          size="icon-sm"
          onClick={() => onViewModeChange("list")}
        >
          <RowVertical size={16} color="currentColor" />
        </Button>
      </div>
    </div>
  );
}
