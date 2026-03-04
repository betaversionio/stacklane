import { createContext, useContext, useCallback, useState, type ReactNode } from "react";
import { ConnectionDialog } from "./connection-dialog";
import { ProviderDialog, type CloudProvider } from "./provider-dialog";
import { SSHConfigImportDialog } from "./ssh-config-import-dialog";
import { CloudProviderConnectDialog } from "./cloud-provider-connect-dialog";
import { CloudResourcesImportDialog } from "./cloud-resources-import-dialog";
import type { ServerConnection, CloudProviderType } from "@stacklane/shared";

interface ConnectionDialogContextValue {
  openAddDialog: () => void;
  openEditDialog: (connection: ServerConnection) => void;
  openProviderDialog: (provider: CloudProvider) => void;
  openSSHConfigImport: () => void;
  openCloudProviderConnect: (provider: CloudProviderType) => void;
}

const ConnectionDialogContext = createContext<ConnectionDialogContextValue | null>(null);

export function ConnectionDialogProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [editConnection, setEditConnection] = useState<ServerConnection | undefined>();
  const [providerDialogOpen, setProviderDialogOpen] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<CloudProvider | null>(null);
  const [sshConfigImportOpen, setSSHConfigImportOpen] = useState(false);
  const [cloudProviderDialogOpen, setCloudProviderDialogOpen] = useState(false);
  const [selectedCloudProvider, setSelectedCloudProvider] = useState<CloudProviderType | null>(null);
  const [cloudResourcesDialogOpen, setCloudResourcesDialogOpen] = useState(false);
  const [cloudCredentialId, setCloudCredentialId] = useState<string | null>(null);

  const openAddDialog = useCallback(() => {
    setEditConnection(undefined);
    setOpen(true);
  }, []);

  const openEditDialog = useCallback((connection: ServerConnection) => {
    setEditConnection(connection);
    setOpen(true);
  }, []);

  const openProviderDialog = useCallback((provider: CloudProvider) => {
    setSelectedProvider(provider);
    setProviderDialogOpen(true);
  }, []);

  const openSSHConfigImport = useCallback(() => {
    setSSHConfigImportOpen(true);
  }, []);

  const openCloudProviderConnect = useCallback((provider: CloudProviderType) => {
    setSelectedCloudProvider(provider);
    setCloudProviderDialogOpen(true);
  }, []);

  const handleClose = useCallback(() => {
    setOpen(false);
    setEditConnection(undefined);
  }, []);

  const handleProviderClose = useCallback(() => {
    setProviderDialogOpen(false);
    setSelectedProvider(null);
  }, []);

  const handleSSHConfigClose = useCallback(() => {
    setSSHConfigImportOpen(false);
  }, []);

  const handleCloudProviderClose = useCallback(() => {
    setCloudProviderDialogOpen(false);
    setSelectedCloudProvider(null);
  }, []);

  const handleCloudProviderSuccess = useCallback((credentialId: string) => {
    setCloudCredentialId(credentialId);
    setCloudResourcesDialogOpen(true);
  }, []);

  const handleCloudResourcesClose = useCallback(() => {
    setCloudResourcesDialogOpen(false);
    setCloudCredentialId(null);
  }, []);

  return (
    <ConnectionDialogContext.Provider
      value={{ openAddDialog, openEditDialog, openProviderDialog, openSSHConfigImport, openCloudProviderConnect }}
    >
      {children}
      <ConnectionDialog open={open} onClose={handleClose} editConnection={editConnection} />
      <ProviderDialog
        open={providerDialogOpen}
        onClose={handleProviderClose}
        provider={selectedProvider}
      />
      <SSHConfigImportDialog open={sshConfigImportOpen} onClose={handleSSHConfigClose} />
      <CloudProviderConnectDialog
        open={cloudProviderDialogOpen}
        onClose={handleCloudProviderClose}
        provider={selectedCloudProvider}
        onSuccess={handleCloudProviderSuccess}
      />
      <CloudResourcesImportDialog
        open={cloudResourcesDialogOpen}
        onClose={handleCloudResourcesClose}
        credentialId={cloudCredentialId}
      />
    </ConnectionDialogContext.Provider>
  );
}

export function useConnectionDialog() {
  const ctx = useContext(ConnectionDialogContext);
  if (!ctx) throw new Error("useConnectionDialog must be used within ConnectionDialogProvider");
  return ctx;
}
