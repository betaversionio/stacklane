export interface FileItem {
  key: string;
  name: string;
  isFolder: boolean;
  size: number;
  lastModified: string;
  extra?: string; // permissions, storageClass, etc.
}

export interface FolderItem {
  key: string;
  name: string;
}
