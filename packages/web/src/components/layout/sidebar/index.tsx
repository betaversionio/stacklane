import { SidebarShell } from '@/components/ui/sidebar';
import { SidebarHeader } from './sidebar-header';
import { SidebarNav } from './sidebar-nav';

export function Sidebar() {
  return (
    <SidebarShell>
      <SidebarHeader />
      <SidebarNav />
    </SidebarShell>
  );
}

export { navGroups, type NavGroup, type NavItem } from './sidebar-config';
export { SidebarProvider, useSidebar } from './sidebar-context';
export { SidebarNavLink } from './sidebar-nav-link';
