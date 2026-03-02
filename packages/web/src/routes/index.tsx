import { createBrowserRouter } from "react-router-dom";
import { App } from "@/App";
import { ErrorPage } from "@/pages/error";
import { NotFoundPage } from "@/pages/not-found";
import { ServerLayout } from "@/pages/server";
import { StorageLayout } from "@/pages/storage";
import { ProjectPage } from "@/pages/project";
import { dashboardRoutes } from "./dashboard.routes";
import { serverRoutes, serversListRoute } from "./server.routes";
import { keychainRoutes } from "./keychain.routes";
import { storageRoutes, storageDetailRoutes } from "./storage.routes";
import { settingsRoutes } from "./settings.routes";

export const router = createBrowserRouter([
  {
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      ...dashboardRoutes,
      { path: "project/:id", element: <ProjectPage /> },
      ...serversListRoute,
      ...keychainRoutes,
      ...storageRoutes,
      ...settingsRoutes,
      {
        path: "*",
        element: <NotFoundPage />,
      },
    ],
  },
  {
    element: <ServerLayout />,
    errorElement: <ErrorPage />,
    children: [...serverRoutes],
  },
  {
    element: <StorageLayout />,
    errorElement: <ErrorPage />,
    children: [...storageDetailRoutes],
  },
]);
