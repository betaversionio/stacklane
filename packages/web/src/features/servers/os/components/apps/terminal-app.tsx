import { TerminalPage } from "@/features/servers/terminal";

interface TerminalAppProps {
  connectionId: string;
}

export function TerminalApp({ connectionId }: TerminalAppProps) {
  return (
    <div className="h-full flex flex-col">
      <TerminalPage connectionId={connectionId} />
    </div>
  );
}
