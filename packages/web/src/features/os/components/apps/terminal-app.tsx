import { TerminalTab } from "@/features/terminal";

interface TerminalAppProps {
  connectionId: string;
}

export function TerminalApp({ connectionId }: TerminalAppProps) {
  return (
    <div className="h-full flex flex-col">
      <TerminalTab connectionId={connectionId} />
    </div>
  );
}
