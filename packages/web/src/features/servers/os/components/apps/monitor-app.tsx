import { MonitorPage } from "@/features/servers/monitor";

interface MonitorAppProps {
  connectionId: string;
}

export function MonitorApp({ connectionId }: MonitorAppProps) {
  return (
    <div className="h-full overflow-auto p-4">
      <MonitorPage connectionId={connectionId} />
    </div>
  );
}
