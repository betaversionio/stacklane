import { SidebarShell } from "@/components/ui/sidebar";
import { SidebarFooter } from "./sidebar-footer";
import { SidebarHeader } from "./sidebar-header";
import { SidebarNav } from "./sidebar-nav";

export function Sidebar() {
  return (
    <SidebarShell>
      <SidebarHeader />
      <SidebarNav />
      <SidebarFooter />
    </SidebarShell>
  );
}

export { navGroups, type NavGroup, type NavItem } from "./sidebar-config";
export { SidebarProvider, useSidebar } from "./sidebar-context";
