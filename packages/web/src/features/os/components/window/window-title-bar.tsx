import { useCallback, useEffect, useState, type RefObject } from "react";
import { Maximize2, Minimize2, Minus, Square, X, Copy } from "lucide-react";
import type { WindowState } from "../../types/window";
import { useWindowManager } from "../../context/window-manager-context";
import { useWindowDrag } from "../../hooks/use-window-drag";

interface WindowTitleBarProps {
  window: WindowState;
  containerRef: RefObject<HTMLDivElement | null>;
}

export function WindowTitleBar({ window: win, containerRef }: WindowTitleBarProps) {
  const { dispatch } = useWindowManager();
  const { onPointerDown, onPointerMove, onPointerUp, onDoubleClick } =
    useWindowDrag(win);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handler = () => {
      setIsFullscreen(document.fullscreenElement === containerRef.current);
    };
    document.addEventListener("fullscreenchange", handler);
    return () => document.removeEventListener("fullscreenchange", handler);
  }, [containerRef]);

  const toggleFullscreen = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        containerRef.current?.requestFullscreen();
      }
    },
    [containerRef]
  );

  return (
    <div
      className="flex h-9 shrink-0 items-center justify-between bg-card border-b border-border select-none"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onDoubleClick={onDoubleClick}
      style={{ touchAction: "none" }}
    >
      <div className="flex items-center gap-2 pl-3 min-w-0">
        <span className="text-xs font-medium truncate text-foreground">
          {win.title}
        </span>
      </div>
      <div className="flex items-center">
        <button
          className="flex h-9 w-10 items-center justify-center text-muted-foreground hover:bg-muted transition-colors"
          onClick={toggleFullscreen}
          title={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
        >
          {isFullscreen ? (
            <Minimize2 className="h-3.5 w-3.5" />
          ) : (
            <Maximize2 className="h-3.5 w-3.5" />
          )}
        </button>
        <button
          className="flex h-9 w-10 items-center justify-center text-muted-foreground hover:bg-muted transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            dispatch({ type: "MINIMIZE", id: win.id });
          }}
        >
          <Minus className="h-3.5 w-3.5" />
        </button>
        <button
          className="flex h-9 w-10 items-center justify-center text-muted-foreground hover:bg-muted transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            if (win.maximized) {
              dispatch({ type: "RESTORE", id: win.id });
            } else {
              dispatch({ type: "MAXIMIZE", id: win.id });
            }
          }}
        >
          {win.maximized ? (
            <Copy className="h-3 w-3" />
          ) : (
            <Square className="h-3 w-3" />
          )}
        </button>
        <button
          className="flex h-9 w-10 items-center justify-center text-muted-foreground hover:bg-destructive hover:text-white transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            dispatch({ type: "CLOSE", id: win.id });
          }}
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
