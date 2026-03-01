export interface RemoteFile {
  name: string;
  path: string;
  type: "file" | "directory" | "symlink";
  size: number;
  modifiedAt: string;
  permissions: string;
  owner: string;
  group: string;
}

export interface FileTransferProgress {
  filename: string;
  transferred: number;
  total: number;
  percentage: number;
}
