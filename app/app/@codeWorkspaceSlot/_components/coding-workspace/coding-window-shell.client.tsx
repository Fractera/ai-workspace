"use client";

import React, { useState, useEffect, useRef } from "react";
import { Wifi, WifiOff, Loader2, ChevronLeft, ChevronRight, Store, Settings, Download, Upload, RefreshCw, Info, Zap, ImagePlus, Database } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { XtermTerminal } from "@/components/ai-elements/xterm-terminal.client";
import { Shimmer } from "@/components/ai-elements/shimmer.client";
import { PLATFORMS, COMING_SOON, type Platform, type TerminalStatus } from "./platforms";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { OpenCodeKeyDialog } from "./opencode-key-dialog.client";
import { EnvEditorPanel } from "./env-editor-panel.client";
import { MediaLibraryPanel } from "./media-library-panel.client";
import { DbBrowserPanel } from "./db-browser-panel.client";

const CAROUSEL_H = 52;
const FOOTER_H   = 36;
const CARD_W     = 112;
const GAP        = 8;

const BRIDGE_TOOLTIP = "Bridge — all platform servers status\n\nOne process runs all platforms:\nClaude Code :3200 · PTY :3201\nCodex :3202 · Gemini :3203\nQwen :3204 · Kimi :3205 · OpenCode :3206\n\n🟢 Online — all platforms available\n🔴 Offline — bridge server not running\n\nTo start: cd bridges/platforms && node server.js";


const PTY_URL      = process.env.NEXT_PUBLIC_PTY_URL      ?? "ws://localhost:3201";
const BRIDGE_URL   = process.env.NEXT_PUBLIC_BRIDGE_URL   ?? "ws://localhost:3200";
const OPENCODE_URL = process.env.NEXT_PUBLIC_OPENCODE_URL ?? "ws://localhost:3206";

function TerminalDot({ status }: { status: TerminalStatus }) {
  if (status === "unavailable") return <span className="size-1.5 rounded-full bg-muted-foreground/40 shrink-0" />;
  if (status === "connecting")  return <span className="size-1.5 rounded-full bg-orange-400 animate-pulse shrink-0" />;
  if (status === "connected")   return <span className="size-1.5 rounded-full bg-green-500 shrink-0" />;
  return null;
}

type Props = {
  height: number;
  terminalPlatform: Platform;
  terminalSessions: Set<Platform>;
  onPlatformClick: (p: Platform) => void;
  onTerminalClose: (p: Platform) => void;
  windowWidth: number;
  isMobile?: boolean;
};

