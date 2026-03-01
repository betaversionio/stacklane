import { useState, useRef, useCallback } from "react";
import { ArrowLeft, ArrowRight, RotateCw, Loader2 } from "lucide-react";
import { tunnelApi } from "@/features/tunnel/api";

const DEFAULT_URL = "http://localhost:3000";

interface BrowserAppProps {
  connectionId: string;
}

function ensureProtocol(url: string) {
  const trimmed = url.trim();
  if (!trimmed) return DEFAULT_URL;
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `http://${trimmed}`;
}

function parseHostPort(url: string): { host: string; port: number } | null {
  try {
    const parsed = new URL(url);
    const host = parsed.hostname;
    const port = parsed.port
      ? parseInt(parsed.port, 10)
      : parsed.protocol === "https:" ? 443 : 80;
    return { host, port };
  } catch {
    return null;
  }
}

interface HistoryEntry {
  displayUrl: string;
  iframeSrc: string;
}

export function BrowserApp({ connectionId }: BrowserAppProps) {
  const [inputUrl, setInputUrl] = useState(DEFAULT_URL);
  const [current, setCurrent] = useState<HistoryEntry | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const canGoBack = historyIndex > 0;
  const canGoForward = historyIndex < history.length - 1;

  const navigateTo = useCallback(
    async (rawUrl: string) => {
      const url = ensureProtocol(rawUrl);
      setInputUrl(url);
      setLoading(true);
      setError(null);

      const target = parseHostPort(url);
      if (!target) {
        setError("Invalid URL");
        setLoading(false);
        return;
      }

      const res = await tunnelApi.create(connectionId, target.host, target.port);
      if (!res.success || !res.data) {
        setError(res.success ? "Empty response" : res.error ?? "Failed to create tunnel");
        setLoading(false);
        return;
      }

      // Build the tunneled URL: keep path/query/hash from original, replace origin with tunnel
      const parsed = new URL(url);
      const tunnelOrigin = `http://localhost:${res.data.localPort}`;
      const iframeSrc = `${tunnelOrigin}${parsed.pathname}${parsed.search}${parsed.hash}`;

      const entry: HistoryEntry = { displayUrl: url, iframeSrc };
      setCurrent(entry);

      const next = history.slice(0, historyIndex + 1);
      next.push(entry);
      setHistory(next);
      setHistoryIndex(next.length - 1);
    },
    [connectionId, history, historyIndex]
  );

  const goBack = () => {
    if (!canGoBack) return;
    const i = historyIndex - 1;
    setHistoryIndex(i);
    setCurrent(history[i]);
    setInputUrl(history[i].displayUrl);
    setLoading(true);
  };

  const goForward = () => {
    if (!canGoForward) return;
    const i = historyIndex + 1;
    setHistoryIndex(i);
    setCurrent(history[i]);
    setInputUrl(history[i].displayUrl);
    setLoading(true);
  };

  const refresh = () => {
    if (!current) return;
    setLoading(true);
    if (iframeRef.current) {
      iframeRef.current.src = current.iframeSrc;
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      navigateTo(inputUrl);
    }
  };

  return (
    <div className="flex h-full flex-col bg-card">
      {/* Toolbar */}
      <div className="flex items-center gap-1.5 border-b border-border px-2 py-1.5">
        <button
          onClick={goBack}
          disabled={!canGoBack}
          className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-muted-foreground transition-colors"
          title="Back"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <button
          onClick={goForward}
          disabled={!canGoForward}
          className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-muted-foreground transition-colors"
          title="Forward"
        >
          <ArrowRight className="h-4 w-4" />
        </button>
        <button
          onClick={refresh}
          disabled={!current}
          className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground disabled:opacity-30 transition-colors"
          title="Refresh"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <RotateCw className="h-4 w-4" />
          )}
        </button>

        {/* Address bar */}
        <input
          type="text"
          value={inputUrl}
          onChange={(e) => setInputUrl(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Enter URL on remote server (e.g. http://localhost:3000)"
          className="flex-1 rounded-md border border-border bg-background px-3 py-1 text-xs font-mono text-foreground outline-none focus:border-primary focus:ring-1 focus:ring-primary/30"
          spellCheck={false}
        />
      </div>

      {/* Content area */}
      <div className="relative flex-1">
        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-card">
            <div className="text-center">
              <p className="text-sm text-destructive mb-2">{error}</p>
              <p className="text-xs text-muted-foreground">
                Make sure the service is running on the remote server.
              </p>
            </div>
          </div>
        )}

        {!current && !error && (
          <div className="absolute inset-0 flex items-center justify-center bg-card">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-1">
                Remote Browser
              </p>
              <p className="text-xs text-muted-foreground/70">
                Enter a URL and press Enter to browse via the remote server.
              </p>
              <p className="text-xs text-muted-foreground/70 mt-0.5">
                Traffic is tunneled through SSH — access localhost services on the remote machine.
              </p>
            </div>
          </div>
        )}

        {current && (
          <iframe
            ref={iframeRef}
            src={current.iframeSrc}
            className="absolute inset-0 h-full w-full border-none bg-white"
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
            onLoad={() => setLoading(false)}
            title="Browser"
          />
        )}
      </div>
    </div>
  );
}
