import { useState, useMemo, useCallback } from "react";
import type { AppCategory, InstallableApp } from "../lib/app-catalog.types";
import { appCatalog } from "../lib/app-catalog";

export interface AppsSheetState {
  open: boolean;
  search: string;
  category: AppCategory | null;
  selectedApp: InstallableApp | null;
  filteredApps: InstallableApp[];
  setOpen: (open: boolean) => void;
  setSearch: (search: string) => void;
  setCategory: (category: AppCategory | null) => void;
  setSelectedApp: (app: InstallableApp | null) => void;
  goBack: () => void;
}

export function useAppsSheet(): AppsSheetState {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<AppCategory | null>(null);
  const [selectedApp, setSelectedApp] = useState<InstallableApp | null>(null);

  const filteredApps = useMemo(() => {
    let apps = appCatalog;

    if (category) {
      apps = apps.filter((a) => a.category === category);
    }

    if (search.trim()) {
      const q = search.toLowerCase().trim();
      apps = apps.filter(
        (a) =>
          a.name.toLowerCase().includes(q) ||
          a.description.toLowerCase().includes(q) ||
          a.id.toLowerCase().includes(q),
      );
    }

    return apps;
  }, [search, category]);

  const goBack = useCallback(() => {
    setSelectedApp(null);
  }, []);

  const handleSetOpen = useCallback((value: boolean) => {
    setOpen(value);
    if (!value) {
      // Reset state when closing
      setSearch("");
      setCategory(null);
      setSelectedApp(null);
    }
  }, []);

  return {
    open,
    search,
    category,
    selectedApp,
    filteredApps,
    setOpen: handleSetOpen,
    setSearch,
    setCategory,
    setSelectedApp,
    goBack,
  };
}
