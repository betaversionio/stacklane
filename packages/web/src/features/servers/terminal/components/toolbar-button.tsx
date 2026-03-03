import type { ReactNode, CSSProperties } from 'react';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from '@/components/ui/tooltip';

interface ToolbarButtonProps {
  icon: ReactNode;
  tooltip: string;
  onClick: () => void;
  hoverBgColor?: string;
}

export function ToolbarButton({
  icon,
  tooltip,
  onClick,
  hoverBgColor,
}: ToolbarButtonProps) {
  const style = hoverBgColor
    ? ({ '--hover-bg': hoverBgColor } as CSSProperties)
    : undefined;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={onClick}
          className="terminal-toolbar-btn"
          style={style}
        >
          {icon}
        </Button>
      </TooltipTrigger>
      <TooltipContent>{tooltip}</TooltipContent>
    </Tooltip>
  );
}
