import { Sun, Moon, Monitor, Check } from 'lucide-react';
import { useTheme } from '@/components/theme-provider';
import { useDesktopSettings } from '../../context/desktop-settings-context';
import { WALLPAPERS, type WallpaperOption } from '../../lib/wallpapers';
import { cn } from '@/lib/utils';

const themes = [
  { key: 'light' as const, label: 'Light', icon: Sun },
  { key: 'dark' as const, label: 'Dark', icon: Moon },
  { key: 'system' as const, label: 'System', icon: Monitor },
];

function WallpaperThumbnail({
  wp,
  active,
  onClick,
}: {
  wp: WallpaperOption;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn('relative flex flex-col items-center gap-1.5 group')}
    >
      <div
        className={cn(
          'relative w-[120px] h-[80px] rounded-lg overflow-hidden border-2 transition-all',
          active
            ? 'border-primary ring-2 ring-primary/30'
            : 'border-border hover:border-muted-foreground/50',
        )}
      >
        {wp.type === 'gradient' ? (
          <div className={cn('absolute inset-0', wp.value)} />
        ) : (
          <div
            className="absolute inset-0 bg-center"
            style={{
              backgroundImage: wp.value.startsWith('url(') ? wp.value : `url(${wp.value})`,
              backgroundSize: wp.value.startsWith('url("data:') ? 'auto' : 'cover',
            }}
          />
        )}
        {active && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20">
            <Check className="h-5 w-5 text-white drop-shadow" />
          </div>
        )}
      </div>
      <span className="text-[11px] text-muted-foreground group-hover:text-foreground transition-colors">
        {wp.label}
      </span>
    </button>
  );
}

export function SettingsApp() {
  const { theme, setTheme } = useTheme();
  const { wallpaper, setWallpaper } = useDesktopSettings();

  return (
    <div className="flex h-full flex-col overflow-y-auto bg-background text-foreground">
      <div className="p-6 space-y-8">
        {/* Theme Section */}
        <section>
          <h2 className="text-sm font-semibold mb-3">Theme</h2>
          <div className="flex gap-3">
            {themes.map((t) => (
              <button
                key={t.key}
                onClick={() => setTheme(t.key)}
                className={cn(
                  'flex flex-col items-center gap-2 rounded-xl border-2 p-4 w-28 transition-all',
                  theme === t.key
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-muted-foreground/50 hover:bg-muted/50',
                )}
              >
                <div className="relative">
                  <t.icon className="h-6 w-6 text-foreground" />
                  {theme === t.key && (
                    <Check className="absolute -right-2 -top-2 h-3.5 w-3.5 text-primary" />
                  )}
                </div>
                <span className="text-xs font-medium">{t.label}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Wallpaper Section */}
        <section>
          <h2 className="text-sm font-semibold mb-1">Desktop Background</h2>

          {/* Gradients */}
          <h3 className="text-xs text-muted-foreground mt-4 mb-2">Gradients</h3>
          <div className="flex flex-wrap gap-3">
            {WALLPAPERS.filter((w) => w.type === 'gradient').map((wp) => (
              <WallpaperThumbnail
                key={wp.id}
                wp={wp}
                active={wallpaper === wp.id}
                onClick={() => setWallpaper(wp.id)}
              />
            ))}
          </div>

          {/* Abstract patterns */}
          <h3 className="text-xs text-muted-foreground mt-4 mb-2">Patterns</h3>
          <div className="flex flex-wrap gap-3">
            {WALLPAPERS.filter(
              (w) => w.type === 'image' && w.id.startsWith('image-'),
            ).map((wp) => (
              <WallpaperThumbnail
                key={wp.id}
                wp={wp}
                active={wallpaper === wp.id}
                onClick={() => setWallpaper(wp.id)}
              />
            ))}
          </div>

          {/* Photos */}
          <h3 className="text-xs text-muted-foreground mt-4 mb-2">Photos</h3>
          <div className="flex flex-wrap gap-3">
            {WALLPAPERS.filter(
              (w) => w.type === 'image' && w.id.startsWith('photo-'),
            ).map((wp) => (
              <WallpaperThumbnail
                key={wp.id}
                wp={wp}
                active={wallpaper === wp.id}
                onClick={() => setWallpaper(wp.id)}
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
