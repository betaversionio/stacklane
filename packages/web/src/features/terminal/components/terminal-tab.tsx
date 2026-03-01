import { useRef, useState, useEffect, useCallback } from "react";
import {
  Maximize,
  Minimize,
  Settings2,
  ChevronDown,
  Minus,
  Plus,
  X,
} from "lucide-react";
import { useTerminal } from "../hooks/use-terminal";
import { useTerminalSettings } from "../hooks/use-terminal-settings";
import {
  terminalThemes,
  terminalThemesMap,
  fontFamilyOptions,
  fontSizeOptions,
} from "../terminal-themes";
import type { TerminalThemeDefinition } from "../terminal-themes";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";

interface TerminalTabProps {
  connectionId: string;
}

/* ── Mini terminal preview for theme cards ── */
function ThemePreview({ theme }: { theme: TerminalThemeDefinition }) {
  const t = theme.theme;
  return (
    <div
      className="w-[72px] h-[48px] rounded-md border border-white/10 p-1.5 flex flex-col gap-1 shrink-0"
      style={{ background: t.background }}
    >
      {/* Fake terminal lines */}
      <div className="flex gap-0.5 items-center">
        <span className="h-[3px] w-3 rounded-full" style={{ background: t.green }} />
        <span className="h-[3px] w-5 rounded-full" style={{ background: t.foreground, opacity: 0.5 }} />
      </div>
      <div className="flex gap-0.5 items-center">
        <span className="h-[3px] w-4 rounded-full" style={{ background: t.blue }} />
        <span className="h-[3px] w-2 rounded-full" style={{ background: t.yellow }} />
        <span className="h-[3px] w-3 rounded-full" style={{ background: t.foreground, opacity: 0.4 }} />
      </div>
      <div className="flex gap-0.5 items-center">
        <span className="h-[3px] w-2 rounded-full" style={{ background: t.magenta }} />
        <span className="h-[3px] w-2 rounded-full" style={{ background: t.red }} />
        <span className="h-[3px] w-4 rounded-full" style={{ background: t.cyan }} />
      </div>
    </div>
  );
}

export function TerminalTab({ connectionId }: TerminalTabProps) {
  const { settings, setFontFamily, setFontSize, setThemeName } =
    useTerminalSettings();
  const { containerRef } = useTerminal(connectionId, settings);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);
  const [fontOpen, setFontOpen] = useState(false);

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;

    const onFsChange = () => {
      setIsFullscreen(document.fullscreenElement === el);
    };

    el.addEventListener("fullscreenchange", onFsChange);
    return () => el.removeEventListener("fullscreenchange", onFsChange);
  }, []);

  const toggleFullscreen = useCallback(() => {
    const el = wrapperRef.current;
    if (!el) return;
    if (document.fullscreenElement === el) {
      document.exitFullscreen();
    } else {
      el.requestFullscreen();
    }
  }, []);

  const decrementSize = useCallback(() => {
    const idx = fontSizeOptions.indexOf(settings.fontSize);
    if (idx > 0) setFontSize(fontSizeOptions[idx - 1]);
  }, [settings.fontSize, setFontSize]);

  const incrementSize = useCallback(() => {
    const idx = fontSizeOptions.indexOf(settings.fontSize);
    if (idx < fontSizeOptions.length - 1) setFontSize(fontSizeOptions[idx + 1]);
  }, [settings.fontSize, setFontSize]);

  const activeTheme = terminalThemesMap.get(settings.themeName);
  const bgColor = activeTheme?.theme.background ?? "#09090b";

  return (
    <div
      ref={wrapperRef}
      className="relative flex flex-col h-full min-h-[400px]"
      style={isFullscreen ? { background: bgColor } : undefined}
    >
      {/* Toolbar */}
      <header className="flex items-center justify-between px-3 py-1.5 border border-border rounded-t-lg bg-card shrink-0">
        <div />
        <div className="flex items-center gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => setPanelOpen((v) => !v)}
              >
                <Settings2 className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Appearance</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={toggleFullscreen}
              >
                {isFullscreen ? (
                  <Minimize className="h-4 w-4" />
                ) : (
                  <Maximize className="h-4 w-4" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {isFullscreen ? "Exit fullscreen" : "Fullscreen"}
            </TooltipContent>
          </Tooltip>
        </div>
      </header>

      {/* Terminal */}
      <div
        ref={containerRef}
        className="flex-1 overflow-hidden p-2"
        style={{ background: bgColor }}
      />

      {/* Overlay backdrop */}
      {panelOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 transition-opacity"
          onClick={() => setPanelOpen(false)}
        />
      )}

      {/* Appearance panel — fixed, full-height, slides from right */}
      <div
        className={`fixed top-0 right-0 z-50 h-full w-[360px] border-l border-border bg-background transition-transform duration-300 ease-in-out ${
          panelOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col">
          {/* Panel header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-border">
            <span className="text-sm font-medium">Appearance</span>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => setPanelOpen(false)}
            >
              <X className="h-3.5 w-3.5" />
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto">
            {/* Font — collapsible accordion with font family + text size */}
            <div className="border-b border-border">
              <button
                type="button"
                onClick={() => setFontOpen((v) => !v)}
                className="flex w-full items-center justify-between px-4 py-3 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Font
                <ChevronDown
                  className={`h-4 w-4 transition-transform duration-200 ${fontOpen ? "rotate-180" : ""}`}
                />
              </button>
              <div
                className="grid transition-[grid-template-rows] duration-200 ease-in-out"
                style={{
                  gridTemplateRows: fontOpen ? "1fr" : "0fr",
                }}
              >
                <div className="overflow-hidden">
                  <div className="space-y-3 px-4 pb-4">
                    {/* Font family */}
                    <Select
                      value={settings.fontFamily}
                      onValueChange={setFontFamily}
                    >
                      <SelectTrigger className="h-9 text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {fontFamilyOptions.map((f) => (
                          <SelectItem key={f.value} value={f.value}>
                            {f.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    {/* Text size stepper */}
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Text Size</span>
                      <div className="flex items-center">
                        <Button
                          variant="outline"
                          size="icon-sm"
                          className="rounded-r-none"
                          onClick={decrementSize}
                          disabled={settings.fontSize <= fontSizeOptions[0]}
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </Button>
                        <div className="flex h-7 w-10 items-center justify-center border-y border-input text-sm">
                          {settings.fontSize}
                        </div>
                        <Button
                          variant="outline"
                          size="icon-sm"
                          className="rounded-l-none"
                          onClick={incrementSize}
                          disabled={
                            settings.fontSize >=
                            fontSizeOptions[fontSizeOptions.length - 1]
                          }
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Themes — card list */}
            <div className="px-4 py-3">
              <span className="text-sm text-muted-foreground">Themes</span>
              <div className="mt-3 space-y-2">
                {terminalThemes.map((t) => {
                  const isActive = t.id === settings.themeName;
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setThemeName(t.id)}
                      className={`flex w-full items-center gap-3 rounded-lg p-2 text-left transition-colors ${
                        isActive
                          ? "ring-2 ring-primary bg-primary/5"
                          : "hover:bg-accent"
                      }`}
                    >
                      <ThemePreview theme={t} />
                      <span
                        className={`text-sm ${isActive ? "text-primary font-medium" : "text-foreground"}`}
                      >
                        {t.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
