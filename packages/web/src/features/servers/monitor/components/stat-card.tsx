import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  icon: React.ReactNode;
  value: string;
  percentage: number;
  details: { label: string; value: string }[];
}

export function StatCard({
  title,
  icon,
  value,
  percentage,
  details,
}: StatCardProps) {
  const barColor =
    percentage > 90
      ? "bg-destructive"
      : percentage > 70
        ? "bg-yellow-500"
        : "bg-primary";

  return (
    <div className="rounded-lg border border-border bg-card p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground">{icon}</span>
          <h3 className="font-semibold text-sm">{title}</h3>
        </div>
        <span className="text-2xl font-bold">{value}</span>
      </div>

      {/* Progress bar */}
      <div className="h-2 bg-muted rounded-full mb-4 overflow-hidden">
        <div
          className={cn("h-full rounded-full transition-all duration-500", barColor)}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>

      <div className="space-y-1">
        {details.map((d) => (
          <div
            key={d.label}
            className="flex justify-between text-xs text-muted-foreground"
          >
            <span>{d.label}</span>
            <span className="truncate ml-2">{d.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
