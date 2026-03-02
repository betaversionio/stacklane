import { createContext, useContext, useCallback, useState, type ReactNode } from "react";
import { ConnectionDialog } from "./connection-dialog";
import type { ServerConnection } from "@stacklane/shared";

interface ConnectionDialogContextValue {
  openAddDialog: () => void;
  openEditDialog: (connection: ServerConnection) => void;
}

const ConnectionDialogContext = createContext<ConnectionDialogContextValue | null>(null);

export function ConnectionDialogProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [editConnection, setEditConnection] = useState<ServerConnection | undefined>();

  const openAddDialog = useCallback(() => {
    setEditConnection(undefined);
    setOpen(true);
  }, []);

  const openEditDialog = useCallback((connection: ServerConnection) => {
    setEditConnection(connection);
    setOpen(true);
  }, []);

  const handleClose = useCallback(() => {
    setOpen(false);
    setEditConnection(undefined);
  }, []);

  return (
    <ConnectionDialogContext.Provider value={{ openAddDialog, openEditDialog }}>
      {children}
      <ConnectionDialog open={open} onClose={handleClose} editConnection={editConnection} />
    </ConnectionDialogContext.Provider>
  );
}

export function useConnectionDialog() {
  const ctx = useContext(ConnectionDialogContext);
  if (!ctx) throw new Error("useConnectionDialog must be used within ConnectionDialogProvider");
  return ctx;
}
