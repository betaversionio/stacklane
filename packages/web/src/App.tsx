import { Outlet } from "react-router-dom";
import { Sidebar, SidebarProvider } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { ConnectionDialogProvider } from "@/features/connections/connection-dialog-context";

export function App() {
  return (
    <SidebarProvider>
      <ConnectionDialogProvider>
        <div className="fixed inset-0 flex bg-background">
          <Sidebar />
          <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden">
            <Header />
            <main className="flex-1 overflow-y-auto p-6">
              <Outlet />
            </main>
          </div>
        </div>
      </ConnectionDialogProvider>
    </SidebarProvider>
  );
}
