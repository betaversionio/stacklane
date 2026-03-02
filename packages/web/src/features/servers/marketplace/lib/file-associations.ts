import type { AppType, BuiltInAppType } from "../../os/types/window";
import type { InstalledApp } from "../types";
import { toMarketAppType } from "../types";

interface FileHandler {
  appType: AppType;
  label: string;
}

/** Built-in file associations (notepad handles text/code files) */
const BUILTIN_ASSOCIATIONS: Record<string, BuiltInAppType> = {
  ".txt": "notepad",
  ".md": "notepad",
  ".json": "notepad",
  ".js": "notepad",
  ".ts": "notepad",
  ".jsx": "notepad",
  ".tsx": "notepad",
  ".css": "notepad",
  ".html": "notepad",
  ".xml": "notepad",
  ".yml": "notepad",
  ".yaml": "notepad",
  ".toml": "notepad",
  ".ini": "notepad",
  ".cfg": "notepad",
  ".conf": "notepad",
  ".env": "notepad",
  ".sh": "notepad",
  ".bash": "notepad",
  ".zsh": "notepad",
  ".py": "notepad",
  ".rb": "notepad",
  ".go": "notepad",
  ".rs": "notepad",
  ".java": "notepad",
  ".c": "notepad",
  ".cpp": "notepad",
  ".h": "notepad",
  ".hpp": "notepad",
  ".php": "notepad",
  ".sql": "notepad",
  ".log": "notepad",
  ".csv": "notepad",
  ".gitignore": "notepad",
  ".dockerignore": "notepad",
  ".editorconfig": "notepad",
};

export type FileAssociationMap = Map<string, FileHandler[]>;

function getExtension(fileName: string): string {
  const dot = fileName.lastIndexOf(".");
  if (dot === -1) return "";
  return fileName.slice(dot).toLowerCase();
}

/**
 * Build a map of file extension → handlers.
 * Marketplace apps take higher priority (listed first).
 */
export function buildAssociationMap(
  installedApps: InstalledApp[]
): FileAssociationMap {
  const map: FileAssociationMap = new Map();

  // Add built-in associations
  for (const [ext, appType] of Object.entries(BUILTIN_ASSOCIATIONS)) {
    map.set(ext, [{ appType, label: "TextEdit" }]);
  }

  // Add marketplace app associations (higher priority — prepend)
  for (const { manifest } of installedApps) {
    for (const ext of manifest.fileAssociations) {
      const normalized = ext.toLowerCase();
      const handler: FileHandler = {
        appType: toMarketAppType(manifest.id),
        label: manifest.name,
      };
      const existing = map.get(normalized);
      if (existing) {
        existing.unshift(handler);
      } else {
        map.set(normalized, [handler]);
      }
    }
  }

  return map;
}

/**
 * Resolve the default app for a file name.
 * Returns the highest-priority handler, or "notepad" as fallback.
 */
export function resolveFileHandler(
  fileName: string,
  map: FileAssociationMap
): AppType {
  const ext = getExtension(fileName);
  if (!ext) return "notepad";
  const handlers = map.get(ext);
  return handlers?.[0]?.appType ?? "notepad";
}

/**
 * Get all handlers for a file (for "Open With" menu).
 */
export function getFileHandlers(
  fileName: string,
  map: FileAssociationMap
): FileHandler[] {
  const ext = getExtension(fileName);
  if (!ext) return [{ appType: "notepad", label: "TextEdit" }];
  return map.get(ext) ?? [{ appType: "notepad", label: "TextEdit" }];
}
