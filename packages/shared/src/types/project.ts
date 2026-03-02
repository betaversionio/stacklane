export interface Project {
  id: string;
  name: string;
  description?: string;
  serverIds: string[];
  storageCredentialIds: string[];
  color?: string;
  createdAt: string;
  updatedAt: string;
}

export type ProjectInput = Omit<Project, "id" | "createdAt" | "updatedAt">;
