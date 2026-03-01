import {
  getIconForFilePath,
  getIconForDirectoryPath,
  getIconUrlByName,
} from "vscode-material-icons";

const ICONS_URL = "/material-icons";

export function getFileIconUrl(fileName: string): string {
  const icon = getIconForFilePath(fileName);
  return getIconUrlByName(icon, ICONS_URL);
}

export function getFolderIconUrl(folderName: string): string {
  const icon = getIconForDirectoryPath(folderName);
  return getIconUrlByName(icon, ICONS_URL);
}
