import { Maximize, Minimize, Settings2, Package } from 'lucide-react';
import { ToolbarButton } from './toolbar-button';

interface TerminalToolbarProps {
  fgColor: string;
  bgColor: string;
  isFullscreen: boolean;
  onAppsClick: () => void;
  onAppearanceClick: () => void;
  onFullscreenToggle: () => void;
}

export function TerminalToolbar({
  fgColor,
  bgColor,
  isFullscreen,
  onAppsClick,
  onAppearanceClick,
  onFullscreenToggle,
}: TerminalToolbarProps) {
  // Create a lighter version of the background for hover state
  const hoverBgColor = `color-mix(in srgb, ${bgColor} 85%, white 15%)`;

  return (
    <div className="flex items-center gap-1">
      <ToolbarButton
        icon={<Package className="h-4 w-4" style={{ color: fgColor }} />}
        tooltip="Apps"
        onClick={onAppsClick}
        hoverBgColor={hoverBgColor}
      />

      <ToolbarButton
        icon={<Settings2 className="h-4 w-4" style={{ color: fgColor }} />}
        tooltip="Appearance"
        onClick={onAppearanceClick}
        hoverBgColor={hoverBgColor}
      />

      <ToolbarButton
        icon={
          isFullscreen ? (
            <Minimize className="h-4 w-4" style={{ color: fgColor }} />
          ) : (
            <Maximize className="h-4 w-4" style={{ color: fgColor }} />
          )
        }
        tooltip={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
        onClick={onFullscreenToggle}
        hoverBgColor={hoverBgColor}
      />
    </div>
  );
}
