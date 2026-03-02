import { Add } from "iconsax-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useConnectionDialog } from "@/features/servers";
import { useSidebar } from "./sidebar-context";

export function SidebarFooter() {
  const { collapsed } = useSidebar();
  const { openAddDialog } = useConnectionDialog();

  if (collapsed) {
    return (
      <div className="space-y-2 border-t border-border p-2">
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="w-full text-muted-foreground hover:text-foreground"
              onClick={openAddDialog}
            >
              <Add size={20} color="currentColor" className="shrink-0" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>Add Server</p>
          </TooltipContent>
        </Tooltip>
      </div>
    );
  }

  return (
    <div className="border-t border-border p-2">
      <Button
        variant="ghost"
        className="w-full justify-start gap-2 text-muted-foreground hover:text-foreground"
        onClick={openAddDialog}
      >
        <Add size={18} color="currentColor" className="shrink-0" />
        <span className="text-sm">Add Server</span>
      </Button>
    </div>
  );
}
