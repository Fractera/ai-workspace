"use client";

import { useEffect, useState } from "react";

const AUTH_URL  = process.env.NEXT_PUBLIC_AUTH_URL  ?? "http://localhost:3001";
const ADMIN_URL = process.env.NEXT_PUBLIC_ADMIN_URL ?? "http://localhost:3002";

type View = "loading" | "auth" | "admin";

export default function ShellPage() {
  const [view, setView] = useState<View>("loading");

  useEffect(() => {
    fetch(`${AUTH_URL}/api/session`, { credentials: "include" })
      .then((res) => {
        if (res.ok) setView("admin");
        else setView("auth");
      })
      .catch(() => setView("auth"));
  }, []);

  useEffect(() => {
    function onMessage(e: MessageEvent) {
      if (e.data?.type === "AUTH_SUCCESS") {
        setView("admin");
      }
    }
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  if (view === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <span className="text-xs font-mono text-muted-foreground animate-pulse">Loading…</span>
      </div>
    );
  }

  if (view === "auth") {
    return (
      <iframe
        src={AUTH_URL}
        className="w-full h-screen border-none"
        allow="same-origin"
      />
    );
  }

  return (
    <iframe
      src={ADMIN_URL}
      className="w-full h-screen border-none"
      allow="same-origin"
    />
  );
}
