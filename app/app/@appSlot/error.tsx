'use client';

import { useState } from "react";
import { Copy, Check, RotateCcw, Terminal } from "lucide-react";

const RECOVERY_CMD = 'git checkout HEAD -- "app/[lang]/@appSlot/page.tsx"';

export default function CenterError({ error, reset }: { error: Error; reset: () => void }) {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText(RECOVERY_CMD).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div className="flex flex-col items-center justify-center gap-6 p-8 text-center">

      <div className="flex flex-col items-center gap-2 max-w-md">
        <p className="text-sm font-medium text-foreground">Something went wrong</p>
        <p className="text-xs text-muted-foreground">The main slot crashed. Code Workspace is still available.</p>
        <code className="mt-1 text-[11px] text-destructive bg-destructive/10 px-3 py-1.5 rounded font-mono max-w-full break-all">
          {error.message}
        </code>
      </div>

      <button
        onClick={reset}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded border border-border text-xs hover:bg-muted transition-colors"
      >
        <RotateCcw size={12} />
        Try again
      </button>

      <div className="flex flex-col items-start gap-2 w-full max-w-md">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Terminal size={12} />
          <span className="font-medium text-foreground">Recovery command</span>
        </div>
        <p className="text-[11px] text-muted-foreground text-left">Run this in the terminal to restore the page from git:</p>
        <div className="flex items-center gap-2 w-full rounded-md border border-border bg-muted px-3 py-2">
          <code className="flex-1 text-[11px] font-mono text-foreground break-all text-left">
            {RECOVERY_CMD}
          </code>
          <button
            type="button"
            onClick={handleCopy}
            className="shrink-0 inline-flex items-center gap-1 text-[10px] text-muted-foreground hover:text-foreground transition-colors"
          >
            {copied
              ? <><Check size={11} className="text-green-500" /><span className="text-green-500">Copied!</span></>
              : <><Copy size={11} /><span>Copy</span></>
            }
          </button>
        </div>
      </div>

    </div>
  );
}
