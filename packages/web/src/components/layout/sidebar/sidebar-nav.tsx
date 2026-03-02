import { cn } from "@/lib/utils";
import { navGroups } from "./sidebar-config";
import { useSidebar } from "./sidebar-context";
import { SidebarNavGroup } from "./sidebar-nav-group";
import { SidebarNavItem } from "./sidebar-nav-item";

export function SidebarNav() {
  const { collapsed } = useSidebar();

  return (
    <nav
      className={cn(
        "scrollbar-none flex-1 overflow-y-auto px-2 py-4",
        collapsed ? "space-y-0.5" : "space-y-5"
      )}
    >
      {navGroups.map((group, index) => (
        <SidebarNavGroup key={group.title ?? index} title={group.title}>
          {group.items.map((item) => (
            <SidebarNavItem key={item.href} item={item} />
          ))}
        </SidebarNavGroup>
      ))}
    </nav>
  );
}
