import { BookOpen, Maximize, Minimize } from "lucide-react";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useFullscreen } from "@/hooks/use-fullscreen";

export function HeaderActions() {
  const { isFullscreen, toggle: toggleFullscreen } = useFullscreen();

  return (
    <div className="flex items-center gap-2">
      <Button variant="ghost" size="sm" asChild>
        <a
          href="https://stacklane.betaversion.io/docs"
          target="_blank"
          rel="noopener noreferrer"
        >
          <BookOpen size={16} />
          Docs
        </a>
      </Button>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleFullscreen}
            aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
          >
            {isFullscreen ? <Minimize size={18} /> : <Maximize size={18} />}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          {isFullscreen ? "Exit fullscreen" : "Fullscreen"}
        </TooltipContent>
      </Tooltip>
      <ThemeToggle />
    </div>
  );
}
