import { useState } from 'react';
import { ChevronDown, Package, Search } from 'lucide-react';
import type { InstallableApp, AppCategory } from '../lib/app-catalog.types';
import { appCategories } from '../lib/app-catalog';
import type { AppsSheetState } from '../hooks/use-apps-sheet';
import { AppInstallForm } from './app-install-form';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface AppsSheetProps {
  state: AppsSheetState;
  onInstall: (app: InstallableApp, values: Record<string, string>) => void;
  container?: HTMLElement | null;
}

function AppIcon({
  src,
  name,
  className,
}: {
  src: string;
  name: string;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        className={cn(
          'flex items-center justify-center rounded bg-muted',
          className,
        )}
      >
        <Package className="h-3.5 w-3.5 text-muted-foreground" />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={name}
      className={cn('rounded shrink-0 bg-muted/50', className)}
      onError={() => setFailed(true)}
    />
  );
}

/** Group apps by category, preserving category order */
function groupByCategory(
  apps: InstallableApp[],
): { category: AppCategory; apps: InstallableApp[] }[] {
  const map = new Map<AppCategory, InstallableApp[]>();
  for (const app of apps) {
    const list = map.get(app.category);
    if (list) list.push(app);
    else map.set(app.category, [app]);
  }
  return appCategories
    .filter((cat) => map.has(cat))
    .map((cat) => ({ category: cat, apps: map.get(cat)! }));
}

function CollapsibleGroup({
  category,
  count,
  apps,
  onSelect,
}: {
  category: AppCategory;
  count: number;
  apps: InstallableApp[];
  onSelect: (app: InstallableApp) => void;
}) {
  const [open, setOpen] = useState(true);

  return (
    <div className="border-b border-border last:border-b-0">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between px-4 py-2.5 text-sm font-medium text-foreground hover:bg-accent/50 transition-colors"
      >
        <span>
          {category}{' '}
          <span className="text-muted-foreground font-normal">({count})</span>
        </span>
        <ChevronDown
          className={cn(
            'h-4 w-4 text-muted-foreground transition-transform duration-200',
            open ? '' : '-rotate-90',
          )}
        />
      </button>
      <div
        className="grid transition-[grid-template-rows] duration-200 ease-in-out"
        style={{ gridTemplateRows: open ? '1fr' : '0fr' }}
      >
        <div className="overflow-hidden">
          {apps.map((app) => (
            <button
              key={app.id}
              type="button"
              onClick={() => onSelect(app)}
              className="flex w-full items-center gap-3 py-2 px-4 cursor-pointer text-left hover:bg-accent transition-colors"
            >
              <AppIcon
                src={app.iconUrl}
                name={app.name}
                className="h-10 w-10 p-1"
              />
              <div className="flex-1 min-w-0">
                <span className="text-sm font-medium truncate block">
                  {app.name}
                </span>
                <p className="text-xs text-muted-foreground truncate">
                  {app.description}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export function AppsSheet({ state, onInstall, container }: AppsSheetProps) {
  const {
    open,
    search,
    category,
    selectedApp,
    filteredApps,
    setOpen,
    setSearch,
    setCategory,
    setSelectedApp,
    goBack,
  } = state;

  const handleInstall = (
    app: InstallableApp,
    values: Record<string, string>,
  ) => {
    onInstall(app, values);
    setOpen(false);
  };

  const grouped = groupByCategory(filteredApps);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent
        side="right"
        className="w-[480px] sm:max-w-[480px] p-0"
        container={container}
      >
        {selectedApp ? (
          <>
            <SheetHeader className="sr-only">
              <SheetTitle>Install {selectedApp.name}</SheetTitle>
              <SheetDescription>
                Configure and install {selectedApp.name} on your server
              </SheetDescription>
            </SheetHeader>
            <AppInstallForm
              app={selectedApp}
              onBack={goBack}
              onInstall={handleInstall}
            />
          </>
        ) : (
          <div className="flex flex-col h-full">
            <SheetHeader className="px-4 pt-4 pb-3 space-y-0">
              <SheetTitle>Install Apps</SheetTitle>
              <SheetDescription>
                Browse and install software on your server
              </SheetDescription>
            </SheetHeader>

            {/* Search + Category filter inline */}
            <div className="flex items-center gap-2 px-4 pb-3">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <Input
                  placeholder="Search apps..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="h-10 pl-8"
                />
              </div>
              <Select
                value={category ?? 'all'}
                onValueChange={(v) =>
                  setCategory(v === 'all' ? null : (v as AppCategory))
                }
              >
                <SelectTrigger className="h-10 w-[140px] shrink-0">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent container={container}>
                  <SelectItem value="all">All Categories</SelectItem>
                  {appCategories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Grouped app list */}
            <div className="flex-1 overflow-y-auto border-t border-border">
              {grouped.length === 0 ? (
                <p className="py-6 text-center text-sm text-muted-foreground">
                  No apps found.
                </p>
              ) : (
                grouped.map((group) => (
                  <CollapsibleGroup
                    key={group.category}
                    category={group.category}
                    count={group.apps.length}
                    apps={group.apps}
                    onSelect={setSelectedApp}
                  />
                ))
              )}
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
