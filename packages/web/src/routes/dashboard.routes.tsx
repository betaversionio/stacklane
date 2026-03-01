import type { RouteObject } from "react-router-dom";
import { DashboardPage } from "@/features/dashboard";

export const dashboardRoutes: RouteObject[] = [
  {
    index: true,
    element: <DashboardPage />,
  },
];
