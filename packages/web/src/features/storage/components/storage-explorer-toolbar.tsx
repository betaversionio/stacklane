import { ExplorerToolbar } from "@/components/shared/file-explorer";

interface StorageExplorerToolbarProps {
  bucket: string;
  prefix: string;
  viewMode: "grid" | "list";
  onViewModeChange: (mode: "grid" | "list") => void;
  onNavigate: (prefix: string) => void;
  onBack: () => void;
  onForward: () => void;
  canGoBack: boolean;
  canGoForward: boolean;
  onUpload: () => void;
  onRefresh: () => void;
}

export function StorageExplorerToolbar(props: StorageExplorerToolbarProps) {
  const segments = props.prefix.split("/").filter(Boolean);

  return (
    <ExplorerToolbar
      root={props.bucket}
      path={props.prefix}
      segments={segments}
      viewMode={props.viewMode}
      onViewModeChange={props.onViewModeChange}
      onNavigate={props.onNavigate}
      onBack={props.onBack}
      onForward={props.onForward}
      canGoBack={props.canGoBack}
      canGoForward={props.canGoForward}
      onUpload={props.onUpload}
      onRefresh={props.onRefresh}
      buildSegmentPath={(segs, i) => segs.slice(0, i + 1).join("/") + "/"}
    />
  );
}
