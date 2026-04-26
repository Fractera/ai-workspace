"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

type Props = { isLoggedIn?: boolean; onClose?: () => void };

function GuestForm({ isLoggedIn = false, onClose }: Props) {
  const router = useRouter();
  const [checked, setChecked] = useState(false);

  const handleCheck = (value: boolean) => {
    setChecked(value);
    if (value) window.location.href = "/api/auth/guest?redirectUrl=/";
  };

  if (isLoggedIn) {
    return (
      <div className="w-full max-w-sm flex flex-col gap-6 p-8 bg-background rounded-xl border shadow-sm relative">
        {onClose && (
          <button type="button" onClick={onClose} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors">
            <X size={18} />
          </button>
        )}
        <div className="flex flex-col gap-1">
          <h1 className="text-xl font-semibold">You're already registered</h1>
          <p className="text-sm text-muted-foreground">Even more possibilities await registered users.</p>
        </div>
        <Button onClick={() => router.replace("/login")}>Sign in for more features</Button>
        <Button variant="outline" onClick={() => router.push("/")}>Back to app</Button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-sm flex flex-col gap-6 p-8 bg-background rounded-xl border shadow-sm relative">
      {onClose && (
        <button type="button" onClick={onClose} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors">
          <X size={18} />
        </button>
      )}
      <div className="flex flex-col gap-1">
        <h1 className="text-xl font-semibold">Allow a guest account?</h1>
        <p className="text-sm text-muted-foreground">We'll create an anonymous account to save your preferences across sessions.</p>
      </div>
      <div className="flex items-center gap-3">
        <Checkbox id="guest-consent" checked={checked} onCheckedChange={handleCheck} />
        <Label htmlFor="guest-consent" className="cursor-pointer">I agree — create my guest account</Label>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-border" />
        <span className="text-xs uppercase text-muted-foreground">or</span>
        <div className="flex-1 h-px bg-border" />
      </div>
      <Button onClick={() => router.replace("/login")}>Sign in</Button>
      <Button variant="outline" disabled>Register</Button>
    </div>
  );
}

export function GuestPlaceholder({ isLoggedIn = false, onClose }: Props) {
  return (
    <div className="h-full flex items-center justify-center p-8">
      <GuestForm isLoggedIn={isLoggedIn} onClose={onClose} />
    </div>
  );
}
