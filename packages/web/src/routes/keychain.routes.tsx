import type { RouteObject } from "react-router-dom";
import { KeychainPage } from "@/features/keychain";

export const keychainRoutes: RouteObject[] = [
  {
    path: "keychain",
    element: <KeychainPage />,
  },
];
