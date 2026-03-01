export interface ServerConnection {
  id: string;
  name: string;
  host: string;
  port: number;
  username: string;
  authMethod: "password" | "key";
  password?: string;
  privateKey?: string;
  passphrase?: string;
  keychainKeyId?: string;
  color?: string;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

export type ServerConnectionInput = Omit<
  ServerConnection,
  "id" | "createdAt" | "updatedAt"
>;

export interface ConnectionStatus {
  id: string;
  connected: boolean;
  error?: string;
}
