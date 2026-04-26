'use client';

import { createContext, useContext, useEffect, useRef } from 'react';
import { Copy, Trash2 } from 'lucide-react';

// ── ANSI parser ──────────────────────────────────────────────────────────────

const ANSI_COLOR_MAP: Record<string, string> = {
  '30': 'text-zinc-700',
  '31': 'text-red-400',
  '32': 'text-green-400',
  '33': 'text-yellow-400',
  '34': 'text-blue-400',
  '35': 'text-purple-400',
  '36': 'text-cyan-400',
  '37': 'text-zinc-300',
  '90': 'text-zinc-500',
};

function parseAnsi(text: string): React.ReactNode[] {
  const nodes: React.ReactNode[] = [];
  const parts = text.split('\u001B[');
  let bold = false;

  parts.forEach((part, i) => {
    if (i === 0) {
      if (part) nodes.push(<span key={i}>{part}</span>);
      return;
    }
    const m = part.match(/^([\d;]*)m([\s\S]*)/);
    if (!m) {
      nodes.push(<span key={i}>{part}</span>);
      return;
    }
    const codes = m[1].split(';');
    const content = m[2];
    let colorCls = '';
    for (const code of codes) {
      if (code === '0') { bold = false; colorCls = ''; }
      else if (code === '1') { bold = true; }
      else if (ANSI_COLOR_MAP[code]) { colorCls = ANSI_COLOR_MAP[code]; }
    }
    const cls = [colorCls, bold ? 'font-bold' : ''].filter(Boolean).join(' ');
    nodes.push(<span key={i} className={cls || undefined}>{content}</span>);
  });

  return nodes;
}

// ── Context ───────────────────────────────────────────────────────────────────

type TerminalCtx = {
  output: string;
  isStreaming: boolean;
  autoScroll: boolean;
  onClear: () => void;
};

const Ctx = createContext<TerminalCtx>({
  output: '',
  isStreaming: false,
  autoScroll: true,
  onClear: () => {},
});

// ── Terminal (root) ───────────────────────────────────────────────────────────

type TerminalProps = {
  children: React.ReactNode;
  output: string;
  isStreaming: boolean;
  autoScroll?: boolean;
  onClear: () => void;
  className?: string;
};

export function Terminal({ children, output, isStreaming, autoScroll = true, onClear, className }: TerminalProps) {
  return (
    <Ctx.Provider value={{ output, isStreaming, autoScroll, onClear }}>
      <div className={`flex flex-col bg-zinc-950 font-mono text-xs text-zinc-300 ${className ?? ''}`}>
        {children}
      </div>
    </Ctx.Provider>
  );
}

// ── TerminalHeader ────────────────────────────────────────────────────────────

export function TerminalHeader({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between px-3 py-1.5 border-b border-zinc-800 shrink-0">
      {children}
    </div>
  );
}

// ── TerminalTitle ─────────────────────────────────────────────────────────────

export function TerminalTitle({ children }: { children: React.ReactNode }) {
  return <span className="text-zinc-400 text-[11px] font-medium">{children}</span>;
}

// ── TerminalActions ───────────────────────────────────────────────────────────

export function TerminalActions({ children }: { children: React.ReactNode }) {
  return <div className="flex items-center gap-0.5">{children}</div>;
}

// ── TerminalStatus ────────────────────────────────────────────────────────────

export function TerminalStatus() {
  const { isStreaming } = useContext(Ctx);
  return (
    <span
      className={`inline-block w-1.5 h-1.5 rounded-full mr-1 ${isStreaming ? 'bg-green-400' : 'bg-zinc-600'}`}
    />
  );
}

// ── TerminalCopyButton ────────────────────────────────────────────────────────

export function TerminalCopyButton({ onCopy }: { onCopy: () => void }) {
  const { output } = useContext(Ctx);
  const handleCopy = () => {
    navigator.clipboard.writeText(output).catch(() => {});
    onCopy();
  };
  return (
    <button
      type="button"
      onClick={handleCopy}
      className="p-1 text-zinc-500 hover:text-zinc-300 transition-colors rounded"
      aria-label="Copy output"
    >
      <Copy className="size-3" />
    </button>
  );
}

// ── TerminalClearButton ───────────────────────────────────────────────────────

export function TerminalClearButton() {
  const { onClear } = useContext(Ctx);
  return (
    <button
      type="button"
      onClick={onClear}
      className="p-1 text-zinc-500 hover:text-zinc-300 transition-colors rounded"
      aria-label="Clear terminal"
    >
      <Trash2 className="size-3" />
    </button>
  );
}

// ── TerminalContent ───────────────────────────────────────────────────────────

export function TerminalContent() {
  const { output, isStreaming, autoScroll } = useContext(Ctx);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (autoScroll && ref.current) {
      ref.current.scrollTop = ref.current.scrollHeight;
    }
  }, [output, autoScroll]);

  return (
    <div ref={ref} className="flex-1 overflow-y-auto p-3 whitespace-pre-wrap leading-relaxed min-h-0">
      {parseAnsi(output)}
      {isStreaming && <span className="animate-pulse text-green-400">▋</span>}
    </div>
  );
}
