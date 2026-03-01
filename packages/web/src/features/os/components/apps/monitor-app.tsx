import { MonitorTab } from "@/features/monitor";

interface MonitorAppProps {
  connectionId: string;
}

export function MonitorApp({ connectionId }: MonitorAppProps) {
  return (
    <div className="h-full overflow-auto p-4">
      <MonitorTab connectionId={connectionId} />
    </div>
  );
}
