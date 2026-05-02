"use client";

import { useEffect, useImperativeHandle, useRef, useState, forwardRef } from "react";
import { Copy, Check, Eraser } from "lucide-react";

const ANSI_CSI = /\x1b\[[0-?]*[ -/]*[@-~]/g;
const ANSI_OSC = /\x1b\][^\x07\x1b]*(?:\x07|\x1b\\)/g;
const ANSI_OTHER_ESC = /\x1b[=>NOPVWXYZ\\\]^_]/g;

function stripAnsi(s: string): string {
  return s.replace(ANSI_OSC, "").replace(ANSI_CSI, "").replace(ANSI_OTHER_ESC, "");
}

export type TerminalOutputPaneHandle = {
  append: (chunk: string) => void;
  clear: () => void;
};

type Props = {
  maxLines?: number;
  className?: string;
  style?: React.CSSProperties;
};

export const TerminalOutputPane = forwardRef<TerminalOutputPaneHandle, Props>(
  function TerminalOutputPane({ maxLines = 200, className, style }, ref) {
    const [lines, setLines] = useState<string[]>([]);
    const [copied, setCopied] = useState(false);
    const [pinnedToBottom, setPinnedToBottom] = useState(true);
    const pinnedRef = useRef(true);
    const pendingRef = useRef<string>("");
    const flushTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const scrollRef = useRef<HTMLDivElement>(null);

    function flush() {
      flushTimerRef.current = null;
      const buffered = pendingRef.current;
      if (!buffered) return;
      pendingRef.current = "";

      setLines((prev) => {
        const stripped = stripAnsi(buffered);
        const lastIdx = prev.length - 1;
        const lastLine = lastIdx >= 0 ? prev[lastIdx] : "";
        const merged = (lastLine + stripped).split(/\r?\n/);
        const next = prev.slice(0, lastIdx).concat(merged);
        const overflow = next.length - maxLines;
        return overflow > 0 ? next.slice(overflow) : next;
      });
    }

    function append(chunk: string) {
      if (!chunk) return;
      const cleaned = chunk.replace(/\r(?!\n)/g, "");
      pendingRef.current += cleaned;
      if (flushTimerRef.current) return;
      flushTimerRef.current = setTimeout(flush, 50);
    }

    function clear() {
      pendingRef.current = "";
      if (flushTimerRef.current) {
        clearTimeout(flushTimerRef.current);
        flushTimerRef.current = null;
      }
      setLines([]);
    }

    useImperativeHandle(ref, () => ({ append, clear }), []);

    useEffect(() => () => {
      if (flushTimerRef.current) clearTimeout(flushTimerRef.current);
    }, []);

    useEffect(() => {
      if (!pinnedRef.current) return;
      const el = scrollRef.current;
      if (!el) return;
      el.scrollTop = el.scrollHeight;
    }, [lines]);

    function handleScroll() {
      const el = scrollRef.current;
      if (!el) return;
      const dist = el.scrollHeight - el.clientHeight - el.scrollTop;
      const isPinned = dist < 24;
      pinnedRef.current = isPinned;
      setPinnedToBottom(isPinned);
    }

    function jumpToBottom() {
      const el = scrollRef.current;
      if (!el) return;
      el.scrollTop = el.scrollHeight;
      pinnedRef.current = true;
      setPinnedToBottom(true);
    }

    async function handleCopyAll() {
      try {
        await navigator.clipboard.writeText(lines.join("\n"));
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      } catch {
        // clipboard may be unavailable (insecure context); silent fail
      }
    }

    return (
      <div
        className={className}
        style={{
          display: "flex",
          flexDirection: "column",
          background: "#09090b",
          color: "#e4e4e7",
          fontFamily: 'ui-monospace, "Cascadia Code", "Source Code Pro", Menlo, monospace',
          fontSize: 12,
          minHeight: 0,
          ...style,
        }}
      >
        <div
          className="flex items-center justify-between border-b border-border bg-background px-2 shrink-0"
          style={{ height: 28 }}
        >
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground select-none">
            Output · last {maxLines}
          </span>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={clear}
              title="Clear output"
              className="inline-flex items-center gap-1 h-5 px-1.5 rounded text-[10px] text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              <Eraser size={10} />
            </button>
            <button
              type="button"
              onClick={handleCopyAll}
              title="Copy all output"
              className="inline-flex items-center gap-1 h-5 px-1.5 rounded text-[10px] text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              {copied ? (
                <>
                  <Check size={10} className="text-green-400" />
                  Copied
                </>
              ) : (
                <>
                  <Copy size={10} />
                  Copy all
                </>
              )}
            </button>
          </div>
        </div>

        <div
          ref={scrollRef}
          onScroll={handleScroll}
          style={{
            flex: 1,
            overflowY: "auto",
            overflowX: "hidden",
            padding: "6px 8px",
            userSelect: "text",
            WebkitUserSelect: "text",
            position: "relative",
          }}
        >
          <pre
            style={{
              margin: 0,
              whiteSpace: "pre-wrap",
              wordBreak: "break-all",
              fontFamily: "inherit",
              fontSize: "inherit",
              lineHeight: 1.4,
              userSelect: "text",
              WebkitUserSelect: "text",
            }}
          >
            {lines.join("\n")}
          </pre>

          {!pinnedToBottom && (
            <button
              type="button"
              onClick={jumpToBottom}
              className="absolute right-2 bottom-2 h-6 px-2 rounded-full text-[10px] bg-primary text-primary-foreground shadow-md hover:opacity-90 transition-opacity"
            >
              ↓ Jump to latest
            </button>
          )}
        </div>
      </div>
    );
  }
);
