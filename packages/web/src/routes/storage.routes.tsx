import { Navigate, type RouteObject } from "react-router-dom";
import { StorageExplorerPage } from "@/features/storage";
import { StorageListPage } from "@/pages/storage/storage-list-page";
import { StoragePage, useStorageContext } from "@/pages/storage/storage-page";
import { StorageOverviewPage } from "@/pages/storage/storage-overview-page";
import { StorageSettingsPage } from "@/pages/storage/storage-settings-page";
import { useParams } from "react-router-dom";

function OverviewRoute() {
  const { credential } = useStorageContext();
  return <StorageOverviewPage credential={credential} />;
}

function SettingsRoute() {
  const { credential } = useStorageContext();
  return <StorageSettingsPage credential={credential} />;
}

function StorageExplorerRoute() {
  const { credentialId, credential } = useStorageContext();
  const { bucket } = useParams<{ bucket: string }>();
  const decodedBucket = bucket ? decodeURIComponent(bucket) : undefined;
  return (
    <StorageExplorerPage
      key={decodedBucket}
      credentialId={credentialId}
      credential={credential}
      initialBucket={decodedBucket}
    />
  );
}

// These go under the App layout (global sidebar)
export const storageRoutes: RouteObject[] = [
  {
    path: "storage",
    element: <StorageListPage />,
  },
];

// These go under the StorageLayout (storage-specific sidebar)
export const storageDetailRoutes: RouteObject[] = [
  {
    path: "storage/:id",
    element: <StoragePage />,
    children: [
      { index: true, element: <Navigate to="overview" replace /> },
      { path: "overview", element: <OverviewRoute /> },
      { path: "settings", element: <SettingsRoute /> },
      { path: "b/:bucket", element: <StorageExplorerRoute /> },
    ],
  },
];