export function CodingWindowShell({ height, terminalPlatform, terminalSessions, onPlatformClick, onTerminalClose, windowWidth, isMobile = false }: Props) {
  const [terminalStatuses] = useState<Record<Platform, TerminalStatus>>({
    "claude-code": "unavailable", "codex": "unavailable", "gemini-cli": "unavailable",
    "open-code": "unavailable", "qwen-code": "unavailable", "kimi-code": "unavailable",
  });
  const [bridgeStatus, setBridgeStatus]     = useState<"unknown" | "online" | "offline">("unknown");
  const [openCodeReady, setOpenCodeReady]   = useState<boolean | null>(null);
  const [openCodeDialog, setOpenCodeDialog] = useState(false);
  const [carouselIdx, setCarouselIdx]       = useState(0);
  const [confirmingPlatform, setConfirmingPlatform] = useState<Platform | null>(null);
  const [dataMenuOpen, setDataMenuOpen]             = useState(false);
  const [importing, setImporting]                   = useState(false);
  const [updateAvailable, setUpdateAvailable]       = useState(false);
  const [updateCount, setUpdateCount]               = useState(0);
  const [updating, setUpdating]                     = useState(false);
  const [updateLog, setUpdateLog]                   = useState<string[]>([]);
  const [showUpdateLog, setShowUpdateLog]           = useState(false);
  const [showInfo, setShowInfo]                     = useState(false);
  const [readmeContent, setReadmeContent]           = useState<string | null>(null);
  const [showEnvEditor, setShowEnvEditor]           = useState(false);
  const [showMediaLibrary, setShowMediaLibrary]     = useState(false);
  const [showDbBrowser, setShowDbBrowser]           = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const GITHUB_URL  = process.env.NEXT_PUBLIC_GITHUB_URL  ?? "";
  const PRO_URL     = process.env.NEXT_PUBLIC_PRO_URL     ?? "";
  const SKILLS_URL  = process.env.NEXT_PUBLIC_SKILLS_URL  ?? "";
  const APP_VERSION = process.env.NEXT_PUBLIC_APP_VERSION ?? "1.0.0";
  const countdownRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  async function handleExport() {
    setDataMenuOpen(false);
    const res = await fetch("/api/data/export");
    if (!res.ok) return;
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = res.headers.get("Content-Disposition")?.match(/filename="(.+)"/)?.[1] ?? "fractera-backup.zip";
    a.click();
    URL.revokeObjectURL(url);
  }

  async function handleImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImporting(true);
    setDataMenuOpen(false);
    const form = new FormData();
    form.append("file", file);
    await fetch("/api/data/import", { method: "POST", body: form });
    setImporting(false);
    e.target.value = "";
  }

  useEffect(() => {
    const ws = new WebSocket(OPENCODE_URL);
    const timer = setTimeout(() => { ws.close(); setOpenCodeReady(false); }, 3000);
    ws.onopen = () => ws.send(JSON.stringify({ type: "get_models" }));
    ws.onmessage = (e) => {
      try {
        const msg = JSON.parse(e.data);
        if (msg.type === "models") { setOpenCodeReady(msg.keyConfigured === true); clearTimeout(timer); ws.close(); }
      } catch { setOpenCodeReady(false); clearTimeout(timer); ws.close(); }
    };
    ws.onerror = () => { clearTimeout(timer); setOpenCodeReady(false); };
    return () => { clearTimeout(timer); try { ws.close(); } catch {} };
  }, []);

  useEffect(() => {
    const ws = new WebSocket(BRIDGE_URL);
    const timer = setTimeout(() => { ws.close(); setBridgeStatus("offline"); }, 3000);
    ws.onopen  = () => { clearTimeout(timer); ws.close(); setBridgeStatus("online"); };
    ws.onerror = () => { clearTimeout(timer); setBridgeStatus("offline"); };
    return () => { clearTimeout(timer); try { ws.close(); } catch {} };
  }, []);

  function handleCardClick(platformId: Platform) {
    const isRunning = terminalSessions.has(platformId);
    if (isRunning && terminalPlatform === platformId) {
      if (confirmingPlatform === platformId) {
        // Second click — cancel the countdown
        if (countdownRef.current) clearTimeout(countdownRef.current);
        countdownRef.current = null;
        setConfirmingPlatform(null);
      } else {
        // First click — start countdown, auto-close after 3s
        if (countdownRef.current) clearTimeout(countdownRef.current);
        setConfirmingPlatform(platformId);
        countdownRef.current = setTimeout(() => {
          onTerminalClose(platformId);
          setConfirmingPlatform(null);
          countdownRef.current = null;
        }, 2000);
      }
    } else if (isRunning) {
      if (countdownRef.current) clearTimeout(countdownRef.current);
      setConfirmingPlatform(null);
      onPlatformClick(platformId);
    } else {
      if (countdownRef.current) clearTimeout(countdownRef.current);
      setConfirmingPlatform(null);
      onPlatformClick(platformId);
    }
  }

  // Check for updates on mount (non-blocking)
  useEffect(() => {
    fetch("/api/update/status")
      .then((r) => r.json())
      .then((data) => {
        if (data.available) { setUpdateAvailable(true); setUpdateCount(data.count); }
      })
      .catch(() => {});
  }, []);

  async function handleUpdate() {
    setUpdating(true);
    setShowUpdateLog(true);
    setUpdateLog(["Starting update…"]);
    try {
      const res = await fetch("/api/update/run", { method: "POST" });
      const data = await res.json();
      setUpdateLog(data.log ?? []);
      if (data.ok) { setUpdateAvailable(false); setUpdateCount(0); }
    } catch {
      setUpdateLog(["Update failed — check server logs."]);
    }
    setUpdating(false);
  }

  async function handleInfo() {
    setShowEnvEditor(false);
    setShowDbBrowser(false);
    setShowMediaLibrary(false);
    setShowInfo((v) => !v);
    if (!readmeContent) {
      const res = await fetch("/api/readme");
      const data = await res.json();
      setReadmeContent(data.error ? `\n> ${data.message}` : (data.content ?? ""));
    }
  }

  useEffect(() => () => { if (countdownRef.current) clearTimeout(countdownRef.current); }, []);
  useEffect(() => {
    if (!dataMenuOpen) return;
    const close = (e: MouseEvent) => {
      const menu = document.getElementById("data-dropdown");
      if (menu && menu.contains(e.target as Node)) return;
      setDataMenuOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [dataMenuOpen]);

  const termH   = height - CAROUSEL_H - FOOTER_H - (isMobile ? 25 : 50);
  const total   = PLATFORMS.length + COMING_SOON.length;
  const safeIdx = Math.min(carouselIdx, Math.max(total - 1, 0));
  const canPrev = safeIdx > 0;
  const canNext = safeIdx < total - 1;

  return (
    <div style={{ position: "relative", height }}>
      <style>{`
        @keyframes countdown-shrink { from { transform: scaleX(1); } to { transform: scaleX(0); } }
        @keyframes countdown-color { 0% { background-color: rgb(34 197 94); } 60% { background-color: rgb(251 146 60); } 100% { background-color: rgb(239 68 68); } }
      `}</style>

      {/* ── Carousel ── */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: CAROUSEL_H }} className="border-b border-border bg-background flex items-center gap-2 px-2">
        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="shrink-0 flex items-center justify-center gap-1.5 rounded-md border border-border h-9 text-[11px] text-muted-foreground select-none px-2 cursor-help">
                {bridgeStatus === "online"  && <><Wifi size={12} className="text-green-500" />{!isMobile && <span className="text-green-500 font-medium">Bridge</span>}</>}
                {bridgeStatus === "offline" && <><WifiOff size={12} className="text-destructive" />{!isMobile && <span className="text-destructive">Offline</span>}</>}
                {bridgeStatus === "unknown" && <><Loader2 size={12} className="animate-spin" />{!isMobile && <span>Bridge…</span>}</>}
              </div>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="max-w-[220px] whitespace-pre-line text-[11px] leading-relaxed" style={{ zIndex: 99999 }}>
              {BRIDGE_TOOLTIP}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {/* Settings button */}
        <div className="relative shrink-0">
          <button
            type="button"
            onClick={() => setDataMenuOpen((v) => !v)}
            className="flex items-center justify-center gap-1.5 rounded-md border border-border h-9 text-[11px] text-muted-foreground hover:text-foreground hover:bg-muted select-none px-2 transition-colors"
          >
            {importing ? <Loader2 size={12} className="animate-spin" /> : <Settings size={12} />}
            {!isMobile && <span className="font-medium">Settings</span>}
          </button>
          {dataMenuOpen && (
            <div id="data-dropdown" style={{ position: "absolute", top: "calc(100% + 4px)", left: 0, zIndex: 99999 }}
              className="bg-background border border-border rounded-md shadow-lg overflow-hidden min-w-[160px]">
              <button type="button" onClick={() => { setDataMenuOpen(false); setShowMediaLibrary((v) => !v); setShowEnvEditor(false); setShowDbBrowser(false); setShowInfo(false); }}
                className="w-full flex items-center gap-2 px-3 py-2 text-[11px] text-foreground hover:bg-muted transition-colors">
                <ImagePlus size={11} />Upload media
              </button>
              <button type="button" onClick={() => { setDataMenuOpen(false); setShowDbBrowser((v) => !v); setShowEnvEditor(false); setShowMediaLibrary(false); setShowInfo(false); }}
                className="w-full flex items-center gap-2 px-3 py-2 text-[11px] text-foreground hover:bg-muted transition-colors">
                <Database size={11} />Database
              </button>
              <div className="h-px bg-border mx-2" />
              <button type="button" onClick={() => { setDataMenuOpen(false); setShowEnvEditor((v) => !v); setShowInfo(false); setShowDbBrowser(false); }}
                className="w-full flex items-center gap-2 px-3 py-2 text-[11px] text-foreground hover:bg-muted transition-colors">
                <Settings size={11} />Configure
              </button>
              <div className="h-px bg-border mx-2" />
              <button type="button" onClick={handleExport}
                className="w-full flex items-center gap-2 px-3 py-2 text-[11px] text-foreground hover:bg-muted transition-colors">
                <Download size={11} />Export data
              </button>
              <button type="button" onClick={() => { setDataMenuOpen(false); fileInputRef.current?.click(); }}
                className="w-full flex items-center gap-2 px-3 py-2 text-[11px] text-foreground hover:bg-muted transition-colors">
                <Upload size={11} />Import data
              </button>
              <div className="h-px bg-border mx-2" />
              <div className="px-3 py-2 flex flex-col gap-1">
                <span className="text-[10px] font-medium text-muted-foreground">Help</span>
                <p className="text-[10px] text-muted-foreground leading-relaxed">🖼 <strong className="text-foreground">Upload media</strong> — upload images and files to storage.</p>
                <p className="text-[10px] text-muted-foreground leading-relaxed">⚙ <strong className="text-foreground">Configure</strong> — edit environment variables.</p>
                <p className="text-[10px] text-muted-foreground leading-relaxed">⬇ <strong className="text-foreground">Export</strong> — downloads a zip with your database and storage files.</p>
                <p className="text-[10px] text-muted-foreground leading-relaxed">⬆ <strong className="text-foreground">Import</strong> — merges a backup into existing data. No data is overwritten.</p>
              </div>
            </div>
          )}
          <input ref={fileInputRef} type="file" accept=".zip" className="hidden" onChange={handleImport} />
        </div>

        <button type="button" aria-label="Previous" onClick={() => setCarouselIdx(safeIdx - 1)} disabled={!canPrev}
          className="shrink-0 flex items-center justify-center rounded-full border border-border bg-background text-muted-foreground hover:text-foreground hover:bg-accent transition-colors shadow-sm disabled:opacity-30 disabled:pointer-events-none"
          style={{ width: 20, height: 20 }}>
          <ChevronLeft className="h-3 w-3" />
        </button>

        <div style={{ flex: 1, minWidth: 0, overflow: "hidden" }}>
          <div className="flex" style={{ gap: GAP, transform: `translateX(-${safeIdx * (CARD_W + GAP)}px)`, transition: "transform 0.25s ease" }}>
            {PLATFORMS.map((p) => {
              const isRunning      = terminalSessions.has(p.id);
              const isCurrent      = terminalPlatform === p.id && isRunning;
              const isConfirming   = confirmingPlatform === p.id;
              const isOpenCode     = p.id === "open-code";
              const needsKey       = isOpenCode && openCodeReady === false;
              const isDisabled     = !p.active && !isOpenCode;
              const bridgeOffline  = bridgeStatus === "offline" && !isRunning;

              const btn = (
                <button
                  type="button"
                  style={{ width: CARD_W, flexShrink: 0, position: "relative" }}
                  onClick={() => {
                    if (bridgeOffline) return;
                    if (needsKey) { setOpenCodeDialog(true); return; }
                    handleCardClick(p.id);
                  }}
                  disabled={isDisabled}
                  className={`flex items-center justify-center gap-1.5 rounded-md border h-9 text-[11px] transition-all px-2 ${
                    bridgeOffline   ? "border-border text-muted-foreground/30 cursor-not-allowed opacity-40"
                    : needsKey      ? "border-destructive/50 bg-destructive/5 text-destructive/70 hover:bg-destructive/10 cursor-pointer"
                    : isDisabled    ? "border-border text-muted-foreground/30 cursor-not-allowed opacity-40"
                    : isConfirming  ? "border-orange-400 bg-orange-400/10 text-orange-400 font-medium"
                    : isCurrent     ? "border-primary bg-primary/10 text-primary font-medium"
                    : isRunning     ? "border-green-500/50 bg-green-500/5 text-green-600 dark:text-green-400"
                    : "border-border text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  {isConfirming ? (
                    <>
                      <span className="size-1.5 rounded-full bg-orange-400 animate-pulse shrink-0" />
                      <span>End session</span>
                      <span key={confirmingPlatform} style={{ position: "absolute", bottom: 4, left: 4, right: 4, height: 2, borderRadius: 1, transformOrigin: "left", animation: "countdown-shrink 2s linear forwards, countdown-color 2s linear forwards" }} />
                    </>
                  ) : needsKey ? (
                    <><span className="size-1.5 rounded-full bg-destructive shrink-0" /><span>{p.label}</span></>
                  ) : (
                    <><TerminalDot status={isRunning ? "connected" : terminalStatuses[p.id]} /><span>{p.label}</span></>
                  )}
                </button>
              );

              return (
                <React.Fragment key={p.id}>
                  {bridgeOffline ? (
                    <TooltipProvider delayDuration={0}>
                      <Tooltip>
                        <TooltipTrigger asChild>{btn}</TooltipTrigger>
                        <TooltipContent side="bottom" className="max-w-[200px] text-[11px] leading-relaxed" style={{ zIndex: 99999 }}>
                          Bridge is offline. Start the bridge server to use terminals:<br />
                          <span className="font-mono">node bridges/platforms/server.js</span>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  ) : btn}
                </React.Fragment>
              );
            })}

            {/* Coming soon cards */}
            {COMING_SOON.map((item) => (
              <TooltipProvider key={item.id} delayDuration={0}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div
                      style={{ width: CARD_W, flexShrink: 0 }}
                      className="flex flex-col items-center justify-center gap-0.5 rounded-md border border-dashed border-border h-9 text-[11px] text-muted-foreground/40 select-none px-2 cursor-help"
                    >
                      <span className="text-[9px] font-mono text-muted-foreground/30">{item.version}</span>
                      <span>{item.label}</span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="max-w-[240px] whitespace-pre-line text-[11px] leading-relaxed" style={{ zIndex: 99999 }}>
                    {item.tooltip}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ))}
          </div>
        </div>

        <button type="button" aria-label="Next" onClick={() => setCarouselIdx(safeIdx + 1)} disabled={!canNext}
          className="shrink-0 flex items-center justify-center rounded-full border border-border bg-background text-muted-foreground hover:text-foreground hover:bg-accent transition-colors shadow-sm disabled:opacity-30 disabled:pointer-events-none"
          style={{ width: 20, height: 20 }}>
          <ChevronRight className="h-3 w-3" />
        </button>
      </div>

      {/* ── Env editor panel ── */}
      {showEnvEditor && <EnvEditorPanel onClose={() => setShowEnvEditor(false)} />}

      {/* ── Media library panel ── */}
      {showMediaLibrary && <MediaLibraryPanel onClose={() => setShowMediaLibrary(false)} />}

      {/* ── DB browser panel ── */}
      {showDbBrowser && <DbBrowserPanel onClose={() => setShowDbBrowser(false)} />}

      {/* ── Info panel (README) ── */}
      {showInfo && (
        <div style={{ position: "absolute", top: CAROUSEL_H, left: 0, right: 0, bottom: FOOTER_H, zIndex: 10 }}
          className="bg-background overflow-y-auto p-5">
          {readmeContent === null ? (
            <div className="flex items-center justify-center h-full text-muted-foreground text-xs gap-2">
              <Loader2 size={14} className="animate-spin" />Loading README…
            </div>
          ) : (
            <div className="prose prose-sm prose-invert max-w-none text-[12px] leading-relaxed
              [&_h1]:text-base [&_h1]:font-bold [&_h1]:mb-3 [&_h1]:border-b [&_h1]:border-border [&_h1]:pb-1
              [&_h2]:text-sm [&_h2]:font-semibold [&_h2]:mt-4 [&_h2]:mb-2
              [&_h3]:text-xs [&_h3]:font-semibold [&_h3]:mt-3 [&_h3]:mb-1
              [&_p]:mb-2 [&_p]:text-muted-foreground
              [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-2
              [&_code]:bg-muted [&_code]:px-1 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-[11px] [&_code]:font-mono
              [&_pre]:bg-muted [&_pre]:p-3 [&_pre]:rounded-md [&_pre]:overflow-x-auto [&_pre]:text-[11px] [&_pre]:font-mono [&_pre]:mb-3
              [&_pre_code]:bg-transparent [&_pre_code]:p-0
              [&_ul]:list-disc [&_ul]:pl-4 [&_ul]:mb-2 [&_ul]:space-y-0.5
              [&_ol]:list-decimal [&_ol]:pl-4 [&_ol]:mb-2 [&_ol]:space-y-0.5
              [&_li]:text-muted-foreground
              [&_blockquote]:border-l-2 [&_blockquote]:border-border [&_blockquote]:pl-3 [&_blockquote]:text-muted-foreground [&_blockquote]:italic
              [&_table]:w-full [&_table]:text-[11px] [&_table]:border-collapse
              [&_th]:border [&_th]:border-border [&_th]:px-2 [&_th]:py-1 [&_th]:bg-muted [&_th]:font-medium [&_th]:text-left
              [&_td]:border [&_td]:border-border [&_td]:px-2 [&_td]:py-1 [&_td]:text-muted-foreground
              [&_hr]:border-border [&_hr]:my-3
              [&_img]:max-w-full [&_img]:rounded">
              <ReactMarkdown>{readmeContent}</ReactMarkdown>
            </div>
          )}
        </div>
      )}

      {/* ── Placeholder ── */}
      <div style={{ position: "absolute", top: CAROUSEL_H, left: 0, right: 0, bottom: FOOTER_H }} className="bg-zinc-950 flex flex-col items-center justify-center gap-4 select-none">
        <span style={{ fontSize: windowWidth < 600 ? "3rem" : "4.5rem", fontFamily: "'Geist', 'Inter', system-ui, sans-serif", lineHeight: 1, letterSpacing: "0.25em" }}>
          <Shimmer className="uppercase font-light" duration={5} spread={4}>Fractera</Shimmer>
        </span>
        <div className="flex flex-col items-center gap-2" style={{ paddingLeft: 64, paddingRight: 64 }}>
          <Shimmer className="text-sm font-mono text-center" duration={3} spread={3}>Select a terminal platform to begin</Shimmer>
          <Shimmer className="text-xs font-mono opacity-40 text-center" duration={4} spread={2}>Claude Code · Codex · Gemini CLI · Open Code · Qwen Code · Kimi Code</Shimmer>
        </div>
      </div>

      {/* ── Terminal panels ── */}
      {[...terminalSessions].map((platform) => (
        <div key={platform} style={{ position: "absolute", top: CAROUSEL_H, left: 0, right: 0, height: termH, display: platform === terminalPlatform ? "block" : "none" }} className="bg-zinc-950">
          <XtermTerminal wsUrl={PTY_URL} platform={platform} />
        </div>
      ))}

      {/* ── Footer ── */}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: FOOTER_H }} className="border-t border-border bg-background flex items-center gap-2 px-3">

        {/* Left: version + update badge */}
        <span className="flex-1 flex items-center gap-2 min-w-0">
          <span className="text-[10px] text-muted-foreground/50 select-none tracking-wide shrink-0">
            Fractera Lite {APP_VERSION}
          </span>
          {updateAvailable && (
            <TooltipProvider delayDuration={0}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button type="button" onClick={handleUpdate} disabled={updating}
                    className="inline-flex items-center gap-1 h-4 px-1.5 rounded text-[10px] bg-primary/10 text-primary hover:bg-primary/20 transition-colors font-medium shrink-0">
                    {updating ? <Loader2 size={9} className="animate-spin" /> : <RefreshCw size={9} />}
                    {updateCount} update{updateCount !== 1 ? "s" : ""}
                  </button>
                </TooltipTrigger>
                <TooltipContent side="top" className="text-[11px]" style={{ zIndex: 99999 }}>
                  Click to update Fractera Light
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </span>

        {/* Info button */}
        <button type="button" onClick={handleInfo}
          className={`inline-flex items-center gap-1 h-5 px-2 rounded border text-[10px] transition-colors ${showInfo ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:text-foreground hover:bg-muted"}`}>
          <Info size={10} />Info
        </button>

        {/* Go to Pro */}
        {PRO_URL && (
          <a href={PRO_URL} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-1 h-5 px-2 rounded border border-border text-[10px] text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
            <Zap size={10} />Pro
          </a>
        )}

        {/* Skills */}
        <a href={SKILLS_URL || "https://fractera.ai"} target="_blank" rel="noopener noreferrer"
          className="inline-flex items-center gap-1 h-5 px-2 rounded border border-border text-[10px] text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
          <Store size={10} />Skills
        </a>

        {/* GitHub */}
        {GITHUB_URL ? (
          <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer"
            className="size-[22px] rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
            <svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor" aria-hidden="true"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>
          </a>
        ) : (
          <button type="button" disabled className="size-[22px] rounded-full border border-border flex items-center justify-center text-muted-foreground/30 cursor-default">
            <svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor" aria-hidden="true"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>
          </button>
        )}
      </div>

      {openCodeDialog && (
        <OpenCodeKeyDialog
          onClose={() => setOpenCodeDialog(false)}
          onActivated={() => {
            setOpenCodeDialog(false);
            setTimeout(() => { setOpenCodeReady(true); onPlatformClick("open-code"); }, 3000);
          }}
        />
      )}

      {/* ── Update log panel ── */}
      {showUpdateLog && updateLog.length > 0 && (
        <div style={{ position: "absolute", bottom: FOOTER_H, left: 0, right: 0, zIndex: 9998 }}
          className="bg-zinc-950 border-t border-border p-3 flex flex-col gap-1 max-h-48 overflow-y-auto">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-medium text-muted-foreground">Update log</span>
            <button type="button" onClick={() => setShowUpdateLog(false)}
              className="text-[10px] text-muted-foreground hover:text-foreground transition-colors">close</button>
          </div>
          {updateLog.map((line, i) => (
            <span key={i} className="text-[11px] font-mono text-zinc-300 leading-relaxed">{line}</span>
          ))}
        </div>
      )}

    </div>
  );
}
