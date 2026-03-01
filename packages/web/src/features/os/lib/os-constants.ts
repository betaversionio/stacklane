import type { AppType, WindowBounds } from "../types/window";

export interface AppDefinition {
  type: AppType;
  title: string;
  icon: string;
  iconUrl: string;
  defaultSize: { width: number; height: number };
  minWidth: number;
  minHeight: number;
}

export const APP_REGISTRY: Record<AppType, AppDefinition> = {
  "file-manager": {
    type: "file-manager",
    title: "This PC",
    icon: "folder-open",
    iconUrl: "/app-icons/finder.png",
    defaultSize: { width: 900, height: 600 },
    minWidth: 500,
    minHeight: 350,
  },
  terminal: {
    type: "terminal",
    title: "Terminal",
    icon: "terminal",
    iconUrl: "/app-icons/terminal.png",
    defaultSize: { width: 800, height: 500 },
    minWidth: 400,
    minHeight: 250,
  },
  monitor: {
    type: "monitor",
    title: "Activity Monitor",
    icon: "monitor",
    iconUrl: "/app-icons/activity-monitor.svg",
    defaultSize: { width: 750, height: 550 },
    minWidth: 400,
    minHeight: 300,
  },
  notepad: {
    type: "notepad",
    title: "TextEdit",
    icon: "document",
    iconUrl: "/app-icons/textedit.svg",
    defaultSize: { width: 700, height: 500 },
    minWidth: 400,
    minHeight: 300,
  },
  settings: {
    type: "settings",
    title: "Settings",
    icon: "settings",
    iconUrl: "/app-icons/settings.png",
    defaultSize: { width: 650, height: 550 },
    minWidth: 450,
    minHeight: 400,
  },
  browser: {
    type: "browser",
    title: "Browser",
    icon: "globe",
    iconUrl: "/app-icons/browser.png",
    defaultSize: { width: 1000, height: 700 },
    minWidth: 500,
    minHeight: 400,
  },
};

export const DESKTOP_APPS: AppType[] = ["file-manager", "terminal", "monitor", "settings", "browser"];

export const DOCK_APPS: AppType[] = [
  "file-manager",
  "terminal",
  "browser",
  "monitor",
  "notepad",
  "settings",
];

export const TASKBAR_HEIGHT = 52;
export const WINDOW_STAGGER = 30;
export const TITLE_BAR_HEIGHT = 36;

export const SIDEBAR_SHORTCUTS = [
  { label: "Root", path: "/" },
  { label: "Home", path: "/home" },
  { label: "tmp", path: "/tmp" },
  { label: "etc", path: "/etc" },
  { label: "var", path: "/var" },
  { label: "opt", path: "/opt" },
  { label: "usr", path: "/usr" },
  { label: "srv", path: "/srv" },
];

export function getDefaultBounds(
  appType: AppType,
  staggerIndex: number
): WindowBounds {
  const def = APP_REGISTRY[appType];
  const offset = staggerIndex * WINDOW_STAGGER;
  return {
    x: 100 + offset,
    y: 60 + offset,
    width: def.defaultSize.width,
    height: def.defaultSize.height,
  };
}
