"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

function GuestForm() {
  const router = useRouter();
  const [checked, setChecked] = useState(false);

  const handleCheck = (value: boolean) => {
    setChecked(value);
    if (value) window.location.href = "/api/auth/guest?redirectUrl=/";
  };

  return (
    <div className="w-full max-w-sm flex flex-col gap-6 p-8 bg-background rounded-xl border shadow-sm">
      <div className="flex flex-col gap-1">
        <h1 className="text-xl font-semibold">Allow a guest account?</h1>
        <p className="text-sm text-muted-foreground">We'll create an anonymous account to save your preferences.</p>
      </div>
      <div className="flex items-center gap-3">
        <Checkbox id="guest-consent" checked={checked} onCheckedChange={handleCheck} />
        <Label htmlFor="guest-consent" className="cursor-pointer">I agree — create my guest account</Label>
      </div>
      <Button onClick={() => router.replace("/login")}>Sign in</Button>
    </div>
  );
}

export function GuestPlaceholder() {
  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <GuestForm />
    </div>
  );
}
