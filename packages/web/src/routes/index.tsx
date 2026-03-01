import { createBrowserRouter } from "react-router-dom";
import { App } from "@/App";
import { ErrorPage } from "@/pages/error";
import { NotFoundPage } from "@/pages/not-found";
import { ServerLayout } from "@/pages/server";
import { dashboardRoutes } from "./dashboard.routes";
import { serverRoutes } from "./server.routes";
import { keychainRoutes } from "./keychain.routes";
import { bucketsRoutes } from "./buckets.routes";
import { settingsRoutes } from "./settings.routes";

export const router = createBrowserRouter([
  {
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      ...dashboardRoutes,
      ...keychainRoutes,
      ...bucketsRoutes,
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
]);
