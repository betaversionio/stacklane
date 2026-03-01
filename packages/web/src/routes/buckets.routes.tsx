import type { RouteObject } from "react-router-dom";
import { BucketsPage } from "@/features/buckets";

export const bucketsRoutes: RouteObject[] = [
  {
    path: "buckets",
    element: <BucketsPage />,
  },
];
