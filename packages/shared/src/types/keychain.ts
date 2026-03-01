export interface SSHKey {
  id: string;
  name: string;
  type: "path" | "text";
  keyPath?: string;
  keyContent?: string;
  passphrase?: string;
  createdAt: string;
  updatedAt: string;
}

export type SSHKeyInput = Omit<SSHKey, "id" | "createdAt" | "updatedAt">;
