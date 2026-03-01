import { useRef, type ReactNode } from "react";
import type { WindowState } from "../../types/window";
import { useWindowManager } from "../../context/window-manager-context";
import { useWindowResize, RESIZE_EDGES } from "../../hooks/use-window-resize";
import { WindowTitleBar } from "./window-title-bar";
import { TASKBAR_HEIGHT } from "../../lib/os-constants";
import { cn } from "@/lib/utils";

interface WindowFrameProps {
  window: WindowState;
  children: ReactNode;
}

export function WindowFrame({ window: win, children }: WindowFrameProps) {
  const { dispatch } = useWindowManager();
  const { onResizeStart, onResizeMove, onResizeEnd } = useWindowResize(win);
  const containerRef = useRef<HTMLDivElement>(null);

  const style: React.CSSProperties = win.minimized
    ? { position: "absolute", left: 0, top: 0, width: 0, height: 0, overflow: "hidden", pointerEvents: "none", opacity: 0 }
    : win.maximized
      ? { position: "absolute", top: 0, left: 0, right: 0, bottom: TASKBAR_HEIGHT, zIndex: win.zIndex }
      : {
          position: "absolute",
          left: 0,
          top: 0,
          transform: `translate3d(${win.bounds.x}px, ${win.bounds.y}px, 0)`,
          width: win.bounds.width,
          height: win.bounds.height,
          zIndex: win.zIndex,
        };

  return (
    <div
      ref={containerRef}
      style={style}
      className={cn(
        "flex flex-col rounded-lg border border-border bg-card shadow-xl overflow-hidden",
        win.maximized && "rounded-none"
      )}
      onPointerDown={() => dispatch({ type: "FOCUS", id: win.id })}
    >
      <WindowTitleBar window={win} containerRef={containerRef} />
      <div className="flex-1 overflow-hidden">{children}</div>

      {/* Resize handles */}
      {!win.maximized &&
        RESIZE_EDGES.map(({ edge, className, cursor }) => (
          <div
            key={edge}
            className={className}
            style={{ cursor, zIndex: 50 }}
            onPointerDown={(e) => onResizeStart(edge as any, e)}
            onPointerMove={onResizeMove}
            onPointerUp={onResizeEnd}
          />
        ))}
    </div>
  );
}
