"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

type Props = {
  onClose: () => void;
  onActivated: () => void;
};

const TIERS = [
  { label: "Free (no balance)",     requests: "50 req/day",   rpm: "20 req/min", note: "Good for testing",             highlight: false },
  { label: "Comfort (10+ credits)", requests: "1000 req/day", rpm: "20 req/min", note: "Recommended for daily use",    highlight: true  },
  { label: "Pay-as-you-go",         requests: "Unlimited",    rpm: "No limit",   note: "Paid models available",        highlight: false },
];

export function OpenCodeKeyDialog({ onClose, onActivated }: Props) {
  const [key, setKey]       = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error" | "invalid">("idle");

  async function handleSubmit() {
    const trimmed = key.trim();
    if (!trimmed.startsWith("sk-or-")) { setStatus("invalid"); return; }
    setStatus("loading");
    try {
      const res = await fetch("/api/config/openrouter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: trimmed }),
      });
      if (res.ok) { setStatus("success"); setTimeout(() => onActivated(), 1500); }
      else setStatus("error");
    } catch { setStatus("error"); }
  }

  return (
    <div
      style={{ position: "fixed", inset: 0, zIndex: 99999, pointerEvents: "auto" }}
      className="flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-background border border-border rounded-xl shadow-2xl flex flex-col gap-0 w-full max-w-[480px] overflow-hidden">

        <div className="px-5 pt-5 pb-4 border-b border-border">
          <p className="text-sm font-semibold text-foreground">Connect Open Code via OpenRouter</p>
          <p className="text-xs text-muted-foreground mt-1">Access 300+ AI models including 25+ free ones. No subscription — pay only what you use.</p>
        </div>

        <div className="px-5 py-4 border-b border-border">
          <div className="rounded-md border border-border overflow-hidden text-[11px]">
            <div className="grid grid-cols-4 bg-muted/50 px-3 py-1.5 font-medium text-muted-foreground">
              <span>Plan</span><span>Requests/day</span><span>Req/min</span><span></span>
            </div>
            {TIERS.map((tier, i) => (
              <div key={i} className={`grid grid-cols-4 px-3 py-2 border-t border-border ${tier.highlight ? "bg-primary/5" : ""}`}>
                <span className="font-medium text-foreground">{tier.label}</span>
                <span className={tier.highlight ? "text-primary font-medium" : "text-foreground"}>{tier.requests}</span>
                <span className="text-muted-foreground">{tier.rpm}</span>
                <span className="text-muted-foreground text-[10px]">{tier.note}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="px-5 py-4 border-b border-border flex flex-col gap-2">
          <p className="text-[11px] text-foreground">Free models include: DeepSeek R1, Llama 3.3 70B, Qwen, Mistral and more.</p>
          <p className="text-[11px] text-muted-foreground">⚠ Free models may have variable availability. Not recommended for production.</p>
          <p className="text-[11px] text-muted-foreground bg-muted/50 rounded-md px-3 py-2 leading-relaxed">
            For regular coding sessions, adding 10+ credits is recommended — it raises the daily limit from 50 to 1000 requests while keeping free model costs at zero.
          </p>
        </div>

        <div className="px-5 py-4 flex flex-col gap-3">
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-foreground">OpenRouter API Key</label>
              <a href="https://openrouter.ai/workspaces/default/keys" target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[11px] text-primary hover:underline">
                Get free key <ExternalLink size={10} />
              </a>
            </div>
            <input
              type="password"
              value={key}
              onChange={(e) => { setKey(e.target.value); setStatus("idle"); }}
              onKeyDown={(e) => { if (e.key === "Enter") handleSubmit(); }}
              placeholder="sk-or-..."
              autoFocus
              className="h-8 rounded-md border border-border bg-background px-3 text-xs font-mono text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-primary"
            />
            {status === "invalid" && <p className="text-[11px] text-destructive">Key must start with sk-or-</p>}
            {status === "error"   && <p className="text-[11px] text-destructive">Failed to save. Try again.</p>}
            {status === "success" && <p className="text-[11px] text-green-500">Key saved. Restart bridge to apply.</p>}
          </div>
          <div className="flex gap-2 justify-end">
            <Button variant="outline" size="sm" className="h-7 text-xs" onClick={onClose} disabled={status === "loading"}>Cancel</Button>
            <Button size="sm" className="h-7 text-xs" onClick={handleSubmit} disabled={status === "loading" || status === "success"}>
              {status === "loading" ? "…" : "Save & activate"}
            </Button>
          </div>
        </div>

      </div>
    </div>
  );
}
