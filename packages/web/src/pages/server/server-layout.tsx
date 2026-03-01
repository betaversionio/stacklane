import { Link, Outlet, useParams } from "react-router-dom";
import { HambergerMenu } from "iconsax-react";
import { SidebarProvider, useSidebar } from "@/components/layout/sidebar/sidebar-context";
import { ConnectionDialogProvider } from "@/features/connections";
import { HeaderActions } from "@/components/layout/header-actions";
import { Button } from "@/components/ui/button";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useConnections } from "@/features/connections";
import type { ServerConnection } from "@stacklane/shared";
import { ServerSidebar } from "./server-sidebar";

function ServerHeader() {
  const { id } = useParams<{ id: string }>();
  const { setMobileOpen } = useSidebar();

  const { data } = useConnections();
  const connections = (data?.data as ServerConnection[] | undefined) ?? [];
  const connection = connections.find((c) => c.id === id);

  return (
    <header className="flex items-center justify-between h-14 px-6 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="flex items-center gap-1.5">
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setMobileOpen(true)}
          aria-label="Open menu"
        >
          <HambergerMenu size={20} color="currentColor" />
        </Button>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/">Servers</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            {connection && (
              <>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>{connection.name}</BreadcrumbPage>
                </BreadcrumbItem>
              </>
            )}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <HeaderActions />
    </header>
  );
}

export function ServerLayout() {
  return (
    <ConnectionDialogProvider>
      <SidebarProvider>
        <div className="fixed inset-0 flex bg-background">
          <ServerSidebar />
          <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden">
            <ServerHeader />
            <main className="flex-1 overflow-y-auto p-6">
              <Outlet />
            </main>
          </div>
        </div>
      </SidebarProvider>
    </ConnectionDialogProvider>
  );
}
