import { useTheme } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import { Moon, Sun, Monitor } from "iconsax-react";
import { cn } from "@/lib/utils";

export function SettingsPage() {
  const { theme, setTheme } = useTheme();

  const themes = [
    { value: "light" as const, label: "Light", icon: Sun },
    { value: "dark" as const, label: "Dark", icon: Moon },
    { value: "system" as const, label: "System", icon: Monitor },
  ];

  return (
    <div className="max-w-2xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Customize your experience</p>
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Appearance</h2>
        <div className="flex gap-3">
          {themes.map(({ value, label, icon: Icon }) => (
            <Button
              key={value}
              variant="outline"
              className={cn(
                "flex-1 h-auto py-4 flex-col gap-2",
                theme === value && "border-primary bg-primary/5"
              )}
              onClick={() => setTheme(value)}
            >
              <Icon size={20} color="currentColor" variant={theme === value ? "Bulk" : "Linear"} />
              <span className="text-sm">{label}</span>
            </Button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold">About</h2>
        <div className="rounded-lg border border-border p-4 space-y-2">
          <p className="text-sm">
            <span className="font-medium">StackLane</span> v0.1.0
          </p>
          <p className="text-sm text-muted-foreground">
            Browser-based OS-like UI for managing remote servers via SSH.
          </p>
        </div>
      </div>
    </div>
  );
}
