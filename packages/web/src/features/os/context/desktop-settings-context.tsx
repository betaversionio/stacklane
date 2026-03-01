import { createContext, useContext, useState, type ReactNode } from "react";

interface DesktopSettingsContext {
  wallpaper: string;
  setWallpaper: (id: string) => void;
}

const DesktopSettingsContext = createContext<DesktopSettingsContext>({
  wallpaper: "image-betaversion",
  setWallpaper: () => {},
});

const STORAGE_KEY = "stacklane-desktop-settings";

export function DesktopSettingsProvider({ children }: { children: ReactNode }) {
  const [wallpaper, setWallpaperState] = useState<string>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return parsed.wallpaper || "image-betaversion";
      }
    } catch {}
    return "image-betaversion";
  });

  const setWallpaper = (id: string) => {
    setWallpaperState(id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ wallpaper: id }));
  };

  return (
    <DesktopSettingsContext value={{ wallpaper, setWallpaper }}>
      {children}
    </DesktopSettingsContext>
  );
}

export const useDesktopSettings = () => useContext(DesktopSettingsContext);
