import { Link, useParams, useLocation } from "react-router-dom";
import { CommandSquare, FolderOpen, Activity, Setting2, Monitor, type Icon } from "iconsax-react";
import { cn } from "@/lib/utils";
import { SidebarShell } from "@/components/ui/sidebar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { SidebarHeader } from "@/components/layout/sidebar/sidebar-header";
import { useSidebar } from "@/components/layout/sidebar/sidebar-context";

interface TabItem {
  icon: Icon;
  label: string;
  value: string;
}

const tabs: TabItem[] = [
  { icon: CommandSquare, label: "Terminal", value: "terminal" },
  { icon: FolderOpen, label: "Files", value: "files" },
  { icon: Activity, label: "Monitor", value: "monitor" },
  { icon: Monitor, label: "OS", value: "os" },
  { icon: Setting2, label: "Settings", value: "settings" },
];

export function ServerSidebar() {
  const { collapsed, setMobileOpen } = useSidebar();
  const { id } = useParams<{ id: string }>();
  const location = useLocation();

  const activeTab = location.pathname.split("/").pop() ?? "terminal";

  return (
    <SidebarShell>
      <SidebarHeader />

      {/* Tab navigation */}
      <nav
        className={cn(
          "scrollbar-none flex-1 overflow-y-auto px-2 py-4",
          collapsed ? "space-y-0.5" : "space-y-1"
        )}
      >
        {tabs.map((item) => {
          const isActive = activeTab === item.value;

          const link = (
            <Link
              key={item.value}
              to={`/server/${id}/${item.value}`}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-normal transition-colors",
                isActive
                  ? "bg-accent dark:bg-accent/80 shadow-glass"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
                collapsed && "justify-center px-2"
              )}
            >
              <item.icon
                size={collapsed ? 22 : 20}
                color="currentColor"
                variant={isActive ? "Bulk" : "Linear"}
                className="shrink-0"
              />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );

          if (collapsed) {
            return (
              <Tooltip key={item.value} delayDuration={0}>
                <TooltipTrigger asChild>{link}</TooltipTrigger>
                <TooltipContent side="right">
                  <p>{item.label}</p>
                </TooltipContent>
              </Tooltip>
            );
          }

          return link;
        })}
      </nav>
    </SidebarShell>
  );
}
