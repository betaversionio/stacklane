import type { RouteObject } from "react-router-dom";
import { SettingsPage } from "@/features/settings";

export const settingsRoutes: RouteObject[] = [
  {
    path: "settings",
    element: <SettingsPage />,
  },
];
