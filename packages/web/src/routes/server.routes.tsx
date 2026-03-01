import { Navigate, type RouteObject } from "react-router-dom";
import { ServerPage, useServerContext } from "@/pages/server/server-page";
import { TerminalTab } from "@/features/terminal";
import { FilesTab } from "@/features/files";
import { MonitorTab } from "@/features/monitor";
import { OsTab } from "@/features/os";
import { ServerSettingsTab } from "@/pages/server/server-settings-tab";

function TerminalRoute() {
  const { connectionId } = useServerContext();
  return <TerminalTab connectionId={connectionId} />;
}

function FilesRoute() {
  const { connectionId } = useServerContext();
  return <FilesTab connectionId={connectionId} />;
}

function MonitorRoute() {
  const { connectionId } = useServerContext();
  return <MonitorTab connectionId={connectionId} />;
}

function OsRoute() {
  const { connectionId } = useServerContext();
  return <OsTab connectionId={connectionId} />;
}

function SettingsRoute() {
  const { connection } = useServerContext();
  return <ServerSettingsTab connection={connection} />;
}

export const serverRoutes: RouteObject[] = [
  {
    path: "server/:id",
    element: <ServerPage />,
    children: [
      { index: true, element: <Navigate to="terminal" replace /> },
      { path: "terminal", element: <TerminalRoute /> },
      { path: "files", element: <FilesRoute /> },
      { path: "monitor", element: <MonitorRoute /> },
      { path: "os", element: <OsRoute /> },
      { path: "settings", element: <SettingsRoute /> },
    ],
  },
];
