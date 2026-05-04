"use client";

import { useEffect } from "react";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";

export function LoggedInView({ email }: { email: string }) {
  useEffect(() => {
    // Если загружены как iframe — уведомляем родительский shell
    if (window.parent !== window) {
      window.parent.postMessage({ type: "AUTH_SUCCESS" }, "*");
    }
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="w-full max-w-sm flex flex-col gap-6 p-8 bg-background rounded-xl border shadow-sm">
        <div className="flex flex-col gap-1">
          <h1 className="text-xl font-semibold">Signed in</h1>
          <p className="text-sm text-muted-foreground">{email}</p>
        </div>
        <Button variant="outline" onClick={() => signOut({ callbackUrl: "/login" })}>
          Sign out
        </Button>
      </div>
    </div>
  );
}
