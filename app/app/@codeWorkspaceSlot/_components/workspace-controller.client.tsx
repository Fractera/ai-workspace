"use client";

import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { Code2, CircleUserRound } from "lucide-react";
import { useRouter } from "next/navigation";
import { CodingWindow } from "./coding-window.client";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import type { Platform } from "./coding-window/platforms";

export function WorkspaceController() {
  const { data: session, status } = useSession();
  const [open, setOpen]           = useState(false);
  const [isMobile]                = useState(() => typeof window !== "undefined" && window.innerWidth < 768);
  const [terminalPlatform, setTerminalPlatform] = useState<Platform>("claude-code");
  const [terminalSessions, setTerminalSessions] = useState<Set<Platform>>(new Set());
  const router = useRouter();
  const roles = (session?.user as { roles?: string[] })?.roles ?? [];
  const isArchitect = roles.includes("architect");
  const isVirtualArchitect = session?.user?.id === "virtual-architect";

  useEffect(() => {
    const onOpen  = () => setOpen(true);
    const onClose = () => setOpen(false);
    window.addEventListener("fractera:coding-window:open",  onOpen);
    window.addEventListener("fractera:coding-window:close", onClose);
    return () => {
      window.removeEventListener("fractera:coding-window:open",  onOpen);
      window.removeEventListener("fractera:coding-window:close", onClose);
    };
  }, []);

  function handlePlatformClick(platformId: Platform) {
    if (terminalSessions.has(platformId)) {
      setTerminalPlatform(platformId);
    } else {
      setTerminalSessions(prev => new Set(prev).add(platformId));
      setTerminalPlatform(platformId);
    }
  }

  function handleTerminalClose(platformId: Platform) {
    setTerminalSessions(prev => {
      const next = new Set(prev);
      next.delete(platformId);
      if (platformId === terminalPlatform && next.size > 0) {
        setTerminalPlatform([...next][0]);
      }
      return next;
    });
  }

  if (status === "loading") return null;

  return (
    <div style={{ position: "fixed", zIndex: 99998, pointerEvents: "none", inset: 0 }}>
      <div className="absolute right-6 top-2 sm:top-6 flex items-center gap-2" style={{ pointerEvents: "auto" }}>

        {session?.user ? (
          <Popover>
            <PopoverTrigger asChild>
              <button
                type="button"
                className="inline-flex items-center gap-1.5 h-8 text-xs px-3 rounded-md border border-border bg-background text-foreground hover:bg-muted font-medium transition-colors shadow-md dark:border-white/20 dark:shadow-none"
              >
                <CircleUserRound className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Account</span>
              </button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-56 p-3 flex flex-col gap-2" style={{ zIndex: 100000 }}>
              <p className="text-xs font-medium text-foreground truncate">{session.user.email}</p>
              <div className="h-px bg-border" />
              <div className="flex flex-col gap-0.5">
                <p className="text-[10px] text-muted-foreground px-1 mb-0.5">Roles</p>
                {roles.map((role) => (
                  <span key={role} className="text-xs text-foreground font-mono px-1">{role}</span>
                ))}
              </div>
              <div className="h-px bg-border" />
              {isVirtualArchitect ? (
                <Button variant="default" size="sm" className="w-full h-8 text-xs" onClick={() => router.push("/register")}>
                  Register account
                </Button>
              ) : (
                <Button variant="outline" size="sm" className="w-full h-8 text-xs" onClick={() => signOut({ callbackUrl: "/login" })}>
                  Sign out
                </Button>
              )}
            </PopoverContent>
          </Popover>
        ) : (
          <button
            type="button"
            onClick={() => router.push("/login")}
            className="inline-flex items-center gap-1.5 h-8 text-xs px-3 rounded-md border border-border bg-background text-foreground hover:bg-muted font-medium transition-colors shadow-md dark:border-white/20 dark:shadow-none"
          >
            <CircleUserRound className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Sign in</span>
          </button>
        )}

        {isArchitect && (
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="inline-flex items-center gap-1.5 h-8 text-xs px-3 rounded-md border border-primary bg-primary text-primary-foreground hover:bg-primary/90 font-medium transition-colors shadow-md"
          >
            <Code2 className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Start Coding</span>
          </button>
        )}
      </div>

      {(isMobile || open || terminalSessions.size > 0) && (
        <CodingWindow
          terminalPlatform={terminalPlatform}
          terminalSessions={terminalSessions}
          onPlatformClick={handlePlatformClick}
          onTerminalClose={handleTerminalClose}
          onClose={() => setOpen(false)}
          visible={open}
        />
      )}
    </div>
  );
}
